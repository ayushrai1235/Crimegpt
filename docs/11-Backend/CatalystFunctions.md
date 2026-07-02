# Catalyst Functions Architecture

## Overview
The **Catalyst Functions** document details the backend compute layer of the **CrimeGPT** platform. Instead of managing a monolithic Node.js or Python server on AWS EC2, the architecture utilizes **Zoho Catalyst's serverless functions**. This approach guarantees horizontal scalability and zero server maintenance.

---

## 1. Types of Catalyst Functions Used

Catalyst offers several function types; CrimeGPT leverages three specific types to handle different workloads.

### 1.1. Advanced I/O Functions (The API Gateway)
- **Language:** Node.js (Express framework).
- **Purpose:** Handling standard, synchronous HTTP requests from the Next.js frontend.
- **Use Cases:**
  - `crimegpt-chat-service`: Handles streaming the LLM response to the user.
  - `crimegpt-core-service`: Handles CRUD operations for case management.
  - `crimegpt-graph-service`: Translates HTTP requests into Neo4j Cypher queries.

### 1.2. Event Functions (Asynchronous Pipelines)
- **Language:** Python (Preferred for NLP) or Node.js.
- **Purpose:** Executing heavy background tasks triggered by system events without blocking the user interface.
- **Use Cases:**
  - `fir-ingestion-pipeline`: Triggered automatically when a new PDF is dropped into the **Catalyst File Store**. It runs OCR, generates vector embeddings, and updates the Neo4j graph.

### 1.3. Cron Functions (Scheduled Jobs)
- **Language:** Python (Preferred for Machine Learning).
- **Purpose:** Executing scheduled tasks at specific intervals.
- **Use Cases:**
  - `daily-heatmap-generator`: Runs at 00:00 to execute the ML clustering algorithms and cache the predictive geo-data.
  - `anomaly-detector`: Runs every 15 minutes to compare real-time data against historical baselines.

## 2. Directory Structure Strategy

Because different Catalyst Functions can be written in different languages, the codebase maintains clear separation.

```text
/catalyst-backend
  /functions
    /crimegpt-chat-service (Node.js)
      index.js
      package.json
    /fir-ingestion-pipeline (Python)
      main.py
      requirements.txt
    /daily-heatmap-generator (Python)
      main.py
      requirements.txt
  catalyst.json
```

## 3. Deployment and Environment Variables
- All functions are deployed together using the `catalyst deploy` CLI command.
- **Secrets:** API keys (OpenAI, Neo4j, Pinecone) are never hardcoded in the function code. They are configured in the Catalyst Web Console and accessed securely at runtime (e.g., `process.env.OPENAI_API_KEY` or `os.environ.get('NEO4J_URI')`).

## 4. Cold Starts Mitigation
Serverless functions experience "cold starts" (a delay of 1-3 seconds when a function wakes up after a period of inactivity).
- **Mitigation:** For critical, user-facing Advanced I/O functions (like the Chat API), Catalyst allows configuring "Warm Instances" or "Concurrency Limits" (depending on the pricing tier) to ensure a minimum number of function instances are always running, guaranteeing immediate sub-second response times for the officers.
