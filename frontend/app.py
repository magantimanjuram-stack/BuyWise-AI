import sys
import time
from pathlib import Path

import streamlit as st


# ============================================================
# PROJECT PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))


# ============================================================
# BACKEND IMPORT
# ============================================================

try:
    from app.agent.orchestrator import run_agent

    AGENT_AVAILABLE = True
    IMPORT_ERROR = ""

except Exception as error:
    AGENT_AVAILABLE = False
    IMPORT_ERROR = str(error)


# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(
    page_title="BuyWise AI",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ============================================================
# SESSION STATE
# ============================================================

if "selected_category" not in st.session_state:
    st.session_state.selected_category = None

if "analysis_result" not in st.session_state:
    st.session_state.analysis_result = None


# ============================================================
# CATEGORY DATA
# IMPORTANT: These are DIRECT image URLs.
# ============================================================

CATEGORIES = {
    "Smartphone": {
        "emoji": "📱",
        "description": "Find the right smartphone for your needs.",
        "image": (
            "https://images.unsplash.com/"
            "photo-1511707171634-5f897ff02aa9?"
            "auto=format&fit=crop&w=1200&h=700&q=85"
        ),
    },

    "Laptop": {
        "emoji": "💻",
        "description": "Choose the right laptop for work, study or gaming.",
        "image": (
            "https://images.unsplash.com/"
            "photo-1496181133206-80ce9b88a853?"
            "auto=format&fit=crop&w=1200&h=700&q=85"
        ),
    },

    "TV": {
        "emoji": "📺",
        "description": "Discover the best TV for your entertainment.",
        "image": (
            "https://images.unsplash.com/"
            "photo-1593359677879-a4bb92f829d1?"
            "auto=format&fit=crop&w=1200&h=700&q=85"
        ),
    },

    "Headphones": {
        "emoji": "🎧",
        "description": "Compare headphones for music, gaming and work.",
        "image": (
            "https://images.unsplash.com/"
            "photo-1505740420928-5e560c06d30e?"
            "auto=format&fit=crop&w=1200&h=700&q=85"
        ),
    },

    "Earbuds/Bluetooth": {
        "emoji": "🎵",
        "description": "Find wireless audio that fits your lifestyle.",
        "image": (
            "https://images.unsplash.com/"
            "photo-1606220945770-b5b6c2c55bf1?"
            "auto=format&fit=crop&w=1200&h=700&q=85"
        ),
    },

    "Smartwatch": {
        "emoji": "⌚",
        "description": "Choose a smartwatch based on features and value.",
        "image": (
            "https://images.unsplash.com/"
            "photo-1523275335684-37898b6baf30?"
            "auto=format&fit=crop&w=1200&h=700&q=85"
        ),
    },
}


# ============================================================
# SAFE HELPERS
# ============================================================

def safe_float(value, default=0.0):
    if value is None:
        return float(default)

    if isinstance(value, bool):
        return float(value)

    try:
        return float(value)
    except (TypeError, ValueError):
        return float(default)


def safe_int(value, default=0):
    if value is None:
        return int(default)

    try:
        return int(float(value))
    except (TypeError, ValueError):
        return int(default)


def safe_text(value, default="Unknown"):
    if value is None:
        return default

    text = str(value).strip()

    if not text:
        return default

    return text


def safe_dict(value):
    if isinstance(value, dict):
        return value

    return {}


def safe_list(value):
    if isinstance(value, list):
        return value

    return []


def get_score(result, key, default=0):
    try:
        if not isinstance(result, dict):
            return float(default)

        value = result.get(key, default)

        if value is None:
            return float(default)

        if isinstance(value, dict):
            value = value.get("score", default)

        if value is None:
            return float(default)

        return float(value)

    except (TypeError, ValueError, AttributeError):
        return float(default)


# ============================================================
# CUSTOM CSS
# ============================================================

