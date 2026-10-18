import React from 'react';
import { ArrowUp, ArrowRight, Activity } from 'lucide-react';

export function DecisionsViewer({ bestBird }) {
  const history = bestBird ? bestBird.decisionHistory : [];

  if (!bestBird || history.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
        Decision telemetry stream will begin when champion bird is flying.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
        Real-time telemetry trace of champion bird's last 20 neural evaluations:
      </div>

      <div style={{
        maxHeight: '340px',
        overflowY: 'auto',
        borderRadius: '8px',
        border: '1.5px solid var(--border-medium)',
        background: '#FFFFFF',
        boxShadow: '1px 1px 0px #1E293B',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {[...history].reverse().map((d, idx) => {
          const isFlap = d.action === 'FLAP';
          return (
            <div 
              key={idx} 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '7px 12px',
                borderBottom: '1px solid #E2E8F0',
                gap: '8px',
                flexWrap: 'wrap',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  #{d.frame}
                </span>
                <span className={`sleek-badge ${isFlap ? 'sleek-badge-emerald' : 'sleek-badge-sky'}`} style={{ gap: '3px', fontSize: '0.68rem', padding: '1px 5px' }}>
                  {isFlap ? <ArrowUp size={11} /> : <ArrowRight size={11} />}
                  {d.action}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '0.76rem', color: isFlap ? '#059669' : '#0284C7' }}>
                  {(d.output * 100).toFixed(0)}%
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                <span>Alt: <strong style={{ color: '#0F172A' }}>{d.inputs[0]}</strong></span>
                <span>Dist: <strong style={{ color: '#0F172A' }}>{d.inputs[2]}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
