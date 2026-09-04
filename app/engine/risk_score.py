from typing import Dict, Any


def clamp(value: float, minimum: float = 0, maximum: float = 100) -> float:
    """Keep a score between minimum and maximum."""
    return max(minimum, min(maximum, value))


def calculate_risk_score(
    seller_score: float,
    warranty_score: float,
    condition_score: float,
    price_anomaly_score: float,
    review_score: float,
    information_completeness: float
) -> Dict[str, Any]:
    """
    Calculate purchase risk from multiple trust signals.

    All input scores are 0-100 where:
        100 = very safe / very trustworthy
        0   = very risky / very poor

    Returns a dictionary containing component risks,
    overall risk, risk level and recommendation.
    """

    # Convert trust scores into risk scores.
    seller_risk = 100 - seller_score
    warranty_risk = 100 - warranty_score
    condition_risk = 100 - condition_score
    price_anomaly_risk = 100 - price_anomaly_score
    review_risk = 100 - review_score
    information_gap = 100 - information_completeness

    # Weighted risk calculation.
    overall_risk = (
        seller_risk * 0.25 +
        warranty_risk * 0.20 +
        condition_risk * 0.15 +
        price_anomaly_risk * 0.15 +
        review_risk * 0.10 +
        information_gap * 0.15
    )

    overall_risk = round(clamp(overall_risk), 2)

    # Risk classification.
    if overall_risk <= 20:
        risk_level = "LOW"
        recommendation = "SAFE TO CONSIDER"

    elif overall_risk <= 40:
        risk_level = "MEDIUM"
        recommendation = "BUY WITH CAUTION"

    elif overall_risk <= 60:
        risk_level = "HIGH"
        recommendation = "VERIFY BEFORE BUYING"

    else:
        risk_level = "VERY HIGH"
        recommendation = "DO NOT RECOMMEND"

    # Hard safety rules.
    # Missing warranty/seller information should prevent
    # the system from blindly recommending a listing.
    warnings = []

    if seller_score < 50:
        warnings.append("Seller verification is weak.")

    if warranty_score < 50:
        warnings.append("Warranty information could not be sufficiently verified.")

    if condition_score < 50:
        warnings.append("Product condition requires verification.")

    if price_anomaly_score < 50:
        warnings.append("Price appears unusual compared with available price evidence.")

    if review_score < 50:
        warnings.append("Review signals contain significant concerns.")

    if information_completeness < 60:
        warnings.append("Important listing information is missing.")

    # Final verification status.
    verified = (
        seller_score >= 60
        and warranty_score >= 60
        and condition_score >= 60
        and information_completeness >= 60
        and overall_risk <= 40
    )

    return {
        "seller_risk": round(seller_risk, 2),
        "warranty_risk": round(warranty_risk, 2),
        "condition_risk": round(condition_risk, 2),
        "price_anomaly_risk": round(price_anomaly_risk, 2),
        "review_risk": round(review_risk, 2),
        "information_gap": round(information_gap, 2),
        "overall_risk": overall_risk,
        "risk_level": risk_level,
        "recommendation": recommendation,
        "verified": verified,
        "warnings": warnings
    }


def print_risk_report(result: Dict[str, Any]) -> None:
    """Display a readable risk report."""

    print("\n===== PURCHASE RISK ANALYSIS =====")

    print(f"Seller Risk: {result['seller_risk']}")
    print(f"Warranty Risk: {result['warranty_risk']}")
    print(f"Condition Risk: {result['condition_risk']}")
    print(f"Price Anomaly Risk: {result['price_anomaly_risk']}")
    print(f"Review Risk: {result['review_risk']}")
    print(f"Information Gap: {result['information_gap']}")

    print(f"\nOverall Risk: {result['overall_risk']}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Recommendation: {result['recommendation']}")

    print(f"Verified: {'YES' if result['verified'] else 'NO'}")

    if result["warnings"]:
        print("\nWarnings:")

        for warning in result["warnings"]:
            print(f"  ! {warning}")

    else:
        print("\nWarnings:")
        print("  + No major risk signals detected.")