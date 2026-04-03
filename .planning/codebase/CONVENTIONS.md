# Codebase Conventions

## Linting & Formatting
- **ESLint:** Frontend uses `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` to enforce React best practices. 

## Best Practices & Patterns
- **React Components:** Follow modern functional component patterns using React hooks (`useState`, `useEffect`, etc.).
- **Async/Await:** Used predominantly across both backend Node.js applications (for Mongoose and API calls) and frontend React applications (for `axios` fetch calls).
- **Styling:** Utility-first class structure driven by TailwindCSS instead of traditional CSS files, with standard class concatenation or standard template literals.
- **Environment config:** Secrets and environment specific configs reside in `.env` and are loaded via `dotenv` (backend) or `VITE_*` (frontend).

## Source Control
- Codebase utilizes Git. Branches/commits standard patterns should be applied.
