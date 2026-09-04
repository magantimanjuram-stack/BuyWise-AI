import React from 'react';
import { CheckCircle2, FileText, Info } from 'lucide-react';
import { DecisionTraceStep, EvidenceItem } from '../types/index.js';

interface EvidenceLedgerViewProps {
  evidence: EvidenceItem[];
  trace: DecisionTraceStep[];
}

export const EvidenceLedgerView: React.FC<EvidenceLedgerViewProps> = ({ evidence, trace }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Evidence Ledger */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <FileText size={20} color="#06b6d4" />
          <h3 style={{ fontSize: '1.2rem' }}>Evidence Ledger Records</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {evidence.map((item) => (
            <div key={item.id} className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  {item.type} EVIDENCE
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  color: '#94a3b8'
                }}>
                  {item.source}
                </span>
              </div>
              <p style={{ color: '#f1f5f9', fontSize: '0.9rem', marginBottom: '6px', fontWeight: 500 }}>
                {item.claim}
              </p>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Confidence: <strong>{item.confidence}</strong></span>
                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Trace */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Info size={20} color="#8b5cf6" />
          <h3 style={{ fontSize: '1.2rem' }}>Agent Decision Pipeline Trace</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {trace.map((step) => (
            <div key={step.step} className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: step.status === 'PASS' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                color: step.status === 'PASS' ? '#34d399' : '#a78bfa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {step.step}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', marginBottom: '2px' }}>
                  {step.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
