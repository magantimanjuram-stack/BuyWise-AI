def calculate_purchase_score(
    product_fit,
    price_to_spec,
    seller_trust,
    warranty_confidence,
    price_competitiveness,
    review_quality,
    price_history,
    timing,
    risk
):
    """
    Calculate the final purchase confidence score.

    All inputs should be between 0 and 100.
    Risk is also converted so that lower risk produces a higher score.
    """

    risk_adjusted = 100 - risk

    score = (
        product_fit * 0.20
        + price_to_spec * 0.20
        + seller_trust * 0.15
        + warranty_confidence * 0.15
        + price_competitiveness * 0.10
        + review_quality * 0.05
        + price_history * 0.05
        + timing * 0.05
        + risk_adjusted * 0.05
    )

    return round(score, 2)


def get_purchase_label(score):
    """
    Convert the numerical score into an understandable decision.
    """

    if score >= 85:
        return "Excellent Buy"

    if score >= 75:
        return "Good Buy"

    if score >= 65:
        return "Consider Carefully"

    if score >= 50:
        return "High Risk"

    return "Avoid"