st.markdown(
    """
    <style>

    /* ======================================================
       GLOBAL
       ====================================================== */

    .stApp {
        background:
            radial-gradient(
                circle at 10% 10%,
                rgba(255, 0, 55, 0.10),
                transparent 30%
            ),
            radial-gradient(
                circle at 90% 20%,
                rgba(150, 0, 30, 0.12),
                transparent 35%
            ),
            #050505;

        color: white;
    }

    [data-testid="stHeader"] {
        background: transparent;
    }

    .main .block-container {
        max-width: 1250px;
        padding-top: 35px;
        padding-bottom: 50px;
    }


    /* ======================================================
       SIDEBAR
       ====================================================== */

    section[data-testid="stSidebar"] {
        background: #090909;
        border-right: 1px solid #252525;
    }

    section[data-testid="stSidebar"] * {
        color: white;
    }


    /* ======================================================
       TEXT
       ====================================================== */

    h1,
    h2,
    h3,
    h4 {
        color: white !important;
    }

    p {
        color: #bdbdbd;
    }


    /* ======================================================
       BUTTONS
       ====================================================== */

    .stButton > button {
        width: 100%;
        border-radius: 14px;

        border: 1px solid #ff1744;

        background:
            linear-gradient(
                90deg,
                #ff1744,
                #e00035
            );

        color: white;

        font-weight: 700;

        padding: 13px 18px;

        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    .stButton > button:hover {
        transform: translateY(-2px);

        box-shadow:
            0 8px 28px rgba(255, 23, 68, 0.35);

        border-color: #ff3158;
    }


    /* ======================================================
       CATEGORY IMAGES
       ====================================================== */

    [data-testid="stImage"] img {
        width: 100% !important;
        height: 250px !important;
        object-fit: cover !important;

        border-radius: 20px;

        border: 1px solid #292929;

        box-shadow:
            0 12px 35px rgba(0, 0, 0, 0.45);
    }


    /* ======================================================
       HERO
       ====================================================== */

    .hero-card {
        background:
            linear-gradient(
                135deg,
                #111111 0%,
                #1b060b 50%,
                #080808 100%
            );

        border: 1px solid #2b2b2b;
        border-radius: 28px;

        padding: 45px 30px;

        text-align: center;

        box-shadow:
            0 0 60px rgba(255, 0, 60, 0.08);

        animation: fadeUp 0.7s ease-out;
    }


    /* ======================================================
       CATEGORY TITLE
       ====================================================== */

    .category-title {
        text-align: center;

        font-size: 22px;

        font-weight: 800;

        color: white;

        margin-top: 10px;
    }


    .category-description {
        text-align: center;

        color: #858585;

        min-height: 42px;

        margin-top: 5px;

        margin-bottom: 10px;
    }


    /* ======================================================
       RESULT CARD
       ====================================================== */

    .result-card {
        background:
            linear-gradient(
                135deg,
                #111111,
                #19070c
            );

        border: 1px solid #ff1744;

        border-radius: 24px;

        padding: 30px;

        margin-top: 20px;

        box-shadow:
            0 0 35px rgba(255, 23, 68, 0.08);

        animation: fadeUp 0.6s ease-out;
    }


    /* ======================================================
       REQUIREMENTS BOX
       ====================================================== */

    .requirements-box {
        background: #eeeeee;
        border: 1px solid #cccccc;
        border-radius: 16px;
        padding: 18px;
        margin-top: 8px;
        margin-bottom: 15px;
        color: #111111 !important;
    }

    .requirements-box * {
        color: #111111 !important;
    }

    /* Requirements input text */
    div[data-testid="stTextArea"] textarea {
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
    }


    /* ======================================================
       FOOTER
       ====================================================== */

    .footer-text {
        text-align: center;

        color: #666666;

        padding-top: 45px;

        font-size: 13px;
    }


    /* ======================================================
       ANIMATION
       ====================================================== */

    @keyframes fadeUp {

        from {
            opacity: 0;
            transform: translateY(18px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }

    }

    </style>
    """,
    unsafe_allow_html=True,
)


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:

    st.markdown("## 🧠 BuyWise AI")

    st.caption(
        "Your intelligent purchase decision assistant."
    )

    st.divider()

    if st.session_state.selected_category is not None:

        st.markdown("### Current Analysis")

        current_category = (
            st.session_state.selected_category
        )

        st.write(
            f"{CATEGORIES[current_category]['emoji']} "
            f"**{current_category}**"
        )

        if st.button(
            "← Back to Categories",
            key="sidebar_back",
            use_container_width=True,
        ):

            st.session_state.selected_category = None
            st.session_state.analysis_result = None

            st.rerun()

    else:

        st.markdown("### How it works")

        st.write("1. Choose a category")
        st.write("2. Set your budget")
        st.write("3. Tell BuyWise AI what matters")
        st.write("4. Analyze products")
        st.write("5. Get a purchase decision")

    st.divider()

    st.caption(
        "AI Growth & Agentic Commerce • Razorpay Track 01"
    )


