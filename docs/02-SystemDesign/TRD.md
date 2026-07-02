# Technical Requirements Document (TRD)

## Overview
The **Technical Requirements Document (TRD)** serves as the engineering blueprint for the **CrimeGPT** platform. It translates the Product Requirements Document (PRD) into specific technical architectures, technology choices, and implementation strategies, strictly adhering to the **Zoho Catalyst-first** mandate.

## 1. System Overview
CrimeGPT is a cloud-native, serverless web application designed to provide AI-powered conversational intelligence and predictive analytics to the Karnataka State Police. The system leverages Zoho Catalyst as its core Backend-as-a-Service (BaaS), eliminating the need for traditional server provisioning and infrastructure management.

## 2. Technology Stack

### 2.1. Frontend
- **Framework:** Next.js 14+ (React)
- **Styling:** Tailwind CSS
- **State Management:** React Context API / Zustand
- **Deployment:** Vercel (or Catalyst Web Client Hosting if strictly mandated, though Vercel is standard for Next.js SSR)

### 2.2. Core Backend & Orchestration (Zoho Catalyst)
- **Identity & Access:** Catalyst Authentication
- **Compute (Business Logic):** Catalyst Functions (Node.js / Python)
- **Operational Database:** Catalyst Data Store (Relational)
- **Storage:** Catalyst File Store
- **Caching:** Catalyst Cache
- **Background Jobs:** Catalyst Cron
- **Full-Text Search:** Catalyst Search

### 2.3. External Services (Integrated via Catalyst Functions)
- **LLM Engine:** OpenAI GPT-4o or Google Gemini 1.5 Pro (Enterprise API)
- **Graph Database:** Neo4j AuraDB (Cloud)
- **Vector Database:** Pinecone or Weaviate (Cloud)
- **Geospatial Mapping:** Mapbox API (for rendering predictive heatmaps)

## 3. Core Architecture Decisions

### 3.1. Decision: Serverless Orchestration via Catalyst
**Rationale:** To minimize DevOps overhead and ensure elastic scalability during state-wide emergencies, all backend logic is encapsulated within stateless **Catalyst Functions**. The frontend never connects directly to a database or an LLM.

### 3.2. Decision: RAG over Fine-Tuning
**Rationale:** Fine-tuning an LLM on police data is expensive, technically difficult to update daily, and prone to hallucinations. Instead, we use **Retrieval-Augmented Generation (RAG)**. Catalyst Functions parse FIRs, generate embeddings, and store them in the Vector DB. At query time, the function retrieves relevant FIR chunks and passes them as context to the LLM.

### 3.3. Decision: Neo4j for Criminal Networks
**Rationale:** Relational databases (Catalyst Data Store) are inefficient for deep, multi-hop relationship queries (e.g., "Find all associates of Person A who have driven Vehicle B"). A dedicated graph database (Neo4j) is used exclusively for mapping entity relationships, queried via Catalyst Functions.

## 4. Key Modules and Services

### 4.1. AI Pipeline Module
Responsible for taking a user's natural language query, determining intent (e.g., Search, Network Graph, Analytics), fetching relevant data from the Vector DB/Catalyst Data Store, and prompting the LLM for a cited response.
- **Implemented in:** Advanced I/O Catalyst Functions (Python).

### 4.2. Ingestion & Indexing Module
Responsible for parsing incoming FIR PDFs, running OCR, extracting entities (Names, Dates, Locations), and synchronizing this data across the Catalyst Data Store, Vector DB, and Neo4j.
- **Implemented in:** Event-driven Catalyst Functions triggered by Catalyst File Store uploads.

### 4.3. Predictive Engine Module
Responsible for running the geospatial ML models against historical crime data to generate 72-hour hotspot forecasts.
- **Implemented in:** Scheduled Catalyst Cron jobs triggering Python-based Catalyst Functions.

## 5. Security & Compliance Architecture

### 5.1. RBAC Middleware
Every Catalyst Function exposed as an API endpoint must include a middleware layer that verifies the user's role token (provided by Catalyst Authentication) against the endpoint's required permissions.

### 5.2. Audit Trail
A dedicated `audit_logs` table in the Catalyst Data Store will record:
- `user_id`
- `action` (e.g., "VIEW_FIR", "ASK_AI", "EXPORT_PDF")
- `resource_id` (e.g., the specific FIR number)
- `timestamp`
- `ip_address`
This is handled synchronously within the Catalyst Functions before fulfilling the user's request.

## 6. Tradeoffs & Known Limitations
- **Vendor Lock-in:** By deeply integrating with Zoho Catalyst, migrating to AWS or GCP in the future would require significant backend rewrites. *Accepted due to the rapid development speed and low DevOps overhead Catalyst provides.*
- **Cold Starts:** Serverless Catalyst Functions may experience slight latency ("cold starts") during periods of low traffic. *Mitigated by using Catalyst Cache for initial dashboard loads.*
- **LLM Context Limits:** Complex cases with hundreds of related FIRs may exceed the LLM's context window. *Mitigated by aggressive chunking and prioritizing the top-K most semantically similar chunks in the RAG pipeline.*

---
**Next Steps:** Review the [System Architecture](./SystemArchitecture.md) document for a visual diagram of these technical decisions.
