# Assumptions

## Overview
The **Assumptions** document lists the underlying premises and beliefs upon which the **CrimeGPT** project plan, architecture, and timeline are based. If any of these assumptions are proven false during development, it may necessitate a significant shift in scope, architecture, or project delivery timelines.

---

## 1. Technological Assumptions

### 1.1. Zoho Catalyst Capabilities
- **Assumption:** **Zoho Catalyst** provides all the necessary foundational BaaS (Backend-as-a-Service) capabilities required for an enterprise-grade application, including robust Authentication, Serverless Functions (Node.js/Python), a scalable Relational Data Store, and a secure File Store.
- **Impact if False:** If Catalyst lacks a critical feature (e.g., streaming HTTP responses for AI chat), we will need to request exceptions to the Catalyst-first mandate to host specific microservices on AWS or GCP, delaying the timeline.

### 1.2. LLM API Availability
- **Assumption:** We will have uninterrupted access to a high-tier Enterprise LLM API (e.g., OpenAI GPT-4o or Google Gemini 1.5 Pro) with sufficient rate limits (Tokens Per Minute) to handle concurrent investigative queries.
- **Impact if False:** The conversational AI will suffer from high latency or frequent timeout errors, rendering the system unusable during peak load.

## 2. Data Assumptions

### 2.1. Historical Data Availability
- **Assumption:** The Karnataka State Police (KSP) will provide access to a substantial dataset (at least 10,000 records) of historical, anonymized FIRs and chargesheets in a digital format (PDFs and structured JSON/CSV) for training and indexing.
- **Impact if False:** The RAG pipeline and Knowledge Graph will be built on synthetic data, and the real-world accuracy (Hallucination Rate) cannot be properly validated before UAT.

### 2.2. OCR and Translation Viability
- **Assumption:** Existing OCR (Optical Character Recognition) APIs can accurately transcribe older, scanned Kannada FIRs into machine-readable text with at least 80% accuracy.
- **Impact if False:** Semantic search across historical documents will fail. Officers will only be able to search recently digitized, native-PDF records.

## 3. Operational and Environmental Assumptions

### 3.1. Network Connectivity
- **Assumption:** Police stations across Karnataka have access to a stable internet connection (at least 4G speeds).
- **Impact if False:** The web-based application (Next.js) will fail to load, and AI streaming will timeout. An offline mode is strictly out of scope for this cloud-native MVP.

### 3.2. Stakeholder Availability
- **Assumption:** Domain experts from the KSP (SHOs, Investigators) will be available for 2 hours per week during the UAT (User Acceptance Testing) phase to validate the accuracy of the CrimeGPT responses.
- **Impact if False:** The system may be deployed with critical flaws in police domain logic, leading to poor user adoption.

### 3.3. Development Team Skillset
- **Assumption:** The engineering team is proficient in Next.js, Node.js/Python, and prompt engineering, and is capable of rapidly upskilling on the **Zoho Catalyst** platform documentation.
- **Impact if False:** Velocity will drop during the first two weeks as the team struggles with Catalyst-specific deployment idiosyncrasies.

---
**Next Steps:** This concludes the `01-Product` documentation phase. The development team should now proceed to the `02-SystemDesign` phase, starting with the [Technical Requirements Document (TRD)](../02-SystemDesign/TRD.md).
