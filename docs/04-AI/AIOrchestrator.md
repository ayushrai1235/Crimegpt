# AI Orchestrator

## 1. Overview
The AI Orchestrator is the central brain of the CrimeGPT platform. It is a dedicated Zoho Catalyst module responsible for receiving user queries, determining intent, routing to the appropriate data sources, validating evidence, and generating the final response using Gemini.

## 2. Purpose
To ensure that all AI interactions are intelligent, context-aware, and strictly bounded by Explainable AI (XAI) principles. It prevents hallucination by acting as a strict referee between the LLM and the raw data.

## 3. Functional Requirements
- **Intent Detection**: Must identify whether a query is asking for a specific case, a geographical hotspot, or a relationship graph.
- **Tool Routing**: Must dynamically decide whether to query the Catalyst Data Store, Neo4j, or Pinecone.
- **Evidence Validation**: Must cross-check LLM generated claims against the retrieved metadata before responding to the user.

## 4. Technical Design

### The Orchestration Workflow
1. **User Query**: e.g., "Find cases similar to Crime 102."
2. **Intent Detection**: The Orchestrator uses a fast, low-parameter prompt to classify the intent (`similarity_search`).
3. **Determine Required Tools**: Maps intent to the required backend module (in this case, Pinecone via the Catalyst Prediction Module).
4. **Data Store Query**: Fetches base metadata for Crime 102 from Catalyst.
5. **Pinecone Retrieval**: Fetches the top 5 nearest neighbor cases.
6. **Gemini Reasoning**: Passes the query and the retrieved cases to Gemini 2.0.
7. **Evidence Validation**: A programmatic check ensures Gemini's response only cites the 5 provided cases.
8. **Explainable Response**: The final JSON payload is constructed containing the text, citations, and confidence score.

## 5. Data Flow
See `DataFlow.md` for the sequence diagram of the AI Chat Flow.

## 6. Edge Cases
- **Zero Hits**: If Neo4j or Pinecone return no results, the Orchestrator explicitly states "No evidence found" rather than allowing Gemini to guess.
- **Multi-Intent Queries**: "Show me the graph for accused X and predict their next crime" is split into two distinct sub-tasks by the Orchestrator.

## 7. Future Enhancements
- Implement LangChain or LlamaIndex for more advanced graph-based reasoning paths.
