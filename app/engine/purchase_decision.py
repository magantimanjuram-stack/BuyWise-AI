from typing import Dict, Any


def clamp(value: float, minimum: float = 0, maximum: float = 100) -> float:
    """Keep a score between 0 and 100."""
    return max(minimum, min(maximum, value))


def calculate_purchase_confidence(
    product_fit_score: float,
    price_to_spec_score: float,
    seller_score: float,
    warranty_score: float,
    price_score: float,
    review_score: float,
    timing_score: float,
    risk_score: float
) -> Dict[str, Any]:
    """
    Calculate the final Purchase Confidence Score.

    Higher scores are better.

    Risk score is different:
        0   = very low risk
        100 = very high risk

    Therefore risk is converted into a safety score.
    """

    # Convert risk into a positive safety score.
    safety_score = 100 - risk_score

    # Final weighted score.
    purchase_confidence = (
        product_fit_score * 0.20 +
        price_to_spec_score * 0.20 +
        seller_score * 0.15 +
        warranty_score * 0.15 +
        price_score * 0.10 +
        review_score * 0.05 +
        timing_score * 0.05 +
        safety_score * 0.10
    )

    purchase_confidence = round(
        clamp(purchase_confidence), 2
    )

    # Recommendation.
    if purchase_confidence >= 85:
        recommendation = "EXCELLENT BUY"

    elif purchase_confidence >= 75:
        recommendation = "GOOD BUY"

    elif purchase_confidence >= 65:
        recommendation = "CONSIDER"

    elif purchase_confidence >= 50:
        recommendation = "BUY WITH CAUTION"

    else:
        recommendation = "DO NOT RECOMMEND"

    # Important verification rules.
    warnings = []

    if seller_score < 60:
        warnings.append(
            "Seller verification is not strong enough."
        )

    if warranty_score < 60:
        warnings.append(
            "Warranty information could not be sufficiently verified."
        )

    if product_fit_score < 60:
        warnings.append(
            "Product does not strongly match the user's requirements."
        )

    if price_to_spec_score < 60:
        warnings.append(
            "Price-to-specification value is relatively weak."
        )

    if risk_score > 40:
        warnings.append(
            "Purchase risk is significant."
        )

    # Safety gate.
    # Even a high score must not override important trust failures.
    blocked = (
        seller_score < 40
        or warranty_score < 40
        or risk_score > 60
    )

    if blocked:
        recommendation = "DO NOT RECOMMEND"

    return {
        "product_fit_score": round(product_fit_score, 2),
        "price_to_spec_score": round(price_to_spec_score, 2),
        "seller_score": round(seller_score, 2),
        "warranty_score": round(warranty_score, 2),
        "price_score": round(price_score, 2),
        "review_score": round(review_score, 2),
        "timing_score": round(timing_score, 2),
        "risk_score": round(risk_score, 2),
        "safety_score": round(safety_score, 2),
        "purchase_confidence": purchase_confidence,
        "recommendation": recommendation,
        "blocked": blocked,
        "warnings": warnings
    }


def explain_decision(result: Dict[str, Any]) -> str:
    """Generate a simple human-readable explanation."""

    score = result["purchase_confidence"]
    recommendation = result["recommendation"]

    if recommendation == "EXCELLENT BUY":
        explanation = (
            f"This listing is a strong purchase candidate with "
            f"a confidence score of {score}/100."
        )

    elif recommendation == "GOOD BUY":
        explanation = (
            f"This listing offers a good overall purchase opportunity "
            f"with a confidence score of {score}/100."
        )

    elif recommendation == "CONSIDER":
        explanation = (
            f"This listing is reasonable, but some factors should "
            f"be checked before purchasing. Confidence: {score}/100."
        )

    elif recommendation == "BUY WITH CAUTION":
        explanation = (
            f"This listing has notable concerns. "
            f"Purchase confidence is only {score}/100."
        )

    else:
        explanation = (
            f"This listing should not currently be recommended. "
            f"Purchase confidence: {score}/100."
        )

    return explanation


def print_purchase_decision(result: Dict[str, Any]) -> None:
    """Display the final purchase decision."""

    print("\n===== FINAL PURCHASE DECISION =====")

    print(
        f"Product Fit Score: "
        f"{result['product_fit_score']}"
    )

    print(
        f"Price-to-Spec Score: "
        f"{result['price_to_spec_score']}"
    )

    print(
        f"Seller Score: "
        f"{result['seller_score']}"
    )

    print(
        f"Warranty Score: "
        f"{result['warranty_score']}"
    )

    print(
        f"Price Score: "
        f"{result['price_score']}"
    )

    print(
        f"Review Score: "
        f"{result['review_score']}"
    )

    print(
        f"Timing Score: "
        f"{result['timing_score']}"
    )

    print(
        f"Risk Score: "
        f"{result['risk_score']}"
    )

    print(
        f"Safety Score: "
        f"{result['safety_score']}"
    )

    print("\n-------------------------------")

    print(
        f"PURCHASE CONFIDENCE: "
        f"{result['purchase_confidence']}/100"
    )

    print(
        f"RECOMMENDATION: "
        f"{result['recommendation']}"
    )

    print(
        f"Blocked: "
        f"{'YES' if result['blocked'] else 'NO'}"
    )

    print("\nExplanation:")
    print(explain_decision(result))

    if result["warnings"]:
        print("\nWarnings:")

        for warning in result["warnings"]:
            print(f"  ! {warning}")

    else:
        print("\nWarnings:")
        print("  + No major concerns detected.")