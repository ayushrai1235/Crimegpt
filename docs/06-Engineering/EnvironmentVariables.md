# Environment Variables & Secrets Management

## Overview
The **Environment Variables** document details how configuration settings and sensitive secrets (API keys, database passwords) are managed across local development and Zoho Catalyst production environments for the **CrimeGPT** platform.

**CRITICAL RULE:** Never commit a `.env` file containing actual secrets to version control.

---

## 1. Environment Segregation

The application requires different configurations depending on where it is running.

- **Local:** Developer's machine (`localhost:3000`, local mock databases).
- **Staging:** Catalyst Sandbox environment (connected to staging Neo4j/Vector DBs).
- **Production:** Catalyst Live environment (connected to production databases).

## 2. Required Variables

The following variables are standard across the architecture:

### 2.1. Frontend (Next.js)
Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- `NEXT_PUBLIC_CATALYST_PROJECT_ID`: The Zoho Catalyst Project ID.
- `NEXT_PUBLIC_API_BASE_URL`: The base URL for the Catalyst API Gateway.

### 2.2. Backend (Catalyst Functions)
These variables are securely injected at runtime and never exposed to the client.
- `OPENAI_API_KEY`: API key for the LLM.
- `NEO4J_URI`: Connection string for AuraDB.
- `NEO4J_USERNAME`: Database user.
- `NEO4J_PASSWORD`: Database password.
- `PINECONE_API_KEY`: API key for the Vector DB.
- `PINECONE_INDEX`: The specific vector index name.
- `ZOHO_CATALYST_ENVIRONMENT`: e.g., 'Development' or 'Production'.

## 3. Local Development Setup

1. Copy the provided `.env.example` file (which contains variable names but empty values) to `.env.local`.
2. Request the development API keys from the Lead Architect and populate the `.env.local` file.
3. The Next.js dev server (`npm run dev`) and Catalyst CLI (`catalyst serve`) will automatically pick up these variables.

## 4. Production Deployment (Zoho Catalyst)

Catalyst handles secrets securely through its own environment management console.

### 4.1. Catalyst Functions Configuration
1. Log into the Zoho Catalyst Web Console.
2. Navigate to **Serverless -> Functions -> [Function Name] -> Configuration**.
3. Under **Environmental Variables**, add the required Keys and Values.
4. *Important:* These must be updated manually via the console or via specific CLI commands; they are not deployed via the Git `.env` file.

## 5. Security Protocols

- **Key Rotation:** If a developer leaves the project, or if a key is accidentally exposed, all external API keys (OpenAI, Neo4j, Pinecone) must be immediately regenerated and updated in the Catalyst Console.
- **Audit:** A GitHub Action (e.g., `trufflehog` or `git-secrets`) runs on every Pull Request to scan the code for accidentally hardcoded secrets. If a secret is found, the PR is automatically blocked.
