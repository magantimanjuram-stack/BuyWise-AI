import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const PIPELINE_STEPS = [
  'Normalizing category & applying budget filter...',
  'Extracting natural language requirements & hard constraints...',
  'Computing dynamic purpose weights...',
  'Evaluating product fit & feature-to-price value...',
  'Running price intelligence & sale timing analysis...',
  'Verifying seller credentials & warranty records...',
  'Calculating trust score & purchase risk matrix...',
  'Synthesizing final BuyWise decision...'
];

export const LoadingState: React.FC = () => {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round(((stepIdx + 1) / PIPELINE_STEPS.length) * 100);

  return (
    <div className="glass-card" style={{ padding: '48px 36px', textAlign: 'center', maxWidth: '650px', margin: '40px auto' }}>
      <div className="pulse-glow" style={{ fontSize: '3rem', marginBottom: '20px' }}>💎</div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#06b6d4', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px' }}>
        <Sparkles size={16} /> BuyWise Orchestration Engine Active
      </div>

      <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Evaluating Available Products...</h3>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '10px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '99px',
        overflow: 'hidden',
        marginBottom: '18px'
      }}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
          borderRadius: '99px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      <div style={{ color: '#cbd5e1', fontSize: '0.95rem', fontWeight: 500, minHeight: '30px' }}>
        {PIPELINE_STEPS[stepIdx]}
      </div>
    </div>
  );
};
