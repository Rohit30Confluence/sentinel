import { BaseModelAdapter, StreamCallbacks } from './base.adapter.js';
import { ChatStreamRequest } from '../types/index.js';
import { knowledgeRetriever, RetrievedChunk } from '../rag/retriever.js';

export class MockAdapter extends BaseModelAdapter {
  providerName = 'mock';

  async streamChat(
    req: ChatStreamRequest,
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const startTime = Date.now();
    const lastMessage = req.messages[req.messages.length - 1];
    const userQuery = lastMessage?.content?.trim() || 'Tell me about ThatJoint';

    // 1. Retrieve knowledge chunks
    const retrievedChunks = await knowledgeRetriever.retrieve(userQuery, 3);
    const isRelevant = knowledgeRetriever.isQueryRelevant(userQuery, retrievedChunks);

    let responseMarkdown = '';
    const citations: string[] = [];

    if (!isRelevant) {
      responseMarkdown = `I am **Sentinel AI**, the grounded intelligence terminal for **THΛTJOINT** operations.

I can only assist with property management operations, platform modules, the 5-step operations rhythm, statutory compliance & tenant KYC, pricing tiers, and resident portfolio records within our operational scope.

Please feel free to ask about:
- **01 Platform Modules**: Single-family, Communities, Short-term, or Portfolio ops.
- **02 Operations Rhythm**: Capture, Connect, Coordinate, Control, and Prove.
- **03 Rollout Markets**: India tech corridors (Maharashtra, Karnataka) and GCC deployments.
- **04 Pricing Tiers**: Pilot Deploy, Growth Portfolio, and Sovereign Dedicated plans.
- **05 Compliance & KYC**: Foreign National Form C (FRRO reporting) and DPDP Act 2023.
- **06 Payment Rails**: e-NACH, UPI AutoPay, Stripe, Zoho Books, and PayU Virtual VAN.`;
    } else {
      // Collect citations
      for (const item of retrievedChunks) {
        if (!citations.includes(item.chunk.sourceFile)) {
          citations.push(item.chunk.sourceFile);
        }
      }

      // Synthesize response based on query and retrieved context
      responseMarkdown = this.synthesizeGroundedResponse(userQuery, retrievedChunks, citations);
    }

    // Split into token words for live streaming
    const words = responseMarkdown.split(/(\s+)/);

    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) {
        break;
      }
      callbacks.onToken(words[i]);
      // Small natural typing delay for realistic streaming
      await new Promise((res) => setTimeout(res, Math.floor(Math.random() * 15) + 10));
    }

    if (callbacks.onMetadata) {
      const durationMs = Date.now() - startTime;
      callbacks.onMetadata({
        model: 'mock-sentinel',
        provider: 'mock',
        promptTokens: Math.ceil(userQuery.length / 4),
        completionTokens: Math.ceil(responseMarkdown.length / 4),
        totalTokens: Math.ceil((userQuery.length + responseMarkdown.length) / 4),
        durationMs,
        citations
      });
    }
  }

  private synthesizeGroundedResponse(
    query: string,
    chunks: RetrievedChunk[],
    citations: string[]
  ): string {
    const lower = query.toLowerCase();
    const primaryChunk = chunks[0]?.chunk;
    const refTag = citations.length > 0 ? citations.map((c) => `\`[REF: ${c}]\``).join(' ') : '`[REF: 01_platform_modules.md]`';

    // 1. Single-family vs Communities or Platform Modules
    if (lower.includes('module') || lower.includes('single-family') || lower.includes('communities') || lower.includes('platform')) {
      return `### THΛTJOINT / Platform Architecture & Modules

THΛTJOINT connects rent, residents, repairs, and documents into **one continuous property operating system** tailored to four distinct rental models:

1. **01 / Single-Family Homes**:
   - *Operating rhythm*: Address-attached continuous ledger from move-in to renewal.
   - *Key workflows*: Home + resident history, automated maintenance ticketing with scoped vendor dispatches, and renewal context (historic spend, rent punctuality).
2. **02 / Communities & Co-Living**:
   - *Operating rhythm*: Bed and room-level granularity (Single rooms, Double shared, Double single-occupancy).
   - *Key workflows*: Real-time inventory allocation, roommate preferences, digital KYC dossiers, and shared utility/meal subscription billing.
3. **03 / Short-Term & Hybrid Rentals**:
   - *Operating rhythm*: Frictionless turnover for corporate housing and flexible stays.
   - *Key workflows*: Contactless digital check-in, dynamic housekeeping dispatch, and time-gated access PINs.
4. **04 / Portfolio Operations**:
   - *Operating rhythm*: Executive cross-tower and cross-corridor visibility.
   - *Key workflows*: Real-time multi-currency consolidation (AED, SAR, INR, USD), live occupancy trends, and automated ERP integration (Yardi, RealPage, SAP).

---
${refTag}`;
    }

    // 2. 5-step rhythm
    if (lower.includes('rhythm') || lower.includes('5-step') || lower.includes('capture') || lower.includes('prove') || lower.includes('coordinate')) {
      return `### THΛTJOINT / The 5-Step Operations Rhythm

THΛTJOINT structures daily property operations from first signal to finished work across five accountable steps:

- **01 / Intake (Capture)**: A request, rent auto-debit, document, or resident message enters once without losing where it came from.
- **02 / Context (Connect)**: The physical home (e.g. \`HOME 014\`), resident dossier, active lease, and maintenance history attach to one shared property record.
- **03 / Ownership (Coordinate)**: Every task has a designated owner, SLA timer, and status gate (\`01 Assigned\` → \`02 In Progress\` → \`03 Review\` → \`Closed\`).
- **04 / Permission (Control)**: Role-Based Access Control (RBAC) ensures owners, managers, vendors, and tenants see only what they need. *"Your home. Your server. Your data."*
- **05 / Record (Prove)**: Tamper-evident, audit-ready event timelines log every action with immutable timestamps (e.g. \`09:14 Request captured\` → \`09:16 Access confirmed\` → \`14:42 Work closed\`).

---
${refTag}`;
    }

    // 3. Compliance, KYC, Form C, DPDP
    if (lower.includes('compliance') || lower.includes('kyc') || lower.includes('form c') || lower.includes('frro') || lower.includes('dpdp') || lower.includes('police')) {
      return `### THΛTJOINT / Statutory Compliance & Tenant KYC

THΛTJOINT natively enforces statutory tenancy regulations across Indian and Gulf corridors:

1. **Foreign National Form C & FRRO Compliance (India)**:
   - Mandatory online reporting within **24 hours** of accommodating any foreign national under the Foreigners Act.
   - Tracks passport numbers, visa validity, arrival dates, and unique FRRO reference numbers.
   - *Verified Resident Examples*:
     * **Lukas Weber** (\`RES-007\`): German national, Siemens Technology India (Kharadi), Room \`D-Share-4\`, FRRO Ref \`FRRO-MH-PUN-2023-88412\`.
     * **Elena Rostova** (\`RES-019\`): Russian national, Infosys BPM Pune, Room \`D-Single-9\`, FRRO Ref \`FRRO-MH-PUN-2024-11904\`.
     * **Kenji Takahashi** (\`RES-034\`): Japanese national, KPIT Technologies, Room \`Single-4\`, FRRO Ref \`FRRO-MH-PUN-2023-55319\`.
2. **Domestic Tenant KYC & Police Verification**:
   - Automated 8-digit Aadhaar masking pursuant to UIDAI mandates.
   - One-click generation of State Police Tenant Verification packets (Form A / Form B).
3. **DPDP Act 2023 Compliance**:
   - Granular digital consent logging, AES-256 encrypted sovereign storage, and automated data archival 90 days post-lease expiry.

---
${refTag}`;
    }

    // 4. Pricing & Plans
    if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') || lower.includes('tier') || lower.includes('aed') || lower.includes('plan')) {
      return `### THΛTJOINT / Predictable Global Investment & Sovereign Tiers

THΛTJOINT provides three deployment tiers with transparent monthly rates and a **20% discount on annual billing**:

| Tier | Capacity | AED / mo (Monthly) | AED / mo (Annual -20%) | USD / mo | Key Inclusions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01 Pilot Deploy** | Up to 50 Units | **AED 914** | **AED 731** | $249 | Sentinel AI Companion, Rent & Repairs Dashboard, Tenant KYC Checklist. |
| **02 Growth Portfolio** *(Most Popular in GCC)* | Up to 250 Units | **AED 2,567** | **AED 2,054** | $699 | Multi-Gateway Rails, Late-Night Delivery Webhooks, Form C / DPDP Auditing, 3D Tour Sync. |
| **03 Enterprise Sovereign** | Unlimited Units | **AED 5,505** | **AED 4,404** | $1,499 | Dedicated Sovereign Database (GCC / On-Prem), Custom ERP Webhooks (Yardi/SAP), 99.99% SLA. |

*Multi-currency pricing engine supports SAR, QAR, KWD, BHD, OMR, INR, and USD.*

---
${refTag}`;
    }

    // 5. Payment Rails & Billing Ledger
    if (lower.includes('payment') || lower.includes('enach') || lower.includes('autopay') || lower.includes('stripe') || lower.includes('payu') || lower.includes('ledger') || lower.includes('billing')) {
      return `### THΛTJOINT / 5-Gateway Multi-Rail Payment Architecture

THΛTJOINT automates recurring rent collection and expense reconciliation across 5 integrated rails:

1. **Cashfree e-NACH Auto-Debit (\`CASHFREE_ENACH_v3\`)**: Scheduled mandate recurring bank debit for domestic accounts.
2. **Razorpay UPI AutoPay (\`RAZORPAY_SUB_API_v2\`)**: In-app recurring UPI subscriptions (GPay, PhonePe, Paytm).
3. **Stripe Tokenization (\`STRIPE_IN_BILLING_v1\`)**: Credit/debit card tokenization for expats and cross-border currency billing (AED, USD, EUR).
4. **Zoho Books Corporate B2B Payroll (\`ZOHO_BOOKS_B2B_API\`)**: Direct corporate sponsor invoicing (Siemens, Infosys, Barclays).
5. **PayU Virtual Accounts / VAN (\`PAYU_VIRTUAL_ACCT_v2\`)**: Unique virtual IBAN/account per resident for instant IMPS/NEFT auto-reconciliation.

**Benchmark 3-Year Portfolio Financials (Pune Corridor)**:
- **Total Revenue**: **₹2,69,02,673 (₹2.69 Cr)** across 1,440 reconciled monthly records.
- **Breakdown**: Base Rent ₹1.77 Cr (66.1%), Meal Plans ₹52.4 Lakh (19.5%), Late-Night Food Delivery Webhooks ₹38.6 Lakh (14.4%, 10,471 orders).

---
${refTag}`;
    }

    // 6. Rollout Markets
    if (lower.includes('rollout') || lower.includes('market') || lower.includes('pune') || lower.includes('india') || lower.includes('gcc') || lower.includes('dubai') || lower.includes('riyadh')) {
      return `### THΛTJOINT / Geographic Rollout Markets

THΛTJOINT rollout is executed through a 3-stage process (**01/LISTEN** Find the friction, **02/CONFIGURE** Shape the workspace, **03/LEARN** Begin deliberately):

- **India Tech Corridors**:
  - *Maharashtra (MH)*: Pune Tech Corridor (Hinjawadi, Kharadi, Viman Nagar, Magarpatta) & Mumbai MMR.
  - *Karnataka (KA)*: Bangalore Outer Ring Road, Whitefield, Koramangala.
  - *Delhi NCR (DL)*: Gurgaon Cyber City, Noida Sector 62.
  - *Telangana (TS)*: Hyderabad HITEC City & Financial District.
  - *Tamil Nadu (TN)*, *Gujarat (GJ - GIFT City)*, *Madhya Pradesh (MP)*, *Rajasthan (RJ)*.
- **GCC & Gulf Sovereign Deployments**:
  - *UAE*: Dubai (Business Bay, Marina, JVC) & Abu Dhabi with Ejari alignment.
  - *Saudi Arabia (KSA)*: Riyadh (KAFD) & Jeddah with Ejar compliance.
  - *Qatar, Kuwait, Bahrain, Oman*: Institutional residential compounds.

---
${refTag}`;
    }

    // Default grounded synthesis from retrieved chunks
    const chunkTitles = chunks.map((c) => c.chunk.title).join(', ');
    const snippets = chunks.map((c) => c.chunk.content).join('\n\n');

    return `### THΛTJOINT / Operations Intelligence

Based on verified operational records for **${chunkTitles}**:

${snippets.slice(0, 1000)}...

---
${refTag}`;
  }
}
