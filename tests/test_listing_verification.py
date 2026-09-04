from app.verification.listing_verification import (
    Listing,
    verify_listing,
    print_verification_report
)


listing = Listing(
    listing_id="LIST-001",
    product_id="PHONE-001",

    marketplace="Amazon",
    seller="Example Verified Seller",

    price_inr=19999,
    condition="new",

    seller_verified=True,
    seller_rating=4.6,

    warranty_claim="Manufacturer warranty",
    warranty_verified=True,

    return_policy_available=True,

    listing_reference="LISTING-REFERENCE-001",

    evidence=[
        "Seller verification evidence",
        "Warranty evidence",
        "Product condition evidence",
        "Listing reference"
    ]
)


result = verify_listing(listing)

print_verification_report(result)