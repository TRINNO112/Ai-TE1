/**
 * Genetic Algorithm Engine — Simulates Darwinian Natural Selection for Neural Networks
 * Demonstrates Biological Evolution (Gene Crossover, Mutation, Survival of the Fittest)
 * mapped to Computer Science & Optimization.
 */

import { NeuralNetwork } from './NeuralNetwork.js';

export class GeneticAlgorithm {
    /**
     * @param {number} populationSize - Number of agents per generation (e.g. 100-200)
     * @param {number} elitismRate - Fraction of top champions preserved verbatim (0 to 1)
     * @param {number} mutationRate - Probability of tweaking each weight (0 to 1)
     * @param {number} mutationStrength - Magnitude of weight alteration
     */
    constructor(populationSize = 150, elitismRate = 0.05, mutationRate = 0.15, mutationStrength = 0.5) {
        this.populationSize = populationSize;
        this.elitismRate = elitismRate;
        this.mutationRate = mutationRate;
        this.mutationStrength = mutationStrength;
        this.generation = 0;
        this.generationLog = [];
        this.bestFitnessEver = 0;
        this.bestBrainEver = null;
        this.bestScoreEver = 0;
    }

    /**
     * Evolves the population:
     * 1. Evaluates and ranks current generation by fitness.
     * 2. Preserves top elite champions unchanged (Elitism).
     * 3. Retains all-time legendary champion (Super-Elitism).
     * 4. Selects parents via Rank-Weighted Roulette Wheel.
     * 5. Performs Genetic Crossover (recombination of weights).
     * 6. Injects random mutations to explore new search space.
     * 
     * @param {Array<{brain: NeuralNetwork, fitness: number, score: number}>} population
     * @returns {{brains: NeuralNetwork[], stats: Object}} Next generation brains & metrics
     */
    evolve(population) {
        this.generation++;

        // Sort descending by fitness
        population.sort((a, b) => b.fitness - a.fitness);

        const fitnesses = population.map(p => p.fitness);
        const scores = population.map(p => p.score);

        const stats = {
            generation: this.generation,
            bestFitness: Math.round(fitnesses[0] || 0),
            avgFitness: Math.round(fitnesses.reduce((a, b) => a + b, 0) / (fitnesses.length || 1)),
            worstFitness: Math.round(fitnesses[fitnesses.length - 1] || 0),
            bestScore: scores[0] || 0,
            avgScore: Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length || 1)) * 10) / 10,
            mutationRate: this.mutationRate,
            mutationStrength: this.mutationStrength,
            eliteCount: Math.max(1, Math.floor(this.populationSize * this.elitismRate)),
            timestamp: Date.now(),
            newRecord: false
        };

        // Check for all-time record
        if (fitnesses[0] > this.bestFitnessEver) {
            this.bestFitnessEver = fitnesses[0];
            this.bestBrainEver = population[0].brain.copy();
            stats.newRecord = true;
        }

        if (scores[0] > this.bestScoreEver) {
            this.bestScoreEver = scores[0];
        }

        this.generationLog.push(stats);

        const newBrains = [];
        const eliteCount = stats.eliteCount;

        // 1. ELITISM: Top performers pass their exact weights directly
        for (let i = 0; i < eliteCount && i < population.length; i++) {
            newBrains.push(population[i].brain.copy());
        }

        // 2. SUPER-ELITISM: Re-inject all-time champion so regression is impossible
        if (this.bestBrainEver) {
            newBrains.push(this.bestBrainEver.copy());
        }

        // 3. BREEDING: Fill remainder via Selection + Crossover + Mutation
        while (newBrains.length < this.populationSize) {
            const parent1 = this.selectParent(population);
            let childBrain;

            // 70% chance of biological sexual crossover, 30% direct asexual cloning
            if (Math.random() < 0.7) {
                const parent2 = this.selectParent(population);
                childBrain = this.crossover(parent1.brain, parent2.brain);
            } else {
                childBrain = parent1.brain.copy();
            }

            // Mutation: Random perturbations to weights/biases
            childBrain.mutate(this.mutationRate, this.mutationStrength);
            newBrains.push(childBrain);
        }

        return { brains: newBrains, stats };
    }

    /**
     * Rank-based Roulette Selection:
     * Assigns selection probability linearly proportional to rank rather than raw score,
     * preventing super-dominant individuals from prematurely causing genetic convergence.
     */
    selectParent(population) {
        const n = population.length;
        const totalRanks = (n * (n + 1)) / 2;
        let rand = Math.random() * totalRanks;

        for (let i = 0; i < n; i++) {
            rand -= (n - i);
            if (rand <= 0) return population[i];
        }
        return population[0];
    }

    /**
     * Genetic Crossover (Uniform Recombination):
     * Recombines neural chromosome layers between two parent brains.
     */
    crossover(brain1, brain2) {
        const child = brain1.copy();

        for (let i = 0; i < child.weights.length; i++) {
            for (let j = 0; j < child.weights[i].length; j++) {
                if (Math.random() < 0.5 && brain2.weights[i] && brain2.weights[i][j]) {
                    for (let k = 0; k < child.weights[i][j].length; k++) {
                        child.weights[i][j][k] = brain2.weights[i][j][k];
                    }
                    if (brain2.biases[i]) {
                        child.biases[i][j] = brain2.biases[i][j];
                    }
                }
            }
        }

        return child;
    }

    getLog() {
        return this.generationLog;
    }

    toJSON() {
        return {
            generation: this.generation,
            populationSize: this.populationSize,
            elitismRate: this.elitismRate,
            mutationRate: this.mutationRate,
            mutationStrength: this.mutationStrength,
            bestFitnessEver: this.bestFitnessEver,
            bestScoreEver: this.bestScoreEver,
            bestBrainEver: this.bestBrainEver ? this.bestBrainEver.toJSON() : null,
            generationLog: this.generationLog
        };
    }

    loadFromJSON(data) {
        this.generation = data.generation || 0;
        this.bestFitnessEver = data.bestFitnessEver || 0;
        this.bestScoreEver = data.bestScoreEver || 0;
        this.generationLog = data.generationLog || [];
        if (data.bestBrainEver) {
            this.bestBrainEver = NeuralNetwork.fromJSON(data.bestBrainEver);
        }
    }
}
