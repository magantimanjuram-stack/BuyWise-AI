import {
  FinalDecision,
  ProductRecord,
  RiskResult,
  TrustResult
} from '../types/index.js';

export function calculatePurchaseConfidence(
  fitScore: number,
  valueScore: number,
  trustScore: number,
  riskScore: number
): { purchaseConfidence: number; dataConfidence: number } {
  // Purchase confidence synthesizes Fit (35%), Value (25%), Trust (25%), Risk penalty (15%)
  const fitContrib = (fitScore / 100) * 35;
  const valueContrib = (valueScore / 100) * 25;
  const trustContrib = (trustScore / 100) * 25;
  const riskContrib = ((100 - riskScore) / 100) * 15;

  const rawConfidence = Math.round(fitContrib + valueContrib + trustContrib + riskContrib);
  const purchaseConfidence = Math.min(100, Math.max(0, rawConfidence));

  // Data confidence for development dataset
  const dataConfidence = 95;

  return { purchaseConfidence, dataConfidence };
}

export function evaluateFinalDecision(
  product: ProductRecord,
  fitScore: number,
  valueScore: number,
  trustScore: number,
  riskResult: RiskResult,
  purchaseConfidence: number,
  hardRequirementPassed: boolean
): { decision: FinalDecision; isPurchaseEligible: boolean; decisionGateTriggered?: string } {
  // DECISION GATE 1: Hard requirement failed
  if (!hardRequirementPassed) {
    return {
      decision: 'DO NOT RECOMMEND',
      isPurchaseEligible: false,
      decisionGateTriggered: 'Failed critical hard requirements specified by the user.'
    };
  }

  // DECISION GATE 2: Critical Purchase Risk (>75)
  if (riskResult.score > 75 || riskResult.level === 'CRITICAL') {
    return {
      decision: 'DO NOT RECOMMEND',
      isPurchaseEligible: false,
      decisionGateTriggered: `Critical purchase risk level (${riskResult.score}/100) due to unverified seller or listing uncertainty.`
    };
  }

  // DECISION GATE 3: High Risk (51-75)
  if (riskResult.score > 50 || riskResult.level === 'HIGH') {
    return {
      decision: 'BUY WITH CAUTION',
      isPurchaseEligible: true,
      decisionGateTriggered: 'Moderate-to-high risk flags present. Exercise caution before purchasing.'
    };
  }

  // Normal decision grading
  if (purchaseConfidence >= 85 && fitScore >= 85 && trustScore >= 80) {
    return { decision: 'EXCELLENT BUY', isPurchaseEligible: true };
  } else if (purchaseConfidence >= 75 && fitScore >= 75) {
    return { decision: 'GOOD BUY', isPurchaseEligible: true };
  } else if (purchaseConfidence >= 60) {
    return { decision: 'CONSIDER', isPurchaseEligible: true };
  } else {
    return { decision: 'BUY WITH CAUTION', isPurchaseEligible: true };
  }
}
