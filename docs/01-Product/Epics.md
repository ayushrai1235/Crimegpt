# Epics

## Overview
The **Epics** document groups the individual User Stories into large, logical bodies of work. This provides a high-level roadmap for the development team and ensures that features are developed cohesively rather than in isolation. 

Each Epic is tightly coupled with the **Zoho Catalyst-first** architecture, ensuring that infrastructure requirements are considered alongside product features.

---

## Epic 1: Catalyst Infrastructure & Security Foundation
**Description:** Establish the core backend infrastructure, database schemas, and security boundaries using Zoho Catalyst services. This must be completed before any frontend or AI work begins.
**Business Value:** Ensures that sensitive police data is stored securely and accessed only by authorized personnel.
**Key Components:**
- Implementation of **Catalyst Authentication** and Role-Based Access Control (RBAC).
- Designing the relational schema in **Catalyst Data Store** (Users, Roles, Audit Logs, Cases).
- Setting up **Catalyst File Store** for FIR PDF ingestion.
- Creating the immutable audit logging **Catalyst Functions**.

## Epic 2: Data Ingestion & Knowledge Graph Construction
**Description:** Build the pipelines to ingest unstructured FIR data, process it, and map relationships.
**Business Value:** Transforms raw paper/PDF records into a structured, searchable, and interconnected intelligence database.
**Key Components:**
- Parsing FIR PDFs and storing chunks in the Vector DB (orchestrated by **Catalyst Functions**).
- Entity extraction (Suspects, Victims, Locations) and mapping them into the Neo4j Graph DB.
- Enabling **Catalyst Search** on structured metadata for rapid text retrieval.

## Epic 3: CrimeGPT Conversational Interface (The "Brain")
**Description:** Develop the core natural language interface and the RAG (Retrieval-Augmented Generation) pipeline to ensure explainable, hallucination-free AI responses.
**Business Value:** Allows officers to query complex data instantly without technical training, saving thousands of man-hours.
**Key Components:**
- Integrating the LLM (Gemini/OpenAI) via **Catalyst Functions**.
- Implementing the RAG pipeline to fetch context from the Vector DB and Catalyst File Store.
- Ensuring Explainable AI (XAI) by forcing the LLM to output citation links.
- Storing conversation history in the **Catalyst Data Store**.

## Epic 4: Predictive Analytics & Heatmaps
**Description:** Implement machine learning models to forecast crime hotspots and display them geospatially.
**Business Value:** Shifts the KSP from a reactive posture to a proactive, predictive posture.
**Key Components:**
- Developing the prediction models based on historical FIR data.
- Setting up **Catalyst Cron** to run daily predictions at midnight.
- Caching the resulting heatmaps via **Catalyst Cache** for instant dashboard loading.

## Epic 5: Automated Reporting & Export
**Description:** Allow users to instantly generate PDFs of intelligence briefs, case summaries, and chat sessions.
**Business Value:** Eliminates the manual administrative burden of typing out reports and briefings.
**Key Components:**
- Building PDF generation templates within **Catalyst Functions**.
- Saving generated reports directly to the **Catalyst File Store**.
- Providing secure, expiring download links to users.

## Epic 6: Role-Based Dashboards (Frontend UI)
**Description:** Build the Next.js frontend, ensuring that the UI adapts to the user's role (e.g., Commissioner vs. SHO) and provides real-time analytics.
**Business Value:** Provides a clean, intuitive, and customized view of the state's security posture.
**Key Components:**
- Connecting Next.js frontend to **Catalyst Authentication**.
- Fetching widget data rapidly via **Catalyst Cache**.
- Displaying Criminal Network Graphs and Heatmaps interactively.

---
**Next Steps:** Review the [Functional Requirements](./FunctionalRequirements.md) to see the technical specifications required to execute these Epics.
