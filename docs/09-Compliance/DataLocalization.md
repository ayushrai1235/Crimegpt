# Data Localization & Sovereignty

## Overview
The **Data Localization** document details how the **CrimeGPT** platform complies with Indian data protection regulations (such as the DPDP Act) and specific Ministry of Home Affairs (MHA) guidelines regarding the storage of law enforcement intelligence.

---

## 1. The Legal Requirement

Criminal intelligence, active FIR details, and suspect Personally Identifiable Information (PII) are classified as highly sensitive data. 

**Core Mandate:** This data must remain within the sovereign borders of India. It cannot be transmitted to, processed in, or backed up to servers located outside the country.

## 2. Infrastructure Compliance (Zoho Catalyst)

The decision to use a **Catalyst-first architecture** significantly simplifies compliance.

- **Data Center Selection:** During project initialization, the Zoho Catalyst environment MUST be explicitly provisioned in the **India (IN) Data Center**.
- **Services Covered:** By selecting the IN region, all data stored in the Catalyst Relational Data Store, Catalyst File Store, Catalyst Cache, and the execution of all Catalyst Functions are guaranteed to remain on servers physically located in India.

## 3. External Service Compliance

While Catalyst provides a secure foundation, the platform relies on external services for Graph and AI processing. These require strict scrutiny.

### 3.1. LLM Provider (OpenAI / Google Vertex)
- **The Risk:** Sending an FIR text to an API endpoint hosted in the United States violates data localization laws.
- **The Solution:** We must utilize enterprise API tiers that guarantee regional processing. For example, using Google Cloud Vertex AI or Microsoft Azure OpenAI services provisioned strictly within their **Central India (Pune)** or **South India (Chennai)** cloud regions.
- **Zero Data Retention:** As stated in the AI Architecture, the contract must explicitly forbid the provider from storing the prompt data for training purposes. The data is processed in RAM in India and immediately discarded.

### 3.2. Neo4j (Graph Database)
- **The Solution:** Neo4j AuraDB Enterprise allows customers to select the underlying cloud provider (AWS/GCP/Azure) and the specific region. The AuraDB instance must be provisioned in an Indian region (e.g., `ap-south-1`).

### 3.3. Vector Database (Pinecone / Weaviate)
- **The Solution:** Similar to Neo4j, the managed vector database must be hosted in an Indian region. Alternatively, if a managed cloud vector DB in India is unavailable or too expensive, the system can utilize **Weaviate** deployed via Docker on an Indian-hosted Virtual Machine, managed by the KSP IT department, and accessed securely by the Catalyst Functions.

## 4. Auditing Localization
- Network egress logs from the Catalyst API Gateway should be periodically audited by the IT team to ensure no Catalyst Function is making unauthorized HTTP requests to foreign IP addresses.
