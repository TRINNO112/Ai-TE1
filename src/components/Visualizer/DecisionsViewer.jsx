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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        Real-time telemetry trace of champion bird's last 20 neural evaluations:
      </div>

      <div style={{
        maxHeight: '340px',
        overflowY: 'auto',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        background: 'rgba(11, 15, 25, 0.6)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Frame</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Action</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Sigmoid Output</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Altitude (y)</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Distance to Pipe</th>
            </tr>
          </thead>
          <tbody>
            {[...history].reverse().map((d, idx) => {
              const isFlap = d.action === 'FLAP';
              return (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    #{d.frame}
                  </td>
                  <td style={{ padding: '7px 12px' }}>
                    <span className={`badge ${isFlap ? 'badge-emerald' : 'badge-cyan'}`} style={{ gap: '4px' }}>
                      {isFlap ? <ArrowUp size={12} /> : <ArrowRight size={12} />}
                      {d.action}
                    </span>
                  </td>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: isFlap ? '#34d399' : '#94a3b8' }}>
                    {d.output}
                  </td>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)' }}>
                    {d.inputs[0]}
                  </td>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)' }}>
                    {d.inputs[2]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
