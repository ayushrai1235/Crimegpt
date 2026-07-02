# Database Indexes

## Overview
The **Database Indexes** document details the indexing strategy for the **Zoho Catalyst Data Store**. Proper indexing is critical for maintaining fast read performance as the volume of crime data grows to millions of records. Without indexes, simple lookups would result in full table scans, causing API timeouts and excessive compute costs.

---

## 1. Indexing Principles
- **Read-Heavy Optimization:** Crime intelligence systems are overwhelmingly read-heavy (90% Reads, 10% Writes). We will aggressively index columns used frequently in `WHERE` clauses and `JOIN` conditions.
- **Catalyst Limitations:** Catalyst Data Store has specific limits on the number of indexes per table. We must prioritize composite indexes that cover the most common query patterns.

## 2. Core Indexes Required

### 2.1. `Users` Table
| Index Name | Type | Column(s) | Justification |
| :--- | :--- | :--- | :--- |
| `idx_user_email` | UNIQUE | `email` | Used heavily during Authentication and user lookups. |
| `idx_user_station` | NONCLUSTERED | `station_id` | Used to retrieve all officers in a specific jurisdiction. |

### 2.2. `FIR_Metadata` Table (Most Critical)
| Index Name | Type | Column(s) | Justification |
| :--- | :--- | :--- | :--- |
| `idx_fir_station_date` | COMPOSITE | `station_id`, `reported_at` | **Primary query pattern:** SHOs looking up FIRs in their station within a specific date range. |
| `idx_fir_act_section` | COMPOSITE | `primary_act`, `primary_section` | Used by Analysts to filter crimes by specific penal codes (e.g., all NDPS Act cases). |
| `idx_fir_status` | NONCLUSTERED | `status` | Used to quickly filter out closed cases from active investigation dashboards. |

### 2.3. `Audit_Logs` Table
| Index Name | Type | Column(s) | Justification |
| :--- | :--- | :--- | :--- |
| `idx_audit_user_time` | COMPOSITE | `user_id`, `timestamp` | Used by Admins investigating a specific officer's activity over a time period. |
| `idx_audit_resource` | NONCLUSTERED | `resource_id` | Used to find out "Who accessed this specific FIR?" |

### 2.4. `Chat_Sessions` Table
| Index Name | Type | Column(s) | Justification |
| :--- | :--- | :--- | :--- |
| `idx_chat_user_status` | COMPOSITE | `user_id`, `status` | Used to populate the sidebar history (showing 'Active' sessions for the logged-in user). |

## 3. Catalyst Search (Full-Text Indexing)

While B-Tree indexes (above) are great for exact matches, they fail at text search (e.g., `WHERE description LIKE '%robbery%'`).

- **Strategy:** For unstructured text or wildcard searches across metadata, we rely on **Catalyst Search**. 
- **Implementation:** Columns like `incident_details` or `suspect_names` (if stored in the relational DB) must be explicitly flagged for indexing in the Catalyst Search console. Catalyst automatically maintains a Lucene-style inverted index for these columns, allowing for rapid keyword searches without locking the primary relational tables.

---
**Next Steps:** Review the [Data Migration](./DataMigration.md) document to understand how we will initially populate these tables with legacy KSP data.
