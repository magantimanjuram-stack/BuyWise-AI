import React from 'react';
import { Calendar, DollarSign, TrendingDown } from 'lucide-react';
import { PriceIntelligenceResult, SaleTimingInfo } from '../types/index.js';

interface PriceIntelligenceViewProps {
  priceIntel: PriceIntelligenceResult;
  timing: SaleTimingInfo;
}

export const PriceIntelligenceView: React.FC<PriceIntelligenceViewProps> = ({ priceIntel, timing }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent Price': return '#34d399';
      case 'Good Price': return '#38bdf8';
      case 'Fair Price': return '#fbbf24';
      default: return '#f87171';
    }
  };

  const statusColor = getStatusColor(priceIntel.status);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      {/* Price Intelligence Box */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} color="#06b6d4" />
            <h3 style={{ fontSize: '1.1rem' }}>Price Intelligence</h3>
          </div>
          <span style={{
            background: `${statusColor}20`,
            color: statusColor,
            border: `1px solid ${statusColor}40`,
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            {priceIntel.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Current Price</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              ₹{priceIntel.currentPrice.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Historical Low</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
              ₹{priceIntel.historicalLow.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingDown size={16} color="#38bdf8" /> {priceIntel.opportunitySummary}
        </p>
      </div>

      {/* Sale / Timing Intelligence Box */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem' }}>Timing Recommendation</h3>
          </div>
          <span style={{
            background: timing.recommendation === 'BUY NOW' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: timing.recommendation === 'BUY NOW' ? '#34d399' : '#fbbf24',
            border: `1px solid ${timing.recommendation === 'BUY NOW' ? '#10b981' : '#f59e0b'}`,
            padding: '4px 14px',
            borderRadius: '99px',
            fontSize: '0.85rem',
            fontWeight: 800
          }}>
            {timing.recommendation}
          </span>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '14px' }}>
          {timing.explanation}
        </p>

        {timing.upcomingSaleEvent && (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.04)', padding: '8px 12px', borderRadius: '8px' }}>
            Historical Sale Event: <strong>{timing.upcomingSaleEvent}</strong> (~{timing.daysUntilSale} days away)
          </div>
        )}
      </div>
    </div>
  );
};
