import { describe, expect, it } from 'vitest';
import { PRODUCT_DATASET } from '../server/src/data/dataset.js';
import { evaluateFinalDecision } from '../server/src/engine/decision.js';

describe('Decision Engine & Decision Gates', () => {
  const sampleProduct = PRODUCT_DATASET[0];

  it('triggers DO NOT RECOMMEND gate when hard requirement fails', () => {
    const decisionRes = evaluateFinalDecision(
      sampleProduct,
      30, // low fit
      70,
      90,
      { score: 20, level: 'LOW', riskFactors: [], explanation: '' },
      40,
      false // hardRequirementPassed = false
    );

    expect(decisionRes.decision).toBe('DO NOT RECOMMEND');
    expect(decisionRes.isPurchaseEligible).toBe(false);
    expect(decisionRes.decisionGateTriggered).toContain('Failed critical hard requirements');
  });

  it('triggers DO NOT RECOMMEND gate when purchase risk is critical (>75)', () => {
    const decisionRes = evaluateFinalDecision(
      sampleProduct,
      90,
      85,
      30,
      { score: 80, level: 'CRITICAL', riskFactors: ['Critical unverified seller risk'], explanation: '' },
      45,
      true
    );

    expect(decisionRes.decision).toBe('DO NOT RECOMMEND');
    expect(decisionRes.isPurchaseEligible).toBe(false);
  });

  it('evaluates EXCELLENT BUY when fit, trust, and confidence are high', () => {
    const decisionRes = evaluateFinalDecision(
      sampleProduct,
      90,
      85,
      95,
      { score: 10, level: 'LOW', riskFactors: [], explanation: '' },
      92,
      true
    );

    expect(decisionRes.decision).toBe('EXCELLENT BUY');
    expect(decisionRes.isPurchaseEligible).toBe(true);
  });
});
