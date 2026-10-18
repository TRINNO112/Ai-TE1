import React, { useRef, useEffect } from 'react';

export function FitnessGraphCanvas({ generationLog }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    const draw = () => {
      const containerW = container.clientWidth || 400;
      const isCompact = containerW < 520;
      const targetW = Math.max(300, Math.floor(containerW));
      const targetH = isCompact ? 260 : 360;

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      if (!generationLog || generationLog.length < 2) {
        ctx.fillStyle = '#64748B';
        ctx.font = isCompact ? '11px system-ui' : '13px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Evolutionary fitness curve will plot after Generation 2...', w / 2, h / 2);
        return;
      }

      const padding = { 
        top: isCompact ? 26 : 34, 
        right: isCompact ? 16 : 28, 
        bottom: isCompact ? 28 : 36, 
        left: isCompact ? 46 : 64 
      };
      const graphW = w - padding.left - padding.right;
      const graphH = h - padding.top - padding.bottom;

      const bestFitnesses = generationLog.map(g => g.bestFitness);
      const avgFitnesses = generationLog.map(g => g.avgFitness);
      const maxVal = Math.max(...bestFitnesses, 100);
      const numPoints = generationLog.length;

      // Horizontal gridlines & Y labels
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (graphH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = '#64748B';
        ctx.font = isCompact ? '600 8.5px monospace' : '600 10px monospace';
        ctx.textAlign = 'right';
        const val = Math.round(maxVal * (1 - i / 4));
        const formattedVal = val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val;
        ctx.fillText(formattedVal, padding.left - 6, y + 3);
      }

      // X Axis Label
      ctx.fillStyle = '#0F172A';
      ctx.font = isCompact ? 'bold 9.5px system-ui' : 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Generations of Natural Selection', w / 2, h - 8);

      const drawLine = (data, color, fillGrad) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = isCompact ? 1.8 : 2.4;
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
          const x = padding.left + (i / Math.max(numPoints - 1, 1)) * graphW;
          const y = padding.top + graphH - (data[i] / maxVal) * graphH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        if (fillGrad) {
          ctx.lineTo(padding.left + graphW, padding.top + graphH);
          ctx.lineTo(padding.left, padding.top + graphH);
          ctx.fillStyle = fillGrad;
          ctx.fill();
        }
      };

      // Draw average line
      const avgGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + graphH);
      avgGrad.addColorStop(0, 'rgba(2, 132, 199, 0.16)');
      avgGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      drawLine(avgFitnesses, '#0284C7', avgGrad);

      // Draw best line
      const bestGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + graphH);
      bestGrad.addColorStop(0, 'rgba(5, 150, 105, 0.22)');
      bestGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');
      drawLine(bestFitnesses, '#059669', bestGrad);

      // Top Header Legend
      ctx.font = isCompact ? '600 9px system-ui' : '600 11px system-ui';
      ctx.textAlign = 'left';

      // Champion Legend
      ctx.fillStyle = '#059669';
      ctx.fillRect(padding.left + 4, isCompact ? 10 : 14, isCompact ? 9 : 12, 3);
      ctx.fillStyle = '#0F172A';
      ctx.fillText(isCompact ? 'Top Fitness' : 'Champion Fitness', padding.left + (isCompact ? 16 : 22), isCompact ? 14 : 18);

      // Average Legend
      const avgLegendOffset = isCompact ? padding.left + 88 : padding.left + 150;
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(avgLegendOffset, isCompact ? 10 : 14, isCompact ? 9 : 12, 3);
      ctx.fillStyle = '#0F172A';
      ctx.fillText(isCompact ? 'Avg' : 'Population Average', avgLegendOffset + (isCompact ? 14 : 18), isCompact ? 14 : 18);

      // Current Gen Count
      ctx.fillStyle = '#0F172A';
      ctx.font = isCompact ? 'bold 9.5px monospace' : 'bold 11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Gen ${numPoints}`, w - padding.right, isCompact ? 14 : 18);
    };

    draw();

    const resizeObserver = new ResizeObserver(() => {
      draw();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [generationLog]);

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
          background: '#FFFFFF',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}
