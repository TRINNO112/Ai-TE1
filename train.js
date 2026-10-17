#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════╗
 * ║   AI Flappy Bird — Terminal Trainer                 ║
 * ║   Runs training in the background at insane speeds  ║
 * ║   No browser needed! Auto-saves best brain as JSON  ║
 * ╚══════════════════════════════════════════════════════╝
 * 
 * Usage:
 *   node train.js                     (default: 100x speed)
 *   node train.js --speed 500         (500x speed)
 *   node train.js --import brain.json (continue from saved brain)
 *   node train.js --generations 1000  (stop after 1000 generations)
 *   node train.js --no-visual         (pure stats, even faster)
 */

const fs = require('fs');
const path = require('path');

// ==================== PARSE CLI ARGS ====================
const args = process.argv.slice(2);
function getArg(name, defaultVal) {
    const idx = args.indexOf(`--${name}`);
    if (idx !== -1 && args[idx + 1]) return args[idx + 1];
    return defaultVal;
}
const SPEED = parseInt(getArg('speed', '100'));
const MAX_GENERATIONS = parseInt(getArg('generations', '0')); // 0 = infinite
const IMPORT_FILE = getArg('import', null);
const VISUAL = !args.includes('--no-visual');
const POPULATION_SIZE = parseInt(getArg('population', '150'));
const ARCH = getArg('arch', 'large'); // small, medium, large, xlarge

// ==================== NEURAL NETWORK (same as browser version) ====================
class NeuralNetwork {
    constructor(layers) {
        this.layers = layers;
        this.weights = [];
        this.biases = [];

        for (let i = 0; i < layers.length - 1; i++) {
            const scale = Math.sqrt(2 / (layers[i] + layers[i + 1]));
            const layerWeights = [];
            for (let j = 0; j < layers[i + 1]; j++) {
                const neuronWeights = [];
                for (let k = 0; k < layers[i]; k++) {
                    neuronWeights.push((Math.random() * 2 - 1) * scale);
                }
                layerWeights.push(neuronWeights);
            }
            this.weights.push(layerWeights);

            const layerBiases = [];
            for (let j = 0; j < layers[i + 1]; j++) {
                layerBiases.push((Math.random() * 2 - 1) * scale);
            }
            this.biases.push(layerBiases);
        }
    }

    sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); }
    relu(x) { return Math.max(0, x); }

    predict(inputs) {
        let current = inputs;
        for (let i = 0; i < this.weights.length; i++) {
            const next = [];
            for (let j = 0; j < this.weights[i].length; j++) {
                let sum = this.biases[i][j];
                for (let k = 0; k < current.length; k++) {
                    sum += current[k] * this.weights[i][j][k];
                }
                next.push(i === this.weights.length - 1 ? this.sigmoid(sum) : this.relu(sum));
            }
            current = next;
        }
        return current;
    }

    copy() {
        const nn = new NeuralNetwork(this.layers.slice());
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    nn.weights[i][j][k] = this.weights[i][j][k];
                }
                nn.biases[i][j] = this.biases[i][j];
            }
        }
        return nn;
    }

    mutate(rate = 0.15, strength = 0.5) {
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    if (Math.random() < rate) {
                        this.weights[i][j][k] += (Math.random() * 2 - 1) * strength;
                    }
                }
                if (Math.random() < rate) {
                    this.biases[i][j] += (Math.random() * 2 - 1) * strength;
                }
            }
        }
    }

    getParameterCount() {
        let count = 0;
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) count += this.weights[i][j].length;
            count += this.biases[i].length;
        }
        return count;
    }

    toJSON() {
        return {
            architecture: this.layers.slice(),
            parameterCount: this.getParameterCount(),
            weights: this.weights.map((layer, li) =>
                layer.map((neuron, ni) =>
                    neuron.map((w, wi) => ({ layer: li, fromNeuron: wi, toNeuron: ni, value: Math.round(w * 10000) / 10000 }))
                )
            ).flat(2),
            biases: this.biases.map((layer, li) =>
                layer.map((b, ni) => ({ layer: li + 1, neuron: ni, value: Math.round(b * 10000) / 10000 }))
            ).flat()
        };
    }

    static fromJSON(data) {
        const nn = new NeuralNetwork(data.architecture);
        for (const w of data.weights) nn.weights[w.layer][w.toNeuron][w.fromNeuron] = w.value;
        for (const b of data.biases) nn.biases[b.layer - 1][b.neuron] = b.value;
        return nn;
    }
}

