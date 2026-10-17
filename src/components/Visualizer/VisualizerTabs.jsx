import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Calculator, 
  Sliders, 
  ListOrdered, 
  Activity,
  Layers
} from 'lucide-react';
import { NeuralNetworkCanvas } from './NeuralNetworkCanvas.jsx';
import { FitnessGraphCanvas } from './FitnessGraphCanvas.jsx';
import { MathInspector } from './MathInspector.jsx';
import { WeightsTable } from './WeightsTable.jsx';
import { DecisionsViewer } from './DecisionsViewer.jsx';
import { GenerationLogTable } from './GenerationLogTable.jsx';

export function VisualizerTabs({
  brain,
  bestBird,
  generationLog
}) {
  const [activeTab, setActiveTab] = useState('brain');

  const tabs = [
    { id: 'brain', label: 'Neural Brain', icon: <Brain size={15} /> },
    { id: 'math', label: 'Math Inspector (1B)', icon: <Calculator size={15} /> },
    { id: 'graph', label: 'Fitness Curve', icon: <TrendingUp size={15} /> },
    { id: 'weights', label: 'Weight Matrix', icon: <Sliders size={15} /> },
    { id: 'decisions', label: 'Decisions Stream', icon: <Activity size={15} /> },
    { id: 'log', label: 'Generation Log', icon: <ListOrdered size={15} /> }
  ];

  return (
    <div className="sleek-card" style={{
      padding: '20px 24px',
      background: 'rgba(12, 18, 32, 0.85)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Tab Navigation Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '14px',
        marginBottom: '18px',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sleek-btn ${isActive ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
              style={{
                padding: '8px 14px',
                fontSize: '0.8rem',
                borderRadius: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div>
        {activeTab === 'brain' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
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

        {activeTab === 'graph' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
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
