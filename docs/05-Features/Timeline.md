# Investigation Timeline

## 1. Overview
The Timeline feature provides a chronological visualization of all events related to a specific case or a specific accused individual across multiple cases.

## 2. Purpose
Investigations involve complex sequences of events (e.g., Crime occurred -> FIR Filed -> Arrest Made -> Chargesheet filed). The timeline translates these disparate data points into an easy-to-read chronological UI.

## 3. Functional Requirements
- **Auto-Generation**: Extracts dates from the FIR text (using Gemini) and metadata (from Catalyst Data Store) to plot events.
- **Interactive**: Clicking an event on the timeline filters the Evidence Panel to show the source document.
- **Multi-Case View**: Can show a unified timeline of an offender's entire criminal history.

## 4. Technical Design
- **Frontend**: Utilizes a React timeline component (e.g., `react-chrono` or a custom Tailwind vertical timeline).
- **Backend Extraction**: During the Catalyst Upload function, Gemini is specifically prompted to extract all temporal events into a JSON array: `[{ "date": "...", "event": "...", "confidence": ... }]`.

## 5. Data Flow
FIR Upload -> Gemini Temporal Extraction -> Saved to Catalyst Data Store (`CaseEvents` table equivalent) -> Rendered in Investigation Workspace.

## 6. Edge Cases
- **Vague Dates**: If an FIR states "sometime last week," Gemini attempts to estimate the date range, but the UI flags it with a "Low Precision" warning icon.

## 7. Future Enhancements
- Integration with external CCTV or Call Detail Record (CDR) logs to plot minute-by-minute timelines.
