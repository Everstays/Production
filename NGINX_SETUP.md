# Nginx Setup Guide for Frontend Static File Serving

## What is Nginx?

Nginx is a high-performance web server that can serve static files and act as a reverse proxy for your backend API.

## Step 1: Install Nginx

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install nginx
```

### On CentOS/RHEL:
```bash
sudo yum install nginx
# or for newer versions
sudo dnf install nginx
```

### On macOS (using Homebrew):
```bash
brew install nginx
```

### Verify Installation:
```bash
nginx -v
```

## Step 2: Check Nginx Status

```bash
# Check if Nginx is running
sudo systemctl status nginx

# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

## Step 3: Build Frontend Applications

Before configuring Nginx, ensure both frontends are built:

```bash
# Build Admin Frontend
cd Production/admin
npm install
npm run build

# Build User Frontend
cd Production/user
npm install
npm run build
```

## Step 4: Create Nginx Configuration File

Create a new configuration file for your EverStays application:

```bash
sudo nano /etc/nginx/sites-available/everstays
```

**Note:** On CentOS/RHEL, use `/etc/nginx/conf.d/everstays.conf` instead.

## Step 5: Configure Nginx for EverStays

Copy the following configuration. **Replace the paths and domains with your actual values:**

```nginx
# Backend API - Reverse Proxy
server {
    listen 80;
    server_name api.everstays.in;  # Replace with your API domain or IP

    # Increase timeouts for file uploads
    client_max_body_size 10M;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files directly (better performance)
    location /uploads {
        alias /path/to/everstays/Production/backend/uploads;  # Update this path
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}

# User Frontend - Static Files
server {
    listen 80;
    server_name everstays.in www.everstays.in;  # Replace with your domain or IP

    root /path/to/everstays/Production/user/dist;  # Update this path
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Don't cache HTML files
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}

# Admin Frontend - Static Files
server {
    listen 80;
    server_name admin.everstays.in;  # Replace with your admin domain or IP

    root /path/to/everstays/Production/admin/dist;  # Update this path
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Don't cache HTML files
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

## Step 6: Update Paths in Configuration

Edit the configuration file and update these paths:

1. **Backend uploads path**: `/path/to/everstays/Production/backend/uploads`
   - Replace with: `/home/youruser/everstays/Production/backend/uploads` (or your actual path)

2. **User frontend path**: `/path/to/everstays/Production/user/dist`
   - Replace with: `/home/youruser/everstays/Production/user/dist` (or your actual path)

3. **Admin frontend path**: `/path/to/everstays/Production/admin/dist`
   - Replace with: `/home/youruser/everstays/Production/admin/dist` (or your actual path)

4. **Server names**: Replace `api.everstays.in`, `everstays.in`, `admin.everstays.in` with:
   - Your actual domain names, OR
   - Your server IP address, OR
   - `_` (underscore) to accept all domains (for testing)

## Step 7: Enable the Site

### On Ubuntu/Debian:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/everstays /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default
```

### On CentOS/RHEL:
The file is already in the correct location (`/etc/nginx/conf.d/`), so no linking needed.

## Step 8: Test Nginx Configuration

```bash
# Test configuration for syntax errors
sudo nginx -t
```

If you see "syntax is ok" and "test is successful", proceed to the next step.

## Step 9: Set Proper File Permissions

```bash
# Ensure Nginx can read the files
sudo chown -R www-data:www-data /path/to/everstays/Production/user/dist
sudo chown -R www-data:www-data /path/to/everstays/Production/admin/dist
sudo chown -R www-data:www-data /path/to/everstays/Production/backend/uploads

# Set proper permissions
sudo chmod -R 755 /path/to/everstays/Production/user/dist
sudo chmod -R 755 /path/to/everstays/Production/admin/dist
sudo chmod -R 755 /path/to/everstays/Production/backend/uploads
```

**Note:** On CentOS/RHEL, use `nginx` instead of `www-data`:
```bash
sudo chown -R nginx:nginx /path/to/everstays/Production/user/dist
```

