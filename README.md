# groundwork

A minimal, modern full-stack TypeScript starter that lays the groundwork for new projects.

- **Web** (`web/`) — [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript client.
- **Server** (`server/`) — [Express](https://expressjs.com/) + TypeScript JSON API with an in-memory todo store.

The two packages are managed as npm workspaces. The web dev server proxies `/api/*` to the API server, so the whole app runs from a single `npm run dev`.

## Requirements

- Node.js >= 20 (the repo is developed against Node 22)
- npm 10+

## Getting started

```bash
npm install          # install all workspace dependencies
npm run dev          # start the API (:3001) and web client (:5173) together
```

Then open http://localhost:5173 and add a todo — the client talks to the API through the Vite proxy.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API and web dev servers concurrently |
| `npm run dev:api` | Run only the Express API (`:3001`) |
| `npm run dev:web` | Run only the Vite client (`:5173`) |
| `npm run build` | Type-check and build both packages |
| `npm run lint` | Lint the whole repo with ESLint |
| `npm test` | Run the API test suite (Vitest) |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/todos` | List todos |
| `POST` | `/api/todos` | Create a todo (`{ "title": "..." }`) |
| `PATCH` | `/api/todos/:id` | Toggle a todo's done state |
| `DELETE` | `/api/todos/:id` | Delete a todo |

## Cloud Agent environment

`.cursor/environment.json` configures the Cursor Cloud Agent environment: `npm ci` on install, and two named terminals (`api`, `web`) that run the dev servers. Ports `5173` and `3001` are exposed.
