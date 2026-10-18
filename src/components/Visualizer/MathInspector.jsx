import React, { useState } from 'react';
import { Calculator, CheckCircle2, ChevronRight, Binary, ArrowRight } from 'lucide-react';

const INPUT_NAMES = [
  'Altitude (y)',
  'Velocity (v)',
  'Obstacle Dist (d)',
  'Gap Top (ytop)',
  'Gap Bottom (ybot)',
  'Obstacle Move (vpipe)',
  'Wind Force (F)',
  'Barrier 2 Top',
  'Barrier 2 Bottom'
];

export function MathInspector({ brain, bestBird }) {
  const [selectedLayer, setSelectedLayer] = useState(0);

  // Fallback default inputs if bird is not yet active
  const currentInputs = (bestBird && bestBird.decisionHistory?.length > 0)
    ? bestBird.decisionHistory[bestBird.decisionHistory.length - 1].inputs
    : [0.5, 0.0, 0.75, 0.35, 0.58, 0.0, 0.0, 0.5, 0.5];

  const calcDetails = brain ? brain.getDetailedCalculation(currentInputs) : null;

  if (!calcDetails) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Mathematical inspector ready. Launch evolution to inspect linear algebra forward pass.
      </div>
    );
  }

  const activeLayer = calcDetails.layers[selectedLayer] || calcDetails.layers[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Educational Banner */}
      <div style={{
        background: '#F5F3FF',
        border: '1.5px solid #0F172A',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        boxShadow: '1px 1px 0px #0F172A'
      }}>
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Calculator size={16} color="#7C3AED" />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', color: '#0F172A', fontWeight: '800' }}>
              Subtheme 1(B): Linear Algebra & Vector Forward Pass
            </h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Computed by matrix dot products: <span style={{ color: '#0284C7', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>z = W · x + b</span> followed by activation <span style={{ color: '#059669', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>a = σ(z)</span>
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: calcDetails.finalDecision.includes('FLAP') ? '#DCFCE7' : '#F1F5F9',
          border: '1.5px solid #0F172A',
          boxShadow: '1px 1px 0px #0F172A',
          padding: '6px 12px',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem'
        }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Decision:</span>
          <strong style={{ color: calcDetails.finalDecision.includes('FLAP') ? '#15803D' : '#334155' }}>
            {calcDetails.finalDecision}
          </strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            ({(calcDetails.decisionConfidence * 100).toFixed(0)}%)
          </span>
        </div>
      </div>

      {/* Sensory Input Vector Chips (Responsive Wrap Grid) */}
      <div style={{
        background: '#FAF9F6',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '10px',
        padding: '10px 12px',
        boxShadow: '1px 1px 0px #1E293B'
      }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '800' }}>
          SENSORY INPUT VECTOR X ∈ ℝ⁹ (NORMALIZED RADAR SENSORS):
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
          gap: '5px'
        }}>
          {calcDetails.inputs.map((val, idx) => (
            <div 
              key={idx} 
              title={INPUT_NAMES[idx] || `Sensor ${idx}`}
              style={{
                background: '#FFFFFF',
                padding: '5px 4px',
                borderRadius: '6px',
                border: '1.5px solid #0F172A',
                boxShadow: '1px 1px 0px #0F172A',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: '700' }}>x[{idx}]</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#0284C7', fontWeight: '800' }}>
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer Step Selector Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {calcDetails.layers.map((layer, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedLayer(idx)}
            className={`sleek-btn ${selectedLayer === idx ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
            style={{ padding: '5px 12px', fontSize: '0.76rem', borderRadius: '8px' }}
          >
            <span>Layer {idx + 1} ({layer.fromLayerSize} → {layer.toLayerSize})</span>
            {layer.isOutputLayer && (
              <span className="sleek-badge sleek-badge-amber" style={{ fontSize: '0.6rem', padding: '1px 4px' }}>
                Output
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Layer Neurons Breakdown (Stacked Responsive Cards with ZERO Horizontal Scrollbars) */}
      <div style={{
        maxHeight: '360px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        paddingRight: '4px'
      }}>
        {activeLayer.neurons.slice(0, 8).map((neuron, nIdx) => (
          <div key={nIdx} style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '10px',
            padding: '10px 12px',
            fontSize: '0.8rem',
            boxShadow: '1px 1px 0px #1E293B',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ fontWeight: '800', color: '#7C3AED', fontSize: '0.82rem' }}>
                Neuron #{neuron.neuronIndex} ({neuron.activationFunction} Activation)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                Output a = <strong style={{ color: '#059669', fontWeight: '800' }}>{neuron.output}</strong>
              </div>
            </div>

            {/* Stacked & Wrapped Mathematical Formula */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              padding: '8px 10px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem'
            }}>
              {/* Step 1: Linear Combination z = W · x + b */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                <span className="sleek-badge sleek-badge-sky" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                  Linear Sum z
                </span>
                <span style={{ color: '#475569' }}>z = W·x + b =</span>
                <span style={{ color: '#0284C7', fontWeight: '700' }}>{neuron.dotProduct}</span>
                <span>+</span>
                <span style={{ color: '#D97706', fontWeight: '700' }}>({neuron.bias})</span>
                <span>=</span>
                <strong style={{ color: '#0F172A' }}>{neuron.preActivation}</strong>
              </div>

              {/* Step 2: Non-Linear Activation a = σ(z) */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                <span className="sleek-badge sleek-badge-emerald" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                  Activation a
                </span>
                <span style={{ color: '#475569' }}>a = {neuron.activationFunction}({neuron.preActivation}) =</span>
                <strong style={{ color: '#059669', fontSize: '0.84rem' }}>{neuron.output}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
