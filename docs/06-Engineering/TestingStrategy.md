# Testing Strategy

## Overview
The **Testing Strategy** ensures that the **CrimeGPT** codebase remains robust, secure, and regression-free as new features are rapidly developed. Given the sensitive nature of law enforcement software, unverified code cannot be deployed to the production Catalyst environment.

---

## 1. The Testing Pyramid

We adhere to the standard testing pyramid, prioritizing fast, isolated tests over slow, brittle end-to-end tests.

### 1.1. Unit Tests (Base Layer)
- **Scope:** Testing individual functions and utility classes in isolation (e.g., date formatters, intent routers, mathematical ranking algorithms).
- **Tooling:** `Jest` for JavaScript/TypeScript, `PyTest` for Python ML scripts.
- **Requirement:** All core utility functions must have > 80% code coverage.
- *Example:* A test ensuring that the Reciprocal Rank Fusion (RRF) algorithm correctly merges two arrays of search results.

### 1.2. Integration Tests (Middle Layer)
- **Scope:** Testing how Catalyst Functions interact with the databases (Data Store, Neo4j, Vector DB).
- **Execution:** These tests require a local setup (e.g., a local Docker container for Neo4j) or a dedicated Catalyst staging environment. They do NOT test the UI.
- *Example:* A test verifying that sending a POST request to the `/api/cases` endpoint successfully inserts a record into the test database and returns a 201 status.

### 1.3. End-to-End (E2E) Tests (Top Layer)
- **Scope:** Simulating an actual user clicking through the Next.js frontend in a headless browser to verify critical workflows.
- **Tooling:** `Cypress` or `Playwright`.
- *Example:* An automated script that logs in as an Inspector, navigates to the Chat interface, types a mock query, and verifies that the citation badges render correctly on the screen.

## 2. Specialized AI Testing

Traditional testing asserts exact outputs (`assert(2+2 == 4)`). LLMs generate non-deterministic text, making standard assertions impossible.

### 2.1. LLM Evaluation Strategy
- **Prompt Testing:** We maintain a "Golden Dataset" of 50 common law enforcement questions and their ideal expected answers.
- **Evaluation Script:** Before a major prompt change is deployed, a script runs the Golden Dataset against the LLM. 
- **Assertion:** Another LLM (or a semantic similarity algorithm) evaluates the output to ensure the *meaning* matches the expected answer and that citations are correctly included, rather than checking for an exact string match.

### 2.2. Hallucination Checks
Specific integration tests must intentionally feed the RAG pipeline with questions that have no answer in the provided context, asserting that the system successfully returns the standard "Information not found" refusal message.

## 3. Security Testing (SAST/DAST)
- **Static Application Security Testing (SAST):** Tools run automatically during the CI/CD pipeline to scan the source code for vulnerabilities (e.g., SQL injection risks in raw queries, hardcoded secrets).
- **Dynamic Application Security Testing (DAST):** Automated vulnerability scanners ping the staging API endpoints to ensure proper CORS, JWT validation, and RBAC enforcement.

---
**Next Steps:** Review the [CI/CD Pipeline](./CI-CD.md) document to see how these tests are automated.