// ==================== GAME SIMULATION (headless, no rendering) ====================
const DIFFICULTY = {
    variableSpeed: { startScore: 5, baseSpeed: 2.5, maxSpeed: 5.0, rampRate: 0.08 },
    movingPipes: { startScore: 8, chance: 0.4, speed: 0.8, range: 40 },
    shrinkingGaps: { startScore: 10, baseGap: 140, minGap: 90, shrinkRate: 2 },
    windZones: { startScore: 15, chance: 0.3, force: 0.35, width: 80 },
    doublePipes: { startScore: 20, chance: 0.3, spacing: 120 }
};

class HeadlessBird {
    constructor(brain, id) {
        this.x = 80; this.y = 300; this.id = id;
        this.brain = brain; this.velocity = 0;
        this.alive = true; this.fitness = 0;
        this.score = 0; this.framesSurvived = 0;
        this.flaps = 0; 
        this.currentWind = 0;
    }

    think(pipeData) {
        if (!this.alive) return;
        const inputs = [
            this.y / 600, this.velocity / 10, pipeData.distance / 400,
            pipeData.topPipeBottom / 600, pipeData.bottomPipeTop / 600,
            (pipeData.pipeMovement || 0) / 2, (this.currentWind || 0),
            (pipeData.secondTopPipeBottom || 300) / 600,
            (pipeData.secondBottomPipeTop || 300) / 600
        ];
        const output = this.brain.predict(inputs);
        if (output[0] > 0.5) {
            this.velocity = -8;
            this.flaps++;
        }
    }

    update(pipeData) {
        if (!this.alive) return;
        this.velocity += 0.5 + this.currentWind;
        this.velocity = Math.min(Math.max(this.velocity, -12), 12);
        this.y += this.velocity;
        this.framesSurvived++;
        
        // Match reward system in game.js
        this.fitness = this.framesSurvived + this.score * 1000;
        if (pipeData && pipeData.topPipeBottom) {
            const gapCenter = (pipeData.topPipeBottom + pipeData.bottomPipeTop) / 2;
            const distFromCenter = Math.abs(this.y - gapCenter);
            this.fitness += Math.max(0, 1 - (distFromCenter / 300)) * 2;
        }
        this.fitness -= this.flaps * 5;
        if (this.y < 0 || this.y > 600) this.fitness -= 5000;
    }
}

class HeadlessPipe {
    constructor(x, gapSize, oscillating) {
        this.x = x; this.width = 52; this.passed = false;
        const minGapY = 80; const maxGapY = 600 - gapSize - 80;
        this.gapY = minGapY + Math.random() * (maxGapY - minGapY);
        this.gapSize = gapSize; this.baseGapY = this.gapY;
        this.oscillating = oscillating; this.movePhase = Math.random() * Math.PI * 2;
        this.movementDir = 0; this.isDouble = false;
        this.topHeight = this.gapY; this.bottomY = this.gapY + this.gapSize;
    }

    update(speed) {
        this.x -= speed;
        if (this.oscillating) {
            this.movePhase += 0.03;
            const offset = Math.sin(this.movePhase) * 40;
            this.movementDir = Math.cos(this.movePhase);
            this.gapY = Math.max(60, Math.min(600 - this.gapSize - 60, this.baseGapY + offset));
            this.topHeight = this.gapY; this.bottomY = this.gapY + this.gapSize;
        }
    }

    collidesWith(bird) {
        if (bird.x + 12 > this.x && bird.x - 12 < this.x + this.width) {
            if (bird.y - 12 < this.topHeight || bird.y + 12 > this.bottomY) return true;
        }
        return false;
    }
}

class HeadlessWindZone {
    constructor(x, force) {
        this.x = x; this.width = 80; this.force = force;
    }
    update(speed) { this.x -= speed; }
    affectsBird(bird) { return bird.x + 12 > this.x && bird.x - 12 < this.x + this.width; }
    isOffScreen() { return this.x + this.width < 0; }
}

