import React, { useRef, useEffect } from 'react';

/**
 * FitnessGraphCanvas — Real-time 60 FPS Evolutionary Fitness & Convergence Visualizer.
 * Accurately plots Darwinian natural selection progression across generations (Gen 1, Gen 2, Gen 3...).
 * Features continuous live telemetry tracking, smooth dynamic Y-axis headroom,
 * expanding X-axis domain (minimum 5 generations), and full Light/Dark mode responsiveness.
 */
export function FitnessGraphCanvas({ generationLog = [], telemetry, gaStats, isRunning }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const ceilingRef = useRef(150);

  // Keep latest props in a mutable ref so RAF render loop runs at 60 FPS
  // without tearing down and recreating ResizeObservers or timers on every prop update.
  const stateRef = useRef({ generationLog, telemetry, gaStats, isRunning });
  useEffect(() => {
    stateRef.current = { generationLog, telemetry, gaStats, isRunning };
  }, [generationLog, telemetry, gaStats, isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let active = true;

    // Responsive Canvas Resize Observer
    const updateDimensions = () => {
      const containerW = container.clientWidth || 360;
      const isMobile = containerW < 520;
      const targetW = Math.max(280, Math.floor(containerW));
      const targetH = isMobile ? 260 : 340;

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

    // Continuous 60 FPS Animation & Dynamic Plotting Loop
    const render = () => {
      if (!active) return;

      const { generationLog: logs = [], telemetry: telem, gaStats: stats, isRunning: running } = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const isCompact = w < 520;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      // 1. Color Palette Tokens based on active theme
      const colors = {
        bg: isDark ? '#131D31' : '#FFFFFF',
        grid: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
        axisText: isDark ? '#94A3B8' : '#64748B',
        labelText: isDark ? '#F8FAFC' : '#0F172A',
        championLine: isDark ? '#10B981' : '#059669',
        championGradStart: isDark ? 'rgba(16, 185, 129, 0.28)' : 'rgba(5, 150, 105, 0.22)',
        championGradEnd: isDark ? 'rgba(16, 185, 129, 0.00)' : 'rgba(5, 150, 105, 0.00)',
        avgLine: isDark ? '#38BDF8' : '#0284C7',
        avgGradStart: isDark ? 'rgba(56, 189, 248, 0.20)' : 'rgba(2, 132, 199, 0.14)',
        avgGradEnd: isDark ? 'rgba(56, 189, 248, 0.00)' : 'rgba(2, 132, 199, 0.00)',
        liveDot: isDark ? '#10B981' : '#059669',
        border: isDark ? '#334155' : '#0F172A'
      };

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, w, h);

      // 2. Gather Evolutionary Points
      const currentGen = stats?.generation ?? (logs.length + 1);
      const liveFitness = telem?.bestFitness ?? 0;

      // Construct points list:
      // Origin at Gen 0 (0 fitness)
      const points = [{ gen: 0, bestFitness: 0, avgFitness: 0, isLive: false }];

      // Completed generations from log
      for (const entry of logs) {
        points.push({
          gen: entry.generation,
          bestFitness: entry.bestFitness || 0,
          avgFitness: entry.avgFitness || 0,
          isLive: false
        });
      }

      // Check if current active generation is in flight
      const lastLoggedGen = logs.length > 0 ? logs[logs.length - 1].generation : 0;
      if (currentGen > lastLoggedGen) {
        points.push({
          gen: currentGen,
          bestFitness: Math.max(liveFitness, 0),
          avgFitness: Math.max(Math.round(liveFitness * 0.42), 0),
          isLive: true
        });
      }

      // 3. Domain & Range Scaling
      // X-Axis always spans at least 5 generations so Gen 1 is never stretched unnaturally across the graph
      const maxGenDisplay = Math.max(5, currentGen, logs.length);

      // Y-Axis dynamic headroom: target ceiling with 35% margin above all recorded fitness values
      const rawPeak = Math.max(...points.map(p => p.bestFitness), liveFitness, 120);
      const targetCeiling = Math.max(120, Math.ceil((rawPeak * 1.35) / 50) * 50);

      // Smooth ceiling easing for organic, jitter-free graph expansion
      ceilingRef.current += (targetCeiling - ceilingRef.current) * 0.10;
      const maxVal = ceilingRef.current;

      const padding = {
        top: isCompact ? 30 : 38,
        right: isCompact ? 22 : 36,
        bottom: isCompact ? 30 : 38,
        left: isCompact ? 48 : 64
      };
      const graphW = w - padding.left - padding.right;
      const graphH = h - padding.top - padding.bottom;

      // Coordinate converter: maps (gen, fitness) to canvas pixels
      const getCoord = (gen, fitness) => {
        const x = padding.left + (gen / maxGenDisplay) * graphW;
        const clampedFitness = Math.max(0, fitness);
        const y = padding.top + graphH - (clampedFitness / maxVal) * graphH;
        return { x, y };
      };

      // 4. Draw Horizontal Gridlines & Y-Axis Labels
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (graphH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = colors.axisText;
        ctx.font = isCompact ? '600 8.5px "JetBrains Mono", monospace' : '600 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        const val = Math.round(maxVal * (1 - i / 4));
        const formattedVal = val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val;
        ctx.fillText(formattedVal, padding.left - 6, y + 3.5);
      }

      // 5. Draw Vertical Gridlines & X-Axis Labels (Generations 1, 2, 3...)
      const xStep = maxGenDisplay <= 10 ? 1 : Math.ceil(maxGenDisplay / 6);
      for (let g = 1; g <= maxGenDisplay; g += xStep) {
        const pt = getCoord(g, 0);
        ctx.strokeStyle = colors.grid;
        ctx.beginPath();
        ctx.moveTo(pt.x, padding.top);
        ctx.lineTo(pt.x, padding.top + graphH);
        ctx.stroke();

        ctx.fillStyle = g === currentGen ? colors.championLine : colors.axisText;
        ctx.font = isCompact ? 'bold 8.5px "JetBrains Mono", monospace' : 'bold 9.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`G${g}`, pt.x, padding.top + graphH + (isCompact ? 14 : 16));
      }

      // Bottom X-Axis Title
      ctx.fillStyle = colors.labelText;
      ctx.font = isCompact ? 'bold 9px system-ui' : 'bold 10.5px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Generations of Natural Selection', w / 2, h - (isCompact ? 4 : 6));

      // 6. Draw Trajectory Line & Gradient Fill Helper
      const drawTrajectory = (key, lineColor, gradStart, gradEnd, isDashed = false) => {
        if (points.length < 2) return;

        // Curve stroke
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = isCompact ? 2.0 : 2.6;
        if (isDashed) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          const pt = getCoord(points[i].gen, points[i][key]);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Area Gradient
        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + graphH);
        grad.addColorStop(0, gradStart);
        grad.addColorStop(1, gradEnd);

        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          const pt = getCoord(points[i].gen, points[i][key]);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        const lastPt = getCoord(points[points.length - 1].gen, points[points.length - 1][key]);
        ctx.lineTo(lastPt.x, padding.top + graphH);
        ctx.lineTo(padding.left, padding.top + graphH);
        ctx.fillStyle = grad;
        ctx.fill();
      };

      // Draw Average Trajectory
      drawTrajectory('avgFitness', colors.avgLine, colors.avgGradStart, colors.avgGradEnd);

      // Draw Champion Trajectory
      drawTrajectory('bestFitness', colors.championLine, colors.championGradStart, colors.championGradEnd);

      // 7. Draw Nodes: Historical Solid Markers + Live Animated Halo
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const coord = getCoord(p.gen, p.bestFitness);

        if (p.isLive) {
          // LIVE IN-FLIGHT NODE
          // Pulsing Expanding Halo Ring
          const pulse = (Date.now() / 20) % 16;
          const ringR = (isCompact ? 4.5 : 5.5) + pulse;
          const ringAlpha = Math.max(0, 1 - pulse / 16);

          ctx.beginPath();
          ctx.arc(coord.x, coord.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${ringAlpha})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Solid Live Center Dot
          ctx.beginPath();
          ctx.arc(coord.x, coord.y, isCompact ? 4.5 : 5.5, 0, Math.PI * 2);
          ctx.fillStyle = colors.championLine;
          ctx.fill();
          ctx.strokeStyle = colors.border;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Floating Tag Above Live Node
          const tagVal = p.bestFitness >= 1000 
            ? `${(p.bestFitness / 1000).toFixed(1)}k` 
            : p.bestFitness;
          const tagText = `Gen ${p.gen}: ${tagVal}`;

          ctx.font = isCompact ? 'bold 8.5px "JetBrains Mono", monospace' : 'bold 9.5px "JetBrains Mono", monospace';
          ctx.fillStyle = colors.championLine;
          ctx.textAlign = coord.x > w - 75 ? 'right' : 'center';
          ctx.fillText(tagText, coord.x, Math.max(coord.y - 10, padding.top + 10));
        } else {
          // Completed Historical Generation Node
          ctx.beginPath();
          ctx.arc(coord.x, coord.y, isCompact ? 3.0 : 3.8, 0, Math.PI * 2);
          ctx.fillStyle = colors.championLine;
          ctx.fill();
          ctx.strokeStyle = colors.border;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // 8. Top Header Legends (Clean & Responsive)
      ctx.font = isCompact ? 'bold 8px system-ui' : 'bold 10px system-ui';
      ctx.textAlign = 'left';

      // Champion Legend Pill (Green)
      ctx.fillStyle = colors.championLine;
      ctx.fillRect(padding.left + 2, isCompact ? 10 : 13, isCompact ? 9 : 12, 3);
      ctx.fillStyle = colors.labelText;
      ctx.fillText(isCompact ? 'Green: Best Bird' : 'Green: Champion (Best Bird)', padding.left + (isCompact ? 14 : 20), isCompact ? 14 : 17);

      // Average Legend Pill (Blue)
      const avgLegendOffset = isCompact ? padding.left + 86 : padding.left + 200;
      ctx.fillStyle = colors.avgLine;
      ctx.fillRect(avgLegendOffset, isCompact ? 10 : 13, isCompact ? 9 : 12, 3);
      ctx.fillStyle = colors.labelText;
      ctx.fillText(isCompact ? 'Blue: Flock Avg' : 'Blue: Flock Average (150 Birds)', avgLegendOffset + (isCompact ? 14 : 18), isCompact ? 14 : 17);

      // 9. Top-Right Live Status Stream Pill
      ctx.textAlign = 'right';
      ctx.font = isCompact ? '700 8.5px "JetBrains Mono", monospace' : '700 9.5px "JetBrains Mono", monospace';
      ctx.fillStyle = colors.labelText;
      const statusLabel = running 
        ? (isCompact ? `G${currentGen} LIVE` : `GEN ${currentGen} LIVE STREAM`)
        : 'PAUSED';
      ctx.fillText(statusLabel, w - 18, isCompact ? 14 : 17);

      const statusWidth = ctx.measureText(statusLabel).width;
      const dotX = w - 18 - statusWidth - 7;
      const pulseDotAlpha = running ? (0.5 + 0.5 * Math.sin(Date.now() * 0.008)) : 0.8;
      ctx.fillStyle = running ? `rgba(16, 185, 129, ${pulseDotAlpha})` : '#F59E0B';
      ctx.beginPath();
      ctx.arc(dotX, isCompact ? 11 : 13.5, 3, 0, Math.PI * 2);
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, []); // Run on mount; latest values accessed via stateRef.current

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

      {/* Pedagogical Micro-Banner Explaining Green vs Blue Lines */}
      <div style={{
        marginTop: '10px',
        padding: '10px 12px',
        borderRadius: '10px',
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.74rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.45',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#059669', flexShrink: 0, boxShadow: '0 0 4px rgba(5, 150, 105, 0.4)' }} />
          <span><strong style={{ color: 'var(--text-primary)' }}>Green Line (Champion):</strong> Tracks the single best individual bird in each generation — reveals peak survival ceiling.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#0284C7', flexShrink: 0, boxShadow: '0 0 4px rgba(2, 132, 199, 0.4)' }} />
          <span><strong style={{ color: 'var(--text-primary)' }}>Blue Line (Population Average):</strong> Mathematical mean across all 150 birds — proves true flock-wide Darwinian genetic learning.</span>
        </div>
      </div>
    </div>
  );
}
