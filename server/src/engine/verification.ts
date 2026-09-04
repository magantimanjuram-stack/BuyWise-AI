import { ProductRecord, VerificationResult } from '../types/index.js';

export function verifySellerAndListing(product: ProductRecord): VerificationResult {
  const listing = product.listing;
  const seller = product.seller;
  const warranty = product.warranty;

  const sellerVerified = seller.isOfficialBrandStore || seller.trustRating >= 90;
  const listingVerified = listing.verifiedListing && listing.invoiceProvided;
  const condition = product.condition || 'Unknown';
  const warrantyStatus = warranty.status || 'Unable to Verify';

  let summary = 'Full seller & official brand listing verified.';
  if (!sellerVerified) {
    summary = `Seller '${seller.name}' is an unverified third-party store (Trust: ${seller.trustRating}/100).`;
  } else if (!listingVerified) {
    summary = 'Listing is partially verified; invoice tax details missing.';
  } else if (condition !== 'New') {
    summary = `Listing condition is '${condition}'. Exercise extra caution regarding warranty and wear.`;
  }

  return {
    sellerVerified,
    listingVerified,
    condition,
    warrantyStatus,
    verificationSummary: summary
  };
}