function runGeneration(brains) {
    const birds = brains.map((b, i) => new HeadlessBird(b, i));
    let pipes = []; let windZones = [];
    let frameCount = 0; let maxScore = 0;
    let currentSpeed = 2.5; let currentGap = 140;

    while (true) {
        frameCount++;
        // Update max score
        for (const bird of birds) {
            if (bird.alive && bird.score > maxScore) maxScore = bird.score;
        }

        // Difficulty
        if (maxScore >= 5) currentSpeed = Math.min(2.5 + (maxScore - 5) * 0.08, 5.0);
        if (maxScore >= 10) currentGap = Math.max(140 - (maxScore - 10) * 2, 90);

        // Spawn pipes
        if (frameCount % 90 === 0) {
            const oscillating = maxScore >= 8 && Math.random() < 0.4;
            pipes.push(new HeadlessPipe(400, currentGap, oscillating));
            if (maxScore >= 20 && Math.random() < 0.3) {
                const p2 = new HeadlessPipe(400 + 120, currentGap, oscillating && Math.random() < 0.3);
                p2.isDouble = true;
                pipes.push(p2);
            }
            if (maxScore >= 15 && Math.random() < 0.3) {
                windZones.push(new HeadlessWindZone(400 + Math.random() * 100,
                    (Math.random() < 0.5 ? -1 : 1) * 0.35));
            }
        }

        // Update pipes & wind
        for (const p of pipes) p.update(currentSpeed);
        pipes = pipes.filter(p => p.x + p.width > 0);
        for (const w of windZones) w.update(currentSpeed);
        windZones = windZones.filter(w => !w.isOffScreen());

        // Next pipe data
        let firstPipe = null, secondPipe = null;
        for (const p of pipes) {
            if (p.x + p.width > 60) {
                if (!firstPipe) firstPipe = p;
                else if (!secondPipe) { secondPipe = p; break; }
            }
        }
        const pipeData = firstPipe ? {
            distance: firstPipe.x - 80, topPipeBottom: firstPipe.topHeight,
            bottomPipeTop: firstPipe.bottomY, pipeMovement: firstPipe.oscillating ? firstPipe.movementDir : 0,
            secondTopPipeBottom: secondPipe ? secondPipe.topHeight : firstPipe.topHeight,
            secondBottomPipeTop: secondPipe ? secondPipe.bottomY : firstPipe.bottomY
        } : { distance: 400, topPipeBottom: 230, bottomPipeTop: 370, pipeMovement: 0, secondTopPipeBottom: 230, secondBottomPipeTop: 370 };

        // Update birds
        let aliveCount = 0;
        for (const bird of birds) {
            if (!bird.alive) continue;
            bird.currentWind = 0;
            for (const w of windZones) { if (w.affectsBird(bird)) { bird.currentWind = w.force; break; } }
            bird.think(pipeData);
            bird.update(pipeData);
            if (bird.y < -12 || bird.y > 612) { bird.alive = false; continue; }
            for (const p of pipes) { if (p.collidesWith(bird)) { bird.alive = false; break; } }
            for (const p of pipes) {
                if (!p.passed && p.x + p.width < bird.x) { bird.score++; p.passed = true; }
            }
            if (bird.alive) aliveCount++;
        }

        if (aliveCount === 0) break;

        // Safety: prevent truly infinite runs (cap at 60000 frames ~ 5 min equivalent)
        // This allows AI to score well over 100+ before being capped
        if (frameCount > 60000) {
            for (const bird of birds) bird.alive = false;
            break;
        }
    }

    return birds.map(b => ({ brain: b.brain, fitness: b.fitness, score: b.score, framesSurvived: b.framesSurvived }));
}

// ==================== GENETIC ALGORITHM ====================
class GA {
    constructor(popSize) {
        this.populationSize = popSize;
        this.generation = 0; this.bestFitnessEver = 0;
        this.bestScoreEver = 0; this.bestBrainEver = null;
        this.log = [];
    }

