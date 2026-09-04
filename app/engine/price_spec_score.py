"""
BuyWise AI
Price-to-Specification Scoring Engine

Purpose:
Calculate how much specification/value a product offers
for its current price.

Important:
A cheaper product is NOT automatically considered better.
The score considers:
- Product specifications
- Category
- Current price
- Specification quality
- Price positioning
"""

from typing import Any, Dict


# ============================================================
# SAFE NUMBER
# ============================================================

def safe_number(value: Any, default: float = 0.0) -> float:
    """
    Safely convert values such as:
        8
        "8GB"
        "₹54,999"
        None
    into numbers.
    """

    if isinstance(value, bool):
        return default

    if isinstance(value, (int, float)):
        return float(value)

    if value is None:
        return default

    text = str(value).strip()

    if not text:
        return default

    cleaned = ""

    for char in text:
        if char.isdigit() or char == ".":
            cleaned += char

    try:
        return float(cleaned)
    except (ValueError, TypeError):
        return default


# ============================================================
# NORMALIZE CATEGORY
# ============================================================

def normalize_category(category: Any) -> str:

    text = str(category or "").strip().lower()

    aliases = {
        "smartphone": "smartphone",
        "smartphones": "smartphone",
        "phone": "smartphone",
        "mobile": "smartphone",

        "laptop": "laptop",
        "laptops": "laptop",
        "notebook": "laptop",

        "tv": "tv",
        "tvs": "tv",
        "television": "tv",

        "headphone": "headphones",
        "headphones": "headphones",

        "earbud": "earbuds",
        "earbuds": "earbuds",
        "wireless earbuds": "earbuds",

        "smartwatch": "smartwatch",
        "smart watch": "smartwatch",
        "smartwatches": "smartwatch",
    }

    return aliases.get(text, text)


# ============================================================
# SCORE RANGE
# ============================================================

def clamp_score(value: float) -> float:

    return round(
        max(
            0.0,
            min(
                100.0,
                value
            )
        ),
        1
    )


# ============================================================
# RAM SCORE
# ============================================================

def ram_score(ram_gb: float) -> float:

    ram = safe_number(ram_gb)

    if ram >= 32:
        return 100

    if ram >= 24:
        return 96

    if ram >= 16:
        return 92

    if ram >= 12:
        return 86

    if ram >= 8:
        return 78

    if ram >= 6:
        return 65

    if ram >= 4:
        return 50

    if ram > 0:
        return 30

    return 0


# ============================================================
# STORAGE SCORE
# ============================================================

def storage_score(storage_gb: float) -> float:

    storage = safe_number(storage_gb)

    if storage >= 2048:
        return 100

    if storage >= 1024:
        return 95

    if storage >= 512:
        return 90

    if storage >= 256:
        return 82

    if storage >= 128:
        return 72

    if storage >= 64:
        return 58

    if storage > 0:
        return 40

    return 0


# ============================================================
# GENERIC SPEC SCORE
# ============================================================

def get_spec_score(
    specifications: Dict[str, Any],
    key: str,
    default: float = 70
) -> float:

    value = specifications.get(key)

    if value is None:
        return default

    score = safe_number(value, default)

    return max(
        0,
        min(
            100,
            score
        )
    )


# ============================================================
# CATEGORY BASELINE
# ============================================================

def category_price_baseline(category: str) -> float:

    category = normalize_category(category)

    baselines = {

        # Typical mid-range reference
        "smartphone": 20000,

        # Typical mid-range laptop reference
        "laptop": 55000,

        # Typical 4K TV reference
        "tv": 35000,

        # Typical ANC headphone reference
        "headphones": 10000,

        # Typical wireless earbuds reference
        "earbuds": 6000,

        # Typical smartwatch reference
        "smartwatch": 8000,
    }

    return baselines.get(
        category,
        20000
    )


# ============================================================
# PRICE POSITION SCORE
# ============================================================

def calculate_price_position_score(
    price: float,
    category: str
) -> float:

    price = safe_number(price)

    if price <= 0:
        return 0

    baseline = category_price_baseline(
        category
    )

    ratio = price / baseline

    # Around category baseline
    if 0.90 <= ratio <= 1.10:
        return 85

    # Slightly cheaper
    if 0.75 <= ratio < 0.90:
        return 90

    # Slightly more expensive
    if 1.10 < ratio <= 1.25:
        return 78

    # Very cheap does NOT automatically mean excellent.
    if ratio < 0.75:
        return 72

    # Expensive relative to category
    if 1.25 < ratio <= 1.50:
        return 68

    if 1.50 < ratio <= 1.75:
        return 58

    return 48


