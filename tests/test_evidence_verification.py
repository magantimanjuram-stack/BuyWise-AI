from app.engine.listing_verification import verify_listing
from app.engine.evidence import (
    create_evidence,
    create_audit_record
)


listing = {
    "listing_id": "LIST-001",
    "marketplace": "Example Marketplace",
    "seller": "Verified Seller",
    "seller_verified": True,
    "condition": "new",
    "warranty_verified": True,
    "warranty_type": "Manufacturer Warranty",
    "invoice_available": True,
    "return_policy_available": True,
    "source_reference": "LISTING-001"
}


result = verify_listing(listing)


print()
print("========================================")
print("      LISTING + EVIDENCE ENGINE")
print("========================================")

print(
    "Status:",
    result["status"]
)

print(
    "Trust Score:",
    result["trust_score"]
)

print(
    "Seller Score:",
    result["seller_score"]
)

print(
    "Warranty Score:",
    result["warranty_score"]
)

print(
    "Condition Score:",
    result["condition_score"]
)

print(
    "Information Completeness:",
    result["information_completeness"]
)

print(
    "Risk Level:",
    result["risk_level"]
)

print()
print("Evidence:")

for item in result["evidence"]:
    print(" +", item)

print()
print("Warnings:")

for warning in result["warnings"]:
    print(" !", warning)


evidence = create_evidence(
    evidence_type="listing",
    source="marketplace",
    claim="Seller and warranty information verified.",
    confidence=result["trust_score"],
    reference="LISTING-001"
)


audit = create_audit_record(
    user_request={
        "category": "smartphone",
        "budget": 20000
    },
    decision=result,
    evidence=[evidence]
)


print()
print("Audit ID:")
print(audit["decision_id"])

print()
print("Evidence ID:")
print(evidence["evidence_id"])

print()
print("========================================")