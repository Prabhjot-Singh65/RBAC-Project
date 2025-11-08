# RBAC MERN Backend (Starter)

Features:
- JWT auth (login/register/me)
- Roles: admin, editor, viewer
- Permission matrix + enforcement middleware
- Posts CRUD with ownership checks (editor can modify own; admin can modify all)
- Pagination on list endpoints
- Admin endpoints to manage user roles
- Security: helmet, hpp, rate limiting, CORS
- Seed script to create demo users & posts
- Docker Compose for Mongo + API

## Quickstart (Local)

```bash
cp .env.example .env
# (optional) adjust values
npm install
npm run dev
# in another tab
npm run seed
```

API: http://localhost:4000

Auth creds after seed:
- admin@example.com / Admin@123
- editor@example.com / Editor@123
- viewer@example.com / Viewer@123

## With Docker Compose

```bash
docker compose up --build
# in another terminal
docker compose exec api npm run seed
```

## Endpoints (v1)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET  /api/v1/auth/me`

- `GET  /api/v1/posts` (anon allowed; returns published, or with token returns according to role)
- `GET  /api/v1/posts/:id`
- `POST /api/v1/posts` (editor/admin)
- `PATCH /api/v1/posts/:id` (editor on own, admin on any)
- `DELETE /api/v1/posts/:id` (admin or owner if editor? -> by matrix only admin)

- `GET  /api/v1/admin/users` (admin)
- `PATCH /api/v1/admin/users/:userId/role` (admin)

## Notes

- Editors can create and update *their* posts. Delete restricted to admin by default.
- Viewers can read published posts only.
- Ownership checks are enforced in controllers with role-aware filters.
