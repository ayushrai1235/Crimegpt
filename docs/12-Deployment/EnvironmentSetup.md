# Local Environment Setup

## Overview
The **Environment Setup** document provides step-by-step instructions for a new developer joining the **CrimeGPT** team to get their local machine ready for development. This ensures that the local environment accurately mirrors the **Zoho Catalyst** production environment.

---

## 1. Prerequisites

Ensure the following tools are installed on your local machine:
- **Node.js** (v18.x or higher)
- **Python** (v3.10 or higher) - Required for ML and NLP Catalyst Functions.
- **Git**
- **Zoho Catalyst CLI:** Install globally via `npm install -g zcatalyst-cli`

## 2. Cloning the Repository

```bash
git clone https://github.com/KSP-Datathon/crimegpt.git
cd crimegpt
```

## 3. Catalyst Backend Setup

1. **Login to Catalyst CLI:**
   ```bash
   catalyst login
   ```
   (This will open a browser window to authenticate with your Zoho account).

2. **Initialize the Project:**
   Ensure you are assigned to the correct Catalyst Project ID by the Lead Architect.
   ```bash
   cd catalyst-backend
   catalyst init
   ```
   *Select the existing CrimeGPT project from the list.*

3. **Install Function Dependencies:**
   You must install dependencies for *each* function individually.
   ```bash
   cd functions/crimegpt-chat-service
   npm install
   cd ../daily-heatmap-generator
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Copy the provided `.env.example` file into each function directory and name it `.env`. Request the development API keys (OpenAI, Neo4j) from the team lead and populate the files.

5. **Run Local Catalyst Server:**
   From the `catalyst-backend` root folder:
   ```bash
   catalyst serve
   ```
   This starts the local emulator for Catalyst Functions. Note the localhost ports provided in the terminal.

## 4. Frontend Setup (Next.js)

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy `.env.example` to `.env.local`. Ensure `NEXT_PUBLIC_API_BASE_URL` points to the local port exposed by `catalyst serve` in the previous step (e.g., `http://localhost:3001/server/crimegpt-core/api/v1`).

4. **Run Next.js Dev Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser. You are now ready to develop.

## 5. Mocking External Services Locally
- **Vector DB / Graph DB:** Do not run massive databases locally on your laptop. The development environment variables should point to the cloud-hosted **Staging** instances of Neo4j AuraDB and Pinecone provided by the team lead.
- **Catalyst Data Store:** The `catalyst serve` command automatically mocks the Data Store and File Store locally. You will need to run the provided seed scripts (`npm run seed:local`) to populate your local emulator with mock FIR data for testing.
