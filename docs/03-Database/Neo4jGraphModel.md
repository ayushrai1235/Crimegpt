# Neo4j Graph Model

## Overview
The **Neo4j Graph Model** defines the schema used to represent the complex, interconnected web of criminal activities. While the **Catalyst Data Store** handles structured, transactional metadata, the external **Neo4j Graph Database** is exclusively responsible for **Criminal Network Analysis** (identifying links between people, places, and events).

This database is queried securely via **Catalyst Functions**.

---

## 1. The Power of the Graph
In a relational database, finding "all the people who have been arrested in the same jurisdiction as a suspect who drives a specific vehicle" requires multiple complex `JOIN` operations that are incredibly slow. In a graph database, this is a native, rapid traversal.

## 2. Node Labels (Entities)

Nodes represent the core entities extracted from FIRs by the NLP ingestion pipeline.

| Node Label | Properties | Description |
| :--- | :--- | :--- |
| **Person** | `id` (UUID), `name` (String), `aliases` (Array), `dob` (Date), `gender` (String) | Represents suspects, victims, or witnesses. |
| **Location** | `id` (UUID), `address` (String), `pincode` (String), `latitude` (Float), `longitude` (Float) | Represents crime scenes, suspect residences, or recovery locations. |
| **Vehicle** | `registration_number` (String, PK), `make` (String), `model` (String), `color` (String) | Any vehicle mentioned in the FIR. |
| **Phone** | `phone_number` (String, PK), `provider` (String) | Phone numbers extracted from evidence. |
| **FIR** | `fir_id` (String, PK), `date` (Date), `section` (String) | Represents the specific crime event. Acts as the central anchor for relationships. |

## 3. Relationship Types (Edges)

Edges define how the nodes interact with one another. Every relationship should ideally possess a property indicating *which* FIR established this link.

| Relationship Type | Source Node | Target Node | Properties |
| :--- | :--- | :--- | :--- |
| `ACCUSED_IN` | Person | FIR | `role` ("Primary", "Accomplice") |
| `VICTIM_IN` | Person | FIR | |
| `OCCURRED_AT` | FIR | Location | `timestamp` |
| `RESIDES_AT` | Person | Location | `source_fir` |
| `OWNS_VEHICLE` | Person | Vehicle | `source_fir` |
| `USED_IN_CRIME` | Vehicle | FIR | |
| `OWNS_PHONE` | Person | Phone | `source_fir` |
| `COMMUNICATED_WITH` | Phone | Phone | `timestamp`, `duration` (If CDR data is available) |
| `ASSOCIATE_OF` | Person | Person | `confidence_score` (Float). *Note: Often derived indirectly if two people are accused in the same FIR.* |

## 4. Example Cypher Queries (Executed via Catalyst Functions)

The **Catalyst Network Analysis Service** will execute predefined Cypher queries based on user intent.

### 4.1. Finding a Suspect's 1st Degree Network
*Use Case: An officer clicks on a suspect's profile to see their immediate connections.*
```cypher
MATCH (p:Person {name: "Ravi Kumar"})-[r]-(connected_node)
RETURN p, r, connected_node
```

### 4.2. Identifying Common Accomplices (2nd Degree Network)
*Use Case: Discovering who "Ravi" and "Suresh" have both worked with in the past.*
```cypher
MATCH (p1:Person {name: "Ravi Kumar"})-[:ACCUSED_IN]->(f:FIR)<-[:ACCUSED_IN]-(accomplice:Person)
MATCH (p2:Person {name: "Suresh"})-[:ACCUSED_IN]->(f2:FIR)<-[:ACCUSED_IN]-(accomplice)
RETURN DISTINCT accomplice.name
```

### 4.3. Linking a Vehicle to Multiple Crimes
*Use Case: Tracing a getaway car.*
```cypher
MATCH (v:Vehicle {registration_number: "KA-01-AB-1234"})-[:USED_IN_CRIME]->(f:FIR)-[:OCCURRED_AT]->(l:Location)
RETURN f.fir_id, f.date, l.address
```

## 5. Ingestion & Synchronization Strategy

The Neo4j database must remain synchronized with the Catalyst Data Store. 
- **Trigger:** When a new FIR PDF is uploaded to the **Catalyst File Store**.
- **Process:** An asynchronous **Catalyst Event Function** extracts the text, uses NLP (e.g., Spacy or an LLM) to identify Named Entities (Persons, Locations, Vehicles), and executes a batch `MERGE` operation in Neo4j to update the graph without creating duplicate nodes.

---
**Next Steps:** Review the [Vector Database](./VectorDatabase.md) document to understand how semantic text data is modeled for AI retrieval.
