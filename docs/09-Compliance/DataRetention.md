# Data Retention and Expungement

## Overview
The **Data Retention** document outlines the lifecycle of data within the **CrimeGPT** platform. It defines how long data is kept and, critically, how it is permanently destroyed to comply with legal mandates (e.g., court-ordered expungements or data privacy regulations).

---

## 1. Retention Policies by Data Type

Different types of data have different legal requirements for storage.

| Data Type | Location | Retention Period | Justification |
| :--- | :--- | :--- | :--- |
| **FIR Metadata & PDFs** | Catalyst Data/File Store | Indefinite (until expunged) | Core legal records of the state. |
| **Audit Logs** | Catalyst Data Store | 7 Years | Compliance with standard government IT auditing policies. |
| **Chat Transcripts** | Catalyst Data Store | 3 Years | Required for internal investigations into officer conduct/AI usage. |
| **Cached Heatmaps/Stats** | Catalyst Cache | 24 Hours | Ephemeral data; recalculated daily. |
| **Session Context** | Catalyst Cache | 1 Hour | Ephemeral data; discarded when chat session ends. |

## 2. Automated Archiving (Catalyst Cron)

Storing decades of old chat transcripts in the primary Catalyst Data Store will eventually degrade database performance and increase costs.

- **Process:** A **Catalyst Cron** job runs monthly.
- **Action:** It selects all `Chat_Messages` and `Audit_Logs` older than 12 months.
- **Export:** It exports these records to compressed CSV/JSON files.
- **Cold Storage:** It moves these files to a secure, long-term, low-cost "Cold Storage" bucket in the **Catalyst File Store**.
- **Deletion:** It deletes the exported rows from the active Relational Data Store.

## 3. The Expungement Workflow (Right to be Forgotten)

If a court acquits a suspect and orders their record expunged, the data cannot just be marked as "inactive"—it must be mathematically eradicated from the entire CrimeGPT ecosystem.

### 3.1. The Challenge of AI Deletion
Deleting a row in SQL is easy. Deleting the *knowledge* of a suspect from a Vector Database or a Graph Database requires a coordinated effort.

### 3.2. The Deletion Pipeline (Catalyst Event Function)
1. **Trigger:** An authorized Admin clicks "Expunge FIR 102/2023" in the Admin Console.
2. **Catalyst Function Execution:** The `crimegpt-expungement-service` triggers.
3. **Step 1 (Relational):** Deletes the row from `FIR_Metadata` in the Catalyst Data Store.
4. **Step 2 (File Store):** Permanently deletes the raw PDF from the Catalyst File Store.
5. **Step 3 (Vector DB):** Issues a delete command to the Vector DB using the metadata filter: `{"fir_id": "102/2023"}` to destroy the embeddings.
6. **Step 4 (Graph DB):** Issues a Cypher query to Neo4j to delete the FIR node AND any relationship edges connected to it. (Note: The `Person` node may remain if they are associated with *other* valid FIRs, but the link to the expunged FIR is destroyed).
7. **Verification:** The function logs a successful expungement event in the `Audit_Logs` (referencing the internal ID, not the expunged PII).
