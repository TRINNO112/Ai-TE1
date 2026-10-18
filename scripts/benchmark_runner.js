/**
 * Headless Neuroevolution Empirical Benchmark Harness
 * Runs real simulations across multiple configurations to produce empirical datasets.
 */

import { NeuralNetwork } from '../src/core/NeuralNetwork.js';
import { GeneticAlgorithm } from '../src/core/GeneticAlgorithm.js';
import { GameEngine } from '../src/core/GameEngine.js';
import fs from 'fs';
import path from 'path';

function runTrial({ name, arch, mutationRate, elitismRate, popSize = 100, maxGenerations = 15 }) {
    const game = new GameEngine(null);
    const ga = new GeneticAlgorithm(popSize, elitismRate, mutationRate, 0.5);

    let currentBrains = [];
    for (let i = 0; i < popSize; i++) {
        currentBrains.push(new NeuralNetwork(arch));
    }
    game.init(currentBrains);

    const history = [];
    let firstObstacleGen = null;
    let score10Gen = null;
    const t0 = Date.now();

    for (let gen = 1; gen <= maxGenerations; gen++) {
        let frame = 0;
        const maxFrames = 15000; // Cap to prevent infinite loops on perfect champions

        while (!game.gameOver && frame < maxFrames) {
            game.update();
            frame++;
        }

        const results = game.getResults();
        const { brains, stats } = ga.evolve(results);

        if (firstObstacleGen === null && stats.bestScore >= 1) {
            firstObstacleGen = gen;
        }
        if (score10Gen === null && stats.bestScore >= 10) {
            score10Gen = gen;
        }

        // Calculate average weight magnitude for champion
        const bestBrain = ga.bestBrainEver || brains[0];
        let totalWeights = 0;
        let sumAbsWeights = 0;
        for (const layer of bestBrain.weights) {
            for (const neuron of layer) {
                for (const w of neuron) {
                    sumAbsWeights += Math.abs(w);
                    totalWeights++;
                }
            }
        }
        const meanWeightMag = totalWeights > 0 ? sumAbsWeights / totalWeights : 0;

        history.push({
            gen,
            bestScore: stats.bestScore,
            avgScore: parseFloat(stats.avgScore.toFixed(2)),
            bestFitness: Math.round(stats.bestFitness),
            avgFitness: Math.round(stats.avgFitness),
            allTimeBestScore: ga.bestScoreEver,
            allTimeBestFitness: Math.round(ga.bestFitnessEver),
            survivedFrames: frame,
            meanWeightMag: parseFloat(meanWeightMag.toFixed(4))
        });

        // Initialize next generation
        game.init(brains);
    }

    const durationMs = Date.now() - t0;

    return {
        name,
        arch,
        paramCount: (function() {
            let p = 0;
            for (let i = 0; i < arch.length - 1; i++) {
                p += (arch[i] * arch[i + 1]) + arch[i + 1];
            }
            return p;
        })(),
        mutationRate,
        elitismRate,
        popSize,
        durationMs,
        firstObstacleGen,
        score10Gen,
        peakScore: ga.bestScoreEver,
        peakFitness: Math.round(ga.bestFitnessEver),
        history
    };
}

