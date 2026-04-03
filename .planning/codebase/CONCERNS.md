# Codebase Concerns

## Technical Debt & Areas of Concern

- **Lack of Automated Testing:** The project currently lacks automated integration or unit testing. This makes refactoring risky and increases the likelihood of regressions in production.
- **Project Bootstrapping:** The frontend and backend run as completely separate directories with isolated `package.json` scripts. Running the app locally requires spinning up multiple independent terminal sessions. A mono-repo approach (e.g., using `concurrently` at the root) would improve developer experience.
- **Diagnostic Scripts in Root:** The backend directory contains raw diagnostic files (`diagnose_indexes.js`, `probe_db.js`). These shouldn't live in the main production tree and might be better situated in a `scripts/` or `tools/` directory. 
- **Type Safety:** The project uses standard JavaScript rather than TypeScript. As the schema and frontend component props grow in complexity, the lack of TS types could introduce data-shape bugs.
