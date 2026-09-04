from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Listing:
    """
    Represents one exact marketplace listing.

    Product = the phone/model itself.
    Listing = where that exact phone is being sold.
    """

    listing_id: str
    product_id: str

    marketplace: str
    seller: str

    price_inr: float
    condition: str

    seller_verified: bool = False
    seller_rating: Optional[float] = None

    warranty_claim: Optional[str] = None
    warranty_verified: bool = False

    return_policy_available: bool = False

    listing_reference: Optional[str] = None

    evidence: List[str] = field(default_factory=list)


@dataclass
class VerificationResult:
    """
    Final verification result for one listing.
    """

    listing_id: str

    seller_score: float
    warranty_score: float
    condition_score: float
    marketplace_score: float

    information_gap_score: float
    overall_trust_score: float

    verified: bool
    risk_level: str

    reasons: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


def _clamp(value: float, minimum: float = 0, maximum: float = 100) -> float:
    """Keep a score between 0 and 100."""
    return max(minimum, min(maximum, value))


def calculate_seller_score(listing: Listing) -> float:
    """
    Calculate seller trust.

    Important:
    We do NOT assume a seller is trustworthy merely because
    the marketplace is well known.
    """

    score = 0

    if listing.seller_verified:
        score += 60

    if listing.seller_rating is not None:

        if listing.seller_rating >= 4.5:
            score += 40

        elif listing.seller_rating >= 4.0:
            score += 30

        elif listing.seller_rating >= 3.5:
            score += 15

        else:
            score += 5

    return round(_clamp(score), 2)


def calculate_warranty_score(listing: Listing) -> float:
    """
    Warranty confidence is based on evidence.

    We never assume warranty coverage without evidence.
    """

    score = 0

    if listing.warranty_verified:
        score += 80

    elif listing.warranty_claim:
        score += 30

    if listing.return_policy_available:
        score += 20

    return round(_clamp(score), 2)


def calculate_condition_score(listing: Listing) -> float:
    """
    Score product condition.

    New products receive the highest trust score.
    """

    condition = listing.condition.lower().strip()

    if condition == "new":
        return 100

    if condition in {"open-box", "open box"}:
        return 70

    if condition == "refurbished":
        return 55

    if condition == "used":
        return 35

    return 20


def calculate_marketplace_score(listing: Listing) -> float:
    """
    Marketplace score.

    This is intentionally conservative.

    A known marketplace does NOT automatically mean
    the individual seller/listing is trustworthy.
    """

    marketplace = listing.marketplace.lower().strip()

    known_marketplaces = {
        "amazon": 80,
        "flipkart": 80,
        "croma": 85,
        "reliance digital": 85,
        "motorola india": 95,
        "samsung india": 95,
        "oneplus india": 95,
        "official website": 95,
    }

    return known_marketplaces.get(marketplace, 50)


def calculate_information_gap(listing: Listing) -> float:
    """
    Calculate how much important information is missing.

    Higher score = more complete information.
    """

    score = 0

    if listing.seller:
        score += 20

    if listing.marketplace:
        score += 20

    if listing.condition:
        score += 15

    if listing.listing_reference:
        score += 15

    if listing.evidence:
        score += 15

    if listing.warranty_claim or listing.warranty_verified:
        score += 15

    return round(_clamp(score), 2)


def determine_risk_level(
    trust_score: float,
    information_score: float
) -> str:

    # Missing information increases risk.
    effective_score = (
        trust_score * 0.75
        + information_score * 0.25
    )

    if effective_score >= 85:
        return "LOW"

    if effective_score >= 70:
        return "MEDIUM"

    if effective_score >= 50:
        return "HIGH"

    return "VERY HIGH"


def verify_listing(listing: Listing) -> VerificationResult:
    """
    Complete listing verification pipeline.
    """

    reasons = []
    warnings = []

    seller_score = calculate_seller_score(listing)
    warranty_score = calculate_warranty_score(listing)
    condition_score = calculate_condition_score(listing)
    marketplace_score = calculate_marketplace_score(listing)
    information_score = calculate_information_gap(listing)

    # Final trust calculation.
    overall_score = (
        seller_score * 0.30
        + warranty_score * 0.30
        + condition_score * 0.15
        + marketplace_score * 0.10
        + information_score * 0.15
    )

    overall_score = round(_clamp(overall_score), 2)

    # Seller explanation
    if seller_score >= 80:
        reasons.append(
            "Seller has strong verification signals."
        )
    elif seller_score >= 50:
        reasons.append(
            "Seller has partial trust signals."
        )
    else:
        warnings.append(
            "Seller verification is insufficient."
        )

    # Warranty explanation
    if warranty_score >= 80:
        reasons.append(
            "Warranty information has supporting verification."
        )
    elif warranty_score >= 30:
        warnings.append(
            "Warranty is mentioned but cannot be fully verified."
        )
    else:
        warnings.append(
            "Warranty could not be verified."
        )

    # Condition explanation
    if condition_score >= 90:
        reasons.append(
            "Listing condition is identified as new."
        )
    elif condition_score >= 50:
        warnings.append(
            f"Product condition is {listing.condition}; "
            "additional verification is recommended."
        )
    else:
        warnings.append(
            f"Product condition is {listing.condition}, "
            "which increases purchase risk."
        )

    # Evidence explanation
    if information_score < 70:
        warnings.append(
            "Important listing information is missing."
        )

    # Listing reference
    if not listing.listing_reference:
        warnings.append(
            "No exact listing reference was provided."
        )

    risk_level = determine_risk_level(
        overall_score,
        information_score
    )

    # Final verification decision.
    verified = (
        overall_score >= 75
        and seller_score >= 60
        and warranty_score >= 60
        and information_score >= 70
        and risk_level in {"LOW", "MEDIUM"}
    )

    return VerificationResult(
        listing_id=listing.listing_id,

        seller_score=seller_score,
        warranty_score=warranty_score,
        condition_score=condition_score,
        marketplace_score=marketplace_score,

        information_gap_score=information_score,
        overall_trust_score=overall_score,

        verified=verified,
        risk_level=risk_level,

        reasons=reasons,
        warnings=warnings,
    )


def print_verification_report(result: VerificationResult):
    """
    Human-readable verification report.
    """

    print("\n===== LISTING VERIFICATION =====")

    print(f"Listing ID: {result.listing_id}")

    print(f"Seller Trust: {result.seller_score}")
    print(f"Warranty Confidence: {result.warranty_score}")
    print(f"Condition Score: {result.condition_score}")
    print(f"Marketplace Score: {result.marketplace_score}")
    print(
        f"Information Completeness: "
        f"{result.information_gap_score}"
    )

    print(
        f"\nOverall Trust Score: "
        f"{result.overall_trust_score}"
    )

    print(f"Risk Level: {result.risk_level}")

    print(
        f"Verified: "
        f"{'YES' if result.verified else 'NO'}"
    )

    if result.reasons:
        print("\nReasons:")

        for reason in result.reasons:
            print(f"  + {reason}")

    if result.warnings:
        print("\nWarnings:")

        for warning in result.warnings:
            print(f"  ! {warning}")
            