import React from 'react';
import { Zap, Activity, Crosshair } from 'lucide-react';

export function GameViewport({
  canvasRef,
  turboMode,
  turboStats,
  activeDifficulties
}) {
  return (
    <div className="sleek-card" style={{
      position: 'relative',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(12, 18, 32, 0.85)',
      border: '1px solid var(--border-subtle)'
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
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            background: '#070a13'
          }}
        />

        {/* Turbo Mode Headless Overlay */}
        {turboMode && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(7, 10, 19, 0.94)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            zIndex: 10
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <Zap size={28} color="#fbbf24" />
            </div>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: '800',
              color: '#fef08a',
              marginBottom: '6px'
            }}>
              TURBO ACCELERATION ACTIVE
            </h3>
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              marginBottom: '18px',
              maxWidth: '300px',
              fontFamily: 'var(--font-body)'
            }}>
              Bypassing graphics pipeline to compute linear forward-passes and genetic recombination at 500x speed.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              width: '100%',
              maxWidth: '300px',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Gens / Sec</span>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '1.1rem' }}>
                  {turboStats?.gensPerSec ?? 0}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Generation</span>
                <div style={{ color: '#c084fc', fontWeight: '700', fontSize: '1.1rem' }}>
                  #{turboStats?.generation ?? 0}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Best Score</span>
                <div style={{ color: '#34d399', fontWeight: '700', fontSize: '1.1rem' }}>
                  {turboStats?.bestScore ?? 0}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Best Fitness</span>
                <div style={{ color: '#fbbf24', fontWeight: '700', fontSize: '1.1rem' }}>
                  {turboStats?.bestFitness?.toLocaleString() ?? 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
