# Vector Database (Pinecone)

## 1. Overview
CrimeGPT utilizes Pinecone to store high-dimensional embeddings of unstructured crime data (specifically the Modus Operandi and Incident Summary texts).

## 2. Purpose
To enable semantic "Case Similarity" searches. Traditional keyword searches fail when comparing "stole a bike" to "bicycle theft." Vector embeddings capture the semantic meaning, allowing the AI Orchestrator to find related cases instantly.

## 3. Functional Requirements
- **Dimension**: Must support 768-dimensional vectors (output of Gemini text-embedding models).
- **Metadata Filtering**: Must support filtering by `district` or `crime_type` to narrow down search spaces.

## 4. Technical Design

### Index Structure
- **Index Name**: `crimegpt-fir-index`
- **Metric**: Cosine Similarity

### Vector Payload
When upserting to Pinecone, the payload looks like:
```json
{
  "id": "FIR-2023-102",
  "values": [0.012, -0.045, ...], // 768 dimensions
  "metadata": {
    "district": "Bangalore Urban",
    "crime_category": "Theft",
    "year": 2023,
    "text_snippet": "Accused broke into the house via the rear window..."
  }
}
```

## 5. Data Flow
1. FIR Uploaded -> Gemini extracts MO text -> Gemini generates Embedding.
2. Catalyst Backend -> Pinecone Upsert API.
3. User Queries "Similar Cases" -> Catalyst -> Pinecone Query API -> Returns top K matches.

## 6. Edge Cases
- **Stale Vectors**: If an FIR's text is updated in the Catalyst Data Store, an event trigger must re-embed and overwrite the vector in Pinecone to prevent drift.

## 7. Future Enhancements
- Implement hybrid search (alpha) in Pinecone, combining dense vectors with sparse vectors (BM25) for exact keyword matching (e.g., license plates).
