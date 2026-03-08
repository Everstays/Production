# Complete Deployment Steps: PM2 + Nginx

This guide walks you through the complete setup process step by step.

## Prerequisites

- Ubuntu/Debian/CentOS server with root/sudo access
- Node.js 18+ installed
- PostgreSQL installed and running
- Domain names configured (optional, can use IP addresses)

## Part 1: PM2 Setup for Backend

### Step 1.1: Install PM2
```bash
npm install -g pm2
pm2 --version
```

### Step 1.2: Navigate to Backend
```bash
cd Production/backend
```

### Step 1.3: Create Logs Directory
```bash
mkdir -p logs
```

### Step 1.4: Configure Environment
```bash
# Copy example env file (if it exists)
cp .env.example .env

# Edit .env with your production values
nano .env
```

Required variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=everstays_prod
JWT_SECRET=your-very-strong-secret-key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://everstays.in,https://admin.everstays.in
```

### Step 1.5: Install Dependencies and Build
```bash
npm install --production
npm run build
```

### Step 1.6: Start with PM2
```bash
# Using ecosystem file (recommended)
pm2 start ecosystem.config.js --env production

# Or start directly
pm2 start dist/main.js --name everstays-backend --env production
```

### Step 1.7: Save and Setup Startup
```bash
# Save current PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions shown (copy and run the sudo command)
```

### Step 1.8: Verify Backend is Running
```bash
# Check status
pm2 list

# View logs
pm2 logs everstays-backend

# Test API
curl http://localhost:3001
```

## Part 2: Nginx Setup for Frontends

### Step 2.1: Install Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### Step 2.2: Start and Enable Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### Step 2.3: Build Frontend Applications
```bash
# Build User Frontend
cd Production/user
npm install
npm run build

# Build Admin Frontend
cd Production/admin
npm install
npm run build
```

### Step 2.4: Copy Nginx Configuration
```bash
# Ubuntu/Debian
sudo cp Production/nginx-everstays.conf /etc/nginx/sites-available/everstays

# CentOS/RHEL
sudo cp Production/nginx-everstays.conf /etc/nginx/conf.d/everstays.conf
```

### Step 2.5: Edit Nginx Configuration
```bash
# Ubuntu/Debian
sudo nano /etc/nginx/sites-available/everstays

# CentOS/RHEL
sudo nano /etc/nginx/conf.d/everstays.conf
```

**Update these paths:**
1. Find and replace `/path/to/everstays/Production/backend/uploads` with your actual path
2. Find and replace `/path/to/everstays/Production/user/dist` with your actual path
3. Find and replace `/path/to/everstays/Production/admin/dist` with your actual path
4. Update server_name values with your domains or use `_` for all domains

**Example:**
```nginx
# Change this:
root /path/to/everstays/Production/user/dist;

# To this (example):
root /home/ubuntu/everstays/Production/user/dist;
```

### Step 2.6: Enable Site (Ubuntu/Debian only)
```bash
sudo ln -s /etc/nginx/sites-available/everstays /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site
```

### Step 2.7: Set File Permissions
```bash
# Get your actual paths first
USER_DIST="/path/to/everstays/Production/user/dist"
ADMIN_DIST="/path/to/everstays/Production/admin/dist"
UPLOADS="/path/to/everstays/Production/backend/uploads"

# Ubuntu/Debian
sudo chown -R www-data:www-data $USER_DIST
sudo chown -R www-data:www-data $ADMIN_DIST
sudo chown -R www-data:www-data $UPLOADS
sudo chmod -R 755 $USER_DIST
sudo chmod -R 755 $ADMIN_DIST
sudo chmod -R 755 $UPLOADS

# CentOS/RHEL (use nginx instead of www-data)
sudo chown -R nginx:nginx $USER_DIST
sudo chown -R nginx:nginx $ADMIN_DIST
sudo chown -R nginx:nginx $UPLOADS
```

### Step 2.8: Test and Reload Nginx
```bash
# Test configuration
sudo nginx -t

# If test passes, reload
sudo systemctl reload nginx
```

### Step 2.9: Configure Firewall
```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Part 3: SSL Setup (Optional but Recommended)

### Step 3.1: Install Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### Step 3.2: Obtain SSL Certificates
```bash
sudo certbot --nginx -d api.everstays.in -d everstays.in -d www.everstays.in -d admin.everstays.in
```

Follow prompts and choose to redirect HTTP to HTTPS.

### Step 3.3: Test Auto-Renewal
```bash
sudo certbot renew --dry-run
```

## Part 4: Verification

### Step 4.1: Check PM2 Status
```bash
pm2 list
pm2 logs everstays-backend --lines 50
```

### Step 4.2: Check Nginx Status
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Step 4.3: Test Endpoints
```bash
# Backend API
curl http://localhost:3001
curl http://api.everstays.in

# User Frontend (in browser)
http://everstays.in

# Admin Frontend (in browser)
http://admin.everstays.in
```

## Quick Commands Reference

### PM2 Commands
```bash
pm2 list                    # List all processes
pm2 logs everstays-backend  # View logs
pm2 restart everstays-backend  # Restart
pm2 stop everstays-backend     # Stop
pm2 monit                   # Monitor resources
pm2 save                    # Save process list
```

### Nginx Commands
```bash
sudo nginx -t               # Test configuration
sudo systemctl reload nginx # Reload (no downtime)
sudo systemctl restart nginx # Restart
sudo systemctl status nginx # Check status
```

## Troubleshooting

### Backend not accessible:
1. Check PM2: `pm2 list`
2. Check logs: `pm2 logs everstays-backend`
3. Check port: `netstat -tulpn | grep 3001`
4. Check .env file exists and is correct

### Frontend showing 502:
1. Check if backend is running: `pm2 list`
2. Check backend logs: `pm2 logs`
3. Check Nginx error log: `sudo tail -f /var/log/nginx/error.log`

### Frontend showing 403:
1. Check file permissions: `ls -la /path/to/dist`
2. Check Nginx user: `ps aux | grep nginx`
3. Fix permissions: `sudo chown -R www-data:www-data /path/to/dist`

### Static files not loading:
1. Check browser console
2. Verify paths in Nginx config
3. Check Nginx access logs: `sudo tail -f /var/log/nginx/access.log`

## Production Checklist

- [ ] PM2 installed and backend running
- [ ] PM2 startup configured
- [ ] Backend accessible on port 3001
- [ ] Nginx installed and running
- [ ] Frontends built successfully
- [ ] Nginx configuration updated with correct paths
- [ ] File permissions set correctly
- [ ] Nginx configuration tested
- [ ] Firewall configured
- [ ] All endpoints accessible
- [ ] SSL certificates installed (production)
- [ ] Logs being written correctly
- [ ] Auto-restart working (test by killing process)

## Next Steps

1. Set up monitoring (optional)
2. Configure automated backups
3. Set up log rotation
4. Review security settings
5. Set up CI/CD pipeline (optional)
