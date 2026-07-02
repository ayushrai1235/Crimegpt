# Project Roadmap

## Overview
The **Project Roadmap** outlines the high-level timeline, major phases, and critical milestones for delivering the **CrimeGPT** platform. It provides stakeholders with a clear understanding of when specific capabilities will be available.

## Objectives
- Establish a realistic timeline for delivering the Minimum Viable Enterprise Product (MVEP).
- Align development phases with the **Zoho Catalyst-first** architectural constraints.
- Provide a structured release schedule for testing, UAT, and production deployment.

## Scope
This document covers the 4-week intensive development sprint typical of a hackathon/rapid-prototyping environment, culminating in a production-ready deployment.

---

## Week 1: Foundation & Catalyst Infrastructure setup

**Goal:** Establish the core infrastructure, authentication, and basic data pipelines.

- **Milestone 1.1: Environment Provisioning**
  - Initialize the Zoho Catalyst project environment.
  - Set up Next.js frontend repository with Tailwind CSS and the core Design System.
- **Milestone 1.2: Authentication & RBAC**
  - Implement **Catalyst Authentication**.
  - Configure Role-Based Access Control (RBAC) for Administrator, DSP, Inspector, and Analyst roles.
  - Build the login and user management UI.
- **Milestone 1.3: Data Store & File Store Schema**
  - Design and deploy the relational schema in **Catalyst Data Store** (Users, FIR metadata, Audit Logs).
  - Configure the **Catalyst File Store** buckets for evidence and report storage.
- **Milestone 1.4: Dummy Data Ingestion**
  - Write **Catalyst Functions** to ingest structured sample FIR data into the Data Store.
  - Upload sample PDFs to the File Store.

## Week 2: AI Engine & Knowledge Graph Integration

**Goal:** Build the "brain" of the application, focusing on RAG and relationship mapping.

- **Milestone 2.1: RAG Pipeline Construction**
  - Develop **Catalyst Functions** to handle document parsing and chunking.
  - Integrate external Vector Database for embedding storage and similarity search.
- **Milestone 2.2: Knowledge Graph Setup**
  - Deploy Neo4j graph database.
  - Write data synchronization scripts (via Catalyst Functions) to map relationships between suspects, victims, and locations based on ingested FIRs.
- **Milestone 2.3: Conversational AI (CrimeGPT) Core**
  - Integrate LLM (Gemini/OpenAI) via Catalyst Functions.
  - Implement prompt engineering with strict "Explainable AI" constraints (forcing citations).
  - Build the chat interface UI on the frontend with streaming response support.

## Week 3: Advanced Features & Analytics

**Goal:** Implement predictive modeling, dashboards, and automated reporting.

- **Milestone 3.1: Dashboard & Analytics**
  - Build role-specific dashboards (e.g., Commissioner macro-view, SHO local-view).
  - Implement **Catalyst Cache** to serve dashboard metrics rapidly.
- **Milestone 3.2: Predictive Intelligence**
  - Develop the crime forecasting models.
  - Setup **Catalyst Cron** to run daily hotspot predictions and generate data for the heatmaps.
- **Milestone 3.3: Automated Reporting**
  - Implement PDF generation logic within Catalyst Functions.
  - Ensure generated reports are saved to Catalyst File Store and linked in the UI.
- **Milestone 3.4: Notifications**
  - Configure the Catalyst Notification system to alert SHOs of high-risk predictions or major crime spikes.

## Week 4: Security, QA, and Deployment

**Goal:** Harden the system, ensure compliance, and deploy for User Acceptance Testing (UAT).

- **Milestone 4.1: Security Hardening**
  - Conduct full audit of RBAC implementations.
  - Ensure every API endpoint in Catalyst Functions validates user roles.
  - Finalize immutable audit logging mechanisms in the Catalyst Data Store.
- **Milestone 4.2: QA & Testing**
  - Execute E2E testing for the entire conversational flow.
  - Validate the "Hallucination Rate" KPI (must be < 0.1%).
  - Load test Catalyst Functions and Search endpoints.
- **Milestone 4.3: User Acceptance Testing (UAT)**
  - Release a beta version to a select group of law enforcement stakeholders.
  - Gather feedback on UI intuitiveness and AI response quality.
- **Milestone 4.4: Final Production Deployment**
  - Finalize documentation.
  - Go-live on production Catalyst environment.

---
**Next Step:** Proceed to the `01-Product` directory and review the [Product Requirements Document (PRD)](../01-Product/PRD.md) for detailed feature specifications.
