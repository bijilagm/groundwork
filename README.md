# Groundwork

Groundwork turns a short business assessment into a clear, prioritized
**opportunity map**. This repository holds the full product:

- **Frontend** — React + TypeScript + Tailwind CSS (Vite), with React Router.
- **Backend** — Java Spring Boot REST API with JWT authentication.
- **Database** — PostgreSQL (Supabase in production; local PostgreSQL for dev).

## Application flow

```
Landing Page → Start Assessment → Login / Sign Up → Tell Me About Your Business → Opportunity Map
```

- `/` — Landing page. **Start Assessment** navigates to the login page.
- `/login` — Login / Sign Up (JWT auth). On success, navigates to the business page.
- `/business` — "Tell Me About Your Business" (protected).
- `/opportunity-map` — Opportunity Map results (protected).

## Layout

| Path        | Description                                             |
| ----------- | ------------------------------------------------------- |
| `frontend/` | React + TS + Tailwind app (Vite, React Router)          |
| `backend/`  | Spring Boot API (`/auth/register`, `/auth/login`, JWT)  |
| `scripts/`  | Cloud Agent environment install/start scripts           |

## Prerequisites

- Node.js `>=20` and npm `>=10`
- Java `21`
- PostgreSQL `>=14` (local) or a Supabase connection string

## Getting started

### 1. Database

Create a local database and role (defaults the backend expects):

```sql
CREATE ROLE groundwork LOGIN PASSWORD 'groundwork';
CREATE DATABASE groundwork OWNER groundwork;
```

### 2. Backend (port 8080)

```bash
cd backend
./mvnw spring-boot:run
```

Configuration is environment-driven (see `backend/src/main/resources/application.yml`):

| Variable              | Default                                              |
| --------------------- | ---------------------------------------------------- |
| `DATABASE_URL`        | `jdbc:postgresql://localhost:5432/groundwork`        |
| `DATABASE_USERNAME`   | `groundwork`                                          |
| `DATABASE_PASSWORD`   | `groundwork`                                          |
| `JWT_SECRET`          | dev-only default (**override in every real env**)     |
| `JWT_EXPIRATION_MS`   | `86400000` (24h)                                     |
| `CORS_ALLOWED_ORIGINS`| `http://localhost:5173`                              |

To use **Supabase**, set `DATABASE_URL`/`DATABASE_USERNAME`/`DATABASE_PASSWORD`
to your Supabase Postgres connection details.

### 3. Frontend (port 5173)

```bash
cd frontend
npm ci
npm run dev
```

The Vite dev server proxies `/auth` and `/api` to the backend on port `8080`,
so no CORS setup is needed in development.

## Auth API

| Method | Route            | Body                                        | Success |
| ------ | ---------------- | ------------------------------------------- | ------- |
| `POST` | `/auth/register` | `firstName, lastName, email, password`      | `201` + `{ token, id, firstName, lastName, email }` |
| `POST` | `/auth/login`    | `email, password`                           | `200` + `{ token, ... }` |

Passwords are hashed with BCrypt; tokens are signed JWTs (HMAC).

### User entity

`id` (UUID), `firstName`, `lastName`, `email` (unique), `password` (hashed),
`createdAt`.

## Common commands

| Location   | Command                     | What it does                     |
| ---------- | --------------------------- | -------------------------------- |
| `backend/` | `./mvnw test`               | Run the backend test suite       |
| `backend/` | `./mvnw spring-boot:run`    | Run the API                      |
| `backend/` | `./mvnw package`            | Build the executable jar         |
| `frontend/`| `npm run dev`               | Run the Vite dev server          |
| `frontend/`| `npm run build`             | Type-check + production build     |
| `frontend/`| `npm run lint`              | Lint the frontend                |

## Connecting a hosted landing page (e.g. Figma Sites)

A published marketing page (Figma Sites, Framer, Webflow, etc.) is a **separate
static site**. It can't run this React app or the Spring Boot backend and can't
share a login session with them — the only integration point is a **link**.

