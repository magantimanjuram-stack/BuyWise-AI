from dataclasses import dataclass, field
from typing import List, Optional
from datetime import date


# ============================================================
# REVIEW INTELLIGENCE
# ============================================================

@dataclass
class ReviewData:
    average_rating: float
    review_count: int

    positive_topics: List[str] = field(default_factory=list)
    negative_topics: List[str] = field(default_factory=list)
    recurring_complaints: List[str] = field(default_factory=list)

    sentiment_score: float = 0.0
    review_confidence: float = 0.0


@dataclass
class ReviewAnalysis:
    quality_score: float
    confidence: float

    strengths: List[str]
    weaknesses: List[str]
    recurring_complaints: List[str]


def analyze_reviews(reviews: ReviewData) -> ReviewAnalysis:

    # Rating component
    rating_score = min(
        100,
        (reviews.average_rating / 5) * 100
    )

    # Review volume confidence
    if reviews.review_count >= 10000:
        volume_score = 100
    elif reviews.review_count >= 5000:
        volume_score = 90
    elif reviews.review_count >= 1000:
        volume_score = 80
    elif reviews.review_count >= 500:
        volume_score = 70
    elif reviews.review_count >= 100:
        volume_score = 55
    else:
        volume_score = 30

    # Sentiment
    sentiment_score = max(
        0,
        min(100, reviews.sentiment_score)
    )

    # Final review quality
    quality_score = (
        rating_score * 0.45
        + volume_score * 0.25
        + sentiment_score * 0.30
    )

    quality_score = round(quality_score, 2)

    confidence = max(
        reviews.review_confidence,
        volume_score
    )

    return ReviewAnalysis(
        quality_score=quality_score,
        confidence=round(confidence, 2),
        strengths=reviews.positive_topics,
        weaknesses=reviews.negative_topics,
        recurring_complaints=reviews.recurring_complaints
    )


# ============================================================
# PRICE HISTORY
# ============================================================

@dataclass
class PricePoint:
    checked_date: str
    price_inr: float
    source: str


@dataclass
class PriceHistoryAnalysis:
    current_price: float
    historical_low: float
    historical_high: float
    historical_average: float

    price_position_score: float
    potential_saving: float

    status: str


def analyze_price_history(
    current_price: float,
    history: List[PricePoint]
) -> PriceHistoryAnalysis:

    if not history:
        return PriceHistoryAnalysis(
            current_price=current_price,
            historical_low=current_price,
            historical_high=current_price,
            historical_average=current_price,
            price_position_score=50,
            potential_saving=0,
            status="INSUFFICIENT DATA"
        )

    prices = [point.price_inr for point in history]

    historical_low = min(prices)
    historical_high = max(prices)
    historical_average = sum(prices) / len(prices)

    # How close is the current price to the historical low?
    if historical_high == historical_low:

        position = 100

    else:

        position = (
            (historical_high - current_price)
            / (historical_high - historical_low)
        ) * 100

    position = max(0, min(100, position))

    potential_saving = max(
        0,
        current_price - historical_low
    )

    if current_price <= historical_low * 1.03:

        status = "NEAR HISTORICAL LOW"

    elif current_price <= historical_average:

        status = "GOOD PRICE"

    elif current_price <= historical_high * 0.90:

        status = "ABOVE AVERAGE"

    else:

        status = "HIGH PRICE"

    return PriceHistoryAnalysis(
        current_price=round(current_price, 2),
        historical_low=round(historical_low, 2),
        historical_high=round(historical_high, 2),
        historical_average=round(historical_average, 2),

        price_position_score=round(position, 2),

        potential_saving=round(potential_saving, 2),

        status=status
    )


# ============================================================
# UPCOMING SALE / FESTIVAL INTELLIGENCE
# ============================================================

@dataclass
class SaleEvent:
    name: str
    event_date: str

    historically_relevant: bool = False
    historical_discount_percent: float = 0.0

    source: Optional[str] = None


@dataclass
class TimingAnalysis:
    current_price: float

    upcoming_event: Optional[str]
    days_until_event: Optional[int]

    historical_discount_percent: float

    opportunity_score: float

    recommendation: str
    confidence: float


