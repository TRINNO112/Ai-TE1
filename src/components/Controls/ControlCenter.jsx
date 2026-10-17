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
  Compass
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '18px'
      }}>
        {/* Speed Slider */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '12px 14px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <FastForward size={14} color="#38bdf8" />
              <span>Simulation Speed</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38bdf8' }}>
              {speed}x
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={speed}
            onChange={(e) => onChangeSpeed(parseInt(e.target.value))}
          />
        </div>

        {/* Mutation Slider */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '12px 14px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Dna size={14} color="#f59e0b" />
              <span>Mutation Rate</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#fbbf24' }}>
              {Math.round(mutationRate * 100)}%
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={Math.round(mutationRate * 100)}
            onChange={(e) => onChangeMutation(parseInt(e.target.value) / 100)}
          />
        </div>

        {/* Elitism Slider */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '12px 14px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Elitism (Stability)</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34d399' }}>
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
        </div>

        {/* Topology Selector */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '12px 14px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
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
              padding: '6px 10px',
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
