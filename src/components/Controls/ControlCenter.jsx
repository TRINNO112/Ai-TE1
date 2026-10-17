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
  Sparkles
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
    <div className="bento-card" style={{
      padding: '20px 24px',
      background: '#151d30',
      border: '2.5px solid #000000',
      boxShadow: '4px 4px 0px #000000',
      marginBottom: '16px'
    }}>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="var(--neo-yellow)" />
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: '800',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Classroom Simulation Controls
          </h3>
        </div>
        <span className="neo-pill neo-pill-yellow" style={{ fontSize: '0.68rem' }}>
          What-If Engine
        </span>
      </div>

      {/* Primary Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <button 
          onClick={onTogglePlay}
          className={`neo-btn ${isRunning ? 'neo-btn-coral' : 'neo-btn-emerald'}`}
          style={{ flex: '1 1 150px', padding: '12px 18px', fontSize: '0.92rem' }}
        >
          {isRunning ? <Pause size={18} strokeWidth={2.5} /> : <Play size={18} strokeWidth={2.5} />}
          <span>{isRunning ? 'Pause Evolution' : 'Start Evolution'}</span>
        </button>

        <button 
          onClick={onToggleFreezeFrame}
          className={`neo-btn ${freezeFrame ? 'neo-btn-coral' : 'neo-btn-cyan'}`}
          title="Pause on decision point to inspect input vector & math dot products"
          style={{ padding: '12px 16px' }}
        >
          <Camera size={18} strokeWidth={2.5} />
          <span>{freezeFrame ? 'Resume From Freeze' : 'Freeze-Frame (Inspect)'}</span>
        </button>

        <button 
          onClick={onReset}
          className="neo-btn neo-btn-neutral"
          title="Clear current population and start Generation 1"
          style={{ padding: '12px 16px' }}
        >
          <RotateCcw size={18} strokeWidth={2.5} />
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
        {/* Speed Slider */}
        <div style={{
          background: '#0f172a',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sub)', fontWeight: '700' }}>
              <FastForward size={14} color="var(--neo-yellow)" />
              <span>Sim Speed</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--neo-yellow)' }}>
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
          background: '#0f172a',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sub)', fontWeight: '700' }}>
              <Dna size={14} color="var(--neo-coral)" />
              <span>Mutation Rate</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--neo-coral)' }}>
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
          background: '#0f172a',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sub)', fontWeight: '700' }}>
              <ShieldCheck size={14} color="var(--neo-emerald)" />
              <span>Elitism (Stability)</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--neo-emerald)' }}>
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
          background: '#0f172a',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-sub)', fontWeight: '700' }}>
              <Layers size={14} color="var(--neo-purple)" />
              <span>Neural Architecture</span>
            </span>
          </div>
          <select 
            value={networkSize}
            onChange={(e) => onChangeNetworkSize(e.target.value)}
            style={{
              background: '#151d30',
              color: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '0.82rem',
              fontWeight: '700',
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
        gap: '14px',
        paddingTop: '14px',
        borderTop: '2px solid #000000',
        fontSize: '0.84rem'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#FFFFFF',
          fontWeight: '700',
          background: '#0f172a',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1.5px solid #000000'
        }}>
          <input 
            type="checkbox" 
            checked={showRaycasts} 
            onChange={(e) => onToggleRaycasts(e.target.checked)}
          />
          <Radar size={15} color="var(--neo-cyan)" />
          <span>LiDAR Sensory Rays</span>
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#FFFFFF',
          fontWeight: '700',
          background: '#0f172a',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1.5px solid #000000'
        }}>
          <input 
            type="checkbox" 
            checked={showAllBirds} 
            onChange={(e) => onToggleShowAllBirds(e.target.checked)}
          />
          <Eye size={15} color="var(--neo-yellow)" />
          <span>Show All 150 Birds</span>
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#FFFFFF',
          fontWeight: '700',
          background: '#0f172a',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1.5px solid #000000'
        }}>
          <input 
            type="checkbox" 
            checked={turboMode} 
            onChange={(e) => onToggleTurboMode(e.target.checked)}
          />
          <Zap size={15} color="var(--neo-emerald)" />
          <span>Turbo Mode (Headless 500x)</span>
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#FFFFFF',
          fontWeight: '700',
          background: '#0f172a',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1.5px solid #000000'
        }}>
          <input 
            type="checkbox" 
            checked={simpleMode} 
            onChange={(e) => onToggleSimpleMode(e.target.checked)}
          />
          <span>🌱 Simple Mode (No Wind/Moving Pipes)</span>
        </label>
      </div>
    </div>
  );
}
