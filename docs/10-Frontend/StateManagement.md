# Frontend State Management

## Overview
The **State Management** document details how data is managed within the Next.js frontend of the **CrimeGPT** platform. Because the application handles complex, dynamic data (e.g., real-time streaming chat, interactive network graphs), a robust state management strategy is crucial to prevent unnecessary re-renders and maintain a responsive UI.

---

## 1. Global State (React Context)

Global state is used *only* for data that needs to be accessed by components across the entire component tree, deeply nested or otherwise.

### 1.1. Auth Context (`AuthContext.tsx`)
- **Purpose:** Stores the current user's profile and authentication status.
- **Data Held:** `user_id`, `role`, `station_id`, `jwt_token`, `isAuthenticated`.
- **Usage:** Used by the Layout component to determine which sidebar links to display (e.g., hiding the Admin link from standard IOs) and used by the API utility to attach the Bearer token to outgoing requests.

### 1.2. Theme Context
- **Purpose:** Handles Dark/Light mode toggles, which is highly requested by officers working night shifts.

## 2. Server State (Data Fetching & Caching)

The frontend should not manually manage loading states and caching for standard API requests (like fetching the list of FIRs).

### 2.1. Library Choice: React Query (or SWR)
- We use **TanStack Query (React Query)** to handle all `GET` requests to the **Catalyst Functions**.
- **Benefits:**
  - Automatically caches the results.
  - Automatically handles `isLoading` and `isError` boolean flags.
  - Automatically deduplicates multiple requests for the same data on the same page.
  - Provides easy cache invalidation when a mutation occurs.

*Example:*
```tsx
const { data: cases, isLoading } = useQuery({
  queryKey: ['cases', stationId],
  queryFn: () => fetchCases(stationId)
});
```

## 3. Local Component State (`useState` & `useReducer`)

Local state is used for UI elements that do not affect the rest of the application.

- **`useState`:** Used for simple toggles (e.g., `isModalOpen`, `searchInputValue`).
- **`useReducer`:** Used for complex, interconnected state logic. For example, managing the state of the CrimeGPT chat window, where handling streaming text chunks, managing citations, and updating the message array requires complex state transitions that would be messy with multiple `useState` hooks.

## 4. Complex Visualization State (Zustand)

For highly complex, specialized components—specifically the **Criminal Network Graph**—React Context and `useState` often trigger too many re-renders, causing the physics simulation to stutter.

- **Library Choice:** A lightweight, unopinionated state manager like **Zustand** is recommended *strictly* for the Graph Visualization module to handle node positions, selection states, and edge highlights outside the standard React rendering cycle to ensure 60fps performance.
