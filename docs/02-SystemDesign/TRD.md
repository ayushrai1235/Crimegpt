# Technical Requirements Document (TRD)

## 1. Overview
This document specifies the non-functional requirements and performance optimization strategies for the CrimeGPT MVP.

## 2. Purpose
To ensure the platform remains highly responsive, scalable, and stable during demonstration and eventual production use.

## 3. Functional Requirements
Not applicable (this document covers non-functional requirements).

## 4. Technical Design (Performance Strategies)
- **Catalyst Cache**: Frequently accessed analytics (e.g., district-wide crime stats) are cached in Zoho Catalyst Cache to ensure sub-100ms dashboard load times.
- **Lazy Loading**: Heavy components like the Vis.js network graph and Mapbox visualizations are dynamically imported in Next.js to reduce initial bundle size.
- **Background Processing**: PDF OCR and entity extraction run asynchronously via Catalyst Event Functions to prevent blocking the UI.
- **Streaming AI Responses**: AI Chat utilizes Server-Sent Events (SSE) or chunked transfer encoding to stream tokens to the frontend instantly, reducing perceived latency.
- **Pagination & Virtualization**: Evidence lists and FIR tables use cursor-based pagination on the backend and virtualized lists (e.g., `react-window`) on the frontend to handle thousands of records smoothly.
- **Optimistic Updates**: UI elements (like adding notes) update instantly before the backend confirms the write.

## 5. Data Flow
Refer to DataFlow.md for detailed system flows.

## 6. Edge Cases
- **Slow LLM Inference**: Handled via streaming and progressive loading indicators.
- **Large Graphs**: Neo4j queries enforce a `LIMIT 150` on nodes to prevent the browser rendering engine from crashing during visualization.

## 7. Future Enhancements
- Global CDN integration for static assets.
- Advanced load balancing and auto-scaling rules based on CPU metrics.
