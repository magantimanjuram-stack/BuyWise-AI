import { ProductRecord, RiskLevel, RiskResult } from '../types/index.js';

export function calculatePurchaseRisk(product: ProductRecord, trustScore: number): RiskResult {
  let riskScore = 100 - trustScore; // Inverse of trust score is baseline risk
  const riskFactors: string[] = [];

  // Condition penalty
  if (product.condition === 'Refurbished') {
    riskScore += 15;
    riskFactors.push('Refurbished product condition introduces hardware reliability risk.');
  } else if (product.condition === 'Used' || product.condition === 'Unknown') {
    riskScore += 25;
    riskFactors.push('Used/Unknown item condition presents high risk.');
  }

  // Warranty penalty
  if (product.warranty.status === 'Unable to Verify') {
    riskScore += 20;
    riskFactors.push('Missing manufacturer warranty verification.');
  } else if (product.warranty.status === 'Partially Verified') {
    riskScore += 10;
    riskFactors.push('Only third-party seller warranty available.');
  }

  // Review concerns
  if (product.reviews.sentiment === 'Weak') {
    riskScore += 15;
    riskFactors.push('Weak buyer review sentiment with recurring complaint patterns.');
  }

  // Cap risk score between 0 and 100
  riskScore = Math.min(100, Math.max(0, Math.round(riskScore)));

  let level: RiskLevel = 'LOW';
  if (riskScore > 75) level = 'CRITICAL';
  else if (riskScore > 50) level = 'HIGH';
  else if (riskScore > 25) level = 'MODERATE';

  if (riskFactors.length === 0) {
    riskFactors.push('Low purchase risk. Product is sold by an authorized dealer with full manufacturer warranty.');
  }

  return {
    score: riskScore,
    level,
    riskFactors,
    explanation: `Purchase Risk is ${riskScore}/100 (${level} Risk). ${riskFactors[0]}`
  };
}
