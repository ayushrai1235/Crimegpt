# Glossary

## Overview
The **Glossary** defines the specific terminology, acronyms, and technical jargon used throughout the **CrimeGPT** documentation. This ensures that all stakeholders—from law enforcement officials to software engineers—share a common understanding of the language used to describe the system and its domain.

## Objectives
- Standardize the vocabulary used across all documentation, codebases, and communications.
- Bridge the gap between police operational terminology and software engineering concepts.

## Scope
This document covers law enforcement acronyms, Zoho Catalyst specific terms, and AI/Machine Learning terminology relevant to this project.

---

## 1. Law Enforcement Terminology

| Term / Acronym | Definition |
| :--- | :--- |
| **CCTNS** | Crime and Criminal Tracking Network & Systems. The existing national database used for creating FIRs and tracking crime data across India. |
| **FIR** | First Information Report. A written document prepared by the police when they receive information about the commission of a cognizable offence. |
| **SHO** | Station House Officer. The officer in charge of a police station. |
| **DSP** | Deputy Superintendent of Police. A senior ranking police officer. |
| **SCRB** | State Crime Records Bureau. The nodal agency at the state level responsible for collecting and analyzing crime data. |
| **M.O.** | Modus Operandi. A particular way or method of doing something, especially one that is characteristic or well-established (used to identify patterns in how crimes are committed). |
| **Chargesheet** | A formal document of accusation prepared by law enforcement agencies containing the findings of their investigation. |
| **Cognizable Offence** | An offence for which a police officer may, in accordance with the First Schedule or under any other law for the time being in force, arrest without warrant. |

## 2. Zoho Catalyst Terminology

Given the strict **Catalyst-first architecture**, understanding these terms is critical for the engineering team.

| Term | Definition in the context of CrimeGPT |
| :--- | :--- |
| **Catalyst Authentication** | The core Identity and Access Management (IAM) service. It handles user logins, sessions, and Role-Based Access Control (RBAC). No third-party auth providers are used. |
| **Catalyst Functions** | Serverless computing environments (Node.js/Java/Python) where all backend business logic, API endpoints, and AI orchestration are executed. |
| **Catalyst Data Store** | The primary relational database provided by Zoho Catalyst, used to store normalized application data (users, audit logs, structured case metadata). |
| **Catalyst File Store** | The secure cloud storage solution used for saving raw FIR PDFs, uploaded evidence images, and generated analytical reports. |
| **Catalyst Cache** | An in-memory data store used to speed up dashboard loading times and temporarily hold LLM conversation context. |
| **Catalyst Search** | The indexing engine used to perform fast text-based searches across the Catalyst Data Store. |
| **Catalyst Cron** | The scheduling service used to trigger background tasks (e.g., generating daily predictive heatmaps at midnight). |

## 3. AI and Technical Terminology

| Term | Definition |
| :--- | :--- |
| **CrimeGPT** | The product name of the Conversational AI assistant built for the Karnataka State Police. |
| **LLM** | Large Language Model (e.g., Gemini, OpenAI). The underlying AI engine that understands natural language and generates responses. |
| **RAG** | Retrieval-Augmented Generation. An AI framework that improves the quality of LLM-generated responses by grounding the model on external sources of knowledge (in our case, FIRs stored in the Catalyst File Store). |
| **Vector Database** | A specialized database designed to store and query high-dimensional vectors (embeddings). Used to find semantically similar crimes even if they use different keywords. |
| **Graph Database (Neo4j)** | A database designed to treat the relationships between data as equally important to the data itself. Used heavily for Criminal Network Analysis to find hidden links between people and locations. |
| **Explainable AI (XAI)** | Methods and techniques in the application of AI such that the results of the solution can be understood by human experts. In CrimeGPT, this means providing citation links for every AI-generated claim. |
| **Hallucination** | When an AI model confidently generates false or fabricated information. The architecture of CrimeGPT is explicitly designed to minimize this through RAG. |
| **RBAC** | Role-Based Access Control. A method of restricting network access based on the roles of individual users within an enterprise. |

---
**Next Step:** Review the [Success Metrics](./SuccessMetrics.md) to understand how the project's performance will be evaluated against these concepts.
