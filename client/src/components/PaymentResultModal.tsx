import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { createPaymentOrder, verifyPayment } from '../services/api.js';
import { BuyWiseAnalysisResponse, PaymentVerifyResponse } from '../types/index.js';

interface PaymentResultModalProps {
  analysis: BuyWiseAnalysisResponse;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentResultModal: React.FC<PaymentResultModalProps> = ({ analysis, onClose }) => {
  const [step, setStep] = useState<'IDLE' | 'CREATING_ORDER' | 'CHECKOUT_OPEN' | 'VERIFYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [verifyResponse, setVerifyResponse] = useState<PaymentVerifyResponse | null>(null);

  const product = analysis.winnerProduct;
  if (!product) return null;

  const handleStartPayment = async () => {
    try {
      setStep('CREATING_ORDER');
      setErrorMessage('');

      // 1. Create Real Order via Backend Razorpay Orders API (Paise conversion: ₹24,999 -> 2499900 paise)
      const orderData = await createPaymentOrder(product.id, true);

      // Check if Razorpay Checkout SDK (v1/checkout.js) is available in browser window
      if (!window.Razorpay) {
        setErrorMessage('Razorpay Checkout SDK failed to load. Check your internet connection.');
        setStep('FAILED');
        return;
      }

      setStep('CHECKOUT_OPEN');

      // 2. Setup Official Razorpay Standard Checkout Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'BuyWise AI Commerce',
        description: `Order for ${product.name}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          setStep('VERIFYING');
          try {
            // 3. Server-Side HMAC-SHA256 Signature Verification
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productId: product.id,
              fitScore: analysis.scores.productFit,
              trustScore: analysis.scores.trustScore,
              purchaseConfidence: analysis.scores.purchaseConfidence
            });

            if (verifyResult.verified && verifyResult.status === 'SUCCESS') {
              setVerifyResponse(verifyResult);
              setStep('SUCCESS');
            } else {
              setErrorMessage(verifyResult.message || 'Payment verification failed. HMAC-SHA256 signature mismatch.');
              setStep('FAILED');
            }
          } catch (verifyErr: any) {
            setErrorMessage(verifyErr.message || 'Server payment verification request failed.');
            setStep('FAILED');
          }
        },
        prefill: {
          name: 'BuyWise User',
          email: 'success@razorpay',
          contact: '9999999999'
        },
        theme: {
          color: '#06b6d4'
        },
        modal: {
          ondismiss: () => {
            if (step !== 'SUCCESS' && step !== 'VERIFYING') {
              setStep('IDLE');
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response: any) {
        console.warn('[RAZORPAY PAYMENT FAILED]', response.error);
        setErrorMessage(response.error?.description || response.error?.reason || 'Razorpay payment was declined.');
        setStep('FAILED');
      });

      rzp.open();
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setErrorMessage(err.message || 'Razorpay Test Mode is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the server environment.');
      setStep('FAILED');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '36px',
        position: 'relative',
        background: '#0f172a',
        border: '1px solid rgba(6, 182, 212, 0.3)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        {/* 1. IDLE STATE */}
        {step === 'IDLE' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <ShieldCheck size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Razorpay Test Checkout</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px' }}>
              Order will be created via Razorpay Orders API for <strong>{product.name}</strong> at <strong>₹{product.price.toLocaleString('en-IN')}</strong>.
            </p>

            <button onClick={handleStartPayment} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              Launch Checkout Window
            </button>
          </div>
        )}

        {/* 2. LOADING STATES */}
        {(step === 'CREATING_ORDER' || step === 'VERIFYING') && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div className="pulse-glow" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💎</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              {step === 'CREATING_ORDER' ? 'Creating Razorpay Server Order...' : 'Verifying HMAC-SHA256 Signature...'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Communicating with Razorpay & server payment API...</p>
          </div>
        )}

        {/* 3. CHECKOUT ACTIVE */}
        {step === 'CHECKOUT_OPEN' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="pulse-glow" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💳</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Razorpay Standard Checkout Window Active</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Complete the test payment in the official Razorpay Checkout popup window...
            </p>
          </div>
        )}

        {/* 4. SUCCESS STATE */}
        {step === 'SUCCESS' && verifyResponse && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontSize: '0.8rem',
              fontWeight: 800,
              padding: '4px 14px',
              borderRadius: '99px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              marginBottom: '16px',
              display: 'inline-block'
            }}>
              PAYMENT VERIFIED ✓
            </span>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Transaction Verified</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
              Server-side HMAC-SHA256 signature verification succeeded.
            </p>

            <div style={{
              background: 'rgba(7, 9, 19, 0.6)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'left',
              marginBottom: '24px',
              fontSize: '0.88rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Product:</span>
                <strong style={{ color: '#ffffff' }}>{verifyResponse.productName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Amount Paid:</span>
                <strong style={{ color: '#38bdf8' }}>₹{verifyResponse.amountPaidINR.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Payment ID:</span>
                <strong style={{ color: '#a78bfa' }}>{verifyResponse.paymentId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Order ID:</span>
                <strong>{verifyResponse.orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>BuyWise Decision:</span>
                <strong style={{ color: '#34d399' }}>{analysis.decision}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Purchase Confidence:</span>
                <strong>{analysis.scores.purchaseConfidence}/100</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
              Payment has been verified. BuyWise does not provide merchant fulfillment or delivery tracking unless a real merchant integration is connected.
            </p>

            <button onClick={onClose} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Done
            </button>
          </div>
        )}

        {/* 5. FAILED STATE */}
        {step === 'FAILED' && (
          <div style={{ textAlign: 'center' }}>
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

            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: '#f87171' }}>Razorpay Checkout Error</h3>
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '16px',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '0.9rem',
              marginBottom: '24px',
              lineHeight: 1.5,
              textAlign: 'left'
            }}>
              {errorMessage || 'Razorpay Test Mode is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the server environment.'}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleStartPayment} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                Retry Checkout
              </button>
              <button onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