# ============================================================
# HOME PAGE
# ============================================================

def show_home_page():

    # --------------------------------------------------------
    # HERO
    # --------------------------------------------------------

    st.markdown(
        '<div class="hero-card">',
        unsafe_allow_html=True,
    )

    st.markdown(
        "## 🧠",
    )

    st.markdown(
        "# BuyWise AI",
    )

    st.markdown(
        "### Make smarter purchases, not cheaper ones."
    )

    st.write(
        "An AI-powered commerce decision agent that evaluates "
        "product fit, feature quality, price-to-value, seller "
        "trust, warranty, reviews, price history, timing and "
        "purchase risk."
    )

    st.markdown(
        "</div>",
        unsafe_allow_html=True,
    )

    st.markdown("")

    # --------------------------------------------------------
    # SECTION TITLE
    # --------------------------------------------------------

    st.markdown(
        "## What are you looking for?"
    )

    categories = list(CATEGORIES.items())

    # ========================================================
    # FIRST ROW
    # ========================================================

    row1 = st.columns(3, gap="large")

    for index in range(3):

        name, data = categories[index]

        with row1[index]:

            # REAL IMAGE
            st.image(
                data["image"],
                use_container_width=True,
            )

            st.markdown(
                f"### {data['emoji']} {name}"
            )

            st.caption(
                data["description"]
            )

            if st.button(
                f"Choose {name}",
                key=f"home_choose_{index}",
                use_container_width=True,
            ):

                st.session_state.selected_category = name
                st.session_state.analysis_result = None

                st.rerun()

    st.write("")

    # ========================================================
    # SECOND ROW
    # ========================================================

    row2 = st.columns(3, gap="large")

    for index in range(3, 6):

        name, data = categories[index]

        with row2[index - 3]:

            # REAL IMAGE
            st.image(
                data["image"],
                use_container_width=True,
            )

            st.markdown(
                f"### {data['emoji']} {name}"
            )

            st.caption(
                data["description"]
            )

            if st.button(
                f"Choose {name}",
                key=f"home_choose_{index}",
                use_container_width=True,
            ):

                st.session_state.selected_category = name
                st.session_state.analysis_result = None

                st.rerun()

    st.markdown(
        '<div class="footer-text">'
        'BuyWise AI • AI Growth & Agentic Commerce • Razorpay Track 01'
        '</div>',
        unsafe_allow_html=True,
    )


# ============================================================
# CATEGORY PAGE
# ============================================================

