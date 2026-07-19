# 🚔 CrimeGPT: Intelligent Law Enforcement Platform

![CrimeGPT Banner](https://img.shields.io/badge/Platform-CrimeGPT-blue?style=for-the-badge&logo=polkadot)
![Tech Stack](https://img.shields.io/badge/Next.js-Zoho_Catalyst-black?style=for-the-badge&logo=next.js)
![AI](https://img.shields.io/badge/Google_Gemini-Neo4j-orange?style=for-the-badge&logo=google)

**CrimeGPT** is an advanced, multilingual intelligence platform built for the **Karnataka State Police (KSP) Datathon**. It transforms raw, unstructured FIR (First Information Report) data into actionable intelligence, interactive criminal network graphs, and sociological profiles using cutting-edge Generative AI and Graph Database technologies.

---

## ✨ Features

- 🗣️ **Multilingual RAG Chat (English & Kannada)**: Chat with your FIR database. Ask complex questions like *"Show me all zero FIRs related to cybercrime"* and get answers strictly grounded in official documents with direct citations.
- 🕸️ **Automated Criminal Network Visualization**: Automatically extracts entities (Accused, Victims, Financial Accounts) from unstructured FIRs and links them in a real-time Neo4j graph to expose hidden crime syndicates and repeat offenders.
- 🧠 **Sociological Offender Profiling**: Uses AI to analyze the Modus Operandi (MO) and operational zones of suspects, generating real-time risk scores and sociological insights.
- ⚡ **Automated Ingestion Pipeline**: Serverless event-driven architecture that processes new FIRs as soon as they are uploaded.

---

## 🚀 How is CrimeGPT Different?

Most police databases rely on simple keyword searches (e.g., searching for a name). CrimeGPT represents a paradigm shift:
1. **Semantic Understanding**: It understands the *context* of a crime, not just keywords.
2. **Connecting the Unconnected**: If Accused A in FIR 1 transfers money to Account X, and Accused B in FIR 2 uses the *same* Account X, CrimeGPT automatically visually links them in the Graph Network—exposing organized syndicates that would normally go unnoticed.
3. **Zero Hallucination Policy**: The AI is heavily constrained by system prompts to *only* answer based on retrieved FIR context, completely eliminating AI hallucinations.

---

## 🏗️ Architecture & Flowchart

CrimeGPT uses a robust microservices architecture orchestrated on **Zoho Catalyst**.

```mermaid
graph TD
    %% Frontend
    Client[Next.js Frontend UI]
    
    %% API Gateway / Catalyst
    subgraph Zoho Catalyst Serverless
        ChatAPI[crimegpt-chat-service\n(Port 3001)]
        GraphAPI[crimegpt-graph-service\n(Port 3002)]
        InsightsAPI[crimegpt-insights-service\n(Port 3003)]
        Ingestion[fir-ingestion-pipeline\n(Event Triggered)]
    end

    %% Databases & External APIs
    Gemini[Google Gemini 2.0 Flash\nLLM & Embeddings]
    Pinecone[(Pinecone Vector DB\nSemantic Search)]
    Neo4j[(Neo4j AuraDB\nGraph Database)]
    CatalystDB[(Catalyst Data Store)]

    %% Connections
    Client <-->|REST API| ChatAPI
    Client <-->|REST API| GraphAPI
    Client <-->|REST API| InsightsAPI

    ChatAPI -->|1. Generate Embeddings| Gemini
    ChatAPI -->|2. Retrieve Context| Pinecone
    ChatAPI -->|3. Generate Answer| Gemini
    
    GraphAPI -->|Fetch Nodes/Edges| Neo4j
    InsightsAPI -->|Fetch Profiles| Neo4j
    InsightsAPI -->|Analyze MO| Gemini

    %% Ingestion Flow
    Upload[Raw FIR PDF Upload] --> Ingestion
    Ingestion -->|Extract JSON Entities| Gemini
    Ingestion -->|Upsert Entities| Neo4j
    Ingestion -->|Chunk & Embed| Pinecone
```

---

## ☁️ Zoho Catalyst Services Utilized

We leveraged the power of **Zoho Catalyst** to build a highly scalable, serverless backend:

1. **Advanced I/O Functions (Node.js)**: Used to host our independent Express microservices (`chat-service`, `graph-service`, `insights-service`). This allows independent scaling of features.
2. **Event Functions**: The `fir-ingestion-pipeline` acts as an event-driven function that triggers automatically to process new data.
3. **Catalyst Data Store**: Used as the primary relational database for structured tabular data (User management, Case Master indexing).
4. **Catalyst File Store**: Designed for secure, compliant storage of the raw FIR PDF files before ingestion.

---

## 📊 The Data

The system is built to ingest and analyze standard **Karnataka Police FIR data**. 
For the MVP/Demo, the system utilizes highly realistic mock data structured to mirror official records:
- **Case Details**: Crime Numbers, Dates, Jurisdictions (e.g., *Koramangala PS*).
- **Entities**: Accused details, Victim demographics, and Financial Account footprints.
- **Modus Operandi (MO)**: Unstructured text describing the incident (e.g., *phishing links, physical assault*).

The ingestion pipeline automatically maps this data into our semantic vector space (Pinecone) and topological space (Neo4j).

---

## 💻 Local Development Setup

To run the full stack locally bypassing the CLI for development:

1. **Clone the repository**
2. **Set up Environment Variables**: Configure your `.env` in `catalyst-backend` with keys for Gemini, Pinecone, and Neo4j.
3. **Start the environment**:
   ```bash
   # Terminal 1: Start Backend Microservices
   cd catalyst-backend
   node start-local.mjs

   # Terminal 2: Start Frontend
   cd frontend
   npm run dev
   ```
4. Access the platform at `http://localhost:3000`
