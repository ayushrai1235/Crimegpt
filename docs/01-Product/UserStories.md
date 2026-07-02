# User Stories

## Overview
This document breaks down the product requirements into actionable **User Stories**, written from the perspective of the User Personas (Inspector Ramesh, Sub-Inspector Priya, Analyst Suresh, Commissioner Vikram). 

These stories are grouped by functional areas (Epics) and explicitly note the **Zoho Catalyst** services required to fulfill them, ensuring architectural alignment during development.

---

## Epic 1: Authentication & Access Control

**US 1.1: Secure Login**
- **As** Inspector Ramesh,
- **I want** to log in securely using my official credentials and 2FA,
- **So that** unauthorized personnel cannot access sensitive police data.
- **Catalyst Service:** Catalyst Authentication.

**US 1.2: Role-Based Dashboards**
- **As** Commissioner Vikram,
- **I want** to see a high-level state-wide dashboard upon logging in, while an SHO sees only their local jurisdiction,
- **So that** I am not overwhelmed with irrelevant data and security boundaries are maintained.
- **Catalyst Service:** Catalyst Authentication (Roles), Catalyst Cache (Dashboard rendering).

**US 1.3: Audit Logging**
- **As** a Security Admin,
- **I want** the system to automatically log every search query and file download made by any officer,
- **So that** I can track data access for compliance and investigate potential leaks.
- **Catalyst Service:** Catalyst Data Store (append-only log table).

---

## Epic 2: Conversational AI & Search (CrimeGPT)

**US 2.1: Natural Language Querying**
- **As** Sub-Inspector Priya,
- **I want** to type questions like "Who are the known associates of suspect X in the last 2 years?",
- **So that** I don't have to navigate complex search forms or write database queries.
- **Catalyst Service:** Catalyst Functions (LLM Orchestration, Intent Detection).

**US 2.2: Explainable Evidence (RAG)**
- **As** Sub-Inspector Priya,
- **I want** the AI to provide a clickable citation (e.g., "Source: FIR 102/2023") for every claim it makes,
- **So that** I can verify the facts and use them legally in a chargesheet.
- **Catalyst Service:** Catalyst File Store (PDF retrieval), Catalyst Functions (RAG pipeline).

**US 2.3: Cross-Lingual Search**
- **As** Inspector Ramesh,
- **I want** to type a query in English and have the system search through FIRs that were originally written in Kannada,
- **So that** language barriers do not hide vital intelligence.
- **Catalyst Service:** Catalyst Functions (Translation API integration).

---

## Epic 3: Predictive Analytics & Dashboards

**US 3.1: Crime Hotspot Heatmaps**
- **As** Inspector Ramesh,
- **I want** to view a map showing predicted hotspots for property crimes for the next 48 hours,
- **So that** I can deploy my limited night patrol units effectively.
- **Catalyst Service:** Catalyst Cron (Daily ML job), Catalyst Cache (Serving the map data).

**US 3.2: Repeat Offender Alerts**
- **As** Inspector Ramesh,
- **I want** to receive a notification when a known habitual offender in my area is released on bail,
- **So that** I can put them under surveillance immediately.
- **Catalyst Service:** Catalyst Notifications, Catalyst Functions (Triggered by Data Store updates).

---

## Epic 4: Criminal Network Analysis

**US 4.1: Visualizing Relationships**
- **As** Sub-Inspector Priya,
- **I want** to click on a suspect's name and see a visual graph of everyone they have been arrested with, their known vehicles, and frequent locations,
- **So that** I can quickly identify the structure of an organized crime ring.
- **Catalyst Service:** Catalyst Functions (Querying external Neo4j DB).

**US 4.2: Identifying M.O. Patterns**
- **As** Analyst Suresh,
- **I want** the system to cluster recent unsolved crimes that share similar Modus Operandi (M.O.),
- **So that** I can alert relevant stations that a serial offender is active.
- **Catalyst Service:** Catalyst Functions (Querying external Vector DB for semantic similarity).

---

## Epic 5: Reporting and Exporting

**US 5.1: Automated Briefing Generation**
- **As** Inspector Ramesh,
- **I want** to click "Generate Morning Briefing" and receive a PDF summarizing the predicted hotspots and ongoing major cases in my station,
- **So that** I can brief my team without spending an hour writing notes.
- **Catalyst Service:** Catalyst Functions (PDF Generation), Catalyst File Store (PDF Storage).

**US 5.2: Exporting Chat Sessions**
- **As** Sub-Inspector Priya,
- **I want** to export a highly productive CrimeGPT chat session as a PDF,
- **So that** I can attach it to my physical case file for reference.
- **Catalyst Service:** Catalyst Data Store (Chat history), Catalyst File Store (PDF export).

---
**Next Steps:** Review the [Epics](./Epics.md) document to see how these stories are bundled for sprint planning.
