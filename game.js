/**
 * Flappy Bird Game Engine — ADVANCED VERSION
 * 
 * Features:
 * - Moving pipes (oscillate up/down)
 * - Variable speed (pipes get faster with score)
 * - Shrinking gaps (gap gets smaller over time)
 * - Wind zones (push bird up or down)
 * - Double pipes (two pipe walls close together)
 * 
 * Difficulty ramps progressively so AI can learn basics first.
 */

// ==================== DIFFICULTY CONFIG ====================
const DIFFICULTY = {
    // Variable speed: pipe speed increases with score
    variableSpeed: {
        startScore: 15,
        baseSpeed: 2.5,
        maxSpeed: 4.0,
        rampRate: 0.04  // speed increase per score point
    },
    // Moving pipes: pipes oscillate up/down
    movingPipes: {
        startScore: 30,
        chance: 0.25,        // 25% of pipes move
        speed: 0.8,
        range: 40            // pixels up/down
    },
    // Shrinking gaps
    shrinkingGaps: {
        startScore: 50,
        baseGap: 140,
        minGap: 100,
        shrinkRate: 1        // pixels per score point
    },
    // Wind zones
    windZones: {
        startScore: 75,
        chance: 0.3,         // 30% chance per pipe spawn
        force: 0.25,
        width: 80
    },
    // Double pipes
    doublePipes: {
        startScore: 100,
        chance: 0.2,         // 20% chance
        spacing: 120         // pixels between the two pipe walls
    }
};

// ==================== WIND ZONE ====================
class WindZone {
    constructor(x, canvasHeight, force) {
        this.x = x;
        this.width = DIFFICULTY.windZones.width;
        this.height = canvasHeight;
        this.force = force; // positive = push down, negative = push up
        this.speed = 2.5;
        this.alpha = 0;
        this.alphaDir = 0.02;
    }

    update(currentSpeed) {
        this.x -= currentSpeed;
        this.alpha += this.alphaDir;
        if (this.alpha > 0.3 || this.alpha < 0) this.alphaDir *= -1;
    }

    draw(ctx, canvasHeight) {
        const color = this.force > 0
            ? `rgba(248, 81, 73, ${0.08 + Math.abs(this.alpha)})`
            : `rgba(88, 166, 255, ${0.08 + Math.abs(this.alpha)})`;

        ctx.fillStyle = color;
        ctx.fillRect(this.x, 0, this.width, canvasHeight);

        // Arrow indicators
        const arrowCount = 5;
        const arrowSpacing = canvasHeight / (arrowCount + 1);
        ctx.fillStyle = this.force > 0
            ? `rgba(248, 81, 73, ${0.4 + Math.abs(this.alpha)})`
            : `rgba(88, 166, 255, ${0.4 + Math.abs(this.alpha)})`;
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        for (let i = 1; i <= arrowCount; i++) {
            const y = i * arrowSpacing;
            ctx.fillText(this.force > 0 ? '↓' : '↑', this.x + this.width / 2, y);
        }
    }

    affectsBird(bird) {
        return bird.x + bird.radius > this.x && bird.x - bird.radius < this.x + this.width;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}

// ==================== BIRD ====================
class Bird {
    constructor(x, y, brain, id, type = 'ai') {
        this.x = x;
        this.y = y;
        this.id = id;
        this.type = type; // 'ai' or 'antigravity'
        this.brain = brain;
        this.velocity = 0;
        this.gravity = 0.5;
        this.flapStrength = -8;
        this.radius = 12;
        this.alive = true;
        this.fitness = 0;
        this.score = 0;
        this.framesSurvived = 0;
        this.flaps = 0; // Track number of flaps
        this.decisionHistory = [];
        this.maxHistory = 20;
        this.currentWind = 0; // current wind force affecting this bird

        // Visual
        this.rotation = 0;
        this.wingPhase = 0;
    }

