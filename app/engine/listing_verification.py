"""
Listing Verification Engine

Evaluates the trustworthiness of an exact product listing.

Important:
- Never assumes warranty.
- Never assumes seller legitimacy.
- Missing evidence is treated as an information gap.
"""

from typing import Any, Dict, List


def verify_listing(listing: Dict[str, Any]) -> Dict[str, Any]:
    """
    Verify an exact product listing.

    Expected listing structure:

    {
        "listing_id": "...",
        "marketplace": "...",
        "seller": "...",
        "seller_verified": True/False/None,
        "condition": "new",
        "warranty_verified": True/False/None,
        "warranty_type": "...",
        "invoice_available": True/False/None,
        "return_policy_available": True/False/None,
        "source_reference": "..."
    }
    """

    if not listing:
        return {
            "verified": False,
            "status": "UNABLE TO VERIFY",
            "trust_score": 0,
            "seller_score": 0,
            "warranty_score": 0,
            "condition_score": 0,
            "information_completeness": 0,
            "risk_level": "HIGH",
            "warnings": [
                "No listing information was provided."
            ],
            "evidence": []
        }

    score = 0
    evidence: List[str] = []
    warnings: List[str] = []

    # ---------------------------------------------------------
    # SELLER
    # ---------------------------------------------------------

    seller_verified = listing.get("seller_verified")

    if seller_verified is True:
        score += 30
        evidence.append(
            "Seller verification evidence is available."
        )
    elif seller_verified is False:
        warnings.append(
            "Seller verification failed or is negative."
        )
    else:
        warnings.append(
            "Seller verification information is unavailable."
        )

    # ---------------------------------------------------------
    # WARRANTY
    # ---------------------------------------------------------

    warranty_verified = listing.get("warranty_verified")

    if warranty_verified is True:
        score += 30
        evidence.append(
            "Warranty information was verified for this listing."
        )
    elif warranty_verified is False:
        warnings.append(
            "Warranty information could not be verified."
        )
    else:
        warnings.append(
            "Warranty verification information is unavailable."
        )

    # ---------------------------------------------------------
    # CONDITION
    # ---------------------------------------------------------

    condition = str(
        listing.get("condition", "")
    ).strip().lower()

    if condition == "new":
        score += 15
        evidence.append(
            "Listing condition is identified as new."
        )

    elif condition in {
        "refurbished",
        "open-box",
        "used"
    }:
        warnings.append(
            f"Listing condition is {condition}."
        )

    else:
        warnings.append(
            "Listing condition could not be verified."
        )

    # ---------------------------------------------------------
    # INVOICE
    # ---------------------------------------------------------

    invoice = listing.get("invoice_available")

    if invoice is True:
        score += 10
        evidence.append(
            "Invoice information is available."
        )
    elif invoice is False:
        warnings.append(
            "Invoice availability was not confirmed."
        )
    else:
        warnings.append(
            "Invoice information is unavailable."
        )

    # ---------------------------------------------------------
    # RETURN POLICY
    # ---------------------------------------------------------

    return_policy = listing.get(
        "return_policy_available"
    )

    if return_policy is True:
        score += 10
        evidence.append(
            "Return-policy information is available."
        )
    elif return_policy is False:
        warnings.append(
            "Return-policy information was not confirmed."
        )
    else:
        warnings.append(
            "Return-policy information is unavailable."
        )

    # ---------------------------------------------------------
    # SOURCE
    # ---------------------------------------------------------

    source_reference = listing.get(
        "source_reference"
    )

    if source_reference:
        score += 5
        evidence.append(
            "A source reference is available for this listing."
        )
    else:
        warnings.append(
            "No source reference is available."
        )

    # ---------------------------------------------------------
    # INFORMATION COMPLETENESS
    # ---------------------------------------------------------

    fields = [
        "marketplace",
        "seller",
        "condition",
        "seller_verified",
        "warranty_verified",
        "invoice_available",
        "return_policy_available",
        "source_reference"
    ]

    available = sum(
        1 for field in fields
        if listing.get(field) is not None
        and listing.get(field) != ""
    )

    completeness = round(
        (available / len(fields)) * 100,
        2
    )

    # ---------------------------------------------------------
    # SELLER SCORE
    # ---------------------------------------------------------

    if seller_verified is True:
        seller_score = 100
    elif seller_verified is False:
        seller_score = 20
    else:
        seller_score = 50

    # ---------------------------------------------------------
    # WARRANTY SCORE
    # ---------------------------------------------------------

    if warranty_verified is True:
        warranty_score = 100
    elif warranty_verified is False:
        warranty_score = 20
    else:
        warranty_score = 50

    # ---------------------------------------------------------
    # CONDITION SCORE
    # ---------------------------------------------------------

    if condition == "new":
        condition_score = 100
    elif condition in {
        "refurbished",
        "open-box"
    }:
        condition_score = 60
    elif condition == "used":
        condition_score = 40
    else:
        condition_score = 50

    # ---------------------------------------------------------
    # FINAL STATUS
    # ---------------------------------------------------------

    if (
        seller_verified is True
        and warranty_verified is True
        and condition == "new"
        and completeness >= 75
    ):
        status = "VERIFIED"
        risk_level = "LOW"

    elif score >= 50:
        status = "PARTIALLY VERIFIED"
        risk_level = "MEDIUM"

    else:
        status = "UNABLE TO VERIFY"
        risk_level = "HIGH"

    return {
        "verified": status == "VERIFIED",
        "status": status,
        "trust_score": round(score, 2),
        "seller_score": seller_score,
        "warranty_score": warranty_score,
        "condition_score": condition_score,
        "information_completeness": completeness,
        "risk_level": risk_level,
        "warnings": warnings,
        "evidence": evidence
    }