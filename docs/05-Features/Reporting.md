# Feature: Automated Reporting

## 1. Purpose
The **Automated Reporting** module significantly reduces the administrative burden on officers. It leverages the LLM to automatically generate formal police reports, daily diaries, and executive briefings based on the raw data in the system.

## 2. Target Users
- Station House Officers (SHOs) generating daily reports.
- Investigators drafting case summaries for court.

## 3. Supported Report Types
1. **Daily Station Diary (DSR) Summary:** A summary of all FIRs registered and major incidents in a specific station over the last 24 hours.
2. **Case Summary (Chargesheet Prep):** A chronological narrative of an investigation synthesized from all witness statements and evidence logged in the workspace.
3. **Executive Briefing:** A high-level, bulleted summary of a critical incident (e.g., a riot or high-profile murder) for the Commissioner or Home Minister.

## 4. Technical Workflow (LLM Generation)

### 4.1. Triggering the Report
- An SHO clicks "Generate Daily Report" on their dashboard.
- The Next.js frontend calls the `crimegpt-reporting-service` **Catalyst Function**.

### 4.2. Data Aggregation
- The Catalyst Function queries the **Catalyst Data Store** for all FIRs registered in that SHO's `station_id` within the last 24 hours.
- It fetches the corresponding text chunks from the Vector DB.

### 4.3. LLM Prompting
- The function uses a highly structured Prompt Template.
*Example Prompt:*
```text
Task: Generate the Daily Station Report.
Input Data: [JSON array of today's FIRs]
Format Rules:
1. Start with a statistical summary (Total FIRs, Arrests).
2. Group the FIRs by category (e.g., Property Crimes, Violent Crimes).
3. Provide a 2-sentence summary for each FIR.
4. Maintain a formal, objective legal tone.
```

### 4.4. Output and Export
- The LLM returns formatted Markdown.
- The frontend renders the Markdown in a WYSIWYG editor, allowing the SHO to manually edit or correct any details before finalizing.
- The user can click "Export to PDF". The Next.js app uses a library like `jspdf` to convert the HTML/Markdown into an official KSP-letterhead PDF document.

## 5. Liability and Verification
As with all AI-generated content, the system cannot finalize a report automatically. The UI enforces a mandatory checkbox: *"I have reviewed this AI-generated report for accuracy."* before the report can be saved to the official record or exported.
