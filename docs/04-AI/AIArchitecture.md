# AI Architecture

## Overview
The **AI Architecture** document defines the intelligent core of the **CrimeGPT** platform. It outlines how Natural Language Processing (NLP), Large Language Models (LLMs), and Machine Learning (ML) algorithms are orchestrated within the **Zoho Catalyst** environment to provide actionable, explainable intelligence to law enforcement.

---

## 1. AI Architectural Principles

1. **Catalyst Orchestration:** The frontend NEVER speaks directly to an AI model. All AI interactions are mediated by **Catalyst Functions**, which enforce security, audit logging, and data filtering.
2. **Strict Grounding (No Hallucinations):** The AI is forbidden from relying on its internal pre-trained knowledge to answer specific case questions. It must use Retrieval-Augmented Generation (RAG) based *only* on the data provided from the Catalyst Data Store/File Store.
3. **Explainability (XAI):** Every factual claim made by the AI must be accompanied by a citation linking back to the source document.
4. **Stateless LLM Interaction:** The external LLM retains zero memory of the conversation. The conversation state is managed entirely by the **Catalyst Data Store** (persistent) and **Catalyst Cache** (ephemeral).

## 2. Core AI Components

### 2.1. The Conversational Engine (LLM)
- **Model:** Enterprise tier of OpenAI GPT-4o or Google Gemini 1.5 Pro.
- **Role:** Natural language understanding, intent detection, and generating human-readable responses based *strictly* on provided context.
- **Integration:** Accessed via secure REST API calls from a dedicated Python Catalyst Function.

### 2.2. The Semantic Retrieval Engine (Vector DB)
- **Model:** Embeddings generated via text-embedding-3-small (or equivalent).
- **Storage:** Pinecone or Weaviate Vector Database.
- **Role:** Allows the system to find conceptually similar FIRs (e.g., matching "stolen bicycle" with "pilfered two-wheeler") by calculating cosine similarity between high-dimensional vectors.

### 2.3. The Predictive Engine (Classical ML)
- **Models:** Geospatial clustering algorithms (DBSCAN, K-Means) and time-series forecasting (ARIMA/Prophet).
- **Execution:** Runs periodically as a background job triggered by **Catalyst Cron**.
- **Role:** Generates predictive crime heatmaps based on historical structured data (not text).

## 3. High-Level AI Request Flow

```mermaid
graph TD
    User[Officer via UI] -->|1. Natural Language Query| CF[Catalyst Function: AI Orchestrator]
    
    subgraph AI Pipeline (Within Catalyst Function)
        CF -->|2. Intent Detection| Router{What is the user asking?}
        
        Router -- "Graph/Network Query" --> GraphQuery[Generate Cypher Query]
        GraphQuery -->|3a. Execute Query| Neo4j[(Neo4j DB)]
        
        Router -- "Semantic/Text Search" --> Vectorize[Generate Query Embedding]
        Vectorize -->|3b. Semantic Search| VectorDB[(Vector DB)]
        
        Neo4j -->|4. Return Raw Data| ContextAssembler[Context Assembler]
        VectorDB -->|4. Return Text Chunks| ContextAssembler
        
        ContextAssembler -->|5. Assemble Prompt| LLMCall[Call External LLM API]
    end
    
    LLMCall -->|6. Stream Response| CF
    CF -->|7. Append Citations & Stream| User
```

## 4. Security & Data Privacy in AI

- **Zero Data Retention (ZDR):** The API contracts with the external LLM providers must include a ZDR clause. The LLM provider is legally prohibited from logging the prompts (which contain sensitive police data) or using them to train future models.
- **PII Scrubbing (Optional Layer):** If ZDR cannot be guaranteed, an intermediate Catalyst Function must run a lightweight NER (Named Entity Recognition) model to mask sensitive PII (e.g., replacing "Ravi Kumar" with "[PERSON_1]") before sending the context to the LLM, and unmasking it before returning it to the user.

---
**Next Steps:** Review the [Conversational AI](./ConversationalAI.md) document to understand the design of the CrimeGPT chat interface and interaction model.
