import { describe, expect, it } from 'vitest';
import { PRODUCT_DATASET } from '../server/src/data/dataset.js';
import { filterCandidatesByBudget, validateBudget } from '../server/src/engine/budget.js';

describe('Budget Control Engine', () => {
  it('enforces category minimum budgets', () => {
    expect(validateBudget('smartphone', 20000).isValid).toBe(true);
    expect(validateBudget('smartphone', 15000).isValid).toBe(false);

    expect(validateBudget('laptop', 60000).isValid).toBe(true);
    expect(validateBudget('laptop', 40000).isValid).toBe(false);

    expect(validateBudget('tv', 60000).isValid).toBe(true);
    expect(validateBudget('tv', 30000).isValid).toBe(false);
  });

  it('strictly filters candidates above selected budget and returns no products > budget', () => {
    const res = filterCandidatesByBudget(PRODUCT_DATASET, 'laptop', 70000);
    expect(res.candidates.length).toBeGreaterThan(0);
    res.candidates.forEach((p) => {
      expect(p.price).toBeLessThanOrEqual(70000);
      expect(p.category).toBe('laptop');
    });
  });

  it('handles no suitable product found when budget is too low for category products', () => {
    const res = filterCandidatesByBudget(PRODUCT_DATASET, 'laptop', 60000);
    // Dell Inspiron is 58,990 so it should be found, but if budget is 50,000:
    const lowRes = filterCandidatesByBudget(PRODUCT_DATASET, 'laptop', 50000);
    expect(lowRes.candidates.length).toBe(0);
    expect(lowRes.rejectionReason).toContain('No suitable product found');
  });
});