    evolve(population) {
        this.generation++;
        population.sort((a, b) => b.fitness - a.fitness);
        const fitnesses = population.map(p => p.fitness);
        const scores = population.map(p => p.score);
        const stats = {
            gen: this.generation, bestFitness: fitnesses[0],
            avgFitness: Math.round(fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length),
            bestScore: scores[0],
            avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10,
            newRecord: false
        };

        if (fitnesses[0] > this.bestFitnessEver) {
            this.bestFitnessEver = fitnesses[0];
            this.bestBrainEver = population[0].brain.copy();
            stats.newRecord = true;
        }
        if (scores[0] > this.bestScoreEver) this.bestScoreEver = scores[0];
        this.log.push(stats);

        const newBrains = [];
        const eliteCount = Math.max(1, Math.floor(this.populationSize * 0.05));
        for (let i = 0; i < eliteCount; i++) newBrains.push(population[i].brain.copy());

        while (newBrains.length < this.populationSize) {
            const parent = this.selectParent(population);
            let child;
            if (Math.random() < 0.7) {
                const parent2 = this.selectParent(population);
                child = this.crossover(parent.brain, parent2.brain);
            } else {
                child = parent.brain.copy();
            }
            child.mutate(0.15, 0.5);
            newBrains.push(child);
        }
        return { brains: newBrains, stats };
    }

    selectParent(pop) {
        const total = pop.length * (pop.length + 1) / 2;
        let r = Math.random() * total;
        for (let i = 0; i < pop.length; i++) { r -= (pop.length - i); if (r <= 0) return pop[i]; }
        return pop[0];
    }

    crossover(b1, b2) {
        const child = b1.copy();
        for (let i = 0; i < child.weights.length; i++) {
            for (let j = 0; j < child.weights[i].length; j++) {
                if (Math.random() < 0.5) {
                    for (let k = 0; k < child.weights[i][j].length; k++) child.weights[i][j][k] = b2.weights[i][j][k];
                    child.biases[i][j] = b2.biases[i][j];
                }
            }
        }
        return child;
    }
}

// ==================== TERMINAL UI ====================
const ESC = '\x1b';
function moveCursor(row, col) { return `${ESC}[${row};${col}H`; }
function clearScreen() { process.stdout.write(`${ESC}[2J${ESC}[H`); }
function color(text, code) { return `${ESC}[${code}m${text}${ESC}[0m`; }
function bold(text) { return color(text, '1'); }
function green(text) { return color(text, '32'); }
function red(text) { return color(text, '31'); }
function yellow(text) { return color(text, '33'); }
function blue(text) { return color(text, '34'); }
function cyan(text) { return color(text, '36'); }
function gray(text) { return color(text, '90'); }
function gold(text) { return color(text, '93'); }
function bgGreen(text) { return color(text, '42;30'); }
function bgRed(text) { return color(text, '41;37'); }

function progressBar(value, max, width = 30) {
    const filled = Math.round((value / Math.max(max, 1)) * width);
    const bar = '█'.repeat(Math.min(filled, width)) + '░'.repeat(Math.max(0, width - filled));
    return bar;
}

function drawFitnessGraph(log, width = 50, height = 10) {
    if (log.length < 2) return ['', gray('  Graph will appear after 2 generations...')];

    const recent = log.slice(-width);
    const max = Math.max(...recent.map(g => g.bestFitness), 1);
    const lines = [];

    for (let row = 0; row < height; row++) {
        const threshold = max * (1 - row / height);
        let line = gray(String(Math.round(threshold)).padStart(6)) + ' │';
        for (const g of recent) {
            if (g.bestFitness >= threshold) {
                line += g.newRecord ? gold('█') : green('▓');
            } else if (g.avgFitness >= threshold) {
                line += blue('▒');
            } else {
                line += ' ';
            }
        }
        lines.push(line);
    }
    lines.push('       └' + '─'.repeat(recent.length));
    lines.push('        ' + gray('Generations →  ') + green('▓ Best  ') + blue('▒ Avg  ') + gold('█ Record'));
    return lines;
}

