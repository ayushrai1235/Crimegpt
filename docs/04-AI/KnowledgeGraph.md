# Knowledge Graph Integration

## Overview
The **Knowledge Graph** document explains how the **CrimeGPT** platform models and queries the complex relationships between criminal entities. While the **Catalyst Data Store** handles structured metadata, the **Neo4j Graph Database** is the engine that allows investigators to say, "Show me how these five suspects are connected."

---

## 1. The Value of the Graph in Law Enforcement

Organized crime relies on networks. A traditional SQL database requires knowing exactly what you are looking for. A graph database allows you to discover connections you didn't know existed.

- **Relational DB Question:** "List all FIRs associated with Suspect A."
- **Graph DB Question:** "Find the shortest path of association between Suspect A and Suspect Z, based on shared accomplices, vehicles, or addresses."

## 2. Graph Construction Pipeline

The graph is not built manually; it is constructed automatically during the data ingestion phase.

1. **Trigger:** A new FIR PDF is uploaded to the **Catalyst File Store**.
2. **NLP Extraction:** A **Catalyst Function** runs Named Entity Recognition (NER) to extract:
   - Persons (Suspects, Victims)
   - Locations (Addresses, Landmarks)
   - Objects (Vehicles, Weapons)
   - Communications (Phone Numbers)
3. **Graph Merging:** The Catalyst Function executes a Cypher `MERGE` query against Neo4j.
   - If "Ravi Kumar" already exists in the graph, it links the new FIR to the existing node.
   - If not, it creates a new node.

## 3. AI Graph Agent (Text-to-Cypher)

To allow officers to query the graph using natural language, we implement a specialized **Graph Agent** within the Catalyst AI orchestrator.

### 3.1. How it works
1. **User Query:** "Who are the common associates between Ravi and Suresh?"
2. **Intent Routing:** The system routes this to the Graph Agent.
3. **Text-to-Cypher:** An LLM is prompted with the Graph Schema (Node labels and Edge types) and the user's query. The LLM translates the English query into a database query (Cypher).
   *Generated Cypher:* `MATCH (p1:Person {name:"Ravi"})-[:ACCUSED_IN]->(f:FIR)<-[:ACCUSED_IN]-(p2:Person), (p3:Person {name:"Suresh"})-[:ACCUSED_IN]->(f2:FIR)<-[:ACCUSED_IN]-(p2) RETURN DISTINCT p2.name`
4. **Execution:** The Catalyst Function executes this Cypher query against Neo4j securely.
5. **Natural Language Translation:** The raw JSON result from Neo4j is passed back to the LLM to translate into a human-readable sentence.
   *Final Output:* "Ravi and Suresh do not have any shared FIRs directly, but they both share a common accomplice named 'Mahesh', who was arrested with Ravi in 2021 and Suresh in 2023."

## 4. Visualizing the Graph (Frontend)

When an officer asks to "Visualize the network for Suspect X":
1. The Catalyst Function executes a graph query to fetch a 2-hop or 3-hop network around Suspect X.
2. It returns a standardized JSON structure (Nodes and Edges) to the Next.js frontend.
3. The frontend uses a library like **Vis.js** or **React Flow** to render an interactive web, allowing the officer to drag, zoom, and click on connecting lines to view the underlying FIR evidence.

## 5. Security & RBAC in the Graph

- The Neo4j database does not inherently know about Zoho Catalyst user roles.
- **Enforcement:** The **Catalyst Function** acting as the Graph Agent MUST inject jurisdiction filters into the Cypher query. 
- *Example:* If an Inspector from Station A asks for a network graph, the Catalyst Function modifies the generated Cypher query to append `WHERE f.station_id = 'Station_A'` to ensure they only see connections relevant to their clearance level (unless overridden by an active investigation flag).

---
**Next Steps:** Review the [RAG Architecture](./RAGArchitecture.md) to understand how the system retrieves textual evidence.
