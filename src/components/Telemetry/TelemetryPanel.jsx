import React from 'react';
import { 
  Trophy, 
  Activity, 
  Users, 
  Gauge, 
  Zap, 
  Award,
  Flame,
  CheckCircle2
} from 'lucide-react';

import { formatCompactNumber } from '../../utils/numberFormat.js';

export function TelemetryPanel({ telemetry, gaStats, obstaclesEnabled = false }) {
  const generation = gaStats?.generation ?? 1;
  const alive = telemetry?.alive ?? 0;
  const total = telemetry?.total ?? 150;
  const survivalPct = Math.round((alive / (total || 1)) * 100);
  
  const bestScore = telemetry?.bestScore ?? 0;
  const bestScoreEver = Math.max(gaStats?.bestScoreEver ?? 0, bestScore);
  const isScoreRecord = bestScore > 0 && bestScore >= (gaStats?.bestScoreEver ?? 0);

  const bestFitness = telemetry?.bestFitness ?? 0;
  const bestFitnessEver = Math.max(gaStats?.bestFitnessEver ?? 0, bestFitness);
  const isFitnessRecord = bestFitness > 0 && bestFitness >= (gaStats?.bestFitnessEver ?? 0);

  const speed = telemetry?.speed ?? 2.0;
  const gap = telemetry?.gap ?? 160;

  const pods = [
    {
      id: 'gen',
      label: 'GENERATION',
      value: `Gen ${generation}`,
      sub: 'Active Epoch Cycle',
      badge: null,
      icon: <Activity size={18} color="#38bdf8" />,
      accent: 'var(--accent-sky)'
    },
    {
      id: 'flock',
      label: 'FLOCK SURVIVAL',
      value: `${alive} / ${total}`,
      sub: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <div style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${survivalPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '600' }}>
            {survivalPct}%
          </span>
        </div>
      ),
      icon: <Users size={18} color="#34d399" />,
      accent: 'var(--accent-emerald)'
    },
    {
      id: 'score',
      label: obstaclesEnabled ? 'OBSTACLES CLEARED' : 'OBSTACLES STATUS',
      value: obstaclesEnabled ? bestScore : 'Disarmed',
      sub: obstaclesEnabled ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.72rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>All-Time Peak:</span>
          <strong style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{bestScoreEver}</strong>
        </div>
      ) : (
        <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#38bdf8' }}>
          Open Runway • Hover Training
        </div>
      ),
      badge: obstaclesEnabled ? (
        isScoreRecord && bestScore > 0 ? (
          <span className="sleek-badge sleek-badge-amber" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
            <Flame size={10} style={{ marginRight: '3px' }} /> Record
          </span>
        ) : null
      ) : (
        <span className="sleek-badge sleek-badge-sky" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
          Open Sky
        </span>
      ),
      icon: <Trophy size={18} color="#fbbf24" />,
      accent: 'var(--accent-amber)'
    },
    {
      id: 'fitness',
      label: 'NEURAL FITNESS',
      value: formatCompactNumber(bestFitness),
      fullValue: `Current: ${Math.round(bestFitness).toLocaleString()} | Peak: ${Math.round(bestFitnessEver).toLocaleString()}`,
      sub: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.72rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Peak:</span>
          <strong style={{ color: '#22d3ee', fontFamily: 'var(--font-mono)' }}>
            {formatCompactNumber(bestFitnessEver)}
          </strong>
        </div>
      ),
      badge: isFitnessRecord && bestFitness > 0 ? (
        <span className="sleek-badge sleek-badge-sky" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
          <CheckCircle2 size={10} style={{ marginRight: '3px' }} /> Peak
        </span>
      ) : null,
      icon: <Gauge size={18} color="#22d3ee" />,
      accent: 'var(--accent-cyan)'
    },
    {
      id: 'corridor',
      label: 'FLIGHT CORRIDOR',
      value: `${speed}x Velocity`,
      sub: (
        <div style={{ marginTop: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Aperture: <strong style={{ color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>{gap}px</strong> • {gap < 140 ? 'Narrow' : 'Standard'}
        </div>
      ),
      badge: null,
      icon: <Zap size={18} color="#a78bfa" />,
      accent: 'var(--accent-violet)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '14px',
      margin: '0 24px 18px 24px'
    }}>
      {pods.map(pod => (
        <div 
          key={pod.id}
          className="sleek-card"
          title={pod.fullValue || undefined}
          style={{
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: `3px solid ${pod.accent}`,
            background: 'rgba(12, 18, 32, 0.78)',
            minHeight: '100px'
          }}
        >
          {/* Top Label & Icon Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
                fontWeight: '700',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap'
              }}>
                {pod.label}
              </span>
              {pod.badge}
            </div>

            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {pod.icon}
            </div>
          </div>

          {/* Primary Metric & Contextual Subtext */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.45rem',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {pod.value}
            </div>

            <div style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              marginTop: '4px'
            }}>
              {typeof pod.sub === 'string' ? pod.sub : pod.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

