# Risk Analysis & Mitigation

## Overview
The **Risks** document identifies potential technical, operational, and security threats to the successful delivery and adoption of the **CrimeGPT** platform. For each risk, a specific mitigation strategy is defined, heavily leveraging the **Zoho Catalyst** architecture where applicable.

---

## 1. Technical Risks

### 1.1. Risk: AI Hallucinations Leading to False Arrests
- **Description:** The LLM fabricates a connection between a suspect and a crime, leading an investigating officer to act on false intelligence.
- **Severity:** Critical
- **Likelihood:** Medium (if RAG is poorly tuned)
- **Mitigation:** Implement strict RAG (Retrieval-Augmented Generation) within **Catalyst Functions**. The prompt must force the LLM to output a citation link for *every* factual claim. If a citation cannot be generated from the **Catalyst File Store** context, the LLM must refuse to answer.

### 1.2. Risk: Zoho Catalyst Service Limits
- **Description:** As a serverless platform, Catalyst has predefined limits on function execution time, payload size, and database query complexity. Heavy ML processing might hit these limits.
- **Severity:** High
- **Likelihood:** Medium
- **Mitigation:** Do not run heavy ML training loops inside Catalyst Functions. Use Catalyst Functions only for inference or triggering external ML services. Use **Catalyst Cron** for asynchronous background processing to avoid blocking user-facing API requests.

### 1.3. Risk: Poor OCR on Historical Kannada FIRs
- **Description:** The text extracted from scanned, handwritten historical FIRs is garbled, rendering the Vector Search useless.
- **Severity:** Medium
- **Likelihood:** High
- **Mitigation:** Integrate a specialized, high-accuracy regional language OCR API during the data ingestion pipeline (orchestrated by Catalyst Functions) before generating vector embeddings.

## 2. Security & Compliance Risks

### 2.1. Risk: Unauthorized Data Access (Internal Leak)
- **Description:** A junior officer accesses a high-profile, sensitive case file (e.g., involving a politician) and leaks it to the media.
- **Severity:** Critical
- **Likelihood:** Low
- **Mitigation:** Enforce strict Role-Based Access Control via **Catalyst Authentication**. Implement an immutable audit log in the **Catalyst Data Store** that records every file viewed. Configure alerts (via Catalyst Notifications) if a user views an abnormally high number of files outside their jurisdiction.

### 2.2. Risk: Data Exfiltration via LLM Providers
- **Description:** Sensitive KSP data sent to an external LLM (OpenAI/Gemini) for processing is stored by the provider and used for model training.
- **Severity:** Critical
- **Likelihood:** Low (if enterprise contracts are used)
- **Mitigation:** Ensure that API calls made from **Catalyst Functions** to LLM providers utilize Enterprise endpoints with strict "Zero Data Retention" (ZDR) agreements. No PII should be logged on external servers.

## 3. Operational Risks

### 3.1. Risk: Low User Adoption by Officers
- **Description:** Officers find the system too complex, prefer to rely on their memory or legacy systems, and abandon CrimeGPT.
- **Severity:** High
- **Likelihood:** Medium
- **Mitigation:** Design the UI to be a simple, WhatsApp-style chat interface. Provide instant value (e.g., automated report generation) that demonstrably saves them hours of administrative work on day one.

### 3.2. Risk: Scope Creep During Hackathon/Development
- **Description:** Stakeholders request live CCTV integration and mobile apps, derailing the core Conversational AI focus.
- **Severity:** Medium
- **Likelihood:** High
- **Mitigation:** Strictly adhere to the [Project Scope](./ProjectScope.md) and [Epics](./Epics.md) documents. Push all out-of-scope requests to the "Future Scope" backlog.

---
**Next Steps:** Review the [Assumptions](./Assumptions.md) document to understand the underlying premises this project relies upon.
