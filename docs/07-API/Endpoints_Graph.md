# API Endpoints: Network Graph

## Overview
This document details the REST API endpoints provided by the `crimegpt-graph-service` **Catalyst Function**. These endpoints interface with the Neo4j Graph Database to generate the visual nodes and edges for the Criminal Network feature.

---

## 1. Retrieve Subgraph for Entity

### `GET /api/v1/network`
Retrieves a JSON representation of a network surrounding a specific entity (Suspect, Location, or Vehicle).

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `entity_type` (string, required): e.g., "Person", "Vehicle", "Phone"
  - `entity_id` (string, required): e.g., "Ravi Kumar" or "KA-01-AB-1234"
  - `depth` (integer, default: 2, max: 3): Degrees of separation to traverse.
- **Response (200 OK):**
Returns a structured graph format compatible with visualization libraries like Vis.js.
```json
{
  "status": "success",
  "data": {
    "nodes": [
      { "id": "n1", "label": "Person", "properties": { "name": "Ravi Kumar" } },
      { "id": "n2", "label": "FIR", "properties": { "id": "FIR-102" } },
      { "id": "n3", "label": "Person", "properties": { "name": "Suresh" } }
    ],
    "edges": [
      { "source": "n1", "target": "n2", "type": "ACCUSED_IN" },
      { "source": "n3", "target": "n2", "type": "ACCUSED_IN" }
    ]
  }
}
```
- **Error (400 Bad Request):** If the user requests a `depth` > 3 (preventing database timeouts).

## 2. Retrieve Shortest Path

### `GET /api/v1/network/path`
Finds the shortest degree of connection between two distinct entities.

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `source_node_id` (string, required)
  - `target_node_id` (string, required)
- **Response (200 OK):**
Returns an ordered array representing the path.
```json
{
  "status": "success",
  "data": {
    "path": [
      { "node": "Ravi Kumar", "type": "Person" },
      { "relation": "ACCUSED_IN" },
      { "node": "FIR-2021-04", "type": "FIR" },
      { "relation": "OCCURRED_AT" },
      { "node": "Majestic Bus Stand", "type": "Location" }
    ]
  }
}
```
- **Error (404 Not Found):** If no path exists between the two entities within the maximum allowed traversal depth.