def show_category_page(category):

    info = CATEGORIES[category]

    # --------------------------------------------------------
    # BACK BUTTON
    # --------------------------------------------------------

    if st.button(
        "← Back to Categories",
        key="category_back",
    ):

        st.session_state.selected_category = None
        st.session_state.analysis_result = None

        st.rerun()

    # --------------------------------------------------------
    # CATEGORY HEADER
    # --------------------------------------------------------

    st.markdown(
        f"## {info['emoji']} {category}"
    )

    st.caption(
        "Tell BuyWise AI what you are looking for."
    )

    # --------------------------------------------------------
    # CATEGORY IMAGE
    # --------------------------------------------------------

    st.image(
        info["image"],
        use_container_width=True,
    )

    # --------------------------------------------------------
    # BUDGET
    # --------------------------------------------------------

    st.markdown("## 💰 Maximum Budget")

    if category == "Smartphone":

        minimum_budget = 20000
        default_budget = 25000

    elif category == "Laptop":

        minimum_budget = 60000
        default_budget = 70000

    elif category == "TV":

        minimum_budget = 60000
        default_budget = 70000

    elif category in [
        "Headphones",
        "Earbuds/Bluetooth",
        "Smartwatch",
    ]:

        minimum_budget = 15000
        default_budget = 20000

    else:

        minimum_budget = 1000
        default_budget = 20000

    budget = st.number_input(
        "Maximum budget",
        min_value=minimum_budget,
        max_value=500000,
        value=default_budget,
        step=1000,
        key=f"budget_{category}",
    )

    # --------------------------------------------------------
    # USAGE
    # --------------------------------------------------------

    st.markdown("## 🎯 What will you use it for?")

    usage_options = [
        "General",
        "Gaming",
        "Work",
        "Study",
        "Photography",
        "Entertainment",
        "Music",
    ]

    usage = st.selectbox(
        "Primary usage",
        usage_options,
        key=f"usage_{category}",
    )

    # --------------------------------------------------------
    # REQUIREMENTS
    # --------------------------------------------------------

    st.markdown("## 📝 Additional Requirements")

    requirements = st.text_area(
        "Tell BuyWise AI what matters to you",
        placeholder=(
            "Example:\n"
            "8GB RAM, good processor, good battery, 5G\n\n"
            "You can also leave this empty."
        ),
        height=130,
        key=f"requirements_{category}",
    )

    # Small explanation
    st.caption(
        "Your requirements help BuyWise AI prioritize the features "
        "that matter most to you."
    )

    st.write("")

    # --------------------------------------------------------
    # ANALYZE BUTTON
    # --------------------------------------------------------

    if st.button(
        "🚀 Analyze My Best Purchase",
        key=f"analyze_{category}",
        use_container_width=True,
    ):

        if not AGENT_AVAILABLE:

            st.error(
                "The AI agent could not be loaded."
            )

            st.error(
                IMPORT_ERROR
            )

            st.stop()

        final_requirements = (
            requirements.strip()
            if requirements.strip()
            else "No additional requirements"
        )

        # ----------------------------------------------------
        # ANALYSIS ANIMATION
        # ----------------------------------------------------

        st.markdown(
            "### 🧠 BuyWise AI is analyzing..."
        )

        status = st.empty()

        progress = st.progress(0)

        steps = [
            (
                "🔍 Understanding your requirements...",
                12,
            ),
            (
                "📦 Comparing available products...",
                25,
            ),
            (
                "⚙️ Evaluating feature quality...",
                38,
            ),
            (
                "💰 Checking price-to-value...",
                48,
            ),
            (
                "🏪 Verifying seller and listing...",
                60,
            ),
            (
                "🛡️ Checking warranty information...",
                70,
            ),
            (
                "⭐ Analyzing customer reviews...",
                80,
            ),
            (
                "📉 Checking price history...",
                90,
            ),
            (
                "⚠️ Calculating purchase risk...",
                95,
            ),
            (
                "🧠 Preparing final recommendation...",
                100,
            ),
        ]

        for message, percentage in steps:

            status.info(message)

            progress.progress(
                percentage
            )

            time.sleep(0.20)

        # ----------------------------------------------------
        # RUN BACKEND
        # ----------------------------------------------------

        try:

            result = run_agent(
                category.lower(),
                float(budget),
                usage.lower(),
                final_requirements,
            )

        except Exception as error:

            status.empty()
            progress.empty()

            st.error(
                "Something went wrong while analyzing the purchase."
            )

            st.exception(
                error
            )

            st.stop()

        status.empty()
        progress.empty()

        # ----------------------------------------------------
        # SAVE RESULT
        # ----------------------------------------------------

        st.session_state.analysis_result = result

        # ----------------------------------------------------
        # DISPLAY RESULT
        # ----------------------------------------------------

        show_results(
            result=result,
            category=category,
            budget=budget,
            usage=usage,
            requirements=final_requirements,
        )


# ============================================================
# RESULTS
# ============================================================

