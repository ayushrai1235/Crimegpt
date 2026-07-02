# Data Flow Architecture

## Overview
The **Data Flow** document illustrates how information moves through the **CrimeGPT** system, from data ingestion to user query and response. Understanding these pathways is crucial for ensuring data integrity, security, and performance within the **Zoho Catalyst-first** architecture.

---

## 1. Data Ingestion Flow

This flow describes what happens when a new FIR PDF is added to the system by an administrator or automated system.

```mermaid
sequenceDiagram
    participant Admin as System/Admin
    participant FS as Catalyst File Store
    participant CF_Ingest as Catalyst Function (Ingest)
    participant DS as Catalyst Data Store
    participant VDB as Vector DB
    participant GDB as Neo4j Graph DB

    Admin->>FS: Upload FIR PDF (e.g., fir_123.pdf)
    FS-->>CF_Ingest: Event Trigger: File Uploaded
    activate CF_Ingest
    CF_Ingest->>CF_Ingest: OCR & Extract Text
    CF_Ingest->>CF_Ingest: NLP: Extract Entities (Suspect, Victim, Location)
    
    par Parallel Database Updates
        CF_Ingest->>DS: INSERT FIR Metadata (ID, Date, Station)
        CF_Ingest->>VDB: INSERT Text Chunks + Embeddings
        CF_Ingest->>GDB: MERGE Nodes & Edges (Suspect -> arrested_in -> FIR)
    end
    
    CF_Ingest-->>FS: Acknowledge Processing Complete
    deactivate CF_Ingest
```

**Key Catalyst Interaction:** The **Catalyst File Store** acts as the event source, automatically triggering the serverless **Catalyst Function** to handle the heavy lifting asynchronously.

---

## 2. Conversational AI Flow (CrimeGPT Query)

This flow illustrates a complex RAG (Retrieval-Augmented Generation) query initiated by an Investigating Officer.

```mermaid
sequenceDiagram
    participant IO as Investigating Officer (UI)
    participant CF_Auth as Catalyst Auth Middleware
    participant CF_AI as Catalyst Function (AI)
    participant DS as Catalyst Data Store
    participant VDB as Vector DB
    participant FS as Catalyst File Store
    participant LLM as External LLM

    IO->>CF_Auth: POST /api/chat "Who robbed the bank in Koramangala?"
    CF_Auth->>CF_Auth: Verify JWT & Role
    CF_Auth->>CF_AI: Route Request
    activate CF_AI
    
    CF_AI->>DS: Log User Query (Audit Trail)
    
    %% Semantic Retrieval
    CF_AI->>VDB: Search Vector: "Bank robbery Koramangala"
    VDB-->>CF_AI: Return Top 3 relevant FIR chunks & Document IDs
    
    %% Context Fetching
    CF_AI->>FS: Fetch source PDFs (to extract exact citations if needed)
    FS-->>CF_AI: Return Text Content
    
    %% AI Generation
    CF_AI->>LLM: Prompt + Context (FIR Chunks) + "Must Cite Source"
    LLM-->>CF_AI: Stream Response: "Suspect X (Source: FIR 102/2023)"
    
    %% Response & Logging
    CF_AI-->>IO: Stream AI Response to UI
    CF_AI->>DS: Save Chat History (User + AI Response)
    deactivate CF_AI
```

**Key Catalyst Interaction:** **Catalyst Functions** orchestrate the entire flow, acting as the secure middleman ensuring the LLM only sees data it is allowed to see, and ensuring the audit log in the **Catalyst Data Store** is updated before the response is returned.

---

## 3. Analytics & Dashboard Data Flow

This flow illustrates how dashboards load quickly using cache, and how background jobs populate that cache.

```mermaid
sequenceDiagram
    participant Cron as Catalyst Cron (00:00 IST)
    participant CF_Analytics as Catalyst Function (ML)
    participant DS as Catalyst Data Store
    participant Cache as Catalyst Cache
    participant Comm as Commissioner (UI)
    
    %% Nightly Job
    Cron->>CF_Analytics: Trigger Daily Calculation
    activate CF_Analytics
    CF_Analytics->>DS: SELECT historical crime data (last 30 days)
    DS-->>CF_Analytics: Return 10,000 rows
    CF_Analytics->>CF_Analytics: Run predictive clustering algorithm
    CF_Analytics->>Cache: SET 'daily_heatmap_data' (GeoJSON)
    deactivate CF_Analytics
    
    %% Morning Login
    Comm->>Cache: GET /api/dashboard/heatmap (via Catalyst Function)
    Cache-->>Comm: Return cached GeoJSON (<50ms)
```

**Key Catalyst Interaction:** **Catalyst Cache** ensures that complex, expensive database queries do not need to be run every time an officer logs in, ensuring a snappy UI experience and reducing database load.

---
**Next Steps:** Review the [Event Flow](./EventFlow.md) document to understand the asynchronous event-driven architecture within the system.
