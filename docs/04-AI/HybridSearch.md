# Hybrid Search Architecture

## Overview
The **Hybrid Search** document explains the retrieval strategy used by the **CrimeGPT** platform. Relying solely on Vector Search (Semantic) or solely on Keyword Search (Lexical) leads to suboptimal results in law enforcement scenarios. 

This architecture combines both approaches, orchestrated seamlessly by **Zoho Catalyst Functions**, to ensure investigators always find the right case files.

---

## 1. The Problem with Single-Method Search

### The Limitation of Vector Search (Semantic Only)
Vector search is excellent at understanding meaning (matching "vehicle theft" with "stolen car"). However, it performs poorly on exact keyword lookups. 
*Example:* If an officer searches for an exact FIR number ("FIR 102/2023") or a highly specific name ("Venkataramanappa"), vector embeddings might miss it because the specific sequence of letters gets diluted in the vector space.

### The Limitation of Keyword Search (Lexical Only)
Keyword search (like traditional SQL `LIKE` or Elasticsearch/Catalyst Search) is perfect for exact matches. However, it fails completely if the user uses a synonym or misspells a word.
*Example:* Searching for "arson" will miss an FIR that describes "deliberately setting fire to the building".

## 2. The Hybrid Solution

Hybrid search executes both a semantic and a lexical search simultaneously, combines the results, scores them, and returns the most relevant documents.

### 2.1. The Dual-Database Approach
- **Lexical Engine:** **Catalyst Search** (Indexes the structured metadata and raw text in the Catalyst Data Store).
- **Semantic Engine:** **Vector Database** (Indexes the embeddings of the chunked FIR text).

## 3. The Hybrid Search Workflow (Via Catalyst Functions)

When a user submits a search query, the **Catalyst Orchestrator Function** performs the following steps:

```mermaid
graph TD
    Query[User Query: "Arson by Venkataramanappa"] --> CF[Catalyst Function]
    
    CF -->|1. Lexical Search| CS[Catalyst Search DB]
    CF -->|2. Semantic Search| VDB[Vector DB]
    
    CS -->|Returns Top 10 Exact Matches| Ranker[Reciprocal Rank Fusion (RRF)]
    VDB -->|Returns Top 10 Semantic Matches| Ranker
    
    Ranker -->|3. Merge & Deduplicate| FinalList[Top 5 Consolidated Results]
    FinalList --> RAG[Pass to LLM Context / Display to User]
```

### Step 1: Parallel Execution
The Catalyst Function initiates asynchronous calls to both Catalyst Search (looking for the exact string "Venkataramanappa") and the Vector DB (looking for the concept of "arson").

### Step 2: Reciprocal Rank Fusion (RRF)
The function receives two lists of results. It must merge them intelligently. It uses the **Reciprocal Rank Fusion** algorithm (a standard mathematical formula implemented in the Catalyst Function) to score documents based on their rank in both lists.
- A document that appears high in *both* lists gets the highest score.
- A document containing the exact name but lacking semantic similarity still scores high enough to be included.

### Step 3: Thresholding & Context Passing
The Catalyst Function takes the top 5 highest-scoring documents from the merged list. These documents form the highly accurate context payload that is passed to the LLM for the RAG generation phase.

## 4. Performance Considerations
Running two searches adds marginal latency, but because **Catalyst Functions** can execute asynchronous HTTP requests concurrently (using `Promise.all` in Node.js or `asyncio` in Python), the total retrieval time is only as slow as the slowest individual database, remaining well under the required 1-second threshold.

---
**Next Steps:** Review the [Semantic Search](./SemanticSearch.md) deep-dive to understand the vector mechanics in more detail.
