# Catalyst Functions Documentation

## 1. Overview
The backend of CrimeGPT is entirely hosted on Zoho Catalyst. Instead of deploying disparate microservices on Docker/Kubernetes, the platform uses a unified Catalyst Advanced I/O function that routes requests to logical internal modules.

## 2. Purpose
To leverage Catalyst's serverless autoscaling and integrated ecosystem (Data Store, File Store, Cron, Cache) for a streamlined, high-performance backend.

## 3. Functional Requirements
The backend must handle PDF uploads, AI orchestration, database queries, and analytics generation.

## 4. Technical Design

### Core Modules

**1. Upload Module (`/api/upload`)**
- **Purpose**: Processes raw FIR PDFs.
- **Internal Workflow**: Receives file -> Uploads to Catalyst File Store -> Calls Gemini for extraction -> Writes to Catalyst Data Store -> Generates Embedding -> Upserts to Pinecone -> Updates Neo4j.
- **Performance**: High latency (async event recommended).

**2. AI Orchestrator Module (`/api/chat`)**
- **Purpose**: Central intelligence router.
- **Internal Workflow**: Receives query -> Detects intent -> Queries Data Store/Pinecone/Neo4j -> Prompts Gemini -> Validates citations -> Returns response.

**3. Graph Module (`/api/graph`)**
- **Purpose**: Translates frontend requests into Cypher queries for Neo4j.
- **Internal Workflow**: Receives FIR ID -> Queries Neo4j for surrounding nodes -> Formats as Vis.js JSON.

**4. Analytics Module (`/api/analytics`)**
- **Purpose**: Powers the dashboard.
- **Internal Workflow**: Queries Catalyst Data Store -> Groups by District/Crime Type -> Caches result in Catalyst Cache -> Returns payload.

**5. Prediction Module (`/api/predict`)**
- **Purpose**: Generates hotspot heatmaps.
- **Internal Workflow**: Runs clustering logic on historical coordinates.

## 5. Data Flow
See `DataFlow.md` for end-to-end sequences.

## 6. Edge Cases
- **Catalyst Limits**: The Advanced I/O function has execution time limits. Long-running tasks (like batch FIR uploads) should be offloaded to Catalyst Event Functions.

## 7. Future Enhancements
- Implement Catalyst Pipelines to fully automate the CI/CD deployment of these modules.
