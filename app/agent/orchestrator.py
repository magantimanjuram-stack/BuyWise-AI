from pathlib import Path
import json
import re
from typing import Any, Dict, List


# ============================================================
# ENGINE IMPORTS
# ============================================================

from app.engine.requirement_score import calculate_requirement_score
from app.engine.price_spec_score import calculate_price_to_spec_score
from app.engine.listing_verification import verify_listing as verify_exact_listing
from app.engine.risk_score import calculate_risk_score
from app.engine.purchase_decision import calculate_purchase_confidence
from app.engine.evidence import create_evidence, create_audit_record


# ============================================================
# PROJECT PATHS
# ============================================================

ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data"


# ============================================================
# CATEGORY NORMALIZATION
# ============================================================

CATEGORY_ALIASES = {
    "smartphone": "smartphone",
    "smartphones": "smartphone",
    "phone": "smartphone",
    "phones": "smartphone",
    "mobile": "smartphone",

    "laptop": "laptop",
    "laptops": "laptop",
    "notebook": "laptop",

    "tv": "tv",
    "tvs": "tv",
    "television": "tv",
    "televisions": "tv",

    "headphone": "headphones",
    "headphones": "headphones",

    "earbud": "earbuds",
    "earbuds": "earbuds",
    "wireless earbuds": "earbuds",

    "smartwatch": "smartwatch",
    "smart watch": "smartwatch",
    "smartwatches": "smartwatch",
}


def normalize_category(category: Any) -> str:
    """
    Convert different category names into one standard category.
    """

    text = str(category or "").strip().lower()

    return CATEGORY_ALIASES.get(
        text,
        text
    )


# ============================================================
# LOAD PRODUCT DATA
# ============================================================

