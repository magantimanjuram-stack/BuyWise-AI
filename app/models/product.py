from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Specifications:
    processor: str
    processor_score: float

    ram_gb: int
    storage_gb: int

    display: str
    display_score: float

    camera: str
    camera_score: float

    battery_mah: int
    charging_watt: int
    battery_score: float

    software: str
    software_score: float

    build: str
    build_score: float

    connectivity: List[str] = field(default_factory=list)
    feature_score: float = 0.0


@dataclass
class Product:
    product_id: str
    brand: str
    model: str
    variant: str
    category: str
    price_inr: float

    specifications: Specifications

    source: Optional[str] = None
    source_reference: Optional[str] = None
    checked_at: Optional[str] = None
    evidence_confidence: str = "unknown"