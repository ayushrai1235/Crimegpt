# Feature: Financial Crime Tracker

## 1. Purpose
The **Financial Crime Tracker** is a specialized module for tracing the flow of illicit funds. While standard CrimeGPT focuses on narrative text, this feature is optimized for structured financial data (bank account numbers, UPI IDs, transaction amounts).

## 2. Target Users
- Cybercrime Officers (CEN Police Stations)
- Economic Offences Wing (EOW)

## 3. User Journey
1. A cybercrime investigator uploads a CSV file containing a suspect's bank statement (obtained via a Section 91 CrPC notice) into the workspace.
2. The officer navigates to the "Financial Tracker" tab.
3. The system automatically parses the CSV, identifies large transfers, and visualizes the flow of money (e.g., Suspect A transferred ₹50,000 to Account B, which then split the money into Accounts C and D).
4. The officer clicks on "Account C". The system cross-references the **Catalyst Data Store** and alerts the officer: *"Account C was previously flagged in FIR 88/2022 in a different district."*

## 4. Technical Workflow

### 4.1. File Ingestion and Parsing
- When the CSV is uploaded to the **Catalyst File Store**, an event-driven **Catalyst Function** is triggered.
- Instead of sending the CSV to the LLM (which is terrible at math and large tables), the function uses standard Python/Node.js libraries (e.g., `pandas`) to parse the rows into a structured JSON array.

### 4.2. Graph Integration (Neo4j)
Financial tracing is a classic graph problem.
- The parsed transaction data is inserted into the **Neo4j Graph Database**.
- **Nodes:** `BankAccount`, `UPI_ID`, `Person`.
- **Edges:** `TRANSFERRED_TO` (properties: `amount`, `date`).
- This allows the system to instantly connect a seemingly random bank account in the current case to a known fraudster from a 3-year-old case.

### 4.3. UI Visualization
- The frontend renders the money flow using a Sankey diagram or a directed graph (via libraries like D3.js or Vis.js), making complex money laundering networks instantly understandable to an investigator.

## 5. Security and PII Handling
Financial records are highly sensitive.
- The raw CSV files stored in Catalyst must be encrypted at rest.
- The UI must include a "Redact" toggle that automatically masks the first 8 digits of bank account numbers when taking screenshots for court presentations.
