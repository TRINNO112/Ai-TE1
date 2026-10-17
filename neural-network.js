/**
 * Neural Network — Feed-forward network built from scratch
 * No libraries needed. This IS the AI's brain.
 * 
 * The "knowledge" is stored as weights and biases (just numbers).
 * When we say the AI "learns", we mean these numbers get better over generations.
 */

class NeuralNetwork {
    /**
     * Create a neural network with the given architecture.
     * @param {number[]} layers - e.g. [5, 8, 8, 1] means 5 inputs, 2 hidden layers of 8, 1 output
     */
    constructor(layers) {
        this.layers = layers;
        this.weights = [];
        this.biases = [];
        this.activations = []; // Store last activations for visualization

        // Initialize weights and biases with random values
        for (let i = 0; i < layers.length - 1; i++) {
            // Xavier initialization for better training
            const scale = Math.sqrt(2 / (layers[i] + layers[i + 1]));
            
            // Weight matrix: layers[i] inputs → layers[i+1] outputs
            const layerWeights = [];
            for (let j = 0; j < layers[i + 1]; j++) {
                const neuronWeights = [];
                for (let k = 0; k < layers[i]; k++) {
                    neuronWeights.push((Math.random() * 2 - 1) * scale);
                }
                layerWeights.push(neuronWeights);
            }
            this.weights.push(layerWeights);

            // Bias for each neuron in the next layer
            const layerBiases = [];
            for (let j = 0; j < layers[i + 1]; j++) {
                layerBiases.push((Math.random() * 2 - 1) * scale);
            }
            this.biases.push(layerBiases);
        }
    }

    /**
     * Sigmoid activation function — squashes any number to 0-1 range
     */
    sigmoid(x) {
        return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
    }

    /**
     * ReLU activation for hidden layers — better gradient flow
     */
    relu(x) {
        return Math.max(0, x);
    }

    /**
     * Feed inputs through the network and get output(s).
     * This is how the bird "thinks" — inputs go in, decision comes out.
     * 
     * @param {number[]} inputs - The bird's sensory data
     * @returns {number[]} outputs - The bird's decision(s)
     */
    predict(inputs) {
        this.activations = [inputs.slice()]; // Store input activations
        let current = inputs;

        for (let i = 0; i < this.weights.length; i++) {
            const next = [];
            for (let j = 0; j < this.weights[i].length; j++) {
                let sum = this.biases[i][j];
                for (let k = 0; k < current.length; k++) {
                    sum += current[k] * this.weights[i][j][k];
                }
                // Use sigmoid for output layer, ReLU for hidden layers
                if (i === this.weights.length - 1) {
                    next.push(this.sigmoid(sum));
                } else {
                    next.push(this.relu(sum));
                }
            }
            this.activations.push(next.slice()); // Store each layer's activations
            current = next;
        }

        return current;
    }

    /**
     * Create an exact copy of this brain
     */
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

    /**
     * Mutate the brain — randomly tweak weights and biases.
     * This is how evolution introduces variation.
     * 
     * @param {number} rate - Probability of each weight being mutated (0-1)
     * @param {number} strength - How much to change each weight
     */
    mutate(rate = 0.1, strength = 0.5) {
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

    /**
     * Get the total number of parameters (weights + biases) in this network.
     * This is the "size" of the brain.
     */
    getParameterCount() {
        let count = 0;
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                count += this.weights[i][j].length; // weights
            }
            count += this.biases[i].length; // biases
        }
        return count;
    }

    /**
     * Export the entire brain as a JSON object — this IS the AI's knowledge.
     * Every number in here is something the AI "learned".
     */
    toJSON() {
        return {
            architecture: this.layers.slice(),
            parameterCount: this.getParameterCount(),
            weights: this.weights.map((layer, li) =>
                layer.map((neuron, ni) =>
                    neuron.map((w, wi) => ({
                        layer: li,
                        fromNeuron: wi,
                        toNeuron: ni,
                        value: Math.round(w * 10000) / 10000
                    }))
                )
            ).flat(2),
            biases: this.biases.map((layer, li) =>
                layer.map((b, ni) => ({
                    layer: li + 1,
                    neuron: ni,
                    value: Math.round(b * 10000) / 10000
                }))
            ).flat()
        };
    }

    /**
     * Load brain data from a JSON object
     */
    static fromJSON(data) {
        const nn = new NeuralNetwork(data.architecture);
        // Restore weights
        for (const w of data.weights) {
            nn.weights[w.layer][w.toNeuron][w.fromNeuron] = w.value;
        }
        // Restore biases
        for (const b of data.biases) {
            nn.biases[b.layer - 1][b.neuron] = b.value;
        }
        return nn;
    }

    /**
     * Get a flat table of all weights and biases for display in the UI.
     * This lets the user see EVERY number in the brain.
     */
    getWeightsTable() {
        const rows = [];
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    rows.push({
                        type: 'weight',
                        layer: i,
                        from: k,
                        to: j,
                        label: `L${i} N${k} → L${i + 1} N${j}`,
                        value: this.weights[i][j][k]
                    });
                }
            }
        }
        for (let i = 0; i < this.biases.length; i++) {
            for (let j = 0; j < this.biases[i].length; j++) {
                rows.push({
                    type: 'bias',
                    layer: i + 1,
                    neuron: j,
                    label: `L${i + 1} N${j} bias`,
                    value: this.biases[i][j]
                });
            }
        }
        return rows;
    }

    /**
     * Get the last activations (what each neuron fired) for visualization
     */
    getActivations() {
        return this.activations;
    }
}
