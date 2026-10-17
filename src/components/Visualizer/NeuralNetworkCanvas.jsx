import React, { useRef, useEffect } from 'react';

const INPUT_LABELS = [
  'Altitude (y)',
  'Velocity (v)',
  'Obstacle Dist (d)',
  'Gap Top (ytop)',
  'Gap Bottom (ybot)',
  'Obstacle Move (vpipe)',
  'Wind Force (F)',
  'Barrier 2 Top',
  'Barrier 2 Bottom'
];

export function NeuralNetworkCanvas({ brain, bestBird }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#070a13';
    ctx.fillRect(0, 0, w, h);

    if (!brain) {
      ctx.fillStyle = '#64748b';
      ctx.font = '13px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Neural network topology initializing...', w / 2, h / 2);
      return;
    }

    const layers = brain.layers;
    const activations = brain.getActivations() || [];
    const paddingLeft = 175;
    const paddingRight = 135;
    const paddingTop = 40;
    const paddingBottom = 48;
    const availableW = w - paddingLeft - paddingRight;
    const layerSpacing = availableW / Math.max(layers.length - 1, 1);

    // Calculate node coordinate positions
    const nodePositions = [];
    for (let i = 0; i < layers.length; i++) {
      const x = paddingLeft + i * layerSpacing;
      const count = layers[i];
      const availableH = h - paddingTop - paddingBottom;
      const spacing = availableH / Math.max(count - 1, 1);
      const layerPositions = [];

      for (let j = 0; j < count; j++) {
        const y = count === 1 ? h / 2 : paddingTop + j * spacing;
        layerPositions.push({ x, y });
      }
      nodePositions.push(layerPositions);
    }

    // Draw Synaptic Connections (Weights)
    for (let i = 0; i < brain.weights.length; i++) {
      for (let j = 0; j < brain.weights[i].length; j++) {
        for (let k = 0; k < brain.weights[i][j].length; k++) {
          const wVal = brain.weights[i][j][k];
          const from = nodePositions[i][k];
          const to = nodePositions[i + 1][j];

          const isPositive = wVal > 0;
          const mag = Math.min(Math.abs(wVal), 2.5);
          const alpha = 0.15 + (mag / 2.5) * 0.65;

          ctx.strokeStyle = isPositive
            ? `rgba(52, 211, 153, ${alpha})` // Emerald for positive
            : `rgba(244, 63, 94, ${alpha})`;  // Rose for negative
          ctx.lineWidth = Math.max(0.6, (mag / 2.5) * 3);

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      }
    }

    // Draw Neurons (Nodes & Activations)
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = 0; j < nodePositions[i].length; j++) {
        const { x, y } = nodePositions[i][j];
        const act = (activations[i] && activations[i][j] !== undefined)
          ? Math.max(0, Math.min(1, activations[i][j]))
          : 0;

        // Node Glow
        if (act > 0.4) {
          ctx.beginPath();
          ctx.arc(x, y, 14, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${act * 0.45})`;
          ctx.fill();
        }

        // Node Circle
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);

        // Fill based on activation
        if (i === 0) {
          ctx.fillStyle = `rgba(56, 189, 248, ${0.35 + act * 0.65})`;
        } else if (i === nodePositions.length - 1) {
          ctx.fillStyle = act > 0.5 ? '#10b981' : '#64748b';
        } else {
          ctx.fillStyle = `rgba(192, 132, 252, ${0.25 + act * 0.75})`;
        }
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Labels for Input Layer (generous 175px left margin ensures 0 clipping)
        if (i === 0 && INPUT_LABELS[j]) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'right';
          ctx.fillText(INPUT_LABELS[j], x - 14, y + 3.5);
        }

        // Label for Output Layer
        if (i === nodePositions.length - 1) {
          ctx.font = 'bold 11px system-ui';
          ctx.fillStyle = act > 0.5 ? '#34d399' : '#94a3b8';
          ctx.textAlign = 'left';
          const decisionText = act > 0.5 ? `FLAP (${(act * 100).toFixed(0)}%)` : `GLIDE (${(act * 100).toFixed(0)}%)`;
          ctx.fillText(decisionText, x + 16, y + 4);
        }
      }
    }

    // Legend
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#34d399';
    ctx.fillRect(40, h - 20, 12, 4);
    ctx.fillText('+ Excitatory Weight', 58, h - 16);

    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(210, h - 20, 12, 4);
    ctx.fillText('- Inhibitory Weight', 228, h - 16);

    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(385, h - 18, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Neuron Activation', 396, h - 16);

  }, [brain, bestBird]);

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <canvas
        ref={canvasRef}
        width={840}
        height={440}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '100%',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}
      />
    </div>
  );
}
