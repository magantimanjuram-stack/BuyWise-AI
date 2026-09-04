from dataclasses import dataclass, field
from typing import Optional, List


@dataclass
class Listing:
    """
    Represents one exact marketplace listing for a product.

    Product = what the item is.
    Listing = where, from whom, and at what price it is being sold.
    """

    listing_id: str
    product_id: str

    marketplace: str
    seller: str

    price_inr: float

    condition: str = "new"
    availability: str = "unknown"

    seller_trust_score: float = 0.0
    warranty_confidence: float = 0.0
    condition_score: float = 0.0
    marketplace_score: float = 0.0
    information_completeness: float = 0.0

    seller_evidence: List[str] = field(default_factory=list)
    warranty_evidence: List[str] = field(default_factory=list)

    listing_reference: Optional[str] = None
    checked_at: Optional[str] = None

    verified: bool = False
    verification_status: str = "not_checked"

    def overall_trust_score(self) -> float:
        """
        Calculate the trust score of this exact listing.

        Seller       -> 30%
        Warranty     -> 25%
        Condition    -> 15%
        Marketplace  -> 10%
        Information  -> 20%
        """

        score = (
            self.seller_trust_score * 0.30
            + self.warranty_confidence * 0.25
            + self.condition_score * 0.15
            + self.marketplace_score * 0.10
            + self.information_completeness * 0.20
        )

        return round(score, 2)

    def risk_level(self) -> str:
        """
        Convert trust score into a simple risk level.
        """

        trust = self.overall_trust_score()

        if trust >= 85:
            return "LOW"

        if trust >= 65:
            return "MEDIUM"

        return "HIGH"

    def is_safe_to_consider(self) -> bool:
        """
        A listing can be considered safe only when
        it has sufficient verification.
        """

        trust = self.overall_trust_score()

        return (
            self.verified
            and trust >= 65
            and self.verification_status == "verified"
        )

    def summary(self) -> dict:
        """
        Return a clean summary for the recommendation engine/UI.
        """

        trust = self.overall_trust_score()

        return {
            "listing_id": self.listing_id,
            "product_id": self.product_id,
            "marketplace": self.marketplace,
            "seller": self.seller,
            "price_inr": self.price_inr,
            "condition": self.condition,
            "availability": self.availability,
            "trust_score": trust,
            "risk_level": self.risk_level(),
            "verified": self.verified,
            "verification_status": self.verification_status,
            "safe_to_consider": self.is_safe_to_consider(),
        }