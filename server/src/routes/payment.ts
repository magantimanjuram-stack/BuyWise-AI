import crypto from 'crypto';
import { Request, Response, Router } from 'express';
import Razorpay from 'razorpay';

import { CONFIG } from '../config/index.js';
import { getPaymentAuditByOrderId, recordPaymentAudit } from '../data/audit.js';
import { PRODUCT_DATASET } from '../data/dataset.js';
import {
  PaymentOrderRequest,
  PaymentOrderResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse
} from '../types/index.js';

export const paymentRouter = Router();

// Helper to check if credentials are valid test keys or placeholders
function isPlaceholderCredential(keyId?: string, keySecret?: string): boolean {
  if (!keyId || !keySecret) return true;
  if (keyId.includes('demo_key') || keySecret.includes('demo_key')) return true;
  if (!keyId.startsWith('rzp_test_')) return true;
  return false;
}

// 1. Create Real Razorpay Order Server-Side
paymentRouter.post('/order', async (req: Request, res: Response) => {
  try {
    const { productId, userApproved } = req.body as PaymentOrderRequest;

    if (!userApproved) {
      return res.status(400).json({ error: 'Explicit user approval is required before creating a payment order.' });
    }

    const product = PRODUCT_DATASET.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: `Product with ID '${productId}' not found in backend database.` });
    }

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(product.price * 100);

    // Validate that Razorpay credentials are configured
    if (isPlaceholderCredential(CONFIG.RAZORPAY_KEY_ID, CONFIG.RAZORPAY_KEY_SECRET)) {
      return res.status(400).json({
        error: 'Razorpay Test Mode is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the server environment.'
      });
    }

    const razorpay = new Razorpay({
      key_id: CONFIG.RAZORPAY_KEY_ID,
      key_secret: CONFIG.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        productId: product.id,
        productName: product.name,
        category: product.category
      }
    };

    // Create Order through Razorpay's actual server-side Orders API
    const order = await razorpay.orders.create(options);

    const responseData: PaymentOrderResponse = {
      success: true,
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: CONFIG.RAZORPAY_KEY_ID,
      productName: product.name,
      priceINR: product.price
    };

    return res.json(responseData);
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    const msg = error.error?.description || error.message || 'Razorpay order creation failed';
    return res.status(400).json({
      error: `Razorpay Test Mode is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the server environment. (${msg})`
    });
  }
});

// 2. Verify Razorpay Payment Signature Server-Side
paymentRouter.post('/verify', (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      fitScore,
      trustScore,
      purchaseConfidence
    } = req.body as PaymentVerifyRequest;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !productId) {
      return res.status(400).json({ error: 'Missing required payment verification parameters.' });
    }

    const product = PRODUCT_DATASET.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: `Product with ID '${productId}' not found.` });
    }

    // HMAC-SHA256 signature calculation using secret
    const bodyStr = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', CONFIG.RAZORPAY_KEY_SECRET)
      .update(bodyStr)
      .digest('hex');

    // Strict signature comparison
    const isValidSignature = razorpay_signature === expectedSignature;

    if (!isValidSignature) {
      console.warn(`[PAYMENT VERIFICATION FAILED] Expected: ${expectedSignature}, Received: ${razorpay_signature}`);
      
      const audit = recordPaymentAudit({
        productId: product.id,
        productName: product.name,
        category: product.category,
        amount: product.price,
        currency: 'INR',
        decision: 'VERIFICATION_FAILED',
        purchaseConfidence: purchaseConfidence || 0,
        riskScore: 100 - (trustScore || 0),
        dataConfidence: 95,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'VERIFICATION_FAILED'
      });

      const response: PaymentVerifyResponse = {
        verified: false,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'VERIFICATION_FAILED',
        productName: product.name,
        amountPaidINR: product.price,
        message: 'Payment verification failed. HMAC-SHA256 signature mismatch.',
        auditRecord: audit
      };
      return res.status(400).json(response);
    }

    // Record verified audit
    const audit = recordPaymentAudit({
      productId: product.id,
      productName: product.name,
      category: product.category,
      amount: product.price,
      currency: 'INR',
      decision: 'SUCCESS',
      purchaseConfidence: purchaseConfidence || 88,
      riskScore: 100 - (trustScore || 80),
      dataConfidence: 95,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'SUCCESS'
    });

    const successResponse: PaymentVerifyResponse = {
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'SUCCESS',
      productName: product.name,
      amountPaidINR: product.price,
      message: 'Payment has been server-side HMAC-SHA256 verified successfully.',
      auditRecord: audit
    };

    return res.json(successResponse);
  } catch (error: any) {
    console.error('Error verifying payment signature:', error);
    return res.status(500).json({ error: error.message || 'Payment verification error' });
  }
});

// 3. Payment Status Audit Lookup
paymentRouter.get('/status/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const audit = getPaymentAuditByOrderId(orderId);
  if (!audit) {
    return res.status(404).json({ error: `Audit record for order ID '${orderId}' not found.` });
  }
  return res.json(audit);
});
