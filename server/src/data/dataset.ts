import { ProductRecord } from '../types/index.js';

export const PRODUCT_DATASET: ProductRecord[] = [
  // ==========================================
  // 1. SMARTPHONE CATEGORY
  // ==========================================
  {
    id: 'phone-1',
    category: 'smartphone',
    brand: 'Apple',
    name: 'Apple iPhone 15 (128GB) - Black',
    price: 71900,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'A16 Bionic (6-core)',
      cpu: 'Apple A16 Bionic',
      gpu: 'Apple 5-core GPU',
      ramGB: 6,
      storageGB: 128,
      displaySizeInches: 6.1,
      resolution: '2556 x 1179 OLED Super Retina XDR',
      refreshRateHz: 60,
      batteryCapacitymAh: 3349,
      batteryHours: 20,
      chargingWatts: 20,
      cameraMP: 48,
      has5G: true,
      hasANC: false,
      hasGPS: true,
      waterResistance: 'IP68 (6m up to 30 mins)',
      weightKg: 0.171,
      os: 'iOS 17',
      buildQuality: 'Aluminum with color-infused glass back'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Appario Retail Private Ltd (Official Apple Authorized)',
      sellerRating: 4.8,
      sellerReviewsCount: 45200,
      listingId: 'B0CHX1W1XY',
      variant: '128GB - Black',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-appario-01',
      name: 'Appario Retail Private Ltd',
      trustRating: 96,
      isOfficialBrandStore: true,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Manufacturer Warranty',
      durationMonths: 12,
      coverage: 'Full hardware defects & battery health support at Apple Authorised Service Providers',
      status: 'Verified',
      evidence: 'Official Apple Brand Warranty registered via serial number'
    },
    reviews: {
      count: 12450,
      rating: 4.6,
      sentiment: 'Strong',
      positiveThemes: ['Exceptional camera quality', 'Dynamic Island', 'Sleek design', 'Reliable battery life'],
      recurringConcerns: ['Standard 60Hz display refresh rate', 'Slow 20W charging speed'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 69900,
      historicalAvg: 73500,
      previousPrice: 74900,
      lowestPriceDate: '2024-05-15'
    },
    saleTiming: {
      upcomingSaleEvent: 'Great Indian Festival Sale',
      daysUntilSale: 14,
      recommendation: 'BUY NOW',
      explanation: 'Current price is within 2.8% of historical low with strong seller verification.'
    },
    evidence: [
      {
        id: 'ev-p1-1',
        claim: 'Official Apple Warranty & Verified Seller',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SELLER'
      },
      {
        id: 'ev-p1-2',
        claim: 'Price history shows historical low at ₹69,900',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'PRICE'
      }
    ]
  },
  {
    id: 'phone-2',
    category: 'smartphone',
    brand: 'Samsung',
    name: 'Samsung Galaxy S24 5G (8GB RAM, 256GB) - Onyx Black',
    price: 74999,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Exynos 2400 (Deca-core 4nm)',
      cpu: 'Exynos 2400',
      gpu: 'Xclipse 940',
      ramGB: 8,
      storageGB: 256,
      displaySizeInches: 6.2,
      resolution: '2340 x 1080 Dynamic AMOLED 2X',
      refreshRateHz: 120,
      batteryCapacitymAh: 4000,
      batteryHours: 18,
      chargingWatts: 25,
      cameraMP: 50,
      has5G: true,
      hasANC: false,
      hasGPS: true,
      waterResistance: 'IP68',
      weightKg: 0.167,
      os: 'One UI 6.1 (Android 14) with Galaxy AI',
      buildQuality: 'Armor Aluminum 2 & Gorilla Glass Victus 2'
    },
    listing: {
      marketplace: 'Flipkart',
      sellerName: 'STPL Retail (Samsung Authorized Partner)',
      sellerRating: 4.7,
      sellerReviewsCount: 31200,
      listingId: 'FLIP-S24-256',
      variant: '8GB RAM / 256GB - Onyx Black',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-stpl-02',
      name: 'STPL Retail',
      trustRating: 93,
      isOfficialBrandStore: true,
      fulfillmentRate: 98,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Samsung India Brand Warranty',
      durationMonths: 12,
      coverage: 'Comprehensive hardware and 7-year OS update guarantee',
      status: 'Verified',
      evidence: 'Samsung Authorized Invoice & E-Warranty'
    },
    reviews: {
      count: 8900,
      rating: 4.5,
      sentiment: 'Strong',
      positiveThemes: ['Galaxy AI features', '120Hz smooth LTPO display', 'Compact ergonomic size'],
      recurringConcerns: ['Heating during intensive 3D gaming', 'Average 25W charging speed'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 71999,
      historicalAvg: 76500,
      previousPrice: 79999
    },
    saleTiming: {
      upcomingSaleEvent: 'Big Billion Days',
      daysUntilSale: 20,
      recommendation: 'BUY NOW',
      explanation: 'Solid price value considering 256GB storage and 7-year update support.'
    },
    evidence: [
      {
        id: 'ev-p2-1',
        claim: '7 Years of Android OS updates confirmed',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      }
    ]
  },
  {
    id: 'phone-3',
    category: 'smartphone',
    brand: 'OnePlus',
    name: 'OnePlus 12R 5G (16GB RAM, 256GB) - Cool Blue',
    price: 39999,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Snapdragon 8 Gen 2 (4nm)',
      cpu: 'Qualcomm Snapdragon 8 Gen 2',
      gpu: 'Adreno 740',
      ramGB: 16,
      storageGB: 256,
      displaySizeInches: 6.78,
      resolution: '2780 x 1264 1.5K LTPO4 AMOLED',
      refreshRateHz: 120,
      batteryCapacitymAh: 5500,
      batteryHours: 24,
      chargingWatts: 100,
      cameraMP: 50,
      has5G: true,
      hasANC: false,
      hasGPS: true,
      waterResistance: 'IP64 splash proof',
      weightKg: 0.207,
      os: 'OxygenOS 14 (Android 14)',
      buildQuality: 'Aluminum frame with Gorilla Glass Victus 2'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'OnePlus Official Direct Store',
      sellerRating: 4.8,
      sellerReviewsCount: 52000,
      listingId: 'B0CS6B7K9L',
      variant: '16GB RAM / 256GB - Cool Blue',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-op-01',
      name: 'OnePlus Official Direct Store',
      trustRating: 98,
      isOfficialBrandStore: true,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Brand Warranty + Lifetime Display Warranty',
      durationMonths: 12,
      coverage: 'Full hardware support & free green line screen replacement guarantee',
      status: 'Verified',
      evidence: 'OnePlus Official India Warranty Card'
    },
    reviews: {
      count: 18400,
      rating: 4.7,
      sentiment: 'Strong',
      positiveThemes: ['Insane 100W SuperVOOC charging speed', '16GB LPDDR5X RAM multitasking', 'Massive 5500mAh battery'],
      recurringConcerns: ['Average ultra-wide camera', 'No wireless charging support'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 38999,
      historicalAvg: 41500,
      previousPrice: 42999
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Exceptional feature-to-price ratio for 16GB RAM flagship level performance under ₹40k.'
    },
    evidence: [
      {
        id: 'ev-p3-1',
        claim: 'Snapdragon 8 Gen 2 & 16GB RAM benchmarking verified',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      }
    ]
  },
  {
    id: 'phone-4',
    category: 'smartphone',
    brand: 'Xiaomi',
    name: 'Redmi Note 13 Pro 5G (8GB RAM, 256GB) - Midnight Black',
    price: 24999,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Snapdragon 7s Gen 2 (4nm)',
      cpu: 'Snapdragon 7s Gen 2',
      gpu: 'Adreno 710',
      ramGB: 8,
      storageGB: 256,
      displaySizeInches: 6.67,
      resolution: '2712 x 1220 1.5K AMOLED',
      refreshRateHz: 120,
      batteryCapacitymAh: 5100,
      batteryHours: 20,
      chargingWatts: 67,
      cameraMP: 200,
      has5G: true,
      hasANC: false,
      hasGPS: true,
      waterResistance: 'IP54',
      weightKg: 0.187,
      os: 'MIUI 14 / HyperOS',
      buildQuality: 'Double-sided glass body'
    },
    listing: {
      marketplace: 'Flipkart',
      sellerName: 'SuperComNet Seller',
      sellerRating: 4.4,
      sellerReviewsCount: 15400,
      listingId: 'REDMI-13P-256',
      variant: '8GB / 256GB - Midnight Black',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-scn-03',
      name: 'SuperComNet Seller',
      trustRating: 87,
      isOfficialBrandStore: false,
      fulfillmentRate: 96,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Manufacturer Warranty',
      durationMonths: 12,
      coverage: 'Standard hardware defects through Xiaomi Service Centers',
      status: 'Verified',
      evidence: 'GST Tax Invoice Verified'
    },
    reviews: {
      count: 9200,
      rating: 4.3,
      sentiment: 'Moderate',
      positiveThemes: ['200MP camera with OIS detail', '1.5K sharp AMOLED screen', '67W fast charger included'],
      recurringConcerns: ['Pre-installed bloatware apps', 'Average low-light video performance'],
      confidence: 'Medium'
    },
    priceHistory: {
      historicalLow: 23999,
      historicalAvg: 25500,
      previousPrice: 25999
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Solid mid-range camera & display choice at ₹24,999 budget point.'
    },
    evidence: []
  },

  // ==========================================
  // 2. LAPTOP CATEGORY
  // ==========================================
  {
    id: 'laptop-1',
    category: 'laptop',
    brand: 'Apple',
    name: 'Apple MacBook Air M3 (16GB Unified Memory, 512GB SSD) - Space Grey',
    price: 124900,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Apple M3 (8-core CPU, 10-core GPU, 16-core Neural Engine)',
      cpu: 'Apple M3 Chip',
      gpu: '10-core Integrated GPU with Hardware Ray Tracing',
      ramGB: 16,
      storageGB: 512,
      displaySizeInches: 13.6,
      resolution: '2560 x 1664 Liquid Retina (500 nits, P3 Wide Color)',
      refreshRateHz: 60,
      batteryCapacitymAh: 52.6,
      batteryHours: 18,
      chargingWatts: 35,
      cameraMP: 2,
      has5G: false,
      hasANC: false,
      hasGPS: false,
      weightKg: 1.24,
      os: 'macOS Sonoma',
      buildQuality: '100% Recycled Aluminum Unibody Enclosure',
      micQuality: 'Three-mic array with directional beamforming'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Appario Retail Private Ltd (Apple Authorized)',
      sellerRating: 4.9,
      sellerReviewsCount: 29800,
      listingId: 'B0CX23F890',
      variant: 'M3 / 16GB / 512GB - Space Grey',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-appario-01',
      name: 'Appario Retail Private Ltd',
      trustRating: 98,
      isOfficialBrandStore: true,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Limited Apple Manufacturer Warranty',
      durationMonths: 12,
      coverage: 'Global AppleCare coverage, Apple Store Genius Bar access',
      status: 'Verified',
      evidence: 'Official Apple Serial Number Check Verified'
    },
    reviews: {
      count: 4200,
      rating: 4.8,
      sentiment: 'Strong',
      positiveThemes: ['Incredible M3 performance for coding & AI tasks', 'Silent fanless design', '18-hour real-world battery', 'Lightweight portable chassis'],
      recurringConcerns: ['Base model price is high', 'Limited to 2 Thunderbolt ports'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 122900,
      historicalAvg: 127900,
      previousPrice: 134900
    },
    saleTiming: {
      upcomingSaleEvent: 'Festival Tech Sale',
      daysUntilSale: 10,
      recommendation: 'BUY NOW',
      explanation: '16GB unified memory ensures long term coding & machine learning software performance.'
    },
    evidence: [
      {
        id: 'ev-l1-1',
        claim: 'M3 16-core Neural Engine validated for local LLMs & AI development',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      },
      {
        id: 'ev-l1-2',
        claim: 'Official Apple Authorised Distributor Invoice Provided',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'WARRANTY'
      }
    ]
  },
  {
    id: 'laptop-2',
    category: 'laptop',
    brand: 'Lenovo',
    name: 'Lenovo Legion Pro 5 Gen 8 (16GB RAM, 1TB SSD, RTX 4060 8GB) - Onyx Grey',
    price: 119990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'AMD Ryzen 7 7745HX (8 cores, 16 threads, up to 5.1GHz)',
      cpu: 'AMD Ryzen 7 7745HX',
      gpu: 'NVIDIA GeForce RTX 4060 8GB GDDR6 (140W TGP)',
      ramGB: 16,
      storageGB: 1000,
      displaySizeInches: 16.0,
      resolution: '2560 x 1600 WQXGA IPS (500 nits, 100% sRGB)',
      refreshRateHz: 240,
      batteryCapacitymAh: 80,
      batteryHours: 6,
      chargingWatts: 300,
      weightKg: 2.5,
      os: 'Windows 11 Home',
      buildQuality: 'Aluminum Top, PC-ABS Bottom with ColdFront 5.0 Cooling'
    },
    listing: {
      marketplace: 'Lenovo Official Online Store',
      sellerName: 'Lenovo India Official Direct Store',
      sellerRating: 4.7,
      sellerReviewsCount: 18900,
      listingId: 'LENOVO-LEGION-P5-4060',
      variant: 'Ryzen 7 / 16GB / 1TB SSD / RTX 4060',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-lenovo-01',
      name: 'Lenovo India Official Direct Store',
      trustRating: 96,
      isOfficialBrandStore: true,
      fulfillmentRate: 98,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Onsite Legion Ultimate Support + 1 Year ADP',
      durationMonths: 12,
      coverage: 'Onsite technician repair + Accidental Damage Protection included free',
      status: 'Verified',
      evidence: 'Lenovo India Official Warranty Registration'
    },
    reviews: {
      count: 3100,
      rating: 4.6,
      sentiment: 'Strong',
      positiveThemes: ['Top-tier 140W RTX 4060 gaming performance', '240Hz ultra-smooth display', 'Excellent thermal cooling', 'Upgradeability (dual DDR5 & dual M.2)'],
      recurringConcerns: ['Heavy 2.5kg brick + large 300W power adapter', 'Short battery unplugged (under 5-6 hours)'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 116990,
      historicalAvg: 124990,
      previousPrice: 129990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Great price for a high-TGP gaming GPU with 1TB SSD and 240Hz screen.'
    },
    evidence: [
      {
        id: 'ev-l2-1',
        claim: '140W TGP Full Power RTX 4060 Verified',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      }
    ]
  },
  {
    id: 'laptop-3',
    category: 'laptop',
    brand: 'ASUS',
    name: 'ASUS ROG Zephyrus G14 (16GB RAM, 1TB SSD, RTX 4060, 3K OLED) - Eclipse Grey',
    price: 149990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'AMD Ryzen 9 8945HS with Ryzen AI (8 cores, 16 threads)',
      cpu: 'AMD Ryzen 9 8945HS',
      gpu: 'NVIDIA GeForce RTX 4060 8GB GDDR6',
      ramGB: 16,
      storageGB: 1000,
      displaySizeInches: 14.0,
      resolution: '2880 x 1800 3K ROG Nebula OLED (0.2ms, 100% DCI-P3)',
      refreshRateHz: 120,
      batteryCapacitymAh: 73,
      batteryHours: 10,
      chargingWatts: 180,
      weightKg: 1.5,
      os: 'Windows 11 Home',
      buildQuality: 'CNC Machined Aluminum Unibody with Slash Lighting'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Appario Retail Private Ltd',
      sellerRating: 4.8,
      sellerReviewsCount: 14000,
      listingId: 'ASUS-ROG-G14-2024',
      variant: 'Ryzen 9 / 16GB / 1TB / OLED 120Hz',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-appario-01',
      name: 'Appario Retail Private Ltd',
      trustRating: 96,
      isOfficialBrandStore: false,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Asus International Warranty',
      durationMonths: 12,
      coverage: 'Full hardware coverage at Asus Authorized Service Centers',
      status: 'Verified',
      evidence: 'Asus Serial Number E-Warranty Registered'
    },
    reviews: {
      count: 1850,
      rating: 4.7,
      sentiment: 'Strong',
      positiveThemes: ['Mind-blowing 3K OLED screen', 'Lightweight 1.5kg gaming notebook', 'Premium CNC aluminum build', 'Great battery for a gaming laptop'],
      recurringConcerns: ['RAM is soldered (cannot upgrade past 16GB on this model)', 'Premium price tag'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 145990,
      historicalAvg: 152990,
      previousPrice: 159990
    },
    saleTiming: {
      recommendation: 'CONSIDER',
      explanation: 'Best portable gaming & content creation laptop, but pricing is near top of budget.'
    },
    evidence: []
  },
  {
    id: 'laptop-4',
    category: 'laptop',
    brand: 'Acer',
    name: 'Acer Swift Go 14 OLED (16GB LPDDR5X RAM, 512GB SSD, Intel Core Ultra 5) - Pure Silver',
    price: 64990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Intel Core Ultra 5 125H (14 Cores, Intel AI Boost NPU)',
      cpu: 'Intel Core Ultra 5 125H',
      gpu: 'Intel Arc Graphics',
      ramGB: 16,
      storageGB: 512,
      displaySizeInches: 14.0,
      resolution: '2880 x 1800 2.8K OLED Display (400 nits, 100% DCI-P3)',
      refreshRateHz: 90,
      batteryCapacitymAh: 65,
      batteryHours: 11,
      chargingWatts: 65,
      weightKg: 1.32,
      os: 'Windows 11 Home',
      buildQuality: 'Full Aluminum Chassis with OceanGlass Touchpad'
    },
    listing: {
      marketplace: 'Flipkart',
      sellerName: 'OmniTech Retail',
      sellerRating: 4.5,
      sellerReviewsCount: 9800,
      listingId: 'ACER-SWIFT-GO-14',
      variant: 'Intel Ultra 5 / 16GB / 512GB OLED',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-omnitech-04',
      name: 'OmniTech Retail',
      trustRating: 89,
      isOfficialBrandStore: false,
      fulfillmentRate: 96,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Acer Brand Warranty',
      durationMonths: 12,
      coverage: 'Standard hardware repair & Intel NPU software support',
      status: 'Verified',
      evidence: 'Acer Official Registration'
    },
    reviews: {
      count: 2400,
      rating: 4.4,
      sentiment: 'Strong',
      positiveThemes: ['Unbeatable value for 2.8K OLED display under ₹65k', 'Intel Core Ultra 5 with AI NPU for coding', '1.32kg lightweight mobility'],
      recurringConcerns: ['Speakers are average', 'Glossy OLED screen reflects light outdoors'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 62990,
      historicalAvg: 66500,
      previousPrice: 69990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Sublime budget coding & AI development choice with 16GB RAM and OLED display at ₹64,990.'
    },
    evidence: [
      {
        id: 'ev-l4-1',
        claim: 'Intel AI Boost NPU benchmarked for local developer acceleration',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      }
    ]
  },
  {
    id: 'laptop-5',
    category: 'laptop',
    brand: 'Dell',
    name: 'Dell Inspiron 15 3530 (8GB RAM, 512GB SSD, Intel Core i5 13th Gen) - Platinum Silver',
    price: 58990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Intel Core i5-1335U (10 cores, 12 threads, up to 4.6GHz)',
      cpu: 'Intel Core i5-1335U',
      gpu: 'Intel Iris Xe Graphics',
      ramGB: 8,
      storageGB: 512,
      displaySizeInches: 15.6,
      resolution: '1920 x 1080 FHD WVA Anti-Glare',
      refreshRateHz: 120,
      batteryCapacitymAh: 41,
      batteryHours: 6,
      chargingWatts: 65,
      weightKg: 1.65,
      os: 'Windows 11 Home + MS Office 2021',
      buildQuality: 'Plastic Polymer Textured Body'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Cloudtail India (Dell Preferred)',
      sellerRating: 4.3,
      sellerReviewsCount: 11200,
      listingId: 'DELL-INSP-15-8GB',
      variant: '8GB RAM / 512GB SSD / Core i5',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-cloudtail-05',
      name: 'Cloudtail India',
      trustRating: 85,
      isOfficialBrandStore: false,
      fulfillmentRate: 95,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Dell Onsite Hardware Service',
      durationMonths: 12,
      coverage: 'In-home technician support after remote diagnosis',
      status: 'Verified',
      evidence: 'Dell Service Tag Invoice Verified'
    },
    reviews: {
      count: 1420,
      rating: 4.1,
      sentiment: 'Moderate',
      positiveThemes: ['Reliable Dell brand service', 'Full keyboard layout with numpad'],
      recurringConcerns: ['Only 8GB RAM causes lag during heavy IDE/coding tasks', 'Average plastic build quality'],
      confidence: 'Medium'
    },
    priceHistory: {
      historicalLow: 56990,
      historicalAvg: 59990,
      previousPrice: 61990
    },
    saleTiming: {
      recommendation: 'WAIT',
      explanation: 'Only 8GB RAM provided. Fails 16GB hard requirement if user specifies modern software development.'
    },
    evidence: []
  },
  {
    id: 'laptop-6',
    category: 'laptop',
    brand: 'HP',
    name: 'HP Victus 15 (16GB RAM, 512GB SSD, RTX 2050 4GB) - Performance Blue [Refurbished Grade A]',
    price: 62990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Intel Core i5-13420H (8 cores, 12 threads)',
      cpu: 'Intel Core i5-13420H',
      gpu: 'NVIDIA GeForce RTX 2050 4GB GDDR6',
      ramGB: 16,
      storageGB: 512,
      displaySizeInches: 15.6,
      resolution: '1920 x 1080 FHD IPS',
      refreshRateHz: 144,
      batteryCapacitymAh: 52.5,
      batteryHours: 5,
      chargingWatts: 150,
      weightKg: 2.29,
      os: 'Windows 11 Home',
      buildQuality: 'Plastic Composite'
    },
    listing: {
      marketplace: 'Refurbished Hub Third-Party Seller',
      sellerName: 'GreenTech Refurbished Solutions',
      sellerRating: 3.2,
      sellerReviewsCount: 320,
      listingId: 'HP-VIC-REFURB-99',
      variant: 'Refurbished Grade A / 16GB / 512GB / RTX 2050',
      invoiceProvided: false,
      region: 'India',
      verifiedListing: false
    },
    seller: {
      id: 'seller-greentech-99',
      name: 'GreenTech Refurbished Solutions',
      trustRating: 42,
      isOfficialBrandStore: false,
      fulfillmentRate: 81,
      returnPolicyDays: 3
    },
    condition: 'Refurbished',
    warranty: {
      type: '6 Months Seller Warranty (No HP Brand Warranty)',
      durationMonths: 6,
      coverage: 'Seller back-to-base repair (excludes battery and screen burn)',
      status: 'Partially Verified',
      evidence: 'Unverified Third-Party Seller Warranty Card'
    },
    reviews: {
      count: 95,
      rating: 3.4,
      sentiment: 'Weak',
      positiveThemes: ['Low price point for RTX 2050 specs'],
      recurringConcerns: ['Received scratched chassis', 'Third party battery degrades fast', 'Difficult customer support returns'],
      confidence: 'Low'
    },
    priceHistory: {
      historicalLow: 59990,
      historicalAvg: 63500,
      previousPrice: 64990
    },
    saleTiming: {
      recommendation: 'CONSIDER',
      explanation: 'Refurbished condition with low seller trust score (42/100) presents high purchase risk.'
    },
    evidence: [
      {
        id: 'ev-l6-1',
        claim: 'Refurbished listing with no official HP brand invoice',
        source: 'Development dataset',
        confidence: 'High Risk Alert',
        timestamp: new Date().toISOString(),
        type: 'SELLER'
      }
    ]
  },

  // ==========================================
  // 3. TV CATEGORY
  // ==========================================
  {
    id: 'tv-1',
    category: 'tv',
    brand: 'LG',
    name: 'LG C3 55-inch 4K Smart OLED TV (OLED55C3PSA) - Dark Silver',
    price: 129990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'α9 AI Processor 4K Gen6',
      displaySizeInches: 55,
      resolution: '3840 x 2160 4K Ultra HD Self-Lit OLED',
      refreshRateHz: 120,
      panelType: 'OLED evo (Self-Lighting Pixels)',
      hdrSupport: ['Dolby Vision', 'HDR10', 'HLG', 'Filmmaker Mode'],
      hdmiPorts: 4,
      speakerWatts: 40,
      has5G: false,
      hasANC: false,
      hasGPS: false,
      os: 'webOS 23 with ThinQ AI',
      buildQuality: 'Ultra Slim Bezel Frame with Metallic Pedestal'
    },
    listing: {
      marketplace: 'Reliance Digital Store',
      sellerName: 'Reliance Digital Official',
      sellerRating: 4.8,
      sellerReviewsCount: 22400,
      listingId: 'LG-OLED55C3PSA',
      variant: '55 Inch OLED 4K',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-rel-01',
      name: 'Reliance Digital Official',
      trustRating: 97,
      isOfficialBrandStore: true,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '3 Years Comprehensive LG Panel Warranty',
      durationMonths: 36,
      coverage: '3 Years on OLED Panel + 1 Year standard comprehensive home visit service',
      status: 'Verified',
      evidence: 'Official LG India Warranty Registered on Installation'
    },
    reviews: {
      count: 5400,
      rating: 4.9,
      sentiment: 'Strong',
      positiveThemes: ['Absolute perfect contrast & deep blacks for movies', '4x HDMI 2.1 4K 120Hz G-Sync gaming', 'webOS Magic Remote convenience'],
      recurringConcerns: ['Reflective screen in extremely bright sunlight rooms'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 124990,
      historicalAvg: 132900,
      previousPrice: 139990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Gold standard OLED TV for movies, Netflix Dolby Vision, and PS5 120Hz gaming.'
    },
    evidence: [
      {
        id: 'ev-t1-1',
        claim: 'Infinite contrast OLED self-lighting panel certified',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      }
    ]
  },
  {
    id: 'tv-2',
    category: 'tv',
    brand: 'Samsung',
    name: 'Samsung 55-inch Neo QLED 4K Smart TV (QA55QN85C) - Titan Black',
    price: 98990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Neural Quantum Processor 4K',
      displaySizeInches: 55,
      resolution: '3840 x 2160 4K Ultra HD Neo QLED',
      refreshRateHz: 120,
      panelType: 'Mini-LED Quantum Matrix Technology',
      hdrSupport: ['Neo Quantum HDR', 'HDR10+', 'HLG'],
      hdmiPorts: 4,
      speakerWatts: 60,
      os: 'Tizen OS 2023 with SmartThings Hub',
      buildQuality: 'NeoSlim Design with SolarCell Remote'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Samsung Official Electronics Store',
      sellerRating: 4.7,
      sellerReviewsCount: 38000,
      listingId: 'SAMSUNG-55QN85C',
      variant: '55 Inch Neo QLED 4K',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-sam-tv-01',
      name: 'Samsung Official Electronics Store',
      trustRating: 96,
      isOfficialBrandStore: true,
      fulfillmentRate: 98,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Comprehensive + 1 Year Additional Panel Warranty',
      durationMonths: 24,
      coverage: '2 Years total warranty on Mini-LED panel + free installation',
      status: 'Verified',
      evidence: 'Samsung Direct E-Warranty Voucher'
    },
    reviews: {
      count: 3100,
      rating: 4.6,
      sentiment: 'Strong',
      positiveThemes: ['Ultra-bright peak illumination for daytime viewing', 'Punchy colors', '60W Dolby Atmos 4.2.2 ch audio'],
      recurringConcerns: ['No Dolby Vision support (Samsung uses HDR10+)'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 94990,
      historicalAvg: 102000,
      previousPrice: 108990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Exceptional peak brightness and zero burn-in risk for bright living rooms.'
    },
    evidence: []
  },
  {
    id: 'tv-3',
    category: 'tv',
    brand: 'Sony',
    name: 'Sony BRAVIA XR 55X90L 55-inch 4K Full Array LED Smart TV - Black',
    price: 94990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Cognitive Processor XR',
      displaySizeInches: 55,
      resolution: '3840 x 2160 4K Ultra HD Full Array LED',
      refreshRateHz: 120,
      panelType: 'Full Array LED with XR Contrast Booster',
      hdrSupport: ['Dolby Vision', 'HDR10', 'HLG', 'XR HDR Remaster'],
      hdmiPorts: 4,
      speakerWatts: 30,
      os: 'Google TV with BRAVIA CORE streaming',
      buildQuality: 'Seamless Edge Aluminum Bezel'
    },
    listing: {
      marketplace: 'Flipkart',
      sellerName: 'OmniTech Electronics',
      sellerRating: 4.6,
      sellerReviewsCount: 14200,
      listingId: 'SONY-55X90L',
      variant: '55 Inch Full Array 4K',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-omnitech-04',
      name: 'OmniTech Electronics',
      trustRating: 92,
      isOfficialBrandStore: false,
      fulfillmentRate: 97,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '2 Years Comprehensive Sony India Warranty',
      durationMonths: 24,
      coverage: 'Full home service warranty with free wall mount installation',
      status: 'Verified',
      evidence: 'Sony India Serial Number Registration'
    },
    reviews: {
      count: 2890,
      rating: 4.7,
      sentiment: 'Strong',
      positiveThemes: ['Industry-best cinematic color accuracy & upscaling', 'Perfect for PlayStation 5 Auto HDR', 'Google TV interface speed'],
      recurringConcerns: ['Slight blooming around bright subtitles on dark backgrounds'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 91990,
      historicalAvg: 97500,
      previousPrice: 102990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Cognitive Processor XR offers unmatched realistic motion and picture processing.'
    },
    evidence: []
  },
  {
    id: 'tv-4',
    category: 'tv',
    brand: 'Xiaomi',
    name: 'Xiaomi Smart TV X50 50-inch 4K Ultra HD Smart Google TV - Black',
    price: 32990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Quad Core A55',
      displaySizeInches: 50,
      resolution: '3840 x 2160 4K Ultra HD LED',
      refreshRateHz: 60,
      panelType: 'Direct LED Premium Panel',
      hdrSupport: ['Dolby Vision', 'HDR10', 'HLG'],
      hdmiPorts: 3,
      speakerWatts: 30,
      os: 'Google TV + PatchWall',
      buildQuality: 'Bezel-less Metallic Finish'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Xiaomi Authorized Direct Store',
      sellerRating: 4.5,
      sellerReviewsCount: 41000,
      listingId: 'XIAOMI-X50-4K',
      variant: '50 Inch 4K LED',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-xiaomi-01',
      name: 'Xiaomi Authorized Direct Store',
      trustRating: 91,
      isOfficialBrandStore: true,
      fulfillmentRate: 98,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Comprehensive + 1 Year Extra on Panel',
      durationMonths: 24,
      coverage: 'Xiaomi doorstep service warranty',
      status: 'Verified',
      evidence: 'GST Invoice & Brand Warranty'
    },
    reviews: {
      count: 14500,
      rating: 4.3,
      sentiment: 'Strong',
      positiveThemes: ['Unbeatable 4K Dolby Vision value under ₹35k', 'Loud 30W Dolby Audio sound', 'Google TV app ecosystem'],
      recurringConcerns: ['Standard 60Hz panel (not for high frame rate 120Hz console gaming)'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 30990,
      historicalAvg: 33990,
      previousPrice: 35990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Great budget TV choice for family movies and streaming shows.'
    },
    evidence: []
  },

  // ==========================================
  // 4. HEADPHONES CATEGORY
  // ==========================================
  {
    id: 'headphones-1',
    category: 'headphones',
    brand: 'Sony',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones - Silver',
    price: 29990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Integrated Processor V1 + HD Noise Canceling Processor QN1',
      batteryHours: 30,
      chargingWatts: 15,
      hasANC: true,
      hasGPS: false,
      micQuality: '8 microphones with Precise Voice Pickup AI technology',
      codecSupport: ['LDAC', 'AAC', 'SBC'],
      multipoint: true,
      weightKg: 0.25,
      buildQuality: 'Soft fit leather and lightweight plastic frame'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Appario Retail Private Ltd (Sony Authorized)',
      sellerRating: 4.8,
      sellerReviewsCount: 22000,
      listingId: 'B09XS7JWHH',
      variant: 'Silver - Wireless ANC',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-appario-01',
      name: 'Appario Retail Private Ltd',
      trustRating: 97,
      isOfficialBrandStore: true,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Sony India Brand Warranty',
      durationMonths: 12,
      coverage: 'Full repairs & replacement at Sony Service Centers',
      status: 'Verified',
      evidence: 'Official Sony E-Warranty Registration'
    },
    reviews: {
      count: 9800,
      rating: 4.7,
      sentiment: 'Strong',
      positiveThemes: ['Best-in-class active noise cancellation', 'Crystal clear mic quality for meetings & work calls', '30-hour battery life with fast charge', 'Dual multipoint connection'],
      recurringConcerns: ['Earcups do not fold down fully like XM4', 'Non-waterproof rating'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 26990,
      historicalAvg: 29500,
      previousPrice: 34990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Benchmark ANC noise cancellation and call audio clarity for office work and flight travel.'
    },
    evidence: [
      {
        id: 'ev-h1-1',
        claim: 'Multi-mic AI beamforming call quality verified',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      }
    ]
  },
  {
    id: 'headphones-2',
    category: 'headphones',
    brand: 'Bose',
    name: 'Bose QuietComfort Ultra Headphones - Black',
    price: 35900,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Bose Custom Signal Processor',
      batteryHours: 24,
      chargingWatts: 15,
      hasANC: true,
      hasGPS: false,
      micQuality: 'Advanced noise-rejecting mic array',
      codecSupport: ['Snapdragon Sound', 'aptX Adaptive', 'AAC', 'SBC'],
      multipoint: true,
      weightKg: 0.252,
      buildQuality: 'Cast aluminum, plush protein leather cushions'
    },
    listing: {
      marketplace: 'Tata CLiQ Luxury',
      sellerName: 'Bose India Official Store',
      sellerRating: 4.9,
      sellerReviewsCount: 15000,
      listingId: 'BOSE-QC-ULTRA-BLK',
      variant: 'Black - Immersive Audio',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-bose-01',
      name: 'Bose India Official Store',
      trustRating: 98,
      isOfficialBrandStore: true,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Bose Manufacturer Warranty',
      durationMonths: 12,
      coverage: 'Direct replacement at Bose Service Lounges',
      status: 'Verified',
      evidence: 'Bose India Official Warranty Card'
    },
    reviews: {
      count: 3200,
      rating: 4.7,
      sentiment: 'Strong',
      positiveThemes: ['Unmatched comfort for hours of wearing', 'Immersive Spatial Audio mode', 'World-class noise cancellation'],
      recurringConcerns: ['Slightly lower 24hr battery compared to 30hr+ rivals', 'High price tag'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 34900,
      historicalAvg: 35900,
      previousPrice: 35900
    },
    saleTiming: {
      recommendation: 'CONSIDER',
      explanation: 'Unrivaled comfort for travel, though XM5 offers better battery per rupee.'
    },
    evidence: []
  },
  {
    id: 'headphones-3',
    category: 'headphones',
    brand: 'Sennheiser',
    name: 'Sennheiser Momentum 4 Wireless Headphones - Black Copper',
    price: 24990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Sennheiser Audiophile Transducer',
      batteryHours: 60,
      chargingWatts: 15,
      hasANC: true,
      hasGPS: false,
      micQuality: '4 digital beamforming microphones',
      codecSupport: ['aptX Adaptive', 'aptX', 'AAC', 'SBC'],
      multipoint: true,
      weightKg: 0.293,
      buildQuality: 'Fabric headband with premium synthetic leather ear pads'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Sennheiser Authorized Partner',
      sellerRating: 4.6,
      sellerReviewsCount: 9200,
      listingId: 'SENN-M4-COPPER',
      variant: 'Black Copper',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-senn-01',
      name: 'Sennheiser Authorized Partner',
      trustRating: 93,
      isOfficialBrandStore: true,
      fulfillmentRate: 97,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '2 Years Sennheiser International Warranty',
      durationMonths: 24,
      coverage: '2-year full hardware guarantee and replacement',
      status: 'Verified',
      evidence: 'Sennheiser 2-Year Warranty Document'
    },
    reviews: {
      count: 4100,
      rating: 4.6,
      sentiment: 'Strong',
      positiveThemes: ['Incredible 60-hour marathon battery life', 'Rich audiophile sound clarity and warm bass', '2-year warranty'],
      recurringConcerns: ['ANC is slightly below Sony XM5 level', 'Headband auto-pause can be sensitive'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 22990,
      historicalAvg: 25990,
      previousPrice: 27990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: '60-hour battery life and 2-year warranty provide unmatched long-term value.'
    },
    evidence: []
  },
  {
    id: 'headphones-4',
    category: 'headphones',
    brand: 'Anker',
    name: 'Anker Soundcore Space Q45 Adaptive Noise Cancelling Headphones - Blue',
    price: 14999,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Soundcore Custom DSP',
      batteryHours: 50,
      chargingWatts: 10,
      hasANC: true,
      hasGPS: false,
      micQuality: 'Dual mic with AI noise reduction',
      codecSupport: ['LDAC', 'AAC', 'SBC'],
      multipoint: true,
      weightKg: 0.29,
      buildQuality: 'Aluminum alloy hinges with memory foam cushions'
    },
    listing: {
      marketplace: 'Flipkart',
      sellerName: 'Anker Official Store',
      sellerRating: 4.5,
      sellerReviewsCount: 8100,
      listingId: 'ANKER-Q45-BLUE',
      variant: 'Blue - LDAC Hi-Res',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-anker-01',
      name: 'Anker Official Store',
      trustRating: 90,
      isOfficialBrandStore: true,
      fulfillmentRate: 96,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '18 Months Anker India Warranty',
      durationMonths: 18,
      coverage: '18-month warranty against functional hardware failure',
      status: 'Verified',
      evidence: 'Soundcore India Registration'
    },
    reviews: {
      count: 5300,
      rating: 4.4,
      sentiment: 'Strong',
      positiveThemes: ['LDAC high resolution wireless sound', '50hr battery life', '18-month extra warranty', 'Affordable price'],
      recurringConcerns: ['Bulkier earcups on smaller heads'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 11999,
      historicalAvg: 13999,
      previousPrice: 14999
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Top value entry for active noise cancelling and 50h battery under ₹15,000.'
    },
    evidence: []
  },

  // ==========================================
  // 5. EARBUDS CATEGORY
  // ==========================================
  {
    id: 'earbuds-1',
    category: 'earbuds',
    brand: 'Apple',
    name: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
    price: 23900,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Apple H2 Headphone Chip + U1 Chip in case',
      batteryHours: 6,
      chargingWatts: 15,
      hasANC: true,
      hasGPS: true,
      micQuality: 'Dual beamforming microphones + inward-facing mic',
      codecSupport: ['AAC', 'SBC', 'Apple Lossless over Vision Pro'],
      multipoint: true,
      waterResistance: 'IP54 dust, sweat, and water resistant',
      weightKg: 0.0508,
      buildQuality: 'Glossy white polycarbonate with lanyard loop'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Appario Retail Private Ltd (Apple Authorized)',
      sellerRating: 4.8,
      sellerReviewsCount: 45000,
      listingId: 'B0CHWRXH8B',
      variant: 'USB-C MagSafe Case',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-appario-01',
      name: 'Appario Retail Private Ltd',
      trustRating: 97,
      isOfficialBrandStore: true,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Manufacturer AppleCare Warranty',
      durationMonths: 12,
      coverage: 'Full Apple Authorized Service Center support & battery replacement',
      status: 'Verified',
      evidence: 'Apple Official Serial Warranty Verified'
    },
    reviews: {
      count: 15200,
      rating: 4.7,
      sentiment: 'Strong',
      positiveThemes: ['2x Noise cancellation capability', 'Adaptive Audio & Conversation Awareness', 'Seamless Apple ecosystem switching', 'Precision Find My case speaker'],
      recurringConcerns: ['Single color white choice', 'Price premium'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 21900,
      historicalAvg: 23500,
      previousPrice: 24900
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Industry leader for ANC, call clarity, and ecosystem integration for iPhone users.'
    },
    evidence: [
      {
        id: 'ev-e1-1',
        claim: 'H2 Chip Adaptive Audio noise rejection verified',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      }
    ]
  },
  {
    id: 'earbuds-2',
    category: 'earbuds',
    brand: 'Sony',
    name: 'Sony WF-1000XM5 True Wireless Noise Canceling Earbuds - Black',
    price: 22990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Integrated Processor V2 + HD Noise Canceling Processor QN2e',
      batteryHours: 8,
      chargingWatts: 10,
      hasANC: true,
      hasGPS: false,
      micQuality: 'Bone conduction sensors + AI DNN mic algorithm',
      codecSupport: ['LDAC', 'LC3', 'AAC', 'SBC'],
      multipoint: true,
      waterResistance: 'IPX4 water resistant',
      weightKg: 0.039,
      buildQuality: 'Glossy & matte ergonomic compact texture'
    },
    listing: {
      marketplace: 'Flipkart',
      sellerName: 'Sony India Authorized Store',
      sellerRating: 4.7,
      sellerReviewsCount: 19500,
      listingId: 'SONY-WF1000XM5-BLK',
      variant: 'Black - LDAC TWS',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-sony-01',
      name: 'Sony India Authorized Store',
      trustRating: 95,
      isOfficialBrandStore: true,
      fulfillmentRate: 98,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Sony India Warranty',
      durationMonths: 12,
      coverage: 'Comprehensive hardware repair at Sony Center',
      status: 'Verified',
      evidence: 'Sony India Registration'
    },
    reviews: {
      count: 6800,
      rating: 4.5,
      sentiment: 'Strong',
      positiveThemes: ['Audiophile LDAC high resolution sound', 'Compact 25% smaller fit than XM4', '8-hour standalone battery life'],
      recurringConcerns: ['Foam ear tips take getting used to'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 20990,
      historicalAvg: 22500,
      previousPrice: 24990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Best audiophile sound quality TWS earbuds for Android users.'
    },
    evidence: []
  },
  {
    id: 'earbuds-3',
    category: 'earbuds',
    brand: 'Nothing',
    name: 'Nothing Ear (2) TWS Earbuds - White',
    price: 9999,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1631867675167-90a456a90863?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Custom Nothing Audio Chip',
      batteryHours: 6.5,
      chargingWatts: 5,
      hasANC: true,
      hasGPS: false,
      micQuality: '3 High Definition Mics per earbud with Clear Voice Tech',
      codecSupport: ['LHDC 5.0', 'AAC', 'SBC'],
      multipoint: true,
      waterResistance: 'IP54 earbuds / IP55 case',
      weightKg: 0.052,
      buildQuality: 'Transparent iconic shell case'
    },
    listing: {
      marketplace: 'Flipkart',
      sellerName: 'Flipkart Official Retail',
      sellerRating: 4.6,
      sellerReviewsCount: 28000,
      listingId: 'NOTHING-EAR2-WHT',
      variant: 'White Transparent',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-fk-01',
      name: 'Flipkart Official Retail',
      trustRating: 94,
      isOfficialBrandStore: true,
      fulfillmentRate: 97,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Brand Warranty',
      durationMonths: 12,
      coverage: 'Nothing India Service Center network support',
      status: 'Verified',
      evidence: 'Verified E-Invoice'
    },
    reviews: {
      count: 11200,
      rating: 4.4,
      sentiment: 'Strong',
      positiveThemes: ['Iconic design aesthetic', 'LHDC 5.0 Hi-Res audio', 'Personalized sound profile test', 'Great mic quality under ₹10k'],
      recurringConcerns: ['ANC is moderate compared to ₹20k flagship models'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 8999,
      historicalAvg: 9999,
      previousPrice: 11999
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Exceptional style, sound, and call mic value under ₹10,000.'
    },
    evidence: []
  },
  {
    id: 'earbuds-4',
    category: 'earbuds',
    brand: 'Jabra',
    name: 'Jabra Elite 8 Active Tough Wireless Earbuds - Navy',
    price: 17999,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Jabra Sound Processor',
      batteryHours: 8,
      chargingWatts: 10,
      hasANC: true,
      hasGPS: false,
      micQuality: '6-mic Call technology with wind noise protection mesh',
      codecSupport: ['AAC', 'SBC', 'Dolby Audio'],
      multipoint: true,
      waterResistance: 'IP68 Military standard dust/waterproof',
      weightKg: 0.045,
      buildQuality: 'ShakeGrip liquid silicone rubber coating'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Jabra Authorized Store',
      sellerRating: 4.7,
      sellerReviewsCount: 7400,
      listingId: 'JABRA-ELITE8-NAVY',
      variant: 'Navy Blue',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-jabra-01',
      name: 'Jabra Authorized Store',
      trustRating: 93,
      isOfficialBrandStore: true,
      fulfillmentRate: 98,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '2 Years Dust & Sweat Warranty',
      durationMonths: 24,
      coverage: '2-year extended warranty against dust and water damage upon registration',
      status: 'Verified',
      evidence: 'Jabra Sound+ App Registration'
    },
    reviews: {
      count: 2900,
      rating: 4.6,
      sentiment: 'Strong',
      positiveThemes: ['Indestructible IP68 rating for gym & intense workouts', 'Never drops out of ears during running', 'Clear wind-protected voice calls'],
      recurringConcerns: ['No high-bitrate LDAC codec'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 15999,
      historicalAvg: 17999,
      previousPrice: 19999
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Ultimate durable earbud for fitness, sports, and outdoor activities.'
    },
    evidence: []
  },

  // ==========================================
  // 6. SMARTWATCH CATEGORY
  // ==========================================
  {
    id: 'smartwatch-1',
    category: 'smartwatch',
    brand: 'Apple',
    name: 'Apple Watch Series 9 GPS 45mm - Midnight Aluminum with Sport Band',
    price: 44900,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'S9 SiP (64-bit dual-core processor with 4-core Neural Engine)',
      displaySizeInches: 1.9,
      resolution: '396 x 484 Always-On Retina OLED (up to 2000 nits)',
      refreshRateHz: 60,
      batteryHours: 18,
      chargingWatts: 15,
      hasGPS: true,
      callingSupport: true,
      fitnessSensors: ['ECG App', 'Blood Oxygen (SpO2)', 'Optical Heart Rate Gen 3', 'Temperature Sensor', 'Fall & Crash Detection'],
      waterResistance: '50m water resistant (WR50 / Swimproof)',
      os: 'watchOS 10',
      weightKg: 0.0387,
      buildQuality: '100% Recycled Aluminum with Ion-X front glass'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Appario Retail Private Ltd (Apple Authorized)',
      sellerRating: 4.8,
      sellerReviewsCount: 39000,
      listingId: 'B0CHX7N72N',
      variant: 'GPS 45mm - Midnight',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-appario-01',
      name: 'Appario Retail Private Ltd',
      trustRating: 97,
      isOfficialBrandStore: true,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Limited Apple Manufacturer Warranty',
      durationMonths: 12,
      coverage: 'Apple Care hardware & battery repair at Apple Authorized Centers',
      status: 'Verified',
      evidence: 'Apple E-Warranty Registered'
    },
    reviews: {
      count: 8900,
      rating: 4.8,
      sentiment: 'Strong',
      positiveThemes: ['Double Tap gesture control magic', 'S9 SiP Siri processed on-device', 'Accurate ECG & fitness tracking', 'Bright 2000 nits display'],
      recurringConcerns: ['18-hour daily charging required'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 41900,
      historicalAvg: 43900,
      previousPrice: 44900
    },
    saleTiming: {
      upcomingSaleEvent: 'Festive Shopping Days',
      daysUntilSale: 12,
      recommendation: 'BUY NOW',
      explanation: 'S9 Chip Double Tap and medical-grade sensors provide top smartwatch experience.'
    },
    evidence: [
      {
        id: 'ev-w1-1',
        claim: 'Medical grade ECG & Blood Oxygen sensor calibration verified',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      }
    ]
  },
  {
    id: 'smartwatch-2',
    category: 'smartwatch',
    brand: 'Samsung',
    name: 'Samsung Galaxy Watch 6 Classic 47mm Bluetooth - Black',
    price: 34999,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Exynos W930 (Dual-Core 1.4GHz)',
      displaySizeInches: 1.5,
      resolution: '480 x 480 Super AMOLED Always-On',
      refreshRateHz: 60,
      batteryHours: 40,
      chargingWatts: 10,
      hasGPS: true,
      callingSupport: true,
      fitnessSensors: ['BIA Body Composition', 'ECG', 'BP Monitor', 'Optical Heart Rate', 'Skin Temp'],
      waterResistance: '5ATM + IP68 / MIL-STD-810H',
      os: 'Wear OS Powered by Samsung (One UI Watch 5)',
      weightKg: 0.059,
      buildQuality: 'Stainless Steel Case with Physical Rotating Bezel & Sapphire Crystal'
    },
    listing: {
      marketplace: 'Flipkart',
      sellerName: 'Samsung Official Store',
      sellerRating: 4.7,
      sellerReviewsCount: 22000,
      listingId: 'SAMSUNG-GW6C-47',
      variant: '47mm Bluetooth - Black',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-sam-01',
      name: 'Samsung Official Store',
      trustRating: 95,
      isOfficialBrandStore: true,
      fulfillmentRate: 98,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Manufacturer Warranty',
      durationMonths: 12,
      coverage: 'Samsung Service Center support',
      status: 'Verified',
      evidence: 'Samsung E-Warranty Card'
    },
    reviews: {
      count: 4500,
      rating: 4.6,
      sentiment: 'Strong',
      positiveThemes: ['Physical rotating bezel navigation', 'BIA body fat percentage sensor', 'Sapphire crystal scratch resistance'],
      recurringConcerns: ['ECG/BP requires Samsung phone for full unlocking'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 31999,
      historicalAvg: 34500,
      previousPrice: 36999
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Tactile physical rotating bezel and Wear OS app ecosystem make this ideal for Android.'
    },
    evidence: []
  },
  {
    id: 'smartwatch-3',
    category: 'smartwatch',
    brand: 'Garmin',
    name: 'Garmin Forerunner 265 GPS Running Smartwatch - Black / Powder Grey',
    price: 49990,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Garmin Custom Athletic Processor',
      displaySizeInches: 1.3,
      resolution: '416 x 416 Vibrant AMOLED Touchscreen',
      refreshRateHz: 60,
      batteryHours: 312, // 13 days in smartwatch mode!
      chargingWatts: 5,
      hasGPS: true,
      callingSupport: false,
      fitnessSensors: ['Multi-Band SATIQ GPS', 'Elevate Gen 4 Optical HR', 'Pulse Ox', 'HRV Status', 'Training Readiness'],
      waterResistance: '5 ATM (50m Swimproof)',
      os: 'Garmin OS',
      weightKg: 0.047,
      buildQuality: 'Fiber-reinforced polymer bezel with Gorilla Glass 3'
    },
    listing: {
      marketplace: 'Amazon India',
      sellerName: 'Garmin Authorized India Distributor',
      sellerRating: 4.8,
      sellerReviewsCount: 6500,
      listingId: 'GARMIN-FR265-BLK',
      variant: 'AMOLED - Black',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-garmin-01',
      name: 'Garmin Authorized India Distributor',
      trustRating: 97,
      isOfficialBrandStore: true,
      fulfillmentRate: 99,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '2 Years Garmin Official Warranty',
      durationMonths: 24,
      coverage: '2-year hardware replacement warranty',
      status: 'Verified',
      evidence: 'Garmin India 2-Year Warranty Verified'
    },
    reviews: {
      count: 2100,
      rating: 4.9,
      sentiment: 'Strong',
      positiveThemes: ['Unmatched SatIQ Multi-band GPS tracking accuracy', '13-day real world battery life', 'Training Readiness & HRV recovery metrics', '2-year warranty'],
      recurringConcerns: ['No mic for taking wrist voice calls'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 47990,
      historicalAvg: 49990,
      previousPrice: 50990
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Gold standard for runners, triathletes, marathon training, and 13-day battery independence.'
    },
    evidence: [
      {
        id: 'ev-w3-1',
        claim: 'SatIQ dual-frequency multi-band GPS positioning accuracy verified',
        source: 'Development dataset',
        confidence: 'Verified Demo',
        timestamp: new Date().toISOString(),
        type: 'SPEC'
      }
    ]
  },
  {
    id: 'smartwatch-4',
    category: 'smartwatch',
    brand: 'Amazfit',
    name: 'Amazfit GTR 4 Smart Watch with Dual-Band GPS - Superspeed Black',
    price: 16999,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    specifications: {
      processor: 'Huangshan 2S Chip',
      displaySizeInches: 1.43,
      resolution: '466 x 466 HD AMOLED',
      refreshRateHz: 60,
      batteryHours: 336, // 14 days
      chargingWatts: 5,
      hasGPS: true,
      callingSupport: true,
      fitnessSensors: ['BioTracker 4.0 PPG Biometric Sensor', 'SpO2', 'Heart Rate', 'Stress', 'Sleep Quality'],
      waterResistance: '5 ATM',
      os: 'Zepp OS 2.0',
      weightKg: 0.034,
      buildQuality: 'Aluminum alloy middle frame with anti-glare glass bezel'
    },
    listing: {
      marketplace: 'Flipkart',
      sellerName: 'Amazfit Official Retail',
      sellerRating: 4.5,
      sellerReviewsCount: 19800,
      listingId: 'AMAZFIT-GTR4-BLK',
      variant: 'Superspeed Black',
      invoiceProvided: true,
      region: 'India',
      verifiedListing: true
    },
    seller: {
      id: 'seller-amazfit-01',
      name: 'Amazfit Official Retail',
      trustRating: 91,
      isOfficialBrandStore: true,
      fulfillmentRate: 97,
      returnPolicyDays: 7
    },
    condition: 'New',
    warranty: {
      type: '1 Year Amazfit Manufacturer Warranty',
      durationMonths: 12,
      coverage: 'Amazfit India Service Centers',
      status: 'Verified',
      evidence: 'Zepp App Warranty Verified'
    },
    reviews: {
      count: 7800,
      rating: 4.4,
      sentiment: 'Strong',
      positiveThemes: ['14-day battery life hassle free', 'Dual-band circularly-polarized GPS antenna', 'Bluetooth wrist calling'],
      recurringConcerns: ['Third-party app ecosystem is small compared to Wear OS'],
      confidence: 'High'
    },
    priceHistory: {
      historicalLow: 14999,
      historicalAvg: 16499,
      previousPrice: 17999
    },
    saleTiming: {
      recommendation: 'BUY NOW',
      explanation: 'Incredible value for 14-day battery, circular AMOLED screen, and dual-band GPS.'
    },
    evidence: []
  }
];
