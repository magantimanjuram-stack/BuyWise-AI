import { ProductRecord, TrustResult } from '../types/index.js';

export function calculateTrustScore(product: ProductRecord): TrustResult {
  const seller = product.seller;
  const listing = product.listing;
  const warranty = product.warranty;
  const reviews = product.reviews;

  const factors: string[] = [];

  // Seller weight (40 points)
  let sellerPts = Math.round((seller.trustRating / 100) * 40);
  if (seller.isOfficialBrandStore) {
    factors.push(`Official brand authorized seller (${seller.name}).`);
  } else {
    factors.push(`Third-party seller (${seller.name}) with ${seller.trustRating}% trust score.`);
  }

  // Listing & Invoice weight (20 points)
  let listingPts = 0;
  if (listing.verifiedListing && listing.invoiceProvided) {
    listingPts = 20;
    factors.push('Verified marketplace listing with full GST tax invoice.');
  } else if (listing.verifiedListing) {
    listingPts = 12;
    factors.push('Marketplace listing verified, but invoice confirmation missing.');
  } else {
    listingPts = 5;
    factors.push('Unverified third-party listing ID.');
  }

  // Warranty weight (20 points)
  let warrantyPts = 0;
  if (warranty.status === 'Verified') {
    warrantyPts = 20;
    factors.push(`Manufacturer warranty verified (${warranty.type}).`);
  } else if (warranty.status === 'Partially Verified') {
    warrantyPts = 10;
    factors.push(`Limited warranty (${warranty.type}).`);
  } else {
    warrantyPts = 0;
    factors.push('Unable to verify warranty coverage.');
  }

  // Condition weight (10 points)
  let conditionPts = 10;
  if (product.condition === 'Refurbished') {
    conditionPts = 5;
    factors.push('Refurbished product condition reduces certainty.');
  } else if (product.condition === 'Used' || product.condition === 'Unknown') {
    conditionPts = 2;
    factors.push('Used/Unknown condition reduces trust.');
  }

  // Review confidence weight (10 points)
  let reviewPts = 10;
  if (reviews.confidence === 'Medium') reviewPts = 7;
  if (reviews.confidence === 'Low') reviewPts = 3;

  const totalScore = Math.min(100, Math.max(0, sellerPts + listingPts + warrantyPts + conditionPts + reviewPts));

  return {
    score: totalScore,
    factors,
    explanation: `Trust Score is ${totalScore}/100 based on ${seller.isOfficialBrandStore ? 'official brand store authorization' : 'seller track record'} and ${warranty.status.toLowerCase()} warranty status.`
  };
}
