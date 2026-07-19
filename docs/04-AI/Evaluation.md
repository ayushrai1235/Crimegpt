# AI Evaluation Metrics

## 1. Overview
This document outlines the measurable success criteria for the AI models deployed within CrimeGPT. To ensure enterprise-grade reliability, the performance of the AI Orchestrator, Gemini, Pinecone, and Neo4j integrations must be continuously monitored.

## 2. Purpose
To establish a baseline for acceptable AI performance and define how to test the platform during the hackathon and beyond.

## 3. Functional Requirements (Metrics)
- **Retrieval Accuracy (R@5)**: The Pinecone vector database must return the correct, ground-truth related cases within the top 5 results for at least 90% of queries.
- **Citation Accuracy**: 100% of generated claims must possess a valid, clickable FIR citation. Hallucinated citations constitute a critical failure.
- **Entity Extraction Accuracy**: Gemini must extract 95% of named entities (Accused Names, Bank Accounts, Phone Numbers) from unstructured FIR PDFs correctly.
- **Response Latency**: The AI Orchestrator must return the first streamed token within 2 seconds. Graph queries must resolve in < 500ms.
- **Confidence Score Calibration**: A generated confidence score of 90% should mean the prediction is historically accurate 9 out of 10 times.

## 4. Technical Design
### Evaluation Pipeline
Evaluation is conducted via a separate Catalyst Cron script that runs nightly against a golden dataset of 100 known FIRs:
1. Feeds the 100 FIRs through the extraction pipeline.
2. Compares the extracted JSON against human-annotated ground truth.
3. Fires 50 known user queries through the AI Orchestrator.
4. Logs the R@5 and latency metrics to Catalyst Data Store.

## 5. Data Flow
Golden Dataset -> Catalyst Cron Function -> Extraction/Chat Pipelines -> Metric Calculation -> Catalyst Data Store (Logs).

## 6. Edge Cases
- **Metric Degradation**: If citation accuracy drops below 99% during a nightly run, a Catalyst Notification is sent to the admin dashboard alerting them of potential LLM drift.

## 7. Future Enhancements
- Integrate a dedicated ML observability platform (like LangSmith or Arize) for real-time trace logging.
