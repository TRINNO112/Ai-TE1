import React from 'react';
import { 
  Brain, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Layers,
  Sun,
  Moon
} from 'lucide-react';

export function Header({
  architecture = [9, 12, 12, 1],
  onOpenWalkthrough,
  soundEnabled,
  onToggleSound,
  onReset,
  theme = 'light',
  onToggleTheme
}) {
  return (
    <header className="sleek-card app-header-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      padding: '12px 18px',
      boxSizing: 'border-box'
    }}>
      {/* Brand & Academic Credential Column */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        minWidth: 'fit-content',
        flexWrap: 'wrap'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '9px',
          background: 'var(--bg-subtle)',
          border: '1.5px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-btn)',
          flexShrink: 0
        }}>
          <Brain size={20} color="#0284C7" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              lineHeight: 1.1
            }}>
              AI Neuroevolution Simulator
            </h1>
            <span className="sleek-badge sleek-badge-sky" style={{ fontSize: '0.62rem', padding: '3px 7px' }}>
              GCERT & NCERT 2026–27
            </span>
            <span className="sleek-badge sleek-badge-emerald" style={{ fontSize: '0.62rem', padding: '3px 7px' }}>
              NEP 2020
            </span>
          </div>
          <div style={{
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '3px',
            fontFamily: 'var(--font-body)',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: '#0284C7', fontWeight: '700' }}>Subtheme 1(A) AI for Life</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: '#059669', fontWeight: '700' }}>Subtheme 1(B) Math Modelling (z = W·x + b)</span>
          </div>
        </div>
      </div>

      {/* Header Actions Navigation Toolbar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        flexShrink: 0,
        flexWrap: 'wrap'
      }}>
        {/* Topology Monospace Chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 11px',
          borderRadius: '8px',
          background: 'var(--bg-subtle)',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-btn)',
          fontSize: '0.76rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <Layers size={13} color="#0284C7" />
          <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>ARCH:</span>
          <strong style={{ color: 'var(--text-primary)' }}>
            [{architecture.join('→')}]
          </strong>
        </div>

        {/* Classroom Walkthrough Button */}
        <button 
          onClick={onOpenWalkthrough}
          className="sleek-btn sleek-btn-primary"
          title="Interactive 4-Step Pedagogical Guide for Students, Teachers & Judges"
          style={{ padding: '7px 13px', fontSize: '0.78rem' }}
        >
          <GraduationCap size={15} />
          <span>Walkthrough</span>
        </button>

        {/* Dark/Light Mode Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="sleek-btn sleek-btn-neutral"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to High-Tech Dark Mode'}
          style={{ padding: '7px 12px', fontSize: '0.78rem', gap: '6px' }}
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={14} color="#FBBF24" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={14} color="#6366F1" />
              <span>Dark</span>
            </>
          )}
        </button>

        {/* Sound Toggle */}
        <button 
          onClick={onToggleSound}
          className="sleek-btn sleek-btn-neutral"
          title={soundEnabled ? 'Mute Procedural Web Audio Synth' : 'Enable Procedural Web Audio Synth'}
          style={{ padding: '7px 10px' }}
          aria-label="Toggle sound"
        >
          {soundEnabled ? (
            <Volume2 size={15} color="#059669" />
          ) : (
            <VolumeX size={15} color="var(--text-muted)" />
          )}
        </button>

        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="sleek-btn sleek-btn-neutral"
          title="Reset evolutionary population back to Generation 1"
          style={{ padding: '7px 12px', fontSize: '0.78rem', gap: '5px' }}
        >
          <RotateCcw size={14} color="#E11D48" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
