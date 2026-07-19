# Knowledge Graph Intelligence

## 1. Overview
CrimeGPT utilizes Neo4j AuraDB strictly as a graph engine to uncover hidden relationships between disparate cases. It does *not* act as the primary database (which is handled by Catalyst Data Store), but rather as an intelligence layer to connect entities like suspects, bank accounts, and phone numbers.

## 2. Purpose
To visually and algorithmically identify organized crime syndicates, repeat offenders, and money trails that would be impossible to spot in a traditional relational database.

## 3. Functional Requirements
- **Entity Extraction**: Automatically parse FIRs to generate Graph Nodes (Person, Account, Phone, Vehicle) and Edges (OWNS, USED_IN, ACCUSED_IN).
- **Interactive Visualization**: Display a force-directed graph in the Investigation Workspace.
- **AI Orchestrator Integration**: Allow the AI to query the graph in natural language to answer complex network questions.

## 4. Technical Design

### Node Schema
- `FIR`: The central incident node.
- `Person`: Tagged with roles (Accused, Victim, Complainant).
- `Phone`: Phone numbers extracted via regex.
- `BankAccount`: Extracted financial identifiers.
- `Vehicle`: Extracted license plates.
- `Location`: Extracted crime scenes.

### Edge Schema
- `(Person)-[:ACCUSED_IN]->(FIR)`
- `(Person)-[:USES_PHONE]->(Phone)`
- `(FIR)-[:INVOLVES_ACCOUNT]->(BankAccount)`
- `(Person)-[:KNOWS]->(Person)` *(Inferred from co-accused status)*

## 5. Example Cypher Queries for the AI Orchestrator

**1. Find Repeat Offenders (Multi-Case Accused)**
```cypher
MATCH (p:Person)-[:ACCUSED_IN]->(f:FIR)
WITH p, count(f) as case_count, collect(f.id) as cases
WHERE case_count > 1
RETURN p.name, case_count, cases
ORDER BY case_count DESC
```

**2. Discover Shared Bank Accounts (Money Laundering Ring)**
```cypher
MATCH (f1:FIR)-[:INVOLVES_ACCOUNT]->(a:BankAccount)<-[:INVOLVES_ACCOUNT]-(f2:FIR)
WHERE f1.id <> f2.id
RETURN a.account_number, collect(f1.id) as linked_cases
```

**3. Identify Criminal Organizations (Co-Accused Networks)**
```cypher
MATCH (p1:Person)-[:ACCUSED_IN]->(f:FIR)<-[:ACCUSED_IN]-(p2:Person)
WHERE p1.name <> p2.name
RETURN p1.name, p2.name, count(f) as shared_crimes
ORDER BY shared_crimes DESC
```

## 6. Edge Cases
- **Entity Resolution**: "John Doe" in FIR 1 might be different from "John Doe" in FIR 2. The graph merge logic requires a secondary identifier (like Phone Number or Aadhar) before collapsing two Person nodes into one.

## 7. Future Enhancements
- Implement Graph Neural Networks (GNNs) for automated link prediction to guess missing relationships before they are explicitly found in an FIR.
