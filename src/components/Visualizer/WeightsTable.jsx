import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export function WeightsTable({ brain }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  if (!brain) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No brain loaded.</div>;
  }

  const table = brain.getWeightsTable();

  const filtered = table.filter(row => {
    if (filterType !== 'all' && row.type !== filterType) return false;
    if (search && !row.label.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 0 }}>
          <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="Search neuron index (e.g. L0 N3)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px 7px 30px',
              borderRadius: '8px',
              border: '1.5px solid #0F172A',
              background: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.78rem',
              fontWeight: '600',
              outline: 'none',
              boxShadow: '1px 1px 0px #0F172A',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'weight', 'bias'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`sleek-btn ${filterType === type ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
              style={{ padding: '5px 10px', fontSize: '0.74rem', textTransform: 'capitalize' }}
            >
              {type}s
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
          {filtered.length} of {table.length} params
        </div>
      </div>

      {/* Responsive Parameter Cards List (Zero Horizontal Scrollbar) */}
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
        {filtered.slice(0, 150).map((row, idx) => {
          const isPos = row.value > 0;
          const barWidth = Math.min(Math.abs(row.value) / 2, 1) * 100;

          return (
            <div 
              key={idx} 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 12px',
                borderBottom: '1px solid #E2E8F0',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                <span className={`sleek-badge ${row.type === 'weight' ? 'sleek-badge-sky' : 'sleek-badge-amber'}`} style={{ fontSize: '0.62rem', padding: '1px 5px', flexShrink: 0 }}>
                  {row.type}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#0F172A', fontWeight: '700', fontSize: '0.76rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.label}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div style={{
                  width: '44px',
                  height: '5px',
                  background: '#E2E8F0',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    background: isPos ? '#059669' : '#E11D48'
                  }} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  fontSize: '0.76rem',
                  color: isPos ? '#059669' : '#E11D48',
                  minWidth: '50px',
                  textAlign: 'right'
                }}>
                  {row.value > 0 ? `+${row.value.toFixed(3)}` : row.value.toFixed(3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
