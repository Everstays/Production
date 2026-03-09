# Quick Deployment Commands Reference

## Essential Commands

### 1. Backend Deployment

```bash
cd backend
npm install --production
npm run build
pm2 start dist/main.js --name "everstays-backend"
```

### 2. User Frontend Deployment

```bash
cd user
npm install
npm run build
pm2 serve dist 5173 --name "everstays-user" --spa
```

### 3. Admin Frontend Deployment

```bash
cd admin
npm install
npm run build
pm2 serve dist 5174 --name "everstays-admin" --spa
```

## One-Line Deployment (All Services)

```bash
cd backend && npm install --production && npm run build && pm2 restart everstays-backend || pm2 start dist/main.js --name "everstays-backend" && cd ../user && npm install && npm run build && pm2 serve dist 5173 --name "everstays-user" --spa && cd ../admin && npm install && npm run build && pm2 serve dist 5174 --name "everstays-admin" --spa
```

## PM2 Management

```bash
# View all processes
pm2 list

# View logs
pm2 logs

# Restart all
pm2 restart all

# Stop all
pm2 stop all

# Save and enable auto-start
pm2 save
pm2 startup
```

## Database Migration

```bash
cd backend
npm run migration:run
```

## Environment Setup

### Backend .env
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_user
DB_PASSWORD=your_password
DB_NAME=everstays_prod
JWT_SECRET=your-secret-key
PORT=3000
FRONTEND_URL=https://everstays.in,https://admin.everstays.in
```

### Frontend .env (optional)
```env
VITE_API_BASE_URL=https://localhost:3000
```

## Nginx Quick Setup

```bash
# Install
sudo apt install nginx

# Test config
sudo nginx -t

# Restart
sudo systemctl restart nginx
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d localhost:3000 -d everstays.in -d admin.everstays.in
```
