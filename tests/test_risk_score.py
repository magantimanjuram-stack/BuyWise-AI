from app.engine.risk_score import (
    calculate_risk_score,
    print_risk_report
)


# Example of a strongly verified listing
result = calculate_risk_score(
    seller_score=95,
    warranty_score=90,
    condition_score=100,
    price_anomaly_score=95,
    review_score=84.2,
    information_completeness=100
)

print_risk_report(result)