# Microservice Design

## Overview
The **Microservice Design** document details the granular structure of the backend services powering **CrimeGPT**. While **Zoho Catalyst** abstracts away server management, the backend logic must still be logically separated into independent **Catalyst Functions** (Microservices) to ensure maintainability, independent deployment, and targeted scaling.

---

## 1. Microservice Principles in Catalyst

1. **Single Responsibility:** Each Catalyst Function (or logical group of endpoints within an Advanced I/O function) should do one thing well (e.g., The Auth Function handles ONLY login/logout).
2. **Statelessness:** Functions must not store state in memory between executions. All state must be pushed to the **Catalyst Data Store** or **Catalyst Cache**.
3. **Decoupled Deployments:** A bug in the Analytics Function should not prevent the Chat Function from being deployed or executed.

## 2. Core Microservices Details

### 2.1. `crimegpt-auth-service`
**Type:** Advanced I/O Catalyst Function (Node.js/Express)
**Purpose:** Wraps the native Catalyst Authentication SDK to enforce custom KSP business rules (e.g., checking if an officer is currently suspended before issuing a token).
**Endpoints:**
- `POST /login`
- `POST /logout`
- `GET /validate-token`
- `POST /mfa/verify`

### 2.2. `crimegpt-chat-service`
**Type:** Advanced I/O Catalyst Function (Python/FastAPI)
*Note: Python is preferred here due to superior libraries for AI/LangChain integration.*
**Purpose:** Orchestrates the core Conversational AI experience.
**Endpoints:**
- `POST /chat/stream` (Main interaction endpoint)
- `GET /chat/history/:sessionId`
- `POST /chat/new-session`
**Dependencies:** Connects to Vector DB, External LLM API, and Catalyst File Store.

### 2.3. `crimegpt-ingestion-worker`
**Type:** Event-Driven Catalyst Function (Python)
**Purpose:** Asynchronously processes newly uploaded FIRs.
**Trigger:** `Catalyst File Store -> onUpload`
**Process:**
1. Downloads PDF from File Store.
2. Runs OCR (if scanned).
3. Extracts Entities (NLP).
4. Generates Embeddings.
5. Updates Data Store, Vector DB, and Neo4j.

### 2.4. `crimegpt-graph-service`
**Type:** Advanced I/O Catalyst Function (Node.js)
**Purpose:** Handles all queries related to criminal network analysis.
**Endpoints:**
- `GET /graph/suspect/:id/network` (Returns 2-hop network for UI rendering)
- `GET /graph/fir/:id/entities`
**Dependencies:** Solely responsible for querying the Neo4j database.

### 2.5. `crimegpt-analytics-cron`
**Type:** Scheduled Catalyst Function (Python)
**Purpose:** Runs heavy ML predictions during off-peak hours.
**Trigger:** `Catalyst Cron -> Daily at 00:00 IST`
**Process:**
1. Pulls last 30 days of FIR metadata from Catalyst Data Store.
2. Runs geospatial clustering (e.g., DBSCAN/K-Means).
3. Serializes output to GeoJSON.
4. Pushes result to `Catalyst Cache` under key `daily_heatmap`.

## 3. API Gateway and Routing

Zoho Catalyst provides built-in API routing for Advanced I/O functions. The frontend will communicate with these services via the Catalyst API Gateway.

```text
Frontend Request -> https://crimegpt-xxxxx.catalystserverless.in/server/
  |-- /auth/*       -> Routes to crimegpt-auth-service
  |-- /chat/*       -> Routes to crimegpt-chat-service
  |-- /graph/*      -> Routes to crimegpt-graph-service
```

## 4. Shared Dependencies and Code Reusability

To prevent code duplication across different Catalyst Functions, shared logic MUST be abstracted.
- **Catalyst Cloud Scale** allows for the creation of shared libraries or packages.
- Common utilities (e.g., `logger.js`, `db_connector.js`, `error_handler.js`) will be maintained in a shared repository folder and deployed alongside the functions.

---
**Next Steps:** Review the [Component Architecture](./ComponentArchitecture.md) document to see how the Next.js frontend is structured to interact with these microservices.
