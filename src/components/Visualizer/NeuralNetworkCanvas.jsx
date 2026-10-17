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
    const paddingX = 80;
    const paddingY = 40;
    const layerSpacing = (w - paddingX * 2) / (layers.length - 1);

    // Calculate node coordinate positions
    const nodePositions = [];
    for (let i = 0; i < layers.length; i++) {
      const x = paddingX + i * layerSpacing;
      const count = layers[i];
      const spacing = (h - paddingY * 2) / Math.max(count - 1, 1);
      const layerPositions = [];

      for (let j = 0; j < count; j++) {
        const y = count === 1 ? h / 2 : paddingY + j * spacing;
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
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${act * 0.4})`;
          ctx.fill();
        }

        // Node Circle
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);

        // Fill based on activation
        if (i === 0) {
          ctx.fillStyle = `rgba(56, 189, 248, ${0.3 + act * 0.7})`;
        } else if (i === nodePositions.length - 1) {
          ctx.fillStyle = act > 0.5 ? '#10b981' : '#64748b';
        } else {
          ctx.fillStyle = `rgba(192, 132, 252, ${0.2 + act * 0.8})`;
        }
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Labels for Input Layer
        if (i === 0 && INPUT_LABELS[j]) {
          ctx.font = '10px monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'right';
          ctx.fillText(INPUT_LABELS[j], x - 12, y + 3);
        }

        // Label for Output Layer
        if (i === nodePositions.length - 1) {
          ctx.font = 'bold 11px system-ui';
          ctx.fillStyle = act > 0.5 ? '#34d399' : '#94a3b8';
          ctx.textAlign = 'left';
          const decisionText = act > 0.5 ? `FLAP (${(act * 100).toFixed(0)}%)` : `GLIDE (${(act * 100).toFixed(0)}%)`;
          ctx.fillText(decisionText, x + 14, y + 4);
        }
      }
    }

    // Legend
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#34d399';
    ctx.fillRect(20, h - 18, 10, 4);
    ctx.fillText('+ Excitatory Weight', 35, h - 14);

    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(160, h - 18, 10, 4);
    ctx.fillText('- Inhibitory Weight', 175, h - 14);

    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(310, h - 16, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Neuron Activation', 320, h - 14);

  }, [brain, bestBird]);

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <canvas
        ref={canvasRef}
        width={580}
        height={340}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '580px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          margin: '0 auto'
        }}
      />
    </div>
  );
}
