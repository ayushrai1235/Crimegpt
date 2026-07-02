# Non-Functional Requirements (NFRs)

## Overview
The **Non-Functional Requirements (NFRs)** define how the **CrimeGPT** system performs rather than what it does. These requirements cover performance, scalability, security, and reliability. Given the sensitive nature of law enforcement data, these NFRs are treated as critical fail/pass criteria for deployment.

The **Zoho Catalyst-first** architecture natively satisfies many of these requirements, but they must still be explicitly defined and tested.

## 1. Security & Privacy

### 1.1. Data Encryption
- **At Rest:** All data stored in **Catalyst Data Store** and **Catalyst File Store** MUST be encrypted at rest using industry-standard AES-256 encryption.
- **In Transit:** All communication between the frontend (Next.js), Catalyst backend, and external APIs (LLMs, Neo4j) MUST be encrypted using TLS 1.2 or higher (HTTPS).

### 1.2. Zero-Trust Architecture
- **Frontend Isolation:** The frontend application MUST NEVER communicate directly with any database (Data Store, File Store, Neo4j, Vector DB) or external AI model. 
- **Mediation:** 100% of requests MUST route through **Catalyst Functions**, which act as the secure API Gateway enforcing RBAC.

### 1.3. Data Localization
- **Compliance:** As per Indian government regulations for law enforcement data, all primary data (Catalyst Data Store, File Store) MUST reside in data centers located within the geographic boundaries of India. *(Note: Ensure the Catalyst region is set to IN).*

## 2. Performance & Latency

### 2.1. API Response Times
- **Standard CRUD:** 95% of standard database read/write requests (e.g., loading user profile, saving a setting) MUST return within **200 milliseconds**.
- **Catalyst Search:** Text-based indexing queries MUST return within **500 milliseconds**.
- **AI Streaming:** For complex CrimeGPT queries requiring RAG and LLM processing, the Time To First Byte (TTFB) of the streaming text response MUST be **under 1.5 seconds**.

### 2.2. Dashboard Load Time
- **Requirement:** The Commissioner's macro-dashboard MUST visually render and display data within **1 second** on a standard 4G network.
- **Enabler:** This necessitates aggressive use of **Catalyst Cache** to serve pre-calculated statistics rather than querying the database on load.

## 3. Reliability & Availability

### 3.1. System Uptime
- **Requirement:** The core system (Authentication, Functions, Data Store) MUST achieve **99.99%** uptime.
- **Enabler:** The serverless, auto-scaling nature of Zoho Catalyst natively supports high availability without manual load balancer configuration.

### 3.2. Graceful Degradation
- **Requirement:** If an external service (e.g., OpenAI/Gemini API or Neo4j) goes down, the core application MUST NOT crash.
- **Handling:** **Catalyst Functions** must catch the timeout, log the error, and return a polite error message to the user ("AI Analysis is currently unavailable. Standard search is still active."), allowing standard FIR retrieval to continue.

## 4. Scalability

### 4.1. Data Volume
- **Requirement:** The architecture MUST support the ingestion and indexing of at least 5 million historical FIRs without a degradation in search latency.
- **Enabler:** Utilizing **Catalyst Search** and a dedicated Vector Database ensures search times remain logarithmic/constant rather than linear.

### 4.2. Concurrent Users
- **Requirement:** The system MUST support up to 5,000 concurrent officers accessing the system simultaneously (e.g., during a major state-wide incident) without performance degradation.
- **Enabler:** **Catalyst Functions** must automatically spin up new instances to handle concurrent request spikes.

## 5. Maintainability

### 5.1. Centralized Logging
- **Requirement:** All application errors, API failures, and security exceptions MUST be centrally logged using **Catalyst Logging/Monitoring** tools.
- **Alerting:** Critical failures (e.g., Database connection lost, Auth service down) MUST automatically trigger an email alert to the IT Operations team.

---
**Next Steps:** Review the [Acceptance Criteria](./AcceptanceCriteria.md) to see how these requirements will be validated during QA.
