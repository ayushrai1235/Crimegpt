# Caching Strategy

## Overview
The **Caching Strategy** document outlines how **Zoho Catalyst Cache** is utilized within the **CrimeGPT** platform to drastically reduce database load, lower external API costs, and ensure a lightning-fast User Experience (UX).

In a serverless environment like Catalyst, aggressive caching is the primary mechanism for mitigating the inherent latency of stateless function invocations and database connection overhead.

---

## 1. What is Catalyst Cache?
Zoho Catalyst provides a managed, in-memory caching service (functionally similar to Redis or Memcached). Data is stored as Key-Value pairs and resides in RAM, allowing for sub-millisecond retrieval times.

## 2. Core Caching Use Cases

### 2.1. Dashboard Metrics and Heatmaps (Long-Lived Cache)
- **Problem:** When the Commissioner logs in, calculating state-wide crime statistics and predictive heatmaps requires scanning millions of rows in the Data Store and running complex ML clustering algorithms.
- **Solution:** A **Catalyst Cron** job runs at 00:00 IST daily to perform these calculations. The resulting JSON object is stored in Catalyst Cache.
- **Key:** `dashboard_statewide_metrics_{date}`
- **TTL (Time to Live):** 24 Hours.
- **Retrieval:** The frontend dashboard API endpoint simply fetches this key, reducing load time from 5+ seconds to < 50ms.

### 2.2. Chat Session Context (Short-Lived Cache)
- **Problem:** CrimeGPT must remember the context of an ongoing conversation (e.g., "What was the suspect's name again?"). Fetching the entire chat history from the Data Store for every new message is inefficient.
- **Solution:** The active conversation array is temporarily held in Cache.
- **Key:** `chat_session_context_{session_id}`
- **TTL:** 1 Hour (Refreshed on every new message).
- **Retrieval:** The Catalyst Function pulls the context from RAM, appends the new message, sends it to the LLM, and asynchronously writes the updated log back to the Data Store for permanent persistence.

### 2.3. Semantic Query Caching (Cost Reduction)
- **Problem:** LLM API calls (OpenAI/Gemini) are charged per token. If multiple officers ask identical or semantically identical questions (e.g., "Summarize the new cybercrime directives"), we pay the LLM multiple times.
- **Solution:** Implement a semantic cache layer. Before calling the LLM, the Catalyst Function hashes the user's prompt (or uses a fast, lightweight semantic similarity check).
- **Key:** `llm_response_hash_{query_hash}`
- **TTL:** 7 Days (for general intelligence queries).
- **Retrieval:** If a match is found, the cached AI response is returned instantly, bypassing the LLM entirely and saving API costs.

## 3. Cache Invalidation Strategies

Stale data in law enforcement can lead to poor decision-making. Cache must be invalidated (deleted or updated) when the underlying data changes.

### 3.1. Event-Driven Invalidation
When an active FIR is updated in the **Catalyst Data Store** (e.g., Status changed from 'Open' to 'Closed'), a trigger executes a Catalyst Function that explicitly calls the Catalyst Cache API to delete any cached keys related to that specific `fir_id`.

### 3.2. Time-Based Invalidation (TTL)
For data that changes slowly or where slight delays are acceptable (like daily heatmaps), strict TTLs are used. The cache simply expires, forcing the next request to recalculate the data and repopulate the cache.

---
**Next Steps:** Review the [Database Indexes](./DatabaseIndexes.md) document to see how we optimize the queries that *must* hit the Data Store.