def show_results(
    result,
    category,
    budget,
    usage,
    requirements,
):

    # --------------------------------------------------------
    # VALIDATE
    # --------------------------------------------------------

    if not isinstance(result, dict):

        st.error(
            "BuyWise AI returned an invalid analysis result."
        )

        st.write(result)

        return

    # --------------------------------------------------------
    # PRODUCT
    # --------------------------------------------------------

    product = safe_dict(
        result.get("product")
    )

    brand = safe_text(
        product.get("brand"),
        "",
    )

    model = safe_text(
        product.get("model"),
        "Recommended Product",
    )

    if brand:

        product_name = f"{brand} {model}"

    else:

        product_name = model

    price = product.get(
        "price_inr",
        product.get(
            "price",
            result.get(
                "price",
                0,
            ),
        ),
    )

    price = safe_float(
        price,
        0,
    )

    # --------------------------------------------------------
    # CONFIDENCE
    # --------------------------------------------------------

    confidence = result.get(
        "purchase_confidence",
        result.get(
            "confidence",
            result.get(
                "purchase_score",
                0,
            ),
        ),
    )

    confidence = safe_float(
        confidence,
        0,
    )

    confidence = max(
        0,
        min(
            100,
            confidence,
        ),
    )

    # --------------------------------------------------------
    # RECOMMENDATION
    # --------------------------------------------------------

    recommendation = safe_text(
        result.get(
            "recommendation",
            "UNAVAILABLE",
        ),
        "UNAVAILABLE",
    )

    # --------------------------------------------------------
    # MAIN RESULT
    # --------------------------------------------------------

    st.markdown("---")

    st.markdown(
        "## 🧠 BuyWise AI Recommendation"
    )

    if recommendation == "EXCELLENT BUY":

        st.success(
            "🟢 EXCELLENT BUY"
        )

    elif recommendation == "GOOD BUY":

        st.success(
            "🟢 GOOD BUY"
        )

    elif recommendation == "CONSIDER":

        st.warning(
            "🟡 CONSIDER"
        )

    elif recommendation == "BUY WITH CAUTION":

        st.warning(
            "🟠 BUY WITH CAUTION"
        )

    elif recommendation == "DO NOT RECOMMEND":

        st.error(
            "🔴 DO NOT RECOMMEND"
        )

    else:

        st.info(
            recommendation
        )

    # --------------------------------------------------------
    # PRODUCT CARD
    # --------------------------------------------------------

    st.markdown(
        '<div class="result-card">',
        unsafe_allow_html=True,
    )

    st.markdown(
        "### 🏆 Recommended Product"
    )

    st.markdown(
        f"## {product_name}"
    )

    st.markdown(
        f"### ₹{price:,.0f}"
    )

    st.write(
        f"Your budget: ₹{safe_float(budget):,.0f}"
    )

    st.write(
        f"Primary usage: {usage}"
    )

    st.markdown(
        "</div>",
        unsafe_allow_html=True,
    )

    # --------------------------------------------------------
    # REQUIREMENTS
    # IMPORTANT: BLACK TEXT
    # --------------------------------------------------------

    st.markdown(
        "### 📝 Your Requirements"
    )

    st.markdown(
        f"""
        <div class="requirements-box">
            {requirements}
        </div>
        """,
        unsafe_allow_html=True,
    )

    # --------------------------------------------------------
    # CONFIDENCE
    # --------------------------------------------------------

    st.markdown(
        "## 🎯 Purchase Confidence"
    )

    confidence_placeholder = st.empty()

    confidence_int = int(
        round(confidence)
    )

    for value in range(
        0,
        confidence_int + 1,
        5,
    ):

        display_value = min(
            value,
            confidence_int,
        )

        confidence_placeholder.metric(
            "AI Confidence",
            f"{display_value}/100",
        )

        time.sleep(0.02)

    # --------------------------------------------------------
    # DECISION SCORES
    # --------------------------------------------------------

    st.markdown(
        "## 📊 Decision Breakdown"
    )

    product_fit = get_score(
        result,
        "product_fit",
        0,
    )

    price_spec = get_score(
        result,
        "price_to_spec",
        result.get(
            "price_spec_score",
            0,
        ),
    )

    if price_spec == 0:

        nested_price_spec = result.get(
            "price_to_spec",
            {},
        )

        if isinstance(
            nested_price_spec,
            dict,
        ):

            price_spec = safe_float(
                nested_price_spec.get(
                    "score",
                    0,
                ),
                0,
            )

    risk = safe_dict(
        result.get(
            "risk",
            {},
        )
    )

    risk_score = safe_float(
        risk.get(
            "score",
            risk.get(
                "overall_risk",
                0,
            ),
        ),
        0,
    )

    risk_level = safe_text(
        risk.get(
            "level",
            risk.get(
                "risk_level",
                "Unknown",
            ),
        ),
        "Unknown",
    )

    score1, score2, score3 = st.columns(3)

    with score1:

        st.metric(
            "Product Fit",
            f"{safe_float(product_fit):.1f}/100",
        )

    with score2:

        st.metric(
            "Feature / Price Value",
            f"{safe_float(price_spec):.1f}/100",
        )

    with score3:

        st.metric(
            "Purchase Risk",
            f"{safe_float(risk_score):.1f}/100",
        )

    # --------------------------------------------------------
    # TRUST
    # --------------------------------------------------------

    st.markdown(
        "## 🛡️ Trust & Verification"
    )

    listing = result.get(
        "listing",
        product.get(
            "listing",
            {},
        ),
    )

    listing = safe_dict(
        listing
    )

    seller = safe_text(
        listing.get(
            "seller",
            "Unknown",
        )
    )

    marketplace = safe_text(
        listing.get(
            "marketplace",
            "Unknown",
        )
    )

    condition = safe_text(
        listing.get(
            "condition",
            "Unknown",
        )
    )

    verified = listing.get(
        "verified",
        False,
    )

    trust1, trust2, trust3, trust4 = st.columns(4)

    with trust1:

        st.metric(
            "Seller",
            seller,
        )

    with trust2:

        st.metric(
            "Marketplace",
            marketplace,
        )

    with trust3:

        st.metric(
            "Condition",
            condition,
        )

    with trust4:

        st.metric(
            "Listing",
            "Verified"
            if verified
            else "Unverified",
        )

    # --------------------------------------------------------
    # WARRANTY
    # --------------------------------------------------------

    st.markdown(
        "## 🛡️ Warranty"
    )

    warranty = result.get(
        "warranty",
        product.get(
            "warranty",
            {},
        ),
    )

    warranty = safe_dict(
        warranty
    )

    warranty_status = safe_text(
        warranty.get(
            "status",
            "Unable to verify",
        ),
        "Unable to verify",
    )

    warranty_type = safe_text(
        warranty.get(
            "type",
            "Unknown",
        ),
        "Unknown",
    )

    st.info(
        f"{warranty_status} • {warranty_type}"
    )

    # --------------------------------------------------------
    # REVIEWS
    # --------------------------------------------------------

    st.markdown(
        "## ⭐ Review Intelligence"
    )

    reviews = result.get(
        "reviews",
        product.get(
            "reviews",
            {},
        ),
    )

    reviews = safe_dict(
        reviews
    )

    average_rating = reviews.get(
        "average_rating",
        "N/A",
    )

    review_count = safe_int(
        reviews.get(
            "review_count",
            0,
        ),
        0,
    )

    positive = safe_float(
        reviews.get(
            "positive",
            0,
        ),
        0,
    )

    review1, review2, review3 = st.columns(3)

    with review1:

        st.metric(
            "Rating",
            safe_text(
                average_rating,
                "N/A",
            ),
        )

    with review2:

        st.metric(
            "Reviews",
            f"{review_count:,}",
        )

    with review3:

        st.metric(
            "Positive",
            f"{positive:.0f}%",
        )

    complaints = safe_list(
        reviews.get(
            "complaints",
            [],
        )
    )

    if complaints:

        with st.expander(
            "⚠️ Recurring Review Concerns"
        ):

            for complaint in complaints:

                st.write(
                    f"• {complaint}"
                )

    # --------------------------------------------------------
    # PRICE INTELLIGENCE
    # --------------------------------------------------------

    st.markdown(
        "## 📉 Price Intelligence"
    )

    price_history = result.get(
        "price_history",
        product.get(
            "price_history",
            {},
        ),
    )

    price_history = safe_dict(
        price_history
    )

    current_price = safe_float(
        price_history.get(
            "current_price",
            price,
        ),
        price,
    )

    historical_low = safe_float(
        price_history.get(
            "historical_low",
            price,
        ),
        price,
    )

    price_status = safe_text(
        price_history.get(
            "price_status",
            "Unknown",
        ),
        "Unknown",
    )

    price1, price2, price3 = st.columns(3)

    with price1:

        st.metric(
            "Current",
            f"₹{current_price:,.0f}",
        )

    with price2:

        st.metric(
            "Historical Low",
            f"₹{historical_low:,.0f}",
        )

    with price3:

        st.metric(
            "Price Status",
            price_status,
        )

    # --------------------------------------------------------
    # SALE TIMING
    # --------------------------------------------------------

    st.markdown(
        "## 🗓️ Sale Timing"
    )

    sale_timing = result.get(
        "sale_timing",
        product.get(
            "sale_timing",
            {},
        ),
    )

    sale_timing = safe_dict(
        sale_timing
    )

    sale_event = safe_text(
        sale_timing.get(
            "upcoming_event",
            "No event information",
        ),
        "No event information",
    )

    days_until = sale_timing.get(
        "days_until",
        "N/A",
    )

    st.info(
        f"📅 {sale_event} • {days_until} days"
    )

    # --------------------------------------------------------
    # RISK
    # --------------------------------------------------------

    st.markdown(
        "## ⚠️ Purchase Risk"
    )

    normalized_risk = str(
        risk_level
    ).upper()

    if normalized_risk == "LOW":

        st.success(
            f"🟢 LOW RISK — {risk_score:.1f}/100"
        )

    elif normalized_risk == "MEDIUM":

        st.warning(
            f"🟡 MEDIUM RISK — {risk_score:.1f}/100"
        )

    elif normalized_risk == "HIGH":

        st.error(
            f"🔴 HIGH RISK — {risk_score:.1f}/100"
        )

    else:

        st.info(
            f"Risk: {risk_level} — "
            f"{risk_score:.1f}/100"
        )

    # --------------------------------------------------------
    # WHY THIS PRODUCT?
    # --------------------------------------------------------

    st.markdown(
        "## 💡 Why This Product?"
    )

    reason = safe_text(
        result.get(
            "reason",
            result.get(
                "explanation",
                "No additional explanation available.",
            ),
        ),
        "No additional explanation available.",
    )

    st.info(
        reason
    )

    # --------------------------------------------------------
    # ALTERNATIVES
    # --------------------------------------------------------

    alternatives = safe_list(
        result.get(
            "alternatives",
            [],
        )
    )

    if alternatives:

        st.markdown(
            "## 🔎 Other Options"
        )

        for index, alternative in enumerate(
            alternatives
        ):

            if isinstance(
                alternative,
                dict,
            ):

                alt_name = safe_text(
                    alternative.get(
                        "name",
                        alternative.get(
                            "model",
                            "Alternative",
                        ),
                    ),
                    "Alternative",
                )

                alt_price = safe_float(
                    alternative.get(
                        "price",
                        alternative.get(
                            "price_inr",
                            0,
                        ),
                    ),
                    0,
                )

                alt_score = safe_float(
                    alternative.get(
                        "purchase_confidence",
                        alternative.get(
                            "score",
                            0,
                        ),
                    ),
                    0,
                )

                st.write(
                    f"**{index + 1}. {alt_name}** "
                    f"— ₹{alt_price:,.0f} "
                    f"— Score: {alt_score:.1f}/100"
                )

            else:

                st.write(
                    f"**{index + 1}. {alternative}**"
                )

    # --------------------------------------------------------
    # EVIDENCE
    # --------------------------------------------------------

    evidence = safe_list(
        result.get(
            "evidence",
            [],
        )
    )

    if evidence:

        st.markdown(
            "## 📚 Evidence"
        )

        for item in evidence:

            if isinstance(
                item,
                dict,
            ):

                source = safe_text(
                    item.get(
                        "source",
                        "Unknown source",
                    ),
                    "Unknown source",
                )

                claim = safe_text(
                    item.get(
                        "claim",
                        "",
                    ),
                    "",
                )

                st.write(
                    f"**{source}** — {claim}"
                )

            else:

                st.write(
                    f"• {item}"
                )

    # --------------------------------------------------------
    # COMPLETE DATA
    # --------------------------------------------------------

    with st.expander(
        "🧾 View Complete Decision Data"
    ):

        st.json(
            result
        )

    # --------------------------------------------------------
    # FOOTER
    # --------------------------------------------------------

    st.markdown(
        '<div class="footer-text">'
        'BuyWise AI • Make smarter purchases, not cheaper ones.'
        '</div>',
        unsafe_allow_html=True,
    )


# ============================================================
# MAIN APP
# ============================================================

if st.session_state.selected_category is None:

    show_home_page()

else:

    show_category_page(
        st.session_state.selected_category
    )