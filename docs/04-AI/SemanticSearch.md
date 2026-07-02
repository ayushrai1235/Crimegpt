# Semantic Search Implementation

## Overview
The **Semantic Search** document expands upon the Vector Database architecture, detailing the specific mechanics of how meaning-based search is executed within the **Zoho Catalyst** environment for the **CrimeGPT** platform.

---

## 1. The Core Mechanic: Cosine Similarity

When a **Catalyst Function** sends a user's text query to the embedding model, it returns a vector (a list of 1536 floating-point numbers). The Vector Database compares this query vector against the millions of FIR chunk vectors stored within it.

The comparison method used is **Cosine Similarity**, which measures the angle between two vectors. 
- A score of `1.0` means the texts are semantically identical.
- A score of `0.0` means they are completely unrelated.

## 2. Setting the Similarity Threshold

Returning chunks that are mathematically dissimilar will confuse the LLM during the RAG generation phase. The **Catalyst AI Function** must enforce a strict threshold.

- **Threshold:** `> 0.75` Cosine Similarity.
- **Rule:** If the Vector DB returns 5 chunks, but 3 of them have a similarity score below 0.75, the Catalyst Function must discard those 3 chunks before passing the remaining 2 to the LLM.
- **Fallback:** If *all* chunks fall below the threshold, the function skips the LLM call entirely and returns: "I cannot find relevant records matching this specific query."

## 3. Metadata Filtering (Pre-Filtering)

Vector search across millions of records is computationally expensive. Pre-filtering by metadata is mandatory to maintain sub-second response times.

Every embedding stored in the Vector DB must contain structured metadata derived from the **Catalyst Data Store**.

**Example Metadata Payload:**
```json
{
  "chunk_id": "c_9942",
  "fir_id": "102/2023",
  "station_id": "STN_045",
  "year": 2023,
  "crime_type": "Theft"
}
```

When an officer from Station 045 queries "recent bike thefts", the **Catalyst Function** translates this into a Vector DB query:
- `vector`: [0.014, -0.055, ...]
- `filter`: `{ "station_id": "STN_045", "year": { "$gte": 2023 } }`

This ensures the semantic search only scans the vectors relevant to the officer's jurisdiction, guaranteeing both high speed and strict RBAC compliance.

## 4. Multi-Modal Semantic Search (Future Scope)

While currently focused on text, semantic search can support images. If an image of a suspect or a stolen vehicle is uploaded to the **Catalyst File Store**:
1. A specialized Embedding Model (like CLIP) converts the image into a vector.
2. The officer can upload a CCTV screenshot, and the system performs a semantic search to find visually similar evidence images attached to historical FIRs.

---
**Next Steps:** Review the [Tool Calling](./ToolCalling.md) document to see how the LLM actively interacts with the Catalyst backend.
