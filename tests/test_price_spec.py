import json

from app.models.product import Specifications
from app.engine.price_spec_score import calculate_price_to_spec_score


# Load product data
products_file = "data/products.json"

with open(products_file, "r", encoding="utf-8") as file:
    products = json.load(file)


results = []

for product in products:

    specs_data = product["specifications"]

    specifications = Specifications(
        processor=specs_data["processor"],
        processor_score=specs_data["processor_score"],

        ram_gb=specs_data["ram_gb"],
        storage_gb=specs_data["storage_gb"],

        display=specs_data["display"],
        display_score=specs_data["display_score"],

        camera=specs_data["camera"],
        camera_score=specs_data["camera_score"],

        battery_mah=specs_data["battery_mah"],
        charging_watt=specs_data["charging_watt"],
        battery_score=specs_data["battery_score"],

        software=specs_data["software"],
        software_score=specs_data["software_score"],

        build=specs_data["build"],
        build_score=specs_data["build_score"],

        connectivity=specs_data.get("connectivity", []),
        feature_score=specs_data.get("feature_score", 0.0)
    )

    score = calculate_price_to_spec_score(
        product["price_inr"],
        specifications
    )

    results.append({
        "model": product["brand"] + " " + product["model"],
        "price": product["price_inr"],
        "score": score
    })


# Sort from highest score to lowest
results.sort(key=lambda x: x["score"], reverse=True)


print("\n===== PRICE-TO-SPEC RANKING =====\n")

for index, result in enumerate(results, start=1):
    print(
        f"{index}. {result['model']} "
        f"| ₹{result['price']:.0f} "
        f"| Score: {result['score']:.2f}"
    )