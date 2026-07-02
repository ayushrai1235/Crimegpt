# Frontend Routing Architecture

## Overview
The **Routing Architecture** document details how navigation is structured within the Next.js frontend for the **CrimeGPT** platform. We utilize the modern **Next.js 14 App Router** to enable advanced features like nested layouts, server components, and route protection.

---

## 1. The App Router Structure

The `app` directory dictates the URL paths of the application.

```text
src/
└── app/
    ├── layout.tsx                # Root HTML/Body layout (Providers)
    ├── page.tsx                  # Landing/Marketing page (Optional)
    ├── login/
    │   └── page.tsx              # Authentication Page
    └── (dashboard)/              # Route Group (Protects all nested routes)
        ├── layout.tsx            # Global Sidebar, Navbar for authenticated users
        ├── overview/
        │   └── page.tsx          # Main Analytics Dashboard (/overview)
        ├── chat/
        │   └── page.tsx          # Main CrimeGPT Interface (/chat)
        ├── cases/
        │   ├── page.tsx          # FIR List View (/cases)
        │   └── [id]/
        │       └── page.tsx      # Dynamic Investigation Workspace (/cases/102-2023)
        ├── network/
        │   └── page.tsx          # Criminal Network Visualizer (/network)
        └── admin/
            └── page.tsx          # Admin Console (/admin)
```

## 2. Route Protection (Middleware)

Because this is a law enforcement application, unauthorized access to *any* dashboard route is a critical security failure.

### 2.1. Next.js Middleware (`middleware.ts`)
We implement a `middleware.ts` file at the root of the project to intercept every navigation request before the page even renders.

**Logic Flow:**
1. User attempts to navigate to `/cases/123`.
2. Middleware checks for the presence of the **Catalyst Auth JWT** in the HTTP cookies.
3. If missing, the middleware immediately issues an HTTP 302 Redirect, sending the user to `/login`.
4. If present, the user proceeds to the requested route.

*Note:* Deep RBAC validation (e.g., "Is this specific user allowed to view this specific FIR?") is handled by the backend **Catalyst Functions**, not just the frontend middleware, ensuring zero-trust security.

## 3. Rendering Strategies

Next.js allows us to choose how pages are rendered to optimize performance.

### 3.1. Client Components (`"use client"`)
- Any page requiring high interactivity (e.g., the CrimeGPT chat window requiring WebSockets/SSE, or the Network Graph requiring drag-and-drop physics) must be a Client Component.

### 3.2. Server Components (Default)
- Static, data-heavy pages (e.g., a simple read-only view of a historical FIR document) should remain as Server Components to reduce the JavaScript bundle size shipped to the officer's browser, ensuring fast load times even on poor 3G/4G connections in the field.
