import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Star, ThumbsUp } from 'lucide-react';
import { BuyWiseAnalysisResponse } from '../types/index.js';
import { AlternativesView } from './AlternativesView.js';
import { EvidenceLedgerView } from './EvidenceLedgerView.js';
import { PaymentResultModal } from './PaymentResultModal.js';
import { PriceIntelligenceView } from './PriceIntelligenceView.js';
import { PurchaseArea } from './PurchaseArea.js';
import { ScoreGauge } from './ScoreGauge.js';
import { VerificationView } from './VerificationView.js';

interface ResultsViewProps {
  analysis: BuyWiseAnalysisResponse;
  onNewSearch: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ analysis, onNewSearch }) => {
  const [activeTab, setActiveTab] = useState<'why' | 'price' | 'verification' | 'alternatives' | 'evidence'>('why');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const product = analysis.winnerProduct;
  const decision = analysis.decision;
  const scores = analysis.scores;

  const getDecisionBadgeClass = (dec: string) => {
    switch (dec) {
      case 'EXCELLENT BUY': return 'badge-decision badge-excellent';
      case 'GOOD BUY': return 'badge-decision badge-good';
      case 'CONSIDER': return 'badge-decision badge-consider';
      case 'BUY WITH CAUTION': return 'badge-decision badge-caution';
      default: return 'badge-decision badge-do-not-recommend';
    }
  };

  // If no product found or budget insufficient
  if (!product || decision === 'DO NOT RECOMMEND') {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <button onClick={onNewSearch} className="btn-secondary" style={{ marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Search
        </button>

        <div className="glass-card" style={{
          padding: '40px',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          background: 'rgba(244, 63, 94, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.2)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <AlertCircle size={36} />
          </div>

          <h2 style={{ fontSize: '1.8rem', color: '#f87171', marginBottom: '12px' }}>
            No Suitable Product Found
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 24px auto' }}>
            {analysis.noResultReason || 'The evaluation engine could not recommend a product matching your budget and hard requirement constraints.'}
          </p>

          <button onClick={onNewSearch} className="btn-primary" style={{ padding: '14px 32px' }}>
            Adjust Budget or Requirements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button onClick={onNewSearch} className="btn-secondary">
          <ArrowLeft size={16} /> Adjust Search Parameters
        </button>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Evaluated against {analysis.comparison.length} candidate products
        </span>
      </div>

      {/* TOP HERO RECOMMENDATION CARD */}
      <div className="glass-card" style={{
        padding: '36px',
        marginBottom: '36px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.75) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          borderRadius: '99px',
          background: 'rgba(6, 182, 212, 0.15)',
          color: '#38bdf8',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <Sparkles size={14} /> BUYWISE AUTHORITATIVE RECOMMENDATION
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
          {/* Left: Product Image & Details */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: '140px',
                  height: '140px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className={getDecisionBadgeClass(decision)}>
                  {decision}
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '99px'
                }}>
                  Data Confidence: {scores.dataConfidence}%
                </span>
              </div>

              <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#ffffff' }}>
                {product.name}
              </h1>

              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Right: Purchase Confidence Radial Score */}
          <div style={{
            background: 'rgba(7, 9, 19, 0.6)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <ScoreGauge
              score={scores.purchaseConfidence}
              label="Purchase Confidence"
              sublabel="Synthesized AI Score"
            />
          </div>
        </div>
      </div>

      {/* 4 CORE METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <ScoreGauge score={scores.productFit} label="Product Fit" sublabel="Spec Match" />
        </div>

        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <ScoreGauge score={scores.featureValue} label="Feature / Value" sublabel="Per Rupee Value" />
        </div>

        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <ScoreGauge score={scores.trustScore} label="Trust Score" sublabel="Seller & Warranty" />
        </div>

        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <ScoreGauge score={scores.purchaseRisk} label="Purchase Risk" isRisk={true} sublabel={analysis.risk.level} />
        </div>
      </div>

      {/* TABBED DETAILED SECTION */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
        {/* Tab Headers */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '28px',
          overflowX: 'auto',
          gap: '8px'
        }}>
          <button
            onClick={() => setActiveTab('why')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              color: activeTab === 'why' ? '#06b6d4' : '#94a3b8',
              borderBottom: activeTab === 'why' ? '2px solid #06b6d4' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Why Recommends
          </button>

          <button
            onClick={() => setActiveTab('price')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              color: activeTab === 'price' ? '#06b6d4' : '#94a3b8',
              borderBottom: activeTab === 'price' ? '2px solid #06b6d4' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Price & Sale Timing
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              color: activeTab === 'verification' ? '#06b6d4' : '#94a3b8',
              borderBottom: activeTab === 'verification' ? '2px solid #06b6d4' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Seller & Warranty
          </button>

          <button
            onClick={() => setActiveTab('alternatives')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              color: activeTab === 'alternatives' ? '#06b6d4' : '#94a3b8',
              borderBottom: activeTab === 'alternatives' ? '2px solid #06b6d4' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Alternatives & Comparison
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              color: activeTab === 'evidence' ? '#06b6d4' : '#94a3b8',
              borderBottom: activeTab === 'evidence' ? '2px solid #06b6d4' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Evidence & Trace
          </button>
        </div>

        {/* Tab 1: Why BuyWise Recommends */}
        {activeTab === 'why' && (
          <div>
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '28px',
              fontSize: '1rem',
              color: '#e2e8f0',
              lineHeight: 1.6
            }}>
              <strong>WHY THIS PRODUCT WON:</strong> {analysis.explanations.whyWon}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ThumbsUp size={18} /> STRENGTHS
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {analysis.explanations.strengths.map((str, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                      <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={18} /> WHAT TO WATCH OUT FOR
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {analysis.explanations.concerns.length === 0 ? (
                    <li style={{ fontSize: '0.9rem', color: '#94a3b8' }}>No major recurring concerns identified.</li>
                  ) : (
                    analysis.explanations.concerns.map((con, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        <AlertTriangle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{con}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Price & Sale Timing */}
        {activeTab === 'price' && (
          <PriceIntelligenceView priceIntel={analysis.priceIntelligence} timing={analysis.timingInfo} />
        )}

        {/* Tab 3: Verification */}
        {activeTab === 'verification' && (
          <VerificationView product={product} verification={analysis.verification} />
        )}

        {/* Tab 4: Alternatives */}
        {activeTab === 'alternatives' && (
          <AlternativesView alternatives={analysis.alternatives} comparison={analysis.comparison} />
        )}

        {/* Tab 5: Evidence */}
        {activeTab === 'evidence' && (
          <EvidenceLedgerView evidence={analysis.evidenceLedger} trace={analysis.decisionTrace} />
        )}
      </div>

      {/* PURCHASE AREA */}
      <PurchaseArea analysis={analysis} onProceedToPayment={() => setShowPaymentModal(true)} />

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <PaymentResultModal analysis={analysis} onClose={() => setShowPaymentModal(false)} />
      )}
    </div>
  );
};
