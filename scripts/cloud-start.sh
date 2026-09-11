#!/usr/bin/env bash
# Per-boot reconciliation: ensure PostgreSQL is running and the groundwork
# database/role exist. Idempotent and safe to run on every start.
set -euo pipefail

PG_VER="$(ls /usr/lib/postgresql/ 2>/dev/null | sort -n | tail -1)"
if [ -n "${PG_VER}" ]; then
  sudo pg_ctlcluster "${PG_VER}" main start 2>/dev/null || sudo service postgresql start || true
fi

# Wait until PostgreSQL accepts connections.
for _ in $(seq 1 30); do
  if sudo -u postgres pg_isready >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

# Create the application role and database if they do not exist yet.
sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='groundwork'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE ROLE groundwork LOGIN PASSWORD 'groundwork';"
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='groundwork'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE groundwork OWNER groundwork;"

echo "[start] PostgreSQL is ready; 'groundwork' database available."
