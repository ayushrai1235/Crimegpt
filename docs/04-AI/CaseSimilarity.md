# Semantic Case Similarity Engine

## 1. Overview
The Case Similarity Engine automatically finds historical cases that match the pattern of a newly uploaded FIR, even if the exact keywords differ.

## 2. Purpose
To help investigators instantly connect a new crime to past incidents, uncovering serial offenders or organized crime rings operating with a consistent Modus Operandi (MO).

## 3. Functional Requirements
- **Automated Matching**: As soon as an FIR is uploaded, similar cases must be displayed in the Investigation Workspace.
- **Semantic Understanding**: Must match intent, not just keywords (e.g., "stole a bicycle" matches "took a bike").
- **Confidence Scoring**: Must display a similarity percentage (e.g., "85% Match").

## 4. Technical Design
1. **Embedding**: When an FIR is processed, Gemini generates a 768-dimensional vector embedding of the FIR's "Modus Operandi" and "Incident Details" sections.
2. **Storage**: The vector is upserted into a Pinecone index under a namespace specific to the district.
3. **Querying**: When a user clicks "Find Similar," the current FIR's vector is sent to Pinecone for a Cosine Similarity search, returning the top 5 nearest neighbors.

## 5. Data Flow
See `DataFlow.md` for the Case Similarity sequence diagram.

## 6. Edge Cases
- **Generic MO**: If an MO is extremely generic ("Theft"), the engine might return hundreds of low-confidence matches. The UI filters out any match below a 70% threshold.

## 7. Future Enhancements
- Implement Hybrid Search (Sparse-Dense) using Pinecone to combine exact keyword matching (e.g., specific vehicle license plates) with semantic MO matching.
