# RBAC MERN (Mini Project)

A MERN app demonstrating fine-grained Role-Based Access Control (Admin, Editor, Viewer).

## Folders
- `rbac-mern-backend` – Express + MongoDB + JWT + RBAC
- `frontend_rbac_app` – React + React Router (+ Tailwind optional)

## Quick Start

### Backend (Docker)
```bash
cd rbac-mern-backend
docker compose up
# seed demo users:
docker compose exec api npm run seed

### Frontend
cd ../frontend_rbac_app
npm install
npm run dev