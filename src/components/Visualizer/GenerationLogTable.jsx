import React from 'react';
import { Trophy, Clock } from 'lucide-react';

export function GenerationLogTable({ generationLog }) {
  if (!generationLog || generationLog.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
        Generation logs will be recorded as each evolutionary cycle finishes.
      </div>
    );
  }

  return (
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
            <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Gen</th>
            <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Best Score</th>
            <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Avg Score</th>
            <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Best Fitness</th>
            <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Avg Fitness</th>
            <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Mutation</th>
            <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {[...generationLog].reverse().map((entry, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: '#818cf8' }}>
                #{entry.generation}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#10b981' }}>
                {entry.bestScore}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {entry.avgScore}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', fontWeight: '600', color: '#f59e0b' }}>
                {entry.bestFitness.toLocaleString()}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {entry.avgFitness.toLocaleString()}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {Math.round(entry.mutationRate * 100)}%
              </td>
              <td style={{ padding: '7px 12px' }}>
                {entry.newRecord ? (
                  <span className="badge badge-amber" style={{ gap: '3px' }}>
                    <Trophy size={11} /> Record
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Evolved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