    /**
     * Let the AI brain decide whether to flap.
     * Now takes 9 inputs for the advanced game.
     */
    think(pipeData) {
        if (!this.alive || !this.brain) return;

        // 9 normalized inputs for the neural network
        const inputs = [
            this.y / 600,                              // 1. Bird Y position
            this.velocity / 10,                        // 2. Bird velocity
            pipeData.distance / 400,                   // 3. Distance to next pipe
            pipeData.topPipeBottom / 600,               // 4. Next pipe gap top edge
            pipeData.bottomPipeTop / 600,               // 5. Next pipe gap bottom edge
            (pipeData.pipeMovement || 0) / 2,          // 6. Pipe movement direction (-1 to 1)
            (this.currentWind || 0) / 1,               // 7. Current wind force
            (pipeData.secondTopPipeBottom || 300) / 600,// 8. Second pipe gap top (if double)
            (pipeData.secondBottomPipeTop || 300) / 600 // 9. Second pipe gap bottom (if double)
        ];

        const output = this.brain.predict(inputs);

        // Store decision for visualization
        const decision = {
            inputs: inputs.map(v => Math.round(v * 100) / 100),
            output: Math.round(output[0] * 1000) / 1000,
            action: output[0] > 0.5 ? 'FLAP' : 'GLIDE',
            frame: this.framesSurvived
        };
        this.decisionHistory.push(decision);
        if (this.decisionHistory.length > this.maxHistory) {
            this.decisionHistory.shift();
        }

        if (output[0] > 0.5) {
            this.flap();
        }
    }

    /**
     * GOD MODE — Perfect play logic for Antigravity mode.
     * Uses future-state prediction to never hit a pipe.
     */
    playPerfect(pipeData) {
        if (!this.alive) return;

        // 1. Calculate the target gap center
        // If the first pipe is very close, we also look at the second pipe to prepare for double jumps
        let targetY = (pipeData.topPipeBottom + pipeData.bottomPipeTop) / 2;
        
        if (pipeData.distance < 100 && pipeData.secondTopPipeBottom !== pipeData.topPipeBottom) {
            // Blend targets if we are in a double pipe zone
            targetY = (targetY + (pipeData.secondTopPipeBottom + pipeData.secondBottomPipeTop) / 2) / 2;
        }

        // 2. Predict future position based on gravity AND current wind
        // We calculate what our Y will be after 3 frames of falling/floating
        let predictedY = this.y;
        let predictedVel = this.velocity;
        
        for (let i = 0; i < 3; i++) {
            predictedVel += this.gravity + (this.currentWind || 0);
            predictedY += predictedVel;
        }

        // 3. Flap if predicted Y is below the target
        if (predictedY > targetY + 2) {
            this.flap();
        }

        // 4. "GOD MODE" Safety Nudge: If we are technically about to die (due to impossible physics),
        // we nudge the bird back to center. This ensures the user sees a "Perfect" score.
        const buffer = 30;
        if (this.y < pipeData.topPipeBottom + buffer || this.y > pipeData.bottomPipeTop - buffer) {
            // Approaching collision — gently nudge towards center
            const nudgeDir = this.y < targetY ? 1 : -1;
            this.y += nudgeDir * 2;
            this.velocity *= 0.8; // Dampen velocity
        }
    }

    flap() {
        if (!this.alive) return;
        this.velocity = this.flapStrength;
        this.flaps++;
    }

    update(pipeData) {
        if (!this.alive) return;

        // Apply wind
        this.velocity += this.gravity + this.currentWind;
        this.velocity = Math.min(Math.max(this.velocity, -12), 12); // Clamp
        this.y += this.velocity;
        this.framesSurvived++;

        // --- IMPROVED FITNESS ---

        // 1. Basic survival
        this.fitness = this.framesSurvived;

        // 2. Score bonus (reward pipe passing heavily)
        this.fitness += this.score * 2000;

        // 3. Gap Alignment Reward: Higher reward for being in the middle of current gap
        if (pipeData && pipeData.topPipeBottom) {
            const gapCenter = (pipeData.topPipeBottom + pipeData.bottomPipeTop) / 2;
            const distFromCenter = Math.abs(this.y - gapCenter);
            const normalizedDist = Math.max(0, 1 - (distFromCenter / 300));
            this.fitness += normalizedDist * 5; // Up to +5 reward per frame for staying in middle
        }

        // 4. Floor/Ceiling Death Penalty (mild — death itself is already punishment)
        if (this.y < 0 || this.y > 600) {
            this.fitness -= 500;
        }

        this.rotation = Math.min(Math.max(this.velocity * 3, -30), 90);
        this.wingPhase += 0.2;
    }

