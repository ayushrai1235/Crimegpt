# Error Handling Strategy

## Overview
The **Error Handling Strategy** dictates how the **CrimeGPT** platform manages unexpected failures. A robust error handling strategy ensures that (1) the system doesn't crash, (2) the law enforcement user receives a clear, actionable message, and (3) the engineering team receives detailed debugging logs without exposing sensitive system internals to the client.

---

## 1. Backend Error Handling (Catalyst Functions)

**Catalyst Functions** must act as the primary shield, catching all errors originating from databases or external APIs.

### 1.1. The Standard Error Wrapper
All route handlers must be wrapped in a `try/catch` block or use a centralized error-handling middleware.

```javascript
// Good Example
app.get('/api/network', async (req, res, next) => {
  try {
    const data = await graphService.getNetwork(req.query.suspect);
    res.status(200).json(data);
  } catch (error) {
    next(error); // Passes to centralized error handler
  }
});
```

### 1.2. HTTP Status Code Standardization
Functions must return appropriate semantic HTTP codes:
- **400 Bad Request:** User submitted invalid data (e.g., malformed FIR number).
- **401 Unauthorized:** Missing or invalid Catalyst Auth JWT.
- **403 Forbidden:** User is authenticated, but RBAC prevents access (e.g., trying to view a case outside their jurisdiction).
- **404 Not Found:** The requested resource (e.g., FIR PDF) does not exist.
- **429 Too Many Requests:** The LLM API is rate-limiting the system.
- **500 Internal Server Error:** An unhandled exception (e.g., database connection dropped).

### 1.3. Sanitized API Responses
Never leak stack traces or raw database error messages to the frontend.
```json
// BAD Response
{ "error": "Neo.ClientError.Security.Unauthorized: The client is unauthorized due to authentication failure." }

// GOOD Response
{ "error": "Database connection failed. Please contact IT support.", "errorCode": "DB_AUTH_01" }
```

## 2. Frontend Error Handling (Next.js)

The UI must gracefully handle failures so the officer is not left looking at a blank white screen.

### 2.1. Global Error Boundaries
Next.js 14 App Router utilizes `error.tsx` files. If a component crashes during rendering (e.g., due to malformed JSON from the backend), the Error Boundary catches it and displays a standardized "Something went wrong" UI component with a "Try Again" button.

### 2.2. API Request Handling
When using `fetch` or React Query, network errors must be caught and displayed via UI Toast notifications.
- *Example:* If an officer tries to generate a heatmap and the backend returns a 500, a red Toast notification slides in: *"Failed to generate heatmap. The analytics service is currently unavailable."*

### 2.3. Form Validation (Zod)
To prevent 400 errors from the backend, the frontend must aggressively validate all user inputs using a schema validation library like **Zod** before the request is even sent.

## 3. The "Silent Failure" Anti-Pattern
Never use empty `catch` blocks.
```javascript
// STRICTLY PROHIBITED
try {
  await logAuditData();
} catch (e) {
  // do nothing
}
```
If an action fails, it must at least be logged (see `Logging.md`), even if you choose not to disrupt the user experience.
