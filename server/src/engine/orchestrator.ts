import { PRODUCT_DATASET } from '../data/dataset.js';
import {
  AlternativeProduct,
  BuyWiseAnalysisResponse,
  ComparisonRow,
  DecisionTraceStep,
  EvidenceItem,
  UserAnalysisRequest
} from '../types/index.js';

import { filterCandidatesByBudget, validateBudget } from './budget.js';
import { normalizeCategory } from './category.js';
import { calculatePurchaseConfidence, evaluateFinalDecision } from './decision.js';
import { generateAlternativeLossReason, generateExplanations } from './explanation.js';
import { calculateProductFit } from './fit.js';
import { analyzePriceAndTiming } from './price.js';
import { parseRequirements } from './requirements.js';
import { analyzeReviews } from './reviews.js';
import { calculatePurchaseRisk } from './risk.js';
import { calculateTrustScore } from './trust.js';
import { calculateFeaturePriceValue } from './value.js';
import { verifySellerAndListing } from './verification.js';

export function runBuyWiseOrchestration(request: UserAnalysisRequest): BuyWiseAnalysisResponse {
  const trace: DecisionTraceStep[] = [];
  let stepCounter = 1;

  // Step 1: Input Received
  trace.push({
    step: stepCounter++,
    name: 'User Input Received',
    status: 'INFO',
    description: `Category: "${request.category}", Budget: ₹${request.budget?.toLocaleString('en-IN')}, Purpose: [${(request.purpose || []).join(', ')}]`
  });

  // Step 2: Category Normalization
  let canonicalCategory;
  try {
    canonicalCategory = normalizeCategory(request.category);
    trace.push({
      step: stepCounter++,
      name: 'Category Normalization',
      status: 'PASS',
      description: `Input '${request.category}' resolved to canonical category '${canonicalCategory}'.`
    });
  } catch (err: any) {
    trace.push({
      step: stepCounter++,
      name: 'Category Normalization',
      status: 'WARN',
      description: err.message || 'Invalid category'
    });
    throw err;
  }

  // Step 3: Budget Validation
  const budgetValidation = validateBudget(canonicalCategory, request.budget);
  if (!budgetValidation.isValid) {
    trace.push({
      step: stepCounter++,
      name: 'Budget Gate',
      status: 'WARN',
      description: budgetValidation.message || 'Budget below category minimum.'
    });
    return {
      request,
      canonicalCategory,
      decision: 'DO NOT RECOMMEND',
      timing: 'CONSIDER',
      isPurchaseEligible: false,
      scores: { productFit: 0, featureValue: 0, trustScore: 0, purchaseRisk: 100, purchaseConfidence: 0, dataConfidence: 0 },
      componentFit: { processorFit: 'N/A', ramStorageFit: 'N/A', batteryFit: 'N/A', displayFit: 'N/A', purposeFit: 'N/A', overallFitScore: 0 },
      requirements: [],
      hardRequirementPassed: false,
      priceIntelligence: { currentPrice: 0, historicalLow: 0, historicalAvg: 0, priceDifferencePercent: 0, status: 'High Price', opportunitySummary: 'Budget insufficient.' },
      reviewIntelligence: { count: 0, rating: 0, sentiment: 'Weak', positiveThemes: [], recurringConcerns: [], confidence: 'Low' },
      verification: { sellerVerified: false, listingVerified: false, condition: 'Unknown', warrantyStatus: 'Unable to Verify', verificationSummary: 'N/A' },
      trust: { score: 0, factors: [], explanation: 'N/A' },
      risk: { score: 100, level: 'CRITICAL', riskFactors: ['Insufficient budget for category'], explanation: 'Budget is below category minimum.' },
      timingInfo: { recommendation: 'CONSIDER', explanation: 'N/A' },
      explanations: { whyWon: 'No product evaluated.', strengths: [], concerns: [] },
      alternatives: [],
      comparison: [],
      evidenceLedger: [],
      decisionTrace: trace,
      noResultReason: budgetValidation.message
    };
  }

  // Step 4: Candidate Filtering
  const filterResult = filterCandidatesByBudget(PRODUCT_DATASET, canonicalCategory, request.budget);
  if (filterResult.candidates.length === 0) {
    trace.push({
      step: stepCounter++,
      name: 'Candidate Selection',
      status: 'WARN',
      description: filterResult.rejectionReason || 'No suitable candidate found.'
    });
    return {
      request,
      canonicalCategory,
      decision: 'DO NOT RECOMMEND',
      timing: 'CONSIDER',
      isPurchaseEligible: false,
      scores: { productFit: 0, featureValue: 0, trustScore: 0, purchaseRisk: 100, purchaseConfidence: 0, dataConfidence: 0 },
      componentFit: { processorFit: 'N/A', ramStorageFit: 'N/A', batteryFit: 'N/A', displayFit: 'N/A', purposeFit: 'N/A', overallFitScore: 0 },
      requirements: [],
      hardRequirementPassed: false,
      priceIntelligence: { currentPrice: 0, historicalLow: 0, historicalAvg: 0, priceDifferencePercent: 0, status: 'High Price', opportunitySummary: 'No affordable candidates.' },
      reviewIntelligence: { count: 0, rating: 0, sentiment: 'Weak', positiveThemes: [], recurringConcerns: [], confidence: 'Low' },
      verification: { sellerVerified: false, listingVerified: false, condition: 'Unknown', warrantyStatus: 'Unable to Verify', verificationSummary: 'N/A' },
      trust: { score: 0, factors: [], explanation: 'N/A' },
      risk: { score: 100, level: 'CRITICAL', riskFactors: ['No candidates within budget'], explanation: 'No suitable product found within budget.' },
      timingInfo: { recommendation: 'CONSIDER', explanation: 'N/A' },
      explanations: { whyWon: 'No product recommended.', strengths: [], concerns: [] },
      alternatives: [],
      comparison: [],
      evidenceLedger: [],
      decisionTrace: trace,
      noResultReason: filterResult.rejectionReason
    };
  }

  trace.push({
    step: stepCounter++,
    name: 'Candidate Selection',
    status: 'PASS',
    description: `Selected ${filterResult.candidates.length} valid product candidates in '${canonicalCategory}' within budget ₹${request.budget.toLocaleString('en-IN')}.`
  });

  // Step 5: Requirement Parsing
  const parsedReqs = parseRequirements(request.requirementText || '');
  trace.push({
    step: stepCounter++,
    name: 'Requirement Extraction',
    status: 'PASS',
    description: `Extracted ${parsedReqs.length} requirement parameters (${parsedReqs.filter(r => r.isHard).length} hard requirements).`
  });

  // Step 6: Evaluate Candidates
  const evaluatedCandidates = filterResult.candidates.map((product) => {
    const fitRes = calculateProductFit(product, parsedReqs, request.purpose || []);
    const valueScore = calculateFeaturePriceValue(product, fitRes.score, request.budget);
    const trustRes = calculateTrustScore(product);
    const riskRes = calculatePurchaseRisk(product, trustRes.score);
    const confRes = calculatePurchaseConfidence(fitRes.score, valueScore, trustRes.score, riskRes.score);
    const decisionRes = evaluateFinalDecision(
      product,
      fitRes.score,
      valueScore,
      trustRes.score,
      riskRes,
      confRes.purchaseConfidence,
      fitRes.hardRequirementPassed
    );

    return {
      product,
      fitScore: fitRes.score,
      componentFit: fitRes.components,
      hardRequirementPassed: fitRes.hardRequirementPassed,
      valueScore,
      trustRes,
      riskRes,
      purchaseConfidence: confRes.purchaseConfidence,
      dataConfidence: confRes.dataConfidence,
      decisionRes
    };
  });

  // Sort candidates by Purchase Confidence descending, prioritizing hardRequirementPassed
  evaluatedCandidates.sort((a, b) => {
    if (a.hardRequirementPassed !== b.hardRequirementPassed) {
      return a.hardRequirementPassed ? -1 : 1;
    }
    return b.purchaseConfidence - a.purchaseConfidence;
  });

  const winnerEval = evaluatedCandidates[0];
  const winner = winnerEval.product;

  trace.push({
    step: stepCounter++,
    name: 'Product Fit & Purpose Weighting',
    status: 'PASS',
    description: `Winner '${winner.name}' scored Fit: ${winnerEval.fitScore}/100, Trust: ${winnerEval.trustRes.score}/100, Risk: ${winnerEval.riskRes.score}/100.`
  });

  // Price & Timing
  const { priceIntel, timing } = analyzePriceAndTiming(winner);
  trace.push({
    step: stepCounter++,
    name: 'Price & Timing Intelligence',
    status: 'PASS',
    description: `Price Status: ${priceIntel.status}, Timing Recommendation: ${timing.recommendation}.`
  });

  // Verification & Review
  const verification = verifySellerAndListing(winner);
  const reviewIntel = analyzeReviews(winner);
  trace.push({
    step: stepCounter++,
    name: 'Seller & Warranty Verification',
    status: verification.sellerVerified ? 'PASS' : 'WARN',
    description: verification.verificationSummary
  });

  // Decision Gate Check in Trace
  trace.push({
    step: stepCounter++,
    name: 'Final Decision Gates',
    status: winnerEval.decisionRes.isPurchaseEligible ? 'PASS' : 'WARN',
    description: `Final Backend Decision: ${winnerEval.decisionRes.decision}. ${winnerEval.decisionRes.decisionGateTriggered || 'All gates passed successfully.'}`
  });

  // Explanations
  const explanations = generateExplanations(
    winner,
    winnerEval.fitScore,
    winnerEval.trustRes.score,
    parsedReqs.map((r) => r.name),
    request.purpose || []
  );

  // Alternatives (Max 2 non-winners)
  const alternatives: AlternativeProduct[] = evaluatedCandidates.slice(1, 3).map((altEval) => {
    const lossInfo = generateAlternativeLossReason(
      altEval.product,
      winner,
      altEval.fitScore,
      winnerEval.fitScore,
      altEval.trustRes.score,
      winnerEval.trustRes.score
    );
    return {
      product: altEval.product,
      fitScore: altEval.fitScore,
      trustScore: altEval.trustRes.score,
      riskScore: altEval.riskRes.score,
      strength: lossInfo.strength,
      whyLost: lossInfo.whyLost
    };
  });

  // Comparison Rows
  const comparison: ComparisonRow[] = evaluatedCandidates.map((c) => {
    const { timing: altTiming } = analyzePriceAndTiming(c.product);
    const specs = c.product.specifications;
    const keySpecStr = `${specs.ramGB ? specs.ramGB + 'GB RAM, ' : ''}${specs.storageGB ? specs.storageGB + 'GB, ' : ''}${specs.cpu || specs.processor || ''}`;

    return {
      productId: c.product.id,
      productName: c.product.name,
      price: c.product.price,
      fitScore: c.fitScore,
      valueScore: c.valueScore,
      trustScore: c.trustRes.score,
      riskScore: c.riskRes.score,
      purchaseConfidence: c.purchaseConfidence,
      decision: c.decisionRes.decision,
      timing: altTiming.recommendation,
      keySpecs: keySpecStr
    };
  });

  // Evidence Ledger
  const evidenceLedger: EvidenceItem[] = [
    ...winner.evidence,
    {
      id: `ev-ledger-fit-${winner.id}`,
      claim: `Product Fit Score computed as ${winnerEval.fitScore}/100`,
      source: 'Development dataset',
      confidence: 'Verified Algorithm',
      timestamp: new Date().toISOString(),
      type: 'SPEC'
    },
    {
      id: `ev-ledger-seller-${winner.id}`,
      claim: `Seller ${winner.seller.name} trust rating verified as ${winner.seller.trustRating}/100`,
      source: 'Development dataset',
      confidence: 'Verified Demo',
      timestamp: new Date().toISOString(),
      type: 'SELLER'
    }
  ];

  return {
    request,
    canonicalCategory,
    winnerProduct: winner,
    decision: winnerEval.decisionRes.decision,
    timing: timing.recommendation,
    isPurchaseEligible: winnerEval.decisionRes.isPurchaseEligible,
    scores: {
      productFit: winnerEval.fitScore,
      featureValue: winnerEval.valueScore,
      trustScore: winnerEval.trustRes.score,
      purchaseRisk: winnerEval.riskRes.score,
      purchaseConfidence: winnerEval.purchaseConfidence,
      dataConfidence: winnerEval.dataConfidence
    },
    componentFit: winnerEval.componentFit,
    requirements: parsedReqs,
    hardRequirementPassed: winnerEval.hardRequirementPassed,
    priceIntelligence: priceIntel,
    reviewIntelligence: reviewIntel,
    verification,
    trust: winnerEval.trustRes,
    risk: winnerEval.riskRes,
    timingInfo: timing,
    explanations,
    alternatives,
    comparison,
    evidenceLedger,
    decisionTrace: trace
  };
}
