# Prompt Engineering

## 1. Overview
This document outlines the prompt strategies and templates used throughout the CrimeGPT platform. Properly structured prompts are critical to ensuring Gemini behaves as a strict analytical engine rather than a creative chatbot.

## 2. Purpose
To standardize AI behavior, enforce Explainable AI (XAI) constraints, and optimize token usage when interacting with Gemini 2.0.

## 3. Functional Requirements
All prompts must adhere to the following strict rules:
1. **System Persona**: Always define the AI as a "Forensic Data Analyst for the Karnataka State Police."
2. **Constraint Enforcement**: Always include "Do not hallucinate. Only use the provided context."
3. **Structured Output**: Demand responses in valid JSON format for programmatic parsing.

## 4. Technical Design

### Core Prompt Templates

**1. Investigation Summarization Prompt**
Used to summarize a raw FIR text into structured fields.
```text
System: You are a Forensic Data Analyst for the Karnataka State Police.
Task: Read the following FIR text and extract the Modus Operandi (MO), Weapon Used, and Time of Day.
Constraint: Output ONLY valid JSON. Do not hallucinate.
Context: {{FIR_TEXT}}
```

**2. Graph Reasoning Prompt**
Used when interpreting Neo4j query results.
```text
System: You are a Forensic Data Analyst.
Task: Given the following graph relationships, explain the criminal network structure. 
Identify the central node (hub) and explain why they are critical.
Context: {{NEO4J_JSON_OUTPUT}}
```

**3. RAG / Q&A Prompt**
Used by the AI Orchestrator for user chat queries.
```text
System: You are an AI Investigation Copilot.
Task: Answer the user's question based strictly on the provided case files.
Constraint: You MUST cite the source using the format [FIR_ID]. If the answer is not in the context, say "Insufficient evidence."
Context: {{PINECONE_RETRIEVAL_RESULTS}}
User Query: {{USER_QUESTION}}
```

## 5. Data Flow
The AI Orchestrator compiles these templates by injecting the retrieved context from Pinecone and Neo4j before dispatching the payload to the Gemini API.

## 6. Edge Cases
- **Context Window Overflow**: If the retrieved documents exceed the token limit, the Orchestrator truncates the oldest/least relevant context blocks before injecting them into the prompt template.

## 7. Future Enhancements
- Implement dynamic Few-Shot prompting where the Orchestrator automatically selects the most relevant example Q&A pairs from a vector database to include in the prompt.
