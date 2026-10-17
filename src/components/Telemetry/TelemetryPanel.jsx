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
      sub: 'Evolution cycle',
      icon: <Activity size={18} color="#000000" strokeWidth={2.5} />,
      badgeColor: 'var(--neo-purple)',
      accent: 'var(--neo-purple)'
    },
    {
      id: 'alive',
      label: 'Alive Agents',
      value: `${alive} / ${total}`,
      sub: `${Math.round((alive / (total || 1)) * 100)}% flying`,
      icon: <Users size={18} color="#000000" strokeWidth={2.5} />,
      badgeColor: 'var(--neo-emerald)',
      accent: 'var(--neo-emerald)'
    },
    {
      id: 'score',
      label: 'Best Score',
      value: bestScore,
      sub: 'Pipes passed',
      icon: <TrendingUp size={18} color="#000000" strokeWidth={2.5} />,
      badgeColor: 'var(--neo-yellow)',
      accent: 'var(--neo-yellow)'
    },
    {
      id: 'fitness',
      label: 'Current Fitness',
      value: bestFitness.toLocaleString(),
      sub: 'Objective loss',
      icon: <Gauge size={18} color="#000000" strokeWidth={2.5} />,
      badgeColor: 'var(--neo-cyan)',
      accent: 'var(--neo-cyan)'
    },
    {
      id: 'best-fitness',
      label: '🏆 Record Fitness',
      value: bestFitnessEver.toLocaleString(),
      sub: 'All-time champion',
      icon: <Trophy size={18} color="#000000" strokeWidth={2.5} />,
      badgeColor: 'var(--neo-yellow)',
      accent: 'var(--neo-yellow)'
    },
    {
      id: 'best-score',
      label: '🏆 Record Score',
      value: bestScoreEver,
      sub: 'All-time max',
      icon: <Award size={18} color="#000000" strokeWidth={2.5} />,
      badgeColor: 'var(--neo-coral)',
      accent: 'var(--neo-coral)'
    },
    {
      id: 'speed',
      label: 'Corridor Velocity',
      value: `${speed}x`,
      sub: speed > 2.5 ? 'Adaptive Ramp' : 'Base Speed',
      icon: <Zap size={18} color="#000000" strokeWidth={2.5} />,
      badgeColor: 'var(--neo-cyan)',
      accent: 'var(--neo-cyan)'
    },
    {
      id: 'gap',
      label: 'Gap Aperture',
      value: `${gap}px`,
      sub: gap < 140 ? 'Narrowing Gap' : 'Standard Flight',
      icon: <Maximize2 size={18} color="#000000" strokeWidth={2.5} />,
      badgeColor: 'var(--neo-emerald)',
      accent: 'var(--neo-emerald)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    }}>
      {cards.map(card => (
        <div 
          key={card.id}
          className="bento-card"
          style={{
            padding: '12px 14px',
            background: '#151d30',
            border: '2.5px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            borderTop: `4px solid ${card.accent}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{
              fontSize: '0.74rem',
              color: 'var(--text-sub)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              {card.label}
            </span>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: card.badgeColor,
              border: '1.5px solid #000000',
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
              fontSize: '1.3rem',
              fontWeight: '900',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              marginTop: '3px'
            }}>
              {card.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
