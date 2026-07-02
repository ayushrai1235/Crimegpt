# Stakeholders

## Overview
The **Stakeholders** document identifies all individuals, groups, and organizations involved in or impacted by the **CrimeGPT** project. It defines their roles, responsibilities, pain points, and expectations to ensure clear communication and alignment throughout the development lifecycle.

## Objectives
- Identify key decision-makers, users, and technical personnel.
- Map the interests and pain points of each stakeholder group to the features being developed.
- Establish the governance structure for project approval and feedback.

## Scope
This document covers internal law enforcement personnel (the primary users), project sponsors, and the technical development team.

---

## 1. Executive Sponsors

Executive sponsors provide the vision, funding, and final approval for the project.

### 1.1. Director General of Police (DGP) / Commissioner of Police
- **Role:** Ultimate project sponsor and visionary leader.
- **Pain Point:** Needs a macro-level view of state-wide crime trends, police efficiency, and resource allocation. Existing reports are delayed and lack predictive insights.
- **Expectation:** A high-level dashboard providing real-time, state-wide analytics, crime forecasting, and sociological insights to drive policy decisions.
- **Interaction with System:** Views aggregated reports generated via **Catalyst Functions** and cached via **Catalyst Cache** for instant loading.

## 2. Primary Users (Law Enforcement Operations)

These are the core users who will interact with the CrimeGPT platform daily.

### 2.1. Station House Officer (SHO) / Inspector
- **Role:** Manages the police station, oversees daily investigations, and deploys local patrols.
- **Pain Point:** Overwhelmed with administrative paperwork and lacks the time to manually connect data points across multiple ongoing cases.
- **Expectation:** Daily automated briefings on predicted crime hotspots (via **Catalyst Cron** notifications). Ability to ask CrimeGPT natural language questions about local suspects to speed up investigations.
- **Interaction with System:** Heavy use of the Conversational AI interface and Predictive Heatmaps.

### 2.2. Investigating Officer (Sub-Inspector / DSP)
- **Role:** Actively investigates specific crimes, interrogates suspects, and files chargesheets.
- **Pain Point:** Searching for historical FIRs or finding links between suspects across jurisdictions takes days of manual effort.
- **Expectation:** Instant retrieval of case files, automated evidence cross-referencing, and AI-generated criminal network graphs.
- **Interaction with System:** Deep interaction with the Knowledge Graph and RAG pipeline. Relies heavily on the Explainable AI (XAI) feature to verify citations in the **Catalyst File Store**.

### 2.3. SCRB (State Crime Records Bureau) Analyst
- **Role:** Analyzes state-wide crime data to identify patterns, organized crime syndicates, and M.O. (Modus Operandi) trends.
- **Pain Point:** Writing complex database queries to extract relevant data is slow and error-prone.
- **Expectation:** Advanced search capabilities, deep semantic search across unstructured data, and tools to export complex analytical reports.
- **Interaction with System:** Utilizes **Catalyst Search** and advanced filtering endpoints to run complex analytical queries.

## 3. Technical and Administrative Stakeholders

These stakeholders are responsible for the development, maintenance, and security of the platform.

### 3.1. Principal Software Architect / Lead Developer
- **Role:** Designs the system architecture and oversees the engineering team.
- **Pain Point:** Managing complex infrastructure, scaling issues, and ensuring data security.
- **Expectation:** A robust, strictly enforced **Zoho Catalyst-first** architecture that minimizes DevOps overhead and provides secure, scalable backend services out of the box.
- **Interaction with System:** Develops **Catalyst Functions**, designs the **Catalyst Data Store** schema, and orchestrates the AI pipelines.

### 3.2. Security and Compliance Officer
- **Role:** Ensures the platform complies with legal data privacy requirements and KSP security protocols.
- **Pain Point:** Preventing unauthorized access to sensitive police records and ensuring accountability for data breaches.
- **Expectation:** Zero-trust architecture, strict Role-Based Access Control (RBAC), and immutable audit logs for every system interaction.
- **Interaction with System:** Audits logs stored in the **Catalyst Data Store** and manages roles via **Catalyst Authentication**.

### 3.3. IT Operations / System Administrator
- **Role:** Manages user onboarding, role assignments, and system monitoring.
- **Pain Point:** Resetting passwords and managing permissions across disparate legacy systems.
- **Expectation:** A centralized administrative dashboard for user management.
- **Interaction with System:** Uses the Administration module powered by **Catalyst Authentication** to manage user lifecycles.

## 4. Stakeholder Matrix

| Stakeholder Group | Primary Interest | Influence | Key Catalyst Service Relied Upon |
| :--- | :--- | :--- | :--- |
| **Commissioner / DGP** | Policy, Resource Allocation, Macro Trends | High | Catalyst Cache (Dashboards), Cron (Reports) |
| **SHO / Inspector** | Station Management, Local Crime Prevention | High | Catalyst Functions (AI Orchestration), Notifications |
| **Investigating Officer** | Solving Cases, Finding Evidence | Medium | Catalyst Search, File Store (FIR PDFs) |
| **SCRB Analyst** | Deep Data Analysis, Pattern Recognition | Medium | Catalyst Functions (Graph/Vector queries) |
| **Security Officer** | Data Protection, Audit Compliance | High | Catalyst Authentication, Data Store (Audit Logs) |
| **IT Ops** | User Management, System Uptime | Low | Catalyst Authentication, Monitoring |

---
**Next Step:** Review the [Glossary](./Glossary.md) to ensure all stakeholders are using the same terminology.
