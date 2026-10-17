/**
 * Neural Network Engine — Feedforward neural network built from pure mathematics
 * GCERT & NCERT Educational Demo: Demonstrates linear algebra (Wx + b) and activations.
 * 
 * Supports arbitrary network topologies: e.g. [9, 8, 1], [9, 12, 12, 1], [9, 20, 20, 1]
 */

export class NeuralNetwork {
    /**
     * @param {number[]} layers - Array of layer neuron counts, e.g. [9, 12, 12, 1]
     */
    constructor(layers) {
        this.layers = [...layers];
        this.weights = [];
        this.biases = [];
        this.activations = []; // Stored activations for visualizer

        // Xavier initialization for stable gradients
        for (let i = 0; i < layers.length - 1; i++) {
            const scale = Math.sqrt(2 / (layers[i] + layers[i + 1]));
            
            // Weight matrix: layers[i] inputs -> layers[i+1] outputs
            const layerWeights = [];
            for (let j = 0; j < layers[i + 1]; j++) {
                const neuronWeights = [];
                for (let k = 0; k < layers[i]; k++) {
                    neuronWeights.push((Math.random() * 2 - 1) * scale);
                }
                layerWeights.push(neuronWeights);
            }
            this.weights.push(layerWeights);

            // Bias vector for next layer
            const layerBiases = [];
            for (let j = 0; j < layers[i + 1]; j++) {
                layerBiases.push((Math.random() * 2 - 1) * scale);
            }
            this.biases.push(layerBiases);
        }
    }

    /**
     * Sigmoid activation function: squashes real numbers into (0, 1) probability range
     */
    sigmoid(x) {
        return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
    }

    /**
     * Rectified Linear Unit (ReLU) activation for deep hidden representations
     */
    relu(x) {
        return Math.max(0, x);
    }

    /**
     * Forward Propagation: Computes the network's output decision for sensory inputs
     * @param {number[]} inputs - 9 sensory features from the environment
     * @returns {number[]} Output decision vector
     */
    predict(inputs) {
        this.activations = [inputs.slice()];
        let current = inputs;

        for (let i = 0; i < this.weights.length; i++) {
            const next = [];
            const isOutputLayer = (i === this.weights.length - 1);

            for (let j = 0; j < this.weights[i].length; j++) {
                let sum = this.biases[i][j];
                for (let k = 0; k < current.length; k++) {
                    sum += current[k] * this.weights[i][j][k];
                }

                // Sigmoid on final output, ReLU on hidden layers
                const activated = isOutputLayer ? this.sigmoid(sum) : this.relu(sum);
                next.push(activated);
            }
            this.activations.push(next.slice());
            current = next;
        }

        return current;
    }

    /**
     * Step-by-step Mathematical Inspector for classroom teachers & science fair judges.
     * Deconstructs every dot product and bias addition in real time: z = W · x + b
     */
    getDetailedCalculation(inputs) {
        const steps = [];
        let current = inputs;

        for (let i = 0; i < this.weights.length; i++) {
            const layerDetails = [];
            const isOutputLayer = (i === this.weights.length - 1);
            const next = [];

            for (let j = 0; j < this.weights[i].length; j++) {
                const terms = [];
                let dotProduct = 0;

                for (let k = 0; k < current.length; k++) {
                    const weightVal = this.weights[i][j][k];
                    const inputVal = current[k];
                    const product = inputVal * weightVal;
                    dotProduct += product;
                    terms.push({
                        inputIndex: k,
                        inputVal: Number(inputVal.toFixed(3)),
                        weightVal: Number(weightVal.toFixed(3)),
                        product: Number(product.toFixed(4))
                    });
                }

                const biasVal = this.biases[i][j];
                const preActivation = dotProduct + biasVal;
                const postActivation = isOutputLayer ? this.sigmoid(preActivation) : this.relu(preActivation);
                next.push(postActivation);

                layerDetails.push({
                    neuronIndex: j,
                    terms,
                    dotProduct: Number(dotProduct.toFixed(4)),
                    bias: Number(biasVal.toFixed(4)),
                    preActivation: Number(preActivation.toFixed(4)),
                    activationFunction: isOutputLayer ? 'Sigmoid' : 'ReLU',
                    output: Number(postActivation.toFixed(4))
                });
            }

            steps.push({
                layerIndex: i,
                fromLayerSize: current.length,
                toLayerSize: next.length,
                isOutputLayer,
                neurons: layerDetails
            });

            current = next;
        }

        return {
            inputs: inputs.map(v => Number(v.toFixed(3))),
            layers: steps,
            finalDecision: current[0] > 0.5 ? 'FLAP (JUMP)' : 'GLIDE (COAST)',
            decisionConfidence: Number(current[0].toFixed(4))
        };
    }

    /**
     * Exact deep copy of this neural network
     */
    copy() {
        const clone = new NeuralNetwork(this.layers);
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    clone.weights[i][j][k] = this.weights[i][j][k];
                }
                clone.biases[i][j] = this.biases[i][j];
            }
        }
        return clone;
    }

    /**
     * Mutate weights and biases through Gaussian perturbation
     * Simulates biological chromosome mutation during DNA replication
     * @param {number} rate - Probability of each gene mutating (0 to 1)
     * @param {number} strength - Maximum modification magnitude
     */
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

    /**
     * Count total learnable parameters (weights + biases)
     */
    getParameterCount() {
        let count = 0;
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                count += this.weights[i][j].length;
            }
            count += this.biases[i].length;
        }
        return count;
    }

    /**
     * Serialize to JSON format compatible with saved models
     */
    toJSON() {
        return {
            architecture: [...this.layers],
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
     * Reconstruct a NeuralNetwork instance from serialized JSON
     */
    static fromJSON(data) {
        if (!data || !data.architecture) {
            throw new Error("Invalid brain JSON format");
        }
        const nn = new NeuralNetwork(data.architecture);
        
        if (data.weights) {
            for (const w of data.weights) {
                if (nn.weights[w.layer] && nn.weights[w.layer][w.toNeuron]) {
                    nn.weights[w.layer][w.toNeuron][w.fromNeuron] = w.value;
                }
            }
        }

        if (data.biases) {
            for (const b of data.biases) {
                const layerIdx = b.layer - 1;
                if (nn.biases[layerIdx] && nn.biases[layerIdx][b.neuron] !== undefined) {
                    nn.biases[layerIdx][b.neuron] = b.value;
                }
            }
        }

        return nn;
    }

    /**
     * Tabular export of every weight and bias for UI inspection
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

    getActivations() {
        return this.activations;
    }
}
