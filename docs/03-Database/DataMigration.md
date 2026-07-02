# Data Migration Strategy

## Overview
The **Data Migration Strategy** details the process of moving historical crime data from legacy KSP systems (e.g., CCTNS dumps, physical hard drives, scattered PDFs) into the modern, **Zoho Catalyst-first** architecture of **CrimeGPT**. 

Data migration is a high-risk phase. If dirty data is ingested, the AI models will hallucinate, and the network graphs will be inaccurate ("Garbage In, Garbage Out").

---

## 1. Scope of Migration

**Source Data:**
- Structured CSV/SQL dumps of FIR metadata from legacy systems.
- Millions of unstructured, scanned FIR PDFs (historical records).

**Target Destinations:**
- **Catalyst Data Store:** Structured metadata (Dates, Stations, Sections).
- **Catalyst File Store:** Raw PDF files.
- **Neo4j Graph DB:** Extracted entities and relationships.
- **Vector DB:** Text embeddings for semantic search.

## 2. The Migration Pipeline

Because of the massive volume of data, migration cannot be done synchronously via standard API endpoints. It requires a dedicated, asynchronous batch-processing pipeline using **Catalyst Functions** and **Catalyst Cron**.

### Phase 1: File Ingestion (The "Lift and Shift")
1. Admins use a secure CLI tool (or Catalyst File Store APIs) to bulk upload historical FIR PDFs directly into the **Catalyst File Store**.
2. Files are placed in a `migration-pending/` logical directory.

### Phase 2: Metadata Extraction (Structured Data)
1. A **Catalyst Cron** job triggers a batch script nightly.
2. The script parses the accompanying structured CSV files (provided by KSP IT).
3. The script inserts this metadata into the `FIR_Metadata` table in the **Catalyst Data Store**, mapping the `pdf_file_id` to the uploaded PDFs.

### Phase 3: The AI Processing Pipeline (Unstructured Data)
This is the most compute-intensive phase.
1. An event-driven **Catalyst Function** is triggered (or run in batches via Cron) to process files in `migration-pending/`.
2. **OCR & Cleansing:** The PDF is run through an OCR engine. Regular Expressions remove standard boilerplate text (e.g., "In the court of...") to save LLM tokens.
3. **Vectorization:** The cleansed text is chunked, sent to the Embedding API, and inserted into the Vector DB.
4. **Graph Extraction:** An LLM extracts Named Entities (Suspect: "Ravi", Location: "Majestic Bus Stand"). The Catalyst Function executes a `MERGE` query against the Neo4j database to build the historical network.
5. **Completion:** The PDF is moved to the `processed/` directory in the Catalyst File Store.

## 3. Data Cleansing and Deduplication

- **Entity Resolution:** The biggest challenge in Graph DB migration is knowing that "Ravi Kumar" in FIR 1 and "R. Kumar" in FIR 2 might be the same person.
- **Strategy:** The migration scripts must employ fuzzy matching and contextual clues (e.g., matching phone numbers or addresses) before creating relationships in Neo4j. If confidence is low, a human-in-the-loop flag is set in the Data Store for an Analyst to merge the profiles manually.

## 4. Rollback and Auditing

- **Idempotency:** All migration scripts must be idempotent. If a script fails halfway through, running it again must not create duplicate records in the Catalyst Data Store or Neo4j.
- **Migration Logs:** A dedicated `migration_logs` table in the Catalyst Data Store will track the status (Success/Fail/Error Reason) for every single FIR processed, allowing IT to easily retry failed records.

---
**Next Steps:** Review the [Backup Strategy](./BackupStrategy.md) to ensure this newly migrated data is safely preserved.
