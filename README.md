# Dashboard

This dashboard is configured to work with a real REST API using JWT.

## Development

1. Install dependencies

```sh
npm i
```

2. Run dev server

```sh
npm run dev
```

3. Configure environment

Create a `.env` in the project root with:

```
VITE_API_BASE_URL=https://api.example.com
```

## Backend contract

The app expects these endpoints (adjust paths in `src/services/*` if different):

- POST `/auth/login` → `{ token, user }`
- GET `/auth/me` → user object
- POST `/auth/logout` (optional)
- CRUD `/articles`, `/projects`, `/reviews`
- Optional bulk delete: `/articles/bulk-delete`, `/projects/bulk-delete`, `/reviews/bulk-delete`

The JWT is stored in `localStorage` as `auth_token` and sent as `Authorization: Bearer <token>`.

## Where to change things

- `src/services/http.ts`: HTTP wrapper reading `VITE_API_BASE_URL`
- `src/services/auth.ts`: login/me/logout
- `src/services/articles.ts`, `projects.ts`, `reviews.ts`: CRUD services
- `src/hooks/useAuth.tsx`: JWT auth state and actions
- `src/components/ProtectedRoute.tsx`: route guarding
