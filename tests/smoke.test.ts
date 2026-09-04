import { describe, expect, it } from 'vitest';
import { runBuyWiseOrchestration } from '../server/src/engine/orchestrator.js';

describe('BuyWise AI Full 6-Category Smoke Test', () => {
  const CATEGORIES = [
    { inputCategory: 'mobile', canonical: 'smartphone', budget: 75000, req: '128GB, 5G, 120Hz display, good camera' },
    { inputCategory: 'notebook', canonical: 'laptop', budget: 130000, req: '16GB RAM, 512GB SSD, M3 or Ryzen 7, coding' },
    { inputCategory: 'smart tv', canonical: 'tv', budget: 135000, req: '55-inch, 4K, 120Hz, Dolby Vision, movies' },
    { inputCategory: 'headphone', canonical: 'headphones', budget: 30000, req: 'ANC active noise cancellation, 30hr battery, calls' },
    { inputCategory: 'earbuds/bluetooth', canonical: 'earbuds', budget: 25000, req: 'ANC, clear calls, water resistant, iOS/Android' },
    { inputCategory: 'watch', canonical: 'smartwatch', budget: 45000, req: 'GPS, AMOLED display, ECG sensors, workout fitness' }
  ];

  CATEGORIES.forEach(({ inputCategory, canonical, budget, req }) => {
    it(`executes end-to-end orchestration for category '${inputCategory}' (${canonical})`, () => {
      const result = runBuyWiseOrchestration({
        category: inputCategory,
        budget,
        purpose: ['Coding', 'Gaming', 'Work'],
        requirementText: req
      });

      expect(result.canonicalCategory).toBe(canonical);
      expect(result.winnerProduct).toBeDefined();
      expect(result.winnerProduct?.category).toBe(canonical);
      expect(result.winnerProduct?.price).toBeLessThanOrEqual(budget);

      // Scores (0 - 100)
      expect(result.scores.productFit).toBeGreaterThanOrEqual(0);
      expect(result.scores.productFit).toBeLessThanOrEqual(100);
      expect(result.scores.trustScore).toBeGreaterThanOrEqual(0);
      expect(result.scores.purchaseRisk).toBeGreaterThanOrEqual(0);
      expect(result.scores.purchaseConfidence).toBeGreaterThanOrEqual(0);

      // Verification & Price Intelligence
      expect(result.priceIntelligence.status).toBeDefined();
      expect(result.verification.sellerVerified).toBeDefined();
      expect(result.verification.condition).toBeDefined();

      // Explanations & Evidence
      expect(result.explanations.whyWon).toContain(result.winnerProduct!.name);
      expect(result.comparison.length).toBeGreaterThan(0);
      expect(result.evidenceLedger.length).toBeGreaterThan(0);
      expect(result.decisionTrace.length).toBeGreaterThan(5);

      // Purchase eligibility
      expect(result.isPurchaseEligible).toBe(true);
    });
  });
});
