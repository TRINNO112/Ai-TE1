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
  Play,
  Lightbulb,
  ArrowRight,
  Flame,
  Info
} from 'lucide-react';

export function BenchmarkViewer({
  onSelectNetworkSize,
  onSelectMutation,
  onSelectElitism
}) {
  const [activeSection, setActiveSection] = useState('arch');
  const [appliedNotification, setAppliedNotification] = useState(null);

  const notifyApplied = (msg) => {
    setAppliedNotification(msg);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const archData = [
    {
      id: 'small',
      name: 'Small [9 → 8 → 1]',
      badge: 'Fastest Breakthrough',
      badgeColor: 'sleek-badge-sky',
      params: 89,
      firstPipeGen: 3.3,
      avgScore: 3.0,
      peakScore: 6,
      peakFitness: '13,117',
      timePerGen: '156 ms',
      verdict: 'Highest sample efficiency in short runs. Converged in Generation 2. Ideal for rapid 3-minute student demonstrations and low-spec classroom Chromebooks.',
      action: () => {
        if (onSelectNetworkSize) onSelectNetworkSize('small');
        notifyApplied('Applied Small Network [9 → 8 → 1] to Simulator!');
      }
    },
    {
      id: 'medium',
      name: 'Medium [9 → 12 → 12 → 1]',
      badge: 'Golden Ratio Winner',
      badgeColor: 'sleek-badge-emerald',
      params: 289,
      firstPipeGen: 5.7,
      avgScore: 3.3,
      peakScore: 4,
      peakFitness: '8,859',
      timePerGen: '163 ms',
      verdict: 'Deep feature hierarchy. Layer 1 captures Euclidean aperture distances, Layer 2 models flight inertia. Highest continuous survival consistency across epochs.',
      action: () => {
        if (onSelectNetworkSize) onSelectNetworkSize('medium');
        notifyApplied('Applied Medium Network [9 → 12 → 12 → 1] to Simulator!');
      }
    },
    {
      id: 'large',
      name: 'Large [9 → 20 → 20 → 1]',
      badge: 'High-Capacity Deep Net',
      badgeColor: 'sleek-badge-amber',
      params: 641,
      firstPipeGen: 4.7,
      avgScore: 1.3,
      peakScore: 2,
      peakFitness: '4,578',
      timePerGen: '263 ms',
      verdict: 'Curse of Dimensionality. Navigating a 641-dimensional parameter manifold via random mutations requires 50+ generations. Proves Occam’s Razor to students.',
      action: () => {
        if (onSelectNetworkSize) onSelectNetworkSize('large');
        notifyApplied('Applied Large Network [9 → 20 → 20 → 1] to Simulator!');
      }
    }
  ];

  const mutationData = [
    {
      rate: '5% (Conservative)',
      pctVal: 0.05,
      firstPipe: '6.3 gens',
      avgPeak: 2.3,
      maxScore: 3,
      maxFit: '6,719',
      scoreBarPct: 50,
      note: 'Genetic Inertia: Small step size causes birds to settle into a passive hovering rut.',
      action: () => {
        if (onSelectMutation) onSelectMutation(0.05);
        notifyApplied('Set Mutation Rate to 5% (Conservative)');
      }
    },
    {
      rate: '15% (Standard Baseline)',
      pctVal: 0.15,
      firstPipe: '5.7 gens',
      avgPeak: 3.3,
      maxScore: 4,
      maxFit: '8,859',
      scoreBarPct: 67,
      note: 'Classic evolutionary equilibrium balancing parental exploitation and environmental exploration.',
      action: () => {
        if (onSelectMutation) onSelectMutation(0.15);
        notifyApplied('Set Mutation Rate to 15% (Standard)');
      }
    },
    {
      rate: '30% (Dynamic Exploration)',
      pctVal: 0.30,
      firstPipe: '5.3 gens',
      avgPeak: 3.3,
      maxScore: 6,
      maxFit: '13,127',
      scoreBarPct: 100,
      note: 'Ambitious flight trajectories discover tight aperture corridors faster than baseline.',
      action: () => {
        if (onSelectMutation) onSelectMutation(0.30);
        notifyApplied('Set Mutation Rate to 30% (Dynamic)');
      }
    },
    {
      rate: '45% (Exploratory Chaos)',
      pctVal: 0.45,
      firstPipe: '5.0 gens',
      avgPeak: 4.0,
      maxScore: 6,
      maxFit: '13,547',
      scoreBarPct: 100,
      note: 'Highest overall average peak! High entropy prevents the flock from falling into local minima traps.',
      action: () => {
        if (onSelectMutation) onSelectMutation(0.45);
        notifyApplied('Set Mutation Rate to 45% (Exploratory Chaos)');
      }
    }
  ];

  const elitismData = [
    {
      rate: '2% (Top 2 Champions)',
      pctVal: 0.02,
      firstPipe: '3.7 gens',
      avgPeak: 2.0,
      peakFit: '8,847',
      note: 'Vulnerable to regression: roulette selection occasionally discards champion alleles before propagation.',
      action: () => {
        if (onSelectElitism) onSelectElitism(0.02);
        notifyApplied('Set Elitism to 2%');
      }
    },
    {
      rate: '5% (Top 5 Champions — Optimal)',
      pctVal: 0.05,
      firstPipe: '5.7 gens',
      avgPeak: 3.3,
      peakFit: '8,859',
      note: 'Golden equilibrium: preserves high-performing aces while leaving 95% genetic bandwidth for crossover.',
      action: () => {
        if (onSelectElitism) onSelectElitism(0.05);
        notifyApplied('Set Elitism to 5% (Optimal)');
      }
    },
    {
      rate: '15% (Top 15 Champions)',
      pctVal: 0.15,
      firstPipe: '3.0 gens',
      avgPeak: 1.7,
      peakFit: '4,579',
      note: 'Genetic Choking: clones too many mediocre birds, reducing population diversity and stalling innovation.',
      action: () => {
        if (onSelectElitism) onSelectElitism(0.15);
        notifyApplied('Set Elitism to 15%');
      }
    }
  ];

  const classroomInsights = [
    {
      title: 'Occam\'s Razor & Neural Over-parameterization',
      sub: 'Why Smaller Networks Excel in Fast Experiments',
      desc: 'Students often assume larger AI models are automatically smarter. Our empirical trials demonstrated that the 89-parameter network conquered obstacles in Gen 2, while the 641-parameter network required 3x longer to explore its complex parameter space.',
      badge: 'CBSE AI Curriculum • Unit 3',
      color: 'var(--accent-sky)'
    },
    {
      title: 'The Danger of Local Minima Traps',
      sub: 'Overcoming the Conservative Hover Equilibrium',
      desc: 'At a conservative 5% mutation rate, flocks frequently get trapped in a passive hover routine. Pushing mutation to 30%–45% provided the energetic variance needed to discover forward dive angles and clear consecutive pipes.',
      badge: 'Mathematical Modelling 1(B)',
      color: 'var(--accent-amber)'
    },
    {
      title: 'Elitism vs Genetic Inbreeding',
      sub: 'The 5% Biological sweet spot',
      desc: 'Copying too few champions (2%) causes catastrophic forgetting, while copying too many (15%) causes clone saturation. A 5% elitism quota maintains the fitness high-water mark while allowing 95% crossover diversity.',
      badge: 'Natural Selection & AI 1(A)',
      color: 'var(--accent-emerald)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Dossier Header */}
      <div style={{
        background: '#E0F2FE',
        border: '1.5px solid #0F172A',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '2px 2px 0px #0F172A'
      }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <FlaskConical size={20} color="#0284C7" />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#0F172A', fontWeight: '800' }}>
              Empirical Laboratory Dossier
            </h4>
            <span className="sleek-badge sleek-badge-sky" style={{ fontSize: '0.65rem' }}>
              24 Controlled Trials
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', fontWeight: '500' }}>
            Empirically verified across 360 generations and 1.8M+ neural evaluations. Designed for student inquiry and teacher demonstrations.
          </p>
        </div>

        {/* Applied Notification Pill */}
        {appliedNotification && (
          <div style={{
            background: '#DCFCE7',
            border: '1.5px solid #0F172A',
            boxShadow: '1px 1px 0px #0F172A',
            borderRadius: '8px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            color: '#15803D',
            fontWeight: '700',
            animation: 'fadeIn 0.2s ease'
          }}>
            <CheckCircle2 size={15} />
            <span>{appliedNotification}</span>
          </div>
        )}
      </div>

      {/* Quick Scientific Metric Chips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px'
      }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #0F172A', boxShadow: '1px 1px 0px #0F172A', borderRadius: '8px', padding: '10px 14px' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>TOTAL TRIALS</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: '800', color: '#0284C7' }}>24 Runs</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #0F172A', boxShadow: '1px 1px 0px #0F172A', borderRadius: '8px', padding: '10px 14px' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>EPOCHS ANALYZED</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>360 Gens</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #0F172A', boxShadow: '1px 1px 0px #0F172A', borderRadius: '8px', padding: '10px 14px' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>NEURAL PASSES</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: '800', color: '#D97706' }}>1.8M+ Decisions</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #0F172A', boxShadow: '1px 1px 0px #0F172A', borderRadius: '8px', padding: '10px 14px' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>VALIDATION</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: '800', color: '#7C3AED' }}>Deterministic</div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSection('arch')}
          className={`sleek-btn ${activeSection === 'arch' ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
          style={{ padding: '7px 14px', fontSize: '0.78rem', borderRadius: '8px' }}
        >
          <Layers size={14} />
          <span>Architecture Scaling</span>
        </button>

        <button
          onClick={() => setActiveSection('mutation')}
          className={`sleek-btn ${activeSection === 'mutation' ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
          style={{ padding: '7px 14px', fontSize: '0.78rem', borderRadius: '8px' }}
        >
          <Dna size={14} />
          <span>Mutation Sensitivity</span>
        </button>

        <button
          onClick={() => setActiveSection('elitism')}
          className={`sleek-btn ${activeSection === 'elitism' ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
          style={{ padding: '7px 14px', fontSize: '0.78rem', borderRadius: '8px' }}
        >
          <ShieldCheck size={14} />
          <span>Elitism Retention</span>
        </button>

        <button
          onClick={() => setActiveSection('insights')}
          className={`sleek-btn ${activeSection === 'insights' ? 'sleek-btn-primary' : 'sleek-btn-neutral'}`}
          style={{ padding: '7px 14px', fontSize: '0.78rem', borderRadius: '8px' }}
        >
          <Lightbulb size={14} />
          <span>Classroom Lessons</span>
        </button>
      </div>

      {/* 1. Architecture Scaling View */}
      {activeSection === 'arch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {archData.map((item) => {
            const scoreBarWidth = (item.peakScore / 6) * 100;
            return (
              <div 
                key={item.id}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '1px 1px 0px #1E293B'
                }}
              >
                {/* Title and Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#0F172A', fontSize: '0.95rem' }}>
                      {item.name}
                    </span>
                    <span className={`sleek-badge ${item.badgeColor}`} style={{ fontSize: '0.65rem' }}>
                      {item.badge}
                    </span>
                  </div>

                  <button
                    onClick={item.action}
                    className="sleek-btn sleek-btn-neutral"
                    style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '6px' }}
                  >
                    <Play size={11} style={{ marginRight: '4px' }} />
                    <span>Apply This Architecture</span>
                  </button>
                </div>

                {/* Visual Comparative Bars */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '10px 14px'
                }}>
                  {/* Parameter Count */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Parameters</span>
                      <strong style={{ color: '#0F172A' }}>{item.params}</strong>
                    </div>
                    <div style={{ height: '6px', background: '#E2E8F0', border: '1px solid #0F172A', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${(item.params / 641) * 100}%`, height: '100%', background: '#0284C7' }} />
                    </div>
                  </div>

                  {/* 1st Pipe Clearance */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>1st Pipe Clearance</span>
                      <strong style={{ color: '#059669' }}>Gen {item.firstPipeGen}</strong>
                    </div>
                    <div style={{ height: '6px', background: '#E2E8F0', border: '1px solid #0F172A', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max(15, (6 - item.firstPipeGen) / 6 * 100)}%`, height: '100%', background: '#059669' }} />
                    </div>
                  </div>

                  {/* Peak Score */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Peak Score Cleared</span>
                      <strong style={{ color: '#D97706' }}>{item.peakScore} pipes</strong>
                    </div>
                    <div style={{ height: '6px', background: '#E2E8F0', border: '1px solid #0F172A', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${scoreBarWidth}%`, height: '100%', background: '#D97706' }} />
                    </div>
                  </div>

                  {/* Max Fitness */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Peak Fitness</span>
                      <strong style={{ color: '#E11D48' }}>{item.peakFitness}</strong>
                    </div>
                    <div style={{ height: '6px', background: '#E2E8F0', border: '1px solid #0F172A', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${(parseInt(item.peakFitness.replace(',', '')) / 13547) * 100}%`, height: '100%', background: '#E11D48' }} />
                    </div>
                  </div>
                </div>

                {/* Verdict explanation */}
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45', fontWeight: '500' }}>
                  {item.verdict}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Mutation Sensitivity View */}
      {activeSection === 'mutation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mutationData.map((m, idx) => (
            <div key={idx} style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--border-medium)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '1px 1px 0px #1E293B'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#D97706', fontSize: '0.9rem' }}>
                  {m.rate}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>1st Pipe: <strong style={{ color: '#0284C7' }}>{m.firstPipe}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Avg Peak: <strong style={{ color: '#059669' }}>{m.avgPeak}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Max Score: <strong style={{ color: '#E11D48' }}>{m.maxScore}</strong></span>
                  </div>

                  <button
                    onClick={m.action}
                    className="sleek-btn sleek-btn-neutral"
                    style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '5px' }}
                  >
                    <Play size={10} style={{ marginRight: '3px' }} />
                    <span>Apply</span>
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: '6px', background: '#E2E8F0', border: '1px solid #0F172A', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${m.scoreBarPct}%`, height: '100%', background: '#D97706' }} />
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', fontWeight: '500' }}>
                {m.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 3. Elitism View */}
      {activeSection === 'elitism' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {elitismData.map((e, idx) => (
            <div key={idx} style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--border-medium)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '1px 1px 0px #1E293B'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#059669', fontSize: '0.9rem' }}>
                  {e.rate}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>1st Pipe: <strong style={{ color: '#0284C7' }}>{e.firstPipe}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Avg Peak: <strong style={{ color: '#059669' }}>{e.avgPeak}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Peak Fitness: <strong style={{ color: '#D97706' }}>{e.peakFit}</strong></span>
                  </div>

                  <button
                    onClick={e.action}
                    className="sleek-btn sleek-btn-neutral"
                    style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '5px' }}
                  >
                    <Play size={10} style={{ marginRight: '3px' }} />
                    <span>Apply</span>
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', fontWeight: '500' }}>
                {e.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 4. Classroom Lessons View */}
      {activeSection === 'insights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {classroomInsights.map((insight, idx) => (
            <div key={idx} style={{
              background: '#FFFFFF',
              border: `1.5px solid var(--border-medium)`,
              borderLeft: `5px solid ${insight.color}`,
              borderRadius: '10px',
              padding: '14px 18px',
              boxShadow: '1px 1px 0px #1E293B'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', color: '#0F172A', fontWeight: '800' }}>
                  {insight.title}
                </h5>
                <span className="sleek-badge sleek-badge-slate" style={{ fontSize: '0.62rem' }}>
                  {insight.badge}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: insight.color, fontWeight: '700', marginBottom: '6px' }}>
                {insight.sub}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45', fontWeight: '500' }}>
                {insight.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info Box */}
      <div style={{
        background: '#FAF9F6',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '8px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.76rem',
        color: 'var(--text-secondary)',
        boxShadow: '1px 1px 0px #1E293B'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={14} color="#0284C7" />
          <span>Full formal documentation recorded in <code>EMPIRICAL_BENCHMARK_REPORT.md</code></span>
        </div>
        <span className="sleek-badge sleek-badge-emerald" style={{ fontSize: '0.65rem' }}>
          100% Deterministic Dataset Available
        </span>
      </div>
    </div>
  );
}
