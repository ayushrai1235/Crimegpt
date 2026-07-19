# Hackathon Demo Script (5-7 Minutes)

## 1. Overview
This document outlines the step-by-step presentation script for the CrimeGPT MVP at the Karnataka State Police Datathon. It is designed to maximize visual impact, demonstrate AI transparency (XAI), and prove the system's technical viability on Zoho Catalyst.

## 2. Setup & Prerequisites
- Ensure the Next.js frontend and Catalyst backend are running.
- Ensure Pinecone, Neo4j, and Gemini API keys are active.
- Have a sample "Target FIR PDF" ready on the desktop (e.g., a cybercrime fraud case).

---

## 3. Demo Flow

### Step 1: The Problem & Upload (0:00 - 1:00)
- **Action**: Open the Investigation Workspace. Click "Upload FIR."
- **Talking Point**: "Officers today spend hours reading unstructured FIRs. We built CrimeGPT to be an AI Investigation Copilot. Watch what happens when I upload this raw, scanned PDF of a cyber fraud case."
- **Visual**: Show the progress bar as Catalyst processes the PDF.

### Step 2: Extraction & Summary (1:00 - 1:30)
- **Action**: The Evidence Explorer populates with the PDF on the left and the extracted JSON metadata on the right.
- **Talking Point**: "In seconds, Gemini 2.0 has OCR'd the document and extracted the Accused, Victim, Bank Accounts, and summarized the Modus Operandi. This is now saved securely in the Catalyst Data Store."

### Step 3: Semantic Case Similarity (1:30 - 2:30)
- **Action**: Click the "Find Similar Cases" button.
- **Talking Point**: "Because criminals often repeat their methods, our system instantly converts the MO into a vector embedding. Using Pinecone, we instantly found 3 historical cases with an 85%+ similarity match, even though the keywords used by the officers were completely different."

### Step 4: Knowledge Graph Intelligence (2:30 - 3:30)
- **Action**: Expand the Network Graph widget. Click on the extracted Bank Account node.
- **Talking Point**: "This is where CrimeGPT shines. By querying Neo4j, we see this exact same bank account was used in two other fraud cases across different districts. We just uncovered an organized syndicate that traditional relational databases would have missed."

### Step 5: Timeline & Hotspot Mapping (3:30 - 4:30)
- **Action**: Toggle to the Timeline view, then the Map view.
- **Talking Point**: "The AI automatically plotted a chronological timeline of this gang's activities. Moving to the map, we use our Prediction Module to highlight a geographical hotspot, forecasting where this syndicate is likely to strike next based on temporal patterns."

### Step 6: AI Chat & Explainability (4:30 - 5:30)
- **Action**: Open the AI Chat panel. Type: *"Based on the graph, who should I interview next and why?"*
- **Talking Point**: "CrimeGPT isn't just a search engine; it's a reasoning engine. Our AI Orchestrator queries the graph and suggests interviewing 'Rahul' because he bridges two different fraud rings."
- **Action**: Hover over the `[FIR-2023-102]` citation in the AI's response.
- **Talking Point**: "Crucially, for court admissibility, CrimeGPT is constrained by Explainable AI principles. Every claim it makes includes a clickable citation to the exact FIR, proving zero hallucination."

### Step 7: Report Generation & Conclusion (5:30 - 6:00)
- **Action**: Click "Generate Investigation Report." Download the PDF.
- **Talking Point**: "Finally, the officer exports this comprehensive, evidence-backed report. Built on Zoho Catalyst's scalable infrastructure, CrimeGPT transforms reactive policing into proactive intelligence."

---

## 4. Edge Cases (If Asked by Judges)
- **Judge asks about Hallucinations**: Explain the XAI regex validator (see `ExplainableAI.md`).
- **Judge asks about Scalability**: Explain the Catalyst-First modular architecture and event queues (see `SystemArchitecture.md`).
- **Judge asks about Data Privacy**: Explain that for the MVP, we assume deployment in a trusted intranet, but Catalyst natively supports RBAC and encryption at rest.

## 5. Future Enhancements
- Expand the demo to include voice input (Kannada) and real-time transcription.
