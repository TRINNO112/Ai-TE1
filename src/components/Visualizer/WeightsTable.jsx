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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          position: 'relative',
          flex: '1 1 200px'
        }}>
          <Search size={14} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="Search neuron index (e.g. L0 N3)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: '8px',
              border: '1.5px solid #0F172A',
              background: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.82rem',
              fontWeight: '600',
              outline: 'none',
              boxShadow: '1px 1px 0px #0F172A'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'weight', 'bias'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`sleek-btn ${filterType === type ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem', textTransform: 'capitalize' }}
            >
              {type}s
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
          Showing {filtered.length} of {table.length} parameters
        </div>
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
              <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Type</th>
              <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Synaptic / Node Identifier</th>
              <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800' }}>Magnitude / Polarity</th>
              <th style={{ padding: '8px 12px', color: '#0F172A', fontWeight: '800', textAlign: 'right' }}>Learned Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 150).map((row, idx) => {
              const isPos = row.value > 0;
              const barWidth = Math.min(Math.abs(row.value) / 2, 1) * 100;

              return (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '7px 12px' }}>
                    <span className={`sleek-badge ${row.type === 'weight' ? 'sleek-badge-sky' : 'sleek-badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                      {row.type}
                    </span>
                  </td>
                  <td style={{ padding: '7px 12px', fontFamily: 'var(--font-mono)', color: '#0F172A', fontWeight: '600' }}>
                    {row.label}
                  </td>
                  <td style={{ padding: '7px 12px', width: '140px' }}>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: '#E2E8F0',
                      border: '1px solid #0F172A',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${barWidth}%`,
                        height: '100%',
                        background: isPos ? '#059669' : '#E11D48'
                      }} />
                    </div>
                  </td>
                  <td style={{
                    padding: '7px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '600',
                    color: isPos ? '#34d399' : '#fb7185',
                    textAlign: 'right'
                  }}>
                    {row.value > 0 ? `+${row.value.toFixed(4)}` : row.value.toFixed(4)}
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
