/**
 * Genetic Algorithm — Evolves neural networks through natural selection
 * 
 * This is how the AI "learns" without being told what to do:
 * 1. Play the game with many birds
 * 2. Birds that survive longer = higher fitness
 * 3. Best birds' brains get cloned + mutated
 * 4. Repeat = evolution!
 */

class GeneticAlgorithm {
    /**
     * @param {number} populationSize - How many birds per generation
     * @param {number} elitismRate - Top % that survive unchanged (0-1)
     * @param {number} mutationRate - Probability of mutating each weight (0-1) 
     * @param {number} mutationStrength - How much to change mutated weights
     */
    constructor(populationSize = 100, elitismRate = 0.05, mutationRate = 0.15, mutationStrength = 0.5) {
        this.populationSize = populationSize;
        this.elitismRate = elitismRate;
        this.mutationRate = mutationRate;
        this.mutationStrength = mutationStrength;
        this.generation = 0;
        this.generationLog = []; // Stores data from every generation
        this.bestFitnessEver = 0;
        this.bestBrainEver = null;
    }

    /**
     * Create the next generation from the current population's results.
     * This is the core of the genetic algorithm.
     * 
     * @param {Array<{brain: NeuralNetwork, fitness: number, score: number}>} population
     * @returns {{brains: NeuralNetwork[], stats: Object}} New brains + generation stats
     */
    evolve(population) {
        this.generation++;

        // Sort by fitness (best first)
        population.sort((a, b) => b.fitness - a.fitness);

        // Collect generation stats
        const fitnesses = population.map(p => p.fitness);
        const scores = population.map(p => p.score);
        const stats = {
            generation: this.generation,
            bestFitness: fitnesses[0],
            avgFitness: Math.round(fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length),
            worstFitness: fitnesses[fitnesses.length - 1],
            bestScore: scores[0],
            avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10,
            mutationRate: this.mutationRate,
            mutationStrength: this.mutationStrength,
            eliteCount: Math.max(1, Math.floor(this.populationSize * this.elitismRate)),
            timestamp: Date.now()
        };

        // Track all-time best
        if (fitnesses[0] > this.bestFitnessEver) {
            this.bestFitnessEver = fitnesses[0];
            this.bestBrainEver = population[0].brain.copy();
            stats.newRecord = true;
        }

        // Save to generation log
        this.generationLog.push(stats);

        // Create next generation
        const newBrains = [];
        const eliteCount = stats.eliteCount;

        // 1. ELITISM — top performers survive unchanged
        for (let i = 0; i < eliteCount; i++) {
            newBrains.push(population[i].brain.copy());
        }

        // 1b. SUPER ELITISM — inject all-time best if it's not already in elites
        if (this.bestBrainEver) {
            newBrains.push(this.bestBrainEver.copy());
        }

        // 2. Fill rest with offspring
        while (newBrains.length < this.populationSize) {
            // Select parent using fitness-proportionate selection (roulette wheel)
            const parent = this.selectParent(population);

            // Sometimes do crossover with another parent
            let childBrain;
            if (Math.random() < 0.7) {
                const parent2 = this.selectParent(population);
                childBrain = this.crossover(parent.brain, parent2.brain);
            } else {
                childBrain = parent.brain.copy();
            }

            // Mutate the child
            childBrain.mutate(this.mutationRate, this.mutationStrength);
            newBrains.push(childBrain);
        }

        return { brains: newBrains, stats };
    }

    /**
     * Fitness-proportionate selection (roulette wheel).
     * Birds with higher fitness have a greater chance of being selected.
     */
    selectParent(population) {
        // Use rank-based selection for better pressure
        const totalRanks = population.length * (population.length + 1) / 2;
        let r = Math.random() * totalRanks;

        for (let i = 0; i < population.length; i++) {
            r -= (population.length - i);
            if (r <= 0) return population[i];
        }
        return population[0];
    }

    /**
     * Single-point crossover — combine two parent brains into one child.
     * Like mixing DNA from two parents.
     */
    crossover(brain1, brain2) {
        const child = brain1.copy();

        // For each layer, randomly pick weights from parent 1 or parent 2
        for (let i = 0; i < child.weights.length; i++) {
            for (let j = 0; j < child.weights[i].length; j++) {
                if (Math.random() < 0.5) {
                    // Take this neuron's weights from parent 2
                    for (let k = 0; k < child.weights[i][j].length; k++) {
                        child.weights[i][j][k] = brain2.weights[i][j][k];
                    }
                    child.biases[i][j] = brain2.biases[i][j];
                }
            }
        }

        return child;
    }

    /**
     * Get the full generation log — every generation's data for display/export
     */
    getLog() {
        return this.generationLog;
    }

    /**
     * Export everything as JSON for saving
     */
    toJSON() {
        return {
            generation: this.generation,
            populationSize: this.populationSize,
            elitismRate: this.elitismRate,
            mutationRate: this.mutationRate,
            mutationStrength: this.mutationStrength,
            bestFitnessEver: this.bestFitnessEver,
            bestBrainEver: this.bestBrainEver ? this.bestBrainEver.toJSON() : null,
            generationLog: this.generationLog
        };
    }

    /**
     * Import settings from JSON
     */
    loadFromJSON(data) {
        this.generation = data.generation || 0;
        this.bestFitnessEver = data.bestFitnessEver || 0;
        this.generationLog = data.generationLog || [];
        if (data.bestBrainEver) {
            this.bestBrainEver = NeuralNetwork.fromJSON(data.bestBrainEver);
        }
    }
}
