# Scalability Strategy

## Overview
The **Scalability Strategy** defines how the **CrimeGPT** platform will handle growth in data volume (e.g., millions of historical FIRs) and user traffic (e.g., concurrent usage during a major law enforcement incident). 

By strictly adhering to a **Zoho Catalyst-first** architecture, the system inherently possesses elastic scaling capabilities, but specific strategies must be implemented for external services and data modeling.

---

## 1. Compute Scalability (Catalyst Functions)

### 1.1. Serverless Elasticity
- **Mechanism:** Zoho Catalyst Functions are serverless. They automatically scale out (spin up new instances) to handle incoming concurrent HTTP requests or events.
- **Benefit:** If 1,000 officers simultaneously query CrimeGPT during a crisis, Catalyst will provision enough function instances to process the requests without traditional server crashes.
- **Limitation Handling (Cold Starts):** While Catalyst handles scaling, sudden spikes can cause slight delays (cold starts) as new instances boot. This is acceptable for AI queries but mitigated for UI loading via aggressive caching.

### 1.2. Asynchronous Decoupling
- **Strategy:** Heavy processing tasks (like parsing a 500-page historical PDF) are decoupled from the user request.
- **Implementation:** The user uploads the file to **Catalyst File Store**, which triggers an asynchronous Catalyst Event Function. The user receives immediate UI feedback ("Processing..."), preventing HTTP timeouts and freeing up web server threads.

## 2. Database Scalability

### 2.1. Catalyst Data Store (Relational)
- **Strategy:** Vertical scaling handled natively by Zoho Catalyst based on usage tiers.
- **Optimization:** To prevent the relational database from becoming a bottleneck during high read-loads, **Catalyst Cache** is implemented to serve frequently accessed, read-heavy data (like dashboard statistics).

### 2.2. Vector Database (External)
- **Strategy:** Cloud-native vector databases (like Pinecone) scale horizontally.
- **Optimization (Data Partitioning/Namespaces):** To maintain fast semantic search speeds as data grows to millions of FIRs, vector embeddings will be partitioned using metadata filters (e.g., searching only within a specific year or specific crime category) before executing the nearest-neighbor search.

### 2.3. Graph Database (Neo4j)
- **Strategy:** Neo4j AuraDB automatically scales compute and memory.
- **Optimization:** Graph queries can become exponentially slow if poorly written (e.g., traversing too many hops). Catalyst Functions will enforce maximum depth limits on Cypher queries (e.g., limiting network graphs to 3 degrees of separation).

## 3. Storage Scalability

### 3.1. Catalyst File Store
- **Mechanism:** Object storage is inherently infinitely scalable.
- **Strategy:** FIR PDFs and evidence files will be organized into logical bucket structures (e.g., `/year/district/station/fir_id.pdf`) to maintain manageable directory listings.

## 4. AI & API Scalability (Rate Limiting)

### 4.1. External LLM Bottlenecks
- **Risk:** External LLMs (OpenAI/Gemini) have strict Tokens-Per-Minute (TPM) limits. If 500 officers query the AI simultaneously, the API will return 429 Too Many Requests errors.
- **Mitigation Strategy:**
  1. **Enterprise Tier:** Procure enterprise API keys with dedicated capacity.
  2. **Caching:** Implement a semantic cache within the Catalyst Function. If Officer B asks a question semantically identical to a question Officer A asked 5 minutes ago, return the cached AI response instead of calling the LLM again.
  3. **Queueing (If necessary):** For non-urgent AI tasks (like batch summarization), place them in a queue to be processed at a controlled rate by a Catalyst Cron job.

---
**Next Steps:** Review the [High Availability](./HighAvailability.md) document to understand how the system remains operational during component failures.
