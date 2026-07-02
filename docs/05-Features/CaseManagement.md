# Feature: Case Management

## 1. Purpose
While CrimeGPT focuses on intelligence, a basic **Case Management** module is required to organize the FIRs, track investigation status, and assign personnel. This acts as the structured backbone that the AI analyzes.

## 2. Target Users
- Station House Officers (SHOs)
- Administrators

## 3. Core Functionality
- **List View:** A paginated, sortable table of all FIRs within the user's jurisdiction.
- **Status Tracking:** Ability to update a case status (e.g., Open, Under Investigation, Chargesheet Filed, Closed).
- **Assignment:** SHOs can assign specific cases to specific Investigating Officers (IOs).
- **Manual Data Entry:** A form to manually input structured metadata if the automated PDF OCR ingestion fails or is incomplete.

## 4. Technical Workflow

### 4.1. Data Retrieval
- The Next.js frontend fetches the list of cases via a `GET /api/cases` endpoint hosted on **Catalyst Functions**.
- To ensure fast loading, the Catalyst Function queries the structured `FIR_Metadata` table in the **Catalyst Data Store**.
- Pagination is handled at the database level (`LIMIT` and `OFFSET`) to ensure performance even with thousands of records.

### 4.2. Updates and Transactions
- When an SHO changes a case status or assigns an officer, a `PATCH /api/cases/[id]` request is sent.
- The Catalyst Function updates the record in the Data Store and simultaneously writes an entry to the `Audit_Logs` table in a single database transaction.

## 5. Integration with Catalyst Search
To allow officers to quickly find a case in the List View (e.g., typing a suspect's name into a search bar above the table):
- The search bar does NOT use the Vector DB (as it's a simple metadata lookup).
- Instead, it pings the **Catalyst Search** API, which provides sub-500ms keyword matching across the `FIR_Metadata` columns, returning the results to update the UI table instantly.

## 6. Security Rules
- An IO can only view cases assigned to them or their station.
- An SHO can assign cases to anyone within their station but cannot assign cases to officers in a different district.
- These rules are hardcoded into the RBAC middleware of the Catalyst Functions handling the `/api/cases` endpoints.
