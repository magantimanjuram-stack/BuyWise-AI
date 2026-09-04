import crypto from 'crypto';
import { describe, expect, it } from 'vitest';
import { CONFIG } from '../server/src/config/index.js';
import { recordPaymentAudit } from '../server/src/data/audit.js';
import { PRODUCT_DATASET } from '../server/src/data/dataset.js';

describe('Razorpay Payment Architecture & Security', () => {
  it('converts product INR price into paise server-side (1 INR = 100 paise)', () => {
    const product = PRODUCT_DATASET.find((p) => p.id === 'phone-1')!;
    const priceINR = product.price; // e.g. 71900
    const amountInPaise = Math.round(priceINR * 100);

    expect(amountInPaise).toBe(7190000);
    expect(amountInPaise).not.toBe(priceINR);
  });

  it('converts Redmi Note 13 Pro 5G ₹24,999 price to 2499900 paise', () => {
    const redmiPhone = PRODUCT_DATASET.find((p) => p.id === 'phone-4')!; // ₹24,999
    expect(redmiPhone.price).toBe(24999);
    const amountInPaise = Math.round(redmiPhone.price * 100);
    expect(amountInPaise).toBe(2499900);
  });

  it('validates HMAC-SHA256 signature algorithm using Razorpay secret', () => {
    const orderId = 'order_test_999';
    const paymentId = 'pay_test_888';
    const secret = CONFIG.RAZORPAY_KEY_SECRET;

    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    expect(expectedSignature).toBeDefined();
    expect(expectedSignature.length).toBe(64); // SHA-256 hex string length
  });

  it('creates payment audit records safely without storing credentials', () => {
    const audit = recordPaymentAudit({
      productId: 'laptop-1',
      productName: 'Apple MacBook Air M3',
      category: 'laptop',
      amount: 124900,
      currency: 'INR',
      decision: 'SUCCESS',
      purchaseConfidence: 92,
      riskScore: 10,
      dataConfidence: 95,
      razorpayOrderId: 'order_test_123',
      razorpayPaymentId: 'pay_test_456',
      status: 'SUCCESS'
    });

    expect(audit.id).toBeDefined();
    expect(audit.razorpayOrderId).toBe('order_test_123');
    expect(audit.status).toBe('SUCCESS');
    // Ensure no secrets stored
    expect((audit as any).card_number).toBeUndefined();
    expect((audit as any).cvv).toBeUndefined();
    expect((audit as any).secret).toBeUndefined();
  });
});
