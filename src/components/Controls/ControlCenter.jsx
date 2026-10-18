import React, { useState } from 'react';
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
  GraduationCap,
  Flame,
  BrainCircuit,
  Compass,
  Lock,
  Gauge,
  Info,
  ShieldAlert,
  Shield
} from 'lucide-react';

/**
 * Infographic Icon with clean educational tooltip for students & teachers
 */
function InfoTip({ title, content }) {
  const [open, setOpen] = useState(false);

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(prev => !prev);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{
          background: 'none',
          border: 'none',
          padding: '2px',
          cursor: 'pointer',
          color: open ? '#38bdf8' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.15s ease'
        }}
        title="Click or hover for student explanation"
      >
        <Info size={13} />
      </button>

      {open && (
        <span style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          width: '230px',
          background: '#0c1220',
          border: '1px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '0.72rem',
          color: '#e2e8f0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
          zIndex: 1000,
          pointerEvents: 'none',
          lineHeight: '1.4',
          textAlign: 'left'
        }}>
          {title && <span style={{ display: 'block', fontWeight: '700', color: '#38bdf8', marginBottom: '4px' }}>{title}</span>}
          <span>{content}</span>
        </span>
      )}
    </span>
  );
}

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
  onToggleFreezeFrame,
  obstaclesEnabled = false,
  onToggleObstacles
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

  const SCENARIOS = [
    {
      id: 'quick',
      title: 'Student Demo',
      badge: 'Fast Learning',
      arch: 'small',
      mutation: 0.15,
      elitism: 0.05,
      desc: 'Small [9→8→1]. Learns level flight in 2–4 gens. Perfect for classroom.',
      icon: <GraduationCap size={14} color="#38bdf8" />
    },
    {
      id: 'balanced',
      title: 'NCERT Standard',
      badge: 'Golden Ratio',
      arch: 'medium',
      mutation: 0.15,
      elitism: 0.05,
      desc: 'Medium [9→12→12→1]. Balances exploration and memory for moving gaps.',
      icon: <BrainCircuit size={14} color="#34d399" />
    },
    {
      id: 'deep',
      title: 'UAV Autopilot',
      badge: 'Deep Capacity',
      arch: 'large',
      mutation: 0.10,
      elitism: 0.10,
      desc: 'Large [9→20→20→1]. High-capacity weights for wind shear foresight.',
      icon: <Compass size={14} color="#c084fc" />
    },
    {
      id: 'chaos',
      title: 'Chaos Escape',
      badge: 'High Variance',
      arch: 'medium',
      mutation: 0.45,
      elitism: 0.02,
      desc: 'High 45% mutation to escape stagnation when drones trap in local minima.',
      icon: <Flame size={14} color="#fbbf24" />
    }
  ];

  return (
    <div className="sleek-card" style={{
      padding: '20px 24px',
      minWidth: 0,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={17} color="#0284C7" />
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Simulation Command Deck
          </h3>
          <InfoTip 
            title="Command Deck" 
            content="Real-time control parameters for the Genetic Algorithm and physical flight environment. Changes take effect on the current population instantly."
          />
        </div>
        <span className="sleek-badge sleek-badge-sky">
          What-If Laboratory
        </span>
      </div>

      {/* Primary Action Buttons (Mobile Vertical Stacking) */}
      <div className="app-control-primary-actions">
        <button 
          onClick={onTogglePlay}
          className={`sleek-btn ${isRunning ? 'sleek-btn-rose' : 'sleek-btn-emerald'}`}
          style={{ flex: '1 1 180px', padding: '12px 20px', fontSize: '0.9rem' }}
        >
          {isRunning ? <Pause size={17} /> : <Play size={17} />}
          <span>{isRunning ? 'Pause Evolution' : 'Start Evolution'}</span>
        </button>

        <div className="app-control-sub-actions">
          <button 
            onClick={onToggleFreezeFrame}
            className={`sleek-btn ${freezeFrame ? 'sleek-btn-rose' : 'sleek-btn-neutral'}`}
            title="Pause on decision point to inspect input vector & math dot products"
            style={{ padding: '12px 18px', fontSize: '0.88rem' }}
          >
            <Camera size={16} color={freezeFrame ? '#ffffff' : '#0284C7'} />
            <span>{freezeFrame ? 'Resume' : 'Freeze-Frame'}</span>
          </button>

          <button 
            onClick={onReset}
            className="sleek-btn sleek-btn-neutral"
            title="Clear current population and start Generation 1"
            style={{ padding: '12px 16px' }}
          >
            <RotateCcw size={16} color="#E11D48" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Obstacles Activation Mode Card (Normal condition: Disarmed by default) */}
      <div style={{
        background: obstaclesEnabled ? 'var(--hazard-bg)' : 'var(--corridor-bg)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: 'var(--shadow-btn)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {obstaclesEnabled ? <ShieldAlert size={18} color="#D97706" /> : <Shield size={18} color="#059669" />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                Obstacles Mode: {obstaclesEnabled ? 'Dynamic Hazards Active (Wind & Motion)' : 'Standard Corridor (Static Pipes)'}
              </span>
              <span className={`sleek-badge ${obstaclesEnabled ? 'sleek-badge-amber' : 'sleek-badge-emerald'}`} style={{ fontSize: '0.62rem' }}>
                {obstaclesEnabled ? 'Dynamic Hazards' : 'Normal: Static Pipes'}
              </span>
              <InfoTip
                title="Obstacles Mode Configuration"
                content="Under normal conditions, standard static pipes spawn continuously so birds learn level gap clearance. Activate Dynamic Hazards only when you want to introduce oscillating moving pipes, wind shear, and variable speed."
              />
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: '500' }}>
              {obstaclesEnabled 
                ? 'Dynamic hazards active: Moving oscillating pipes, wind shear zones, and variable speed scaling.' 
                : 'Standard corridor active: Fixed static pipes spawn continuously for steady gap clearance.'}
            </div>
          </div>
        </div>

        <button
          onClick={onToggleObstacles}
          className={`sleek-btn ${obstaclesEnabled ? 'sleek-btn-amber' : 'sleek-btn-emerald'}`}
          style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }}
        >
          {obstaclesEnabled ? 'Deactivate Hazards (Return to Static Pipes)' : 'Activate Dynamic Hazards (Wind & Motion)'}
        </button>
      </div>

      {/* Pedagogical Architectural Scenarios */}
      <div style={{
        background: 'var(--bg-subtle)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '12px',
        padding: '12px 14px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-btn)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pedagogical Scenarios & Presets
            </span>
            <InfoTip
              title="Classroom Presets"
              content="Pre-calibrated parameter sets designed for teachers demonstrating AI concepts: quick learning for 3-minute demos, golden ratio for standards, and high mutation to escape local minima."
            />
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            One-click calibration
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '8px' }}>
          {SCENARIOS.map(sc => {
            const isMatch = networkSize === sc.arch && Math.round(mutationRate * 100) === Math.round(sc.mutation * 100);
            return (
              <button
                key={sc.id}
                onClick={() => {
                  onChangeNetworkSize(sc.arch);
                  onChangeMutation(sc.mutation);
                  onChangeElitism(sc.elitism);
                }}
                className="sleek-btn"
                style={{
                  padding: '8px 10px',
                  fontSize: '0.74rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  border: isMatch ? '1.5px solid var(--border-strong)' : '1.5px solid var(--border-subtle)',
                  background: isMatch ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  boxShadow: isMatch ? 'var(--shadow-btn)' : '1px 1px 0px var(--border-medium)',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: '800', width: '100%', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {sc.icon}
                    <span>{sc.title}</span>
                  </span>
                  <span className={`sleek-badge ${isMatch ? 'sleek-badge-sky' : 'sleek-badge-slate'}`} style={{ fontSize: '0.58rem', padding: '1px 4px' }}>
                    {sc.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.25', fontWeight: '500' }}>
                  {sc.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '16px'
      }}>
        {/* Speed Slider & Multi-Physics Presets */}
        <div style={{
          background: 'var(--bg-subtle)',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: '1px 1px 0px #1E293B',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              <FastForward size={14} color="#0284C7" />
              <span>Simulation Speed</span>
              <InfoTip
                title="Simulation Speed"
                content="Accelerates physics evaluations per frame (up to 100x). Higher speeds calculate multiple mathematical steps per render frame so you can evolve 50 generations in minutes."
              />
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#0284C7', fontSize: '0.95rem' }}>
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

          {/* Quick Speed Presets */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
            {SPEED_PRESETS.map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`sleek-pill ${speed === s ? 'sleek-pill-active' : ''}`}
              >
                {s}x
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
            Fast-forwards multi-generational convergence seamlessly.
          </div>
        </div>

        {/* Mutation Rate Slider */}
        <div style={{
          background: 'var(--bg-subtle)',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-btn)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              <Dna size={14} color="#059669" />
              <span>Mutation Rate</span>
              <InfoTip
                title="Mutation Rate (DNA Variation)"
                content="How frequently child neural weights are modified. Low (5%) creates slight adjustments; High (45%) introduces exploratory chaos to escape local minima traps."
              />
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#059669', fontSize: '0.95rem' }}>
                {Math.round(mutationRate * 100)}%
              </span>
              <span className={`sleek-badge ${mutationRate >= 0.4 ? 'sleek-badge-amber' : mutationRate >= 0.15 ? 'sleek-badge-emerald' : 'sleek-badge-slate'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                {mutationRate >= 0.4 ? 'High Variance' : mutationRate >= 0.15 ? 'Optimal' : 'Conservative'}
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
                  className={`sleek-pill ${isActive ? 'sleek-pill-active' : ''}`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
            Probability of synaptic weight perturbation per gene.
          </div>
        </div>

        {/* Elitism Slider */}
        <div style={{
          background: 'var(--bg-subtle)',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-btn)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              <ShieldCheck size={14} color="#D97706" />
              <span>Elitism Quota</span>
              <InfoTip
                title="Elitism Quota"
                content="Protects the best performing champion birds so their brains are copied into the next generation without mutation. 5% prevents regression while leaving 95% space for exploration."
              />
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#D97706', fontSize: '0.95rem' }}>
                {Math.round(elitismRate * 100)}%
              </span>
              <span className={`sleek-badge ${elitismRate >= 0.15 ? 'sleek-badge-amber' : elitismRate >= 0.05 ? 'sleek-badge-emerald' : 'sleek-badge-slate'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                {elitismRate >= 0.15 ? 'High Preservation' : elitismRate >= 0.05 ? 'Optimal' : 'Exploratory'}
              </span>
            </div>
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
          background: 'var(--bg-subtle)',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-btn)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              <Layers size={14} color="#7C3AED" />
              <span>Neural Architecture</span>
              <InfoTip
                title="Neural Architecture (Topology)"
                content="Defines how many neurons and hidden layers are in each brain. Small [9→8→1] converges fastest (Gen 2); Medium [9→12→12→1] balances memory and aerodynamic control."
              />
            </span>
          </div>
          <select 
            value={networkSize}
            onChange={(e) => onChangeNetworkSize(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border-medium)',
              borderRadius: '6px',
              padding: '8px 10px',
              fontSize: '0.82rem',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-btn)'
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
        borderTop: '1.5px solid var(--border-medium)',
        fontSize: '0.82rem'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontWeight: '600',
          background: 'var(--bg-card)',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-btn)'
        }}>
          <input 
            type="checkbox" 
            checked={showRaycasts} 
            onChange={(e) => onToggleRaycasts(e.target.checked)}
            style={{ accentColor: '#0284C7' }}
          />
          <Radar size={14} color="#0284C7" />
          <span>LiDAR Sensory Rays</span>
          <InfoTip 
            title="LiDAR Rays"
            content="Visualizes the 9 sensory vectors scanning the altitude, distance to next pipe, gap center, and upper/lower obstacle edges."
          />
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontWeight: '600',
          background: 'var(--bg-card)',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-btn)'
        }}>
          <input 
            type="checkbox" 
            checked={showAllBirds} 
            onChange={(e) => onToggleShowAllBirds(e.target.checked)}
            style={{ accentColor: '#0284C7' }}
          />
          <Eye size={14} color="#0284C7" />
          <span>Show All 150 Agents</span>
          <InfoTip 
            title="Flock Rendering"
            content="Renders all 150 exploring drones simultaneously with semi-transparent hulls, highlighting the current epoch champion in gold."
          />
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontWeight: '600',
          background: 'var(--bg-card)',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-btn)'
        }}>
          <input 
            type="checkbox" 
            checked={turboMode} 
            onChange={(e) => onToggleTurboMode(e.target.checked)}
            style={{ accentColor: '#0284C7' }}
          />
          <Zap size={14} color="#D97706" />
          <span>Headless Turbo Stream</span>
          <InfoTip 
            title="Headless Mode"
            content="Disables canvas painting to run hundreds of generations per second with continuous live telemetry streaming."
          />
        </label>
      </div>
    </div>
  );
}