# ============================================================
# SMARTPHONE SCORE
# ============================================================

def smartphone_spec_score(
    specs: Dict[str, Any]
) -> float:

    processor = get_spec_score(
        specs,
        "processor_score",
        70
    )

    display = get_spec_score(
        specs,
        "display_score",
        70
    )

    camera = get_spec_score(
        specs,
        "camera_score",
        70
    )

    battery = get_spec_score(
        specs,
        "battery_score",
        70
    )

    software = get_spec_score(
        specs,
        "software_score",
        70
    )

    build = get_spec_score(
        specs,
        "build_score",
        70
    )

    feature = get_spec_score(
        specs,
        "feature_score",
        70
    )

    ram = safe_number(
        specs.get(
            "ram_gb",
            8
        )
    )

    storage = safe_number(
        specs.get(
            "storage_gb",
            128
        )
    )

    score = (

        processor * 0.25 +

        ram_score(ram) * 0.15 +

        storage_score(storage) * 0.10 +

        display * 0.15 +

        camera * 0.10 +

        battery * 0.10 +

        software * 0.05 +

        build * 0.05 +

        feature * 0.05

    )

    return clamp_score(score)


# ============================================================
# LAPTOP SCORE
# ============================================================

def laptop_spec_score(
    specs: Dict[str, Any]
) -> float:

    processor = get_spec_score(
        specs,
        "processor_score",
        70
    )

    display = get_spec_score(
        specs,
        "display_score",
        70
    )

    battery = get_spec_score(
        specs,
        "battery_score",
        70
    )

    build = get_spec_score(
        specs,
        "build_score",
        70
    )

    feature = get_spec_score(
        specs,
        "feature_score",
        70
    )

    software = get_spec_score(
        specs,
        "software_score",
        70
    )

    ram = safe_number(
        specs.get(
            "ram_gb",
            8
        )
    )

    storage = safe_number(
        specs.get(
            "storage_gb",
            512
        )
    )

    score = (

        processor * 0.30 +

        ram_score(ram) * 0.20 +

        storage_score(storage) * 0.15 +

        display * 0.10 +

        battery * 0.10 +

        build * 0.08 +

        software * 0.04 +

        feature * 0.03

    )

    return clamp_score(score)


# ============================================================
# TV SCORE
# ============================================================

def tv_spec_score(
    specs: Dict[str, Any]
) -> float:

    display = get_spec_score(
        specs,
        "display_score",
        70
    )

    processor = get_spec_score(
        specs,
        "processor_score",
        70
    )

    build = get_spec_score(
        specs,
        "build_score",
        70
    )

    feature = get_spec_score(
        specs,
        "feature_score",
        70
    )

    software = get_spec_score(
        specs,
        "software_score",
        70
    )

    sound = get_spec_score(
        specs,
        "sound_score",
        70
    )

    score = (

        display * 0.35 +

        processor * 0.15 +

        feature * 0.20 +

        software * 0.10 +

        sound * 0.10 +

        build * 0.10

    )

    return clamp_score(score)


# ============================================================
# HEADPHONE SCORE
# ============================================================

def headphone_spec_score(
    specs: Dict[str, Any]
) -> float:

    sound = get_spec_score(
        specs,
        "sound_score",
        70
    )

    battery = get_spec_score(
        specs,
        "battery_score",
        70
    )

    feature = get_spec_score(
        specs,
        "feature_score",
        70
    )

    build = get_spec_score(
        specs,
        "build_score",
        70
    )

    noise_cancellation = get_spec_score(
        specs,
        "noise_cancellation_score",
        70
    )

    score = (

        sound * 0.30 +

        noise_cancellation * 0.20 +

        battery * 0.15 +

        feature * 0.15 +

        build * 0.20

    )

    return clamp_score(score)


# ============================================================
# EARBUD SCORE
# ============================================================

def earbud_spec_score(
    specs: Dict[str, Any]
) -> float:

    sound = get_spec_score(
        specs,
        "sound_score",
        70
    )

    battery = get_spec_score(
        specs,
        "battery_score",
        70
    )

    feature = get_spec_score(
        specs,
        "feature_score",
        70
    )

    noise_cancellation = get_spec_score(
        specs,
        "noise_cancellation_score",
        70
    )

    build = get_spec_score(
        specs,
        "build_score",
        70
    )

    score = (

        sound * 0.30 +

        noise_cancellation * 0.20 +

        battery * 0.20 +

        feature * 0.15 +

        build * 0.15

    )

    return clamp_score(score)


