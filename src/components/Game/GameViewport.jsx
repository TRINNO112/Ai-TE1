import React from 'react';
import { Zap, Activity, Crosshair } from 'lucide-react';

export function GameViewport({
  canvasRef,
  turboMode,
  turboStats,
  activeDifficulties,
  telemetry,
  gaStats,
  onToggleTurboMode
}) {
  const currentRecord = Math.max(gaStats?.bestScoreEver ?? 0, telemetry?.bestScore ?? 0);

  return (
    <div className="sleek-card" style={{
      position: 'relative',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Active Obstacles Badge Banner */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '26px',
        right: '26px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 5,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {activeDifficulties.map((diff, idx) => (
            <span key={idx} className="sleek-badge sleek-badge-sky">
              {diff}
            </span>
          ))}
        </div>
      </div>

      {/* Flappy Bird Canvas Container */}
      <div style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.5px solid var(--border-strong)',
        boxShadow: 'var(--shadow-card)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#E0F2FE'
      }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={480}
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            aspectRatio: '400 / 480',
            background: '#E0F2FE'
          }}
        />

        {/* Turbo Mode Headless Cockpit HUD */}
        {turboMode && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
            textAlign: 'center',
            zIndex: 10
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#FEF3C7',
              border: '1.5px solid #0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '2px 2px 0px #0F172A'
            }}>
              <Zap size={28} color="#D97706" />
            </div>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Headless Neural Turbo Active
            </h3>
            <p style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              maxWidth: '310px',
              fontFamily: 'var(--font-body)',
              lineHeight: '1.4'
            }}>
              Graphics pipeline detached. Executing high-frequency forward passes and generational crossovers directly in CPU cache.
            </p>

            {/* Live 6-Metric Telemetry Deck */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              width: '100%',
              maxWidth: '330px',
              background: '#F8FAFC',
              padding: '14px',
              borderRadius: '12px',
              border: '1.5px solid #0F172A',
              boxShadow: '2px 2px 0px #0F172A',
              fontFamily: 'var(--font-mono)',
              marginBottom: '18px'
            }}>
              <div style={{ textAlign: 'left', padding: '4px 6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', fontWeight: '700' }}>Epoch Gen</span>
                <div style={{ color: '#7C3AED', fontWeight: '800', fontSize: '1.15rem' }}>
                  Gen {gaStats?.generation ?? 1}
                </div>
              </div>

              <div style={{ textAlign: 'left', padding: '4px 6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', fontWeight: '700' }}>Live Epoch Score</span>
                <div style={{ color: '#0284C7', fontWeight: '800', fontSize: '1.15rem' }}>
                  {telemetry?.bestScore ?? 0}
                </div>
              </div>

              <div style={{ textAlign: 'left', padding: '4px 6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', fontWeight: '700' }}>Surviving Agents</span>
                <div style={{ color: '#059669', fontWeight: '800', fontSize: '1.15rem' }}>
                  {telemetry?.alive ?? 0} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 150</span>
                </div>
              </div>

              <div style={{ textAlign: 'left', padding: '4px 6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', fontWeight: '700' }}>All-Time Peak</span>
                <div style={{ color: '#E11D48', fontWeight: '800', fontSize: '1.15rem' }}>
                  {currentRecord}
                </div>
              </div>

              <div style={{ textAlign: 'left', padding: '4px 6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', fontWeight: '700' }}>Physics Throughput</span>
                <div style={{ color: '#D97706', fontWeight: '800', fontSize: '0.95rem' }}>
                  {(turboStats?.stepsPerSec ?? 0).toLocaleString()} <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ops/s</span>
                </div>
              </div>

              <div style={{ textAlign: 'left', padding: '4px 6px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block', fontWeight: '700' }}>Gen Rate</span>
                <div style={{ color: '#0284C7', fontWeight: '800', fontSize: '0.95rem' }}>
                  {turboStats?.gensPerSec ?? 0} <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>gen/s</span>
                </div>
              </div>
            </div>

            {/* Action Return Button */}
            <button
              onClick={onToggleTurboMode}
              className="sleek-btn sleek-btn-primary"
              style={{
                padding: '10px 22px',
                fontSize: '0.82rem',
                borderRadius: '8px'
              }}
            >
              <span>Return to Visual Cockpit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
