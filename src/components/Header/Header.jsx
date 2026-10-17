import React from 'react';
import { 
  Brain, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Layers,
  Sparkles
} from 'lucide-react';

export function Header({
  architecture,
  onOpenWalkthrough,
  soundEnabled,
  onToggleSound,
  onReset
}) {
  return (
    <header className="bento-card" style={{
      margin: '16px 20px 12px 20px',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      background: '#151d30',
      border: '2.5px solid #000000',
      boxShadow: '4px 4px 0px #000000'
    }}>
      {/* Title & Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '14px',
          background: 'var(--neo-yellow)',
          border: '2.5px solid #000000',
          boxShadow: '2px 2px 0px #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Brain size={28} color="#000000" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.45rem',
              fontWeight: '900',
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}>
              AI Neuroevolution Sandbox
            </h1>
            <span className="neo-pill neo-pill-purple" style={{ fontSize: '0.72rem' }}>
              GCERT & NCERT 2026–27
            </span>
            <span className="neo-pill neo-pill-yellow" style={{ fontSize: '0.72rem' }}>
              NEP 2020 Aligned
            </span>
          </div>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-sub)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '3px',
            fontFamily: 'var(--font-body)'
          }}>
            <span style={{ color: 'var(--neo-cyan)', fontWeight: '600' }}>Subtheme 1(A) AI for Life & Drone Robotics</span>
            <span>•</span>
            <span style={{ color: 'var(--neo-emerald)', fontWeight: '600' }}>Subtheme 1(B) Mathematical Modelling (z = W · x + b)</span>
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Architecture Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '10px',
          background: '#0f172a',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <Layers size={15} color="var(--neo-purple)" />
          <span style={{ color: 'var(--text-muted)' }}>Topology:</span>
          <span style={{ color: 'var(--neo-yellow)', fontWeight: '800' }}>
            [{architecture.join(' → ')}]
          </span>
        </div>

        {/* Guided Walkthrough Button */}
        <button 
          onClick={onOpenWalkthrough}
          className="neo-btn neo-btn-cyan"
          title="Interactive 4-Step Pedagogical Guide for Students, Teachers & Science Fair Judges"
        >
          <GraduationCap size={18} strokeWidth={2.5} />
          <span>Classroom Walkthrough</span>
        </button>

        {/* Sound Toggle */}
        <button 
          onClick={onToggleSound}
          className="neo-btn neo-btn-neutral"
          title={soundEnabled ? 'Mute Procedural Web Audio Synth' : 'Enable Procedural Web Audio Synth'}
          style={{ padding: '10px 14px' }}
        >
          {soundEnabled ? (
            <Volume2 size={18} color="var(--neo-emerald)" strokeWidth={2.5} />
          ) : (
            <VolumeX size={18} color="var(--text-muted)" strokeWidth={2.5} />
          )}
        </button>

        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="neo-btn neo-btn-coral"
          title="Reset evolutionary population back to Generation 1"
          style={{ padding: '10px 14px' }}
        >
          <RotateCcw size={18} strokeWidth={2.5} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
