/**
 * Main Controller — Wires everything together
 * 
 * Manages the training loop:
 * 1. Create generation of birds with neural network brains
 * 2. Run the game
 * 3. Evaluate fitness
 * 4. Evolve (select, crossover, mutate)
 * 5. Repeat
 */

// ==================== GLOBALS ====================
let game, ga, viz;
let trainingActive = false;
let animationId = null;
let networkArchitecture = [9, 12, 12, 1]; // Medium default
let simulationSpeed = 1;
let showAllBirds = true;
let turboLiveView = false;
let autoTune = true;
let antigravityActive = false;
let turboGensThisSession = 0;
let turboStartTime = 0;
let turboTimeoutId = null; 

// ==================== INITIALIZATION ====================
function init() {
    try {
        // Destroy existing canvas
        const oldCanvas = document.getElementById('gameCanvas');
        if (oldCanvas) oldCanvas.remove();
        
        // Create fresh canvas with debug features
        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 400;
        canvas.height = 600;
        canvas.style.border = '2px solid red';
        document.querySelector('.game-container').appendChild(canvas);
        
        // Force context creation
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            canvas.innerHTML = '<p style="color:white;font-size:20px">CANVAS ERROR</p>';
            return;
        }
        
        // Initialize with debug visuals
        game = new Game(canvas);
        ctx.fillStyle = 'lime';
        ctx.fillRect(0, 0, 50, 50); // Debug marker
        console.log('DEBUG: Canvas initialized with red border');
        
        // Immediate test draw
        game.birds = [new Bird(80, 300, new NeuralNetwork([9,12,12,1]), 0)];
        game.draw();
        console.log('Game initialized with canvas:', canvas.width, 'x', canvas.height);
        console.log('Game initialized with canvas:', canvas.width, 'x', canvas.height);
        ga = new GeneticAlgorithm(200, 0.05, 0.15, 0.5);
        viz = new Visualization();

        // Clear old incompatible localStorage (from 5-input version)
        const saved = localStorage.getItem('flappyAI_bestBrain');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.brain && data.brain.architecture && data.brain.architecture[0] !== 9) {
                    console.log('🧹 Clearing old incompatible brain data (was 5-input, now 9-input)');
                    localStorage.removeItem('flappyAI_bestBrain');
                }
            } catch (e) {
                localStorage.removeItem('flappyAI_bestBrain');
            }
        }

        // Set up UI controls
        setupControls();
        updateStatsDisplay(null);

        // Check for saved brain in localStorage
        loadSavedState();

// Initial render
console.log('Initializing canvas:', canvas.width, 'x', canvas.height);
game.draw();
console.log('Initial birds:', game.birds.length);
    } catch (err) {
        console.error('Initialization error:', err);
        alert('Error starting game: ' + err.message + '\n\nTry clearing localStorage: open DevTools (F12) → Console → type localStorage.clear()');
    }
}

