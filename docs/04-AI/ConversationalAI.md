# Conversational AI (CrimeGPT)

## Overview
The **Conversational AI** document details the interaction model and design principles behind **CrimeGPT**, the primary user interface for the platform. It outlines how officers interact with the system using natural language, and how the underlying **Catalyst Functions** parse and fulfill those requests.

---

## 1. The Interaction Paradigm

CrimeGPT is designed to emulate an intelligent human intelligence analyst. Officers should not need to learn specialized syntax or complex search filters.

### 1.1. Supported Intents
The system is trained to recognize and handle the following primary intents:
1. **Fact Retrieval:** "Who was the investigating officer for FIR 102/2023?"
2. **Cross-Referencing:** "Has Suspect X been involved in any other cases in the South Zone?"
3. **Summarization:** "Summarize the witness testimonies in this case file."
4. **Network Analysis:** "Who are the known associates of Suspect Y?"
5. **Predictive Inquiry:** "Where are vehicle thefts most likely to occur this weekend?"
6. **Translation/Localization:** "Translate this Kannada FIR summary into English."

## 2. Intent Routing (The Catalyst Orchestrator)

When a user submits a query, it hits the `crimegpt-chat-service` (a **Catalyst Function**). The first step is *Intent Routing*.

Instead of sending every query through the expensive RAG pipeline, the system uses a lightweight router (either a small, fast LLM call or regex heuristics).

```python
# Conceptual Catalyst Function Router Logic
def route_query(user_input):
    intent = determine_intent(user_input)
    
    if intent == "NETWORK_ANALYSIS":
        return execute_graph_agent(user_input)
    elif intent == "PREDICTIVE":
        return fetch_cached_heatmaps(user_input) # Fetches from Catalyst Cache
    elif intent == "FACT_RETRIEVAL":
        return execute_rag_pipeline(user_input)
    else:
        return standard_conversational_response()
```

## 3. Context Management (Memory)

To maintain a natural conversation, the AI must remember what was said previously.

### 3.1. Short-Term Memory (Catalyst Cache)
- When a chat session begins, a unique `session_id` is generated.
- The last 10 turns of the conversation (Prompts and Responses) are stored in **Catalyst Cache**.
- **Why Cache?** Passing the chat history to the LLM on every turn requires retrieving it quickly. Querying the relational database for every single chat message adds unacceptable latency.

### 3.2. Long-Term Memory (Catalyst Data Store)
- Asynchronously, a background Catalyst Function writes the chat messages to the `Chat_Messages` table in the **Catalyst Data Store**.
- This serves as the permanent, immutable audit trail required for legal compliance.

## 4. Streaming Responses

Law enforcement officers expect instant feedback. Waiting 10 seconds for a large AI response is terrible UX.

- **Implementation:** The Catalyst Function must implement HTTP Server-Sent Events (SSE) or WebSockets.
- **Flow:**
  1. The LLM API begins streaming tokens to the Catalyst Function.
  2. The Catalyst Function immediately forwards these tokens to the Next.js frontend.
  3. The UI renders the text typewriter-style, providing a perceived latency (TTFB) of < 1.5 seconds.

## 5. Handling Ambiguity and Failure

The AI must be trained to fail gracefully and ask clarifying questions rather than guessing.

- **Ambiguous Query:** 
  *User:* "Tell me about the robbery." 
  *CrimeGPT:* "I found 45 recent robbery cases. Could you specify the jurisdiction, date, or the name of a suspect?"
- **Data Not Found:**
  *User:* "Did Suspect X commit the murder?"
  *CrimeGPT:* "Based on the records available to me, Suspect X is accused of extortion, but there are no FIRs linking them to a murder. (Source: FIR 88/2021)."

---
**Next Steps:** Review the [Knowledge Graph](./KnowledgeGraph.md) document to see how CrimeGPT answers questions about complex criminal networks.
