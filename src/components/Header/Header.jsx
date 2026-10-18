import React from 'react';
import { 
  Brain, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Layers,
  Sparkles,
  Bot,
  Binary
} from 'lucide-react';

export function Header({
  architecture,
  onOpenWalkthrough,
  soundEnabled,
  onToggleSound,
  onReset
}) {
  return (
    <header className="sleek-card app-header-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* Title & Exhibition Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 280px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: '#E0F2FE',
          border: '1.5px solid #0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 2px 0px #0F172A',
          flexShrink: 0
        }}>
          <Brain size={24} color="#0284C7" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}>
              AI Neuroevolution Simulator
            </h1>
            <span className="sleek-badge sleek-badge-sky" style={{ fontSize: '0.62rem' }}>
              GCERT & NCERT 2026–27
            </span>
            <span className="sleek-badge sleek-badge-emerald" style={{ fontSize: '0.62rem' }}>
              NEP 2020 Aligned
            </span>
          </div>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '4px',
            fontFamily: 'var(--font-body)'
          }}>
            <span style={{ color: '#0284C7', fontWeight: '700' }}>Subtheme 1(A) AI for Life & UAV Robotics</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: '#059669', fontWeight: '700' }}>Subtheme 1(B) Mathematical Modelling (z = W · x + b)</span>
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Topology Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '8px',
          background: '#F8FAFC',
          border: '1.5px solid #0F172A',
          boxShadow: '1px 1px 0px #0F172A',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <Layers size={14} color="#0284C7" />
          <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>TOPOLOGY:</span>
          <span style={{ color: '#0F172A', fontWeight: '800' }}>
            [{architecture.join(' → ')}]
          </span>
        </div>

        {/* Classroom Walkthrough Button */}
        <button 
          onClick={onOpenWalkthrough}
          className="sleek-btn sleek-btn-primary"
          title="Interactive 4-Step Pedagogical Guide for Students, Teachers & Science Fair Judges"
        >
          <GraduationCap size={16} />
          <span>Classroom Walkthrough</span>
        </button>

        {/* Sound Toggle */}
        <button 
          onClick={onToggleSound}
          className="sleek-btn sleek-btn-neutral"
          title={soundEnabled ? 'Mute Procedural Web Audio Synth' : 'Enable Procedural Web Audio Synth'}
          style={{ padding: '10px 12px' }}
        >
          {soundEnabled ? (
            <Volume2 size={16} color="#34d399" />
          ) : (
            <VolumeX size={16} color="var(--text-muted)" />
          )}
        </button>

        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="sleek-btn sleek-btn-neutral"
          title="Reset evolutionary population back to Generation 1"
          style={{ padding: '10px 14px' }}
        >
          <RotateCcw size={15} color="#f43f5e" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
