import React, { useState } from 'react';
import { AlertOctagon, CreditCard, ShieldCheck } from 'lucide-react';
import { BuyWiseAnalysisResponse } from '../types/index.js';

interface PurchaseAreaProps {
  analysis: BuyWiseAnalysisResponse;
  onProceedToPayment: () => void;
}

export const PurchaseArea: React.FC<PurchaseAreaProps> = ({ analysis, onProceedToPayment }) => {
  const [isApproved, setIsApproved] = useState(false);

  const product = analysis.winnerProduct;
  const decision = analysis.decision;
  const isEligible = analysis.isPurchaseEligible && decision !== 'DO NOT RECOMMEND';

  if (!product || !isEligible) {
    return (
      <div className="glass-card" style={{
        padding: '28px',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        background: 'rgba(244, 63, 94, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f87171', marginBottom: '12px' }}>
          <AlertOctagon size={28} />
          <h3 style={{ fontSize: '1.3rem' }}>Purchase Recommendation Gate Triggered</h3>
        </div>
        <p style={{ color: '#fca5a5', fontSize: '0.95rem', marginBottom: '16px' }}>
          {analysis.noResultReason || 'Normal purchase option is blocked by BuyWise AI decision gates due to failed hard requirements or elevated purchase risk flags.'}
        </p>
        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
          BuyWise AI recommends reviewing alternatives or adjusting budget/requirement constraints.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{
      padding: '32px',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            READY TO PURCHASE?
          </span>
          <h3 style={{ fontSize: '1.5rem', color: '#ffffff' }}>{product.name}</h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified Amount Payable</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        background: 'rgba(7, 9, 19, 0.5)',
        padding: '18px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>BuyWise Decision</span>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>{decision}</div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Purchase Confidence</span>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>{analysis.scores.purchaseConfidence}/100</div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Purchase Risk</span>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: analysis.scores.purchaseRisk <= 25 ? '#34d399' : '#fbbf24' }}>
            {analysis.risk.level} ({analysis.scores.purchaseRisk}/100)
          </div>
        </div>
      </div>

      {/* Explicit User Approval Checkbox */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '14px 18px',
          borderRadius: '10px',
          border: isApproved ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <input
            type="checkbox"
            checked={isApproved}
            onChange={(e) => setIsApproved(e.target.checked)}
            style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#06b6d4' }}
          />
          <span style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            I understand that BuyWise is a decision-support system and the payment will be processed through <strong>Razorpay Test Mode</strong> during development with server-side HMAC signature verification.
          </span>
        </label>
      </div>

      {/* Proceed Button */}
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={onProceedToPayment}
          disabled={!isApproved}
          className="btn-primary"
          style={{ padding: '16px 36px', fontSize: '1.1rem' }}
        >
          <CreditCard size={20} /> Proceed to Purchase
        </button>
      </div>
    </div>
  );
};
