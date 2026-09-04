from app.engine.purchase_score import (
    calculate_purchase_score,
    get_purchase_label
)


score = calculate_purchase_score(
    product_fit=90,
    price_to_spec=93,
    seller_trust=95,
    warranty_confidence=90,
    price_competitiveness=85,
    review_quality=88,
    price_history=80,
    timing=75,
    risk=10
)

print("===== PURCHASE DECISION =====")
print("Purchase Confidence:", score)
print("Recommendation:", get_purchase_label(score))