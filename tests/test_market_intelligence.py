from app.intelligence.market_intelligence import (
    ReviewData,
    PricePoint,
    SaleEvent,
    analyze_market,
    print_market_report
)


reviews = ReviewData(
    average_rating=4.4,
    review_count=3500,

    positive_topics=[
        "Good performance",
        "Good display",
        "Strong battery"
    ],

    negative_topics=[
        "Some users report heating"
    ],

    recurring_complaints=[
        "Heating during heavy gaming"
    ],

    sentiment_score=82,
    review_confidence=90
)


price_history = [
    PricePoint(
        "2026-07-01",
        19999,
        "Marketplace"
    ),

    PricePoint(
        "2026-07-15",
        18999,
        "Marketplace"
    ),

    PricePoint(
        "2026-08-01",
        17999,
        "Marketplace"
    ),

    PricePoint(
        "2026-08-15",
        18499,
        "Marketplace"
    ),

    PricePoint(
        "2026-09-01",
        17999,
        "Marketplace"
    )
]


sale_events = [

    SaleEvent(
        name="Upcoming Festival Sale",
        event_date="2026-09-20",

        historically_relevant=True,
        historical_discount_percent=12,

        source="Verified event source"
    ),

    SaleEvent(
        name="Diwali Sale",
        event_date="2026-10-20",

        historically_relevant=True,
        historical_discount_percent=18,

        source="Verified event source"
    )
]


result = analyze_market(
    current_price=17999,

    reviews=reviews,

    price_history=price_history,

    today="2026-09-02",

    sale_events=sale_events
)


print_market_report(result)