# Vector Database Architecture

## Overview
The **Vector Database** (e.g., Pinecone, Weaviate, or Qdrant) is the specialized external storage engine that powers the "brain" of **CrimeGPT**. It stores high-dimensional mathematical representations (embeddings) of FIR text, enabling the **Catalyst AI Functions** to perform rapid *semantic search*—finding meaning rather than just matching exact keywords.

---

## 1. Why a Vector Database?

If an officer searches for *"jewelry stolen from a house by breaking the lock"*:
- A standard SQL search (in Catalyst Data Store) looks for exact words: "jewelry", "stolen", "breaking". It will miss an FIR that says *"gold ornaments were looted after shattering the backdoor latch"*.
- A Vector Search understands that "jewelry" and "gold ornaments", and "breaking" and "shattering" have the same semantic meaning, and will successfully retrieve the relevant FIR.

## 2. Embedding Model

Before text can be stored in the Vector DB, it must be converted into an embedding array.
- **Model Choice:** OpenAI `text-embedding-3-small` or Google Vertex AI Text Embeddings.
- **Dimensions:** Typically 1536 dimensions.
- **Execution:** This conversion is performed securely within a **Catalyst Function** during the data ingestion phase.

## 3. Data Chunking Strategy

FIRs are often long documents (5-20 pages). Feeding an entire FIR into an embedding model Dilutes the semantic meaning. The **Catalyst Ingestion Function** must chunk the text before vectorizing.

### 3.1. Chunking Rules
- **Chunk Size:** 500 - 800 tokens.
- **Overlap:** 100 tokens (to ensure context is not lost if a sentence is split).
- **Separation:** Chunk by paragraph or logical section (e.g., "Complaint Details", "Investigation Notes") rather than arbitrary character counts.

## 4. Vector Record Schema

When a chunk is stored in the Vector DB, it must include metadata. This metadata allows **Catalyst Functions** to pre-filter the vector search, drastically improving speed and accuracy.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique ID for the chunk (e.g., `fir_102_2023_chunk_4`). |
| `values` | Array[Float] | The 1536-dimensional embedding vector. |
| **Metadata** | | |
| `fir_id` | String | The parent FIR ID (crucial for Citation links). |
| `station_id` | String | Pre-filter: Allows searching only within a specific jurisdiction. |
| `year` | Integer | Pre-filter: Allows searching within a specific timeframe. |
| `crime_category` | String | E.g., "Property", "Violent", "Cyber". |
| `text` | String | The actual text of the chunk (passed to the LLM during RAG). |

## 5. The RAG Query Flow

When an investigator asks CrimeGPT a question, the following flow executes within the **Catalyst Chat Service**:

1. **User Query:** "Show me recent cybercrimes involving crypto wallets in Bengaluru."
2. **Vectorize Query:** Catalyst Function calls the embedding API to turn the user's query into a vector.
3. **Filter & Search:** Catalyst Function queries the Vector DB: 
   - *Filter:* `crime_category == "Cyber" AND district == "Bengaluru"`
   - *Search:* Find the Top-K (e.g., 5) vectors with the highest Cosine Similarity to the query vector.
4. **Context Assembly:** The Vector DB returns the 5 most relevant `text` chunks.
5. **LLM Generation:** The Catalyst Function sends the user's query AND the 5 text chunks to the LLM (e.g., Gemini) with the strict prompt: *"Answer the query using ONLY the provided text chunks. Cite the fir_id."*

## 6. Maintenance and Synchronization

- **Deletions/Updates:** If an FIR is expunged or updated in the Catalyst Data Store, an event-driven Catalyst Function must issue a delete/update command to the Vector DB using the `fir_id` metadata tag to ensure stale data is not retrieved.

---
**Next Steps:** Review the [Caching](./Caching.md) document to understand how we reduce load on these databases.
