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

## Cloud Agent environment

`.cursor/environment.json` installs PostgreSQL + dependencies
(`scripts/cloud-install.sh`), ensures PostgreSQL and the `groundwork` database
are ready on each boot (`scripts/cloud-start.sh`), and runs the `backend`
(:8080) and `frontend` (:5173) dev servers as persistent terminals.
