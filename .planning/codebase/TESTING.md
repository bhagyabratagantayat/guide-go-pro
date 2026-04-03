# Codebase Testing

## Current Testing Setup
- **No Automated Testing Configured:** The project currently does not have a formal unit/integration testing framework setup (like Jest or Vitest).
  - The backend `package.json` includes a placeholder `test: "echo \"Error: no test specified\" && exit 1"`.
  - The frontend `package.json` lacks testing scripts.
- **Test Routes:** There are few isolated backend files (`testRoutes.js`) likely used for manual Postman/browser sanity checking during development.

## Testing Strategy Moving Forward
- *Needs to be established.*
- Consider adding `Vitest` and `React Testing Library` for the frontend.
- Consider adding `Jest` and `Supertest` for backend route/controller unit testing.
