import React, { useRef } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, DollarSign, Eye, FileText, Gauge, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import { CanonicalCategory, UserAnalysisRequest } from '../types/index.js';
import { AnalysisForm } from './AnalysisForm.js';
import { CategorySelector } from './CategorySelector.js';

interface LandingPageProps {
  category: CanonicalCategory;
  onSelectCategory: (cat: CanonicalCategory) => void;
  onAnalyze: (req: UserAnalysisRequest) => void;
  isLoading: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  category,
  onSelectCategory,
  onAnalyze,
  isLoading
}) => {
  const categoryRef = useRef<HTMLDivElement>(null);

  const scrollToCategories = () => {
    categoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* 1. HERO SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '60px', paddingTop: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 20px',
          borderRadius: '99px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: '#38bdf8',
          fontSize: '0.88rem',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          <Sparkles size={16} /> AI Commerce Decision Agent
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Make smarter purchases,<br />not cheaper ones.
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          maxWidth: '750px',
          margin: '0 auto 36px auto',
          lineHeight: 1.6
        }}>
          An intelligent commerce decision agent that evaluates product fit, spec requirements, seller trust, price trends, review sentiment, and purchase risk before you buy.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button onClick={scrollToCategories} className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
            Start Smart Shopping <ArrowDown size={20} />
          </button>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Compare less. Decide better.</span>
        </div>
      </div>

      {/* 2. STEP 1: CHOOSE WHAT YOU WANT TO BUY */}
      <div ref={categoryRef} style={{ scrollMarginTop: '100px' }}>
        <CategorySelector selectedCategory={category} onSelectCategory={onSelectCategory} />
      </div>

      {/* 3. STEP 2-4: ANALYSIS CONFIGURATION */}
      <div style={{ marginBottom: '80px' }}>
        <AnalysisForm category={category} onAnalyze={onAnalyze} isLoading={isLoading} />
      </div>

      {/* 4. WHAT BUYWISE AI EVALUATES & PHILOSOPHY */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '60px', marginBottom: '60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '12px' }}>
          What BuyWise AI Evaluates
        </h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1rem', maxWidth: '650px', margin: '0 auto 40px auto' }}>
          How BuyWise replaces superficial price comparison with deep verification and purchase confidence.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '70px' }}>
          {/* Pillar 1: Product Fit */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', marginBottom: '18px' }}>
              <Gauge size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Product Fit & Requirements</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              Parses natural language prompts for numeric minimums (RAM, Storage, Refresh Rate, Camera) and enforces strict hard requirement gates.
            </p>
          </div>

          {/* Pillar 2: Feature / Price Value */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', marginBottom: '18px' }}>
              <DollarSign size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Feature / Price Value</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              Measures specification quality per rupee relative to category expectations, rewarding capability over cheap cutbacks.
            </p>
          </div>

          {/* Pillar 3: Seller & Listing Trust */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', marginBottom: '18px' }}>
              <Lock size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Seller & Listing Verification</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              Verifies seller marketplace credentials, official brand status, GST tax invoice availability, condition, and manufacturer warranty.
            </p>
          </div>

          {/* Pillar 4: Purchase Risk */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', marginBottom: '18px' }}>
              <ShieldAlert size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Purchase Risk Engine</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              Calculates potential risk (Low, Moderate, High, Critical) based on seller uncertainty, refurbished condition, and review concerns.
            </p>
          </div>

          {/* Pillar 5: Price & Sale Timing */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', marginBottom: '18px' }}>
              <Eye size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Price & Sale Timing</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              Tracks historical low price points, average levels, and upcoming festival sales to advise whether to <strong>BUY NOW</strong> or <strong>WAIT</strong>.
            </p>
          </div>

          {/* Pillar 6: Reviews & Evidence Ledger */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: '18px' }}>
              <FileText size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Evidence Ledger & Decision Trace</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
              Every score and decision step is logged in a transparent audit ledger for complete decision transparency.
            </p>
          </div>
        </div>

        {/* Philosophy Banner */}
        <div className="glass-card" style={{
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.25)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                The BuyWise Difference
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '14px' }}>CHEAPEST ≠ BEST</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.98rem' }}>
                Traditional aggregators push the lowest price tag, regardless of failed user requirements, unverified sellers, or missing warranties. BuyWise AI evaluates the <strong>BEST PRODUCT FOR THIS USER</strong>.
              </p>
            </div>
            <div style={{
              background: 'rgba(7, 9, 19, 0.6)',
              padding: '24px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#34d399' }}>
                <CheckCircle2 size={20} /> <strong>Explainable Decisions</strong>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                Every recommendation comes with exact spec fit breakdowns, price status, seller verification status, risk scores, and alternative loss reasons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
