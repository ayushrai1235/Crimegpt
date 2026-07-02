# Coding Standards

## Overview
The **Coding Standards** document defines the style, syntax, and formatting rules for the **CrimeGPT** codebase. Strict adherence ensures maintainability, reduces bugs, and allows multiple developers (and AI coding assistants) to collaborate seamlessly across the Next.js frontend and Catalyst backend.

---

## 1. General Principles
- **Readability over Cleverness:** Code should be easily understood by a new developer. Avoid overly complex one-liners if a 3-line block is clearer.
- **Fail Fast:** Validate inputs at the boundary. Do not let bad data propagate deep into the application logic.
- **No Magic Numbers:** Define all constants at the top of the file or in a dedicated `constants.ts` file.

## 2. Frontend (Next.js / React / TypeScript)

### 2.1. TypeScript Rules
- **Strict Mode:** `tsconfig.json` must have `"strict": true`.
- **No `any`:** The use of `any` is strictly prohibited. Use `unknown` if the type is truly dynamic, and use type guards to narrow it down.
- **Interfaces over Types:** Prefer `interface` for object shapes. Use `type` for unions and primitives.

```typescript
// Good
interface FIRMetadata {
  id: string;
  status: "OPEN" | "CLOSED";
}

// Bad
let data: any; 
```

### 2.2. React Best Practices
- **Functional Components:** All components must be functional components using Hooks. No Class components.
- **Destructuring:** Destructure props in the function signature.
- **State Management:** Keep local state as close to where it is used as possible. Use React Context only for truly global state (e.g., Theme, Auth).

### 2.3. CSS and Styling
- **Tailwind CSS:** Use Tailwind for all styling. Avoid custom CSS files unless implementing complex keyframe animations.
- **Component Consistency:** Extract repeated Tailwind strings into reusable React components (e.g., `<PrimaryButton>`) rather than repeating `bg-blue-600 hover:bg-blue-700...` everywhere.

## 3. Backend (Catalyst Functions - Node.js)

### 3.1. Structure
- Every Advanced I/O function must follow the standard Express.js style routing provided by Catalyst.
- **Controller-Service Pattern:** Route handlers (Controllers) should only parse requests and return responses. All business logic must live in separate Service files.

### 3.2. Asynchronous Code
- **Promises:** Use `async/await` exclusively. Do not use `.then().catch()` chains or traditional callbacks.
- **Parallel Execution:** Use `Promise.all()` when making multiple independent API calls (e.g., fetching from Neo4j and the Vector DB simultaneously).

```javascript
// Good
const [graphData, vectorData] = await Promise.all([
  fetchGraph(suspectId),
  fetchVectors(query)
]);
```

## 4. Naming Conventions
- **Variables/Functions:** `camelCase` (e.g., `fetchCaseDetails`).
- **React Components / Interfaces:** `PascalCase` (e.g., `CrimeGPTInterface`, `UserProfile`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS = 3`).
- **Files/Directories:** `kebab-case` for utility files (e.g., `date-formatter.ts`).

## 5. Tooling Enforcement
- **Prettier:** Code formatting is automatically enforced via Prettier on pre-commit hooks.
- **ESLint:** Code quality rules are enforced via ESLint. Commits that fail linting will be rejected by the CI pipeline.
