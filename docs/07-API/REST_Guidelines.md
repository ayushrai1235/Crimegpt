# REST API Guidelines

## Overview
The **REST API Guidelines** define the structural and behavioral standards for all endpoints exposed by the **Catalyst Functions**. Following these guidelines ensures predictability, making it easier for frontend developers to integrate the APIs.

---

## 1. Base URL Structure
All APIs are routed through the Catalyst API Gateway.
`https://<PROJECT_DOMAIN>.catalystserverless.in/server/<FUNCTION_NAME>/api/v1/<RESOURCE>`

*Example:* `https://crimegpt.catalystserverless.in/server/crimegpt-core/api/v1/cases`

## 2. Resource Naming (Nouns, Not Verbs)
API endpoints should represent resources (nouns), not actions (verbs). The HTTP method defines the action.

- **Good:** `GET /cases/102` (Get case 102)
- **Bad:** `GET /getCase?id=102`

## 3. Standard HTTP Methods
- `GET`: Retrieve a resource or a list of resources. Must be idempotent (calling it 10 times has the same result as calling it once).
- `POST`: Create a new resource or execute a complex action (like a search query that requires a large JSON body).
- `PATCH`: Partially update an existing resource (e.g., updating just the status of a case).
- `DELETE`: Remove a resource.

## 4. Standard Response Format
Every API response (success or failure) must follow a consistent JSON envelope.

### 4.1. Success Response (2xx)
```json
{
  "status": "success",
  "data": {
    "fir_id": "102/2023",
    "suspect": "Ravi Kumar"
  },
  "meta": {
    // Optional: Used for pagination or rate-limit info
    "page": 1,
    "total_records": 45
  }
}
```

### 4.2. Error Response (4xx, 5xx)
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided station_id does not exist.",
    "details": [
      { "field": "station_id", "issue": "Must be 6 characters" }
    ]
  }
}
```

## 5. Pagination, Filtering, and Sorting
For endpoints returning collections (e.g., a list of FIRs), query parameters must be used.
- **Pagination:** `?page=2&limit=50`
- **Filtering:** `?status=OPEN&district=Bengaluru`
- **Sorting:** `?sort=-reported_at` (The `-` prefix indicates descending order).

## 6. Versioning
All APIs must be versioned in the URL path (`/api/v1/`). If a breaking change is required in the future (e.g., a complete overhaul of the JSON structure), a new `/api/v2/` endpoint must be created, allowing older frontend clients to continue functioning until they are migrated.
