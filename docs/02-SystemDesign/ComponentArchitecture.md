# Component Architecture

## Overview
The **Component Architecture** document details the structural design of the Next.js frontend for the **CrimeGPT** platform. It defines how UI elements are composed, how state is managed, and how the frontend communicates with the **Zoho Catalyst** backend.

## 1. Frontend Philosophy
- **Component-Driven Design:** The UI is built using isolated, reusable React components following Atomic Design principles.
- **Server-Side Rendering (SSR) & Static Site Generation (SSG):** Next.js is utilized to pre-render pages where possible (e.g., static login pages, help docs) and SSR for dynamic data (e.g., specific case files) to improve perceived load times.
- **Strict Backend Separation:** The frontend contains ZERO business logic related to AI or databases. It is a "dumb" presentation layer that relies entirely on **Catalyst Functions** for data and intelligence.

## 2. Component Hierarchy (Next.js 14 App Router)

The application utilizes the modern Next.js `app` directory structure.

```text
/app
  /login
    page.tsx                 # Login UI (Connects to Catalyst Auth)
  /(dashboard)               # Protected routes (Requires Catalyst JWT)
    layout.tsx               # Sidebar, Header, Global Navigation
    /overview
      page.tsx               # Macro dashboard (Fetches from Catalyst Cache)
    /investigation
      page.tsx               # The main CrimeGPT chat interface
    /network
      page.tsx               # Vis.js graph rendering page
    /cases
      [id]/page.tsx          # Dynamic route for specific FIR details
```

+
## 3. Core UI Components

### 3.1. `CrimeGPTInterface` (The Chat Component)
- **Role:** Handles the conversational UI, displaying user prompts and AI responses.
- **State:** Manages the active `sessionId` and the array of `messages`.
- **Interaction:** Uses React Server Components (or client-side fetching via `fetch` with streaming support) to connect to the `crimegpt-chat-service` Catalyst Function.
- **Special Feature:** Renders custom Markdown components to display clickable citation links returned by the LLM.

### 3.2. `NetworkGraphViewer`
- **Role:** Renders the interactive node-edge graph for criminal networks.
- **Library:** Integrates a charting library like Vis.js or React Flow.
- **Interaction:** Fetches JSON relationship data from the `crimegpt-graph-service` and maps it to nodes (Suspects, Locations) and edges (Arrested_With, Resides_At).

### 3.3. `PredictiveHeatmap`
- **Role:** Renders a geospatial map overlaying crime probability data.
- **Library:** Mapbox GL JS or Leaflet.
- **Interaction:** Fetches pre-computed GeoJSON data originating from the `crimegpt-analytics-cron` job, stored in **Catalyst Cache**.

## 4. State Management

Given the stateless nature of the Catalyst backend, the frontend must manage UI state effectively without bloating the client.

- **Global State (User & Auth):** Managed via React Context (`AuthContext`). Stores the user's role, station ID, and Catalyst JWT token.
- **Server State (Data Fetching):** Managed using React Query (or SWR) to handle caching, background refetching, and pagination when interacting with Catalyst API endpoints.
- **Local State (UI toggles):** Managed via standard React `useState` hooks (e.g., opening a modal, toggling a filter).

## 5. Connecting to Zoho Catalyst

The frontend interacts with Catalyst exclusively via standard HTTP requests to the Catalyst API Gateway.

### API Utility Wrapper
All API calls from the frontend must pass through a centralized utility function (`apiClient.ts`) that automatically attaches the Catalyst Authentication JWT to the `Authorization: Bearer` header.

```typescript
// Example apiClient.ts interceptor concept
export const fetchCatalyst = async (endpoint: string, options: RequestInit) => {
  const token = getCatalystToken(); // Retrieve from Context/LocalStorage
  const response = await fetch(`https://crimegpt-project.catalystserverless.in/server/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 401) handleLogout();
  return response;
}
```

---
**Next Steps:** Review the [Deployment Architecture](./DeploymentArchitecture.md) document to understand how this frontend and the Catalyst backend are deployed to production.
