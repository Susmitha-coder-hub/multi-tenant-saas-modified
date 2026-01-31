# Multi-Tenant SaaS Platform

## Status
- **Backend**: Fully implemented with Auth, Tenant, User, Project, Task modules.
- **Frontend**: Fully implemented with React, React Router, and Axios.
- **Docker**: Configured with `docker-compose.yml` for DB, Backend, Frontend.
- **Database**: Automatic seeding implemented.

## Prerequisities
- Docker & Docker Compose

## Setup & Run
1. Clone repository.
2. Run `docker-compose up -d --build`.
3. Check status: `docker-compose ps`.
4. Access Frontend: `http://localhost:3000`.
5. Access Backend: `http://localhost:5000`.

## Testing Credentials (Seed Data)
- **Super Admin**: `superadmin@system.com` / `Admin@123`
- **Demo Admin**: `admin@demo.com` / `Demo@123`
- **Demo User**: `user1@demo.com` / `User@123`

## Architecture
- **Tech Stack**: Node.js, Express, PostgreSQL, React.
- **Multi-Tenancy**: Data isolation via `tenant_id` column.
- **Auth**: JWT with role-based access control.

## API Documentation
See `docs/API.md`.
