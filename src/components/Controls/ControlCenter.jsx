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
          <InfoTip 
            title="Command Deck" 
            content="Real-time control parameters for the Genetic Algorithm and physical flight environment. Changes take effect on the current population instantly."
          />
        </div>
        <span className="sleek-badge sleek-badge-sky">
          What-If Laboratory
        </span>
      </div>

      {/* Primary Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
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

      {/* Obstacles Activation Mode Card (Normal condition: Disarmed by default) */}
      <div style={{
        background: obstaclesEnabled 
          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(239, 68, 68, 0.08) 100%)' 
          : 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: obstaclesEnabled ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(14, 165, 233, 0.35)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: obstaclesEnabled ? 'rgba(245, 158, 11, 0.18)' : 'rgba(14, 165, 233, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {obstaclesEnabled ? <ShieldAlert size={18} color="#fbbf24" /> : <Shield size={18} color="#38bdf8" />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>
                Obstacles Mode: {obstaclesEnabled ? 'Armed (Pipes Spawning)' : 'Disarmed (Open Runway)'}
              </span>
              <span className={`sleek-badge ${obstaclesEnabled ? 'sleek-badge-amber' : 'sleek-badge-sky'}`} style={{ fontSize: '0.62rem' }}>
                {obstaclesEnabled ? 'Navigation Active' : 'Normal: Disarmed'}
              </span>
              <InfoTip
                title="Obstacles Mode Function"
                content="Under normal conditions, obstacles are disarmed so birds first train altitude stability and level cruising balance. Turn ON when you want to test navigation through dynamic pipes."
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {obstaclesEnabled 
                ? 'Corridors active: Birds must scan aperture gaps and dive/climb to avoid collisions.' 
                : 'Open sky runway: Flocks practice smooth hovering and level cruise without pipe collisions.'}
            </div>
          </div>
        </div>

        <button
          onClick={onToggleObstacles}
          className={`sleek-btn ${obstaclesEnabled ? 'sleek-btn-amber' : 'sleek-btn-primary'}`}
          style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }}
        >
          {obstaclesEnabled ? 'Disarm Obstacles (Open Sky)' : 'Activate Obstacles (Spawn Pipes)'}
        </button>
      </div>

      {/* Pedagogical Architectural Scenarios */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '12px 14px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pedagogical Scenarios & Presets
            </span>
            <InfoTip
              title="Classroom Presets"
              content="Pre-calibrated parameter sets designed for teachers demonstrating AI concepts: quick learning for 3-minute demos, golden ratio for standards, and high mutation to escape local minima."
            />
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
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
                  border: isMatch ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  background: isMatch ? 'rgba(14, 165, 233, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                  boxShadow: isMatch ? '0 0 12px rgba(14, 165, 233, 0.2)' : 'none',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontWeight: '700', width: '100%', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {sc.icon}
                    <span>{sc.title}</span>
                  </span>
                  <span className={`sleek-badge ${isMatch ? 'sleek-badge-sky' : 'sleek-badge-slate'}`} style={{ fontSize: '0.58rem', padding: '1px 4px' }}>
                    {sc.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.25' }}>
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
              <InfoTip
                title="Simulation Speed"
                content="Accelerates physics evaluations per frame (up to 100x). Higher speeds calculate multiple mathematical steps per render frame so you can evolve 50 generations in minutes."
              />
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
              <Dna size={14} color="#34d399" />
              <span>Mutation Rate</span>
              <InfoTip
                title="Mutation Rate (DNA Variation)"
                content="How frequently child neural weights are modified. Low (5%) creates slight adjustments; High (45%) introduces exploratory chaos to escape local minima traps."
              />
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34d399', fontSize: '0.95rem' }}>
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
              <ShieldCheck size={14} color="#fbbf24" />
              <span>Elitism Quota</span>
              <InfoTip
                title="Elitism Quota"
                content="Protects the best performing champion birds so their brains are copied into the next generation without mutation. 5% prevents regression while leaving 95% space for exploration."
              />
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#fbbf24', fontSize: '0.95rem' }}>
                {Math.round(elitismRate * 100)}%
              </span>
              <span className={`sleek-badge ${elitismRate >= 0.1 ? 'sleek-badge-amber' : 'sleek-badge-slate'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                {elitismRate >= 0.1 ? 'High Preservation' : 'Balanced (5%)'}
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
            style={{ accentColor: '#0ea5e9' }}
          />
          <Zap size={14} color="#fbbf24" />
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
