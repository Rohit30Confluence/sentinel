# THΛTJOINT 5-Step Operations Rhythm & Security Model

## 02 / The Core Operating Rhythm
THΛTJOINT structures daily property operations into a strict 5-step rhythm that flows from first signal to finished work. This ensures requests, payments, documents, and conversations never drop through the cracks.

### Step 01: Capture (Intake)
- **Principle**: A request, payment, document, or resident signal enters once—without losing where it came from.
- **Workflow**:
  - Webhooks and resident portal messages capture signals immediately (e.g. maintenance ticket, rent auto-debit, guest registration).
  - Normalizes external inputs from WhatsApp, resident web portals, banking webhooks, and vendor SMS into a unified message object.
  - Live status pulse indicates active intake across buildings.

### Step 02: Connect (Context)
- **Principle**: The home, resident, owner, documents, and history stay attached to one shared property record.
- **Workflow**:
  - The incoming event is mapped to the physical unit (e.g., `HOME 014` or `Room D-Single-9`).
  - Pulls the active lease, resident identity records, past maintenance invoices, and warranty documents into one consolidated view.
  - Provides instant context to building managers without manual folder hunting.

### Step 03: Coordinate (Ownership)
- **Principle**: Every next step has an owner, a status, and a clear place in the operating timeline.
- **Workflow**:
  - Tasks move through structured status gates: `01 Assigned` -> `02 In Progress` -> `03 Review & Verification` -> `Closed`.
  - Service Level Agreements (SLAs) are monitored with automatic escalation if tickets remain unacknowledged.
  - Direct vendor assignment with time windows and budget pre-authorizations.

### Step 04: Control (Permission & Security)
- **Principle**: Access follows responsibility. People see what they need, while sensitive records stay protected.
- **Workflow**:
  - Role-Based Access Control (RBAC):
    * **Owners**: Financial performance, asset yields, capital expenditure approvals.
    * **Property Managers**: Daily operations, lease executions, resident communications.
    * **Field Vendors**: Scoped work orders, photo upload proofs, completion signatures.
    * **Residents**: Personal billing history, repair status, digital keys.
  - Zero cross-tenant data leakage.

### Step 05: Prove (Record & Audit)
- **Principle**: Important changes remain visible in an accountable history, from first action through final resolution.
- **Workflow**:
  - Append-only audit trails record timestamps, user IDs, and changed state parameters.
  - Example trail:
    * `09:14` - Repair request captured via resident portal.
    * `09:16` - Vendor work order generated and approved.
    * `14:42` - Work signed off by resident; ticket closed; invoice reconciled.
  - Audit logs are tamper-evident and exportable for statutory inspections or investor reporting.

## 🛡️ Security Architecture: "Your Home. Your Server. Your Data."
- **Data Sovereignty**: On-premise, local Gulf/GCC cloud, or private VPC deployment options.
- **Encryption**: TLS 1.3 in transit and AES-256 for resting data and document repositories.
- **Compliance**: Engineered to conform with India's DPDP Act 2023 and GCC data privacy regulations.