async function runBenchmarks() {
    console.log('=================================================================');
    console.log(' STARTING EMPIRICAL NEUROEVOLUTION BENCHMARK SUITE');
    console.log(' Executing real physics and genetic iterations in CPU memory...');
    console.log('=================================================================\n');

    const EXPERIMENTS = [
        // Set 1: Architecture Scaling
        { id: 'Small_Arch', name: 'Small Architecture [9-8-1]', arch: [9, 8, 1], mutationRate: 0.15, elitismRate: 0.05 },
        { id: 'Med_Arch', name: 'Medium Architecture [9-12-12-1]', arch: [9, 12, 12, 1], mutationRate: 0.15, elitismRate: 0.05 },
        { id: 'Large_Arch', name: 'Large Architecture [9-20-20-1]', arch: [9, 20, 20, 1], mutationRate: 0.15, elitismRate: 0.05 },

        // Set 2: Mutation Sensitivity (on Medium Arch)
        { id: 'Mut_05', name: 'Mutation 5% (Conservative)', arch: [9, 12, 12, 1], mutationRate: 0.05, elitismRate: 0.05 },
        { id: 'Mut_30', name: 'Mutation 30% (Dynamic)', arch: [9, 12, 12, 1], mutationRate: 0.30, elitismRate: 0.05 },
        { id: 'Mut_45', name: 'Mutation 45% (Exploratory Chaos)', arch: [9, 12, 12, 1], mutationRate: 0.45, elitismRate: 0.05 },

        // Set 3: Elitism Impact (on Medium Arch)
        { id: 'Elit_02', name: 'Elitism 2% (Low Retention)', arch: [9, 12, 12, 1], mutationRate: 0.15, elitismRate: 0.02 },
        { id: 'Elit_15', name: 'Elitism 15% (High Preservation)', arch: [9, 12, 12, 1], mutationRate: 0.15, elitismRate: 0.15 }
    ];

    const TRIALS_PER_CONFIG = 3;
    const allResults = [];

    for (const exp of EXPERIMENTS) {
        console.log(`[Testing Configuration] ${exp.name} (Arch: [${exp.arch.join('-')}], Mut: ${exp.mutationRate * 100}%, Elit: ${exp.elitismRate * 100}%)`);
        const trialResults = [];

        for (let t = 1; t <= TRIALS_PER_CONFIG; t++) {
            process.stdout.write(`  ↳ Running Trial #${t}/${TRIALS_PER_CONFIG}... `);
            const trial = runTrial({
                name: `${exp.name} Trial ${t}`,
                arch: exp.arch,
                mutationRate: exp.mutationRate,
                elitismRate: exp.elitismRate,
                popSize: 100,
                maxGenerations: 15
            });
            trialResults.push(trial);
            console.log(`Done in ${trial.durationMs}ms | Peak Score: ${trial.peakScore} | Peak Fitness: ${trial.peakFitness} | Obstacle Gen: ${trial.firstObstacleGen ?? 'None'}`);
        }

        // Aggregate statistics across the 3 trials
        const avgPeakScore = trialResults.reduce((acc, t) => acc + t.peakScore, 0) / TRIALS_PER_CONFIG;
        const avgPeakFitness = trialResults.reduce((acc, t) => acc + t.peakFitness, 0) / TRIALS_PER_CONFIG;
        const avgTimeMs = trialResults.reduce((acc, t) => acc + t.durationMs, 0) / TRIALS_PER_CONFIG;
        const validObstacleGens = trialResults.filter(t => t.firstObstacleGen !== null).map(t => t.firstObstacleGen);
        const avgFirstObsGen = validObstacleGens.length > 0
            ? (validObstacleGens.reduce((a, b) => a + b, 0) / validObstacleGens.length).toFixed(1)
            : 'N/A';

        allResults.push({
            id: exp.id,
            config: exp,
            trials: trialResults,
            summary: {
                avgPeakScore: parseFloat(avgPeakScore.toFixed(1)),
                avgPeakFitness: Math.round(avgPeakFitness),
                avgTimeMs: Math.round(avgTimeMs),
                avgFirstObsGen
            }
        });
        console.log(`  ★ Aggregate: Avg Peak Score = ${avgPeakScore.toFixed(1)}, Avg First Obstacle Cleared Gen = ${avgFirstObsGen}\n`);
    }

    // Save JSON dataset
    const jsonPath = path.resolve('public/benchmark_results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allResults, null, 2));
    console.log(`[Data Export] Raw empirical dataset saved to: ${jsonPath}`);

    return allResults;
}

runBenchmarks().catch(err => {
    console.error('Benchmark execution error:', err);
    process.exit(1);
});
