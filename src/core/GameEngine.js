/**
 * Flappy Bird Game Engine — Advanced Physics & Pedagogical Simulation
 * Incorporates:
 * - 60 FPS Canvas Physics
 * - Dynamic Obstacles (Oscillating Moving Pipes, Variable Speed, Shrinking Gaps, Wind Zones, Double Walls)
 * - Autonomous UAV / Drone Sensory Raycasting (LiDAR / Sonar Visual Rays)
 * - Freeze-Frame Snapshot Analysis for Classroom Education
 */

import { soundEngine } from './AudioSynthesizer.js';

export const DIFFICULTY = {
    variableSpeed: {
        startScore: 35,
        baseSpeed: 2.0,
        maxSpeed: 3.2,
        rampRate: 0.015
    },
    movingPipes: {
        startScore: 45,
        chance: 0.25,
        speed: 0.5,
        range: 30
    },
    shrinkingGaps: {
        startScore: 50,
        baseGap: 160,
        minGap: 120,
        shrinkRate: 0.5
    },
    windZones: {
        startScore: 80,
        chance: 0.25,
        force: 0.15,
        width: 80
    },
    doublePipes: {
        startScore: 120,
        chance: 0.2,
        spacing: 160
    }
};

export class WindZone {
    constructor(x, canvasHeight, force) {
        this.x = x;
        this.width = DIFFICULTY.windZones.width;
        this.height = canvasHeight;
        this.force = force; // positive = pushes down, negative = lifts up
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

        const arrowCount = 5;
        const arrowSpacing = canvasHeight / (arrowCount + 1);
        ctx.fillStyle = this.force > 0
            ? `rgba(248, 81, 73, ${0.5 + Math.abs(this.alpha)})`
            : `rgba(88, 166, 255, ${0.5 + Math.abs(this.alpha)})`;
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

export class Bird {
    constructor(x, y, brain, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.brain = brain;
        this.velocity = 0;
        this.gravity = 0.5;
        this.flapStrength = -8;
        this.radius = 12;
        this.alive = true;
        this.fitness = 0;
        this.score = 0;
        this.framesSurvived = 0;
        this.flaps = 0;
        this.decisionHistory = [];
        this.maxHistory = 20;
        this.currentWind = 0;

        // Visual animation
        this.rotation = 0;
        this.wingPhase = Math.random() * Math.PI * 2;
    }

    /**
     * Compute sensory perception and pass through neural network
     * 9 inputs represent drone radar telemetry:
     */
    think(pipeData) {
        if (!this.alive || !this.brain) return;

        const inputs = [
            this.y / 600,                               // 1. Altitude
            this.velocity / 10,                         // 2. Vertical velocity
            pipeData.distance / 400,                    // 3. Proximity to obstacle
            pipeData.topPipeBottom / 600,               // 4. Upper barrier ceiling
            pipeData.bottomPipeTop / 600,               // 5. Lower barrier floor
            (pipeData.pipeMovement || 0) / 2,           // 6. Dynamic oscillation vector
            (this.currentWind || 0) / 1,                // 7. Atmospheric crosswind
            (pipeData.secondTopPipeBottom || 300) / 600,// 8. Second barrier top
            (pipeData.secondBottomPipeTop || 300) / 600 // 9. Second barrier bottom
        ];

        const output = this.brain.predict(inputs);

        const decision = {
            inputs: inputs.map(v => Math.round(v * 1000) / 1000),
            output: Math.round(output[0] * 1000) / 1000,
            action: output[0] > 0.5 ? 'FLAP' : 'GLIDE',
            frame: this.framesSurvived,
            timestamp: Date.now()
        };

        this.decisionHistory.push(decision);
        if (this.decisionHistory.length > this.maxHistory) {
            this.decisionHistory.shift();
        }

        if (output[0] > 0.5) {
            this.flap();
        }
    }

    flap() {
        if (!this.alive) return;
        this.velocity = this.flapStrength;
        this.flaps++;
    }

    update(pipeData) {
        if (!this.alive) return;

        this.velocity += this.gravity + this.currentWind;
        this.velocity = Math.min(Math.max(this.velocity, -12), 12);
        this.y += this.velocity;
        this.framesSurvived++;

        // Composite multi-objective fitness calculation
        this.fitness = this.framesSurvived + this.score * 2000;

        if (pipeData && pipeData.topPipeBottom) {
            const gapCenter = (pipeData.topPipeBottom + pipeData.bottomPipeTop) / 2;
            const distFromCenter = Math.abs(this.y - gapCenter);
            const normalizedDist = Math.max(0, 1 - (distFromCenter / 300));
            this.fitness += normalizedDist * 5;
        }

        if (this.y < 0 || this.y > 600) {
            this.fitness -= 500;
        }

        this.rotation = Math.min(Math.max(this.velocity * 3, -30), 90);
        this.wingPhase += 0.25;
    }

    draw(ctx, isBest = false) {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        // Body with high-contrast tactile border
        ctx.beginPath();
        if (isBest) {
            ctx.shadowColor = '#FDC800';
            ctx.shadowBlur = 16;
            ctx.fillStyle = '#FDC800';
        } else {
            ctx.fillStyle = `hsla(${(this.id * 37) % 360}, 75%, 62%, 0.4)`;
        }
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = isBest ? 2 : 1;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Eye
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(4, -3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = '#111827';
        ctx.arc(5, -3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.beginPath();
        ctx.fillStyle = isBest ? '#f97316' : '#ea580c';
        ctx.moveTo(this.radius, -2);
        ctx.lineTo(this.radius + 7, 1);
        ctx.lineTo(this.radius, 4);
        ctx.fill();

        // Wing
        const wingY = Math.sin(this.wingPhase) * 3;
        ctx.beginPath();
        ctx.fillStyle = isBest ? '#fde047' : `hsla(${(this.id * 37) % 360}, 75%, 50%, 0.45)`;
        ctx.ellipse(-4, wingY + 2, 7, 4.5, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    isOffScreen(canvasHeight) {
        return this.y < -this.radius || this.y > canvasHeight + this.radius;
    }
}

export class Pipe {
    constructor(x, canvasHeight, gapSize = 140, oscillating = false) {
        this.x = x;
        this.width = 52;
        this.passed = false;
        this.canvasHeight = canvasHeight;
        this.isDouble = false;
        this.isSecondPipe = false;

        const minGapY = 80;
        const maxGapY = canvasHeight - gapSize - 80;
        this.gapY = minGapY + Math.random() * (maxGapY - minGapY);
        this.gapSize = gapSize;
        this.baseGapY = this.gapY;

        this.oscillating = oscillating;
        this.movePhase = Math.random() * Math.PI * 2;
        this.moveSpeed = DIFFICULTY.movingPipes.speed;
        this.moveRange = DIFFICULTY.movingPipes.range;
        this.movementDir = 0;

        this.updateGapPositions();
    }

    updateGapPositions() {
        this.topHeight = this.gapY;
        this.bottomY = this.gapY + this.gapSize;
    }

    update(currentSpeed) {
        this.x -= currentSpeed;
        if (this.oscillating) {
            this.movePhase += 0.03;
            const offset = Math.sin(this.movePhase) * this.moveRange;
            this.movementDir = Math.cos(this.movePhase);
            this.gapY = Math.max(60, Math.min(this.canvasHeight - this.gapSize - 60, this.baseGapY + offset));
            this.updateGapPositions();
        }
    }

    draw(ctx, canvasHeight) {
        let color1, color2, color3;
        if (this.oscillating) {
            color1 = '#ea580c';
            color2 = '#f59e0b';
            color3 = '#9a3412';
        } else {
            color1 = '#15803d';
            color2 = '#22c55e';
            color3 = '#14532d';
        }

        const gradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.3, color2);
        gradient.addColorStop(0.7, color2);
        gradient.addColorStop(1, color3);

        // Top Pipe
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        ctx.fillStyle = color3;
        ctx.fillRect(this.x - 3, this.topHeight - 20, this.width + 6, 20);

        // Bottom Pipe
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.bottomY, this.width, canvasHeight - this.bottomY);
        ctx.fillStyle = color3;
        ctx.fillRect(this.x - 3, this.bottomY, this.width + 6, 20);

        // Bevel highlight
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(this.x + 4, 0, 5, this.topHeight - 20);
        ctx.fillRect(this.x + 4, this.bottomY + 20, 5, canvasHeight - this.bottomY - 20);

        if (this.oscillating) {
            ctx.fillStyle = 'rgba(253, 224, 71, 0.85)';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('↕ DYNAMIC', this.x + this.width / 2, this.topHeight - 26);
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

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas ? canvas.getContext('2d') : null;
        this.width = canvas ? canvas.width : 400;
        this.height = canvas ? canvas.height : 600;

        this.birds = [];
        this.pipes = [];
        this.windZones = [];
        this.pipeSpawnInterval = 135; // Generous 270px spacing between obstacles
        this.initialRunwayFrames = 150; // Runway buffer so drones have calm open airspace before pipe 1
        this.frameCount = 0;
        this.gameOver = false;

        this.currentSpeed = DIFFICULTY.variableSpeed.baseSpeed;
        this.currentGap = DIFFICULTY.shrinkingGaps.baseGap;
        this.maxScoreThisGen = 0;
        this.activeDifficulties = [];
        this.simpleMode = false;
        this.showRaycasts = true; // Pedagogical LiDAR raycast mode
        this.freezeFrame = false;
        this.obstaclesEnabled = false; // Normal condition: obstacles are disarmed by default

        // Background scenery
        this.clouds = [];
        this.groundOffset = 0;
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: 30 + Math.random() * 120,
                size: 25 + Math.random() * 35,
                speed: 0.2 + Math.random() * 0.3
            });
        }
    }

    init(brains) {
        this.birds = brains.map((brain, i) => new Bird(80, this.height / 2, brain, i));
        this.pipes = [];
        this.windZones = [];
        this.frameCount = 0;
        this.gameOver = false;
        this.maxScoreThisGen = 0;
        this.currentSpeed = DIFFICULTY.variableSpeed.baseSpeed;
        this.currentGap = DIFFICULTY.shrinkingGaps.baseGap;
        this.activeDifficulties = [];
    }

    setObstaclesEnabled(enabled) {
        this.obstaclesEnabled = !!enabled;
        if (!this.obstaclesEnabled) {
            this.pipes = [];
            this.windZones = [];
            this.activeDifficulties = [];
        }
    }

    updateDifficulty() {
        if (this.simpleMode) {
            this.currentSpeed = DIFFICULTY.variableSpeed.baseSpeed;
            this.currentGap = DIFFICULTY.shrinkingGaps.baseGap;
            this.activeDifficulties = ['Simple Mode'];
            return;
        }

        const score = this.maxScoreThisGen;
        this.activeDifficulties = [];

        if (score >= DIFFICULTY.variableSpeed.startScore) {
            const extra = (score - DIFFICULTY.variableSpeed.startScore) * DIFFICULTY.variableSpeed.rampRate;
            this.currentSpeed = Math.min(
                DIFFICULTY.variableSpeed.baseSpeed + extra,
                DIFFICULTY.variableSpeed.maxSpeed
            );
            this.activeDifficulties.push('Variable Speed');
        } else {
            this.currentSpeed = DIFFICULTY.variableSpeed.baseSpeed;
        }

        if (score >= DIFFICULTY.shrinkingGaps.startScore) {
            const shrink = (score - DIFFICULTY.shrinkingGaps.startScore) * DIFFICULTY.shrinkingGaps.shrinkRate;
            this.currentGap = Math.max(
                DIFFICULTY.shrinkingGaps.baseGap - shrink,
                DIFFICULTY.shrinkingGaps.minGap
            );
            this.activeDifficulties.push('Narrow Corridor');
        } else {
            this.currentGap = DIFFICULTY.shrinkingGaps.baseGap;
        }

        if (score >= DIFFICULTY.movingPipes.startScore) this.activeDifficulties.push('Oscillating Obstacles');
        if (score >= DIFFICULTY.windZones.startScore) this.activeDifficulties.push('Wind Shear');
        if (score >= DIFFICULTY.doublePipes.startScore) this.activeDifficulties.push('Double Barriers');
    }

    spawnPipe() {
        if (this.simpleMode) {
            this.pipes.push(new Pipe(this.width, this.height, this.currentGap, false));
            return;
        }

        const score = this.maxScoreThisGen;
        const shouldOscillate = score >= DIFFICULTY.movingPipes.startScore &&
            Math.random() < DIFFICULTY.movingPipes.chance;

        const pipe = new Pipe(this.width, this.height, this.currentGap, shouldOscillate);
        this.pipes.push(pipe);

        if (score >= DIFFICULTY.doublePipes.startScore && Math.random() < DIFFICULTY.doublePipes.chance) {
            const secondPipe = new Pipe(
                this.width + DIFFICULTY.doublePipes.spacing,
                this.height,
                this.currentGap,
                shouldOscillate && Math.random() < 0.3
            );
            secondPipe.isDouble = true;
            secondPipe.isSecondPipe = true;
            pipe.isDouble = true;
            this.pipes.push(secondPipe);
        }

        if (score >= DIFFICULTY.windZones.startScore && Math.random() < DIFFICULTY.windZones.chance) {
            const force = (Math.random() < 0.5 ? -1 : 1) * DIFFICULTY.windZones.force;
            const windX = this.width + Math.random() * 80;
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
            const halfGap = this.currentGap / 2;
            return {
                distance: 400,
                topPipeBottom: this.height / 2 - halfGap,
                bottomPipeTop: this.height / 2 + halfGap,
                pipeMovement: 0,
                secondTopPipeBottom: this.height / 2 - halfGap,
                secondBottomPipeTop: this.height / 2 + halfGap,
                firstPipeObj: null
            };
        }

        return {
            distance: firstPipe.x - 80,
            topPipeBottom: firstPipe.topHeight,
            bottomPipeTop: firstPipe.bottomY,
            pipeMovement: firstPipe.oscillating ? firstPipe.movementDir : 0,
            secondTopPipeBottom: secondPipe ? secondPipe.topHeight : firstPipe.topHeight,
            secondBottomPipeTop: secondPipe ? secondPipe.bottomY : firstPipe.bottomY,
            firstPipeObj: firstPipe
        };
    }

    update() {
        if (this.gameOver || this.freezeFrame) return this.getTelemetry();

        this.frameCount++;

        for (const bird of this.birds) {
            if (bird.alive && bird.score > this.maxScoreThisGen) {
                this.maxScoreThisGen = bird.score;
            }
        }

        if (this.obstaclesEnabled) {
            this.updateDifficulty();

            const canSpawn = this.frameCount >= this.initialRunwayFrames && 
                (this.frameCount - this.initialRunwayFrames) % this.pipeSpawnInterval === 0;
            if (canSpawn) {
                this.spawnPipe();
            }
        } else {
            this.currentSpeed = DIFFICULTY.variableSpeed.baseSpeed;
            this.activeDifficulties = ['Open Sky Runway'];
        }

        for (const pipe of this.pipes) {
            pipe.update(this.currentSpeed);
        }
        this.pipes = this.pipes.filter(p => !p.isOffScreen());

        for (const wz of this.windZones) {
            wz.update(this.currentSpeed);
        }
        this.windZones = this.windZones.filter(w => !w.isOffScreen());

        const pipeData = this.getNextPipeData();

        let aliveCount = 0;
        let flappedThisFrame = false;

        for (const bird of this.birds) {
            if (!bird.alive) continue;

            bird.currentWind = 0;
            for (const wz of this.windZones) {
                if (wz.affectsBird(bird)) {
                    bird.currentWind = wz.force;
                    break;
                }
            }

            const prevFlaps = bird.flaps;
            bird.think(pipeData);
            if (bird.flaps > prevFlaps) flappedThisFrame = true;

            bird.update(pipeData);

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

            for (const pipe of this.pipes) {
                if (!pipe.passed && pipe.x + pipe.width < bird.x) {
                    bird.score++;
                    pipe.passed = true;
                    soundEngine.playScore();
                }
            }

            if (bird.alive) aliveCount++;
        }

        if (flappedThisFrame) {
            soundEngine.playFlap();
        }

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

        return this.getTelemetry();
    }

    getTelemetry() {
        const aliveBirds = this.birds.filter(b => b.alive);
        return {
            alive: aliveBirds.length,
            total: this.birds.length,
            bestScore: this.maxScoreThisGen,
            bestFitness: Math.max(0, ...this.birds.map(b => b.fitness)),
            gameOver: this.gameOver,
            speed: Math.round(this.currentSpeed * 10) / 10,
            gap: Math.round(this.currentGap),
            activeDifficulties: [...this.activeDifficulties],
            obstaclesEnabled: this.obstaclesEnabled
        };
    }

    draw(showAll = true) {
        if (!this.ctx) return;
        const ctx = this.ctx;

        // Warm Minimalist Light aviation backdrop
        const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        skyGrad.addColorStop(0, '#E0F2FE');
        skyGrad.addColorStop(0.6, '#F0F9FF');
        skyGrad.addColorStop(1, '#FEF9C3');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Soft Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        for (const cloud of this.clouds) {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }

        // Wind zones
        for (const wz of this.windZones) {
            wz.draw(ctx, this.height);
        }

        // Pipes
        for (const pipe of this.pipes) {
            pipe.draw(ctx, this.height);
        }

        // Ground barrier with crisp dark boundary line
        ctx.fillStyle = '#059669';
        ctx.fillRect(0, this.height - 6, this.width, 6);
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, this.height - 7, this.width, 1.5);

        const bestBird = this.getBestBird();

        // Render population
        if (showAll) {
            for (const bird of this.birds) {
                if (bird !== bestBird) bird.draw(ctx, false);
            }
        }
        if (bestBird) bestBird.draw(ctx, true);

        // Pedagogical LiDAR / Sonar Raycasts (Subtheme 1A & 1B)
        if (this.showRaycasts && bestBird && bestBird.alive) {
            this.drawLiDARRaycasts(ctx, bestBird);
        }

        // High-Contrast Light HUD Overlay
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 22px "Outfit", system-ui, sans-serif';
        ctx.textAlign = 'center';
        
        if (this.obstaclesEnabled) {
            ctx.fillText(`SCORE: ${this.maxScoreThisGen}`, this.width / 2, 36);
            if (this.activeDifficulties.length > 0) {
                ctx.font = '600 11px system-ui, sans-serif';
                ctx.fillStyle = '#6D28D9';
                ctx.fillText(this.activeDifficulties.join(' • '), this.width / 2, 54);
            }
        } else {
            // Pedagogical status banner when obstacles are disarmed
            ctx.font = '800 11px "JetBrains Mono", monospace';
            ctx.fillStyle = '#0284C7';
            ctx.fillText('OPEN SKY RUNWAY • OBSTACLES DISARMED', this.width / 2, 34);
            ctx.font = '600 10px system-ui, sans-serif';
            ctx.fillStyle = '#334155';
            ctx.fillText('Hover & altitude balance training active', this.width / 2, 50);
        }

        if (this.freezeFrame) {
            ctx.save();
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 4;
            ctx.strokeRect(4, 4, this.width - 8, this.height - 8);
            ctx.fillStyle = '#f87171';
            ctx.font = 'bold 15px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('FREEZE-FRAME SENSORY INSPECTOR', this.width / 2, 90);
            ctx.restore();
        }
    }

    /**
     * Draw visual LiDAR Raycasts for classroom demystification:
     * Shows how autonomous systems / drones use sensor vectors to calculate trajectories
     */
    drawLiDARRaycasts(ctx, bird) {
        const pipeData = this.getNextPipeData();
        const firstPipe = pipeData.firstPipeObj;
        if (!firstPipe) return;

        const targetX = firstPipe.x;
        const targetTopY = firstPipe.topHeight;
        const targetBottomY = firstPipe.bottomY;
        const targetCenterY = (targetTopY + targetBottomY) / 2;

        ctx.save();
        ctx.lineWidth = 1.5;

        // Ray 1: Bird to Gap Center (Optimal Trajectory)
        ctx.strokeStyle = '#06b6d4'; // Cyan laser
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(bird.x, bird.y);
        ctx.lineTo(targetX, targetCenterY);
        ctx.stroke();

        // Ray 2: Bird to Upper Obstacle Corner
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'; // Red warning ray
        ctx.beginPath();
        ctx.moveTo(bird.x, bird.y);
        ctx.lineTo(targetX, targetTopY);
        ctx.stroke();

        // Ray 3: Bird to Lower Obstacle Corner
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.beginPath();
        ctx.moveTo(bird.x, bird.y);
        ctx.lineTo(targetX, targetBottomY);
        ctx.stroke();

        // Ray Target Dots
        ctx.setLineDash([]);
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(targetX, targetCenterY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(targetX, targetTopY, 3, 0, Math.PI * 2);
        ctx.arc(targetX, targetBottomY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Mathematical Euclidean distance marker
        const dx = targetX - bird.x;
        const dy = targetCenterY - bird.y;
        const distance = Math.round(Math.sqrt(dx * dx + dy * dy));

        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Δx:${Math.round(dx)} Δy:${Math.round(dy)} (d=${distance}px)`, bird.x + 14, bird.y - 10);

        ctx.restore();
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
