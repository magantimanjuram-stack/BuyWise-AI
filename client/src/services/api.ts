import {
  BuyWiseAnalysisResponse,
  PaymentOrderResponse,
  PaymentVerifyResponse,
  UserAnalysisRequest
} from '../types/index.js';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

export async function analyzeBuyWise(request: UserAnalysisRequest): Promise<BuyWiseAnalysisResponse> {
  const response = await fetch(`${API_BASE}/buywise/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Network response was not ok' }));
    throw new Error(errData.error || 'Failed to perform analysis');
  }

  return response.json();
}

export async function createPaymentOrder(productId: string, userApproved: boolean): Promise<PaymentOrderResponse> {
  const response = await fetch(`${API_BASE}/payment/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId, userApproved })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Failed to create payment order' }));
    throw new Error(errData.error || 'Payment order creation failed');
  }

  return response.json();
}

export async function verifyPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  productId: string;
  fitScore: number;
  trustScore: number;
  purchaseConfidence: number;
}): Promise<PaymentVerifyResponse> {
  const response = await fetch(`${API_BASE}/payment/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok && !data.verified) {
    return data as PaymentVerifyResponse;
  }

  return data as PaymentVerifyResponse;
}
