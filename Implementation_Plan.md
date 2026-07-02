# Implementation Plan: CrimeGPT Development

This plan outlines the complete engineering roadmap for developing **CrimeGPT**, mapped directly to the 10 requirements of the KSP Hackathon challenge. We will build a Next.js 14 frontend and a Zoho Catalyst backend, integrating Gemini 3.5 Flash, Pinecone, and Neo4j, using the exact KSP `CaseMaster` ER Diagram schema.

## Execution Phases

### Phase 1: Project Initialization & Catalyst Setup (Req 10 - RBAC & Governance)
- Initialize the Next.js 14 frontend (`frontend/`) with Tailwind CSS, TypeScript, and `shadcn/ui`.
- Initialize the Zoho Catalyst backend (`catalyst-backend/`) via the Catalyst CLI.
- Setup **Catalyst Authentication** and JWT-based Role-Based Access Control (RBAC).
- Implement the exact KSP Relational Database Schema (e.g., `CaseMaster`, `ComplainantDetails`, `Accused`) in the Catalyst Data Store.

### Phase 2: Conversational AI & Multilingual Support (Req 1 & 9 - Chat, Voice, XAI)
- **`crimegpt-chat-service`:** Node.js Catalyst Function integrating Gemini 3.5 Flash for RAG.
- **Explainable AI (Req 9):** Enforce strict citations to FIR PDFs for every response.
- **Multilingual & Voice (Req 1):** Integrate Web Speech API for voice input and translation models for English/Kannada support.
- **Export (Req 1):** Implement a "Save as PDF" button for chat transcripts using `jspdf`.

### Phase 3: Graph Integration & Financial Tracing (Req 2 & 7 - Network & Finances)
- **`fir-ingestion-pipeline`:** Extract entities and financial transactions from evidence -> push to Neo4j.
- **`crimegpt-graph-service`:** Cypher queries to detect organized crime rings and money trails.
- **Frontend Visualization:** Integrate Vis.js to render interactive relationship graphs between accused, victims, and bank accounts.

### Phase 4: AI Insights & Profiling (Req 4 & 5 - Sociological & Offender Profiling)
- **Sociological Engine:** Prompt Gemini to analyze demographic data (age, gender, caste, religion from the KSP schema) against crime incidents to find socio-economic correlations.
- **Offender Profiling:** Create a dashboard view that consolidates an accused person's history, calculates a "Risk Score," and analyzes their Modus Operandi.

### Phase 5: Analytics, Forecasting & DSS (Req 3, 6, & 8)
- **Analytics Dashboard (Req 3):** Recharts implementation to visualize crime trends across time and geography (using Catalyst Cache for speed).
- **Early Warning & Heatmaps (Req 8):** Geospatial clustering to identify hotspots and forecast emerging patterns.
- **Decision Support System (Req 6):** AI-generated case summaries and recommendations for investigative leads.

### Phase 6: Polish, Testing, & Deployment
- E2E testing of the RAG pipeline.
- Final UI polish and responsive design fixes.
- Deploy backend via `catalyst deploy` and frontend via Vercel/Catalyst Hosting.
