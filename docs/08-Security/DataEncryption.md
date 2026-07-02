# Data Encryption Standards

## Overview
The **Data Encryption** document outlines the cryptographic standards applied to the **CrimeGPT** platform. Because the system handles highly sensitive police intelligence and PII (Personally Identifiable Information), robust encryption is mandatory both at rest and in transit.

---

## 1. Encryption In Transit
All data moving between the user's browser, the Catalyst API Gateway, Catalyst Functions, and external databases must be encrypted.

- **Protocol:** TLS 1.2 or higher is strictly enforced.
- **Enforcement:** The **Zoho Catalyst API Gateway** is configured to reject any plain HTTP requests, forcing a redirect to HTTPS.
- **Internal Microservices:** Communication between Catalyst Functions and the external Neo4j or Vector databases occurs exclusively over secure connections (e.g., `neo4j+s://` protocol for AuraDB).

## 2. Encryption At Rest

Data physically stored on disks in the data center must be encrypted to protect against physical theft or unauthorized hardware access.

### 2.1. Catalyst Data Store & File Store
- **Zoho Catalyst Native Encryption:** We rely on Zoho's enterprise-grade infrastructure. Data stored in the Catalyst Relational Data Store and Catalyst File Store is encrypted at rest using **AES-256**.
- **Key Management:** Encryption keys are managed automatically by the Catalyst infrastructure (transparent data encryption).

### 2.2. External Databases (Neo4j & Vector DB)
- **AuraDB Enterprise:** Enforces disk-level encryption using AES-256.
- **Vector DB (e.g., Pinecone):** Embeddings are encrypted at rest. *Note: Embeddings themselves are mathematically irreversible (you cannot perfectly reconstruct the original FIR text from a vector), adding an inherent layer of obfuscation.*

## 3. Application-Level Encryption (Highly Sensitive Fields)

For certain highly sensitive fields (e.g., informant identities or specific operational passwords), disk-level encryption is not enough, as a database administrator could theoretically query the table and read the plaintext.

- **Strategy:** Application-Level Encryption (ALE).
- **Implementation:** Before inserting sensitive data into the Catalyst Data Store, a **Catalyst Function** encrypts the specific string using a symmetric encryption algorithm (e.g., `AES-256-GCM` in Node.js `crypto` module).
- **Decryption:** The data is only decrypted in memory by the Catalyst Function *after* verifying the user's RBAC permissions. The raw database only stores the ciphertext.

## 4. Key Management for Application-Level Encryption
- The symmetric encryption keys used by the Catalyst Functions MUST NOT be hardcoded in the source code.
- They must be stored securely in the **Catalyst Environmental Variables** console.
- **Rotation:** Keys should be rotated annually, requiring a batch script to decrypt and re-encrypt the specific database columns with the new key.