function setupControls() {
    // Start/Stop button
    document.getElementById('btnStartStop').addEventListener('click', toggleTraining);

    // Reset button
    document.getElementById('btnReset').addEventListener('click', resetTraining);

    // Speed slider
    const speedSlider = document.getElementById('speedSlider');
    const speedLabel = document.getElementById('speedLabel');
    speedSlider.addEventListener('input', () => {
        simulationSpeed = parseInt(speedSlider.value);
        speedLabel.textContent = `${simulationSpeed}x`;
    });

    // Elitism slider
    const elitismSlider = document.getElementById('elitismSlider');
    const elitismLabel = document.getElementById('elitismLabel');
    elitismSlider.addEventListener('input', () => {
        const val = parseInt(elitismSlider.value) / 100;
        ga.elitismRate = val;
        elitismLabel.textContent = `${elitismSlider.value}%`;
    });

    // Mutation slider
    const mutationSlider = document.getElementById('mutationSlider');
    const mutationLabel = document.getElementById('mutationLabel');
    mutationSlider.addEventListener('input', () => {
        const val = parseInt(mutationSlider.value) / 100;
        ga.mutationRate = val;
        mutationLabel.textContent = `${mutationSlider.value}%`;
    });

    // Network architecture dropdown
    document.getElementById('networkSize').addEventListener('change', (e) => {
        const val = e.target.value;
        switch (val) {
            case 'small': networkArchitecture = [9, 8, 1]; break;
            case 'medium': networkArchitecture = [9, 12, 12, 1]; break;
            case 'large': networkArchitecture = [9, 20, 20, 1]; break;
            case 'xlarge': networkArchitecture = [9, 32, 32, 1]; break;
        }
        document.getElementById('archDisplay').textContent = `[${networkArchitecture.join(' → ')}]`;
    });

    // Show all birds toggle
    document.getElementById('showAllBirds').addEventListener('change', (e) => {
        showAllBirds = e.target.checked;
    });

    // Simple mode toggle
    document.getElementById('simpleMode').addEventListener('change', (e) => {
        game.simpleMode = e.target.checked;
    });

    // Turbo live view toggle
    document.getElementById('turboLiveView').addEventListener('change', (e) => {
        turboLiveView = e.target.checked;
    });

    // Turbo mode toggle
    document.getElementById('turboMode').addEventListener('change', (e) => {
        turboMode = e.target.checked;
        const display = document.getElementById('turboDisplay');
        const canvas = document.getElementById('gameCanvas');
        const liveViewBtn = document.getElementById('turboLiveGroup');
        
        if (turboMode) {
            display.classList.remove('hidden');
            liveViewBtn.classList.remove('hidden');
            canvas.style.visibility = 'hidden';
            turboGensThisSession = 0;
            turboStartTime = Date.now();
            if (trainingActive) {
                // Kick off turbo loop
                setTimeout(turboLoop, 0);
            }
        } else {
            display.classList.add('hidden');
            liveViewBtn.classList.add('hidden');
            canvas.style.visibility = 'visible';
        }
    });

    // Auto-tune toggle
    document.getElementById('autoTune').addEventListener('change', (e) => {
        autoTune = e.target.checked;
    });

    // Antigravity Play button
    document.getElementById('btnAntigravityPlay').addEventListener('click', () => {
        // Stop training if active
        stopTraining();
        
        antigravityActive = true;
        
        // UI Adjustments for Antigravity Mode
        document.getElementById('networkSize').disabled = true;
        document.querySelector('.tab-bar').style.opacity = '0.3';
        document.querySelector('.tab-bar').style.pointerEvents = 'none';
        document.getElementById('header').style.borderBottom = '4px solid var(--accent-purple)';
        
        // Clear game and add one Antigravity bird
        game.init([]); 
        const agBird = new Bird(80, game.height / 2, null, 999, 'antigravity');
        game.birds = [agBird];
        
        // Start game loop manually
        trainingActive = true;
        gameLoop();
    });

    // Export/Import buttons
    document.getElementById('btnExportBrain').addEventListener('click', exportBrain);
    document.getElementById('btnExportLog').addEventListener('click', exportGenerationLog);
    document.getElementById('btnImportBrain').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importBrain);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${tab}`).classList.add('active');
        });
    });
}

// ==================== TRAINING LOOP ====================
function toggleTraining() {
    if (trainingActive) {
        stopTraining();
    } else {
        startTraining();
    }
}

function startTraining() {
    trainingActive = true;
    document.getElementById('btnStartStop').textContent = '⏸ Pause';
    document.getElementById('btnStartStop').classList.add('active');
    document.getElementById('networkSize').disabled = true;

    // If no generation yet, create the first one
    if (ga.generation === 0) {
        startNewGeneration();
    }

    if (turboMode) {
        turboLoop();
    } else {
        gameLoop();
    }
}

function stopTraining() {
    trainingActive = false;
    antigravityActive = false;
    document.getElementById('btnStartStop').textContent = '▶ Start Training';
    document.getElementById('btnStartStop').classList.remove('active');
    
    // Reset UI
    document.getElementById('networkSize').disabled = false;
    document.querySelector('.tab-bar').style.opacity = '1';
    document.querySelector('.tab-bar').style.pointerEvents = 'all';
    document.getElementById('header').style.borderBottom = '2px solid var(--border)';

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (turboTimeoutId) {
        clearTimeout(turboTimeoutId);
        turboTimeoutId = null;
    }
}

function resetTraining() {
    stopTraining();
    ga = new GeneticAlgorithm(200, 0.05, 0.15, 0.5);
    game.init([]);
    game.draw();
    updateStatsDisplay(null);
    document.getElementById('networkSize').disabled = false;

    // Clear canvases
    const fitnessCanvas = document.getElementById('fitnessGraph');
    const nnCanvas = document.getElementById('nnCanvas');
    if (fitnessCanvas) viz.drawFitnessGraph(fitnessCanvas, []);
    if (nnCanvas) viz.drawNeuralNetwork(nnCanvas, null);

    // Clear log
    const logContainer = document.getElementById('genLogContainer');
    if (logContainer) logContainer.innerHTML = '<p class="no-data">Training log will appear here...</p>';

    const weightContainer = document.getElementById('weightContainer');
    if (weightContainer) weightContainer.innerHTML = '<p class="no-data">Weight data will appear here...</p>';

    const decisionContainer = document.getElementById('decisionContainer');
    if (decisionContainer) decisionContainer.innerHTML = '<p class="no-data">Decision data will appear here...</p>';

    // Clear localStorage
    localStorage.removeItem('flappyAI_bestBrain');
    localStorage.removeItem('flappyAI_gaState');
}

function startNewGeneration() {
    let brains;
    if (ga.generation === 0) {
        // First generation — random brains
        brains = [];
        for (let i = 0; i < ga.populationSize; i++) {
            brains.push(new NeuralNetwork(networkArchitecture));
        }
        ga.generation = 0; // Will be incremented in evolve() or set later
    } else {
        // Evolve from previous generation
        const results = game.getResults();
        const evolved = ga.evolve(results);
        brains = evolved.brains;

        // Update generation log in UI
        const logContainer = document.getElementById('genLogContainer');
        viz.updateGenerationLog(logContainer, ga.getLog());

        // Update fitness graph
        const fitnessCanvas = document.getElementById('fitnessGraph');
        viz.drawFitnessGraph(fitnessCanvas, ga.getLog());

        // AUTO-TUNE LOGIC
        if (autoTune && evolved.stats.newRecord) {
            console.log('🤖 Auto-Tune: Breakthrough detected! Gentle stabilization...');
            ga.elitismRate = 0.10; // Gentle elitism bump
            ga.mutationRate = 0.10; // Keep some exploration

            // Sync UI
            document.getElementById('elitismSlider').value = 10;
            document.getElementById('elitismLabel').textContent = '10%';
            document.getElementById('mutationSlider').value = 10;
            document.getElementById('mutationLabel').textContent = '10%';
        } else if (autoTune && ga.generation % 10 === 0) {
            // Slowly decay elitism back to baseline, recover mutation
            ga.elitismRate = Math.max(0.05, ga.elitismRate - 0.01);
            ga.mutationRate = Math.min(0.15, ga.mutationRate + 0.01);
            
            // Sync UI
            document.getElementById('elitismSlider').value = Math.round(ga.elitismRate * 100);
            document.getElementById('elitismLabel').textContent = `${Math.round(ga.elitismRate * 100)}%`;
            document.getElementById('mutationSlider').value = Math.round(ga.mutationRate * 100);
            document.getElementById('mutationLabel').textContent = `${Math.round(ga.mutationRate * 100)}%`;
        }

        // Auto-save best brain
        saveBestBrain();
    }

    if (ga.generation === 0) ga.generation = 1;

    game.init(brains);
}

function gameLoop() {
    if (!trainingActive) {
        console.log('Training paused');
        return;
    }

    try {
        // Force redraw even if update fails
        game.draw();
    } catch (e) {
        console.error('Render error:', e);
        stopTraining();
        return;
    }

    // Run multiple frames per animation frame for speed
    for (let i = 0; i < simulationSpeed; i++) {
        const status = game.update();

        if (status && status.gameOver) {
            startNewGeneration();
        }
    }

    // Render (only once per animation frame regardless of speed)
    game.draw(showAllBirds);

    // Update stats
    const aliveBirds = game.birds.filter(b => b.alive);
    const bestBird = game.getBestBird();

    updateStatsDisplay({
        generation: ga.generation,
        alive: aliveBirds.length,
        total: game.birds.length,
        bestScore: Math.max(0, ...game.birds.map(b => b.score)),
        bestFitness: bestBird ? bestBird.fitness : 0,
        bestEverFitness: ga.bestFitnessEver,
        bestEverScore: ga.generationLog.length > 0 ?
            Math.max(...ga.generationLog.map(g => g.bestScore)) : 0,
        speed: game.currentSpeed ? game.currentSpeed.toFixed(1) : '2.5',
        gap: game.currentGap ? Math.round(game.currentGap) : 140,
        difficulties: game.activeDifficulties || []
    });

    // Update neural network visualization
    if (bestBird && bestBird.brain) {
        const nnCanvas = document.getElementById('nnCanvas');
        viz.drawNeuralNetwork(nnCanvas, bestBird.brain);

        // Update decision viewer
        const decisionContainer = document.getElementById('decisionContainer');
        viz.updateDecisionViewer(decisionContainer, bestBird);

        // Update weights (less frequently to avoid lag)
        if (game.frameCount % 30 === 0) {
            const weightContainer = document.getElementById('weightContainer');
            viz.updateWeightTable(weightContainer, bestBird.brain);
        }
    }

    animationId = requestAnimationFrame(gameLoop);
}

// ==================== TURBO LOOP (HEADLESS) ====================
function turboLoop() {
    if (!trainingActive || !turboMode) return;

    const CHUNK_TIME = 16; // ms to run per block
    const startTime = performance.now();

    while (performance.now() - startTime < CHUNK_TIME) {
        const status = game.update();
        if (status && status.gameOver) {
            startNewGeneration();
            turboGensThisSession++;
        }
    }

    // Optional visualization during turbo
    if (turboLiveView) {
        if (game.frameCount % 2 === 0) {
            const bestBird = game.getBestBird();
            if (bestBird) {
                viz.drawNeuralNetwork(document.getElementById('nnCanvas'), bestBird.brain);
                viz.updateDecisionViewer(document.getElementById('decisionContainer'), bestBird);
                
                // Update weights (extra throttled)
                if (game.frameCount % 60 === 0) {
                    viz.updateWeightTable(document.getElementById('weightContainer'), bestBird.brain);
                }
            }
        }
    }

    // UI Updates (less frequent)
    if (game.frameCount % 60 === 0) {
        updateTurboUI();
        updateStatsDisplay({
            generation: ga.generation,
            alive: game.birds.filter(b => b.alive).length,
            total: game.birds.length,
            bestScore: game.maxScoreThisGen,
            bestFitness: Math.max(0, ...game.birds.map(b => b.fitness)),
            bestEverFitness: ga.bestFitnessEver,
            bestEverScore: ga.bestScoreEver || 0,
            speed: 'TURBO',
            gap: Math.round(game.currentGap),
            difficulties: game.activeDifficulties || []
        });
    }

    turboTimeoutId = setTimeout(turboLoop, 0);
}

function updateTurboUI() {
    const elapsed = (Date.now() - turboStartTime) / 1000;
    const gensPerSec = (turboGensThisSession / Math.max(elapsed, 0.1)).toFixed(1);
    
    document.getElementById('t-gensPerSec').textContent = gensPerSec;
    document.getElementById('t-bestScore').textContent = game.maxScoreThisGen;
    
    const fitnesses = game.birds.map(b => b.fitness);
    const avgFitness = Math.round(fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length);
    document.getElementById('t-bestFitness').textContent = Math.round(Math.max(...fitnesses));
    
    // Simple console log
    const console = document.getElementById('turboConsole');
    const bestEver = ga.bestScoreEver || 0;
    console.innerHTML = `> GEN ${ga.generation} COMPLETE<br>` +
                      `> BEST SCORE: ${game.maxScoreThisGen}<br>` +
                      `> AVG FITNESS: ${avgFitness}<br>` +
                      `> ALL-TIME BEST: ${bestEver}<br>` +
                      `> STATUS: EVOLVING AT ${gensPerSec} GENS/SEC...`;
}

// ==================== STATS DISPLAY ====================
function updateStatsDisplay(data) {
    if (antigravityActive) {
        document.getElementById('statGeneration').textContent = 'GOD MODE';
        document.getElementById('statAlive').textContent = '1/1';
        document.getElementById('statBestScore').textContent = game.birds[0]?.score || 0;
        document.getElementById('btnStartStop').textContent = '⏹ Stop God Mode';
        return;
    }

    if (!data) {
        document.getElementById('statGeneration').textContent = '-';
        document.getElementById('statAlive').textContent = '-';
        document.getElementById('statBestScore').textContent = '-';
        document.getElementById('statBestFitness').textContent = '-';
        document.getElementById('statBestEver').textContent = '-';
        document.getElementById('statBestEverScore').textContent = '-';
        document.getElementById('statSpeed').textContent = '-';
        document.getElementById('statGap').textContent = '-';
        document.getElementById('difficultyBadges').innerHTML = '';
        return;
    }

    document.getElementById('statGeneration').textContent = data.generation;
    document.getElementById('statAlive').textContent = `${data.alive} / ${data.total}`;
    document.getElementById('statBestScore').textContent = data.bestScore;
    document.getElementById('statBestFitness').textContent = data.bestFitness;
    document.getElementById('statBestEver').textContent = data.bestEverFitness;
    document.getElementById('statBestEverScore').textContent = data.bestEverScore;
    document.getElementById('statSpeed').textContent = `${data.speed}x`;
    document.getElementById('statGap').textContent = `${data.gap}px`;

    // Difficulty badges
    const badgeContainer = document.getElementById('difficultyBadges');
    if (data.difficulties && data.difficulties.length > 0) {
        badgeContainer.innerHTML = data.difficulties.map(d =>
            `<span class="diff-badge">${d}</span>`
        ).join('');
    } else {
        badgeContainer.innerHTML = '<span class="diff-badge easy">🟢 Easy</span>';
    }
}

// ==================== SAVE/LOAD ====================
function saveBestBrain() {
    if (ga.bestBrainEver) {
        const data = {
            brain: ga.bestBrainEver.toJSON(),
            generation: ga.generation,
            fitness: ga.bestFitnessEver
        };
        localStorage.setItem('flappyAI_bestBrain', JSON.stringify(data));
    }
}

function loadSavedState() {
    const saved = localStorage.getItem('flappyAI_bestBrain');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            console.log(`🧠 Found saved brain from generation ${data.generation} (fitness: ${data.fitness})`);
            // We don't auto-load — user can click "Import" if they want
        } catch (e) {
            console.log('No saved brain found');
        }
    }
}

// ==================== EXPORT/IMPORT ====================
function exportBrain() {
    if (!ga.bestBrainEver) {
        alert('No brain to export yet! Start training first.');
        return;
    }

    const data = {
        exportDate: new Date().toISOString(),
        project: 'AI Flappy Bird — Neuroevolution',
        generation: ga.generation,
        bestFitness: ga.bestFitnessEver,
        architecture: networkArchitecture,
        brain: ga.bestBrainEver.toJSON(),
        trainingConfig: {
            populationSize: ga.populationSize,
            elitismRate: ga.elitismRate,
            mutationRate: ga.mutationRate,
            mutationStrength: ga.mutationStrength
        }
    };

    downloadJSON(data, `flappy-ai-brain-gen${ga.generation}.json`);
}

function exportGenerationLog() {
    const log = ga.getLog();
    if (log.length === 0) {
        alert('No generation data yet! Start training first.');
        return;
    }

    const data = {
        exportDate: new Date().toISOString(),
        project: 'AI Flappy Bird — Generation Log',
        totalGenerations: log.length,
        bestFitnessEver: ga.bestFitnessEver,
        log: log
    };

    downloadJSON(data, `flappy-ai-log-gen${ga.generation}.json`);
}

function importBrain(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.brain) {
                const brain = NeuralNetwork.fromJSON(data.brain);
                networkArchitecture = data.brain.architecture || data.architecture || [9, 12, 12, 1];

                // Reset GA and set the imported brain as the starting point
                resetTraining();
                ga.bestBrainEver = brain;
                ga.bestFitnessEver = data.bestFitness || data.fitness || 0;

                // Update architecture display
                document.getElementById('archDisplay').textContent = `[${networkArchitecture.join(' → ')}]`;

                // Show neural network
                const nnCanvas = document.getElementById('nnCanvas');
                brain.predict([0.5, 0.1, 0.5, 0.3, 0.7, 0, 0, 0.4, 0.6]); // Dummy prediction to populate activations (9 inputs)
                viz.drawNeuralNetwork(nnCanvas, brain);

                alert(`✅ Brain imported! Architecture: [${networkArchitecture.join(' → ')}], Fitness: ${ga.bestFitnessEver}\n\nClick "Start Training" to continue evolution.`);
            }
        } catch (err) {
            alert('Error importing brain: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ==================== START ====================
window.addEventListener('DOMContentLoaded', init);
