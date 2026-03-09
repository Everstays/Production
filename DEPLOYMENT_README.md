# Production Deployment Guide

## Quick Start

### Deploy Everything
```bash
./deploy.sh all
```

### Deploy with Database Initialization
```bash
./deploy.sh all --init-db
```

### Deploy Only Backend
```bash
./deploy.sh backend
```

### Quick Restart (Skip Build)
```bash
./deploy.sh backend --skip-build
```

## What the Script Does

### Backend Deployment
1. ✅ Validates `.env` file exists
2. ✅ Creates logs directory
3. ✅ Installs production dependencies
4. ✅ Builds TypeScript to JavaScript
5. ✅ Optionally initializes database schema (`--init-db`)
6. ✅ Starts/restarts PM2 process
7. ✅ Saves PM2 configuration

### Frontend Deployment (User & Admin)
1. ✅ Installs dependencies
2. ✅ Builds production bundles
3. ✅ Verifies `dist` directory exists
4. ✅ Ready for Nginx to serve

## Prerequisites

### 1. Environment Files

**Backend** (`backend/.env`):
```env
# Database (Required)
DB_HOST=your-database-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name
DB_SSL=true

# JWT (Required)
JWT_SECRET=your-very-strong-secret-key

# Server (Required)
PORT=3000
NODE_ENV=production

# CORS (Required)
FRONTEND_URL=https://everstays.in,https://admin.everstays.in
```

**User Frontend** (`user/.env` - Optional):
```env
VITE_API_BASE_URL=https://api.everstays.in
```

**Admin Frontend** (`admin/.env` - Optional):
```env
VITE_API_BASE_URL=https://api.everstays.in
VITE_USER_APP_URL=https://everstays.in
```

### 2. PM2 Installed
```bash
npm install -g pm2
```

### 3. Nginx Configured
- User frontend: `everstays.in` → `user/dist`
- Admin frontend: `admin.everstays.in` → `admin/dist`
- API: `api.everstays.in` → `localhost:3000`

## Common Deployment Scenarios

### First Time Deployment
```bash
# 1. Initialize database
./deploy.sh backend --init-db

# 2. Deploy everything
./deploy.sh all
```

### Regular Updates
```bash
# Deploy all changes
./deploy.sh all
```

### Backend Only Update
```bash
./deploy.sh backend
```

### Quick Restart (No Rebuild)
```bash
./deploy.sh backend --skip-build
```

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
pm2 logs everstays-backend

# Check if .env file exists
ls -la backend/.env

# Verify database connection
cd backend
npm run init:db
```

### Frontend Build Fails
```bash
# Check Node version (should be 18+)
node --version

# Clear cache and rebuild
cd user  # or admin
rm -rf node_modules dist
npm install
npm run build
```

### Database Connection Issues
1. Verify `.env` has correct credentials
2. Check database is accessible
3. For cloud databases, ensure SSL is enabled
4. Run: `./deploy.sh backend --init-db`

## Post-Deployment Checklist

- [ ] Backend is running: `pm2 list`
- [ ] Backend logs are clean: `pm2 logs everstays-backend`
- [ ] API is accessible: `curl https://api.everstays.in/health`
- [ ] User frontend loads: `https://everstays.in`
- [ ] Admin frontend loads: `https://admin.everstays.in`
- [ ] Database tables exist: Check with database client

## Maintenance Commands

```bash
# View all PM2 processes
pm2 list

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart all
pm2 restart all

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
```
