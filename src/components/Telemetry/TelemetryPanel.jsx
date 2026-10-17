import React from 'react';
import { 
  Trophy, 
  Activity, 
  Users, 
  Gauge, 
  Zap, 
  Maximize2,
  TrendingUp,
  Award
} from 'lucide-react';

export function TelemetryPanel({ telemetry, gaStats }) {
  const generation = gaStats?.generation ?? 1;
  const alive = telemetry?.alive ?? 0;
  const total = telemetry?.total ?? 150;
  const bestScore = telemetry?.bestScore ?? 0;
  const bestFitness = telemetry?.bestFitness ?? 0;
  const bestFitnessEver = gaStats?.bestFitnessEver ?? bestFitness;
  const bestScoreEver = gaStats?.bestScoreEver ?? bestScore;
  const speed = telemetry?.speed ?? 2.5;
  const gap = telemetry?.gap ?? 140;

  const cards = [
    {
      id: 'gen',
      label: 'Generation',
      value: `Gen ${generation}`,
      sub: 'Active Epoch',
      icon: <Activity size={16} color="#38bdf8" />,
      accent: 'var(--accent-sky)'
    },
    {
      id: 'alive',
      label: 'Active Agents',
      value: `${alive} / ${total}`,
      sub: `${Math.round((alive / (total || 1)) * 100)}% Surviving`,
      icon: <Users size={16} color="#34d399" />,
      accent: 'var(--accent-emerald)'
    },
    {
      id: 'score',
      label: 'Epoch Best Score',
      value: bestScore,
      sub: 'Obstacles Cleared',
      icon: <TrendingUp size={16} color="#fbbf24" />,
      accent: 'var(--accent-amber)'
    },
    {
      id: 'fitness',
      label: 'Epoch Fitness',
      value: bestFitness.toLocaleString(),
      sub: 'Objective Score',
      icon: <Gauge size={16} color="#22d3ee" />,
      accent: 'var(--accent-cyan)'
    },
    {
      id: 'best-fitness',
      label: 'Record Fitness',
      value: bestFitnessEver.toLocaleString(),
      sub: 'All-Time Champion',
      icon: <Trophy size={16} color="#fbbf24" />,
      accent: 'var(--accent-amber)'
    },
    {
      id: 'best-score',
      label: 'Record Score',
      value: bestScoreEver,
      sub: 'All-Time Peak',
      icon: <Award size={16} color="#f43f5e" />,
      accent: 'var(--accent-rose)'
    },
    {
      id: 'speed',
      label: 'Corridor Velocity',
      value: `${speed}x`,
      sub: speed > 2.5 ? 'Adaptive Ramp' : 'Cruising Velocity',
      icon: <Zap size={16} color="#38bdf8" />,
      accent: 'var(--accent-sky)'
    },
    {
      id: 'gap',
      label: 'Corridor Aperture',
      value: `${gap}px`,
      sub: gap < 140 ? 'Narrow Flight' : 'Standard Gap',
      icon: <Maximize2 size={16} color="#34d399" />,
      accent: 'var(--accent-emerald)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '12px',
      margin: '0 24px 16px 24px'
    }}>
      {cards.map(card => (
        <div 
          key={card.id}
          className="sleek-card"
          style={{
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: `3px solid ${card.accent}`,
            background: 'rgba(12, 18, 32, 0.75)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-mono)'
            }}>
              {card.label}
            </span>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {card.icon}
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.35rem',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              marginTop: '4px'
            }}>
              {card.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
