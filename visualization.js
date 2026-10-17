/**
 * Visualization — Renders real-time training data so you can see what the AI learns
 * 
 * Includes:
 * - Fitness graph (best/avg per generation)
 * - Neural network diagram (nodes + weighted connections)
 * - Generation log table
 * - Decision viewer (what the best bird is "thinking")
 */

class Visualization {
    constructor() {
        this.fitnessHistory = { best: [], avg: [] };
        this.maxGraphPoints = 200;
    }

    /**
     * Draw the fitness graph on a canvas — shows AI improvement over generations
     */
    drawFitnessGraph(canvas, genLog) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, w, h);

        if (!genLog || genLog.length < 2) {
            ctx.fillStyle = '#8b949e';
            ctx.font = '13px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Fitness graph will appear after 2 generations...', w / 2, h / 2);
            return;
        }

        const padding = { top: 25, right: 15, bottom: 30, left: 50 };
        const graphW = w - padding.left - padding.right;
        const graphH = h - padding.top - padding.bottom;

        const bestFitnesses = genLog.map(g => g.bestFitness);
        const avgFitnesses = genLog.map(g => g.avgFitness);
        const maxVal = Math.max(...bestFitnesses, 1);
        const numPoints = genLog.length;

        // Grid lines
        ctx.strokeStyle = '#21262d';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (graphH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            // Y-axis labels
            ctx.fillStyle = '#8b949e';
            ctx.font = '10px "Segoe UI", sans-serif';
            ctx.textAlign = 'right';
            const val = Math.round(maxVal * (1 - i / 4));
            ctx.fillText(val, padding.left - 5, y + 4);
        }

        // X-axis label
        ctx.fillStyle = '#8b949e';
        ctx.font = '10px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Generation', w / 2, h - 5);

        // Helper to draw a line graph
        const drawLine = (data, color, alpha = 1) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            for (let i = 0; i < data.length; i++) {
                const x = padding.left + (i / Math.max(numPoints - 1, 1)) * graphW;
                const y = padding.top + graphH - (data[i] / maxVal) * graphH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;

            // Area fill
            ctx.globalAlpha = 0.1 * alpha;
            ctx.fillStyle = color;
            ctx.lineTo(padding.left + graphW, padding.top + graphH);
            ctx.lineTo(padding.left, padding.top + graphH);
            ctx.fill();
            ctx.globalAlpha = 1;
        };

        // Draw average first (behind), then best
        drawLine(avgFitnesses, '#58a6ff', 0.6);
        drawLine(bestFitnesses, '#3fb950', 1);

        // Legend
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#3fb950';
        ctx.fillRect(padding.left + 5, 6, 12, 3);
        ctx.fillText('Best', padding.left + 22, 12);
        ctx.fillStyle = '#58a6ff';
        ctx.fillRect(padding.left + 65, 6, 12, 3);
        ctx.fillText('Average', padding.left + 82, 12);

        // Title
        ctx.fillStyle = '#e6edf3';
        ctx.font = 'bold 12px "Segoe UI", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`Gen ${numPoints}`, w - padding.right, 14);
    }

    /**
     * Draw the neural network diagram — shows the brain structure with color-coded weights
     */
    drawNeuralNetwork(canvas, brain) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, w, h);

        if (!brain) {
            ctx.fillStyle = '#8b949e';
            ctx.font = '13px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Neural network will appear when training starts...', w / 2, h / 2);
            return;
        }

        const layers = brain.layers;
        const activations = brain.getActivations();
        const padding = 40;
        const layerSpacing = (w - padding * 2) / (layers.length - 1);

        // Input labels
        const inputLabels = ['Bird Y', 'Velocity', 'Pipe Dist', 'Gap Top', 'Gap Bot', 'Pipe Move', 'Wind', '2nd Top', '2nd Bot'];
        const outputLabels = ['Flap?'];

        // Calculate node positions
        const nodePositions = [];
        for (let l = 0; l < layers.length; l++) {
            const layerNodes = [];
            const nodeCount = layers[l];
            const nodeSpacing = Math.min(30, (h - padding * 2) / (nodeCount + 1));
            const startY = h / 2 - (nodeCount - 1) * nodeSpacing / 2;

            for (let n = 0; n < nodeCount; n++) {
                layerNodes.push({
                    x: padding + l * layerSpacing,
                    y: startY + n * nodeSpacing
                });
            }
            nodePositions.push(layerNodes);
        }

        // Draw connections (weights)
        for (let l = 0; l < brain.weights.length; l++) {
            for (let to = 0; to < brain.weights[l].length; to++) {
                for (let from = 0; from < brain.weights[l][to].length; from++) {
                    const weight = brain.weights[l][to][from];
                    const absWeight = Math.min(Math.abs(weight), 3);

                    // Color: green = positive, red = negative
                    if (weight > 0) {
                        ctx.strokeStyle = `rgba(63, 185, 80, ${Math.min(absWeight / 2, 0.8)})`;
                    } else {
                        ctx.strokeStyle = `rgba(248, 81, 73, ${Math.min(absWeight / 2, 0.8)})`;
                    }
                    ctx.lineWidth = Math.max(0.5, absWeight * 1.2);

                    const fromPos = nodePositions[l][from];
                    const toPos = nodePositions[l + 1][to];
                    ctx.beginPath();
                    ctx.moveTo(fromPos.x, fromPos.y);
                    ctx.lineTo(toPos.x, toPos.y);
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (let l = 0; l < layers.length; l++) {
            for (let n = 0; n < layers[l]; n++) {
                const pos = nodePositions[l][n];
                let activation = 0;
                if (activations && activations[l]) {
                    activation = activations[l][n] || 0;
                }

                // Node
                const brightness = Math.min(activation * 0.8, 1);
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(88, 166, 255, ${0.2 + brightness * 0.8})`;
                ctx.fill();
                ctx.strokeStyle = '#58a6ff';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Labels for input/output layers
                ctx.font = '9px "Segoe UI", sans-serif';
                ctx.textAlign = l === 0 ? 'right' : 'left';
                ctx.fillStyle = '#8b949e';
                if (l === 0 && inputLabels[n]) {
                    ctx.fillText(inputLabels[n], pos.x - 14, pos.y + 3);
                } else if (l === layers.length - 1 && outputLabels[n]) {
                    ctx.fillText(outputLabels[n], pos.x + 14, pos.y + 3);
                    // Show output value
                    if (activations && activations[l]) {
                        const val = activations[l][n];
                        ctx.font = 'bold 10px "Segoe UI", sans-serif';
                        ctx.fillStyle = val > 0.5 ? '#3fb950' : '#f85149';
                        ctx.fillText(val !== undefined ? val.toFixed(2) : '', pos.x + 14, pos.y + 16);
                    }
                }
            }
        }

        // Layer labels
        ctx.font = '10px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#484f58';
        const layerLabels = ['Input', ...layers.slice(1, -1).map((_, i) => `Hidden ${i + 1}`), 'Output'];
        for (let l = 0; l < layers.length; l++) {
            const x = padding + l * layerSpacing;
            ctx.fillText(layerLabels[l], x, h - 10);
        }
    }

    /**
     * Update the generation log table in the DOM
     */
    updateGenerationLog(container, genLog) {
        if (!container) return;

        // Only show last 50 generations (scroll for more)
        const recent = genLog.slice(-50).reverse();

        let html = `<table class="gen-log-table">
            <thead><tr>
                <th>Gen</th>
                <th>Best Fitness</th>
                <th>Avg Fitness</th>
                <th>Best Score</th>
                <th>Mutation</th>
            </tr></thead><tbody>`;

        for (const g of recent) {
            const isRecord = g.newRecord ? ' class="record-row"' : '';
            html += `<tr${isRecord}>
                <td>${g.generation}</td>
                <td>${g.bestFitness}</td>
                <td>${g.avgFitness}</td>
                <td>${g.bestScore}</td>
                <td>${(g.mutationRate * 100).toFixed(0)}%</td>
            </tr>`;
        }

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    /**
     * Update the weight inspector table
     */
    updateWeightTable(container, brain) {
        if (!container || !brain) return;

        const weights = brain.getWeightsTable();
        let html = `<div class="weight-summary">
            <span>Architecture: [${brain.layers.join(' → ')}]</span>
            <span>Parameters: ${brain.getParameterCount()}</span>
        </div>`;

        html += `<table class="weight-table">
            <thead><tr>
                <th>Type</th>
                <th>Connection</th>
                <th>Value</th>
                <th>Visual</th>
            </tr></thead><tbody>`;

        for (const row of weights) {
            const val = row.value;
            const color = val >= 0 ? '#3fb950' : '#f85149';
            const barWidth = Math.min(Math.abs(val) * 25, 60);
            html += `<tr>
                <td class="type-${row.type}">${row.type}</td>
                <td>${row.label}</td>
                <td style="color:${color}">${val.toFixed(4)}</td>
                <td><div class="weight-bar" style="width:${barWidth}px;background:${color}"></div></td>
            </tr>`;
        }

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    /**
     * Update the decision viewer — shows what the best bird is "thinking"
     */
    updateDecisionViewer(container, bird) {
        if (!container) return;

        if (!bird || !bird.alive) {
            container.innerHTML = '<p class="no-data">Waiting for active bird...</p>';
            return;
        }

        const lastDecision = bird.decisionHistory[bird.decisionHistory.length - 1];
        if (!lastDecision) {
            container.innerHTML = '<p class="no-data">Thinking...</p>';
            return;
        }

        const inputNames = ['Bird Y', 'Velocity', 'Pipe Dist', 'Gap Top', 'Gap Bot', 'Pipe Move', 'Wind', '2nd Gap Top', '2nd Gap Bot'];
        let html = '<div class="decision-grid">';

        // Inputs
        html += '<div class="decision-inputs"><h4>📥 Inputs</h4>';
        for (let i = 0; i < lastDecision.inputs.length; i++) {
            const val = lastDecision.inputs[i];
            html += `<div class="input-row">
                <span class="input-name">${inputNames[i]}</span>
                <span class="input-val">${val}</span>
            </div>`;
        }
        html += '</div>';

        // Output
        const actionColor = lastDecision.action === 'FLAP' ? '#3fb950' : '#58a6ff';
        html += `<div class="decision-output">
            <h4>📤 Output</h4>
            <div class="output-val" style="color:${actionColor}">
                ${lastDecision.output} → <strong>${lastDecision.action}</strong>
            </div>
            <div class="output-detail">Frame: ${lastDecision.frame} | Score: ${bird.score}</div>
        </div>`;

        html += '</div>';
        container.innerHTML = html;
    }
}
