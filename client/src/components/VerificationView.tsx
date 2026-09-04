import React from 'react';
import { AlertTriangle, CheckCircle, FileCheck, Shield, Store } from 'lucide-react';
import { ProductRecord, VerificationResult } from '../types/index.js';

interface VerificationViewProps {
  product: ProductRecord;
  verification: VerificationResult;
}

export const VerificationView: React.FC<VerificationViewProps> = ({ product, verification }) => {
  const seller = product.seller;
  const listing = product.listing;
  const warranty = product.warranty;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {/* Seller Verification Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Store size={20} color="#a78bfa" />
          <h3 style={{ fontSize: '1.1rem' }}>Seller Verification</h3>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{seller.name}</div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Marketplace: {listing.marketplace}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Seller Trust Score:</span>
            <strong style={{ color: seller.trustRating >= 90 ? '#34d399' : '#fbbf24' }}>{seller.trustRating}/100</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Official Brand Store:</span>
            <strong>{seller.isOfficialBrandStore ? 'YES ✓' : 'NO (Third-Party)'}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Fulfillment Rate:</span>
            <strong>{seller.fulfillmentRate}%</strong>
          </div>
        </div>
      </div>

      {/* Listing & Condition Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <FileCheck size={20} color="#38bdf8" />
          <h3 style={{ fontSize: '1.1rem' }}>Listing & Condition</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: '#94a3b8', display: 'block' }}>Variant ID:</span>
            <strong style={{ color: '#e2e8f0' }}>{listing.listingId} ({listing.variant})</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Product Condition:</span>
            <span style={{
              background: product.condition === 'New' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: product.condition === 'New' ? '#34d399' : '#fbbf24',
              padding: '2px 10px',
              borderRadius: '99px',
              fontWeight: 700
            }}>
              {product.condition}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>GST Tax Invoice:</span>
            <strong style={{ color: listing.invoiceProvided ? '#34d399' : '#f87171' }}>
              {listing.invoiceProvided ? 'Provided ✓' : 'Not Verified'}
            </strong>
          </div>
        </div>
      </div>

      {/* Warranty Intelligence Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={20} color="#34d399" />
          <h3 style={{ fontSize: '1.1rem' }}>Warranty Intelligence</h3>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>{warranty.type}</div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Duration: {warranty.durationMonths} Months</span>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.82rem',
          color: '#cbd5e1',
          marginBottom: '10px'
        }}>
          {warranty.coverage}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          {warranty.status === 'Verified' ? (
            <CheckCircle size={16} color="#34d399" />
          ) : (
            <AlertTriangle size={16} color="#fbbf24" />
          )}
          <span style={{ color: warranty.status === 'Verified' ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
            {warranty.status}: {warranty.evidence}
          </span>
        </div>
      </div>
    </div>
  );
};
