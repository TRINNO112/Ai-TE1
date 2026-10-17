import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Calculator, 
  Sliders, 
  ListOrdered, 
  Activity
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
    { id: 'brain', label: 'Neural Brain', icon: <Brain size={16} strokeWidth={2.5} /> },
    { id: 'math', label: 'Math Inspector (1B)', icon: <Calculator size={16} strokeWidth={2.5} /> },
    { id: 'graph', label: 'Fitness Curve', icon: <TrendingUp size={16} strokeWidth={2.5} /> },
    { id: 'weights', label: 'Weight Matrix', icon: <Sliders size={16} strokeWidth={2.5} /> },
    { id: 'decisions', label: 'Decisions Stream', icon: <Activity size={16} strokeWidth={2.5} /> },
    { id: 'log', label: 'Generation Log', icon: <ListOrdered size={16} strokeWidth={2.5} /> }
  ];

  return (
    <div className="bento-card" style={{
      padding: '20px 24px',
      background: '#151d30',
      border: '2.5px solid #000000',
      boxShadow: '4px 4px 0px #000000',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Tab Navigation Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '2.5px solid #000000',
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
              className={`neo-btn ${isActive ? 'neo-btn-primary' : 'neo-btn-neutral'}`}
              style={{
                padding: '8px 16px',
                fontSize: '0.82rem',
                borderRadius: '10px',
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
              <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Champion Neural Network Architecture & Live Synapses
              </span>
              <span className="neo-pill neo-pill-slate" style={{ fontSize: '0.68rem' }}>
                Green = Positive (+) • Red = Negative (-)
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
              <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Evolutionary Trajectory & Fitness Convergence
              </span>
              <span className="neo-pill neo-pill-slate" style={{ fontSize: '0.68rem' }}>
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
