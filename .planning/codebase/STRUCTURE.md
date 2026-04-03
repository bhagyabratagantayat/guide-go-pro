# Codebase Structure

## Root
- `/frontend/` - React SPA client
- `/backend/` - Node.js Express server

## Backend (`/backend/`)
- `server.js`: Main Express and Socket.IO initialization.
- `routes/`: Express router definitions.
- `controllers/`: Route handlers.
- `models/`: Mongoose schemas (e.g., User, Booking, Guide profile).
- `middleware/`: Express middleware functions (e.g., Auth guard, Cloudinary file uploads).
- `config/`: Database and external service configurations.
- `utils/`: Helper utilities (e.g., Nodemailer setups, errors).

## Frontend (`/frontend/`)
- `src/main.jsx`: React rendering root.
- `src/App.jsx`: Main routing file and global contexts provider.
- `src/pages/`: Full screen views / route components.
- `src/components/`: Reusable specific components.
- `src/layouts/`: Navbars, footers, shared layouts.
- `src/context/`: React Context APIs (`AuthContext`, `SocketContext`, etc).
- `src/api/`: Axios interceptors and pre-configured endpoints.
- `src/assets/`: Static visuals.
