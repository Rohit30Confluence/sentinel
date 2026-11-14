# THΛTJOINT Statutory Compliance, KYC & Statutory Reporting

## 05 / Regulatory & Compliance Framework
THΛTJOINT natively embeds compliance checkpoints into everyday property onboarding, eliminating manual paperwork and legal vulnerabilities.

---

## 1. Domestic Tenant KYC & Police Verification
- **Aadhaar & Identity Verification**:
  - Secure identity ingestion with automated masking of the first 8 digits of Aadhaar numbers pursuant to UIDAI regulations.
  - Corporate verification via employment letter validation or work email domain verification.
- **Police Verification (Tenancy Verification)**:
  - Automated generation of police verification packets (Form A / Form B) conforming to local state police requirements (e.g., Maharashtra Police Tenant Portal, Karnataka Police).
  - Tracks verification submission timestamps, police acknowledgement receipts, and status gates before key handover.

---

## 2. Foreign National Form C & FRRO Compliance (India)
Under the Foreigners Act 1946 and Registration of Foreigners Rules, property operators and co-living managers are legally mandated to submit **Form C** online within **24 hours** of accommodating any foreign national.

### Mandatory Form C Fields Tracked in THΛTJOINT:
- Given name, Surname, Nationality, Gender, Date of Birth.
- Passport Number, Issuing Country, Expiry Date.
- Indian Visa Number, Visa Type (Employment, Business, Student, Tourist), Valid Until.
- Date of Arrival in India, Port of Entry, Previous Address.
- Intended duration of stay, Next Destination.
- Indian Employer / Sponsor organization details.
- Unique FRRO Registration Reference Number.

### Grounded Resident Case Examples (Pune Tech Corridor):
1. **Lukas Weber** (`RES-007`):
   - *Nationality*: German | *Employer*: Siemens Technology India (Kharadi)
   - *Room*: `D-Share-4` | *FRRO Reference*: `FRRO-MH-PUN-2023-88412`
   - *Visa*: Employment Visa (E-Visa)
2. **Elena Rostova** (`RES-019`):
   - *Nationality*: Russian | *Employer*: Infosys BPM Pune (Hinjawadi Phase 2)
   - *Room*: `D-Single-9` | *FRRO Reference*: `FRRO-MH-PUN-2024-11904`
   - *Visa*: Employment Visa
3. **Kenji Takahashi** (`RES-034`):
   - *Nationality*: Japanese | *Employer*: KPIT Technologies (Hinjawadi)
   - *Room*: `Single-4` | *FRRO Reference*: `FRRO-MH-PUN-2023-55319`
   - *Visa*: Business / Long-Term Technical Visa

---

## 3. DPDP Act 2023 (Digital Personal Data Protection Act)
THΛTJOINT complies with India’s Digital Personal Data Protection Act (DPDP Act 2023) and GCC personal data standards:
- **Explicit Consent Records**: Every tenant signs a granular digital consent agreement before document upload specifying purpose of processing (billing, police verification, lease).
- **Data Minimization & Storage Limitation**: KYC documents are encrypted at rest with AES-256 and stored in dedicated sovereign storage partitions.
- **Right to Erasure & Purpose Expiry**: Automated data archiving and sanitization triggers 90 days post-lease termination, subject to statutory tax record retention requirements.
- **Role-Based Access Logs**: Property managers can view status without exporting raw identity documents; all document access events are logged with user ID and timestamp.
