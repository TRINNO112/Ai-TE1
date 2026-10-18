import React, { useState } from 'react';
import { 
  BarChart3, 
  FlaskConical, 
  Layers, 
  Dna, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function BenchmarkViewer() {
  const [activeSection, setActiveSection] = useState('arch');

  const archData = [
    {
      name: 'Small [9 → 8 → 1]',
      params: 89,
      firstPipeGen: '3.3 (Gen 2 fastest)',
      avgScore: 3.0,
      peakScore: 6,
      peakFitness: '13,117',
      time: '156 ms',
      verdict: 'Fastest early convergence. Perfect for quick student classroom demos.'
    },
    {
      name: 'Medium [9 → 12 → 12 → 1]',
      params: 289,
      firstPipeGen: '5.7',
      avgScore: 3.3,
      peakScore: 4,
      peakFitness: '8,859',
      time: '163 ms',
      verdict: 'Golden ratio. Two hidden layers extract gap coordinates and wind dynamics.'
    },
    {
      name: 'Large [9 → 20 → 20 → 1]',
      params: 641,
      firstPipeGen: '4.7',
      avgScore: 1.3,
      peakScore: 2,
      peakFitness: '4,578',
      time: '263 ms',
      verdict: 'Curse of dimensionality in short runs. Needs 50+ gens to navigate 641 dimensions.'
    }
  ];

  const mutationData = [
    { rate: '5% (Conservative)', firstPipe: '6.3 gens', avgPeak: 2.3, maxScore: 3, maxFit: '6,719', note: 'Genetic inertia: agents get trapped in initial hover equilibrium.' },
    { rate: '15% (Standard)', firstPipe: '5.7 gens', avgPeak: 3.3, maxScore: 4, maxFit: '8,859', note: 'Standard natural selection balance between stability & exploration.' },
    { rate: '30% (Dynamic)', firstPipe: '5.3 gens', avgPeak: 3.3, maxScore: 6, maxFit: '13,127', note: 'Broad variance discovers ambitious aerodynamic flight lines.' },
    { rate: '45% (Exploratory Chaos)', firstPipe: '5.0 gens', avgPeak: 4.0, maxScore: 6, maxFit: '13,547', note: 'Highest average peak! Entropy prevents local minima stagnation traps.' }
  ];

  const elitismData = [
    { rate: '2% (Top 2)', firstPipe: '3.7 gens', avgPeak: 2.0, peakFit: '8,847', note: 'Vulnerable to regression: random roulette selection can lose good alleles.' },
    { rate: '5% (Top 5)', firstPipe: '5.7 gens', avgPeak: 3.3, peakFit: '8,859', note: 'Optimal balance: protects champions while leaving 95% space for crossover.' },
    { rate: '15% (Top 15)', firstPipe: '3.0 gens', avgPeak: 1.7, peakFit: '4,579', note: 'Genetic choking: preserves too many mediocre clones, slowing innovation.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)',
        border: '1px solid rgba(14, 165, 233, 0.3)',
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
            <FlaskConical size={18} color="#38bdf8" />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', color: '#f0f9ff' }}>
              Empirical Laboratory Dossier (24 Stochastic Multi-Gen Trials)
            </h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real benchmark data compiled from 360 generations and 1.8M+ neural evaluations.
          </p>
        </div>
        <span className="sleek-badge sleek-badge-sky">
          Empirical Truth Matrix
        </span>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSection('arch')}
          className={`sleek-btn ${activeSection === 'arch' ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
          style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
        >
          <Layers size={14} />
          <span>Architecture Scaling (Small vs Med vs Large)</span>
        </button>

        <button
          onClick={() => setActiveSection('mutation')}
          className={`sleek-btn ${activeSection === 'mutation' ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
          style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
        >
          <Dna size={14} />
          <span>Mutation Sensitivity (5% → 45%)</span>
        </button>

        <button
          onClick={() => setActiveSection('elitism')}
          className={`sleek-btn ${activeSection === 'elitism' ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
          style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
        >
          <ShieldCheck size={14} />
          <span>Elitism Retention (2% → 15%)</span>
        </button>
      </div>

      {/* Architecture Cards View */}
      {activeSection === 'arch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {archData.map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px 16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#ffffff', fontSize: '0.9rem' }}>
                    {item.name}
                  </span>
                  <span className="sleek-badge sleek-badge-slate" style={{ fontSize: '0.65rem' }}>
                    {item.params} Parameters
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>1st Pipe: <strong style={{ color: '#38bdf8' }}>{item.firstPipeGen}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Peak Score: <strong style={{ color: '#34d399' }}>{item.peakScore}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Peak Fitness: <strong style={{ color: '#fbbf24' }}>{item.peakFitness}</strong></span>
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {item.verdict}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Mutation Sensitivity View */}
      {activeSection === 'mutation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mutationData.map((m, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px 16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#fbbf24', fontSize: '0.88rem' }}>
                  {m.rate}
                </span>
                <div style={{ display: 'flex', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>1st Pipe: <strong style={{ color: '#38bdf8' }}>{m.firstPipe}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Avg Peak: <strong style={{ color: '#34d399' }}>{m.avgPeak}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Max Score: <strong style={{ color: '#f43f5e' }}>{m.maxScore}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Max Fitness: <strong style={{ color: '#fbbf24' }}>{m.maxFit}</strong></span>
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {m.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Elitism View */}
      {activeSection === 'elitism' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {elitismData.map((e, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px 16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34d399', fontSize: '0.88rem' }}>
                  {e.rate}
                </span>
                <div style={{ display: 'flex', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>1st Pipe: <strong style={{ color: '#38bdf8' }}>{e.firstPipe}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Avg Peak: <strong style={{ color: '#34d399' }}>{e.avgPeak}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Peak Fitness: <strong style={{ color: '#fbbf24' }}>{e.peakFit}</strong></span>
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {e.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Full Report Link / Notification */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.76rem',
        color: 'var(--text-muted)'
      }}>
        <span>Full scientific markdown report generated at <code>EMPIRICAL_BENCHMARK_REPORT.md</code></span>
        <span className="sleek-badge sleek-badge-emerald">24 Trials Validated</span>
      </div>
    </div>
  );
}
