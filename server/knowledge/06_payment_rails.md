# THΛTJOINT Payment Rails, Billing Ledger & Automated Reconciliation

## 06 / Payment Architecture
THΛTJOINT integrates 5 distinct payment rails to automate recurring rent collections, utility splits, meal subscriptions, and late-night guest delivery billing.

---

## The 5 Multi-Gateway Payment Rails

1. **Cashfree e-NACH Auto-Debit (`CASHFREE_ENACH_v3`)**:
   - Mandate-based recurring bank debit for domestic bank accounts.
   - Fixed schedule execution on the 1st or 5th of every month.
   - Automatic retry handling for insufficient funds with automated reminder webhooks.
2. **Razorpay UPI AutoPay (`RAZORPAY_SUB_API_v2`)**:
   - Native UPI recurring subscription mandates via resident mobile banking apps (GPay, PhonePe, Paytm).
   - High adoption for young tech professionals in Indian IT corridors.
3. **Stripe Tokenization for International & Cards (`STRIPE_IN_BILLING_v1`)**:
   - Tokenized credit and debit card billing supporting international currencies (USD, EUR, GBP, AED, SAR).
   - Utilized by expat residents, corporate guests, and cross-border transactions.
4. **Zoho Books Corporate B2B Payroll Deduction (`ZOHO_BOOKS_B2B_API`)**:
   - Direct B2B payroll deduction integration for sponsored tech residents (e.g. Siemens, Infosys, Barclays).
   - Invoice generated directly to corporate employer HR/facilities departments with net-30 terms.
5. **PayU Virtual Account Numbers / VAN (`PAYU_VIRTUAL_ACCT_v2`)**:
   - Unique dedicated virtual IBAN/account number assigned to each individual resident or room.
   - Resident transfers via NEFT / RTGS / IMPS; payments auto-reconcile against the ledger in under 60 seconds with zero manual matching.

---

## Benchmark Portfolio Financial Performance (36-Month Pune Dataset)

- **Total Tracking Period**: 36 consecutive months (`November 2023` to `October 2026`).
- **Total Residents**: 40 full-time residents (37 Indian nationals, 3 foreign nationals).
- **Payment Rail Distribution**: Exactly 8 residents per payment gateway.
- **Reconciled Billing Records**: 1,440 monthly line-item records.

### Revenue Breakdown (Total: ₹2,69,02,673 / ~₹2.69 Cr):
1. **Base Room Rent**: `₹17,793,000` (66.14% of total)
   - Double Shared (5 rooms, 10 residents): ₹8,000 / resident / month.
   - Double Single-Occupancy (20 rooms, 20 residents): ₹14,000 / resident / month.
   - Single Room (10 rooms, 10 residents): ₹18,000 / resident / month.
2. **Meal & Dining Subscriptions**: `₹5,244,480` (19.49% of total)
   - 3-tier meal plans (Standard ₹3,200/mo, Executive ₹4,200/mo).
3. **Late-Night Delivery Surcharges & Webhooks**: `₹3,865,193` (14.37% of total)
   - 10,471 total Swiggy / Zomato / Talabat late-night orders recorded.
   - Average order ticket: `₹369.13`.
   - Gate security scanner verifies rider delivery at property perimeter and auto-appends delivery surcharges.

### Top Resident Spenders (3-Year Total):
1. **Aditi Menon** (`RES-022`): `₹767,922` (324 orders, TCS Hinjawadi)
2. **Sneha Pillai** (`RES-016`): `₹766,220` (305 orders, Barclays Kharadi)
3. **Nikhil Singh** (`RES-013`): `₹764,575` (302 orders, Persistent Systems)
4. **Aditya Shah** (`RES-011`): `₹762,537` (292 orders, Bajaj Finserv)
5. **Abhishek Verma** (`RES-027`): `₹760,183` (278 orders, Bajaj Finserv)