def analyze_timing(
    current_price: float,
    today: str,
    events: List[SaleEvent]
) -> TimingAnalysis:

    today_date = date.fromisoformat(today)

    future_events = []

    for event in events:

        event_date = date.fromisoformat(
            event.event_date
        )

        if event_date >= today_date:

            future_events.append(
                (event, event_date)
            )

    # No upcoming event
    if not future_events:

        return TimingAnalysis(
            current_price=current_price,

            upcoming_event=None,
            days_until_event=None,

            historical_discount_percent=0,

            opportunity_score=70,

            recommendation="BUY BASED ON CURRENT PRICE",

            confidence=40
        )

    # Nearest future event
    future_events.sort(
        key=lambda x: x[1]
    )

    event, event_date = future_events[0]

    days_until = (
        event_date - today_date
    ).days

    discount = max(
        0,
        event.historical_discount_percent
    )

    # Opportunity score
    opportunity_score = 50

    if event.historically_relevant:

        opportunity_score += 20

    if discount >= 20:

        opportunity_score += 20

    elif discount >= 10:

        opportunity_score += 10

    if days_until <= 7:

        opportunity_score += 5

    elif days_until <= 30:

        opportunity_score += 10

    opportunity_score = min(
        100,
        opportunity_score
    )

    # Recommendation
    if days_until <= 7 and discount >= 10:

        recommendation = (
            "WAIT FOR UPCOMING SALE"
        )

    elif days_until <= 30 and discount >= 15:

        recommendation = (
            "CONSIDER WAITING"
        )

    else:

        recommendation = (
            "BUY NOW IF PRODUCT FITS"
        )

    confidence = 50

    if event.source:
        confidence += 20

    if event.historically_relevant:
        confidence += 20

    if discount > 0:
        confidence += 10

    confidence = min(100, confidence)

    return TimingAnalysis(
        current_price=current_price,

        upcoming_event=event.name,
        days_until_event=days_until,

        historical_discount_percent=discount,

        opportunity_score=opportunity_score,

        recommendation=recommendation,

        confidence=confidence
    )


# ============================================================
# COMPLETE MARKET INTELLIGENCE
# ============================================================

@dataclass
class MarketIntelligence:
    review: ReviewAnalysis
    price: PriceHistoryAnalysis
    timing: TimingAnalysis


def analyze_market(
    current_price: float,
    reviews: ReviewData,
    price_history: List[PricePoint],
    today: str,
    sale_events: List[SaleEvent]
) -> MarketIntelligence:

    review_analysis = analyze_reviews(
        reviews
    )

    price_analysis = analyze_price_history(
        current_price,
        price_history
    )

    timing_analysis = analyze_timing(
        current_price,
        today,
        sale_events
    )

    return MarketIntelligence(
        review=review_analysis,
        price=price_analysis,
        timing=timing_analysis
    )


# ============================================================
# HUMAN-READABLE REPORT
# ============================================================

def print_market_report(
    result: MarketIntelligence
):

    print("\n===== MARKET INTELLIGENCE =====")

    print("\n--- REVIEW INTELLIGENCE ---")

    print(
        f"Review Quality: "
        f"{result.review.quality_score}"
    )

    print(
        f"Review Confidence: "
        f"{result.review.confidence}"
    )

    if result.review.strengths:

        print("Strengths:")

        for item in result.review.strengths:

            print(f"  + {item}")

    if result.review.weaknesses:

        print("Weaknesses:")

        for item in result.review.weaknesses:

            print(f"  - {item}")

    if result.review.recurring_complaints:

        print("Recurring Complaints:")

        for item in result.review.recurring_complaints:

            print(f"  ! {item}")

    print("\n--- PRICE HISTORY ---")

    print(
        f"Current Price: "
        f"₹{result.price.current_price}"
    )

    print(
        f"Historical Low: "
        f"₹{result.price.historical_low}"
    )

    print(
        f"Historical High: "
        f"₹{result.price.historical_high}"
    )

    print(
        f"Historical Average: "
        f"₹{result.price.historical_average}"
    )

    print(
        f"Price Position Score: "
        f"{result.price.price_position_score}"
    )

    print(
        f"Potential Difference From Low: "
        f"₹{result.price.potential_saving}"
    )

    print(
        f"Price Status: "
        f"{result.price.status}"
    )

    print("\n--- SALE INTELLIGENCE ---")

    print(
        f"Upcoming Event: "
        f"{result.timing.upcoming_event}"
    )

    print(
        f"Days Until Event: "
        f"{result.timing.days_until_event}"
    )

    print(
        f"Historical Discount: "
        f"{result.timing.historical_discount_percent}%"
    )

    print(
        f"Opportunity Score: "
        f"{result.timing.opportunity_score}"
    )

    print(
        f"Recommendation: "
        f"{result.timing.recommendation}"
    )

    print(
        f"Timing Confidence: "
        f"{result.timing.confidence}"
    )