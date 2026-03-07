# EverStays Deployment Guide

Complete deployment guide for production server deployment.

## Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **PM2** (for process management) - `npm install -g pm2`
- **Nginx** (optional, for reverse proxy and static file serving)

## Server Setup

### 1. Install Node.js and PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install nodejs npm postgresql postgresql-server
```

### 2. Install PM2 (Process Manager)

```bash
npm install -g pm2
```

## Deployment Steps

### Step 1: Clone/Upload Project

```bash
# If using Git
git clone <your-repo-url>
cd everstays/development

# Or upload project files to server
```

### Step 2: Backend Deployment

```bash
cd backend

# Install dependencies
npm install --production

# Create .env file
cp .env.example .env
# Edit .env with production values:
# - DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
# - JWT_SECRET (use a strong secret)
# - PORT=3001 (or your preferred port)
# - FRONTEND_URL=https://everstays.in,https://admin.everstays.in

# Build the application
npm run build

# Run database migrations
npm run migration:run

# Start with PM2
pm2 start dist/main.js --name "everstays-backend" --env production

# Or start directly
npm run start:prod
```

**PM2 Management:**
```bash
# Start
pm2 start dist/main.js --name "everstays-backend"

# Stop
pm2 stop everstays-backend

# Restart
pm2 restart everstays-backend

# View logs
pm2 logs everstays-backend

# Monitor
pm2 monit

# Save PM2 configuration
pm2 save
pm2 startup  # Follow instructions to enable auto-start on reboot
```

### Step 3: User Frontend Deployment

```bash
cd ../user

# Install dependencies
npm install

# Create .env file (optional, for custom API URL)
# VITE_API_BASE_URL=https://api.everstays.in

# Build for production
npm run build

# The build output will be in 'dist' folder
# You can serve it with:
# - Nginx (recommended)
# - PM2 with serve
# - Any static file server
```

**Option A: Using PM2 with serve**
```bash
npm install -g serve
pm2 serve dist 5173 --name "everstays-user" --spa
```

**Option B: Using Nginx (Recommended)**
See Nginx configuration below.

### Step 4: Admin Frontend Deployment

```bash
cd ../admin

# Install dependencies
npm install

# Create .env file (optional)
# VITE_API_BASE_URL=https://api.everstays.in
# VITE_USER_APP_URL=https://everstays.in

# Build for production
npm run build

# Serve with PM2
pm2 serve dist 5174 --name "everstays-admin" --spa
```

## Complete Deployment Script

Create a deployment script `deploy.sh`:

```bash
#!/bin/bash

echo "Starting deployment..."

# Backend
echo "Building backend..."
cd backend
npm install --production
npm run build
pm2 restart everstays-backend || pm2 start dist/main.js --name "everstays-backend"

# User Frontend
echo "Building user frontend..."
cd ../user
npm install
npm run build

# Admin Frontend
echo "Building admin frontend..."
cd ../admin
npm install
npm run build

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Nginx Configuration

### Install Nginx

```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### Nginx Configuration File

Create `/etc/nginx/sites-available/everstays`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.everstays.in;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for file uploads
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Serve uploaded files directly
    location /uploads {
        alias /path/to/everstays/development/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# User Frontend
server {
    listen 80;
    server_name everstays.in www.everstays.in;

    root /path/to/everstays/development/user/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Admin Frontend
server {
    listen 80;
    server_name admin.everstays.in;

    root /path/to/everstays/development/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d api.everstays.in -d everstays.in -d www.everstays.in -d admin.everstays.in

# Auto-renewal
sudo certbot renew --dry-run
```

### Enable and Restart Nginx

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/everstays /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Environment Variables

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=everstays_prod

# JWT
JWT_SECRET=your-very-strong-secret-key-here

# Server
PORT=3001
NODE_ENV=production

# CORS - Add your frontend URLs
FRONTEND_URL=https://everstays.in,https://admin.everstays.in,https://www.everstays.in
```

### User Frontend (.env)

```env
VITE_API_BASE_URL=https://api.everstays.in
```

### Admin Frontend (.env)

```env
VITE_API_BASE_URL=https://api.everstays.in
VITE_USER_APP_URL=https://everstays.in
```

## Database Setup

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE everstays_prod;
CREATE USER your_db_user WITH PASSWORD 'your_db_password';
GRANT ALL PRIVILEGES ON DATABASE everstays_prod TO your_db_user;
\q

# Run migrations
cd backend
npm run migration:run
```

## Quick Deployment Commands Summary

```bash
# 1. Backend
cd backend
npm install --production
npm run build
pm2 start dist/main.js --name "everstays-backend"

# 2. User Frontend
cd ../user
npm install
npm run build
# Serve with Nginx or PM2

# 3. Admin Frontend
cd ../admin
npm install
npm run build
# Serve with Nginx or PM2

# 4. Setup PM2 to start on reboot
pm2 save
pm2 startup
```

## Monitoring & Maintenance

### PM2 Commands

```bash
# List all processes
pm2 list

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart all
pm2 restart all

# Stop all
pm2 stop all
```

### Database Backup

```bash
# Backup
pg_dump -U your_db_user everstays_prod > backup_$(date +%Y%m%d).sql

# Restore
psql -U your_db_user everstays_prod < backup_20240101.sql
```

## Troubleshooting

### Check if services are running

```bash
# Check PM2 processes
pm2 list

# Check ports
netstat -tulpn | grep -E '3001|5173|5174'

# Check Nginx
sudo systemctl status nginx
```

### View logs

```bash
# Backend logs
pm2 logs everstays-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Common Issues

1. **Port already in use**: Change port in `.env` or kill the process using the port
2. **Database connection failed**: Check PostgreSQL is running and credentials are correct
3. **CORS errors**: Add frontend URLs to `FRONTEND_URL` in backend `.env`
4. **Build fails**: Ensure Node.js version is 18+ and all dependencies are installed

## Production Checklist

- [ ] All environment variables set
- [ ] Database created and migrations run
- [ ] Backend built and running with PM2
- [ ] Frontends built and served
- [ ] Nginx configured (if using)
- [ ] SSL certificates installed
- [ ] PM2 configured to start on reboot
- [ ] Database backups scheduled
- [ ] Firewall configured (allow ports 80, 443, 3001)
- [ ] Monitoring set up
