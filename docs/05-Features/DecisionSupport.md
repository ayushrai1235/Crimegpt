# Feature: Decision Support System (DSS)

## 1. Purpose
The **Decision Support System (DSS)** acts as an AI advisor for Investigating Officers (IOs). Instead of just retrieving facts, the DSS uses the LLM's reasoning capabilities to suggest *next steps* in an active investigation based on KSP Standard Operating Procedures (SOPs) and historical success patterns.

## 2. Target Users
- Investigating Officers (IOs) (especially junior or newly assigned officers)

## 3. User Journey
1. An IO is assigned a complex Cyber Fraud case. They open the Investigation Workspace.
2. They click the "DSS Advisor" button.
3. The system analyzes the current case file and outputs a suggested action plan.
4. *Output Example:* "Based on the reported UPI fraud, standard protocol suggests: 1) Immediately email the Nodal Officer at Bank X to freeze account [number]. 2) Request CDRs for phone [number]. 3) Check recent FIRs in the adjoining district for similar M.O."

## 4. Technical Workflow

### 4.1. The SOP Database (Vector DB)
To ensure the AI gives legally sound advice, the Vector DB is populated not just with FIRs, but with the official **KSP Investigation Manuals and SOPs**.

### 4.2. RAG Execution
When the DSS is invoked, the **Catalyst Function** runs a specific RAG pipeline:
1. It reads the current case metadata.
2. It queries the Vector DB explicitly targeting the "SOP" metadata tag (e.g., finding the SOP for "Handling Digital Evidence").
3. It prompts the LLM: *"You are an experienced Police Inspector mentoring a junior officer. Based on the current case details and the provided official KSP SOPs, list the immediate next investigative steps. Do not invent procedures outside of the SOPs."*

## 5. Automated Drafting (Action Execution)
The DSS goes beyond advice by drafting the paperwork.
- If the DSS suggests "Email the Nodal Officer," it provides a "Draft Email" button.
- Clicking the button triggers a **Catalyst Function** that uses the LLM to generate a formal, legally formatted Section 91 CrPC notice, pre-filled with the bank details and FIR number from the case file, ready for the officer to review and send.

## 6. Liability and Overrides
- **Disclaimer:** The UI must permanently display a banner stating: *"DSS suggestions are advisory. The Investigating Officer retains full legal responsibility for all actions."*
- Officers are never forced to follow the DSS suggestions, preserving human agency and legal accountability.
