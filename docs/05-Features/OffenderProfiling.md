# Feature: Offender Profiling

## 1. Purpose
The **Offender Profiling** feature provides investigators with a comprehensive, AI-generated dossier on a specific suspect or repeat offender (known in Indian law enforcement as a "Rowdy Sheeter"). It consolidates their entire criminal history, known associates, operational territories, and typical Modus Operandi (M.O.) into a single, digestible view.

## 2. Target Users
- Investigating Officers (IOs)
- Intelligence Analysts

## 3. User Journey
1. An officer searches for a suspect name (e.g., "Kumar alias Auto Kumar").
2. The system loads the Profile Dashboard.
3. The dashboard displays:
   - **Vital Stats:** Name, aliases, physical descriptions (extracted from FIRs).
   - **Crime Timeline:** A chronological list of all FIRs they are associated with.
   - **M.O. Summary:** An AI-generated paragraph describing *how* they typically commit crimes.
   - **Operational Zone:** A mini-map highlighting the jurisdictions where they have been active.
   - **Network Snapshot:** A quick preview of their top 3 accomplices.

## 4. Technical Workflow

Building this profile requires aggregating data from multiple Catalyst and external databases simultaneously.

1. **Frontend Request:** The UI requests `/api/profile/kumar`.
2. **Catalyst Function (Profile Aggregator):** This function acts as a microservice orchestrator, spinning off parallel asynchronous requests:
   - *Request A (Data Store):* Fetch all `FIR_Metadata` where suspect = Kumar to build the timeline and operational zone.
   - *Request B (Neo4j):* Execute a Cypher query to fetch the immediate 1-hop network (accomplices) from the Graph DB.
   - *Request C (Vector DB/LLM):* Retrieve text chunks related to Kumar's crimes and use the LLM to generate the "M.O. Summary" paragraph via a specific Prompt template.
3. **Consolidation:** The Catalyst Function waits for all promises to resolve, packages the data into a single, unified JSON object, and returns it to the Next.js frontend for rendering.

## 5. The "Alias" Problem (Entity Resolution)
A major challenge in profiling is suspects using multiple aliases across different police stations.

- **Mitigation:** The Neo4j graph database is designed to handle this. If an analyst manually confirms that "Kumar" in Station A is the same person as "Auto Kumar" in Station B, they can merge the nodes in the UI. 
- The Catalyst API then updates Neo4j to link both aliases to a single master `Person` node. Future profile requests for either alias will return the consolidated history.

## 6. Audit Trail
Viewing a comprehensive dossier on a citizen is a highly sensitive action. Every time an officer loads a Profile Dashboard, the exact ID of the profile and the officer's ID are logged immutably in the **Catalyst Data Store** `Audit_Logs` table to prevent unauthorized surveillance.
