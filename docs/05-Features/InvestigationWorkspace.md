# Investigation Workspace

## 1. Overview
The Investigation Workspace is the primary user interface for CrimeGPT. It consolidates all analytical tools, evidence, and AI interactions into a single, dockable, and highly interactive Next.js dashboard.

## 2. Purpose
To prevent context switching. Instead of toggling between a PDF viewer, a chat window, and a mapping tool, investigators have all tools available in one unified screen.

## 3. Functional Requirements
The Workspace must include the following panels:
- **Evidence Panel**: Displays the original uploaded PDF and extracted metadata.
- **AI Chat Panel**: The conversational interface with the AI Orchestrator.
- **Interactive Crime Map**: A Mapbox instance showing case locations.
- **Criminal Network Graph**: A Vis.js instance showing Neo4j relationships.
- **Similar Cases**: A list of Pinecone matches.
- **Investigation Notes**: A rich text editor for officer scratchpads.
- **Generated Reports**: A panel to download case summaries.

## 4. Technical Design

### UI Architecture
The layout uses a flexible grid system (e.g., CSS Grid or `react-grid-layout`) allowing officers to resize or collapse panels based on their current focus (e.g., expanding the Network Graph to full screen).

### State Management
Next.js uses React Context or Zustand to maintain the "Active Case State". When a user clicks a node in the Network Graph, the context updates, and the AI Chat Panel instantly becomes aware of the newly selected entity.

## 5. Data Flow
Frontend components subscribe to the global state. API calls to Catalyst are made concurrently when the Workspace mounts to fetch Evidence, Graph Data, and Similar Cases simultaneously.

## 6. Edge Cases
- **Mobile Viewing**: The complex grid collapses into an accordion-style single-column layout on mobile devices for field officers.

## 7. Future Enhancements
- Command Palette (Ctrl+K) for rapid navigation across the workspace.
