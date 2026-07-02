# Disaster Recovery (DR)

## Overview
The **Disaster Recovery (DR)** document outlines the policies and technical procedures required to restore the **CrimeGPT** platform to a functional state following a catastrophic event (e.g., a region-wide cloud provider outage, a massive ransomware attack, or accidental data deletion). 

Because law enforcement data is critical, the DR plan must ensure minimal data loss and rapid restoration of services.

---

## 1. Recovery Objectives

- **Recovery Point Objective (RPO):** 1 Hour. In the event of a catastrophic database failure, the maximum acceptable amount of data lost is 1 hour's worth of transactions (e.g., newly added FIRs, audit logs).
- **Recovery Time Objective (RTO):** 4 Hours. The system must be fully operational in a secondary environment within 4 hours of a declared disaster.

## 2. Data Backup Strategy

The foundation of Disaster Recovery is robust, automated backups. All primary data resides within the **Zoho Catalyst** ecosystem.

### 2.1. Catalyst Data Store Backups
- **Mechanism:** Utilizing Catalyst's automated backup features (or writing a **Catalyst Cron** job if custom schedules are required) to take hourly snapshots of the relational database.
- **Retention:** Snapshots are retained for 30 days.
- **Offsite Replication:** For extreme DR scenarios, a nightly Catalyst Cron job must export a full database dump (CSV/JSON) and securely transfer it to an isolated, immutable storage bucket in a different geographic region (e.g., a secure government-managed cloud).

### 2.2. Catalyst File Store Backups
- **Mechanism:** Catalyst File Store relies on Zoho's internal redundancy, but for DR compliance, all uploaded FIR PDFs must be incrementally backed up to the secondary geographic storage bucket daily.

### 2.3. External Database Backups
- **Neo4j Graph DB & Vector DB:** These services must be configured to take automated hourly snapshots. The RTO for these is lower, as they can technically be completely rebuilt (re-ingested) from the raw PDFs in the Catalyst File Store, though that process would take hours.

## 3. Disaster Scenarios and Response Plans

### 3.1. Scenario A: Accidental Data Deletion / Ransomware
- **Event:** A malicious actor compromises an admin account and drops tables in the Catalyst Data Store.
- **Response:**
  1. Instantly revoke all active sessions via **Catalyst Authentication**.
  2. Restore the Catalyst Data Store from the most recent hourly snapshot.
  3. Analyze the immutable audit logs to identify the compromised account and entry vector.

### 3.2. Scenario B: Region-Wide Zoho Catalyst Outage (India Region Down)
- **Event:** The entire Zoho Catalyst India data center goes offline due to a natural disaster.
- **Response:**
  1. **Failover Execution:** The deployment pipeline (GitHub Actions) is triggered to deploy the entire Catalyst infrastructure (Functions, Schema, API Gateway) to a secondary Catalyst region (e.g., an alternate Asia-Pacific region, subject to temporary legal exemptions for data localization during a crisis).
  2. **Data Restoration:** The latest offsite database dump is imported into the new Catalyst Data Store.
  3. **DNS Update:** The primary domain (`crimegpt.ksp.gov.in`) is updated to point to the new Catalyst API Gateway.

## 4. DR Testing and Validation
A DR plan is useless if it is not tested.
- **Tabletop Exercises:** Conducted quarterly with the IT Operations team to review the runbooks.
- **Simulated Failover:** Conducted bi-annually during scheduled maintenance windows. The team will provision a fresh Catalyst environment from scratch and restore data from backups to validate the RTO (< 4 hours).

---
**Next Steps:** This concludes the System Design phase. Proceed to the Database Modeling phase, starting with the [Entity Relationship Diagram (ERD)](../03-Database/ERD.md).
