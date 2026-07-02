# Constraints

## Overview
The **Constraints** document identifies the technical, legal, and operational limitations that the development team must operate within while building the **CrimeGPT** platform. Recognizing these constraints early ensures the architecture remains viable throughout the project lifecycle.

---

## 1. Technical & Architectural Constraints

### 1.1. The Zoho Catalyst Mandate
- **Constraint:** The system MUST be built using a **Catalyst-first architecture**. 
- **Impact:** The team cannot use AWS Lambda, Firebase, Supabase, or custom Node.js servers for core backend logic. All backend services, authentication, and primary databases must utilize Zoho Catalyst. External services (like Neo4j or LLM APIs) can only be used if Catalyst does not provide an equivalent native service.

### 1.2. LLM API Rate Limits and Latency
- **Constraint:** External Large Language Models (e.g., OpenAI, Gemini) have strict API rate limits (Requests Per Minute/Tokens Per Minute) and inherent network latency.
- **Impact:** The system cannot query the LLM for every minor UI interaction. **Catalyst Cache** must be used aggressively to store frequently asked questions or daily briefings. RAG chunking must be highly optimized to minimize token usage per query.

### 1.3. Unstructured Data Quality
- **Constraint:** Historical FIRs are often scanned PDFs with poor OCR quality, containing handwritten notes in a mix of English and Kannada.
- **Impact:** The RAG pipeline and Vector Database indexing will not be 100% perfect. The system must degrade gracefully and the UI must allow officers to manually flag poorly transcribed data.

## 2. Legal & Compliance Constraints

### 2.1. Data Localization
- **Constraint:** Indian law mandates that sensitive law enforcement data (FIRs, suspect PII) cannot leave the country.
- **Impact:** The Zoho Catalyst project must be provisioned in the **Indian Data Center (IN region)**. Any external LLM API used must guarantee that data is processed within India and NOT used to train their foundational models (Zero Data Retention policy).

### 2.2. Chain of Custody
- **Constraint:** Digital evidence must maintain a strict chain of custody to be admissible in Indian courts.
- **Impact:** The system must utilize the immutable audit logs in the **Catalyst Data Store** to prove exactly who uploaded, viewed, or modified an evidence file in the **Catalyst File Store**.

## 3. Operational Constraints

### 3.1. Hackathon/Rapid Development Timeline
- **Constraint:** The MVP must be built and demonstrated within a highly compressed timeframe (e.g., 4 weeks).
- **Impact:** Scope must be strictly managed. "Nice-to-have" features like Voice-to-Text in regional dialects or live CCTV integration must be deferred to the Future Scope. The focus must remain entirely on text-based Conversational AI and Predictive Analytics.

### 3.2. End-User Technical Literacy
- **Constraint:** Many end-users (veteran police officers) are not highly tech-savvy and resist complex software interfaces.
- **Impact:** The frontend UI (Next.js) must be extremely intuitive, mimicking familiar chat applications (like WhatsApp). Complex advanced search filters should be hidden under an "Advanced" tab to avoid overwhelming standard users.

---
**Next Steps:** Review the [Risks](./Risks.md) document to see how we plan to mitigate potential failures related to these constraints.
