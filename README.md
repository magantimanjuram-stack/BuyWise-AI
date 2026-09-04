# BuyWise AI — AI Commerce Verification & Decision Agent

> **Tagline:** “Make smarter purchases, not cheaper ones.”  
> **Primary Purpose:** Help users make smarter purchase decisions by evaluating product specifications, user requirements, product fit, feature-to-price value, current price, historical price trends, sale timing, review sentiment, seller trust, listing authenticity, product condition, warranty coverage, evidence quality, and purchase risk to answer:  
> **“Should this user buy this product?”** rather than **“Which product is cheapest?”**

---

## 🌟 Product Philosophy: CHEAPEST ≠ BEST

Traditional shopping platforms and price comparison tools push the lowest price tag, regardless of whether the product fails critical user requirements, comes from an unverified seller, or lacks a valid manufacturer warranty.

**BuyWise AI operates on a fundamental differentiator:**
- A more expensive product wins if it provides significantly better fit, spec compliance, trust, and lower purchase risk.
- A cheaper product loses if it fails hard user requirements or exhibits poor trust/risk characteristics.
- Every recommendation is explainable and verifiable through an evidence ledger and decision trace pipeline.

---

## 📐 System Architecture

```
User Input (Category, Budget, Purpose, Natural Language Requirements)
                             ↓
                 [Frontend: React 18 + Vite]
                             ↓
              [REST API: Express + TypeScript]
                             ↓
              ┌──────────────────────────────┐
              │   BuyWise Agent Orchestration│
              └──────────────┬───────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
Category Normalization   Budget Filter      Requirement Parser
(Alias Resolver)      (Strict Price Gate)  (Hard vs Preference)
     │                       │                       │
     └───────────────────────┼───────────────────────┘
                             ▼
                   Product Fit Scoring (0-100)
                   Feature / Value Scoring (0-100)
                   Price & Sale Timing Intelligence
                   Review Sentiment & Theme Analysis
                   Seller & Listing Verification
                   Warranty Intelligence
                   Trust Engine (0-100)
                   Purchase Risk Engine (0-100)
                             │
                             ▼
             Synthesized Purchase Confidence (0-100)
                             │
                             ▼
               Backend Final Decision Gates
 (EXCELLENT BUY | GOOD BUY | CONSIDER | CAUTION | DO NOT RECOMMEND)
                             │
                             ▼
       Explanation Engine + Alternatives + Decision Trace
                             │
                             ▼
                  Explicit User Approval
                             │
                             ▼
            Razorpay Checkout (Server-Side Order)
                             │
                             ▼
           HMAC-SHA256 Server Signature Verification
                             │
                             ▼
                Verified Payment & Audit Log
```

---

## ✨ Key Features & Capabilities

1. **6 Supported Categories & Aliases**:
   - **Smartphone**: `phone`, `mobile`, `mobile phone`, `smartphone`
   - **Laptop**: `laptop`, `notebook`
   - **TV**: `tv`, `television`, `smart tv`
   - **Headphones**: `headphone`, `headphones`, `wireless headphones`
   - **Earbuds**: `earbud`, `earbuds`, `bluetooth`, `bluetooth earbuds`, `earbuds/bluetooth`, `wireless earbuds`
   - **Smartwatch**: `smartwatch`, `smart watch`, `watch`
2. **Category Budget Controls**: Enforces minimum bounds (Smartphone ₹20k, Laptop ₹60k, TV ₹60k, Headphones ₹15k, Earbuds ₹15k, Smartwatch ₹15k). Never recommends products above selected budget.
3. **Natural Language Requirement Engine**: Extracts numeric constraints (RAM, Storage, Refresh Rate, Camera, Battery) and enforces hard requirements vs preference penalties.
4. **Purpose-Aware Dynamic Weighting**: Supports Coding, AI Development, Gaming, Photography, Work, Movies, Music, Calls, Fitness, Travel, etc.
5. **Score Visualizations (0–100)**:
   - **Product Fit Score**
   - **Feature-to-Price Value Score**
   - **Trust Score**
   - **Purchase Risk Score** (lower is better: LOW, MODERATE, HIGH, CRITICAL)
   - **Purchase Confidence Score**
   - **Data Confidence Score** (95/100 for development dataset)
