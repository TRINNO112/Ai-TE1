import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Sliders, 
  Dna, 
  ShieldCheck, 
  Eye, 
  Zap, 
  Radar, 
  Camera,
  Layers,
  Sparkles,
  Compass,
  Lock,
  Gauge
} from 'lucide-react';

export function ControlCenter({
  isRunning,
  onTogglePlay,
  onReset,
  speed,
  onChangeSpeed,
  elitismRate,
  onChangeElitism,
  mutationRate,
  onChangeMutation,
  networkSize,
  onChangeNetworkSize,
  showAllBirds,
  onToggleShowAllBirds,
  turboMode,
  onToggleTurboMode,
  simpleMode,
  onToggleSimpleMode,
  showRaycasts,
  onToggleRaycasts,
  freezeFrame,
  onToggleFreezeFrame
}) {
  const SPEED_PRESETS = [1, 2, 5, 10, 25, 50, 100];
  const MUTATION_PRESETS = [
    { label: '5% Stable', val: 0.05 },
    { label: '15% Standard', val: 0.15 },
    { label: '30% Dynamic', val: 0.30 },
    { label: '45% Exploratory', val: 0.45 },
    { label: '60% Chaos', val: 0.60 }
  ];
  const ELITISM_PRESETS = [
    { label: '2% (Top 3)', val: 0.02 },
    { label: '5% (Top 7)', val: 0.05 },
    { label: '10% (Top 15)', val: 0.10 },
    { label: '20% (Top 30)', val: 0.20 }
  ];

  return (
    <div className="sleek-card" style={{
      padding: '20px 24px',
      background: 'rgba(12, 18, 32, 0.85)',
      border: '1px solid var(--border-subtle)'
    }}>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={17} color="#38bdf8" />
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Simulation Command Deck
          </h3>
        </div>
        <span className="sleek-badge sleek-badge-sky">
          What-If Laboratory
        </span>
      </div>

      {/* Primary Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <button 
          onClick={onTogglePlay}
          className={`sleek-btn ${isRunning ? 'sleek-btn-rose' : 'sleek-btn-emerald'}`}
          style={{ flex: '1 1 150px', padding: '12px 20px', fontSize: '0.88rem' }}
        >
          {isRunning ? <Pause size={17} /> : <Play size={17} />}
          <span>{isRunning ? 'Pause Evolution' : 'Start Evolution'}</span>
        </button>

        <button 
          onClick={onToggleFreezeFrame}
          className={`sleek-btn ${freezeFrame ? 'sleek-btn-rose' : 'sleek-btn-neutral'}`}
          title="Pause on decision point to inspect input vector & math dot products"
          style={{ padding: '12px 18px', fontSize: '0.88rem' }}
        >
          <Camera size={16} color={freezeFrame ? '#ffffff' : '#38bdf8'} />
          <span>{freezeFrame ? 'Resume From Freeze' : 'Freeze-Frame (Inspect)'}</span>
        </button>

        <button 
          onClick={onReset}
          className="sleek-btn sleek-btn-neutral"
          title="Clear current population and start Generation 1"
          style={{ padding: '12px 16px' }}
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '18px'
      }}>
        {/* Speed Slider & Multi-Physics Presets */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <FastForward size={14} color="#38bdf8" />
              <span>Simulation Speed</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38bdf8', fontSize: '0.95rem' }}>
                {speed}x
              </span>
              <span className={`sleek-badge ${speed >= 50 ? 'sleek-badge-amber' : speed >= 10 ? 'sleek-badge-cyan' : 'sleek-badge-slate'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                {speed >= 50 ? 'Hyperwarp' : speed >= 10 ? 'High Speed' : 'Realtime'}
              </span>
            </div>
          </div>

          <input 
            type="range" 
            min="1" 
            max="100" 
            value={speed}
            onChange={(e) => onChangeSpeed(parseInt(e.target.value))}
          />

          {/* Quick Preset Buttons */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
            {SPEED_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => onChangeSpeed(p)}
                className={`sleek-pill ${speed === p ? 'sleek-pill-active' : ''}`}
              >
                {p}x
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
            Sub-stepped at 60 FPS: {speed} physics cycles per frame, 0% GPU strain.
          </div>
        </div>

        {/* Mutation Rate Slider with Strict Manual Lock */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Dna size={14} color="#f59e0b" />
              <span>Genetic Variation</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#fbbf24', fontSize: '0.95rem' }}>
                {Math.round(mutationRate * 100)}%
              </span>
              <span className="sleek-badge sleek-badge-emerald" style={{ fontSize: '0.62rem', padding: '2px 6px' }} title="Manual lock active: system will never automatically change your rate">
                <Lock size={10} style={{ marginRight: '3px' }} />
                Locked
              </span>
            </div>
          </div>

          <input 
            type="range" 
            min="1" 
            max="80" 
            value={Math.round(mutationRate * 100)}
            onChange={(e) => onChangeMutation(parseInt(e.target.value) / 100)}
          />

          {/* Quick Mutation Presets */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
            {MUTATION_PRESETS.map((p) => {
              const isActive = Math.round(mutationRate * 100) === Math.round(p.val * 100);
              return (
                <button
                  key={p.val}
                  onClick={() => onChangeMutation(p.val)}
                  className={`sleek-pill ${isActive ? 'sleek-pill-amber-active' : ''}`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
            Manual control preserved across all generations.
          </div>
        </div>

        {/* Elitism Slider */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Elitism (Stability)</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34d399', fontSize: '0.95rem' }}>
              {Math.round(elitismRate * 100)}%
            </span>
          </div>

          <input 
            type="range" 
            min="1" 
            max="50" 
            value={Math.round(elitismRate * 100)}
            onChange={(e) => onChangeElitism(parseInt(e.target.value) / 100)}
          />

          {/* Quick Elitism Presets */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
            {ELITISM_PRESETS.map((p) => {
              const isActive = Math.round(elitismRate * 100) === Math.round(p.val * 100);
              return (
                <button
                  key={p.val}
                  onClick={() => onChangeElitism(p.val)}
                  className={`sleek-pill ${isActive ? 'sleek-pill-active' : ''}`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
            Guarantees top champions survive unmodified.
          </div>
        </div>

        {/* Topology Selector */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Layers size={14} color="#a855f7" />
              <span>Neural Architecture</span>
            </span>
          </div>
          <select 
            value={networkSize}
            onChange={(e) => onChangeNetworkSize(e.target.value)}
            style={{
              background: '#0a0f1d',
              color: '#ffffff',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              padding: '8px 10px',
              fontSize: '0.82rem',
              fontWeight: '600',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="small">Small [9 → 8 → 1] (81 params)</option>
            <option value="medium">Medium [9 → 12 → 12 → 1] (285 params)</option>
            <option value="large">Large [9 → 20 → 20 → 1] (641 params)</option>
            <option value="xlarge">XL [9 → 32 → 32 → 1] (1,377 params)</option>
          </select>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
            Adjusts parameter capacity for complex dynamic barriers.
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.82rem'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <input 
            type="checkbox" 
            checked={showRaycasts} 
            onChange={(e) => onToggleRaycasts(e.target.checked)}
            style={{ accentColor: '#0ea5e9' }}
          />
          <Radar size={14} color="#38bdf8" />
          <span>LiDAR Sensory Rays</span>
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <input 
            type="checkbox" 
            checked={showAllBirds} 
            onChange={(e) => onToggleShowAllBirds(e.target.checked)}
            style={{ accentColor: '#0ea5e9' }}
          />
          <Eye size={14} color="#38bdf8" />
          <span>Show All 150 Agents</span>
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <input 
            type="checkbox" 
            checked={turboMode} 
            onChange={(e) => onToggleTurboMode(e.target.checked)}
            style={{ accentColor: '#eab308' }}
          />
          <Zap size={14} color="#fbbf24" />
          <span>Turbo Acceleration (500x Headless)</span>
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <input 
            type="checkbox" 
            checked={simpleMode} 
            onChange={(e) => onToggleSimpleMode(e.target.checked)}
            style={{ accentColor: '#10b981' }}
          />
          <span>Simplified Obstacles (No Wind/Oscillations)</span>
        </label>
      </div>
    </div>
  );
}
