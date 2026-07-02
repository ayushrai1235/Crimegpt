# Logging and Monitoring Strategy

## Overview
The **Logging Strategy** defines how diagnostic information is recorded across the **CrimeGPT** platform. While `AuditLogs.md` covers legal tracking of user actions, this document focuses on engineering logs required for debugging, performance monitoring, and identifying system outages in the Zoho Catalyst environment.

---

## 1. Zoho Catalyst Native Logging

By default, Zoho Catalyst captures `stdout` and `stderr` output from Serverless Functions and makes them available in the **Catalyst APM (Application Performance Monitoring)** console.

### 1.1. Standardized Log Format (JSON)
To ensure logs are searchable and parseable by analytics tools, all logs must be structured as JSON objects, not raw strings.

```javascript
// BAD
console.error("Failed to connect to Neo4j database: " + error.message);

// GOOD
console.error(JSON.stringify({
  level: "ERROR",
  service: "graph-service",
  action: "NEO4J_CONNECTION",
  message: error.message,
  timestamp: new Date().toISOString()
}));
```

## 2. Log Levels

Developers must use the appropriate severity level.
- **DEBUG:** Verbose information used only during local development (e.g., printing the raw Cypher query before execution). Must be disabled in Production.
- **INFO:** Standard operational milestones (e.g., "RAG Pipeline completed in 450ms", "Batch migration of 100 FIRs finished").
- **WARN:** Unexpected situations that the system recovered from (e.g., "LLM timed out, switching to fallback provider").
- **ERROR:** A failure that impacts the user experience (e.g., "Failed to generate Network Graph"). Requires engineering attention.
- **FATAL:** A systemic failure causing an outage (e.g., "Catalyst Data Store unreachable"). Should trigger immediate pager alerts.

## 3. Distributed Tracing

In a microservice architecture, a single user request might hit the API Gateway, call the Chat Function, which then calls the RAG Function. 
- **Requirement:** Every incoming HTTP request at the API Gateway must be assigned a unique `x-request-id` header.
- **Propagation:** This ID must be passed along to every downstream function and included in every log statement. This allows developers to filter the APM console for a specific `request-id` and see the exact lifecycle of that single interaction across all services.

## 4. Frontend Monitoring (Client-Side)

If an error occurs in the user's browser (e.g., a React crash or a network timeout), the backend Catalyst logs will not capture it.

- **Implementation:** The Next.js frontend should integrate with an error tracking service (like Sentry) or send error telemetry back to a dedicated Catalyst endpoint.
- **Data Capture:** Capture the browser version, OS, current URL, and the stack trace, but ENSURE no PII (like suspect names typed into search bars) is transmitted in the error payload.

## 5. Alerting & APM

- **Threshold Alerts:** Administrators configure alerts in the Catalyst APM console.
- *Examples:*
  - If `ERROR` logs exceed 50 per minute -> Send Slack/Email alert to DevOps.
  - If Catalyst Function execution time exceeds 5000ms for > 5% of requests -> Send alert (indicating a potential database bottleneck or LLM latency issue).
