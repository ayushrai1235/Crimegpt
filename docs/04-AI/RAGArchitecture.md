# RAG Architecture (Retrieval-Augmented Generation)

## Overview
The **RAG Architecture** document details the mechanism used to ensure that **CrimeGPT** provides accurate, factual, and strictly grounded answers. By utilizing RAG, we prevent the LLM from hallucinating and ensure it relies entirely on the official KSP records stored in the **Catalyst File Store** and indexed in the Vector DB.

---

## 1. What is RAG?
Retrieval-Augmented Generation is a framework that provides an LLM with external, verifiable information before asking it to generate a response. 
Instead of asking the LLM to "remember" facts from its training data, we provide an open book (the relevant FIRs) and ask it to read and summarize.

## 2. The Ingestion Phase (Building the Library)

Before RAG can occur, the data must be prepared. This happens entirely in the background via **Catalyst Functions**.

1. **Document Loading:** FIR PDFs are fetched from **Catalyst File Store**.
2. **Text Extraction & Cleaning:** OCR is applied. PII stripping (optional) is performed.
3. **Chunking:** The text is split into semantic chunks (e.g., 500 tokens per chunk with a 50-token overlap).
4. **Embedding:** Each chunk is sent to an embedding model (e.g., `text-embedding-3-small`) to generate a vector representation.
5. **Storage:** The vector, along with the text chunk and metadata (FIR ID, Station ID), is saved to the **Vector Database**.

## 3. The Retrieval Phase (Finding the Evidence)

When a user asks a question (e.g., "Summarize the witness statements in FIR 404/2023"):

1. **Query Vectorization:** A Catalyst Function converts the user's query into a vector.
2. **Metadata Filtering (Crucial Step):** To improve accuracy and security, the Catalyst Function applies hard filters before searching the Vector DB. 
   - *Example:* `filter = { "fir_id": "404/2023", "station_id": user.station_id }`
3. **Similarity Search:** The Vector DB returns the Top-K (e.g., 5) chunks that are mathematically most similar to the user's query.

## 4. The Generation Phase (Answering the User)

The Catalyst Function now constructs the final prompt to send to the LLM.

### 4.1. The RAG Prompt Structure
The prompt sent to the LLM by the Catalyst Function follows a strict template:

```text
You are CrimeGPT, an intelligence assistant for the Karnataka State Police.
Your task is to answer the officer's question based strictly on the provided context chunks below.

RULES:
1. If the answer is not contained in the context, you MUST reply: "I cannot find this information in the provided records." Do not guess.
2. You MUST cite your sources. For every factual claim, append the citation tag provided in the context (e.g., [FIR_102_2023]).

CONTEXT:
---
[Document ID: FIR_404_2023_CHUNK_1]
Witness Statement 1: "I saw a white SUV speeding away at 2 AM."
---
[Document ID: FIR_404_2023_CHUNK_2]
Witness Statement 2: "The suspect was wearing a red jacket."
---

QUESTION: {user_query}
```

### 4.2. LLM Execution
The LLM processes this prompt and streams the response back to the Catalyst Function:
*"According to the witness statements, a white SUV was seen speeding away at 2 AM [FIR_404_2023], and the suspect was wearing a red jacket [FIR_404_2023]."*

## 5. Post-Processing & UI Rendering

1. **Citation Parsing:** The Catalyst Function (or the Next.js frontend) uses a regex parser to identify the citation tags (e.g., `[FIR_404_2023]`).
2. **Hyperlinking:** It converts these tags into clickable UI components.
3. **Action:** When the officer clicks the citation, a Catalyst Function generates a secure URL to the exact PDF in the **Catalyst File Store** and opens it in a side panel for manual verification.

---
**Next Steps:** Review the [Prompt Engineering](./PromptEngineering.md) document for details on how we craft prompts to ensure compliance and accuracy.
