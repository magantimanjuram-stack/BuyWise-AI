"""
Evidence Management

Keeps track of why the AI made a decision.
"""


from datetime import datetime
from typing import Any, Dict, List


def create_evidence(
    evidence_type: str,
    source: str,
    claim: str,
    confidence: float,
    reference: str = ""
) -> Dict[str, Any]:

    return {
        "evidence_id": (
            f"EVD-{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
        ),
        "type": evidence_type,
        "source": source,
        "source_reference": reference,
        "claim": claim,
        "confidence": round(
            max(0, min(confidence, 100)),
            2
        ),
        "checked_at": datetime.now().isoformat()
    }


def create_audit_record(
    user_request: Dict[str, Any],
    decision: Dict[str, Any],
    evidence: List[Dict[str, Any]]
) -> Dict[str, Any]:

    return {
        "decision_id": (
            f"DEC-{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
        ),
        "created_at": datetime.now().isoformat(),
        "user_request": user_request,
        "decision": decision,
        "evidence": evidence
    }