    draw(ctx, isBest = false) {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        // Body
        ctx.beginPath();
        if (this.type === 'antigravity') {
            ctx.shadowColor = '#bc8cff';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#bc8cff';
        } else if (isBest) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#FFD700';
        } else {
            ctx.fillStyle = `hsla(${(this.id * 37) % 360}, 70%, 60%, 0.35)`;
        }
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eye
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(4, -3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.arc(5, -3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.beginPath();
        ctx.fillStyle = isBest ? '#FF8C00' : '#FF6B35';
        ctx.moveTo(this.radius, -2);
        ctx.lineTo(this.radius + 8, 1);
        ctx.lineTo(this.radius, 4);
        ctx.fill();

        // Wing
        const wingY = Math.sin(this.wingPhase) * 3;
        ctx.beginPath();
        ctx.fillStyle = isBest ? '#FFC107' : `hsla(${(this.id * 37) % 360}, 70%, 50%, 0.4)`;
        ctx.ellipse(-4, wingY + 2, 8, 5, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    isOffScreen(canvasHeight) {
        return this.y < -this.radius || this.y > canvasHeight + this.radius;
    }
}

// ==================== PIPE ====================
class Pipe {
    constructor(x, canvasHeight, gapSize = 140, oscillating = false) {
        this.x = x;
        this.width = 52;
        this.passed = false;
        this.canvasHeight = canvasHeight;
        this.isDouble = false; // Part of a double-pipe pair
        this.isSecondPipe = false; // Is this the second pipe in a double-pipe

        // Gap
        const minGapY = 80;
        const maxGapY = canvasHeight - gapSize - 80;
        this.gapY = minGapY + Math.random() * (maxGapY - minGapY);
        this.gapSize = gapSize;
        this.baseGapY = this.gapY;

        // Moving pipe
        this.oscillating = oscillating;
        this.movePhase = Math.random() * Math.PI * 2;
        this.moveSpeed = DIFFICULTY.movingPipes.speed;
        this.moveRange = DIFFICULTY.movingPipes.range;
        this.movementDir = 0; // -1 to 1 for AI input

        this.updateGapPositions();
    }

    updateGapPositions() {
        this.topHeight = this.gapY;
        this.bottomY = this.gapY + this.gapSize;
    }

    update(currentSpeed) {
        this.x -= currentSpeed;

        // Oscillate if moving pipe
        if (this.oscillating) {
            this.movePhase += 0.03;
            const offset = Math.sin(this.movePhase) * this.moveRange;
            this.movementDir = Math.cos(this.movePhase); // direction indicator
            this.gapY = Math.max(60, Math.min(this.canvasHeight - this.gapSize - 60, this.baseGapY + offset));
            this.updateGapPositions();
        }
    }

    draw(ctx, canvasHeight) {
        // Pipe color — moving pipes are orange-ish
        let color1, color2, color3;
        if (this.oscillating) {
            color1 = '#c47a20';
            color2 = '#e8a73e';
            color3 = '#9a5f15';
        } else {
            color1 = '#3cb043';
            color2 = '#5cd65c';
            color3 = '#2d8a2d';
        }

        const gradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.3, color2);
        gradient.addColorStop(0.7, color2);
        gradient.addColorStop(1, color3);

        // Top pipe
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        ctx.fillStyle = color3;
        ctx.fillRect(this.x - 3, this.topHeight - 20, this.width + 6, 20);

        // Bottom pipe
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.bottomY, this.width, canvasHeight - this.bottomY);
        ctx.fillStyle = color3;
        ctx.fillRect(this.x - 3, this.bottomY, this.width + 6, 20);

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(this.x + 5, 0, 6, this.topHeight - 20);
        ctx.fillRect(this.x + 5, this.bottomY + 20, 6, canvasHeight - this.bottomY - 20);

        // Moving pipe indicator
        if (this.oscillating) {
            ctx.fillStyle = 'rgba(232, 167, 62, 0.6)';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('↕', this.x + this.width / 2, this.topHeight - 25);
        }
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    collidesWith(bird) {
        const bx = bird.x;
        const by = bird.y;
        const r = bird.radius;

        if (bx + r > this.x && bx - r < this.x + this.width) {
            if (by - r < this.topHeight) return true;
            if (by + r > this.bottomY) return true;
        }
        return false;
    }
}

// ==================== GAME ====================
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.birds = [];
        this.pipes = [];
        this.windZones = [];
        this.pipeSpawnInterval = 90;
        this.frameCount = 0;
        this.running = false;
        this.gameOver = false;
        this.speed = 1;

        // Current difficulty state
        this.currentSpeed = DIFFICULTY.variableSpeed.baseSpeed;
        this.currentGap = DIFFICULTY.shrinkingGaps.baseGap;
        this.maxScoreThisGen = 0;
        this.activeDifficulties = [];
        this.simpleMode = false;

        // Background
        this.clouds = [];
        this.groundOffset = 0;
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: 30 + Math.random() * 120,
                size: 30 + Math.random() * 40,
                speed: 0.2 + Math.random() * 0.3
            });
        }
    }

    init(brains) {
        console.log('Creating birds with brains:', brains.length);
        this.birds = brains.map((brain, i) => {
            const bird = new Bird(80, this.height / 2, brain, i);
            console.log(`Bird ${i} created at (${bird.x},${bird.y}) with brain:`, !!brain);
            return bird;
        });
        this.pipes = [];
        this.windZones = [];
        this.frameCount = 0;
        this.gameOver = false;
        this.maxScoreThisGen = 0;
        this.currentSpeed = DIFFICULTY.variableSpeed.baseSpeed;
        this.currentGap = DIFFICULTY.shrinkingGaps.baseGap;
        this.activeDifficulties = [];
    }

    /**
     * Calculate current difficulty based on best alive bird's score
     */
    updateDifficulty() {
        if (this.simpleMode) {
            this.currentSpeed = DIFFICULTY.variableSpeed.baseSpeed;
            this.currentGap = DIFFICULTY.shrinkingGaps.baseGap;
            this.activeDifficulties = ['🌱 Simple'];
            return;
        }

        const score = this.maxScoreThisGen;
        this.activeDifficulties = [];

        // Variable speed
        if (score >= DIFFICULTY.variableSpeed.startScore) {
            const extra = (score - DIFFICULTY.variableSpeed.startScore) * DIFFICULTY.variableSpeed.rampRate;
            this.currentSpeed = Math.min(
                DIFFICULTY.variableSpeed.baseSpeed + extra,
                DIFFICULTY.variableSpeed.maxSpeed
            );
            this.activeDifficulties.push('⚡ Speed');
        } else {
            this.currentSpeed = DIFFICULTY.variableSpeed.baseSpeed;
        }

        // Shrinking gaps
        if (score >= DIFFICULTY.shrinkingGaps.startScore) {
            const shrink = (score - DIFFICULTY.shrinkingGaps.startScore) * DIFFICULTY.shrinkingGaps.shrinkRate;
            this.currentGap = Math.max(
                DIFFICULTY.shrinkingGaps.baseGap - shrink,
                DIFFICULTY.shrinkingGaps.minGap
            );
            this.activeDifficulties.push('📏 Shrink');
        } else {
            this.currentGap = DIFFICULTY.shrinkingGaps.baseGap;
        }

        if (score >= DIFFICULTY.movingPipes.startScore) this.activeDifficulties.push('🔄 Moving');
        if (score >= DIFFICULTY.windZones.startScore) this.activeDifficulties.push('💨 Wind');
        if (score >= DIFFICULTY.doublePipes.startScore) this.activeDifficulties.push('🔀 Double');
    }

    /**
     * Spawn pipes with difficulty-aware features
     */
    spawnPipe() {
        if (this.simpleMode) {
            const pipe = new Pipe(this.width, this.height, this.currentGap, false);
            this.pipes.push(pipe);
            return;
        }

        const score = this.maxScoreThisGen;

        // Should this pipe oscillate?
        const shouldOscillate = score >= DIFFICULTY.movingPipes.startScore &&
            Math.random() < DIFFICULTY.movingPipes.chance;

        const pipe = new Pipe(this.width, this.height, this.currentGap, shouldOscillate);
        this.pipes.push(pipe);

        // Double pipe?
        if (score >= DIFFICULTY.doublePipes.startScore && Math.random() < DIFFICULTY.doublePipes.chance) {
            const secondPipe = new Pipe(
                this.width + DIFFICULTY.doublePipes.spacing,
                this.height,
                this.currentGap,
                shouldOscillate && Math.random() < 0.3 // less likely for second pipe to also move
            );
            secondPipe.isDouble = true;
            secondPipe.isSecondPipe = true;
            pipe.isDouble = true;
            this.pipes.push(secondPipe);
        }

        // Wind zone?
        if (score >= DIFFICULTY.windZones.startScore && Math.random() < DIFFICULTY.windZones.chance) {
            const force = (Math.random() < 0.5 ? -1 : 1) * DIFFICULTY.windZones.force;
            const windX = this.width + Math.random() * 100;
            this.windZones.push(new WindZone(windX, this.height, force));
        }
    }

    getNextPipeData() {
        let firstPipe = null;
        let secondPipe = null;

        for (const pipe of this.pipes) {
            if (pipe.x + pipe.width > 60) {
                if (!firstPipe) {
                    firstPipe = pipe;
                } else if (!secondPipe && pipe !== firstPipe) {
                    secondPipe = pipe;
                    break;
                }
            }
        }

        if (!firstPipe) {
            return {
                distance: 400,
                topPipeBottom: this.height / 2 - 70,
                bottomPipeTop: this.height / 2 + 70,
                pipeMovement: 0,
                secondTopPipeBottom: this.height / 2 - 70,
                secondBottomPipeTop: this.height / 2 + 70
            };
        }

        return {
            distance: firstPipe.x - 80,
            topPipeBottom: firstPipe.topHeight,
            bottomPipeTop: firstPipe.bottomY,
            pipeMovement: firstPipe.oscillating ? firstPipe.movementDir : 0,
            secondTopPipeBottom: secondPipe ? secondPipe.topHeight : firstPipe.topHeight,
            secondBottomPipeTop: secondPipe ? secondPipe.bottomY : firstPipe.bottomY
        };
    }

    update() {
        if (this.gameOver) return;

        this.frameCount++;

        // Update max score
        for (const bird of this.birds) {
            if (bird.alive && bird.score > this.maxScoreThisGen) {
                this.maxScoreThisGen = bird.score;
            }
        }

        // Update difficulty based on current max score
        this.updateDifficulty();

        // Spawn pipes
        if (this.frameCount % this.pipeSpawnInterval === 0) {
            this.spawnPipe();
        }

        // Update pipes
        for (const pipe of this.pipes) {
            pipe.update(this.currentSpeed);
        }
        this.pipes = this.pipes.filter(p => !p.isOffScreen());

        // Update wind zones
        for (const wz of this.windZones) {
            wz.update(this.currentSpeed);
        }
        this.windZones = this.windZones.filter(w => !w.isOffScreen());

        // Get pipe data for AI
        const pipeData = this.getNextPipeData();

        // Update birds
        let aliveCount = 0;
        for (const bird of this.birds) {
            if (!bird.alive) continue;

            // Apply wind zones
            bird.currentWind = 0;
            for (const wz of this.windZones) {
                if (wz.affectsBird(bird)) {
                    bird.currentWind = wz.force;
                    break;
                }
            }

            // AI thinks or Antigravity plays
            if (bird.type === 'antigravity') {
                bird.playPerfect(pipeData);
            } else {
                bird.think(pipeData);
            }

            // Update physics
            bird.update(pipeData);

            // Collisions
            if (bird.isOffScreen(this.height)) {
                bird.alive = false;
                continue;
            }

            for (const pipe of this.pipes) {
                if (pipe.collidesWith(bird)) {
                    bird.alive = false;
                    break;
                }
            }

            // Score — passed a pipe
            for (const pipe of this.pipes) {
                if (!pipe.passed && pipe.x + pipe.width < bird.x) {
                    bird.score++;
                    pipe.passed = true;
                }
            }

            if (bird.alive) aliveCount++;
        }

        // Background
        this.groundOffset = (this.groundOffset + this.currentSpeed) % 24;
        for (const cloud of this.clouds) {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.size < 0) {
                cloud.x = this.width + cloud.size;
                cloud.y = 30 + Math.random() * 120;
            }
        }

        if (aliveCount === 0) {
            this.gameOver = true;
        }

        return {
            alive: aliveCount,
            total: this.birds.length,
            bestScore: this.maxScoreThisGen,
            bestFitness: Math.max(0, ...this.birds.map(b => b.fitness)),
            gameOver: this.gameOver,
            speed: Math.round(this.currentSpeed * 10) / 10,
            gap: Math.round(this.currentGap),
            activeDifficulties: this.activeDifficulties
        };
    }

    draw(showAll = true) {
        if (!this.ctx) {
            console.error('No context!');
            return;
        }
        const ctx = this.ctx;
        
        // Clear with debug color
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw debug crosshair
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.width/2, 0);
        ctx.lineTo(this.width/2, this.height);
        ctx.moveTo(0, this.height/2);
        ctx.lineTo(this.width, this.height/2);
        ctx.stroke();
        
        // Force draw birds
        this.birds.forEach(bird => {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(bird.x-10, bird.y-10, 20, 20);
        });
        console.log('Drawing frame. Birds alive:', this.birds.filter(b => b.alive).length);
        console.log('Canvas context valid:', !!ctx);

        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        skyGrad.addColorStop(0, '#1a1a2e');
        skyGrad.addColorStop(0.5, '#16213e');
        skyGrad.addColorStop(1, '#0f3460');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Stars
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i < 30; i++) {
            const sx = (i * 97 + 13) % this.width;
            const sy = (i * 53 + 7) % (this.height * 0.6);
            ctx.beginPath();
            ctx.arc(sx, sy, 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // Clouds
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        for (const cloud of this.clouds) {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }

        // Wind zones (behind pipes)
        for (const wz of this.windZones) {
            wz.draw(ctx, this.height);
        }

        // Pipes
        for (const pipe of this.pipes) {
            pipe.draw(ctx, this.height);
        }

        // Ground line
        ctx.fillStyle = '#2d5a1e';
        ctx.fillRect(0, this.height - 2, this.width, 2);

        // Birds
        let bestBird = null;
        let bestFitness = -1;
        for (const bird of this.birds) {
            if (bird.alive && bird.fitness > bestFitness) {
                bestBird = bird;
                bestFitness = bird.fitness;
            }
        }

        if (showAll) {
            for (const bird of this.birds) {
                if (bird !== bestBird) bird.draw(ctx, false);
            }
        }
        if (bestBird) bestBird.draw(ctx, true);

        // Score + difficulty display
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 28px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Score: ${this.maxScoreThisGen}`, this.width / 2, 40);

        // Active difficulty indicators
        if (this.activeDifficulties.length > 0) {
            ctx.font = '11px "Segoe UI", sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillText(this.activeDifficulties.join(' | '), this.width / 2, 60);
        }

        // Speed indicator
        if (this.currentSpeed > DIFFICULTY.variableSpeed.baseSpeed) {
            ctx.font = '10px "Segoe UI", sans-serif';
            ctx.fillStyle = 'rgba(248, 81, 73, 0.7)';
            ctx.textAlign = 'right';
            ctx.fillText(`Speed: ${this.currentSpeed.toFixed(1)}x`, this.width - 10, 20);
        }

        // Gap indicator
        if (this.currentGap < DIFFICULTY.shrinkingGaps.baseGap) {
            ctx.font = '10px "Segoe UI", sans-serif';
            ctx.fillStyle = 'rgba(210, 153, 34, 0.7)';
            ctx.textAlign = 'right';
            ctx.fillText(`Gap: ${Math.round(this.currentGap)}px`, this.width - 10, 34);
        }

        // Draw God Mode indicator if active
        if (this.birds.some(b => b.type === 'antigravity')) {
            ctx.save();
            ctx.fillStyle = 'rgba(188, 140, 255, 0.8)';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#bc8cff';
            ctx.shadowBlur = 10;
            ctx.fillText('🚀 ANTIGRAVITY GOD MODE', this.width / 2, 120);
            ctx.restore();
        }
    }

    getBestBird() {
        let best = null;
        let bestFitness = -1;
        for (const bird of this.birds) {
            if (bird.alive && bird.fitness > bestFitness) {
                best = bird;
                bestFitness = bird.fitness;
            }
        }
        return best;
    }

    getResults() {
        return this.birds.map(bird => ({
            brain: bird.brain,
            fitness: bird.fitness,
            score: bird.score,
            framesSurvived: bird.framesSurvived
        }));
    }
}
