# Relational Schema (System of Record)

## 1. Overview
The Catalyst Data Store serves as the absolute System of Record (SoR) for the CrimeGPT platform. All core structured data—FIR metadata, officers, evidence logs—is persisted here.

## 2. Purpose
To ensure data integrity, reliable backups, and standard relational querying capabilities (e.g., retrieving all FIRs assigned to a specific officer).

## 3. Functional Requirements
- **Master Data**: Must store all cases, FIRs, victims, and accused profiles.
- **Audit Logging**: Must log every AI conversation and report generation.

## 4. Technical Design

### Core Tables
1. **CaseMaster**
   - `id` (PK, String)
   - `fir_number` (String, Unique)
   - `district` (String)
   - `police_station` (String)
   - `date_reported` (DateTime)
   - `status` (Enum: OPEN, CLOSED, CHARGESHEETED)

2. **Person (Accused / Victim)**
   - `id` (PK, String)
   - `case_id` (FK -> CaseMaster)
   - `name` (String)
   - `role` (Enum: ACCUSED, VICTIM, COMPLAINANT)
   - `age` (Integer)

3. **EvidenceMetadata**
   - `id` (PK, String)
   - `case_id` (FK -> CaseMaster)
   - `file_url` (String - link to Catalyst File Store)
   - `extracted_text` (Text)

4. **AI_Conversations**
   - `id` (PK, String)
   - `case_id` (FK -> CaseMaster, Optional)
   - `prompt` (Text)
   - `response` (Text)
   - `confidence_score` (Float)

## 5. Data Flow
See `DataFlow.md`. Data is originally ingested via PDF upload, parsed by Gemini, and then structured records are inserted into these tables via Catalyst Functions.

## 6. Edge Cases
- **Duplicate FIRs**: The database enforces a unique constraint on `fir_number` per `district` and `year`.

## 7. Future Enhancements
- Add `AuthUser` and `Role` tables when Authentication is implemented post-MVP.
