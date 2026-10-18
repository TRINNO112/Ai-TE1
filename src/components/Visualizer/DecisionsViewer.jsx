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
        border: '1.5px solid var(--border-medium)',
        background: '#FFFFFF',
        boxShadow: '1px 1px 0px #1E293B'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F1F5F9', borderBottom: '1.5px solid #CBD5E1' }}>
              <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Frame</th>
              <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Action</th>
              <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Sigmoid Output</th>
              <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Altitude (y)</th>
              <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Distance to Pipe</th>
            </tr>
          </thead>
          <tbody>
            {[...history].reverse().map((d, idx) => {
              const isFlap = d.action === 'FLAP';
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    #{d.frame}
                  </td>
                  <td style={{ padding: '7px 12px' }}>
                    <span className={`sleek-badge ${isFlap ? 'sleek-badge-emerald' : 'sleek-badge-sky'}`} style={{ gap: '4px' }}>
                      {isFlap ? <ArrowUp size={12} /> : <ArrowRight size={12} />}
                      {d.action}
                    </span>
                  </td>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: isFlap ? '#059669' : '#0284C7' }}>
                    {d.output}
                  </td>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: '#0F172A' }}>
                    {d.inputs[0]}
                  </td>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: '#0F172A' }}>
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