6. **Price & Sale Timing Intelligence**: Tracks historical low, average price, price status, and sale timing advice (**BUY NOW** / **WAIT** / **CONSIDER**).
7. **Verification Subsystems**: Verifies seller credentials, official brand status, GST tax invoice, condition (New, Refurbished, Used), and warranty coverage (Verified, Partially Verified, Unable to Verify).
8. **Decision Gates**: Failing hard requirements or critical risk (>75) automatically forces **DO NOT RECOMMEND**, blocking normal purchase.
9. **Explainable AI**: Answers "Why did this product win?", "Strengths", "What to watch", and "Why alternatives lost".
10. **Alternatives & Comparison Matrix**: Top 2 alternative products within budget + full comparison table.
11. **Evidence Ledger & Decision Trace**: Transparent log of all claim sources and step-by-step agent execution steps.
12. **Razorpay Test Mode Payment**: Server-side order creation (paise amount), frontend checkout, and server-side HMAC-SHA256 signature verification with audit logging.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Lucide Icons, Custom Modern Startup Design System (Glassmorphic dark aesthetic)
- **Backend**: Node.js, Express, TypeScript, Razorpay Node SDK / HMAC crypto module
- **Testing**: Vitest (Unit tests, Budget tests, Requirement tests, Scoring tests, Decision gate tests, Payment security tests, 6-Category Smoke test)
- **Data**: Structured 6-category development dataset (`server/src/data/dataset.ts`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= v18.x
- npm >= v9.x

### 2. Installation
```bash
# Install all root, server, and client dependencies
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```env
PORT=5000
NODE_ENV=development
RAZORPAY_KEY_ID=rzp_test_buywise_demo_key
RAZORPAY_KEY_SECRET=secret_buywise_demo_key_12345
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Running Locally
Start backend and frontend concurrently:
```bash
npm run dev
```
Or start individually:
- Backend: `npm run dev:server` (http://localhost:5000)
- Frontend: `npm run dev:client` (http://localhost:5173)

---

## 🧪 Testing & Validation

Run the complete test suite:
```bash
# Run BuyWise smoke & unit test suite
npm run test:buywise

# Run typecheck
npm run typecheck

# Run production build
npm run build
```

---

## 🔐 Payment Security & Audit

1. **Server-Side Order Creation**: Product prices are fetched from the backend dataset and converted from INR to paise (Amount = INR * 100). The browser cannot alter the payable amount.
2. **Server-Side HMAC Signature Verification**: Razorpay response signatures are verified using `crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)`.
3. **Payment Audit Log**: Verified transactions are recorded in `server/data/audit.ts`. Sensitive card numbers, CVV, or PINs are **never** stored or logged.

---

## 💡 Demo Scenarios

1. **Laptop Coding Scenario**: Select Laptop, Budget ₹1,30,000, Purpose: Coding & AI Development, Prompt: "16GB RAM, 512GB SSD, good processor".
   - *Result*: MacBook Air M3 wins with 98/100 Purchase Confidence.
2. **Hard Requirement Fail Scenario**: Select Laptop, Budget ₹70,000, Prompt: "32GB RAM required".
   - *Result*: No product matches 32GB RAM within budget -> Decision engine returns clear "No suitable product found" explanation.
3. **Refurbished Seller Risk Warning**: Select Laptop, Budget ₹65,000, HP Victus Refurbished candidate has seller trust 42/100.
   - *Result*: Purchase Risk score is HIGH (65/100). Buyer is warned with BUY WITH CAUTION / DO NOT RECOMMEND.

---

## 📜 Dataset Honesty Disclaimer

The dataset utilized during development is a **Development Dataset** containing realistic specifications, historical pricing, seller credentials, and warranty information. It is explicitly labeled as demo data to maintain total AI transparency.
