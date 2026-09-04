import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  activeCategory?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, activeCategory }) => {
  return (
    <header style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(7, 9, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo & Tagline */}
        <div onClick={onReset} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)'
          }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>BuyWise AI</span>
              <span style={{
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#38bdf8',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '99px',
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}>DECISION AGENT</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Make smarter purchases, not cheaper ones.</p>
          </div>
        </div>

        {/* Category Indicator or Reset CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {activeCategory && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 14px',
              borderRadius: '99px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.85rem',
              color: '#cbd5e1',
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={14} color="#06b6d4" />
              Category: <strong>{activeCategory}</strong>
            </div>
          )}

          <button onClick={onReset} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            New Analysis
          </button>
        </div>
      </div>
    </header>
  );
};
