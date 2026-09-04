import React from 'react';
import { AlternativeProduct, ComparisonRow } from '../types/index.js';

interface AlternativesViewProps {
  alternatives: AlternativeProduct[];
  comparison: ComparisonRow[];
}

export const AlternativesView: React.FC<AlternativesViewProps> = ({ alternatives, comparison }) => {
  return (
    <div>
      {/* Alternatives Cards */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Top Evaluated Alternatives</h3>

      {alternatives.length === 0 ? (
        <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '32px' }}>
          No additional alternative candidates matched the criteria within selected budget.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {alternatives.map((alt, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Alternative #{idx + 1}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                  ₹{alt.product.price.toLocaleString('en-IN')}
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#ffffff' }}>
                {alt.product.name}
              </h4>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '10px', fontSize: '0.85rem' }}>
                <strong style={{ color: '#34d399' }}>Strength:</strong> <span style={{ color: '#cbd5e1' }}>{alt.strength}</span>
              </div>

              <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <strong style={{ color: '#f87171' }}>Why It Lost:</strong> <span style={{ color: '#cbd5e1' }}>{alt.whyLost}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Matrix Table */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Comprehensive Comparison Matrix</h3>
      <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '14px 16px', color: '#94a3b8' }}>Product</th>
              <th style={{ padding: '14px 16px', color: '#94a3b8' }}>Price</th>
              <th style={{ padding: '14px 16px', color: '#94a3b8' }}>Product Fit</th>
              <th style={{ padding: '14px 16px', color: '#94a3b8' }}>Value</th>
              <th style={{ padding: '14px 16px', color: '#94a3b8' }}>Trust</th>
              <th style={{ padding: '14px 16px', color: '#94a3b8' }}>Risk</th>
              <th style={{ padding: '14px 16px', color: '#94a3b8' }}>Confidence</th>
              <th style={{ padding: '14px 16px', color: '#94a3b8' }}>Decision</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, idx) => (
              <tr
                key={row.productId}
                style={{
                  background: idx === 0 ? 'rgba(6, 182, 212, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <td style={{ padding: '14px 16px', fontWeight: 600, color: idx === 0 ? '#ffffff' : '#cbd5e1' }}>
                  {row.productName} {idx === 0 && <span style={{ color: '#06b6d4', fontSize: '0.75rem' }}>(WINNER)</span>}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#38bdf8' }}>
                  ₹{row.price.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: row.fitScore >= 85 ? '#34d399' : '#fbbf24' }}>
                  {row.fitScore}/100
                </td>
                <td style={{ padding: '14px 16px' }}>{row.valueScore}/100</td>
                <td style={{ padding: '14px 16px' }}>{row.trustScore}/100</td>
                <td style={{ padding: '14px 16px', color: row.riskScore <= 25 ? '#34d399' : '#f87171' }}>
                  {row.riskScore}/100
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 800 }}>{row.purchaseConfidence}/100</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '99px',
                    background: row.decision === 'EXCELLENT BUY' || row.decision === 'GOOD BUY' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: row.decision === 'EXCELLENT BUY' || row.decision === 'GOOD BUY' ? '#34d399' : '#f87171'
                  }}>
                    {row.decision}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
