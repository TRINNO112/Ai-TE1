import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Dna, 
  Calculator, 
  Cpu, 
  Award
} from 'lucide-react';

export function WalkthroughModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Demystifying the "Black Box" — Generation 1 Chaos',
      badge: 'Step 1: The Magic Illusion',
      icon: <Cpu size={26} color="#000000" strokeWidth={2.5} />,
      pillColor: 'var(--neo-coral)',
      content: (
        <div>
          <p style={{ marginBottom: '14px', lineHeight: '1.6', fontSize: '0.92rem', color: '#FFFFFF' }}>
            Today, millions of students use chatbots and Siri believing AI is "sentient magic". 
            Under <strong>India's National Education Policy (NEP 2020)</strong>, Class 8–12 students are mandated to learn AI and computational thinking.
          </p>
          <div style={{
            background: '#0f172a',
            border: '2px solid #000000',
            borderLeft: '6px solid var(--neo-coral)',
            boxShadow: '3px 3px 0px #000000',
            padding: '14px 16px',
            borderRadius: '10px',
            marginBottom: '14px'
          }}>
            <strong style={{ color: 'var(--neo-coral)', fontSize: '0.92rem' }}>What happens in Generation 1:</strong>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-sub)', marginTop: '4px', lineHeight: '1.5' }}>
              All 150 birds flop and crash within 1.5 seconds. Why? Because the weights inside their neural brains 
              are initialized completely at random. 
              <strong> The AI knows nothing! There is no pre-coded intelligence.</strong>
            </p>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--neo-yellow)', fontWeight: '600' }}>
            💡 Classroom Takeaway: AI does not "think". It begins as pure random numbers and iteratively discovers patterns.
          </p>
        </div>
      )
    },
    {
      title: 'Mathematics (Subtheme 1B) — The Objective Fitness Function',
      badge: 'Step 2: Linear Algebra & Grading',
      icon: <Calculator size={26} color="#000000" strokeWidth={2.5} />,
      pillColor: 'var(--neo-cyan)',
      content: (
        <div>
          <p style={{ marginBottom: '14px', lineHeight: '1.6', fontSize: '0.92rem', color: '#FFFFFF' }}>
            How does the computer determine which bird is "smarter"? Through an objective mathematical grading formula:
          </p>
          <div style={{
            background: '#0f172a',
            border: '2.5px solid #000000',
            boxShadow: '4px 4px 0px #000000',
            padding: '16px',
            borderRadius: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--neo-cyan)',
            textAlign: 'center',
            marginBottom: '14px'
          }}>
            Fitness = (Score × 1000) + FramesSurvived - (|y - y_gap| × 0.5)
          </div>
          <ul style={{ fontSize: '0.86rem', color: 'var(--text-sub)', paddingLeft: '22px', lineHeight: '1.8' }}>
            <li><strong>Score × 1000:</strong> High reward for successfully clearing obstacle gaps.</li>
            <li><strong>Frames Survived:</strong> Points for flight stamina and mid-air stability.</li>
            <li><strong>Gap Alignment:</strong> Distance penalty for straying away from the center line of the gap.</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Biology Meets Computer Science — Darwinian Evolution',
      badge: 'Step 3: Crossover & Mutation',
      icon: <Dna size={26} color="#000000" strokeWidth={2.5} />,
      pillColor: 'var(--neo-emerald)',
      content: (
        <div>
          <p style={{ marginBottom: '14px', lineHeight: '1.6', fontSize: '0.92rem', color: '#FFFFFF' }}>
            This simulator bridges <strong>Biology (Darwinian Natural Selection)</strong> directly with <strong>Computer Science Optimization</strong>:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}>
              <strong style={{ color: 'var(--neo-emerald)', fontSize: '0.88rem' }}>1. Elitism:</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                Top 5% champions survive unchanged so the population never loses learned skills.
              </p>
            </div>
            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}>
              <strong style={{ color: 'var(--neo-cyan)', fontSize: '0.88rem' }}>2. Crossover:</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                Pairs of top parents recombine synaptic weights like biological chromosomes.
              </p>
            </div>
            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '10px', border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}>
              <strong style={{ color: 'var(--neo-yellow)', fontSize: '0.88rem' }}>3. Mutation:</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                Weights are perturbed by Gaussian noise to discover novel flight strategies.
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--neo-yellow)', fontWeight: '600' }}>
            🧪 Classroom What-If: Drag the Mutation Slider to 50% to see chaotic extinction, or drop Elitism to 0% to see champions get forgotten!
          </p>
        </div>
      )
    },
    {
      title: 'Autonomous UAV Robotics & Convergence (Subtheme 1A)',
      badge: 'Step 4: Real-World Robotics Impact',
      icon: <Award size={26} color="#000000" strokeWidth={2.5} />,
      pillColor: 'var(--neo-purple)',
      content: (
        <div>
          <p style={{ marginBottom: '14px', lineHeight: '1.6', fontSize: '0.92rem', color: '#FFFFFF' }}>
            By Generation 15–25, the birds navigate smoothly through variable speeds, moving pipes, and wind shear.
          </p>
          <div style={{
            background: '#0f172a',
            border: '2px solid #000000',
            borderLeft: '6px solid var(--neo-purple)',
            boxShadow: '3px 3px 0px #000000',
            padding: '14px 16px',
            borderRadius: '10px',
            marginBottom: '14px'
          }}>
            <strong style={{ color: 'var(--neo-purple)', fontSize: '0.92rem' }}>Industrial Robotics & UAV Drone Impact:</strong>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-sub)', marginTop: '4px', lineHeight: '1.5' }}>
              The 9 sensory inputs mimic LiDAR and ultrasonic distance rays on autonomous drones. 
              Because the neural network is ultra-lightweight (under 300 parameters), it runs in microseconds on low-power edge microcontrollers 
              without needing internet connectivity or cloud servers!
            </p>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--neo-emerald)', fontWeight: '700' }}>
            🎯 Closing Thesis for Judges: "AI is not black magic. It is Darwinian selection, linear algebra, and iterative computational optimization."
          </p>
        </div>
      )
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 7, 18, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000
    }}>
      <div className="bento-card" style={{
        width: '100%',
        maxWidth: '660px',
        padding: '28px',
        position: 'relative',
        background: '#151d30',
        border: '3px solid #000000',
        boxShadow: '8px 8px 0px #000000'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="neo-btn neo-btn-coral"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            padding: '6px 10px'
          }}
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Step Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: steps[currentStep].pillColor,
            border: '2.5px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {steps[currentStep].icon}
          </div>
          <div>
            <span className="neo-pill neo-pill-yellow" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>
              {steps[currentStep].badge}
            </span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: '900',
              color: '#FFFFFF',
              marginTop: '2px'
            }}>
              {steps[currentStep].title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ minHeight: '220px', marginBottom: '22px' }}>
          {steps[currentStep].content}
        </div>

        {/* Navigation Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '2.5px solid #000000',
          paddingTop: '18px'
        }}>
          {/* Progress Indicators */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {steps.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentStep(idx)}
                style={{
                  width: idx === currentStep ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '999px',
                  background: idx === currentStep ? 'var(--neo-yellow)' : '#334155',
                  border: '1.5px solid #000000',
                  boxShadow: idx === currentStep ? '1px 1px 0px #000000' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentStep > 0 && (
              <button 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="neo-btn neo-btn-neutral"
                style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
                <span>Previous</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button 
                onClick={() => setCurrentStep(currentStep + 1)}
                className="neo-btn neo-btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.84rem' }}
              >
                <span>Next Concept</span>
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="neo-btn neo-btn-emerald"
                style={{ padding: '8px 20px', fontSize: '0.84rem' }}
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
