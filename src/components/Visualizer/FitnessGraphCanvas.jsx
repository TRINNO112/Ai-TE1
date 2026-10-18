import React, { useRef, useEffect } from 'react';

export function FitnessGraphCanvas({ generationLog }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    if (!generationLog || generationLog.length < 2) {
      ctx.fillStyle = '#64748B';
      ctx.font = '13px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Evolutionary fitness curve will plot after Generation 2...', w / 2, h / 2);
      return;
    }

    const padding = { top: 32, right: 30, bottom: 38, left: 65 };
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

      ctx.fillStyle = '#475569';
      ctx.font = '600 10px monospace';
      ctx.textAlign = 'right';
      const val = Math.round(maxVal * (1 - i / 4));
      ctx.fillText(val.toLocaleString(), padding.left - 8, y + 3);
    }

    // X Axis Label
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Generations of Natural Selection', w / 2, h - 8);

    const drawLine = (data, color, fillGrad) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = padding.left + (i / Math.max(numPoints - 1, 1)) * graphW;
        const y = padding.top + graphH - (data[i] / maxVal) * graphH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Area gradient
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

    // Legend
    ctx.font = '600 11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#059669';
    ctx.fillRect(padding.left + 8, 12, 12, 3);
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Champion Fitness', padding.left + 26, 16);

    ctx.fillStyle = '#0284C7';
    ctx.fillRect(padding.left + 145, 12, 12, 3);
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Population Average', padding.left + 163, 16);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Gen ${numPoints}`, w - padding.right, 16);

  }, [generationLog]);

  return (
    <div style={{ position: 'relative', width: '100%', minWidth: 0 }}>
      <div className="mobile-scroll-container">
        <div style={{ minWidth: '680px' }}>
          <canvas
            ref={canvasRef}
            width={780}
            height={380}
            style={{
              display: 'block',
              width: '100%',
              borderRadius: '12px',
              border: '1.5px solid var(--border-medium)',
              boxShadow: 'var(--shadow-card)',
              background: '#FFFFFF'
            }}
          />
        </div>
      </div>
      <div className="mobile-scroll-hint">
        ⇄ Swipe horizontally to inspect full fitness curve & generations
      </div>
    </div>
  );
}
