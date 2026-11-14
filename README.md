# THΛTJOINT. / SENTINEL AI — Rental Operations Intelligence

[![Node Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**THΛTJOINT / SENTINEL AI** is a production-grade, full-stack rental operations intelligence terminal. Designed with the exact architectural visual language of [THΛTJOINT](https://rohit30confluence.github.io/ThatJoint) (*"Everything. Connected."*), it operates on a strictly service-provider-governed knowledge base delivering real-time grounded SSE streaming responses across rental platform modules, 5-step operational rhythms, statutory compliance, multi-currency pricing, and payment rails.

---

## ✨ System Architecture & Visual Identity

### 1. Exact Visual Match to THΛTJOINT
- **Architectural Palette**: Warm alabaster canvas (`#F7F5F0`), elevated white cards (`#FFFFFF`), deep charcoal ink (`#141413`), muted warm slate secondary text (`#5C5A55`), subtle `1px` architectural hairline dividers (`#E4E0D8`), ThatJoint purple accent (`#A459FF`), and `● Live` status pulse (`#2D8A78`).
- **Typography**: Google Fonts pairing `Barlow Condensed` for bold section headings, `DM Sans` for UI and chat prose, `Newsreader` for editorial italic emphasis (*Everything. Connected.*), and `JetBrains Mono` for numbered operational markers (`01`, `02`, `03`).
- **Numbered Navigation & Terminal Markers**:
  - `01 Chat Terminal`: Active grounded conversational interface.
  - `02 Active Knowledge`: Verified service-provider dataset inspector.
  - `03 Operations Context`: 5-step lifecycle tracking (Capture → Connect → Coordinate → Control → Prove).
  - Signature `↗` directional action buttons and sharp architectural card corners (`rounded-sm`).

### 2. Strictly Service-Provider Managed Knowledge Base (`server/knowledge/`)
- Zero user-facing file upload buttons, user knowledge upload drawers, or personal API-key modal clutter.
- **Pre-loaded Initial Datasets**:
  1. `01_platform_modules.md`: Single-family, Communities, Short-term, and Portfolio ops.
  2. `02_operations_rhythm.md`: The 5-step rhythm (Intake/Capture, Context/Connect, Ownership/Coordinate, Permission/Control, Record/Prove), *"Your home. Your server. Your data."*
  3. `03_rollout_markets.md`: Indian IT corridors (Maharashtra Pune Tech Corridor, Karnataka Bangalore) and GCC expansion (UAE Dubai/Abu Dhabi, Saudi Riyadh).
  4. `04_pricing_and_plans.md`: Pilot Deploy (AED 914 / $249), Growth Portfolio (AED 2,567 / $699), and Enterprise Sovereign Cloud (AED 5,505 / $1,499) with 20% annual discount.
  5. `05_compliance_and_kyc.md`: Mandatory 24h Foreign National Form C & FRRO compliance (Lukas Weber, Elena Rostova, Kenji Takahashi), domestic tenant police verification, and DPDP Act 2023.
  6. `06_payment_rails.md`: 5 payment rails (Cashfree e-NACH, Razorpay UPI AutoPay, Stripe, Zoho Books, PayU Virtual VAN), ₹2.69 Cr 36-month reconciled ledger.
  7. `07_portfolio_residents_data.json`: 40 tech residents, room inventory, employer distribution.

### 3. Hybrid RAG & Grounded Streaming Engine
- **Automated Startup Indexer** (`server/src/rag/indexer.ts`): Automatically parses `.md`, `.txt`, `.json`, `.csv` into overlapping ~500-char passages with metadata and keywords, saved to `server/data/knowledge_index.json`.
- **Hybrid Retriever** (`server/src/rag/retriever.ts`): High-speed BM25 / token-frequency scoring with domain synonym expansion and stop-word filtering. Works 100% offline with zero dependencies, and supports frontier models when `.env` keys are configured.
- **Architectural Citations**: Responses feature subtle citation tags at the bottom: `[REF: 01_platform_modules.md]`.
- **Domain Guardrails**: Politely declines queries unrelated to ThatJoint operations.
- **Hot-Reload Reindex Endpoint**: `POST /api/admin/reindex` (protected by optional `ADMIN_SECRET` in `.env`).

---

## 🚀 Quickstart

```bash
git clone https://github.com/Rohit30Confluence/sentinel.git
cd sentinel

# 1. Install workspace dependencies
npm install

# 2. Build TypeScript packages
npm run build

# 3. Launch both backend API and frontend
npm run dev
```

- **Chat Terminal**: `http://localhost:5174` (or `http://localhost:5173`)
- **Backend API**: `http://localhost:3001`
- **Knowledge Status**: `http://localhost:3001/api/knowledge/status`

---

## 🧪 Automated Testing

```bash
npm test
```
Verifies knowledge indexing, hybrid RAG retrieval, grounded streaming, citation tags, and out-of-domain query guardrails.

---

## 🛡️ License

Distributed under the [MIT License](LICENSE).
