import json

from app.agent.orchestrator import CommerceOrchestrator


with open("data/products.json", "r", encoding="utf-8") as file:
    products = json.load(file)


user_request = {
    "category": "smartphone",
    "budget": 20000,
    "usage": "gaming",
    "must_have": [
        "5G",
        "8GB RAM"
    ]
}


agent = CommerceOrchestrator()

result = agent.analyze(
    user_request,
    products
)


print()
print("========================================")
print("      AI COMMERCE MASTER AGENT")
print("========================================")

print(
    "Products Analyzed:",
    result["products_analyzed"]
)

print()
print("----- FINAL RECOMMENDATION -----")

recommendation = result["recommendation"]

print(
    "Product:",
    recommendation["product"]
)

print(
    "Price: ₹",
    recommendation["price"]
)

print(
    "Purchase Confidence:",
    recommendation["purchase_confidence"]
)

print(
    "Recommendation:",
    recommendation["recommendation"]
)

print(
    "Listing Status:",
    recommendation["listing_status"]
)

print(
    "Risk Level:",
    recommendation["risk_level"]
)

print()
print("Reason:")
print(recommendation["reason"])

print()
print("----- COMPLETE RANKING -----")

for index, item in enumerate(
    result["ranking"],
    start=1
):

    product = item["product"]

    print(
        f"{index}. "
        f'{product.get("brand")} '
        f'{product.get("model")} '
        f'| ₹{product.get("price_inr")} '
        f'| Purchase Score: '
        f'{item["purchase_confidence"]}'
    )

print()
print("========================================")