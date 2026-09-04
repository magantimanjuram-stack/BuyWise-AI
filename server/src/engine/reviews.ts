import { ProductRecord, ReviewSummary } from '../types/index.js';

export function analyzeReviews(product: ProductRecord): ReviewSummary {
  const r = product.reviews;
  return {
    count: r.count,
    rating: r.rating,
    sentiment: r.sentiment,
    positiveThemes: r.positiveThemes,
    recurringConcerns: r.recurringConcerns,
    confidence: r.confidence
  };
}
