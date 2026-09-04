import re
from typing import Dict, Any


# ============================================================
# SAFE NUMBER
# ============================================================

def safe_number(
    value: Any,
    default: float = 0.0
) -> float:
    """
    Safely convert values such as:
        8
        "8GB"
        "₹54,999"
        None
    into numbers.
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
# SAFE TEXT
# ============================================================

def safe_text(value: Any) -> str:
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
# REQUIREMENT EXTRACTION
# ============================================================

def extract_requirements(
    requirements: str
) -> Dict[str, Any]:
    """
    Extract structured requirements from natural language.

    Examples:

        8GB RAM
        256GB storage
        5G
        good battery
        gaming
        good camera
        Bluetooth
        WiFi
        good display
    """

    text = safe_text(requirements)

    result = {
        "ram_gb": None,
        "storage_gb": None,

        "needs_5g": False,
        "needs_bluetooth": False,
        "needs_wifi": False,

        "needs_gaming": False,
        "needs_camera": False,
        "needs_battery": False,
        "needs_display": False,

        "needs_good_processor": False,
        "needs_good_performance": False,
    }

    # --------------------------------------------------------
    # RAM
    # --------------------------------------------------------

    ram_match = re.search(
        r"(\d+)\s*gb\s*(?:ram|memory)",
        text
    )

    if ram_match:

        result["ram_gb"] = int(
            ram_match.group(1)
        )

    else:

        # Example: "8GB, good processor"
        # Only use GB as RAM when storage is not specified.
        standalone_gb = re.search(
            r"(\d+)\s*gb\b",
            text
        )

        if standalone_gb:

            result["ram_gb"] = int(
                standalone_gb.group(1)
            )

    # --------------------------------------------------------
    # STORAGE
    # --------------------------------------------------------

    storage_match = re.search(
        r"(\d+(?:\.\d+)?)\s*(gb|tb)\s*"
        r"(?:storage|rom|ssd|disk|memory)",
        text
    )

    if storage_match:

        value = float(
            storage_match.group(1)
        )

        unit = storage_match.group(2)

        if unit == "tb":

            value *= 1024

        result["storage_gb"] = int(
            value
        )

    # --------------------------------------------------------
    # 5G
    # --------------------------------------------------------

    if re.search(
        r"\b5g\b",
        text
    ):

        result["needs_5g"] = True

    # --------------------------------------------------------
    # BLUETOOTH
    # --------------------------------------------------------

    if "bluetooth" in text:

        result["needs_bluetooth"] = True

    # --------------------------------------------------------
    # WIFI
    # --------------------------------------------------------

    if (
        "wifi" in text
        or "wi-fi" in text
    ):

        result["needs_wifi"] = True

    # --------------------------------------------------------
    # GAMING
    # --------------------------------------------------------

    if any(
        word in text
        for word in [
            "gaming",
            "game",
            "games"
        ]
    ):

        result["needs_gaming"] = True

    # --------------------------------------------------------
    # CAMERA
    # --------------------------------------------------------

    if any(
        word in text
        for word in [
            "camera",
            "photography",
            "photo",
            "photos",
            "video",
            "videography"
        ]
    ):

        result["needs_camera"] = True

    # --------------------------------------------------------
    # BATTERY
    # --------------------------------------------------------

    if any(
        word in text
        for word in [
            "battery",
            "battery life",
            "backup",
            "long battery"
        ]
    ):

        result["needs_battery"] = True

    # --------------------------------------------------------
    # DISPLAY
    # --------------------------------------------------------

    if any(
        word in text
        for word in [
            "display",
            "screen",
            "amoled",
            "oled",
            "screen quality"
        ]
    ):

        result["needs_display"] = True

    # --------------------------------------------------------
    # PROCESSOR
    # --------------------------------------------------------

    if any(
        phrase in text
        for phrase in [
            "good processor",
            "powerful processor",
            "fast processor",
            "better processor",
            "strong processor"
        ]
    ):

        result["needs_good_processor"] = True

    # --------------------------------------------------------
    # PERFORMANCE
    # --------------------------------------------------------

    if any(
        phrase in text
        for phrase in [
            "performance",
            "good performance",
            "fast performance",
            "smooth performance"
        ]
    ):

        result["needs_good_performance"] = True

    return result


# ============================================================
# PURPOSE WEIGHTS
# ============================================================

def get_weights(
    purpose: str
) -> Dict[str, float]:
    """
    Return scoring weights based on the user's primary usage.
    """

    purpose = safe_text(
        purpose
    )

    # --------------------------------------------------------
    # GAMING
    # --------------------------------------------------------

    if (
        "gaming" in purpose
        or "game" in purpose
    ):

        return {
            "processor": 0.35,
            "ram_storage": 0.15,
            "display": 0.15,
            "camera": 0.05,
            "battery": 0.15,
            "software": 0.05,
            "build": 0.05,
            "features": 0.05
        }

    # --------------------------------------------------------
    # PHOTOGRAPHY
    # --------------------------------------------------------

    if (
        "photo" in purpose
        or "camera" in purpose
        or "photography" in purpose
    ):

        return {
            "processor": 0.15,
            "ram_storage": 0.10,
            "display": 0.10,
            "camera": 0.35,
            "battery": 0.10,
            "software": 0.10,
            "build": 0.05,
            "features": 0.05
        }

    # --------------------------------------------------------
    # BATTERY
    # --------------------------------------------------------

    if (
        "battery" in purpose
        or "backup" in purpose
    ):

        return {
            "processor": 0.15,
            "ram_storage": 0.10,
            "display": 0.10,
            "camera": 0.05,
            "battery": 0.35,
            "software": 0.10,
            "build": 0.05,
            "features": 0.10
        }

    # --------------------------------------------------------
    # WORK / PRODUCTIVITY
    # --------------------------------------------------------

    if any(
        word in purpose
        for word in [
            "work",
            "office",
            "productivity",
            "study",
            "student"
        ]
    ):

        return {
            "processor": 0.25,
            "ram_storage": 0.20,
            "display": 0.15,
            "camera": 0.05,
            "battery": 0.15,
            "software": 0.10,
            "build": 0.05,
            "features": 0.05
        }

    # --------------------------------------------------------
    # ENTERTAINMENT
    # --------------------------------------------------------

    if any(
        word in purpose
        for word in [
            "entertainment",
            "movies",
            "movie",
            "watching",
            "media"
        ]
    ):

        return {
            "processor": 0.15,
            "ram_storage": 0.10,
            "display": 0.30,
            "camera": 0.05,
            "battery": 0.15,
            "software": 0.10,
            "build": 0.05,
            "features": 0.10
        }

    # --------------------------------------------------------
    # GENERAL
    # --------------------------------------------------------

    return {
        "processor": 0.25,
        "ram_storage": 0.15,
        "display": 0.15,
        "camera": 0.10,
        "battery": 0.10,
        "software": 0.10,
        "build": 0.05,
        "features": 0.10
    }


# ============================================================
# CLAMP
# ============================================================

def clamp(
    value: float,
    minimum: float = 0,
    maximum: float = 100
) -> float:

    return max(
        minimum,
        min(
            maximum,
            value
        )
    )


# ============================================================
# REQUIREMENT SCORE
# ============================================================

def calculate_requirement_score(
    specifications: Dict[str, Any],
    purpose: str,
    requirements: str = ""
) -> float:
    """
    Calculate overall specification fit.

    requirements is optional so existing code will continue
    working until the orchestrator is updated.
    """

    if not isinstance(
        specifications,
        dict
    ):

        return 0.0

    weights = get_weights(
        purpose
    )

    extracted = extract_requirements(
        requirements
    )

    # --------------------------------------------------------
    # CORE SPECIFICATION SCORES
    # --------------------------------------------------------

    processor_score = safe_number(
        specifications.get(
            "processor_score"
        )
    )

    display_score = safe_number(
        specifications.get(
            "display_score"
        )
    )

    camera_score = safe_number(
        specifications.get(
            "camera_score"
        )
    )

    battery_score = safe_number(
        specifications.get(
            "battery_score"
        )
    )

    software_score = safe_number(
        specifications.get(
            "software_score"
        )
    )

    build_score = safe_number(
        specifications.get(
            "build_score"
        )
    )

    feature_score = safe_number(
        specifications.get(
            "feature_score"
        )
    )

    # --------------------------------------------------------
    # RAM
    # --------------------------------------------------------

    ram_gb = safe_number(
        specifications.get(
            "ram_gb"
        )
    )

    ram_score = clamp(
        (ram_gb / 12) * 100
    )

    # --------------------------------------------------------
    # STORAGE
    # --------------------------------------------------------

    storage_gb = safe_number(
        specifications.get(
            "storage_gb"
        )
    )

    storage_score = clamp(
        (storage_gb / 256) * 100
    )

    ram_storage_score = (
        ram_score + storage_score
    ) / 2

    # --------------------------------------------------------
    # WEIGHTED BASE SCORE
    # --------------------------------------------------------

    base_score = (
        processor_score * weights["processor"]
        + ram_storage_score * weights["ram_storage"]
        + display_score * weights["display"]
        + camera_score * weights["camera"]
        + battery_score * weights["battery"]
        + software_score * weights["software"]
        + build_score * weights["build"]
        + feature_score * weights["features"]
    )

    # --------------------------------------------------------
    # EXPLICIT REQUIREMENT MATCH
    # --------------------------------------------------------

    match_score = calculate_requirement_match(
        specifications,
        requirements
    )

    # --------------------------------------------------------
    # COMBINE
    # --------------------------------------------------------
    #
    # 65% general specification fit
    # 35% explicit user requirements
    #
    # This makes the user's actual words matter more.
    # --------------------------------------------------------

    final_score = (
        base_score * 0.65
        + match_score * 0.35
    )

    return round(
        clamp(
            final_score
        ),
        2
    )


# ============================================================
# REQUIREMENT MATCH SCORE
# ============================================================

def calculate_requirement_match(
    specifications: Dict[str, Any],
    requirements: str
) -> float:
    """
    Calculate how closely the product satisfies
    the user's explicit requirements.
    """

    if not isinstance(
        specifications,
        dict
    ):

        return 0.0

    extracted = extract_requirements(
        requirements
    )

    # No explicit requirements
    if not str(
        requirements or ""
    ).strip():

        return 100.0

    scores = []

    # --------------------------------------------------------
    # RAM
    # --------------------------------------------------------

    required_ram = extracted.get(
        "ram_gb"
    )

    if required_ram is not None:

        actual_ram = safe_number(
            specifications.get(
                "ram_gb"
            )
        )

        if actual_ram >= required_ram:

            ram_match = 100

        elif actual_ram >= required_ram * 0.75:

            ram_match = 50

        else:

            ram_match = 0

        scores.append(
            ram_match
        )

    # --------------------------------------------------------
    # STORAGE
    # --------------------------------------------------------

    required_storage = extracted.get(
        "storage_gb"
    )

    if required_storage is not None:

        actual_storage = safe_number(
            specifications.get(
                "storage_gb"
            )
        )

        if actual_storage >= required_storage:

            storage_match = 100

        elif actual_storage >= required_storage * 0.75:

            storage_match = 50

        else:

            storage_match = 0

        scores.append(
            storage_match
        )

    # --------------------------------------------------------
    # CONNECTIVITY
    # --------------------------------------------------------

    connectivity_text = safe_text(
        specifications.get(
            "connectivity",
            ""
        )
    )

    # 5G
    if extracted.get(
        "needs_5g"
    ):

        scores.append(
            100
            if "5g" in connectivity_text
            else 0
        )

    # Bluetooth
    if extracted.get(
        "needs_bluetooth"
    ):

        scores.append(
            100
            if "bluetooth" in connectivity_text
            else 0
        )

    # WiFi
    if extracted.get(
        "needs_wifi"
    ):

        scores.append(
            100
            if (
                "wifi" in connectivity_text
                or "wi-fi" in connectivity_text
            )
            else 0
        )

    # --------------------------------------------------------
    # GAMING
    # --------------------------------------------------------

    if extracted.get(
        "needs_gaming"
    ):

        processor_score = safe_number(
            specifications.get(
                "processor_score"
            )
        )

        if processor_score >= 85:

            scores.append(100)

        elif processor_score >= 70:

            scores.append(60)

        else:

            scores.append(20)

    # --------------------------------------------------------
    # CAMERA
    # --------------------------------------------------------

    if extracted.get(
        "needs_camera"
    ):

        camera_score = safe_number(
            specifications.get(
                "camera_score"
            )
        )

        scores.append(
            clamp(
                camera_score
            )
        )

    # --------------------------------------------------------
    # BATTERY
    # --------------------------------------------------------

    if extracted.get(
        "needs_battery"
    ):

        battery_score = safe_number(
            specifications.get(
                "battery_score"
            )
        )

        scores.append(
            clamp(
                battery_score
            )
        )

    # --------------------------------------------------------
    # DISPLAY
    # --------------------------------------------------------

    if extracted.get(
        "needs_display"
    ):

        display_score = safe_number(
            specifications.get(
                "display_score"
            )
        )

        scores.append(
            clamp(
                display_score
            )
        )

    # --------------------------------------------------------
    # PROCESSOR
    # --------------------------------------------------------

    if extracted.get(
        "needs_good_processor"
    ):

        processor_score = safe_number(
            specifications.get(
                "processor_score"
            )
        )

        scores.append(
            clamp(
                processor_score
            )
        )

    # --------------------------------------------------------
    # PERFORMANCE
    # --------------------------------------------------------

    if extracted.get(
        "needs_good_performance"
    ):

        processor_score = safe_number(
            specifications.get(
                "processor_score"
            )
        )

        feature_score = safe_number(
            specifications.get(
                "feature_score"
            )
        )

        performance_score = (
            processor_score * 0.70
            + feature_score * 0.30
        )

        scores.append(
            clamp(
                performance_score
            )
        )

    # --------------------------------------------------------
    # NO STRUCTURED REQUIREMENTS
    # --------------------------------------------------------

    if not scores:

        return 100.0

    # --------------------------------------------------------
    # FINAL MATCH
    # --------------------------------------------------------

    return round(
        clamp(
            sum(scores) / len(scores)
        ),
        2
    )


# ============================================================
# COMPLETE PRODUCT REQUIREMENT SCORE
# ============================================================

def calculate_complete_requirement_score(
    specifications: Dict[str, Any],
    purpose: str,
    requirements: str
) -> float:
    """
    Complete requirement score.

    This function is useful when the orchestrator passes
    both usage and explicit requirements.
    """

    return calculate_requirement_score(
        specifications=specifications,
        purpose=purpose,
        requirements=requirements
    )