# Feature: Criminal Network Visualization

## 1. Purpose
The **Criminal Network Visualization** tool transforms the hidden relationships stored in the Neo4j Graph Database into an interactive, visual web. It allows investigators to map out crime syndicates, trace illegal assets, and identify key operational nodes (e.g., the primary fence for stolen goods).

## 2. Target Users
- Investigating Officers (IOs)
- Intelligence Analysts (State Crime Records Bureau - SCRB)

## 3. User Journey
1. The officer opens the "Network Analysis" tab.
2. They enter a root entity (e.g., a suspect's name: "Ravi Kumar" or a vehicle number: "KA-01-AB-1234").
3. They select the desired degree of separation (1-hop, 2-hop, 3-hop).
4. The system renders an interactive node-and-link graph.
5. The officer clicks on a connecting edge (e.g., the line connecting "Ravi" to "Suresh"). A side panel opens explaining *why* they are connected, citing the specific FIR.

## 4. Technical Workflow

### 4.1. Data Fetching
- The frontend sends the request to the `crimegpt-graph-service` Catalyst Function.
- The Function translates the request into a Cypher query (e.g., `MATCH (p:Person {name: 'Ravi Kumar'})-[*1..2]-(connected) RETURN p, connected`).
- The Neo4j database returns the raw node/edge data.

### 4.2. Frontend Rendering (Vis.js / React Flow)
- The raw graph JSON is passed to the Next.js frontend.
- A visualization library like **Vis.js** is used because it handles physics-based layouts well (preventing nodes from clumping together).
- **Styling Rules:**
  - Suspects = Red Circles
  - Locations = Blue Squares
  - Vehicles = Yellow Triangles
  - FIRs = Gray Hexagons

### 4.3. Interactive Elements
- **Node Expansion:** Double-clicking a node (e.g., "Suresh") triggers a *new* API call to the Catalyst Function to fetch Suresh's connections, expanding the graph dynamically without requiring a full page reload.

## 5. Performance and Constraints
- **The "Hairball" Problem:** If an officer queries a highly connected node (e.g., a major train station location) with a 3-hop radius, the database might return 50,000 nodes. Rendering this will crash the browser.
- **Mitigation:** The Catalyst Function explicitly limits Cypher query results (e.g., `LIMIT 500 nodes`). If the limit is hit, the UI displays a warning: *"Network too dense. Displaying top 500 most relevant connections. Please refine your search."*

## 6. Audit Logging
Every time a user generates a network graph for a suspect, the **Catalyst Function** writes an entry to the `Audit_Logs` table, as this constitutes a deep intelligence search.
