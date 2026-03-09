# EverStays - User, Admin & Single Backend

Each app is **self-contained** with its own `package.json`, `node_modules`, and config. No shared root dependencies.

## Structure

```
apps/
├── user/             # User app (travelers) - port 5173
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── node_modules/
├── admin/            # Admin app (property owners) - port 5174
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── node_modules/
└── backend/          # Unified API for both apps - port 3000
    ├── src/
    ├── package.json
    ├── .env
    └── node_modules/
```

## Quick Start

1. **Install** (run in each app):
   ```bash
   cd apps/user && npm install
   cd apps/admin && npm install
   cd apps/backend && npm install
   ```

2. **Backend** (single API for both apps; CORS allows user and admin at the same time):
   ```bash
   cd apps/backend && cp .env.example .env   # if needed
   cd apps/backend && npm run start:dev
   # API at http://localhost:3000
   ```

3. **User App** (can run together with Admin):
   ```bash
   cd apps/user && npm run dev
   ```
   `http://localhost:5173` → uses backend (3000)

4. **Admin App** (can run together with User; both use the same backend):
   ```bash
   cd apps/admin && npm run dev
   ```
   `http://localhost:5174` → uses backend (3000)

You can run the User and Admin apps at the same time; the backend accepts requests from both.

## Port Summary

| App      | Port | Purpose                 |
|----------|------|-------------------------|
| backend  | 3000 | Unified API (user + admin) |
| user     | 5173 | Traveler frontend       |
| admin    | 5174 | Host dashboard          |

## Build

```bash
cd apps/user    && npm run build
cd apps/admin   && npm run build
cd apps/backend && npm run build
```

## Hot Reload

Frontend (Vite) and backend (NestJS `--watch`) support hot reload by default. If changes don't appear:

1. **Restart the dev server** – Kill and re-run the affected app.
2. **Increase file limit (macOS)** – Running multiple dev servers can exhaust file watchers. Before starting:
   ```bash
   ulimit -n 10240
   ```
3. **Hard refresh the browser** – `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows).
