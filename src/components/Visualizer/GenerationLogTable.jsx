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
      boxShadow: '1px 1px 0px #1E293B',
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box'
    }}>
      {[...generationLog].reverse().map((entry, idx) => (
        <div 
          key={idx} 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            borderBottom: '1px solid #E2E8F0',
            flexWrap: 'wrap',
            gap: '8px',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#0284C7', fontWeight: '800', fontSize: '0.8rem' }}>
              Gen #{entry.generation}
            </span>
            {entry.newRecord ? (
              <span className="sleek-badge sleek-badge-amber" style={{ gap: '3px', fontSize: '0.62rem', padding: '1px 5px' }}>
                <Trophy size={10} /> Record
              </span>
            ) : (
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Evolved</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
            <span>Score: <strong style={{ color: '#059669' }}>{entry.bestScore}</strong></span>
            <span>Fitness: <strong style={{ color: '#D97706' }}>{entry.bestFitness.toLocaleString()}</strong></span>
            <span>Mut: <strong style={{ color: 'var(--text-secondary)' }}>{Math.round(entry.mutationRate * 100)}%</strong></span>
          </div>
        </div>
      ))}
    </div>
  );
}
