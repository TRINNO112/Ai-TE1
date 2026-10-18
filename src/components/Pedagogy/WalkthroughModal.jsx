import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Dna, 
  Calculator, 
  Cpu, 
  Award,
  Lightbulb
} from 'lucide-react';

export function WalkthroughModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Demystifying the "Black Box" — Generation 1 Chaos',
      badge: 'Step 1: The Magic Illusion',
      icon: <Cpu size={24} color="#E11D48" />,
      content: (
        <div>
          <p style={{ marginBottom: '14px', lineHeight: '1.6', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
            Today, millions of students use chatbots and voice assistants believing AI is "sentient magic". 
            Under <strong>India's National Education Policy (NEP 2020)</strong>, Class 8–12 students are mandated to learn AI and computational thinking.
          </p>
          <div style={{
            background: '#FFF1F2',
            borderLeft: '4px solid #E11D48',
            border: '1.5px solid #FDA4AF',
            padding: '14px 16px',
            borderRadius: '10px',
            marginBottom: '14px'
          }}>
            <strong style={{ color: '#BE123C', fontSize: '0.92rem' }}>What happens in Generation 1:</strong>
            <p style={{ fontSize: '0.86rem', color: '#475569', marginTop: '4px', lineHeight: '1.5' }}>
              All 150 birds flop and crash within 1.5 seconds. Why? Because the weights inside their neural brains 
              are initialized completely at random using Gaussian sampling. 
              <strong style={{ color: '#0F172A' }}> The AI knows nothing! There is no pre-coded intelligence.</strong>
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FEF3C7',
            border: '1.5px solid #FCD34D',
            padding: '10px 14px',
            borderRadius: '8px',
            color: '#B45309',
            fontSize: '0.84rem',
            fontWeight: '600'
          }}>
            <Lightbulb size={16} style={{ flexShrink: 0 }} />
            <span>Classroom Takeaway: AI does not "think". It begins as pure random numbers and iteratively discovers patterns through mathematical loss.</span>
          </div>
        </div>
      )
    },
    {
      title: 'Mathematics (Subtheme 1B) — The Objective Fitness Function',
      badge: 'Step 2: Linear Algebra & Grading',
      icon: <Calculator size={24} color="#0284C7" />,
      content: (
        <div>
          <p style={{ marginBottom: '14px', lineHeight: '1.6', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
            How does the computer determine which bird is "smarter"? Through an objective mathematical grading formula:
          </p>
          <div style={{
            background: '#F0F9FF',
            border: '1.5px solid #0284C7',
            padding: '14px 16px',
            borderRadius: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            fontWeight: '800',
            color: '#0369A1',
            textAlign: 'center',
            marginBottom: '14px',
            boxShadow: '2px 2px 0px #0F172A'
          }}>
            Fitness = (Score × 1000) + FramesSurvived - (|y - y_gap| × 0.5)
          </div>
          <ul style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong style={{ color: 'var(--text-primary)' }}>Score × 1000:</strong> High reward for successfully clearing obstacle gaps.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Frames Survived:</strong> Points for flight stamina and mid-air stability.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Gap Alignment:</strong> Distance penalty for straying away from the center line of the gap.</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Biology Meets Computer Science — Darwinian Evolution',
      badge: 'Step 3: Crossover & Mutation',
      icon: <Dna size={24} color="#059669" />,
      content: (
        <div>
          <p style={{ marginBottom: '14px', lineHeight: '1.6', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
            This simulator bridges <strong>Biology (Darwinian Natural Selection)</strong> directly with <strong>Computer Science Optimization</strong>:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              background: '#F8FAFC',
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-strong)',
              boxShadow: '2px 2px 0px #0F172A'
            }}>
              <strong style={{ color: '#15803D', fontSize: '0.88rem' }}>1. Elitism:</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Top 5% champions survive unchanged so the population never loses learned skills.
              </p>
            </div>
            <div style={{
              background: '#F8FAFC',
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-strong)',
              boxShadow: '2px 2px 0px #0F172A'
            }}>
              <strong style={{ color: '#0369A1', fontSize: '0.88rem' }}>2. Crossover:</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Pairs of top parents recombine synaptic weights like biological chromosomes.
              </p>
            </div>
            <div style={{
              background: '#F8FAFC',
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-strong)',
              boxShadow: '2px 2px 0px #0F172A'
            }}>
              <strong style={{ color: '#B45309', fontSize: '0.88rem' }}>3. Mutation:</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Weights are perturbed by Gaussian noise to discover novel flight strategies.
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FEF3C7',
            border: '1.5px solid #FCD34D',
            padding: '10px 14px',
            borderRadius: '8px',
            color: '#B45309',
            fontSize: '0.84rem',
            fontWeight: '600'
          }}>
            <Lightbulb size={16} style={{ flexShrink: 0 }} />
            <span>Classroom What-If: Drag the Mutation Slider to 50% to see chaotic extinction, or drop Elitism to 0% to see champions get forgotten!</span>
          </div>
        </div>
      )
    },
    {
      title: 'Autonomous UAV Robotics & Convergence (Subtheme 1A)',
      badge: 'Step 4: Real-World Robotics Impact',
      icon: <Award size={24} color="#7C3AED" />,
      content: (
        <div>
          <p style={{ marginBottom: '14px', lineHeight: '1.6', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
            By Generation 15–25, the birds navigate smoothly through variable speeds, moving pipes, and wind shear.
          </p>
          <div style={{
            background: '#FAF5FF',
            borderLeft: '4px solid #7C3AED',
            border: '1.5px solid #DDD6FE',
            padding: '14px 16px',
            borderRadius: '10px',
            marginBottom: '14px'
          }}>
            <strong style={{ color: '#6D28D9', fontSize: '0.92rem' }}>Industrial Robotics & UAV Drone Impact:</strong>
            <p style={{ fontSize: '0.86rem', color: '#475569', marginTop: '4px', lineHeight: '1.5' }}>
              The 9 sensory inputs mimic LiDAR and ultrasonic distance rays on autonomous drones. 
              Because the neural network is ultra-lightweight (under 300 parameters), it runs in microseconds on low-power edge microcontrollers 
              without needing internet connectivity or cloud servers!
            </p>
          </div>
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            padding: '10px 14px',
            borderRadius: '8px',
            color: '#15803D',
            fontSize: '0.88rem',
            fontWeight: '700'
          }}>
            Closing Thesis for Judges: "AI is not black magic. It is Darwinian selection, linear algebra, and iterative computational optimization."
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 1000
    }}>
      <div className="sleek-card" style={{
        width: '100%',
        maxWidth: '640px',
        padding: '28px',
        position: 'relative',
        background: '#FFFFFF',
        border: '2px solid var(--border-strong)',
        boxShadow: '6px 6px 0px #0F172A',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="sleek-btn sleek-btn-neutral"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px 10px'
          }}
          aria-label="Close walkthrough"
        >
          <X size={16} />
        </button>

        {/* Step Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingRight: '40px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#F1F5F9',
            border: '1.5px solid var(--border-strong)',
            boxShadow: '2px 2px 0px #0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {steps[currentStep].icon}
          </div>
          <div>
            <span className="sleek-badge sleek-badge-sky" style={{ marginBottom: '4px' }}>
              {steps[currentStep].badge}
            </span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginTop: '4px',
              lineHeight: '1.3'
            }}>
              {steps[currentStep].title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ minHeight: '210px', marginBottom: '20px' }}>
          {steps[currentStep].content}
        </div>

        {/* Navigation Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1.5px solid var(--border-medium)',
          paddingTop: '18px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Progress Indicators */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {steps.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentStep(idx)}
                style={{
                  width: idx === currentStep ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentStep ? '#0284C7' : '#CBD5E1',
                  border: idx === currentStep ? '1px solid #0F172A' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {currentStep > 0 && (
              <button 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="sleek-btn sleek-btn-neutral"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button 
                onClick={() => setCurrentStep(currentStep + 1)}
                className="sleek-btn sleek-btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                <span>Next Concept</span>
                <ChevronRight size={15} />
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="sleek-btn sleek-btn-emerald"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                <span>Ready to Explore Sandbox</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
