import { PaymentAuditRecord } from '../types/index.js';

// In-memory store backed by audit helper
const AUDIT_LOGS: PaymentAuditRecord[] = [];

export function recordPaymentAudit(record: Omit<PaymentAuditRecord, 'id' | 'timestamp'>): PaymentAuditRecord {
  const auditEntry: PaymentAuditRecord = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...record
  };
  AUDIT_LOGS.push(auditEntry);
  console.log(`[PAYMENT AUDIT LOG] Registered transaction ID: ${auditEntry.id} for Order: ${auditEntry.razorpayOrderId}`);
  return auditEntry;
}

export function getPaymentAuditByOrderId(orderId: string): PaymentAuditRecord | undefined {
  return AUDIT_LOGS.find((entry) => entry.razorpayOrderId === orderId);
}

export function getAllPaymentAudits(): PaymentAuditRecord[] {
  return [...AUDIT_LOGS];
}
