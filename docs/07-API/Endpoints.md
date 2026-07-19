# API Endpoints Documentation

## 1. Overview
This document outlines the REST API contracts for the unified CrimeGPT Catalyst backend. The API is designed to be modular and consumed entirely by the Next.js frontend.

## 2. Purpose
To provide frontend and backend developers with a single source of truth for request/response structures, ensuring smooth integration.

## 3. Functional Requirements
All endpoints must return JSON. Errors must follow a standardized format.

### Error Format
```json
{
  "error": true,
  "message": "Human readable message",
  "code": "ERR_CODE"
}
```

## 4. Technical Design (Endpoints)

### `POST /upload-fir`
- **Purpose**: Uploads a PDF for processing.
- **Related Catalyst Function**: Upload Function
- **Request (FormData)**: `file` (PDF)
- **Response**:
```json
{
  "success": true,
  "case_id": "FIR-2023-102",
  "extracted_entities": {
    "accused": ["John Doe"],
    "mo": "Broke window..."
  }
}
```

### `POST /chat`
- **Purpose**: Interacts with the AI Orchestrator.
- **Related Catalyst Function**: Chat Function (Orchestrator)
- **Request**:
```json
{
  "query": "Who is involved in FIR-102?",
  "history": []
}
```
- **Response**:
```json
{
  "response": "John Doe is involved. [FIR-2023-102]",
  "confidence": 98,
  "citations": ["FIR-2023-102"]
}
```

### `POST /similar-cases`
- **Purpose**: Triggers Pinecone semantic search.
- **Request**: `{ "fir_id": "FIR-102" }`
- **Response**:
```json
{
  "matches": [
    { "fir_id": "FIR-099", "score": 88.5, "mo": "..." }
  ]
}
```

### `GET /heatmap`
- **Purpose**: Retrieves geospatial density data.
- **Response**:
```json
{
  "points": [
    { "lat": 12.9716, "lng": 77.5946, "weight": 5 }
  ]
}
```

### `GET /network`
- **Purpose**: Retrieves Vis.js compatible graph data.
- **Query Params**: `?fir_id=FIR-102`
- **Response**:
```json
{
  "nodes": [ { "id": 1, "label": "John Doe", "group": "Accused" } ],
  "edges": [ { "from": 1, "to": 2, "label": "ACCUSED_IN" } ]
}
```

## 5. Data Flow
Frontend -> Catalyst API Router -> Specific Catalyst Module.

## 6. Edge Cases
- **Timeouts**: The `/upload-fir` endpoint may take up to 10 seconds. The frontend must implement a loading state and long-polling if necessary.

## 7. Future Enhancements
- Implement GraphQL for complex analytics queries to reduce over-fetching.
