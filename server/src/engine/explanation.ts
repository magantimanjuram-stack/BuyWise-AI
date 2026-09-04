import { ProductRecord } from '../types/index.js';

export function generateExplanations(
  winner: ProductRecord,
  fitScore: number,
  trustScore: number,
  requirements: string[],
  purposes: string[]
): {
  whyWon: string;
  strengths: string[];
  concerns: string[];
} {
  const specs = winner.specifications;
  const seller = winner.seller;
  const priceStr = `₹${winner.price.toLocaleString('en-IN')}`;

  const purposeStr = purposes.length > 0 ? purposes.join(', ') : 'your specified needs';

  const whyWon = `${winner.name} is recommended as the top choice at ${priceStr}. It achieves a Product Fit Score of ${fitScore}/100 for ${purposeStr}, offers ${specs.ramGB ? specs.ramGB + 'GB RAM and ' : ''}${specs.storageGB ? specs.storageGB + 'GB storage, ' : ''}and is sold by ${seller.name} with a high Trust Rating of ${trustScore}/100. Its price is reasonable relative to its historical range.`;

  const strengths: string[] = [];
  if (specs.ramGB && specs.ramGB >= 16) strengths.push(`High 16GB+ RAM capacity for seamless multitasking & performance.`);
  if (specs.cpu || specs.processor) strengths.push(`Powered by ${specs.cpu || specs.processor}.`);
  if (specs.refreshRateHz && specs.refreshRateHz >= 120) strengths.push(`Smooth ${specs.refreshRateHz}Hz display refresh rate.`);
  if (specs.resolution && specs.resolution.includes('OLED')) strengths.push(`Vibrant OLED display tech with rich contrast.`);
  if (winner.seller.isOfficialBrandStore) strengths.push(`Sold directly by official brand store with GST tax invoice.`);
  if (winner.warranty.status === 'Verified') strengths.push(`Verified official brand warranty coverage (${winner.warranty.type}).`);

  if (strengths.length === 0) {
    strengths.push('Meets all primary user requirements within the selected budget.');
  }

  const concerns: string[] = [...winner.reviews.recurringConcerns];
  if (winner.priceHistory.historicalLow < winner.price * 0.92) {
    concerns.push(`Currently priced slightly above its historical all-time low (₹${winner.priceHistory.historicalLow.toLocaleString('en-IN')}).`);
  }
  if (winner.condition !== 'New') {
    concerns.push(`Condition is '${winner.condition}'. Inspect hardware immediately upon delivery.`);
  }

  return { whyWon, strengths, concerns };
}

export function generateAlternativeLossReason(
  alt: ProductRecord,
  winner: ProductRecord,
  altFitScore: number,
  winnerFitScore: number,
  altTrustScore: number,
  winnerTrustScore: number
): { strength: string; whyLost: string } {
  let strength = `Competitive pricing at ₹${alt.price.toLocaleString('en-IN')}.`;
  if (alt.price < winner.price) {
    strength = `Lower price (₹${alt.price.toLocaleString('en-IN')} vs ₹${winner.price.toLocaleString('en-IN')}).`;
  } else if (alt.specifications.refreshRateHz && alt.specifications.refreshRateHz > (winner.specifications.refreshRateHz || 0)) {
    strength = `Higher refresh rate display (${alt.specifications.refreshRateHz}Hz).`;
  }

  let whyLost = `Lower overall product fit (${altFitScore}/100 vs ${winnerFitScore}/100) for user's specific requirements.`;
  if (altTrustScore < winnerTrustScore - 10) {
    whyLost = `Lower seller trust rating (${altTrustScore}/100 vs ${winnerTrustScore}/100).`;
  } else if ((alt.specifications.ramGB || 0) < (winner.specifications.ramGB || 0)) {
    whyLost = `Lower RAM specification (${alt.specifications.ramGB}GB vs ${winner.specifications.ramGB}GB).`;
  } else if (alt.price > winner.price) {
    whyLost = `Higher price without providing superior overall fit or trust.`;
  }

  return { strength, whyLost };
}
