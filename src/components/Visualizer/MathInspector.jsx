import React, { useState } from 'react';
import { Calculator, CheckCircle2, ChevronRight, Binary, ArrowRight } from 'lucide-react';

export function MathInspector({ brain, bestBird }) {
  const [selectedLayer, setSelectedLayer] = useState(0);

  // Fallback default inputs if bird is not yet active
  const currentInputs = (bestBird && bestBird.decisionHistory.length > 0)
    ? bestBird.decisionHistory[bestBird.decisionHistory.length - 1].inputs
    : [0.5, 0.0, 0.75, 0.35, 0.58, 0.0, 0.0, 0.5, 0.5];

  const calcDetails = brain ? brain.getDetailedCalculation(currentInputs) : null;

  if (!calcDetails) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Mathematical inspector ready. Launch evolution to inspect linear algebra.
      </div>
    );
  }

  const activeLayer = calcDetails.layers[selectedLayer] || calcDetails.layers[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Educational Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '12px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Calculator size={18} color="#c084fc" />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', color: '#f3e8ff' }}>
              Subtheme 1(B): Linear Algebra & Vector Forward Pass
            </h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Every AI decision is computed by matrix dot products: <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>z = W · x + b</span> followed by activation <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>a = σ(z)</span>
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: calcDetails.finalDecision.includes('FLAP') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
          border: `1px solid ${calcDetails.finalDecision.includes('FLAP') ? '#10b981' : '#64748b'}`,
          padding: '6px 14px',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>Decision:</span>
          <strong style={{ color: calcDetails.finalDecision.includes('FLAP') ? '#34d399' : '#94a3b8' }}>
            {calcDetails.finalDecision}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({(calcDetails.decisionConfidence * 100).toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Input Vector Ribbon */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '12px 14px'
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
          SENSORY INPUT VECTOR X ∈ ℝ⁹ (NORMALIZED RADAR SENSORS):
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '6px'
        }}>
          {calcDetails.inputs.map((val, idx) => (
            <div key={idx} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>x[{idx}]</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#38bdf8', fontWeight: '600' }}>
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer Step Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {calcDetails.layers.map((layer, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedLayer(idx)}
            className={`sleek-btn ${selectedLayer === idx ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
          >
            <span>Layer {idx + 1} ({layer.fromLayerSize} → {layer.toLayerSize})</span>
            {layer.isOutputLayer && <span className="sleek-badge sleek-badge-amber" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>Output</span>}
          </button>
        ))}
      </div>

      {/* Layer Neurons Breakdown */}
      <div style={{
        maxHeight: '360px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingRight: '6px'
      }}>
        {activeLayer.neurons.slice(0, 8).map((neuron, nIdx) => (
          <div key={nIdx} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontWeight: '600', color: '#c084fc' }}>
                Neuron #{neuron.neuronIndex} ({neuron.activationFunction} Activation)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                Output a = <strong style={{ color: '#34d399' }}>{neuron.output}</strong>
              </div>
            </div>

            {/* Arithmetic Formula Display */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '8px 10px',
              borderRadius: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              <span>z = (W · x) + b = </span>
              <span style={{ color: '#38bdf8' }}>{neuron.dotProduct}</span>
              <span> + (</span>
              <span style={{ color: '#f59e0b' }}>{neuron.bias}</span>
              <span>) = </span>
              <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{neuron.preActivation}</span>
              <span> → {neuron.activationFunction}({neuron.preActivation}) = </span>
              <span style={{ color: '#34d399', fontWeight: 'bold' }}>{neuron.output}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