def load_products() -> List[Dict[str, Any]]:
    """
    Load products from data/products.json.
    """

    product_file = DATA_DIR / "products.json"

    if not product_file.exists():
        return []

    try:

        with open(
            product_file,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        if isinstance(data, list):

            return [
                product
                for product in data
                if isinstance(product, dict)
            ]

        if isinstance(data, dict):

            products = data.get(
                "products",
                []
            )

            if isinstance(products, list):

                return [
                    product
                    for product in products
                    if isinstance(product, dict)
                ]

        return []

    except (json.JSONDecodeError, OSError):

        return []


# ============================================================
# SAFE GET
# ============================================================

def safe_get(
    data: Any,
    *keys: str,
    default: Any = None
) -> Any:
    """
    Safely get nested dictionary values.
    """

    current = data

    for key in keys:

        if not isinstance(current, dict):
            return default

        current = current.get(key)

        if current is None:
            return default

    return current


# ============================================================
# NUMBER EXTRACTION
# ============================================================

def extract_number(
    value: Any,
    default: float = 0
) -> float:
    """
    Extract a number from values such as:

    16
    "16GB"
    "₹54,999"
    "512 GB"
    """

    if isinstance(value, (int, float)):

        return float(value)

    text = str(value or "")

    match = re.search(
        r"[\d,]+(?:\.\d+)?",
        text
    )

    if not match:
        return default

    try:

        return float(
            match.group(0).replace(",", "")
        )

    except ValueError:

        return default


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(value: Any) -> str:
    """
    Convert any value into searchable lowercase text.
    """

    if isinstance(value, list):

        return " ".join(
            str(item)
            for item in value
        ).lower()

    if isinstance(value, dict):

        return " ".join(
            f"{key} {value}"
            for key, value in value.items()
        ).lower()

    return str(value or "").lower()


# ============================================================
# CATEGORY-SPECIFIC PRICE BASELINE
# ============================================================

def get_category_price_baseline(
    category: str
) -> float:
    """
    Approximate price baseline for different categories.
    """

    category = normalize_category(category)

    baselines = {
        "smartphone": 20000,
        "laptop": 55000,
        "tv": 35000,
        "headphones": 10000,
        "earbuds": 6000,
        "smartwatch": 8000,
    }

    return baselines.get(
        category,
        20000
    )


# ============================================================
# CATEGORY PRICE VALUE
# ============================================================

def calculate_category_price_value(
    product: Dict[str, Any]
) -> float:
    """
    Get the final Price-to-Spec score from
    price_spec_score.py.

    Supports different result key names so the
    orchestrator remains compatible with the
    scoring engine.
    """

    try:

        result = calculate_price_to_spec_score(
            product
        )

        # ----------------------------------------------------
        # If the scoring engine returns a dictionary
        # ----------------------------------------------------

        if isinstance(result, dict):

            score = result.get(
                "final_score",
                result.get(
                    "score",
                    result.get(
                        "price_to_spec_score",
                        result.get(
                            "purchase_score",
                            result.get(
                                "value_score",
                                0
                            )
                        )
                    )
                )
            )

            return round(
                max(
                    0,
                    min(
                        float(score),
                        100
                    )
                ),
                2
            )

        # ----------------------------------------------------
        # If the scoring engine directly returns a number
        # ----------------------------------------------------

        return round(
            max(
                0,
                min(
                    float(result),
                    100
                )
            ),
            2
        )

    except Exception:

        return 0.0


# ============================================================
# REQUIREMENT MATCHING
# ============================================================

def requirement_bonus(
    product: Dict[str, Any],
    requirements: str
) -> float:
    """
    Extra requirement matching for common shopping terms.
    """

    specs = product.get(
        "specifications",
        {}
    )

    if not isinstance(specs, dict):
        specs = {}

    req = normalize_text(
        requirements
    )

    score = 0.0

    # --------------------------------------------------------
    # RAM
    # --------------------------------------------------------

    ram = extract_number(
        specs.get(
            "ram_gb",
            0
        )
    )

    ram_match = re.search(
        r"(\d+)\s*gb\s*(?:ram|memory)?",
        req
    )

    if ram_match:

        requested_ram = float(
            ram_match.group(1)
        )

        if ram >= requested_ram:
            score += 8

        elif ram >= requested_ram * 0.75:
            score += 3

    # --------------------------------------------------------
    # STORAGE
    # --------------------------------------------------------

    storage = extract_number(
        specs.get(
            "storage_gb",
            0
        )
    )

    storage_match = re.search(
        r"(\d+)\s*gb\s*(?:ssd|storage|rom)?",
        req
    )

    if storage_match:

        requested_storage = float(
            storage_match.group(1)
        )

        if storage >= requested_storage:
            score += 8

        elif storage >= requested_storage * 0.75:
            score += 3

    # --------------------------------------------------------
    # 5G
    # --------------------------------------------------------

    if "5g" in req:

        connectivity = normalize_text(
            specs.get(
                "connectivity",
                ""
            )
        )

        if "5g" in connectivity:

            score += 8

    # --------------------------------------------------------
    # BLUETOOTH
    # --------------------------------------------------------

    if "bluetooth" in req:

        connectivity = normalize_text(
            specs.get(
                "connectivity",
                ""
            )
        )

        if "bluetooth" in connectivity:

            score += 5

    # --------------------------------------------------------
    # WIFI
    # --------------------------------------------------------

    if "wifi" in req or "wi-fi" in req:

        connectivity = normalize_text(
            specs.get(
                "connectivity",
                ""
            )
        )

        if (
            "wifi" in connectivity
            or "wi-fi" in connectivity
        ):

            score += 5

    # --------------------------------------------------------
    # BATTERY
    # --------------------------------------------------------

    battery = extract_number(
        specs.get(
            "battery_score",
            0
        )
    )

    if "battery" in req:

        if battery >= 80:
            score += 6

        elif battery >= 60:
            score += 3

    # --------------------------------------------------------
    # CAMERA
    # --------------------------------------------------------

    camera = extract_number(
        specs.get(
            "camera_score",
            0
        )
    )

    if (
        "camera" in req
        or "photography" in req
    ):

        if camera >= 85:
            score += 8

        elif camera >= 70:
            score += 4

    # --------------------------------------------------------
    # GAMING
    # --------------------------------------------------------

    processor = extract_number(
        specs.get(
            "processor_score",
            0
        )
    )

    if "gaming" in req:

        if processor >= 85:
            score += 8

        elif processor >= 70:
            score += 4

    # --------------------------------------------------------
    # DISPLAY
    # --------------------------------------------------------

    display = extract_number(
        specs.get(
            "display_score",
            0
        )
    )

    if (
        "display" in req
        or "screen" in req
    ):

        if display >= 85:
            score += 6

        elif display >= 70:
            score += 3

    return min(
        score,
        30
    )


# ============================================================
# PRODUCT FIT
# ============================================================

def calculate_product_fit(
    product: Dict[str, Any],
    budget: float,
    usage: str,
    requirements: str
) -> float:
    """
    Calculate how well a product fits the user's request.
    """

    specifications = product.get(
        "specifications",
        {}
    )

    if not isinstance(specifications, dict):
        specifications = {}

    # --------------------------------------------------------
    # Base requirement score
    # --------------------------------------------------------

    try:

        score = calculate_requirement_score(
            specifications,
            usage
        )

    except Exception:

        score = 50.0

    # --------------------------------------------------------
    # Make sure score is usable
    # --------------------------------------------------------

    score = extract_number(
        score,
        default=50
    )

    # --------------------------------------------------------
    # Budget
    # --------------------------------------------------------

    price = extract_number(
        product.get(
            "price_inr",
            0
        )
    )

    budget = extract_number(
        budget,
        default=0
    )

    if budget > 0 and price > 0:

        if price > budget:

            score -= 40

        elif price <= budget * 0.80:

            score += 5

        elif price <= budget * 0.95:

            score += 2

    # --------------------------------------------------------
    # Requirement bonus
    # --------------------------------------------------------

    score += requirement_bonus(
        product,
        requirements
    )

    # --------------------------------------------------------
    # Explicit usage matching
    # --------------------------------------------------------

    usage_text = normalize_text(
        usage
    )

    if usage_text:

        specs_text = normalize_text(
            specifications
        )

        if usage_text in specs_text:

            score += 5

    return round(
        max(
            0,
            min(
                score,
                100
            )
        ),
        2
    )


# ============================================================
# LISTING DATA
# ============================================================

def get_listing_data(
    product: Dict[str, Any]
) -> Dict[str, Any]:

    listing = product.get(
        "listing"
    )

    if not isinstance(listing, dict):

        return {}

    return listing


# ============================================================
# LISTING VERIFICATION
# ============================================================

def verify_listing(
    product: Dict[str, Any]
) -> Dict[str, Any]:

    listing = get_listing_data(
        product
    )

    if not listing:

        return {
            "status": "UNABLE TO VERIFY",
            "seller_score": 0,
            "warranty_score": 0,
            "condition_score": 0,
            "information_completeness": 0,
            "marketplace": "Unknown",
            "trust_score": 0
        }

    try:

        result = verify_exact_listing(
            listing
        )

        if not isinstance(result, dict):

            result = {}

    except Exception:

        result = {}

    result.setdefault(
        "status",
        "UNABLE TO VERIFY"
    )

    result.setdefault(
        "seller_score",
        0
    )

    result.setdefault(
        "warranty_score",
        0
    )

    result.setdefault(
        "condition_score",
        0
    )

    result.setdefault(
        "information_completeness",
        0
    )

    result.setdefault(
        "marketplace",
        listing.get(
            "marketplace",
            "Unknown"
        )
    )

    result.setdefault(
        "trust_score",
        result.get(
            "seller_score",
            0
        )
    )

    return result


# ============================================================
# WARRANTY
# ============================================================

def get_warranty_info(
    product: Dict[str, Any],
    listing: Dict[str, Any]
) -> Dict[str, Any]:

    product_warranty = product.get(
        "warranty",
        {}
    )

    if not isinstance(
        product_warranty,
        dict
    ):

        product_warranty = {}

    listing_verified = (
        listing.get(
            "warranty_verified"
        )
        is True
    )

    product_verified = (
        product_warranty.get(
            "verified"
        )
        is True
    )

    verified = (
        listing_verified
        or product_verified
    )

    warranty_type = (
        listing.get(
            "warranty_type"
        )
        or product_warranty.get(
            "type"
        )
        or "UNABLE TO VERIFY"
    )

    evidence = (
        listing.get(
            "warranty_evidence"
        )
        or product_warranty.get(
            "evidence"
        )
        or "No warranty evidence available."
    )

    if verified:

        status = "VERIFIED"

        warranty_score = extract_number(
            listing.get(
                "warranty_score",
                product_warranty.get(
                    "warranty_score",
                    100
                )
            ),
            default=100
        )

    else:

        status = "UNABLE TO VERIFY"
        warranty_score = 0

    return {
        "status": status,
        "verified": verified,
        "type": warranty_type,
        "evidence": evidence,
        "warranty_score": round(
            max(
                0,
                min(
                    warranty_score,
                    100
                )
            ),
            2
        )
    }


# ============================================================
# REVIEW INTELLIGENCE
# ============================================================

def analyze_reviews(
    product: Dict[str, Any]
) -> Dict[str, Any]:

    reviews = product.get(
        "reviews",
        {}
    )

    if not isinstance(
        reviews,
        dict
    ):

        reviews = {}

    review_count = extract_number(
        reviews.get(
            "review_count",
            0
        )
    )

    average_rating = reviews.get(
        "average_rating",
        "N/A"
    )

    sentiment = reviews.get(
        "sentiment",
        "N/A"
    )

    complaints = reviews.get(
        "complaints",
        []
    )

    if not isinstance(
        complaints,
        list
    ):

        complaints = []

    if review_count <= 0:

        review_score = 40

    elif review_count >= 1000:

        review_score = 90

    elif review_count >= 500:

        review_score = 85

    elif review_count >= 100:

        review_score = 80

    elif review_count >= 20:

        review_score = 70

    else:

        review_score = 60

    sentiment_text = normalize_text(
        sentiment
    )

    if "positive" in sentiment_text:

        review_score += 5

    elif "negative" in sentiment_text:

        review_score -= 20

    return {
        "average_rating": average_rating,
        "review_count": int(
            review_count
        ),
        "sentiment": sentiment,
        "complaints": complaints,
        "review_score": round(
            max(
                0,
                min(
                    review_score,
                    100
                )
            ),
            2
        )
    }


# ============================================================
# PRICE HISTORY
# ============================================================

def analyze_price_history(
    product: Dict[str, Any]
) -> Dict[str, Any]:

    history = product.get(
        "price_history",
        {}
    )

    if not isinstance(
        history,
        dict
    ):

        history = {}

    current_price = extract_number(
        product.get(
            "price_inr",
            0
        )
    )

    historical_low_raw = history.get(
        "historical_low"
    )

    if historical_low_raw is None:

        historical_low = None

    else:

        historical_low = extract_number(
            historical_low_raw,
            default=0
        )

        if historical_low <= 0:
            historical_low = None

    if historical_low is None:

        status = "HISTORY NOT AVAILABLE"
        price_anomaly_score = 50

    elif current_price <= historical_low:

        status = "AT HISTORICAL LOW"
        price_anomaly_score = 100

    elif current_price <= historical_low * 1.05:

        status = "NEAR HISTORICAL LOW"
        price_anomaly_score = 90

    elif current_price <= historical_low * 1.15:

        status = "SLIGHTLY ABOVE HISTORICAL LOW"
        price_anomaly_score = 75

    else:

        status = "ABOVE HISTORICAL LOW"
        price_anomaly_score = 55

    return {
        "current_price": current_price,
        "historical_low": historical_low,
        "price_status": status,
        "price_anomaly_score": price_anomaly_score
    }


# ============================================================
# SALE TIMING
# ============================================================

def analyze_sale_timing(
    product: Dict[str, Any]
) -> Dict[str, Any]:

    sale = product.get(
        "sale_timing",
        {}
    )

    if not isinstance(
        sale,
        dict
    ):

        sale = {}

    event = sale.get(
        "upcoming_event",
        "No event identified"
    )

    days_until = sale.get(
        "days_until"
    )

    recommendation = sale.get(
        "recommendation",
        "No timing recommendation available"
    )

    if days_until is None:

        timing_score = 50

    else:

        days = extract_number(
            days_until,
            default=50
        )

        if days <= 0:

            timing_score = 100

        elif days <= 7:

            timing_score = 90

        elif days <= 30:

            timing_score = 75

        else:

            timing_score = 60

    return {
        "upcoming_event": event,
        "days_until": days_until,
        "recommendation": recommendation,
        "timing_score": timing_score
    }


# ============================================================
# RISK
# ============================================================

def calculate_purchase_risk(
    listing: Dict[str, Any],
    warranty: Dict[str, Any],
    reviews: Dict[str, Any],
    price_history: Dict[str, Any]
) -> Dict[str, Any]:

    result = calculate_risk_score(
        seller_score=extract_number(
            listing.get(
                "seller_score",
                0
            )
        ),

        warranty_score=extract_number(
            warranty.get(
                "warranty_score",
                0
            )
        ),

        condition_score=extract_number(
            listing.get(
                "condition_score",
                0
            )
        ),

        price_anomaly_score=extract_number(
            price_history.get(
                "price_anomaly_score",
                50
            )
        ),

        review_score=extract_number(
            reviews.get(
                "review_score",
                40
            )
        ),

        information_completeness=extract_number(
            listing.get(
                "information_completeness",
                0
            )
        )
    )

    return {
        "score": result.get(
            "overall_risk",
            100
        ),

        "level": result.get(
            "risk_level",
            "VERY HIGH"
        ),

        "risk_level": result.get(
            "risk_level",
            "VERY HIGH"
        ),

        "recommendation": result.get(
            "recommendation",
            "DO NOT RECOMMEND"
        ),

        "verified": result.get(
            "verified",
            False
        ),

        "warnings": result.get(
            "warnings",
            []
        ),

        "details": result
    }


# ============================================================
# FINAL PURCHASE DECISION
# ============================================================

def calculate_final_purchase_decision(
    product_fit: float,
    price_to_spec: float,
    listing: Dict[str, Any],
    warranty: Dict[str, Any],
    price_score: float,
    review_score: float,
    timing_score: float,
    risk_score: float
) -> Dict[str, Any]:

    return calculate_purchase_confidence(

        product_fit_score=product_fit,

        price_to_spec_score=price_to_spec,

        seller_score=extract_number(
            listing.get(
                "seller_score",
                0
            )
        ),

        warranty_score=extract_number(
            warranty.get(
                "warranty_score",
                0
            )
        ),

        price_score=price_score,

        review_score=review_score,

        timing_score=timing_score,

        risk_score=risk_score
    )


# ============================================================
# EVIDENCE
# ============================================================

def create_product_evidence(
    product: Dict[str, Any],
    listing: Dict[str, Any],
    warranty: Dict[str, Any],
    reviews: Dict[str, Any],
    price_history: Dict[str, Any],
    sale_timing: Dict[str, Any]
) -> List[Dict[str, Any]]:

    evidence = []

    brand = product.get(
        "brand",
        "Unknown"
    )

    model = product.get(
        "model",
        "Unknown"
    )

    price = extract_number(
        product.get(
            "price_inr",
            0
        )
    )

    # --------------------------------------------------------
    # PRODUCT
    # --------------------------------------------------------

    evidence.append(
        create_evidence(
            evidence_type="PRODUCT",
            source="Development product dataset",
            claim=(
                f"{brand} {model} is present in the "
                f"product dataset at ₹{price:,.0f}."
            ),
            confidence=80
        )
    )

    # --------------------------------------------------------
    # LISTING
    # --------------------------------------------------------

    evidence.append(
        create_evidence(
            evidence_type="LISTING",
            source="Listing verification engine",
            claim=(
                f"Listing status: "
                f"{listing.get('status', 'UNABLE TO VERIFY')}."
            ),
            confidence=extract_number(
                listing.get(
                    "trust_score",
                    listing.get(
                        "seller_score",
                        0
                    )
                )
            )
        )
    )

    # --------------------------------------------------------
    # WARRANTY
    # --------------------------------------------------------

    evidence.append(
        create_evidence(
            evidence_type="WARRANTY",
            source="Warranty verification",
            claim=(
                f"Warranty status: "
                f"{warranty.get('status', 'UNABLE TO VERIFY')}."
            ),
            confidence=extract_number(
                warranty.get(
                    "warranty_score",
                    0
                )
            )
        )
    )

    # --------------------------------------------------------
    # REVIEWS
    # --------------------------------------------------------

    evidence.append(
        create_evidence(
            evidence_type="REVIEWS",
            source="Review analysis",
            claim=(
                f"Review count: "
                f"{reviews.get('review_count', 0)}; "
                f"sentiment: "
                f"{reviews.get('sentiment', 'N/A')}."
            ),
            confidence=extract_number(
                reviews.get(
                    "review_score",
                    0
                )
            )
        )
    )

    # --------------------------------------------------------
    # PRICE
    # --------------------------------------------------------

    evidence.append(
        create_evidence(
            evidence_type="PRICE_HISTORY",
            source="Price history analysis",
            claim=(
                f"Price status: "
                f"{price_history.get('price_status', 'UNKNOWN')}."
            ),
            confidence=extract_number(
                price_history.get(
                    "price_anomaly_score",
                    50
                )
            )
        )
    )

    # --------------------------------------------------------
    # SALE
    # --------------------------------------------------------

    evidence.append(
        create_evidence(
            evidence_type="SALE_TIMING",
            source="Sale timing analysis",
            claim=(
                f"Upcoming event: "
                f"{sale_timing.get('upcoming_event', 'None')}."
            ),
            confidence=extract_number(
                sale_timing.get(
                    "timing_score",
                    50
                )
            )
        )
    )

    return evidence


# ============================================================
# EMPTY RESULT
# ============================================================

def create_empty_result(
    message: str,
    user_request: Dict[str, Any]
) -> Dict[str, Any]:

    audit_record = create_audit_record(
        user_request=user_request,
        decision={
            "recommendation": "UNAVAILABLE",
            "reason": message
        },
        evidence=[]
    )

    return {
        "product": {},

        "purchase_confidence": 0,

        "recommendation": "UNAVAILABLE",

        "reason": message,

        "listing_verification": {},

        "warranty": {},

        "reviews": {},

        "price_history": {},

        "sale_timing": {},

        "risk": {
            "score": 100,
            "overall_risk": 100,
            "level": "VERY HIGH",
            "risk_level": "VERY HIGH",
            "recommendation": "DO NOT RECOMMEND",
            "verified": False,
            "warnings": [
                message
            ]
        },

        "product_fit": 0,

        "price_to_spec": 0,

        "alternatives": [],

        "evidence": [],

        "audit_record": audit_record
    }


# ============================================================
# MAIN AGENT
# ============================================================

def run_agent(
    category: str,
    budget: float,
    usage: str,
    requirements: str
) -> Dict[str, Any]:
    """
    Main AI Commerce Decision Agent.

    Supports:

        Smartphone
        Laptop
        TV
        Headphones
        Earbuds
        Smartwatch
    """

    # --------------------------------------------------------
    # USER REQUEST
    # --------------------------------------------------------

    normalized_category = normalize_category(
        category
    )

    budget_value = extract_number(
        budget,
        default=0
    )

    user_request = {
        "category": normalized_category,
        "budget": budget_value,
        "usage": str(
            usage or ""
        ),
        "requirements": str(
            requirements or ""
        )
    }

    # --------------------------------------------------------
    # LOAD PRODUCTS
    # --------------------------------------------------------

    products = load_products()

    if not products:

        return create_empty_result(
            "No product data is available. "
            "Please check data/products.json.",
            user_request
        )

    # --------------------------------------------------------
    # CATEGORY MATCHING
    # --------------------------------------------------------

    category_products = []

    for product in products:

        product_category = normalize_category(
            product.get(
                "category",
                ""
            )
        )

        if product_category == normalized_category:

            category_products.append(
                product
            )

    # --------------------------------------------------------
    # CATEGORY NOT FOUND
    # --------------------------------------------------------

    if not category_products:

        available_categories = sorted(
            set(
                normalize_category(
                    product.get(
                        "category",
                        ""
                    )
                )
                for product in products
                if product.get(
                    "category"
                )
            )
        )

        return create_empty_result(
            (
                f"No products were found for the "
                f"'{category}' category. "
                f"Available categories: "
                f"{', '.join(available_categories)}."
            ),
            user_request
        )

    # --------------------------------------------------------
    # BUDGET FILTER
    # --------------------------------------------------------

    affordable_products = []

    for product in category_products:

        price = extract_number(
            product.get(
                "price_inr",
                0
            )
        )

        if budget_value <= 0:

            continue

        if price <= budget_value:

            affordable_products.append(
                product
            )

    # --------------------------------------------------------
    # NO AFFORDABLE PRODUCT
    # --------------------------------------------------------

    if not affordable_products:

        cheapest = min(
            category_products,
            key=lambda item: extract_number(
                item.get(
                    "price_inr",
                    999999999
                )
            )
        )

        cheapest_name = (
            f"{cheapest.get('brand', '')} "
            f"{cheapest.get('model', 'Unknown Product')}"
        ).strip()

        cheapest_price = extract_number(
            cheapest.get(
                "price_inr",
                0
            )
        )

        return create_empty_result(
            (
                f"No {category} is available within "
                f"your ₹{budget_value:,.0f} budget. "
                f"The cheapest available option is "
                f"{cheapest_name} at "
                f"₹{cheapest_price:,.0f}."
            ),
            user_request
        )

    # --------------------------------------------------------
    # SCORE PRODUCTS
    # --------------------------------------------------------

    scored_products = []

    for product in affordable_products:

        # ----------------------------------------------------
        # PRODUCT FIT
        # ----------------------------------------------------

        product_fit = calculate_product_fit(
            product=product,
            budget=budget_value,
            usage=usage,
            requirements=requirements
        )

        # ----------------------------------------------------
        # PRICE-TO-SPEC
        # ----------------------------------------------------

        price_to_spec = calculate_category_price_value(
            product
        )

        # ----------------------------------------------------
        # LISTING
        # ----------------------------------------------------

        listing = verify_listing(
            product
        )

        # ----------------------------------------------------
        # WARRANTY
        # ----------------------------------------------------

        warranty = get_warranty_info(
            product,
            listing
        )

        # ----------------------------------------------------
        # REVIEWS
        # ----------------------------------------------------

        reviews = analyze_reviews(
            product
        )

        # ----------------------------------------------------
        # PRICE HISTORY
        # ----------------------------------------------------

        price_history = analyze_price_history(
            product
        )

        # ----------------------------------------------------
        # SALE TIMING
        # ----------------------------------------------------

        sale_timing = analyze_sale_timing(
            product
        )

        # ----------------------------------------------------
        # RISK
        # ----------------------------------------------------

        risk = calculate_purchase_risk(
            listing=listing,
            warranty=warranty,
            reviews=reviews,
            price_history=price_history
        )

        # ----------------------------------------------------
        # PRICE SCORE
        # ----------------------------------------------------

        price_score = extract_number(
            price_history.get(
                "price_anomaly_score",
                50
            )
        )

        # ----------------------------------------------------
        # FINAL DECISION
        # ----------------------------------------------------

        decision = calculate_final_purchase_decision(
            product_fit=product_fit,
            price_to_spec=price_to_spec,
            listing=listing,
            warranty=warranty,
            price_score=price_score,
            review_score=extract_number(
                reviews.get(
                    "review_score",
                    40
                )
            ),
            timing_score=extract_number(
                sale_timing.get(
                    "timing_score",
                    50
                )
            ),
            risk_score=extract_number(
                risk.get(
                    "score",
                    100
                )
            )
        )

        # ----------------------------------------------------
        # EVIDENCE
        # ----------------------------------------------------

        evidence = create_product_evidence(
            product=product,
            listing=listing,
            warranty=warranty,
            reviews=reviews,
            price_history=price_history,
            sale_timing=sale_timing
        )

        # ----------------------------------------------------
        # STORE SCORES
        # ----------------------------------------------------

        scored_products.append(
            {
                "product": product,

                "product_fit": product_fit,

                "price_to_spec": price_to_spec,

                "listing_verification": listing,

                "warranty": warranty,

                "reviews": reviews,

                "price_history": price_history,

                "sale_timing": sale_timing,

                "risk": risk,

                "decision": decision,

                "purchase_confidence": extract_number(
                    decision.get(
                        "purchase_confidence",
                        0
                    )
                ),

                "evidence": evidence
            }
        )

    # --------------------------------------------------------
    # CHECK SCORED PRODUCTS
    # --------------------------------------------------------

    if not scored_products:

        return create_empty_result(
            "No products could be scored.",
            user_request
        )

    # --------------------------------------------------------
    # SELECT BEST PRODUCT
    # --------------------------------------------------------

    best = max(
        scored_products,
        key=lambda item: item[
            "purchase_confidence"
        ]
    )

    product = best["product"]

    decision = best["decision"]

    # --------------------------------------------------------
    # PRODUCT DETAILS
    # --------------------------------------------------------

    brand = str(
        product.get(
            "brand",
            "Unknown Brand"
        )
    )

    model = str(
        product.get(
            "model",
            "Unknown Model"
        )
    )

    variant = str(
        product.get(
            "variant",
            ""
        )
    )

    product_name = (
        f"{brand} {model}"
    ).strip()

    if variant:

        product_name += (
            f" {variant}"
        )

    price = extract_number(
        product.get(
            "price_inr",
            0
        )
    )

    # --------------------------------------------------------
    # DECISION
    # --------------------------------------------------------

    confidence = extract_number(
        decision.get(
            "purchase_confidence",
            0
        )
    )

    recommendation = decision.get(
        "recommendation",
        "DO NOT RECOMMEND"
    )

    # --------------------------------------------------------
    # REASON
    # --------------------------------------------------------

    reason_parts = [
        (
            f"{product_name} received a purchase "
            f"confidence of {confidence}/100."
        ),

        (
            f"Product Fit: "
            f"{best['product_fit']}/100."
        ),

        (
            f"Price-to-Spec: "
            f"{best['price_to_spec']}/100."
        )
    ]

    if best[
        "listing_verification"
    ].get(
        "status"
    ) != "VERIFIED":

        reason_parts.append(
            "The exact seller/listing could not "
            "be fully verified."
        )

    if best[
        "warranty"
    ].get(
        "status"
    ) != "VERIFIED":

        reason_parts.append(
            "Warranty evidence could not be "
            "sufficiently verified."
        )

    reason = " ".join(
        reason_parts
    )

    # --------------------------------------------------------
    # ALTERNATIVES
    # --------------------------------------------------------

    alternatives = []

    sorted_products = sorted(
        scored_products,
        key=lambda item: item[
            "purchase_confidence"
        ],
        reverse=True
    )

    for item in sorted_products:

        alternative_product = item[
            "product"
        ]

        alternative_brand = str(
            alternative_product.get(
                "brand",
                ""
            )
        )

        alternative_model = str(
            alternative_product.get(
                "model",
                "Unknown Product"
            )
        )

        alternative_name = (
            f"{alternative_brand} "
            f"{alternative_model}"
        ).strip()

        alternatives.append(
            {
                "name": alternative_name,

                "brand": alternative_brand,

                "model": alternative_model,

                "price": extract_number(
                    alternative_product.get(
                        "price_inr",
                        0
                    )
                ),

                "price_inr": extract_number(
                    alternative_product.get(
                        "price_inr",
                        0
                    )
                ),

                "purchase_confidence": extract_number(
                    item[
                        "purchase_confidence"
                    ]
                ),

                "product_fit": extract_number(
                    item[
                        "product_fit"
                    ]
                ),

                "price_to_spec": extract_number(
                    item[
                        "price_to_spec"
                    ]
                )
            }
        )

    # --------------------------------------------------------
    # AUDIT
    # --------------------------------------------------------

    audit_decision = {
        "product": product_name,

        "category": normalized_category,

        "price": price,

        "purchase_confidence": confidence,

        "recommendation": recommendation,

        "product_fit": best[
            "product_fit"
        ],

        "price_to_spec": best[
            "price_to_spec"
        ],

        "risk": best[
            "risk"
        ],

        "listing_verification": best[
            "listing_verification"
        ],

        "warranty": best[
            "warranty"
        ]
    }

    audit_record = create_audit_record(
        user_request=user_request,
        decision=audit_decision,
        evidence=best[
            "evidence"
        ]
    )

    # --------------------------------------------------------
    # FINAL RESULT
    # --------------------------------------------------------

    return {
        "product": {
            "name": product_name,

            "brand": brand,

            "model": model,

            "variant": variant,

            "category": normalize_category(
                product.get(
                    "category",
                    normalized_category
                )
            ),

            "price": price,

            "price_inr": price
        },

        "purchase_confidence": confidence,

        "recommendation": recommendation,

        "reason": reason,

        "listing_verification": best[
            "listing_verification"
        ],

        "warranty": best[
            "warranty"
        ],

        "reviews": best[
            "reviews"
        ],

        "price_history": best[
            "price_history"
        ],

        "sale_timing": best[
            "sale_timing"
        ],

        "risk": best[
            "risk"
        ],

        "product_fit": best[
            "product_fit"
        ],

        "price_to_spec": best[
            "price_to_spec"
        ],

        "alternatives": alternatives,

        "evidence": best[
            "evidence"
        ],

        "audit_record": audit_record
    }