# Codebase Architecture

## Client-Server Interaction
- **REST APIs:** Client makes HTTP requests to Node/Express backend (`/api/...`).
- **Real-time:** `socket.io` provides a bidirectional data flow for specific live features (likely used for live tracking, chat, or notifications).

## Frontend Architecture
- **Layering:** 
  - `pages/` maps to route endpoints.
  - `components/` are Reusable UI or logical building blocks.
  - `layouts/` frame the global UI.
  - `context/` for global state (e.g., Auth state, Socket connection).
  - `api/` encapsulates Axios requests.
- **Entry point:** `main.jsx` and `App.jsx`.

## Backend Architecture
- **Layering (MVC pattern):**
  - `server.js` serves as the entry point and configures Express, DB connections, and WebSockets.
  - `routes/` bind HTTP paths to controllers.
  - `controllers/` contain request/response business logic.
  - `models/` define Mongoose schemas and DB interactions.
  - `middleware/` handle cross-cutting concerns (authentication, authorization, upload processing).
  - `utils/` contain generic helpers.
- **Entry point:** `server.js`.
