# API Endpoints: Case Management

## Overview
This document details the REST API endpoints provided by the `crimegpt-core-service` **Catalyst Function** to handle structured FIR metadata and basic case management operations.

---

## 1. Retrieve Cases

### `GET /api/v1/cases`
Retrieves a paginated list of FIRs.

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page` (integer, default: 1)
  - `limit` (integer, default: 20)
  - `station_id` (string, optional)
  - `status` (string, optional)
- **Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "fir_id": "102/2023",
      "station_id": "KOR_01",
      "primary_act": "IPC",
      "status": "OPEN",
      "reported_at": "2023-10-25T14:30:00Z"
    }
  ],
  "meta": { "total": 150, "page": 1 }
}
```

## 2. Retrieve Specific Case Details

### `GET /api/v1/cases/:fir_id`
Retrieves the full metadata and attached file references for a specific FIR.

- **Headers:** `Authorization: Bearer <token>`
- **Path Parameters:**
  - `fir_id` (string, required) - e.g., "102-2023-KOR01"
- **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "fir_id": "102/2023",
    "incident_details": "...",
    "pdf_url": "https://catalyst.zoho.../download/xyz",
    "assigned_to": "EMP_492"
  }
}
```

## 3. Update Case Status

### `PATCH /api/v1/cases/:fir_id`
Allows an SHO to update the status or reassign a case.

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "status": "CLOSED",
  "assigned_to": "EMP_881"
}
```
- **Response (200 OK):**
```json
{
  "status": "success",
  "message": "Case updated successfully"
}
```
- **Error (403 Forbidden):** Returned if the authenticated user is an IO trying to reassign a case they do not own.

## 4. Trigger Manual Ingestion (Admin Only)

### `POST /api/v1/cases/ingest`
Forces the ingestion pipeline to process a specific PDF that was manually uploaded to the File Store.

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "file_id": "catalyst_file_id_999",
  "station_id": "KOR_01"
}
```
- **Response (202 Accepted):** (Returns 202 because the processing is asynchronous).
```json
{
  "status": "success",
  "message": "Ingestion queued. Processing will take approximately 30 seconds."
}
```
