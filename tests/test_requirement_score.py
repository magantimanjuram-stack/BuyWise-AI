import json
import sys

sys.path.insert(0, ".")

from app.models.product import Specifications
from app.engine.requirement_score import calculate_requirement_score


# Load products
products_file = "data/products.json"

with open(products_file, "r", encoding="utf-8") as file:
    products = json.load(file)


print("\n===== REQUIREMENT-AWARE RANKING =====")


purposes = ["gaming", "photography", "general"]


for purpose in purposes:

    results = []

    for product in products:

        specifications = Specifications(
            processor=product["specifications"]["processor"],
            processor_score=product["specifications"]["processor_score"],

            ram_gb=product["specifications"]["ram_gb"],
            storage_gb=product["specifications"]["storage_gb"],

            display=product["specifications"]["display"],
            display_score=product["specifications"]["display_score"],

            camera=product["specifications"]["camera"],
            camera_score=product["specifications"]["camera_score"],

            battery_mah=product["specifications"]["battery_mah"],
            charging_watt=product["specifications"]["charging_watt"],
            battery_score=product["specifications"]["battery_score"],

            software=product["specifications"]["software"],
            software_score=product["specifications"]["software_score"],

            build=product["specifications"]["build"],
            build_score=product["specifications"]["build_score"],

            connectivity=product["specifications"].get("connectivity", []),
            feature_score=product["specifications"].get("feature_score", 0)
        )

        score = calculate_requirement_score(
            specifications,
            purpose
        )

        results.append({
            "model": product["model"],
            "price": product["price_inr"],
            "score": score
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    print(f"\n--- {purpose.upper()} ---")

    for position, result in enumerate(results, start=1):
        print(
            f"{position}. {result['model']} | "
            f"₹{result['price']} | "
            f"Score: {result['score']}"
        )