# ============================================================
# SMARTWATCH SCORE
# ============================================================

def smartwatch_spec_score(
    specs: Dict[str, Any]
) -> float:

    display = get_spec_score(
        specs,
        "display_score",
        70
    )

    battery = get_spec_score(
        specs,
        "battery_score",
        70
    )

    feature = get_spec_score(
        specs,
        "feature_score",
        70
    )

    build = get_spec_score(
        specs,
        "build_score",
        70
    )

    software = get_spec_score(
        specs,
        "software_score",
        70
    )

    score = (

        display * 0.20 +

        battery * 0.25 +

        feature * 0.25 +

        build * 0.15 +

        software * 0.15

    )

    return clamp_score(score)


# ============================================================
# GENERIC SPEC SCORE
# ============================================================

def generic_spec_score(
    specs: Dict[str, Any]
) -> float:

    possible_scores = []

    score_keys = [
        "processor_score",
        "display_score",
        "camera_score",
        "battery_score",
        "software_score",
        "build_score",
        "feature_score",
        "sound_score",
        "noise_cancellation_score",
    ]

    for key in score_keys:

        if key in specs:

            value = safe_number(
                specs.get(key),
                0
            )

            if value > 0:
                possible_scores.append(
                    value
                )

    if not possible_scores:
        return 60.0

    return clamp_score(
        sum(possible_scores)
        / len(possible_scores)
    )


# ============================================================
# MAIN PRICE-TO-SPEC ENGINE
# ============================================================

def calculate_price_to_spec_score(
    product: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Main BuyWise AI price-to-specification engine.

    Returns a dictionary so the orchestrator can safely use:

        result["score"]

    The score is NOT based only on price.
    """

    if not isinstance(product, dict):

        return {
            "score": 0.0,
            "spec_score": 0.0,
            "price_score": 0.0,
            "category": "unknown",
            "explanation": "Invalid product data."
        }

    category = normalize_category(
        product.get(
            "category",
            ""
        )
    )

    specs = product.get(
        "specifications",
        {}
    )

    if not isinstance(specs, dict):
        specs = {}

    price = safe_number(
        product.get(
            "price_inr",
            product.get(
                "price",
                0
            )
        )
    )

    # --------------------------------------------------------
    # SPECIFICATION SCORE
    # --------------------------------------------------------

    if category == "smartphone":

        spec_score = smartphone_spec_score(
            specs
        )

    elif category == "laptop":

        spec_score = laptop_spec_score(
            specs
        )

    elif category == "tv":

        spec_score = tv_spec_score(
            specs
        )

    elif category == "headphones":

        spec_score = headphone_spec_score(
            specs
        )

    elif category == "earbuds":

        spec_score = earbud_spec_score(
            specs
        )

    elif category == "smartwatch":

        spec_score = smartwatch_spec_score(
            specs
        )

    else:

        spec_score = generic_spec_score(
            specs
        )

    # --------------------------------------------------------
    # PRICE SCORE
    # --------------------------------------------------------

    price_score = calculate_price_position_score(
        price,
        category
    )

    # --------------------------------------------------------
    # FINAL VALUE SCORE
    # --------------------------------------------------------
    #
    # Specifications are more important than price.
    #
    # 70% specifications
    # 30% price position
    #
    # This prevents cheap products from automatically
    # becoming the best recommendation.
    # --------------------------------------------------------

    final_score = (

        spec_score * 0.70 +

        price_score * 0.30

    )

    final_score = clamp_score(
        final_score
    )

    # --------------------------------------------------------
    # EXPLANATION
    # --------------------------------------------------------

    explanation = (

        f"Specification score: {spec_score}/100. "

        f"Price-position score: {price_score}/100. "

        f"Final price-to-spec value: {final_score}/100."

    )

    return {

        "score": final_score,

        "spec_score": spec_score,

        "price_score": price_score,

        "category": category,

        "current_price": price,

        "explanation": explanation

    }


# ============================================================
# BACKWARD-COMPATIBILITY HELPER
# ============================================================

def calculate_price_to_spec(
    product: Dict[str, Any]
) -> float:
    """
    Compatibility helper.

    Some older BuyWise AI code may call:

        calculate_price_to_spec(product)

    This returns only the numeric score.
    """

    result = calculate_price_to_spec_score(
        product
    )

    return safe_number(
        result.get(
            "score",
            0
        )
    )