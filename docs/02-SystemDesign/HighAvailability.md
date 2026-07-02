# High Availability (HA)

## Overview
The **High Availability (HA)** document outlines the strategies employed to ensure the **CrimeGPT** platform remains accessible and fully functional, targeting a **99.99% uptime**. High availability is critical for law enforcement operations, where system downtime could impact ongoing field investigations or emergency response coordination.

---

## 1. Core Platform Availability (Zoho Catalyst)

By adopting a **Catalyst-first architecture**, the burden of maintaining high availability for the core infrastructure is offloaded to Zoho's enterprise cloud infrastructure.

### 1.1. Multi-Zone Redundancy
- **Strategy:** Zoho Catalyst inherently distributes its services (Functions, Data Store, File Store) across multiple Availability Zones (AZs) within the selected region (India). 
- **Impact:** If a single physical data center experiences a power failure or network disruption, Catalyst automatically routes traffic to a healthy AZ without manual intervention.

### 1.2. Stateless Compute
- **Strategy:** All backend business logic is executed within serverless **Catalyst Functions**.
- **Impact:** Because these functions do not hold state in memory, an instance crashing has zero impact on the overall system. The next incoming request is simply routed to a newly spun-up, healthy function instance.

## 2. External Service Redundancy

While Catalyst provides HA for the core, external services must be architected to handle failures gracefully.

### 2.1. LLM API Failover
- **Vulnerability:** External LLMs (OpenAI, Gemini) occasionally experience degraded performance or outages.
- **HA Strategy:** The **Catalyst AI Orchestrator Function** must implement an LLM fallback mechanism. If the primary LLM (e.g., Gemini 1.5 Pro) times out or returns a 5xx error after 2 retries, the function automatically routes the prompt and context to a secondary, pre-configured LLM provider (e.g., Anthropic Claude or a locally hosted fallback model if available).

### 2.2. Graph and Vector Database Clustering
- **Vulnerability:** Single points of failure in the external Neo4j or Vector databases.
- **HA Strategy:** We mandate the use of Enterprise Cloud tiers for these services (e.g., Neo4j AuraDB Enterprise, Pinecone Enterprise), which natively provide multi-AZ clustering, automated failover, and zero-downtime patching.

## 3. Degradation Strategy (Circuit Breakers)

High Availability also means keeping the core system alive even when peripheral systems fail.

- **Implementation:** **Catalyst Functions** must implement the *Circuit Breaker* pattern for all external API calls.
- **Scenario:** If the Neo4j database becomes unresponsive, the Catalyst Function will "trip the circuit" after 3 failures. Subsequent requests to the Network Analysis endpoints will immediately return a `503 Service Unavailable - Graph Analysis Offline` error without waiting for a timeout. 
- **Result:** This prevents the Catalyst Functions from hanging and consuming concurrency limits, ensuring that core features (like basic text search and FIR retrieval from the Catalyst Data Store) remain 100% operational.

---
**Next Steps:** Review the [Disaster Recovery](./DisasterRecovery.md) document to understand the protocol for handling catastrophic, region-wide failures.
