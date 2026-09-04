import { describe, expect, it } from 'vitest';
import { PRODUCT_DATASET } from '../server/src/data/dataset.js';
import { calculatePurchaseConfidence } from '../server/src/engine/decision.js';
import { calculateProductFit } from '../server/src/engine/fit.js';
import { calculatePurchaseRisk } from '../server/src/engine/risk.js';
import { calculateTrustScore } from '../server/src/engine/trust.js';
import { calculateFeaturePriceValue } from '../server/src/engine/value.js';

describe('Scoring Engines (Fit, Value, Trust, Risk, Confidence)', () => {
  it('computes high Product Fit for MacBook Air M3 when coding requirements are met', () => {
    const macbook = PRODUCT_DATASET.find((p) => p.id === 'laptop-1')!;
    const fitRes = calculateProductFit(
      macbook,
      [{ name: '16GB RAM', key: 'ramGB', targetValue: 16, numericMin: 16, isHard: true }],
      ['Coding', 'AI Development']
    );

    expect(fitRes.score).toBeGreaterThanOrEqual(85);
    expect(fitRes.hardRequirementPassed).toBe(true);
  });

  it('severely penalizes Product Fit when a hard requirement fails', () => {
    const dell8gb = PRODUCT_DATASET.find((p) => p.id === 'laptop-5')!; // Has 8GB RAM
    const fitRes = calculateProductFit(
      dell8gb,
      [{ name: '16GB RAM', key: 'ramGB', targetValue: 16, numericMin: 16, isHard: true }],
      ['Coding']
    );

    expect(fitRes.hardRequirementPassed).toBe(false);
    expect(fitRes.score).toBeLessThan(40);
  });

  it('computes Trust score based on seller and warranty status', () => {
    const macbook = PRODUCT_DATASET.find((p) => p.id === 'laptop-1')!;
    const trustRes = calculateTrustScore(macbook);
    expect(trustRes.score).toBeGreaterThanOrEqual(90);

    const refurbLaptop = PRODUCT_DATASET.find((p) => p.id === 'laptop-6')!;
    const refurbTrust = calculateTrustScore(refurbLaptop);
    expect(refurbTrust.score).toBeLessThan(60);
  });

  it('computes Purchase Risk score (lower is better)', () => {
    const macbook = PRODUCT_DATASET.find((p) => p.id === 'laptop-1')!;
    const trustRes = calculateTrustScore(macbook);
    const riskRes = calculatePurchaseRisk(macbook, trustRes.score);
    expect(riskRes.score).toBeLessThan(25);
    expect(riskRes.level).toBe('LOW');

    const refurbLaptop = PRODUCT_DATASET.find((p) => p.id === 'laptop-6')!;
    const refurbTrust = calculateTrustScore(refurbLaptop);
    const refurbRisk = calculatePurchaseRisk(refurbLaptop, refurbTrust.score);
    expect(refurbRisk.score).toBeGreaterThan(50);
  });

  it('synthesizes Purchase Confidence correctly', () => {
    const conf = calculatePurchaseConfidence(90, 85, 95, 10);
    expect(conf.purchaseConfidence).toBeGreaterThanOrEqual(85);
    expect(conf.dataConfidence).toBe(95);
  });
});
