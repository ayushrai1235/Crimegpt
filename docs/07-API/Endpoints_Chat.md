# API Endpoints: Conversational AI (CrimeGPT)

## Overview
This document details the REST API endpoints provided by the `crimegpt-chat-service` **Catalyst Function**. These endpoints power the core natural language interface of the platform.

---

## 1. Create a New Chat Session

### `POST /api/v1/chat/sessions`
Initializes a new conversation thread and allocates memory space in Catalyst Cache.

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "context": "GLOBAL", 
  // OR 
  "context": "FIR_SPECIFIC",
  "fir_id": "102-2023" // Required if context is FIR_SPECIFIC
}
```
- **Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "session_id": "sess_88a9b2",
    "created_at": "2024-10-27T10:00:00Z"
  }
}
```

## 2. Send a Message (Streamed Response)

### `POST /api/v1/chat/sessions/:session_id/message`
Submits a user prompt to the LLM. 
*Note: Because LLM generation takes several seconds, this endpoint uses Server-Sent Events (SSE) to stream the text back token-by-token.*

- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Accept: text/event-stream`
- **Body:**
```json
{
  "message": "What vehicles are associated with Ravi Kumar?"
}
```
- **Response (200 OK - Streaming):**
```text
data: {"token": "Ravi "}
data: {"token": "Kumar "}
data: {"token": "is "}
data: {"token": "associated "}
...
data: {"citation": "FIR-2021-04"}
data: {"status": "[DONE]"}
```

## 3. Retrieve Chat History

### `GET /api/v1/chat/sessions/:session_id/history`
Fetches the full transcript of a previous conversation from the **Catalyst Data Store**.

- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "role": "user",
      "content": "Who is the primary suspect?",
      "timestamp": "2024-10-27T10:01:00Z"
    },
    {
      "role": "assistant",
      "content": "The primary suspect is Ravi Kumar [FIR-2023-102].",
      "citations": ["FIR-2023-102"],
      "timestamp": "2024-10-27T10:01:05Z"
    }
  ]
}
```

## 4. Provide Feedback on AI Response

### `POST /api/v1/chat/feedback`
Allows officers to flag incorrect or hallucinated answers to improve future prompts.

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "message_id": "msg_9941",
  "rating": "thumbs_down",
  "reason": "Cited wrong FIR number for the suspect."
}
```
- **Response (200 OK):** Returns a standard success wrapper.
