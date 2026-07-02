# Relational Schema Definition

## Overview
The **Relational Schema** document provides the explicit column definitions, data types, and constraints required to provision the relational database within the **Zoho Catalyst Data Store** for the **CrimeGPT** platform.

## 1. Table Definitions

### 1.1. `Users` Table
Stores all law enforcement personnel authorized to access the system.
*Note: Authentication credentials (passwords) are handled natively by Catalyst Authentication; this table only stores application metadata.*

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | VarChar(100) | Primary Key, Not Null | Matches Catalyst Authentication User ID. |
| `email` | VarChar(255) | Unique, Not Null | Official KSP email address. |
| `full_name` | VarChar(255) | Not Null | Officer's full name. |
| `rank` | VarChar(50) | Not Null | E.g., "Sub-Inspector", "DSP". |
| `role` | VarChar(50) | Not Null | Enforced RBAC role: "Admin", "Investigator", "SHO", "Commissioner". |
| `station_id` | VarChar(50) | Foreign Key | Links to `Police_Stations` table. Null for state-level roles. |
| `is_active` | Boolean | Default: True | If false, API middleware denies access. |
| `last_login` | DateTime | | Automatically updated by Auth Catalyst Function. |

### 1.2. `Police_Stations` Table
Master list of jurisdictions.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `station_id` | VarChar(50) | Primary Key, Not Null | Standardized KSP Station Code. |
| `station_name` | VarChar(255) | Not Null | E.g., "Koramangala Police Station". |
| `district` | VarChar(100) | Not Null | E.g., "Bengaluru City". |
| `zone` | VarChar(100) | Not Null | E.g., "South-East Zone". |

### 1.3. `FIR_Metadata` Table
Stores structured, searchable data extracted from the raw FIRs.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `fir_id` | VarChar(100) | Primary Key, Not Null | Standard format: "FIR_NUM/YEAR/STATION_CODE". |
| `station_id` | VarChar(50) | Foreign Key, Not Null | Jurisdiction where the FIR was filed. |
| `reported_at` | DateTime | Not Null | Timestamp of FIR registration. |
| `incident_time` | DateTime | | Approximate time the crime occurred. |
| `primary_act` | VarChar(255) | Not Null | E.g., "IPC", "NDPS Act". |
| `primary_section` | VarChar(255) | Not Null | Specific penal code section. |
| `status` | VarChar(50) | Default: "Open" | "Open", "Closed", "Under Investigation". |
| `pdf_file_id` | VarChar(255) | Not Null | Unique ID pointing to the raw PDF in **Catalyst File Store**. |

### 1.4. `Audit_Logs` Table
Immutable log of all sensitive actions. Essential for legal compliance.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `log_id` | BigInt | Primary Key, Auto-Increment | Unique sequential ID. |
| `user_id` | VarChar(100) | Foreign Key, Not Null | The officer who performed the action. |
| `action_type` | VarChar(50) | Not Null | E.g., "VIEW_FIR", "ASK_AI", "DOWNLOAD_REPORT". |
| `resource_id` | VarChar(255) | Not Null | The specific FIR ID or Chat Session ID accessed. |
| `timestamp` | DateTime | Default: Current_Time | Exact time of action. |
| `ip_address` | VarChar(45) | Not Null | IP address from the request header. |

### 1.5. `Chat_Sessions` Table
Stores conversational context for CrimeGPT.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | VarChar(100) | Primary Key, Not Null | UUID for the chat session. |
| `user_id` | VarChar(100) | Foreign Key, Not Null | The officer who initiated the chat. |
| `title` | VarChar(255) | | AI-generated summary of the chat topic. |
| `created_at` | DateTime | Default: Current_Time | |
| `status` | VarChar(20) | Default: "Active" | "Active" or "Archived". |

### 1.6. `Chat_Messages` Table
Stores individual messages within a session.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `message_id` | BigInt | Primary Key, Auto-Increment | |
| `session_id` | VarChar(100) | Foreign Key, Not Null | Links to `Chat_Sessions`. |
| `role` | VarChar(20) | Not Null | "user" or "assistant" (AI). |
| `content` | Text | Not Null | The text of the prompt or AI response. |
| `citations` | JSON | | Array of `fir_id`s cited by the AI response. |
| `timestamp` | DateTime | Default: Current_Time | |

## 2. Catalyst Implementation Notes
- **Data Types:** Catalyst Data Store supports standard SQL types. Ensure that `VarChar` lengths are set generously to avoid truncation errors during automated data ingestion.
- **Foreign Keys:** While Catalyst supports relations, ensure that application-level (Catalyst Function) checks are also in place before attempting to insert orphaned records to provide better error messages to the frontend.

---
**Next Steps:** Review the [Neo4j Graph Model](./Neo4jGraphModel.md) to see how complex, unstructured relationships (which do not fit well in relational tables) are handled.
