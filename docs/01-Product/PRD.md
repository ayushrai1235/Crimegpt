# Product Requirements Document (PRD)

## 1. Overview
CrimeGPT is an AI Investigation Copilot designed to assist the Karnataka State Police (KSP). It transitions legacy systems into an intelligent, proactive investigation platform that uncovers hidden patterns and accelerates case resolution.

## 2. Purpose
To drastically reduce investigation time, surface hidden criminal networks, and provide evidence-backed AI insights without hallucination. It provides officers with an immersive, centralized workspace to manage cases.

## 3. Functional Requirements
- **Investigation Workspace**: A unified view featuring an interactive timeline, crime map, and evidence panel.
- **Explainable AI Chat**: AI must cite specific FIRs and provide confidence scores for every claim.
- **Semantic Case Similarity**: Automatically suggest related cases based on MO and entity overlap.
- **Crime Pattern Discovery**: Highlight hotspots and predict emerging crime trends.
- **Knowledge Graph**: Visualize complex relationships (Accused -> Bank Account -> Victim).
- **Report Generation**: Generate structured PDFs summarizing the investigation.
- **Advanced Search**: Hybrid search combining keyword, vector, and graph matching.

## 4. Technical Design
- **Frontend**: Next.js (React), Tailwind CSS, running as a single page application.
- **Backend**: Zoho Catalyst (Modular Functions within a unified application).
- **Primary Database (SoR)**: Catalyst Data Store.
- **Graph Database**: Neo4j (strictly for mapping relationships).
- **Vector Database**: Pinecone (strictly for semantic search).

## 5. Data Flow
- User interacts with Next.js UI -> Request sent to Catalyst Backend -> AI Orchestrator routes request -> Catalyst Data Store/Neo4j/Pinecone queried -> Gemini generates insight -> Response sent to UI.

## 6. Edge Cases
- **Missing Evidence**: The system gracefully handles FIRs with incomplete metadata by highlighting confidence scores.
- **Ambiguous Queries**: The AI Orchestrator asks clarifying questions instead of guessing.

## 7. Future Enhancements
- Full Authentication, Role-Based Access Control (RBAC), and JWT Session Management.
- Integration with external telecom and banking APIs.
- Dedicated dashboards for differing roles (Constable vs. Commissioner).
