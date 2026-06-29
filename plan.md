# Telemedic Microservices & MVC Refactoring Plan

Refactor the existing monolithic frontend prototype into a separated Frontend (React) and Backend (Node.js/Express) structure using MVC architecture and a microservices-inspired approach.

## Scope & Non-Goals
### Scope
- **Backend Separation**: Extract mock API logic into a standalone Node.js/Express/TypeScript backend.
- **MVC Architecture**: Implement Models, Views (API responses), and Controllers on the backend.
- **Microservice Structure**: Separate concerns into distinct service modules (Auth, Facility, Booking, Messaging).
- **Communication**: Update the React frontend to communicate with the Node.js backend via HTTP.
- **Persistence**: Continue using file-based or in-memory persistence for now (as per prior constraints), but structured for a real DB.

### Non-Goals
- Real Kubernetes/Docker orchestration (simulation via directory/service separation).
- Changing existing UI functionality (focus is architectural refactoring).

## Affected Areas
- `src/services/mockApi.ts`: To be replaced by actual API calls.
- New `server/` directory: Containing the Express application.
- `package.json`: Updated dependencies for the backend.

## Auth & RLS model
**Auth in scope:** yes
**Model:** supabase_auth (simulated via JWT in Express)
**RLS strategy:** Backend-level middleware validation for JWT.
**Frontend implication:** Authorization headers in all requests.

## Migration baseline
**Local migrations in project:** none
**User confirmed proceed on connected DB:** yes

## Implementation Phases

### Phase 1: Backend Setup (supabase_engineer)
- Create `server/` directory.
- Initialize Node.js Express project with TypeScript.
- Setup MVC directory structure: `controllers/`, `models/`, `routes/`, `services/`, `middleware/`.
- Configure CORS, JWT, and Rate Limiting on the server.
- **Deliverable**: A running Express server on port 5000.

### Phase 2: Backend Logic Implementation (supabase_engineer)
- **Auth Service**: Implement registration, login, and JWT generation.
- **Facility Service**: Implement discovery and search logic.
- **Booking Service**: Implement appointment management.
- **Messaging Service**: Implement chat persistence and retrieval.
- **Deliverable**: Fully functional REST API for all app features.

### Phase 3: Frontend Refactoring (frontend_engineer)
- Update `src/services/api.ts` to use `fetch` or `axios` targeting the local server.
- Update `AuthContext` to handle real tokens.
- Add environment variable support for API URLs.
- **Deliverable**: Frontend successfully communicating with the new backend.

### Phase 4: Integration & Validation (quick_fix_engineer)
- Ensure concurrent execution of Frontend and Backend.
- Final testing of end-to-end flows.
- **Deliverable**: Unified application experience with split architecture.

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. supabase_engineer — Build the MVC Backend services.
2. frontend_engineer — Connect the existing UI to the new Backend.
3. quick_fix_engineer — Validate the full integration and scripts.

**Per-agent instructions:**

### 1. supabase_engineer
- **Phases:** 1, 2
- **Scope:** Create a Node.js/Express backend in a `server/` folder. Use TypeScript. Implement MVC.
- **Controllers**: `authController.ts`, `facilityController.ts`, `bookingController.ts`, `messageController.ts`.
- **Routes**: Define endpoints for `/api/auth`, `/api/facilities`, etc.
- **Middleware**: Implement `authMiddleware.ts` to verify JWT.
- **Acceptance criteria:** API documentation or successful local testing of all endpoints.

### 2. frontend_engineer
- **Phases:** 3
- **Scope:** Refactor `src/services/mockApi.ts` into a real API client. Use `fetch`.
- **Files:** `src/services/api.ts`, `src/contexts/AuthContext.tsx`.
- **Acceptance criteria:** All UI features (login, search, book, chat) work using the new backend.

### 3. quick_fix_engineer
- **Phases:** 4
- **Scope:** Update `package.json` to include a `dev:all` script using `concurrently` to run both Vite and the Express server.
- **Acceptance criteria:** Running `npm run dev:all` starts both layers.