To hand off from the landing page to this app:

1. **Deploy the three pieces** so they're reachable on the public internet
   (localhost won't work for real visitors):
   - Frontend (`frontend/`, `npm run build`) → any static host (Vercel,
     Netlify, Cloudflare Pages). Set `VITE_API_BASE_URL` to the backend URL at
     build time.
   - Backend (`backend/`, `./mvnw package` → runnable jar) → a JVM host
     (Render, Railway, Fly.io, etc.). Set `JWT_SECRET`, the `DATABASE_*`
     variables (your Supabase connection), and `CORS_ALLOWED_ORIGINS` to the
     deployed **frontend** origin.
   - Database → Supabase (managed PostgreSQL).
2. **Point the landing page's "Sign in" / "Sign up" / CTA button** at the
   deployed frontend's login route, e.g. `https://app.yourdomain.com/login`
   (in Figma Sites: select the element → set its link/interaction to *Open
   link* → your URL). After a successful login the app routes the user to
   `/business` automatically.

`VITE_API_BASE_URL` is what lets the statically-hosted frontend call the
deployed backend directly (it defaults to empty for local dev, which uses the
Vite proxy instead). See `frontend/.env.example`.

## Deployment (Vercel + Render + Supabase)

Deploy order: **Supabase → Render (backend) → Vercel (frontend) → link the landing page.**

### 1. Supabase (database)
1. Create a project at [supabase.com](https://supabase.com).
2. Open **Project Settings → Database → Connection string** and use the
   **Session pooler** (port `5432`) — it's IPv4 and works well with a
   long-running JVM server. You'll get values like:
   - Host: `aws-0-<region>.pooler.supabase.com`
   - Port: `5432`
   - User: `postgres.<project-ref>`
   - Password: your database password
3. The backend needs these as:
   - `DATABASE_URL` = `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require`
   - `DATABASE_USERNAME` = `postgres.<project-ref>`
   - `DATABASE_PASSWORD` = your database password

   Tables are created automatically on first boot (`ddl-auto=update`).

### 2. Render (backend)
This repo ships a [`render.yaml`](./render.yaml) Blueprint and a
[`backend/Dockerfile`](./backend/Dockerfile).
1. Render Dashboard → **New → Blueprint** → connect this repo.
2. Render builds `backend/Dockerfile`. `JWT_SECRET` is auto-generated; set the
   rest in the dashboard:
   - `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` (from Supabase)
   - `CORS_ALLOWED_ORIGINS` = your Vercel URL (e.g. `https://groundwork.vercel.app`)
3. Render injects `PORT` automatically (the app already binds to it). Health
   check: `/actuator/health`. Note the service URL, e.g.
   `https://groundwork-backend.onrender.com`.

### 3. Vercel (frontend)
This repo ships [`frontend/vercel.json`](./frontend/vercel.json) (Vite + SPA
rewrites so `/login`, `/business`, etc. work on refresh).
1. Vercel → **New Project** → import this repo.
2. Set **Root Directory** = `frontend`.
3. Add env var `VITE_API_BASE_URL` = your Render URL
   (e.g. `https://groundwork-backend.onrender.com`).
4. Deploy. Note the URL, e.g. `https://groundwork.vercel.app`, and make sure it
   matches `CORS_ALLOWED_ORIGINS` on Render.

### 4. Link the landing page
In your Figma Sites (or other) landing page, set the **Sign in / Sign up / CTA**
button's link to `https://groundwork.vercel.app/login`. After login the app
routes users to `/business`.

## Cloud Agent environment

`.cursor/environment.json` installs PostgreSQL + dependencies
(`scripts/cloud-install.sh`), ensures PostgreSQL and the `groundwork` database
are ready on each boot (`scripts/cloud-start.sh`), and runs the `backend`
(:8080) and `frontend` (:5173) dev servers as persistent terminals.
