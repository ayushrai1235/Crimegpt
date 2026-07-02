# Recommendation Engine

## Overview
The **Recommendation Engine** shifts the **CrimeGPT** platform from a reactive search tool to a proactive intelligence assistant. By continuously analyzing data in the background using **Catalyst Cron** and **Catalyst Functions**, the system pushes actionable insights (e.g., linking unsolved cases) to investigators before they even ask.

---

## 1. Core Concept: Latent Connection Discovery
Investigators often suffer from tunnel vision, focusing solely on the FIR in front of them. The Recommendation Engine looks across the entire **Catalyst Data Store** and Neo4j Graph DB to find "Latent Connections"—similarities that humans miss.

## 2. Recommendation Workflows

### 2.1. "Similar Cases" Suggestion
When an Investigating Officer opens an active FIR in the UI, the system automatically suggests historically similar cases.

- **Trigger:** Frontend loads `FIR/102/2023`.
- **Process:** The Next.js app silently calls the `crimegpt-recommendation-service` (a Catalyst Function).
- **Execution:** The Catalyst Function fetches the embedding vector for FIR 102/2023 and performs a rapid semantic search against the Vector DB.
- **Output:** The UI populates a sidebar: *"CrimeGPT found 3 unsolved cases from 2021 with a 90% M.O. match. Click to review."*

### 2.2. "Suspect Association" Suggestion
The engine proactively attempts to identify organized crime rings.

- **Trigger:** A new FIR is ingested via the **Catalyst File Store** pipeline, and a new node for "Suspect A" is added to Neo4j.
- **Execution (Background):** A **Catalyst Cron** job runs a graph traversal algorithm nightly. It looks for suspects who share multiple secondary connections (e.g., Suspect A and Suspect B have never been arrested together, but both use the same lawyer, frequent the same bar, and drive vehicles registered to the same address).
- **Output:** The system generates an alert stored in the **Catalyst Data Store**, and the relevant SHO sees a notification on their dashboard: *"Potential Syndicate Link detected between Suspect A and Suspect B. View Graph."*

## 3. Catalyst Architecture for Recommendations

Generating recommendations is computationally expensive. Running these algorithms synchronously when a user loads a page will cause unacceptable latency.

1. **Pre-computation:** The heavy lifting (like the nightly graph traversals) MUST be executed by **Catalyst Cron** during off-peak hours (2:00 AM IST).
2. **Storage:** The generated recommendations are saved as simple relational records in a `Case_Recommendations` table in the **Catalyst Data Store**.
3. **Retrieval:** When the user loads the dashboard, the Catalyst API simply performs a fast SQL `SELECT` to fetch the pre-computed recommendations, ensuring < 200ms load times.

## 4. Feedback Loop (Reinforcement Learning)
To improve the engine, the UI must include "Helpful" / "Not Helpful" buttons on every recommendation.
- **Action:** An officer clicks "Not Helpful" on a suggested similar case.
- **Storage:** A **Catalyst Function** logs this interaction in the Data Store.
- **Impact:** Over time, ML engineers analyze these logs to fine-tune the similarity thresholds and graph traversal weights, ensuring the engine becomes smarter with use.

---
**Next Steps:** Review the [Prediction Models](./PredictionModels.md) document to see how we forecast future crime trends.
