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
      border: '1.5px solid var(--border-medium)',
      background: '#FFFFFF',
      boxShadow: '1px 1px 0px #1E293B'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#F1F5F9', borderBottom: '1.5px solid #CBD5E1' }}>
            <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Gen</th>
            <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Best Score</th>
            <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Avg Score</th>
            <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Best Fitness</th>
            <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Avg Fitness</th>
            <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Mutation</th>
            <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {[...generationLog].reverse().map((entry, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#0284C7' }}>
                #{entry.generation}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#059669' }}>
                {entry.bestScore}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {entry.avgScore}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#D97706' }}>
                {entry.bestFitness.toLocaleString()}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {entry.avgFitness.toLocaleString()}
              </td>
              <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {Math.round(entry.mutationRate * 100)}%
              </td>
              <td style={{ padding: '7px 12px' }}>
                {entry.newRecord ? (
                  <span className="sleek-badge sleek-badge-amber" style={{ gap: '3px' }}>
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
