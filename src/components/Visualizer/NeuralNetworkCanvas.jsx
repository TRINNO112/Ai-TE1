import React, { useRef, useEffect } from 'react';

const FULL_INPUT_LABELS = [
  'Altitude (y)',
  'Velocity (v)',
  'Obstacle Dist',
  'Gap Top (ytop)',
  'Gap Bottom',
  'Pipe Speed (v)',
  'Wind Force (F)',
  'Barrier 2 Top',
  'Barrier 2 Bot'
];

const COMPACT_INPUT_LABELS = [
  'Alt (y)',
  'Vel (v)',
  'Dist (d)',
  'Gap Top',
  'Gap Bot',
  'Move (v)',
  'Wind (F)',
  'Bar2 Top',
  'Bar2 Bot'
];

export function NeuralNetworkCanvas({ brain: propBrain, bestBird }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Initialize sleek, subtle synaptic impulse particles
  useEffect(() => {
    const particles = [];
    const count = 12; // Sleek and minimal to avoid visual clutter
    for (let i = 0; i < count; i++) {
      particles.push({
        layerIdx: 0,
        fromIdx: 0,
        toIdx: 0,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
        color: Math.random() > 0.35 ? 'rgba(5, 150, 105, 0.75)' : 'rgba(225, 29, 72, 0.75)'
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let isRunning = true;

    // Responsive Canvas Resize Observer
    const updateDimensions = () => {
      const containerW = container.clientWidth || 400;
      const isMobile = containerW < 520;
      const targetW = Math.max(300, Math.floor(containerW));
      const targetH = isMobile ? 360 : 440;

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    // Continuous 60 FPS Synaptic Activation Radar Render Loop
    const render = () => {
      if (!isRunning) return;

      const w = canvas.width;
      const h = canvas.height;
      const isCompact = w < 520;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = isDark ? '#131D31' : '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      // Determine active brain & live activations
      const activeBrain = bestBird?.brain || propBrain;

      if (!activeBrain) {
        ctx.fillStyle = '#64748B';
        ctx.font = '13px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Neural network topology initializing...', w / 2, h / 2);
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const layers = activeBrain.layers || [9, 8, 1];
      const rawActivations = activeBrain.getActivations?.() || null;
      
      // Fallback to recent bird decision if activations array not populated
      const fallbackInputs = bestBird?.decisionHistory?.length 
        ? bestBird.decisionHistory[bestBird.decisionHistory.length - 1].inputs 
        : [0.5, 0.0, 0.7, 0.3, 0.6, 0.0, 0.0, 0.5, 0.5];
      
      const activations = rawActivations && rawActivations.length >= layers.length 
        ? rawActivations 
        : [fallbackInputs];

      // Generous left padding to guarantee 0 text overlapping or clipping
      const paddingLeft = isCompact ? 96 : 195;
      const paddingRight = isCompact ? 88 : 135;
      const paddingTop = isCompact ? 36 : 46;
      const paddingBottom = isCompact ? 36 : 44;
      const availableW = w - paddingLeft - paddingRight;
      const layerSpacing = availableW / Math.max(layers.length - 1, 1);

      // Compute coordinate grid for all nodes
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

      // 1. Draw Synaptic Connections (Weights)
      const weights = activeBrain.weights || [];
      for (let i = 0; i < weights.length; i++) {
        const layerW = weights[i];
        for (let j = 0; j < layerW.length; j++) {
          for (let k = 0; k < layerW[j].length; k++) {
            const wVal = layerW[j][k];
            const from = nodePositions[i]?.[k];
            const to = nodePositions[i + 1]?.[j];
            if (!from || !to) continue;

            const isPositive = wVal > 0;
            const mag = Math.min(Math.abs(wVal), 2.5);
            const alpha = 0.12 + (mag / 2.5) * 0.42;

            ctx.strokeStyle = isPositive
              ? `rgba(5, 150, 105, ${alpha})` // Emerald for positive weight
              : `rgba(225, 29, 72, ${alpha})`;  // Rose for negative weight
            ctx.lineWidth = Math.max(0.6, (mag / 2.5) * (isCompact ? 1.5 : 2.2));

            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
          }
        }
      }

      // 2. Animate Subtle Synaptic Impulses (Sleek micro-pulses along strong synapses)
      const particles = particlesRef.current;
      for (let pIdx = 0; pIdx < particles.length; pIdx++) {
        const p = particles[pIdx];
        const numLayers = nodePositions.length;
        if (numLayers < 2) continue;

        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.layerIdx = Math.floor(Math.random() * (numLayers - 1));
          const fromCount = nodePositions[p.layerIdx]?.length || 1;
          const toCount = nodePositions[p.layerIdx + 1]?.length || 1;
          p.fromIdx = Math.floor(Math.random() * fromCount);
          p.toIdx = Math.floor(Math.random() * toCount);

          const wMatrix = weights[p.layerIdx];
          const wVal = wMatrix?.[p.toIdx]?.[p.fromIdx] ?? 1;
          p.color = wVal > 0 ? 'rgba(5, 150, 105, 0.75)' : 'rgba(225, 29, 72, 0.75)';
        }

        const from = nodePositions[p.layerIdx]?.[p.fromIdx];
        const to = nodePositions[p.layerIdx + 1]?.[p.toIdx];
        if (!from || !to) continue;

        const curX = from.x + (to.x - from.x) * p.progress;
        const curY = from.y + (to.y - from.y) * p.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, isCompact ? 1.5 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // 3. Draw Neurons (Soma, Activations & Glowing Aura)
      const nodeR = isCompact ? 5.5 : 7.5;
      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = 0; j < nodePositions[i].length; j++) {
          const { x, y } = nodePositions[i][j];
          const act = (activations[i] && activations[i][j] !== undefined)
            ? Math.max(0, Math.min(1, activations[i][j]))
            : 0;

          // Activated Node Glow Aura
          if (act > 0.3) {
            ctx.beginPath();
            const glowR = nodeR + (isCompact ? 3.5 : 6) * act;
            ctx.arc(x, y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = i === nodePositions.length - 1 && act > 0.5
              ? `rgba(5, 150, 105, ${act * 0.4})`
              : `rgba(2, 132, 199, ${act * 0.3})`;
            ctx.fill();
          }

          // Neuron Node Circle
          ctx.beginPath();
          ctx.arc(x, y, nodeR, 0, Math.PI * 2);

          if (i === 0) {
            // Input layer: Blue
            ctx.fillStyle = `rgba(2, 132, 199, ${0.35 + act * 0.65})`;
          } else if (i === nodePositions.length - 1) {
            // Output layer: Emerald if FLAP, Slate if GLIDE
            ctx.fillStyle = act > 0.5 ? '#059669' : '#94A3B8';
          } else {
            // Hidden layers: Violet/Purple
            ctx.fillStyle = `rgba(124, 58, 237, ${0.25 + act * 0.75})`;
          }
          ctx.fill();

          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = isCompact ? 1.2 : 1.6;
          ctx.stroke();

          // Input Layer Labels & Real-time Sensor Values (Unified string, Zero Overlap!)
          if (i === 0) {
            const label = isCompact ? COMPACT_INPUT_LABELS[j] : FULL_INPUT_LABELS[j];
            if (label) {
              const liveVal = activations[0]?.[j];
              const valFormatted = liveVal !== undefined ? (liveVal >= 0 ? `+${liveVal.toFixed(2)}` : liveVal.toFixed(2)) : '';

              ctx.font = isCompact 
                ? '600 8.5px "JetBrains Mono", monospace' 
                : '600 9.5px "JetBrains Mono", monospace';
              ctx.textAlign = 'right';
              ctx.fillStyle = isDark ? '#CBD5E1' : '#334155';

              // Single combined string guarantees 0 overlapping text!
              const fullText = valFormatted ? `${label}  ${valFormatted}` : label;
              ctx.fillText(fullText, x - (isCompact ? 9 : 14), y + (isCompact ? 2.5 : 3.5));
            }
          }

          // Output Layer: Real-time Decision Radar & Action Potential Wave
          if (i === nodePositions.length - 1) {
            const isFlap = act > 0.5;

            // Expanding ripple wave on FLAP action
            if (isFlap) {
              const pulse = (Date.now() / 18) % 18;
              const waveR = nodeR + pulse;
              const waveAlpha = Math.max(0, 1 - pulse / 18);
              ctx.beginPath();
              ctx.arc(x, y, waveR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(5, 150, 105, ${waveAlpha})`;
              ctx.lineWidth = 1.6;
              ctx.stroke();
            }

            const pct = Math.round(act * 100);
            const decisionText = isFlap ? `▲ FLAP ${pct}%` : `▼ GLIDE ${pct}%`;

            ctx.font = isCompact 
              ? 'bold 9.5px "JetBrains Mono", monospace' 
              : 'bold 11px "JetBrains Mono", monospace';
            ctx.textAlign = 'left';
            ctx.fillStyle = isFlap ? '#059669' : '#64748B';
            ctx.fillText(decisionText, x + (isCompact ? 10 : 15), y + (isCompact ? 3 : 3.5));
          }
        }
      }

      // 4. Live Radar Indicator Pill (Top Right, Clean & Guaranteed Unclipped)
      ctx.textAlign = 'right';
      ctx.font = isCompact 
        ? '700 8.5px "JetBrains Mono", monospace' 
        : '700 9.5px "JetBrains Mono", monospace';
      ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
      const statusText = isCompact ? 'LIVE 60FPS' : 'SYNAPTIC RADAR (60 FPS)';
      ctx.fillText(statusText, w - 18, 20);

      const statusTextWidth = ctx.measureText(statusText).width;
      const dotX = w - 18 - statusTextWidth - 8;
      const pulseAlpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.006);
      ctx.fillStyle = `rgba(5, 150, 105, ${pulseAlpha})`;
      ctx.beginPath();
      ctx.arc(dotX, 17, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 5. Bottom Legend
      ctx.font = isCompact ? '600 8.5px system-ui' : '600 10px system-ui';
      ctx.textAlign = 'left';

      // Positive
      ctx.fillStyle = '#059669';
      ctx.fillRect(isCompact ? 12 : 36, h - 16, isCompact ? 8 : 11, 3);
      ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
      ctx.fillText('+ Excitatory', isCompact ? 23 : 51, h - 13);

      // Negative
      const midOffset = isCompact ? 96 : 155;
      ctx.fillStyle = '#E11D48';
      ctx.fillRect(midOffset, h - 16, isCompact ? 8 : 11, 3);
      ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
      ctx.fillText('- Inhibitory', midOffset + (isCompact ? 11 : 15), h - 13);

      // Activation
      const actOffset = isCompact ? 176 : 265;
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(actOffset, h - 14.5, isCompact ? 2.5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
      ctx.fillText('Activation', actOffset + (isCompact ? 6 : 9), h - 13);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [propBrain, bestBird]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '100%',
          borderRadius: '12px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-card)',
          background: 'var(--bg-card)',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}
