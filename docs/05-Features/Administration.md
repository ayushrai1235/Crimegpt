# Feature: Administration Console

## 1. Purpose
The **Administration Console** provides IT personnel and high-level commanders with the tools needed to manage the CrimeGPT platform. It is the control center for user onboarding, system health monitoring, and data governance.

## 2. Target Users
- KSP IT Administrators
- System Auditors

## 3. Core Modules

### 3.1. User Provisioning
- Interface to add, suspend, or remove users.
- Integration with **Catalyst Authentication** APIs. An admin can send a password reset link or forcefully revoke active sessions if a device is compromised.

### 3.2. Data Governance & Ingestion Dashboard
- A dashboard to monitor the status of the Data Migration and daily FIR ingestion pipelines.
- **Error Logs:** Shows if any FIR PDFs failed the OCR or Vectorization process, allowing admins to trigger manual retries.
- **Data Deletion:** Provides a secure interface for executing "Right to be Forgotten" or court-ordered expungements. Deleting a record here triggers **Catalyst Functions** to purge the record from the Data Store, File Store, Neo4j, and the Vector DB simultaneously.

### 3.3. System Health & LLM Usage
- Tracks the operational status of Zoho Catalyst, Neo4j, and the LLM provider.
- **Cost Monitoring:** Displays the number of LLM tokens consumed per day/month. This is critical for preventing budget overruns. If usage spikes unexpectedly, admins can investigate if a specific station is over-utilizing the AI.

## 4. Technical Workflow

- The Admin Console is simply a protected route group in the Next.js frontend (e.g., `/app/admin/*`).
- **Security:** Access to these pages is strictly gated. The Catalyst API Gateway middleware checks the user's JWT. If `role !== 'SuperAdmin'`, the request is immediately rejected with a 403 Forbidden error, and an alert is logged in the `Audit_Logs`.

## 5. UI Design
The Admin UI favors density and utility over the sleek aesthetics of the main investigator dashboard. It utilizes complex data tables with advanced filtering, sorting, and bulk-action capabilities (e.g., "Select 50 failed ingestions -> Click Retry Batch").
