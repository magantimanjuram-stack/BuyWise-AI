export type CanonicalCategory =
  | 'smartphone'
  | 'laptop'
  | 'tv'
  | 'headphones'
  | 'earbuds'
  | 'smartwatch';

export type ProductCondition = 'New' | 'Refurbished' | 'Used' | 'Unknown';
export type PriceStatus = 'Excellent Price' | 'Good Price' | 'Fair Price' | 'High Price';
export type TimingRecommendation = 'BUY NOW' | 'WAIT' | 'CONSIDER';
export type FinalDecision = 'EXCELLENT BUY' | 'GOOD BUY' | 'CONSIDER' | 'BUY WITH CAUTION' | 'DO NOT RECOMMEND';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type WarrantyStatus = 'Verified' | 'Partially Verified' | 'Unable to Verify';

export interface ProductSpecification {
  // Common / Smartphone / Laptop
  processor?: string;
  cpu?: string;
  gpu?: string;
  ramGB?: number;
  storageGB?: number;
  displaySizeInches?: number;
  resolution?: string;
  refreshRateHz?: number;
  batteryCapacitymAh?: number;
  batteryHours?: number;
  chargingWatts?: number;
  cameraMP?: number;
  has5G?: boolean;
  hasANC?: boolean;
  hasGPS?: boolean;
  waterResistance?: string;
  weightKg?: number;
  os?: string;
  buildQuality?: string;
  // Audio specific
  micQuality?: string;
  codecSupport?: string[];
  multipoint?: boolean;
  // TV specific
  panelType?: string;
  hdrSupport?: string[];
  hdmiPorts?: number;
  speakerWatts?: number;
  // Watch specific
  fitnessSensors?: string[];
  callingSupport?: boolean;
}

export interface ProductListing {
  marketplace: string;
  sellerName: string;
  sellerRating: number; // 0 - 5
  sellerReviewsCount: number;
  listingId: string;
  variant: string;
  invoiceProvided: boolean;
  region: string;
  verifiedListing: boolean;
}

export interface SellerDetails {
  id: string;
  name: string;
  trustRating: number; // 0 - 100
  isOfficialBrandStore: boolean;
  fulfillmentRate: number; // e.g. 98%
  returnPolicyDays: number;
}

export interface WarrantyInfo {
  type: string; // e.g., '1 Year Brand Warranty'
  durationMonths: number;
  coverage: string;
  status: WarrantyStatus;
  evidence: string;
}

export interface ReviewSummary {
  count: number;
  rating: number; // 0 - 5
  sentiment: 'Strong' | 'Moderate' | 'Weak';
  positiveThemes: string[];
  recurringConcerns: string[];
  confidence: 'High' | 'Medium' | 'Low';
}

export interface PriceHistory {
  historicalLow: number;
  historicalAvg: number;
  previousPrice: number;
  lowestPriceDate?: string;
}

export interface SaleTimingInfo {
  upcomingSaleEvent?: string;
  daysUntilSale?: number;
  recommendation: TimingRecommendation;
  explanation: string;
}

export interface EvidenceItem {
  id: string;
  claim: string;
  source: string; // e.g. "Development dataset"
  confidence: string; // e.g. "Verified Demo"
  timestamp: string;
  type: 'PRICE' | 'SPEC' | 'SELLER' | 'WARRANTY' | 'REVIEWS';
}

export interface ProductRecord {
  id: string;
  category: CanonicalCategory;
  brand: string;
  name: string;
  price: number;
  currency: string; // 'INR'
  imageUrl?: string;
  specifications: ProductSpecification;
  listing: ProductListing;
  seller: SellerDetails;
  condition: ProductCondition;
  warranty: WarrantyInfo;
  reviews: ReviewSummary;
  priceHistory: PriceHistory;
  saleTiming: SaleTimingInfo;
  evidence: EvidenceItem[];
}

