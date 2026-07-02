# Acceptance Criteria

## Overview
The **Acceptance Criteria** document defines the exact conditions under which a user story or feature is considered "done." These criteria serve as the foundation for the QA team's test plans and ensure that the engineering team delivers exactly what the stakeholders expect, utilizing the **Zoho Catalyst** architecture correctly.

---

## 1. Authentication & Security

### AC 1.1: Catalyst Authentication Login
**Given** a user is on the login page,
**When** they enter valid credentials (Email/Password),
**Then** they are authenticated via **Catalyst Authentication**, a secure session token is generated, and they are redirected to their role-specific dashboard.
**And** if they enter invalid credentials, they see a generic error message ("Invalid credentials") without revealing if the email exists.

### AC 1.2: Role-Based Access Enforcement
**Given** an officer with the role `Inspector` is logged in,
**When** they attempt to access the `/admin/users` API endpoint (which requires `Administrator` role),
**Then** the **Catalyst Function** middleware MUST intercept the request and return a `403 Forbidden` HTTP status.
**And** the unauthorized attempt MUST be logged in the Catalyst Data Store audit table.

---

## 2. Conversational AI (CrimeGPT)

### AC 2.1: Explainable AI (Forced Citations)
**Given** an investigator asks CrimeGPT, "Who was arrested in FIR 123/2023 for burglary in Indiranagar?",
**When** CrimeGPT generates the response,
**Then** the response MUST include a clickable hyperlink to the source PDF.
**And** clicking the hyperlink MUST securely fetch the PDF from the **Catalyst File Store**.
**And** if the LLM cannot find the answer in the provided RAG context, it MUST reply, "I cannot find this information in the provided records," rather than hallucinating an answer.

### AC 2.2: Contextual Memory
**Given** an investigator asks, "Show me vehicle thefts by Suspect X,"
**And** CrimeGPT returns a list of 3 thefts,
**When** the investigator asks a follow-up question, "Where did the second one happen?",
**Then** CrimeGPT MUST correctly identify "the second one" based on the chat history temporarily stored in **Catalyst Cache**, and provide the location.

---

## 3. Analytics and Heatmaps

### AC 3.1: Predictive Heatmap Generation
**Given** it is 00:00 IST,
**When** the **Catalyst Cron** job triggers,
**Then** the ML prediction Catalyst Function MUST execute, analyze the previous 30 days of FIR data, and generate a new GeoJSON heatmap array.
**And** this array MUST be saved to **Catalyst Cache**.
**And** the previous day's heatmap must be archived in the Catalyst Data Store.

### AC 3.2: Dashboard Rendering Speed
**Given** the Commissioner logs into the platform,
**When** the main dashboard page loads,
**Then** the state-wide crime statistics widgets MUST fetch their data from **Catalyst Cache** and render visually within 1.0 seconds on a standard broadband connection.

---

## 4. Criminal Network Analysis

### AC 4.1: Graph Visualization
**Given** an analyst queries a specific suspect's name,
**When** they click "View Network",
**Then** a **Catalyst Function** MUST query the Neo4j database and return the relationship JSON.
**And** the frontend MUST render a visual graph showing the suspect as a central node, connected to known accomplices, vehicles, and locations.
**And** clicking on a connecting edge (line) MUST show the FIR number that established that connection.

---
**Next Steps:** Review the [Business Rules](./BusinessRules.md) to understand the hard logic constraints the system must enforce.