function renderTerminalUI(ga, currentStats, startTime) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const genPerSec = (ga.generation / Math.max(elapsed, 1)).toFixed(1);

    let output = '';

    // Header
    output += '\n';
    output += bold(cyan('  ╔══════════════════════════════════════════════════════════╗')) + '\n';
    output += bold(cyan('  ║')) + bold('   🧠 AI Flappy Bird — Terminal Trainer                 ') + bold(cyan('║')) + '\n';
    output += bold(cyan('  ║')) + gray('   Neuroevolution running at ') + gold(`${SPEED}x speed`) + gray('                   ') + bold(cyan('║')) + '\n';
    output += bold(cyan('  ╚══════════════════════════════════════════════════════════╝')) + '\n';
    output += '\n';

    // Stats
    output += bold('  📊 Training Stats') + '\n';
    output += '  ┌─────────────────────┬─────────────────────┐\n';
    output += `  │ Generation: ${bold(String(ga.generation).padEnd(8))}│ Time: ${gray(elapsed + 's').padEnd(20)}│\n`;
    output += `  │ Gen/sec:   ${bold(cyan(genPerSec).padEnd(17))}│ Population: ${gray(String(POPULATION_SIZE)).padEnd(9)}│\n`;
    output += '  ├─────────────────────┼─────────────────────┤\n';

    if (currentStats) {
        const bestFit = String(currentStats.bestFitness).padEnd(8);
        const avgFit = String(currentStats.avgFitness).padEnd(8);
        const bestScore = String(currentStats.bestScore).padEnd(8);
        output += `  │ Best Fitness: ${green(bestFit)}│ Avg Fitness: ${blue(avgFit)}│\n`;
        output += `  │ Best Score:   ${gold(bestScore)}│ Avg Score:   ${gray(String(currentStats.avgScore).padEnd(8))}│\n`;
    }

    output += '  ├─────────────────────┴─────────────────────┤\n';
    output += `  │ 🏆 All-Time Best Fitness: ${bold(gold(String(ga.bestFitnessEver).padEnd(16)))}│\n`;
    output += `  │ 🏆 All-Time Best Score:   ${bold(gold(String(ga.bestScoreEver).padEnd(16)))}│\n`;
    output += '  └───────────────────────────────────────────┘\n';

    // Fitness bar
    output += '\n';
    if (currentStats) {
        const maxFit = Math.max(ga.bestFitnessEver, 1);
        output += `  Fitness: ${green(progressBar(currentStats.bestFitness, maxFit))} ${currentStats.bestFitness}\n`;
        output += `  Average: ${blue(progressBar(currentStats.avgFitness, maxFit))} ${currentStats.avgFitness}\n`;
    }

    // Graph
    output += '\n';
    output += bold('  📈 Fitness Over Generations') + '\n';
    const graphLines = drawFitnessGraph(ga.log);
    for (const line of graphLines) output += '  ' + line + '\n';

    // Recent generations
    output += '\n';
    output += bold('  📋 Recent Generations') + '\n';
    output += gray('  Gen   │ Best Fit │ Avg Fit  │ Score │ Record') + '\n';
    output += gray('  ──────┼──────────┼──────────┼───────┼───────') + '\n';
    const recent = ga.log.slice(-8);
    for (const g of recent) {
        const marker = g.newRecord ? gold(' 🌟 NEW!') : '';
        output += `  ${String(g.gen).padStart(5)} │ ${String(g.bestFitness).padStart(8)} │ ${String(g.avgFitness).padStart(8)} │ ${String(g.bestScore).padStart(5)} │${marker}\n`;
    }

    // Controls
    output += '\n';
    output += gray('  Press Ctrl+C to stop. Brain auto-saves every 10 generations.') + '\n';
    output += gray(`  Save location: ${path.resolve('best-brain.json')}`) + '\n';

    clearScreen();
    process.stdout.write(output);
}

// ==================== SAVE/LOAD ====================
function saveBrain(ga, architecture) {
    const data = {
        exportDate: new Date().toISOString(),
        project: 'AI Flappy Bird — Neuroevolution',
        generation: ga.generation,
        bestFitness: ga.bestFitnessEver,
        architecture: architecture,
        brain: ga.bestBrainEver.toJSON(),
        trainingConfig: {
            populationSize: POPULATION_SIZE,
            elitismRate: 0.05,
            mutationRate: 0.15,
            mutationStrength: 0.5
        }
    };
    fs.writeFileSync('best-brain.json', JSON.stringify(data, null, 2));
}

function loadBrain(filepath) {
    try {
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        if (data.brain) {
            return { brain: NeuralNetwork.fromJSON(data.brain), architecture: data.brain.architecture || data.architecture };
        }
    } catch (e) {
        console.error(`Error loading brain: ${e.message}`);
    }
    return null;
}