// User Request
export interface UserAnalysisRequest {
  category: string;
  budget: number;
  purpose: string[];
  requirementText: string;
}

// Parsed Requirement
export interface ParsedRequirement {
  name: string;
  key: keyof ProductSpecification;
  targetValue: string | number | boolean;
  numericMin?: number;
  isHard: boolean;
}

// Analysis Scores & Engine Results
export interface ComponentFitScores {
  processorFit: string;
  ramStorageFit: string;
  batteryFit: string;
  displayFit: string;
  purposeFit: string;
  overallFitScore: number; // 0 - 100
}

export interface PriceIntelligenceResult {
  currentPrice: number;
  historicalLow: number;
  historicalAvg: number;
  priceDifferencePercent: number;
  status: PriceStatus;
  opportunitySummary: string;
}

export interface VerificationResult {
  sellerVerified: boolean;
  listingVerified: boolean;
  condition: ProductCondition;
  warrantyStatus: WarrantyStatus;
  verificationSummary: string;
}

export interface TrustResult {
  score: number; // 0 - 100
  factors: string[];
  explanation: string;
}

export interface RiskResult {
  score: number; // 0 - 100 (lower is better)
  level: RiskLevel;
  riskFactors: string[];
  explanation: string;
}

export interface DecisionTraceStep {
  step: number;
  name: string;
  status: 'PASS' | 'WARN' | 'INFO';
  description: string;
}

export interface ComparisonRow {
  productId: string;
  productName: string;
  price: number;
  fitScore: number;
  valueScore: number;
  trustScore: number;
  riskScore: number;
  purchaseConfidence: number;
  decision: FinalDecision;
  timing: TimingRecommendation;
  keySpecs: string;
}

export interface AlternativeProduct {
  product: ProductRecord;
  fitScore: number;
  trustScore: number;
  riskScore: number;
  strength: string;
  whyLost: string;
}

export interface BuyWiseAnalysisResponse {
  request: UserAnalysisRequest;
  canonicalCategory: CanonicalCategory;
  winnerProduct?: ProductRecord;
  decision: FinalDecision;
  timing: TimingRecommendation;
  isPurchaseEligible: boolean;
  scores: {
    productFit: number; // 0-100
    featureValue: number; // 0-100
    trustScore: number; // 0-100
    purchaseRisk: number; // 0-100
    purchaseConfidence: number; // 0-100
    dataConfidence: number; // 0-100
  };
  componentFit: ComponentFitScores;
  requirements: ParsedRequirement[];
  hardRequirementPassed: boolean;
  priceIntelligence: PriceIntelligenceResult;
  reviewIntelligence: ReviewSummary;
  verification: VerificationResult;
  trust: TrustResult;
  risk: RiskResult;
  timingInfo: SaleTimingInfo;
  explanations: {
    whyWon: string;
    strengths: string[];
    concerns: string[];
  };
  alternatives: AlternativeProduct[];
  comparison: ComparisonRow[];
  evidenceLedger: EvidenceItem[];
  decisionTrace: DecisionTraceStep[];
  noResultReason?: string;
}

// Payment API Models
export interface PaymentOrderRequest {
  productId: string;
  userApproved: boolean;
}

export interface PaymentOrderResponse {
  success: boolean;
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  productName: string;
  priceINR: number;
}

export interface PaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  productId: string;
  fitScore: number;
  trustScore: number;
  purchaseConfidence: number;
}

export interface PaymentVerifyResponse {
  verified: boolean;
  paymentId: string;
  orderId: string;
  status: 'SUCCESS' | 'FAILED' | 'VERIFICATION_FAILED';
  productName: string;
  amountPaidINR: number;
  message: string;
  auditRecord?: PaymentAuditRecord;
}

export interface PaymentAuditRecord {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  category: string;
  amount: number;
  currency: string;
  decision: string;
  purchaseConfidence: number;
  riskScore: number;
  dataConfidence: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: string;
}
