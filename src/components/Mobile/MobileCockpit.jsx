import React, { useState, useRef } from 'react';
import { 
  Brain, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Play, 
  Pause, 
  Camera, 
  ShieldAlert, 
  Shield, 
  FastForward, 
  Dna, 
  TrendingUp, 
  Sliders, 
  Calculator, 
  Activity, 
  ListOrdered, 
  FlaskConical, 
  Download, 
  Upload, 
  Sparkles, 
  FileText, 
  Trash2, 
  Users, 
  Trophy, 
  Gauge, 
  Zap, 
  Layers,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { NeuralNetworkCanvas } from '../Visualizer/NeuralNetworkCanvas.jsx';
import { FitnessGraphCanvas } from '../Visualizer/FitnessGraphCanvas.jsx';
import { MathInspector } from '../Visualizer/MathInspector.jsx';
import { WeightsTable } from '../Visualizer/WeightsTable.jsx';
import { DecisionsViewer } from '../Visualizer/DecisionsViewer.jsx';
import { GenerationLogTable } from '../Visualizer/GenerationLogTable.jsx';
import { BenchmarkViewer } from '../Visualizer/BenchmarkViewer.jsx';
import { formatCompactNumber } from '../../utils/numberFormat.js';

export function MobileCockpit({
  canvasRef,
  architecture,
  isRunning,
  togglePlay,
  simulationSpeed,
  setSimulationSpeed,
  elitismRate,
  setElitismRate,
  mutationRate,
  setMutationRate,
  networkSize,
  changeNetworkSize,
  showAllBirds,
  setShowAllBirds,
  turboMode,
  setTurboMode,
  simpleMode,
  setSimpleMode,
  showRaycasts,
  setShowRaycasts,
  freezeFrame,
  setFreezeFrame,
  soundEnabled,
  toggleSound,
  resetSimulation,
  obstaclesEnabled,
  setObstaclesEnabled,
  telemetry,
  gaStats,
  generationLog,
  championBrain,
  bestBird,
  activeDifficulties,
  turboStats,
  exportBrainJSON,
  importBrainJSON,
  loadPretrainedChampion,
  exportLogCSV,
  clearStorage,
  onOpenWalkthrough,
  theme = 'light',
  onToggleTheme
}) {
  const [activeTab, setActiveTab] = useState('brain');
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importBrainJSON(json);
      } catch (err) {
        alert('Invalid JSON file format: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const scenarios = [
    { id: 'demo', title: 'Student Demo', badge: 'Fast', arch: 'small', mutation: 0.15, elitism: 0.05 },
    { id: 'balanced', title: 'NCERT Standard', badge: 'Golden', arch: 'medium', mutation: 0.15, elitism: 0.05 },
    { id: 'deep', title: 'UAV Autopilot', badge: 'Deep', arch: 'large', mutation: 0.10, elitism: 0.10 },
    { id: 'chaos', title: 'Chaos Escape', badge: '45% Mut', arch: 'medium', mutation: 0.45, elitism: 0.02 }
  ];

  const tabs = [
    { id: 'brain', label: 'Neural Radar', icon: <Brain size={13} /> },
    { id: 'math', label: 'Math Formula', icon: <Calculator size={13} /> },
    { id: 'benchmark', label: 'Dossier', icon: <FlaskConical size={13} /> },
    { id: 'graph', label: 'Fitness Curve', icon: <TrendingUp size={13} /> },
    { id: 'weights', label: 'Synapses', icon: <Sliders size={13} /> },
    { id: 'decisions', label: 'Decisions', icon: <Activity size={13} /> },
    { id: 'log', label: 'Generations', icon: <ListOrdered size={13} /> }
  ];

  const currentRecord = Math.max(gaStats?.bestScoreEver ?? 0, telemetry?.bestScore ?? 0);
  const survivalPct = telemetry?.total > 0 ? Math.round((telemetry.alive / telemetry.total) * 100) : 0;

  return (
    <div style={{
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      padding: '8px 10px 24px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxSizing: 'border-box'
    }}>
      {/* 📱 1. Mobile Header Card */}
      <div className="sleek-card" style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--bg-subtle)',
              border: '1.5px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={18} color="#0284C7" />
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                lineHeight: '1.2'
              }}>
                AI Neuroevolution
              </h1>
              <span style={{ fontSize: '0.68rem', color: '#0284C7', fontWeight: '700' }}>
                GCERT & NCERT 2026–27
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={onToggleTheme}
              className="sleek-btn sleek-btn-neutral"
              style={{ padding: '6px 8px' }}
              aria-label="Toggle theme mode"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={15} color="#FBBF24" /> : <Moon size={15} color="#6366F1" />}
            </button>
            <button
              onClick={toggleSound}
              className="sleek-btn sleek-btn-neutral"
              style={{ padding: '6px 8px' }}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 size={15} color="#059669" /> : <VolumeX size={15} color="#94A3B8" />}
            </button>
            <button
              onClick={resetSimulation}
              className="sleek-btn sleek-btn-neutral"
              style={{ padding: '6px 8px' }}
              aria-label="Reset"
            >
              <RotateCcw size={15} color="#E11D48" />
            </button>
          </div>
        </div>

        {/* Walkthrough CTA Button */}
        <button
          onClick={onOpenWalkthrough}
          className="sleek-btn sleek-btn-primary"
          style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}
        >
          <GraduationCap size={15} />
          <span>Classroom Walkthrough (NEP 2020)</span>
        </button>
      </div>

      {/* 📱 2. Mobile 2-Column Telemetry Deck */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px'
      }}>
        {/* Gen */}
        <div className="sleek-card" style={{ padding: '10px 12px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Generation</span>
          <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
            Gen {gaStats?.generation ?? 1}
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Active Epoch</span>
        </div>

        {/* Survival */}
        <div className="sleek-card" style={{ padding: '10px 12px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Flock Survival</span>
          <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#059669', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            {telemetry?.alive ?? 0} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 150</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'var(--bg-subtle)', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
            <div style={{ width: `${survivalPct}%`, height: '100%', background: '#059669' }} />
          </div>
        </div>

        {/* Pipes Cleared */}
        <div className="sleek-card" style={{ padding: '10px 12px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pipes Cleared</span>
          <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#D97706', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            {telemetry?.bestScore ?? 0}
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Peak: {currentRecord}
          </span>
        </div>

        {/* Neural Fitness */}
        <div className="sleek-card" style={{ padding: '10px 12px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Neural Fitness</span>
          <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0284C7', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            {formatCompactNumber(telemetry?.bestFitness ?? 0)}
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Peak: {formatCompactNumber(gaStats?.bestFitnessEver ?? 0)}
          </span>
        </div>

        {/* Dynamic Hazards Pod (Spans 2 cols) */}
        <div className="sleek-card" style={{
          gridColumn: 'span 2',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: obstaclesEnabled ? 'var(--hazard-bg)' : 'var(--corridor-bg)',
          borderColor: obstaclesEnabled ? 'var(--hazard-border)' : 'var(--corridor-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {obstaclesEnabled ? <ShieldAlert size={16} color="#D97706" /> : <Shield size={16} color="#059669" />}
            <span style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {obstaclesEnabled ? 'Dynamic Hazards Active' : 'Standard Corridor (Static Pipes)'}
            </span>
          </div>
          <button
            onClick={() => setObstaclesEnabled(prev => !prev)}
            className="sleek-btn"
            style={{
              padding: '4px 8px',
              fontSize: '0.7rem',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border-medium)'
            }}
          >
            {obstaclesEnabled ? 'Disable Hazards' : 'Enable Wind/Motion'}
          </button>
        </div>
      </div>

      {/* 📱 3. Mobile Flight Arena Viewport (Flappy Bird Canvas) */}
      <div className="sleek-card" style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1.5px solid #0F172A',
          boxShadow: '2px 2px 0px #0F172A',
          width: '100%',
          maxWidth: '360px',
          background: '#E0F2FE',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <canvas
            ref={canvasRef}
            width={360}
            height={340}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '360px',
              height: 'auto',
              aspectRatio: '360 / 340'
            }}
          />
        </div>
      </div>

      {/* 📱 4. Big Thumb-Friendly Primary Action CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={togglePlay}
          className={`sleek-btn ${isRunning ? 'sleek-btn-rose' : 'sleek-btn-emerald'}`}
          style={{
            width: '100%',
            minHeight: '50px',
            fontSize: '1rem',
            fontWeight: '900',
            letterSpacing: '0.04em',
            justifyContent: 'center'
          }}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          <span>{isRunning ? 'PAUSE EVOLUTION' : 'START EVOLUTION'}</span>
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFreezeFrame(prev => !prev)}
            className={`sleek-btn ${freezeFrame ? 'sleek-btn-rose' : 'sleek-btn-neutral'}`}
            style={{ flex: 1, minHeight: '44px', fontSize: '0.82rem', justifyContent: 'center' }}
          >
            <Camera size={15} />
            <span>{freezeFrame ? 'Resume' : 'Freeze-Frame'}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="sleek-btn sleek-btn-neutral"
            style={{ flex: 1, minHeight: '44px', fontSize: '0.82rem', justifyContent: 'center' }}
          >
            <RotateCcw size={15} color="#E11D48" />
            <span>Reset Flock</span>
          </button>
        </div>
      </div>

      {/* 📱 5. Pedagogical Scenario Tap Pills */}
      <div className="sleek-card" style={{ padding: '12px 14px' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Quick Scenario Presets:
        </span>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '6px'
        }}>
          {scenarios.map(sc => {
            const isMatch = networkSize === sc.arch && Math.abs(mutationRate - sc.mutation) < 0.05;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  changeNetworkSize(sc.arch);
                  setMutationRate(sc.mutation);
                  setElitismRate(sc.elitism);
                }}
                className="sleek-btn"
                style={{
                  padding: '8px 10px',
                  fontSize: '0.72rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  background: isMatch ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  borderColor: isMatch ? 'var(--border-strong)' : 'var(--border-subtle)',
                  boxShadow: isMatch ? 'var(--shadow-btn)' : '1px 1px 0px var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontWeight: '800' }}>
                  <span>{sc.title}</span>
                  <span className="sleek-badge sleek-badge-sky" style={{ fontSize: '0.55rem' }}>{sc.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📱 6. Mobile Sliders & Toggles (Expandable) */}
      <div className="sleek-card" style={{ padding: '12px 14px' }}>
        <button
          onClick={() => setShowAdvancedControls(prev => !prev)}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '2px 0'
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            {showAdvancedControls ? '▼ Hide Tuning Sliders' : '▶ Show Speed & Mutation Sliders'}
          </span>
          <span className="sleek-badge sleek-badge-slate" style={{ fontSize: '0.62rem' }}>
            {simulationSpeed}x • {Math.round(mutationRate * 100)}% Mut
          </span>
        </button>

        {showAdvancedControls && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
            {/* Speed */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Simulation Speed:</span>
                <strong style={{ color: '#0284C7' }}>{simulationSpeed}x</strong>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={simulationSpeed} 
                onChange={(e) => setSimulationSpeed(parseInt(e.target.value))} 
              />
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                {[1, 5, 25, 100].map(s => (
                  <button
                    key={s}
                    onClick={() => setSimulationSpeed(s)}
                    className={`sleek-pill ${simulationSpeed === s ? 'sleek-pill-active' : ''}`}
                    style={{ flex: 1, textAlign: 'center', padding: '4px 0' }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Mutation */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Mutation Rate:</span>
                <strong style={{ color: '#059669' }}>{Math.round(mutationRate * 100)}%</strong>
              </div>
              <input 
                type="range" 
                min="1" 
                max="60" 
                value={Math.round(mutationRate * 100)} 
                onChange={(e) => setMutationRate(parseInt(e.target.value) / 100)} 
              />
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                {[0.05, 0.15, 0.30, 0.60].map(m => (
                  <button
                    key={m}
                    onClick={() => setMutationRate(m)}
                    className={`sleek-pill ${Math.abs(mutationRate - m) < 0.02 ? 'sleek-pill-active' : ''}`}
                    style={{ flex: 1, textAlign: 'center', padding: '4px 0' }}
                  >
                    {Math.round(m * 100)}%
                  </button>
                ))}
              </div>
            </div>

            {/* Elitism */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Elitism Quota:</span>
                <strong style={{ color: '#D97706' }}>{Math.round(elitismRate * 100)}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20" 
                value={Math.round(elitismRate * 100)} 
                onChange={(e) => setElitismRate(parseInt(e.target.value) / 100)} 
              />
            </div>

            {/* Topology Select */}
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Network Architecture:
              </span>
              <select
                value={networkSize}
                onChange={(e) => changeNetworkSize(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-medium)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="small">Small [9 → 8 → 1] (88 params)</option>
                <option value="medium">Medium [9 → 12 → 12 → 1] (285 params)</option>
                <option value="large">Large [9 → 20 → 20 → 1] (640 params)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 📱 7. Mobile Visualizer Deck (Horizontal Swipe Safe) */}
      <div className="sleek-card" style={{ padding: '12px 14px' }}>
        {/* Tab Selection Strip */}
        <div className="mobile-tabs-scroll">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sleek-btn ${activeTab === tab.id ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
              style={{
                padding: '6px 10px',
                fontSize: '0.72rem',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body with Responsive Stacking (Zero Horizontal Scrollbars) */}
        <div style={{ minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
          {activeTab === 'brain' && (
            <NeuralNetworkCanvas brain={championBrain} bestBird={bestBird} />
          )}

          {activeTab === 'math' && (
            <MathInspector brain={championBrain} bestBird={bestBird} />
          )}

          {activeTab === 'benchmark' && (
            <BenchmarkViewer
              onSelectNetworkSize={changeNetworkSize}
              onSelectMutation={setMutationRate}
              onSelectElitism={setElitismRate}
            />
          )}

          {activeTab === 'graph' && (
            <FitnessGraphCanvas 
              generationLog={generationLog} 
              telemetry={telemetry}
              gaStats={gaStats}
              isRunning={isRunning}
            />
          )}

          {activeTab === 'weights' && (
            <WeightsTable brain={championBrain} />
          )}

          {activeTab === 'decisions' && (
            <DecisionsViewer bestBird={bestBird} />
          )}

          {activeTab === 'log' && (
            <GenerationLogTable generationLog={generationLog} />
          )}
        </div>
      </div>

      {/* 📱 8. Mobile Model Weights & Dossier Bar */}
      <div className="sleek-card" style={{ padding: '12px 14px' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Weights & Dossier Console
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={loadPretrainedChampion}
            className="sleek-btn sleek-btn-primary"
            style={{ width: '100%', minHeight: '44px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            <Sparkles size={15} />
            <span>Load Pre-Trained Champion</span>
          </button>

          <button
            onClick={exportBrainJSON}
            className="sleek-btn sleek-btn-neutral"
            style={{ width: '100%', minHeight: '44px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            <Download size={15} color="#0284C7" />
            <span>Export Brain (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="sleek-btn sleek-btn-neutral"
            style={{ width: '100%', minHeight: '44px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            <Upload size={15} color="#7C3AED" />
            <span>Import Brain</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            onClick={exportLogCSV}
            className="sleek-btn sleek-btn-neutral"
            style={{ width: '100%', minHeight: '44px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            <FileText size={15} color="#059669" />
            <span>Export CSV Dossier</span>
          </button>

          <button
            onClick={clearStorage}
            className="sleek-btn sleek-btn-neutral"
            style={{ width: '100%', minHeight: '44px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            <Trash2 size={15} color="#E11D48" />
            <span>Clear Saved Data</span>
          </button>
        </div>
      </div>

      {/* 📱 9. Mobile Footer */}
      <footer style={{
        padding: '12px 10px',
        textAlign: 'center',
        fontSize: '0.72rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4'
      }}>
        Developed for <strong style={{ color: 'var(--text-primary)' }}>GCERT & NCERT Children's Science Exhibition 2026–27</strong> (બાળ વૈજ્ઞાનિક પ્રદર્શન) • 
        Themes: <em>Subtheme 1(A) AI for Life</em> & <em>Subtheme 1(B) Mathematical Modelling</em>
      </footer>
    </div>
  );
}
