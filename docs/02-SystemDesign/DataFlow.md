# Data Flow Documentation

## 1. Overview
This document illustrates how data moves through the CrimeGPT system across different operational flows.

## 2. Purpose
To provide absolute clarity on system integration points, ensuring developers understand exactly which service is responsible for which step of a workflow.

## 3. Functional Requirements
Not applicable (technical architecture document).

## 4. Technical Design (Data Flow Diagrams)

### FIR Upload Flow
```mermaid
sequenceDiagram
    participant User as Investigator
    participant Catalyst as Catalyst Backend
    participant FileStore as Catalyst File Store
    participant DB as Catalyst Data Store
    participant Gemini as Gemini (Extract)
    participant Pinecone as Pinecone Vector DB
    participant Neo4j as Neo4j Graph DB
    
    User->>Catalyst: Upload FIR PDF
    Catalyst->>FileStore: Save PDF securely
    Catalyst->>Gemini: Request OCR & Entity Extraction
    Gemini-->>Catalyst: JSON Entities (Accused, Victims, MO)
    Catalyst->>DB: Save Case Metadata (System of Record)
    Catalyst->>Gemini: Generate Embeddings for MO Text
    Gemini-->>Catalyst: Vector Representation
    Catalyst->>Pinecone: Upsert Vector
    Catalyst->>Neo4j: Merge Nodes & Edges
    Catalyst-->>User: Upload Complete
```

### AI Chat Flow
```mermaid
sequenceDiagram
    participant User
    participant AI as AI Orchestrator
    participant DB as Catalyst Data Store
    participant Pinecone
    participant Gemini
    
    User->>AI: "Who is involved in Crime 404?"
    AI->>AI: Intent Detection (Identify Case Query)
    AI->>DB: Query Catalyst Data Store for Case 404
    DB-->>AI: Case Metadata
    AI->>Pinecone: (Optional) Semantic search for context
    Pinecone-->>AI: Similar Historical Cases
    AI->>Gemini: Prompt + RAG Context
    Gemini-->>AI: Explainable Response with Citations
    AI-->>User: Response + Confidence Score
```

### Case Similarity Flow
```mermaid
sequenceDiagram
    participant User
    participant Catalyst as Catalyst Backend
    participant Pinecone as Pinecone Vector DB
    
    User->>Catalyst: Request Similar Cases for FIR 101
    Catalyst->>Catalyst: Fetch Vector for FIR 101
    Catalyst->>Pinecone: Semantic Similarity Search (Top 5)
    Pinecone-->>Catalyst: Match Scores & FIR IDs
    Catalyst-->>User: Display Similar Cases with Confidence %
```

## 5. Edge Cases
- **Upload Failures**: If the Neo4j merge fails during an FIR upload, the system rolls back the Catalyst Data Store entry to prevent ghost records.

## 6. Future Enhancements
- Implement a Kafka message queue to handle extreme spikes in FIR uploads instead of synchronous Catalyst event functions.
