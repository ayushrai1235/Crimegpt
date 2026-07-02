# Feature: Immutable Audit Logs

## 1. Purpose
The **Immutable Audit Logs** feature is the definitive legal backbone of the CrimeGPT platform. To ensure accountability, prevent misuse of AI intelligence, and maintain the chain of custody for digital evidence, every sensitive action performed on the platform is permanently recorded.

## 2. Target Users
- Internal Affairs / Vigilance
- System Auditors
- Legal Teams (during court proceedings)

## 3. What Gets Logged?
The system logs *actions*, not just data changes. 
- **Login/Logout Events:** (Handled largely by Catalyst Auth, but mirrored for analytics).
- **Search Queries:** The exact prompt an officer typed into CrimeGPT.
- **Data Access:** Opening an FIR PDF, viewing a suspect profile, generating a network graph.
- **Data Modification:** Uploading new evidence, changing case status.
- **Administrative Actions:** Assigning permissions, resetting passwords.

## 4. Technical Workflow

### 4.1. The Logging Mechanism
- Logging is handled asynchronously to prevent slowing down the user experience.
- When an officer executes a search, the **Catalyst AI Function** performs the search, returns the result, and simultaneously fires a non-blocking request to write the action to the `Audit_Logs` table in the **Catalyst Data Store**.

### 4.2. Log Structure (JSON/Relational)
```json
{
  "timestamp": "2024-10-27T10:15:30Z",
  "user_id": "EMP_4921",
  "action": "AI_QUERY",
  "resource": "CrimeGPT_Global",
  "details": "User prompted: 'Find connections between Ravi and Suresh'",
  "ip_address": "192.168.1.45"
}
```

## 5. The "Immutability" Guarantee
A true audit log cannot be edited or deleted, even by system administrators.

- **Implementation in Catalyst:** The **Catalyst Functions** that interact with the `Audit_Logs` table are explicitly programmed to *only* execute `INSERT` statements. There are zero API endpoints written that can execute an `UPDATE` or `DELETE` on this table.
- **Database Level:** If Zoho Catalyst supports table-level permissions, the database user utilized by the application is physically denied `UPDATE/DELETE` privileges on the `Audit_Logs` table.

## 6. Audit Review UI
- The Administration Console contains an "Audit Viewer" interface.
- Auditors can filter logs by User ID, Date Range, or Action Type.
- *Example Use Case:* If a high-profile case details are leaked to the press, Internal Affairs can search the audit logs for the specific `fir_id` to see a list of every single officer who viewed that file or asked the AI about it in the last 72 hours.
