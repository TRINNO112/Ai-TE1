import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Calculator, 
  Sliders, 
  ListOrdered, 
  Activity,
  Layers,
  FlaskConical
} from 'lucide-react';
import { NeuralNetworkCanvas } from './NeuralNetworkCanvas.jsx';
import { FitnessGraphCanvas } from './FitnessGraphCanvas.jsx';
import { MathInspector } from './MathInspector.jsx';
import { WeightsTable } from './WeightsTable.jsx';
import { DecisionsViewer } from './DecisionsViewer.jsx';
import { GenerationLogTable } from './GenerationLogTable.jsx';
import { BenchmarkViewer } from './BenchmarkViewer.jsx';

export function VisualizerTabs({
  brain,
  bestBird,
  generationLog,
  onChangeNetworkSize,
  onChangeMutation,
  onChangeElitism
}) {
  const [activeTab, setActiveTab] = useState('brain');

  const tabs = [
    { id: 'brain', label: 'Neural Brain', icon: <Brain size={15} /> },
    { id: 'math', label: 'Math Inspector (1B)', icon: <Calculator size={15} /> },
    { id: 'benchmark', label: 'Empirical Benchmark', icon: <FlaskConical size={15} /> },
    { id: 'graph', label: 'Fitness Curve', icon: <TrendingUp size={15} /> },
    { id: 'weights', label: 'Weight Matrix', icon: <Sliders size={15} /> },
    { id: 'decisions', label: 'Decisions Stream', icon: <Activity size={15} /> },
    { id: 'log', label: 'Generation Log', icon: <ListOrdered size={15} /> }
  ];

  return (
    <div className="sleek-card" style={{
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Tab Navigation Header (Swipeable on Mobile) */}
      <div className="mobile-tabs-scroll">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sleek-btn ${isActive ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
              style={{
                padding: '8px 12px',
                fontSize: '0.78rem',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div style={{ minWidth: 0, width: '100%' }}>
        {activeTab === 'brain' && (
          <div style={{ minWidth: 0, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Champion Neural Architecture & Synaptic Activation Radar
              </span>
              <span className="sleek-badge sleek-badge-slate">
                Green = Excitatory (+) • Red = Inhibitory (-)
              </span>
            </div>
            <NeuralNetworkCanvas brain={brain} bestBird={bestBird} />
          </div>
        )}

        {activeTab === 'math' && (
          <MathInspector brain={brain} bestBird={bestBird} />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkViewer
            onSelectNetworkSize={onChangeNetworkSize}
            onSelectMutation={onChangeMutation}
            onSelectElitism={onChangeElitism}
          />
        )}

        {activeTab === 'graph' && (
          <div style={{ minWidth: 0, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Evolutionary Trajectory & Fitness Convergence
              </span>
              <span className="sleek-badge sleek-badge-slate">
                Fitness = Score × 1000 + Frames - ΔY
              </span>
            </div>
            <FitnessGraphCanvas generationLog={generationLog} />
          </div>
        )}

        {activeTab === 'weights' && (
          <WeightsTable brain={brain} />
        )}

        {activeTab === 'decisions' && (
          <DecisionsViewer bestBird={bestBird} />
        )}

        {activeTab === 'log' && (
          <GenerationLogTable generationLog={generationLog} />
        )}
      </div>
    </div>
  );
}
