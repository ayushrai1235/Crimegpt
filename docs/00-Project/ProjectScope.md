# Project Scope

## Overview
The **Project Scope** document defines the exact boundaries of the **CrimeGPT** platform. It details what features, capabilities, and integrations will be delivered in the initial release (In Scope) and explicitly states what is excluded (Out of Scope) to prevent scope creep.

## Objectives
- Establish clear expectations for all stakeholders regarding the deliverables.
- Ensure the development team remains focused on the core features required for the Minimum Viable Enterprise Product (MVEP).
- Validate that the scope aligns perfectly with the capabilities of the **Zoho Catalyst** platform.

## Scope
This document covers functional scope, data scope, architectural scope, and future scope.

---

## 1. In Scope

The following capabilities and components are explicitly included in the project deliverables.

### 1.1. Core Application Features
- **Conversational AI Assistant (CrimeGPT):** Natural language interface for querying crime data.
- **RAG & Explainable AI Pipeline:** Retrieval-Augmented Generation ensuring all AI answers are cited and factually grounded in existing FIRs.
- **Criminal Network Analysis:** Automated extraction and visual representation of relationships between suspects, victims, and locations.
- **Predictive Crime Heatmaps:** Geospatial visualization of predicted crime hotspots.
- **Automated Report Generation:** One-click generation of case summaries and daily briefings.
- **Role-Based Dashboards:** Distinct interfaces for Administrators, Commissioners, DSPs, Inspectors, and Analysts.

### 1.2. Architecture and Infrastructure (Catalyst-First)
- **Catalyst Authentication:** Complete implementation of user login, session management, and RBAC (Role-Based Access Control).
- **Catalyst Data Store:** Normalized storage for user profiles, FIR metadata, audit logs, and conversation history.
- **Catalyst File Store:** Secure storage and retrieval of raw FIR PDFs, evidence documents, and generated reports.
- **Catalyst Functions:** Serverless implementation of all backend business logic, AI orchestration, and external API routing.
- **Catalyst Cache & Search:** Implementation of indexing for rapid retrieval and caching for dashboard performance.
- **Catalyst Cron:** Setup of scheduled background tasks for analytics and notifications.

### 1.3. Data Integration Scope
- Ingestion of structured FIR data (JSON/CSV).
- Parsing and indexing of unstructured FIR PDFs.
- Integration of a Neo4j graph database for complex relationship mapping (interfaced via Catalyst Functions).
- Integration of a Vector Database for semantic search (interfaced via Catalyst Functions).

## 2. Out of Scope

The following items are explicitly excluded from the current phase of development to ensure timely delivery and maintain focus.

### 2.1. Excluded Features
- **Direct Public Access:** The platform is strictly for internal KSP use. There is no citizen-facing portal in this phase.
- **Real-time CCTV/Video Analytics:** Integration with live camera feeds or facial recognition is excluded. The system currently handles text, structured data, and documents.
- **Automated FIR Registration:** CrimeGPT is an intelligence and analysis tool, not an operational data entry system for replacing the CCTNS (Crime and Criminal Tracking Network & Systems) registration process.
- **Mobile Application Development:** The initial release will be a responsive web application (Next.js). Native iOS/Android apps are excluded.

### 2.2. Excluded Architectural Components
- **Custom Authentication Providers:** We will not build custom JWT auth servers or integrate third-party identity providers (like Auth0 or Okta). **Catalyst Authentication** is mandatory and sufficient.
- **Direct Database Access from Frontend:** The frontend will never communicate directly with Neo4j, the Vector DB, or the Catalyst Data Store. All requests must route through **Catalyst Functions**.
- **On-Premise Deployment:** The solution is designed as a cloud-native application running on Zoho Catalyst. On-premise server deployment is out of scope.

## 3. Assumptions and Dependencies

- **Data Availability:** It is assumed that the KSP will provide anonymized/sample historical FIR data (structured and unstructured) for training, testing, and populating the database.
- **API Limits:** It is assumed that the external LLM provider (e.g., OpenAI/Gemini) API rate limits will be sufficient for the expected load, or will be managed via **Catalyst Cache**.
- **Catalyst Uptime:** The system architecture relies heavily on Zoho Catalyst; therefore, we assume the platform will meet standard enterprise SLAs for uptime and availability.

## 4. Future Scope (Roadmap Candidates)

While not in the current project, these items are identified for future phases:
- **Multilingual Voice Support:** Allowing officers to speak queries in Kannada and receive voice responses.
- **Financial Transaction Analysis:** Deep integration with banking APIs to trace illicit financial flows automatically.
- **Live Social Media Sentiment Analysis:** Monitoring public platforms for early indicators of civil unrest or organized crime coordination.

---
**Next Step:** Review the [Stakeholders](./Stakeholders.md) document to understand who is involved in ensuring this scope is delivered.
