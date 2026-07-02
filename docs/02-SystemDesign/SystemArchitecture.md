# System Architecture

## Overview
The **System Architecture** document provides a high-level, visual blueprint of the **CrimeGPT** platform. It illustrates how the frontend, **Zoho Catalyst** backend services, and external specialized databases/APIs interact to deliver a secure, scalable, and intelligent law enforcement tool.

## Architectural Philosophy
The architecture is strictly **Catalyst-first**. The Next.js frontend acts purely as a presentation layer. **Catalyst Functions** act as the central nervous system (API Gateway & Business Logic), orchestrating all interactions with the **Catalyst Data Store**, **Catalyst File Store**, and specialized external AI/Graph engines.

---

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef catalyst fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef external fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;
    classDef database fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff;

    %% Client Layer
    subgraph Client Layer
        WebUI[Next.js Web Application]:::frontend
    end

    %% Catalyst Edge / API Layer
    subgraph Zoho Catalyst: API & Orchestration
        Auth[Catalyst Authentication]:::catalyst
        Gateway[Catalyst API Gateway / Functions Routing]:::catalyst
        Cron[Catalyst Cron]:::catalyst
        Cache[Catalyst Cache]:::catalyst
        Search[Catalyst Search]:::catalyst
    end

    %% Catalyst Compute Layer
    subgraph Zoho Catalyst: Compute (Functions)
        FnAuth[Auth & RBAC Middleware]:::catalyst
        FnAI[AI RAG Orchestrator]:::catalyst
        FnIngest[Data Ingestion Pipeline]:::catalyst
        FnPredict[Predictive Analytics]:::catalyst
    end

    %% Catalyst Storage Layer
    subgraph Zoho Catalyst: Storage
        DataStore[(Catalyst Data Store)]:::database
        FileStore[(Catalyst File Store)]:::database
    end

    %% External Services
    subgraph Specialized External Engines
        LLM[External LLM (Gemini/OpenAI)]:::external
        VectorDB[(Vector DB)]:::external
        GraphDB[(Neo4j Graph DB)]:::external
    end

    %% Connections
    WebUI --"JWT Login"--> Auth
    WebUI --"HTTPS REST"--> Gateway
    Gateway --"Verifies Token"--> Auth
    Gateway --> FnAuth
    
    FnAuth --> FnAI
    FnAuth --> FnPredict
    
    %% AI Pipeline
    FnAI --"Semantic Search"--> VectorDB
    FnAI --"Fetch Context"--> FileStore
    FnAI --"Prompt & Context"--> LLM
    FnAI --"Graph Queries"--> GraphDB
    
    %% Ingestion Pipeline
    FileStore --"Triggers"--> FnIngest
    FnIngest --"Extract Metadata"--> DataStore
    FnIngest --"Generate Embeddings"--> VectorDB
    FnIngest --"Map Entities"--> GraphDB
    
    %% Caching & Cron
    Cron --"Triggers Daily"--> FnPredict
    FnPredict --"Saves Hotmaps"--> Cache
    WebUI --"Fetches Dashboard"--> Cache
    
    %% Data Store & Search
    DataStore -.-> Search
    FnAI --"Text Search"--> Search
```

## 2. Component Descriptions

### 2.1. Client Layer
- **Next.js Web Application:** A responsive Single Page Application (SPA) providing role-specific dashboards, the CrimeGPT chat interface, and interactive network graphs.

### 2.2. Zoho Catalyst: API & Orchestration
- **Catalyst Authentication:** Manages user identities, issues JWTs, and handles 2FA.
- **Catalyst API Gateway/Routing:** Exposes Catalyst Functions as secure REST HTTP endpoints to the frontend.
- **Catalyst Cache:** In-memory store (Memcached/Redis equivalent) for serving static dashboards and temporarily holding chat context.
- **Catalyst Cron:** Scheduled task runner for generating daily analytics and triggering database maintenance.

### 2.3. Zoho Catalyst: Compute (Functions)
- **Auth & RBAC Middleware:** Intercepts every API call, verifies the Catalyst token, and checks permissions before allowing execution.
- **AI RAG Orchestrator:** The core logic that receives a chat message, retrieves context from databases, calls the LLM, and enforces citation rules.
- **Data Ingestion Pipeline:** Triggered when a new PDF is uploaded to the File Store; parses the document, creates embeddings, and updates databases.
- **Predictive Analytics:** Runs ML clustering algorithms on historical data to generate heatmaps.

### 2.4. Zoho Catalyst: Storage
- **Catalyst Data Store:** Relational tables for Users, Case Metadata, Audit Logs, and Chat Session History.
- **Catalyst File Store:** Secure blob storage for raw FIR PDFs, uploaded evidence images, and generated reports.

### 2.5. Specialized External Engines
- **External LLM:** The foundational model used solely for natural language understanding and text generation based on provided context.
- **Vector DB:** Stores high-dimensional vector embeddings of FIR chunks to enable rapid semantic search (e.g., finding crimes with similar M.O. even if different keywords are used).
- **Neo4j Graph DB:** Stores entities (People, Vehicles, Locations) as nodes and their relationships (Arrested_With, Owns, Seen_At) as edges for high-speed network analysis.

## 3. Data Localization & Security Boundaries
- **Strict Boundary:** No PII or law enforcement data is permanently stored in the External LLM. The LLM acts solely as a stateless processor.
- **Source of Truth:** The Catalyst Data Store and File Store remain the sole sources of truth for all operational data, ensuring compliance with Indian data localization laws.

---
**Next Steps:** Review the [Service Architecture](./ServiceArchitecture.md) to see how these components are divided into logical micro-services within Catalyst.
