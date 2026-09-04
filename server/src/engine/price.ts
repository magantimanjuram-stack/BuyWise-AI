import { PriceIntelligenceResult, PriceStatus, ProductRecord, SaleTimingInfo } from '../types/index.js';

export function analyzePriceAndTiming(product: ProductRecord): {
  priceIntel: PriceIntelligenceResult;
  timing: SaleTimingInfo;
} {
  const current = product.price;
  const low = product.priceHistory.historicalLow;
  const avg = product.priceHistory.historicalAvg;

  const diffFromLow = Math.round(((current - low) / low) * 100);

  let status: PriceStatus = 'Fair Price';
  let opportunity = 'Priced moderately within historical range.';

  if (diffFromLow <= 3) {
    status = 'Excellent Price';
    opportunity = `Currently priced near historical all-time low of ₹${low.toLocaleString('en-IN')}.`;
  } else if (diffFromLow <= 8) {
    status = 'Good Price';
    opportunity = `Solid discount (within ${diffFromLow}% of historical low).`;
  } else if (current > avg) {
    status = 'High Price';
    opportunity = `Currently ₹${(current - avg).toLocaleString('en-IN')} above average price level.`;
  }

  // Timing Recommendation logic
  let timingRec = product.saleTiming.recommendation;
  let timingExp = product.saleTiming.explanation;

  if (!timingRec) {
    if (diffFromLow <= 5) {
      timingRec = 'BUY NOW';
      timingExp = 'Price is favorable relative to historical trends.';
    } else if (diffFromLow > 12 && product.saleTiming.daysUntilSale && product.saleTiming.daysUntilSale <= 15) {
      timingRec = 'WAIT';
      timingExp = `Upcoming ${product.saleTiming.upcomingSaleEvent || 'Sale Event'} in ~${product.saleTiming.daysUntilSale} days. Waiting may be reasonable based on historical pricing patterns.`;
    } else {
      timingRec = 'CONSIDER';
      timingExp = 'Price is acceptable. Purchase recommended if immediately needed.';
    }
  }

  return {
    priceIntel: {
      currentPrice: current,
      historicalLow: low,
      historicalAvg: avg,
      priceDifferencePercent: diffFromLow,
      status,
      opportunitySummary: opportunity
    },
    timing: {
      upcomingSaleEvent: product.saleTiming.upcomingSaleEvent,
      daysUntilSale: product.saleTiming.daysUntilSale,
      recommendation: timingRec,
      explanation: timingExp
    }
  };
}
