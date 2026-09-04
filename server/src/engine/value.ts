import { ProductRecord } from '../types/index.js';

export function calculateFeaturePriceValue(product: ProductRecord, fitScore: number, userBudget: number): number {
  // Value ratio: Product Fit per Rupee relative to user budget
  // A high quality product near max budget can still get a 90+ value score if its fit is top-tier.
  // A cheap product with poor fit gets a low value score.

  const budgetUsageRatio = product.price / userBudget; // e.g. 0.85

  // Baseline spec richness
  let specQualityBonus = 0;
  const specs = product.specifications;

  if (specs.ramGB && specs.ramGB >= 16) specQualityBonus += 10;
  if (specs.storageGB && specs.storageGB >= 512) specQualityBonus += 8;
  if (specs.refreshRateHz && specs.refreshRateHz >= 120) specQualityBonus += 7;
  if (specs.hasANC) specQualityBonus += 5;
  if (specs.has5G) specQualityBonus += 5;

  // Fit score drives 60% of value score!
  // Price utilization drives 30%
  // Spec bonus drives 10%
  const fitWeight = (fitScore / 100) * 65;

  // Fair price factor (not punishing high prices if within budget, but giving slight boost for efficient spending)
  const priceFactor = budgetUsageRatio <= 1.0 ? 25 * (1 - budgetUsageRatio * 0.2) : 10;

  const total = fitWeight + priceFactor + specQualityBonus;

  return Math.min(100, Math.max(10, Math.round(total)));
}
