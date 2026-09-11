#!/usr/bin/env bash
# Idempotent repository bootstrap for the Groundwork Cloud Agent environment.
# Installs PostgreSQL (if missing) and all frontend/backend dependencies.
set -euo pipefail

cd "$(dirname "$0")/.."

# --- System package: PostgreSQL (only if not already present) ---
if ! command -v psql >/dev/null 2>&1; then
  echo "[install] Installing PostgreSQL..."
  export DEBIAN_FRONTEND=noninteractive
  sudo apt-get update -y
  sudo apt-get install -y postgresql postgresql-contrib
else
  echo "[install] PostgreSQL already installed, skipping."
fi

# --- Frontend dependencies ---
echo "[install] Installing frontend dependencies..."
npm --prefix frontend ci

# --- Backend dependencies (pre-fetch for faster, offline-friendly builds) ---
echo "[install] Resolving backend dependencies..."
(cd backend && ./mvnw -B -q dependency:go-offline)

echo "[install] Done."
