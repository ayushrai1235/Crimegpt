# Feature: Role Management (RBAC)

## 1. Purpose
The **Role Management** document details the Role-Based Access Control (RBAC) matrix that governs the entire CrimeGPT platform. In law enforcement, information compartmentalization is a strict legal requirement. Not every officer is allowed to see every case.

## 2. The RBAC Matrix

The system defines four primary roles, mapped to the user profiles stored in the **Catalyst Data Store** and managed via **Catalyst Authentication**.

| Role | Scope of Access | Allowed Actions |
| :--- | :--- | :--- |
| **Investigator (IO)** | Local Jurisdiction only. | View assigned FIRs, Chat with CrimeGPT (context limited to their station), Upload evidence to active cases. |
| **Station House Officer (SHO)** | Station-wide. | View all FIRs in their station, Assign IOs, View local Heatmaps, View local Analytics. |
| **Commissioner / DSP** | Zone / State-wide. | View all FIRs, View macro Analytics and Forecasting, View cross-jurisdictional Network Graphs. |
| **System Admin (IT)** | System architecture only. | Manage users, view system logs. *Cannot view the text content of FIRs or chat transcripts.* |

## 3. Enforcement Mechanisms (Zero-Trust Architecture)

The frontend UI will hide buttons the user shouldn't see, but UI hiding is not security. Enforcement happens entirely on the backend within **Zoho Catalyst**.

### 3.1. API Gateway Middleware
Every request from the Next.js frontend contains a JWT in the `Authorization` header. A **Catalyst Function** acts as middleware:
1. Validates the JWT signature.
2. Extracts the `user_id`, `role`, and `station_id`.
3. Passes these claims to the downstream service.

### 3.2. Data-Level Enforcement
If an IO from Koramangala Station (ID: KOR_01) queries CrimeGPT: "Show me all murders."
- The **Catalyst AI Orchestrator Function** intercepts the query.
- Before querying the Vector DB, it injects a hard filter: `{"station_id": "KOR_01"}`.
- The Vector DB only searches Koramangala cases. It is mathematically impossible for the IO to retrieve data from a different station, regardless of how they phrase the prompt.

## 4. Temporary Escalation ("Joint Task Force")
Sometimes an IO needs to investigate a suspect operating in a neighboring district.
- **Workflow:** The IO requests temporary cross-jurisdictional access via the UI.
- The request goes to the DSP (Supervisory Role).
- If approved, a **Catalyst Function** updates a `TaskForce_Grants` table in the Data Store.
- When the IO queries CrimeGPT, the backend checks this table and dynamically expands the Vector DB metadata filter to include the neighboring station's ID for a limited time (e.g., 7 days).