## Step 10: Reload Nginx

```bash
# Reload Nginx configuration
sudo systemctl reload nginx

# Or restart Nginx
sudo systemctl restart nginx
```

## Step 11: Configure Firewall

Allow HTTP and HTTPS traffic:

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Or if using iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## Step 12: Test Your Setup

### Test Backend API:
```bash
curl http://localhost:3000
# or
curl http://api.everstays.in
```

### Test User Frontend:
Open in browser: `http://everstays.in` or `http://your-server-ip`

### Test Admin Frontend:
Open in browser: `http://admin.everstays.in` or `http://your-server-ip:80`

## Step 13: Set Up SSL with Let's Encrypt (Recommended for Production)

### Install Certbot:
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### Obtain SSL Certificates:
```bash
sudo certbot --nginx -d api.everstays.in -d everstays.in -d www.everstays.in -d admin.everstays.in
```

Follow the prompts to:
1. Enter your email address
2. Agree to terms of service
3. Choose whether to redirect HTTP to HTTPS (recommended: Yes)

### Auto-Renewal:
Certbot automatically sets up a cron job for renewal. Test it:
```bash
sudo certbot renew --dry-run
```

## Step 14: Verify Everything is Working

### Check Nginx Status:
```bash
sudo systemctl status nginx
```

### Check PM2 Status:
```bash
pm2 list
pm2 logs everstays-backend
```

### Check Logs:
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PM2 logs
pm2 logs everstays-backend
```

## Common Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration (no downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Stop Nginx
sudo systemctl stop nginx

# Start Nginx
sudo systemctl start nginx

# Check status
sudo systemctl status nginx

# View error log
sudo tail -f /var/log/nginx/error.log

# View access log
sudo tail -f /var/log/nginx/access.log
```

## Troubleshooting

### 502 Bad Gateway:
1. Check if backend is running: `pm2 list`
2. Check backend logs: `pm2 logs everstays-backend`
3. Verify backend is listening on port 3000: `netstat -tulpn | grep 3000`
4. Check Nginx error log: `sudo tail -f /var/log/nginx/error.log`

### 403 Forbidden:
1. Check file permissions: `ls -la /path/to/dist`
2. Check Nginx user has access: `sudo -u www-data ls /path/to/dist`
3. Verify SELinux (if enabled): `getenforce`

### 404 Not Found:
1. Verify paths in Nginx config are correct
2. Check if files exist: `ls -la /path/to/dist/index.html`
3. Verify `try_files` directive includes `/index.html`

### Static files not loading:
1. Check browser console for errors
2. Verify file paths in build output
3. Check Nginx access logs for 404 errors
4. Ensure static file location blocks are correct

## Production Checklist

- [ ] Nginx installed and running
- [ ] Frontend applications built
- [ ] Nginx configuration file created
- [ ] Paths updated in configuration
- [ ] Configuration tested (`nginx -t`)
- [ ] Site enabled (symbolic link created)
- [ ] File permissions set correctly
- [ ] Nginx reloaded/restarted
- [ ] Firewall configured
- [ ] Backend accessible through Nginx
- [ ] User frontend accessible
- [ ] Admin frontend accessible
- [ ] SSL certificates installed (production)
- [ ] Auto-renewal configured (production)

## Quick Reference: Single Server Setup (All on One IP)

If you're using a single server with one IP address, you can use different ports or path-based routing:

### Option 1: Port-Based Routing
```nginx
# Backend on port 80, path /api
server {
    listen 80;
    server_name your-server-ip;
    
    location /api {
        proxy_pass http://localhost:3000;
        # ... proxy settings
    }
    
    location / {
        root /path/to/user/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 2: Subdomain Setup (Requires DNS)
Configure DNS A records:
- `api.yourdomain.com` → Server IP
- `yourdomain.com` → Server IP  
- `admin.yourdomain.com` → Server IP

Then use the full configuration above.

## Next Steps

After Nginx is configured:
1. Test all endpoints
2. Set up monitoring (optional)
3. Configure backups
4. Set up log rotation
5. Review security settings
