# Conversation Memory Management

## Overview
The **Conversation Memory** document details how the **CrimeGPT** system maintains state during a chat session. Because external LLMs and **Catalyst Functions** are inherently stateless, memory must be explicitly managed, stored, and retrieved for the AI to "remember" previous interactions within a single thread.

---

## 1. The Necessity of Memory

In a natural investigation flow, an officer asks follow-up questions:
- *Query 1:* "Who is the primary suspect in FIR 123?" -> *Response:* "Ravi Kumar."
- *Query 2:* "What is his last known address?" -> *Response:* "Based on the records, Ravi Kumar's last known address is..."

Without memory, Query 2 fails because the LLM does not know who "his" refers to.

## 2. Memory Architecture in Catalyst

Memory is divided into Short-Term (for active AI context) and Long-Term (for legal audit and retrieval).

### 2.1. Short-Term Memory (Catalyst Cache)
- **Mechanism:** When a session starts, a unique `session_id` is created. The last `N` messages (typically 5 to 10 turns) are stored in a JSON array within **Catalyst Cache**.
- **Performance:** Retrieving this array takes < 10ms, ensuring that injecting memory into the LLM prompt does not cause user-facing delays.
- **Eviction:** The cache key is set with a 1-hour TTL. If the user stops chatting for an hour, the active context drops out of RAM to save costs.

### 2.2. Long-Term Memory (Catalyst Data Store)
- **Mechanism:** Every single prompt and response is asynchronously written to the `Chat_Messages` table in the relational database.
- **Audit Requirement:** This is a strict legal requirement. If a case goes to court, the exact digital trail of how an investigator arrived at a conclusion via CrimeGPT must be reproducible.

## 3. The Context Window Challenge (Token Limits)

Every message added to the memory increases the size of the prompt sent to the LLM. If an officer talks for 3 hours, the memory will exceed the LLM's context window, or at least become prohibitively expensive.

### 3.1. Dynamic Pruning Strategy
The **Catalyst Function** acting as the AI Orchestrator must actively manage the size of the memory array fetched from the Cache before appending it to the prompt.

1. **Token Counting:** The function uses a lightweight tokenizer (like `tiktoken`) to estimate the prompt size.
2. **Rolling Window:** If the tokens exceed a threshold (e.g., 8,000 tokens), the function drops the oldest user/assistant pairs from the array, keeping only the most recent interactions.
3. **Summarization (Advanced):** If the session is very long, a background Catalyst Function can periodically summarize the older dropped messages (e.g., "The user and AI previously discussed Suspect A's financial history") and inject that single summary string at the top of the memory block, preserving core context without wasting tokens on exact wording.

---
**Next Steps:** This concludes the `04-AI` documentation. Proceed to the `05-Features` directory to see how this AI architecture powers specific end-user tools, starting with [CrimeGPT](./../05-Features/CrimeGPT.md).
