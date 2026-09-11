# groundwork

A full-stack TypeScript starter: an Express + TypeScript REST API and a Vite +
React + TypeScript UI, wired together with npm workspaces.

## Layout

| Path      | Description                                            |
| --------- | ------------------------------------------------------ |
| `server/` | Express REST API (`/api/tasks`, `/api/health`)         |
| `client/` | Vite + React UI that talks to the API through `/api`   |

## Prerequisites

- Node.js `>=20` (Node 22 recommended)
- npm `>=10`

## Getting started

```bash
npm ci        # install all workspace dependencies
npm run dev   # start the API (:4000) and the web app (:5173) together
```

Then open http://localhost:5173. The Vite dev server proxies `/api` to the
API on port `4000`, so the two run side by side with no extra config.

## Common commands

| Command             | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Run the API and web dev servers concurrently      |
| `npm run dev:api`   | Run only the API dev server (watch mode)          |
| `npm run dev:web`   | Run only the web dev server                       |
| `npm run build`     | Type-check + build the server and client          |
| `npm run start`     | Run the compiled API from `server/dist`           |
| `npm run lint`      | Lint the whole workspace with ESLint              |
| `npm run typecheck` | Type-check the server and client                  |
| `npm test`          | Run the server test suite (Vitest + Supertest)    |

## API

| Method   | Route             | Description               |
| -------- | ----------------- | ------------------------- |
| `GET`    | `/api/health`     | Liveness check            |
| `GET`    | `/api/tasks`      | List tasks                |
| `POST`   | `/api/tasks`      | Create a task             |
| `PATCH`  | `/api/tasks/:id`  | Update a task title/state |
| `DELETE` | `/api/tasks/:id`  | Delete a task             |

Tasks are held in memory to keep the starter dependency-free; swap
`server/src/tasks.ts` for a real database when you need persistence.

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm ci` and launches the
`api` and `web` dev servers as persistent terminals, exposing ports `4000` and
`5173`.
