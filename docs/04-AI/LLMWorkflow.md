# LLM Workflow

## Overview
The **LLM Workflow** document maps the exact sequence of events that occur from the moment a user submits a query to the moment the AI generates a response. This workflow highlights how **Zoho Catalyst Functions** orchestrate the interaction between databases, prompts, and the external Large Language Model.

---

## 1. The Orchestration Layer

The external LLM (e.g., Gemini or OpenAI) is inherently stateless and "dumb" to the context of the KSP system. It relies entirely on the **Catalyst AI Orchestrator Function** to provide it with instructions, history, and verified data.

## 2. Step-by-Step Workflow

### Step 1: Query Reception & Validation
- **Action:** User submits a query via the Next.js UI.
- **Catalyst Component:** API Gateway routes to the `crimegpt-chat-service` Catalyst Function.
- **Process:** The function extracts the user's JWT, verifies their role (e.g., Inspector), and determines their `station_id` (jurisdiction).

### Step 2: Intent Detection & Router
- **Action:** Determine what the user is trying to accomplish.
- **Process:** A fast, lightweight check is performed (using regex or a small, cheap LLM call) to classify the intent (e.g., `FACT_RETRIEVAL`, `GRAPH_QUERY`, `SUMMARIZATION`).

### Step 3: Context Retrieval (RAG & Graph)
- **Action:** Fetch the official data required to answer the query.
- **Process (If FACT_RETRIEVAL):**
  - Convert query to embedding.
  - Query Vector DB, passing `station_id` as a metadata filter to ensure RBAC compliance.
  - Retrieve the top 5 relevant text chunks.
- **Process (If GRAPH_QUERY):**
  - Translate query to Cypher.
  - Execute against Neo4j to find relationships.
  - Convert result to JSON context.

### Step 4: Memory Injection
- **Action:** Provide the LLM with conversational continuity.
- **Catalyst Component:** **Catalyst Cache**.
- **Process:** The function fetches the last 5 interactions (User Prompt + AI Response) for the current `session_id` from Cache.

### Step 5: Prompt Assembly
- **Action:** Construct the final, massive string of text to send to the LLM.
- **Process:** The Catalyst Function concatenates:
  1. The Master System Prompt (Rules).
  2. The Conversational Memory (History).
  3. The Retrieved Context (FIR Chunks or Graph JSON).
  4. The User's Current Query.

### Step 6: LLM Invocation & Streaming
- **Action:** Call the external AI model.
- **Process:** The Catalyst Function makes a secure HTTPS call to the LLM provider's API. It requests a `stream: true` response. As chunks of text return from the LLM, the Catalyst Function immediately pipes them back to the frontend UI via Server-Sent Events (SSE).

### Step 7: Post-Processing & Auditing
- **Action:** Clean up and log the interaction.
- **Process:**
  1. Parse the final response for citation tags and convert them to secure URLs linking to the **Catalyst File Store**.
  2. Asynchronously save the entire interaction (Prompt + Response + Citations) to the `Chat_Messages` table in the **Catalyst Data Store**.
  3. Update the short-term memory in **Catalyst Cache**.

## 3. Handling Context Windows

Modern LLMs have large context windows (e.g., 128k - 1M tokens), but filling them unnecessarily increases latency and cost.
- **Optimization:** The Catalyst Function dynamically calculates token counts before Step 5. If the retrieved context is too large, it prioritizes the most semantically relevant chunks and drops older conversation history to stay within optimal performance limits.

---
**Next Steps:** Review the [Hybrid Search](./HybridSearch.md) document to understand how we ensure we find the right context chunks in Step 3.
