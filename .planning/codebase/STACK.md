# Codebase Tech Stack

## Languages
- JavaScript (Node.js backend, React frontend)

## Runtime & Frameworks
- **Backend:** Node.js, Express.js
- **Frontend:** React 19, Vite (Bundler)

## Key Dependencies
- **Database:** MongoDB via `mongoose`
- **State Management / Data Fetching:** `axios` (REST API), context API likely used locally (React)
- **Routing:** `react-router-dom`
- **Real-time:** `socket.io` (backend) & `socket.io-client` (frontend)
- **Authentication:** `jsonwebtoken` (JWT), `bcryptjs`
- **Mapping:** `leaflet`, `react-leaflet`

## Styling
- **CSS Framework:** TailwindCSS (`tailwindcss`, `postcss`, `autoprefixer`)
- **Icons:** `lucide-react`

## Configuration
- `package.json` at root, and in `backend/` and `frontend/`
- `.env` environment variable setup via `dotenv`
- `eslint` for linting
