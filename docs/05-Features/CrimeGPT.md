# Feature: CrimeGPT Chat Interface

## 1. Purpose
The **CrimeGPT Chat Interface** is the primary interaction point for the platform. It provides a natural language, chat-based UI that allows officers to query the entire intelligence database without writing SQL or navigating complex forms.

## 2. Target Users
- Investigating Officers (IOs)
- Station House Officers (SHOs)
- SCRB Analysts

## 3. User Journey
1. The officer navigates to the "CrimeGPT" tab in the Next.js application.
2. They select a conversation context (e.g., "Global Search" or "Specific Case Context").
3. They type a natural language query (e.g., "Summarize the witness statements for FIR 102").
4. The UI displays a loading indicator while the **Catalyst Functions** process the RAG pipeline.
5. The AI response streams into the UI in real-time, complete with clickable citation badges.
6. The officer clicks a citation badge to view the original source PDF in a side panel.

## 4. Technical Workflow

### 4.1. Frontend Component (`CrimeGPTInterface`)
- Built using React.
- Manages the local `messages` state array.
- Uses Server-Sent Events (SSE) or a streaming fetch API to receive the chunked text response from the backend.
- Implements a custom Markdown renderer to parse citation tags (e.g., `[FIR_123]`) into interactive buttons.

### 4.2. Backend (Zoho Catalyst)
- **Catalyst API Gateway:** Routes the POST request to the `crimegpt-chat-service`.
- **Catalyst Function:** Validates the JWT, retrieves chat history from **Catalyst Cache**, runs the Hybrid Search against the Vector DB, calls the LLM, and streams the response back.
- **Catalyst Data Store:** Asynchronously logs the query for auditing.

## 5. Edge Cases and Handling
- **Empty Query:** UI disables the submit button.
- **LLM Timeout:** If the LLM provider fails, the Catalyst Function catches the timeout and returns a graceful error to the UI: *"The AI intelligence service is currently unavailable. Please try again in a few moments."*
- **No Data Found:** If the Vector DB returns no relevant chunks, the LLM must output the system-defined failure message ("Information not found"). The UI should detect this and suggest alternative search terms to the user.

## 6. Security and Permissions
- The chat interface is only accessible to authenticated users.
- The data returned by CrimeGPT is strictly limited by the user's Role-Based Access Control (RBAC) settings enforced during the Vector DB retrieval step. An officer cannot ask CrimeGPT about a highly classified internal affairs case unless their Catalyst Auth token explicitly grants that permission.
