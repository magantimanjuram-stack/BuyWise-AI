import { CanonicalCategory, ProductRecord } from '../types/index.js';

export const CATEGORY_MIN_BUDGETS: Record<CanonicalCategory, number> = {
  smartphone: 20000,
  laptop: 60000,
  tv: 60000,
  headphones: 15000,
  earbuds: 15000,
  smartwatch: 15000
};

export const CATEGORY_DEFAULT_BUDGETS: Record<CanonicalCategory, number> = {
  smartphone: 25000,
  laptop: 70000,
  tv: 70000,
  headphones: 20000,
  earbuds: 20000,
  smartwatch: 20000
};

export function validateBudget(category: CanonicalCategory, userBudget: number): { isValid: boolean; message?: string } {
  const minBudget = CATEGORY_MIN_BUDGETS[category];
  if (userBudget < minBudget) {
    return {
      isValid: false,
      message: `The minimum recommended budget for ${category} is ₹${minBudget.toLocaleString('en-IN')}. Selected budget ₹${userBudget.toLocaleString('en-IN')} is insufficient for this category.`
    };
  }
  return { isValid: true };
}

export function filterCandidatesByBudget(
  products: ProductRecord[],
  category: CanonicalCategory,
  userBudget: number
): { candidates: ProductRecord[]; rejectionReason?: string } {
  // 1. Strict Category Match
  const categoryProducts = products.filter((p) => p.category === category);
  if (categoryProducts.length === 0) {
    return {
      candidates: [],
      rejectionReason: `No products available in development dataset for category '${category}'.`
    };
  }

  // 2. Strict Budget Gate (price <= userBudget)
  const affordableCandidates = categoryProducts.filter((p) => p.price <= userBudget);

  if (affordableCandidates.length === 0) {
    const lowestPrice = Math.min(...categoryProducts.map((p) => p.price));
    return {
      candidates: [],
      rejectionReason: `No suitable product found in '${category}' within your budget of ₹${userBudget.toLocaleString('en-IN')}. The lowest available product price in this category is ₹${lowestPrice.toLocaleString('en-IN')}.`
    };
  }

  return { candidates: affordableCandidates };
}
