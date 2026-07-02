# Webhooks and Event Triggers

## Overview
The **Webhooks and Event Triggers** document explains how external systems or asynchronous Catalyst events communicate with the **CrimeGPT** platform. This is the foundation of the event-driven architecture that keeps the AI models and databases synchronized without blocking the user interface.

---

## 1. Internal Event Triggers (Catalyst Event Listeners)

These are not exposed over the public internet. They are native hooks within the Zoho Catalyst ecosystem.

### 1.1. `onFileUploaded` (File Store Event)
- **Trigger:** A user (or a migration script) uploads an FIR PDF to the `pending_ingestion` bucket in the Catalyst File Store.
- **Action:** A **Catalyst Event Function** automatically wakes up.
- **Payload:** Contains the File ID and Bucket Name.
- **Execution:** The function downloads the PDF, runs OCR, chunks the text, calls the Embedding API, inserts data into the Vector DB, executes NER for Graph DB ingestion, and moves the original file to the `processed` bucket.

### 1.2. `onDataInserted` (Data Store Event)
- **Trigger:** A new record is inserted into the `FIR_Metadata` table.
- **Action:** A **Catalyst Event Function** executes.
- **Execution:** Invalidates the relevant cached dashboard metrics (e.g., `dashboard_statewide_metrics_{date}`), forcing the next user request to recalculate the statistics to include the new FIR.

## 2. External Webhooks

These are secure, public-facing endpoints designed to receive payloads from legacy KSP systems (if they support pushing data).

### 2.1. `POST /api/v1/webhooks/legacy-sync`
- **Purpose:** Allows the legacy CCTNS system to push an alert to CrimeGPT when a new FIR is registered, rather than forcing CrimeGPT to constantly poll the legacy system.
- **Security:** This endpoint does NOT use JWTs. It relies on a high-entropy Webhook Secret (e.g., an HMAC-SHA256 signature) included in the request headers. The **Catalyst Function** verifies this signature before processing the payload.
- **Payload Example:**
```json
{
  "event": "fir_created",
  "data": {
    "fir_id": "999/2024",
    "station_id": "KOR_01",
    "pdf_download_url": "https://legacy-ksp-system.gov.in/files/999.pdf"
  }
}
```
- **Execution:** The Catalyst Function authenticates the webhook, fetches the PDF from the provided URL, and drops it into the Catalyst File Store, which then triggers the standard `onFileUploaded` pipeline described above.

## 3. Webhook Retry Policy
If the backend processing fails (e.g., the Vector DB is momentarily down during ingestion), the Catalyst Function must not swallow the error.
- It must return a `500 Internal Server Error` to the webhook caller.
- External systems (or Catalyst's internal retry mechanisms) are expected to employ an exponential backoff strategy (retrying after 1 min, 5 min, 15 min) to ensure data is eventually ingested.
