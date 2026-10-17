import React from 'react';
import { Zap, Activity } from 'lucide-react';

export function GameViewport({
  canvasRef,
  turboMode,
  turboStats,
  activeDifficulties
}) {
  return (
    <div className="bento-card" style={{
      position: 'relative',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#151d30',
      border: '2.5px solid #000000',
      boxShadow: '4px 4px 0px #000000',
      borderRadius: '18px'
    }}>
      {/* Active Obstacles Badge Banner */}
      <div style={{
        position: 'absolute',
        top: '22px',
        left: '24px',
        right: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 5,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {activeDifficulties.map((diff, idx) => (
            <span key={idx} className="neo-pill neo-pill-purple">
              {diff}
            </span>
          ))}
        </div>
      </div>

      {/* Flappy Bird Canvas Container */}
      <div style={{
        position: 'relative',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '2.5px solid #000000',
        boxShadow: '3px 3px 0px #000000'
      }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            background: '#090d16'
          }}
        />

        {/* Turbo Mode Headless Overlay */}
        {turboMode && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(11, 15, 25, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            zIndex: 10
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'var(--neo-yellow)',
              border: '2.5px solid #000000',
              boxShadow: '3px 3px 0px #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Zap size={36} color="#000000" strokeWidth={2.5} />
            </div>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: '900',
              color: 'var(--neo-yellow)',
              marginBottom: '6px'
            }}>
              TURBO ACCELERATION ACTIVE
            </h3>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-sub)',
              marginBottom: '20px',
              maxWidth: '320px',
              fontFamily: 'var(--font-body)'
            }}>
              Bypassing canvas rendering to execute matrix forward-propagation and genetic selection at 500x headless speed.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              width: '100%',
              maxWidth: '320px',
              background: '#0f172a',
              padding: '14px',
              borderRadius: '12px',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Gens / Sec</span>
                <div style={{ color: 'var(--neo-cyan)', fontWeight: '800', fontSize: '1.2rem' }}>
                  {turboStats?.gensPerSec ?? 0}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Generation</span>
                <div style={{ color: 'var(--neo-purple)', fontWeight: '800', fontSize: '1.2rem' }}>
                  #{turboStats?.generation ?? 0}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Best Score</span>
                <div style={{ color: 'var(--neo-emerald)', fontWeight: '800', fontSize: '1.2rem' }}>
                  {turboStats?.bestScore ?? 0}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Best Fitness</span>
                <div style={{ color: 'var(--neo-yellow)', fontWeight: '800', fontSize: '1.2rem' }}>
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