// ==================== MAIN TRAINING LOOP ====================
async function main() {
    // Select architecture
    const archMap = {
        'small': [9, 8, 1],
        'medium': [9, 12, 12, 1],
        'large': [9, 24, 24, 1],
        'xlarge': [9, 32, 32, 1]
    };
    let architecture = archMap[ARCH] || archMap['large'];
    let ga_instance = new GA(POPULATION_SIZE);
    let startTime = Date.now();

    // Import brain if specified
    if (IMPORT_FILE) {
        const loaded = loadBrain(IMPORT_FILE);
        if (loaded) {
            architecture = loaded.architecture;
            ga_instance.bestBrainEver = loaded.brain;
            console.log(green(`✅ Imported brain: [${architecture.join('→')}]`));
        }
    }

    console.log(bold(cyan('\n  🧠 AI Flappy Bird — Terminal Trainer\n')));
    console.log(`  Architecture: [${architecture.join(' → ')}]`);
    console.log(`  Population: ${POPULATION_SIZE}`);
    console.log(`  Speed: ${SPEED}x`);
    console.log(`  Max Generations: ${MAX_GENERATIONS || '∞'}`);
    if (IMPORT_FILE) console.log(`  Imported from: ${IMPORT_FILE}`);
    console.log(gray('\n  Starting in 2 seconds...\n'));

    await new Promise(r => setTimeout(r, 2000));

    // Create initial population
    let brains = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        if (ga_instance.bestBrainEver && i < Math.floor(POPULATION_SIZE * 0.2)) {
            // Seed 20% of population with imported brain copies (mutated)
            const child = ga_instance.bestBrainEver.copy();
            if (i > 0) child.mutate(0.1 + (i * 0.01), 0.3 + (i * 0.02));
            brains.push(child);
        } else {
            brains.push(new NeuralNetwork(architecture));
        }
    }

    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
        clearScreen();
        console.log(bold('\n  🛑 Training stopped!\n'));
        console.log(`  Generations trained: ${ga_instance.generation}`);
        console.log(`  Best fitness ever: ${ga_instance.bestFitnessEver}`);
        console.log(`  Best score ever: ${ga_instance.bestScoreEver}`);
        if (ga_instance.bestBrainEver) {
            saveBrain(ga_instance, architecture);
            console.log(green(`\n  ✅ Brain saved to: ${path.resolve('best-brain.json')}`));
            console.log(gray('  Import in browser: Click "Import Brain" and select best-brain.json'));
        }
        console.log('');
        process.exit(0);
    });

    // Training loop
    while (true) {
        // Run generation (headless — pure computation, no rendering)
        const results = runGeneration(brains);
        const evolved = ga_instance.evolve(results);
        brains = evolved.brains;

        // Render terminal UI
        if (VISUAL && ga_instance.generation % Math.max(1, Math.floor(SPEED / 50)) === 0) {
            renderTerminalUI(ga_instance, evolved.stats, startTime);
        } else if (!VISUAL && ga_instance.generation % 100 === 0) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
            console.log(`Gen ${ga_instance.generation} | Best: ${evolved.stats.bestFitness} | Score: ${evolved.stats.bestScore} | Best Ever: ${ga_instance.bestFitnessEver} | ${elapsed}s`);
        }

        // Auto-save every 10 generations
        if (ga_instance.generation % 10 === 0 && ga_instance.bestBrainEver) {
            saveBrain(ga_instance, architecture);
        }

        // Check max generations
        if (MAX_GENERATIONS > 0 && ga_instance.generation >= MAX_GENERATIONS) {
            clearScreen();
            console.log(bold(green('\n  ✅ Training complete!\n')));
            console.log(`  Generations: ${ga_instance.generation}`);
            console.log(`  Best fitness: ${ga_instance.bestFitnessEver}`);
            console.log(`  Best score: ${ga_instance.bestScoreEver}`);
            if (ga_instance.bestBrainEver) {
                saveBrain(ga_instance, architecture);
                console.log(green(`\n  Brain saved to: ${path.resolve('best-brain.json')}`));
            }
            console.log('');
            break;
        }

        // Small yield to prevent event loop starvation
        if (ga_instance.generation % 5 === 0) await new Promise(r => setImmediate(r));
    }
}

main().catch(console.error);
