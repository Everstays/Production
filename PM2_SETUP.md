# PM2 Setup Guide for Backend Process Management

## What is PM2?

PM2 is a production process manager for Node.js applications that keeps your application alive forever, reloads it without downtime, and facilitates common system admin tasks.

## Step 1: Install PM2 Globally

### On Linux/Mac:
```bash
npm install -g pm2
```

### On Windows:
```bash
npm install -g pm2
npm install -g pm2-windows-startup
pm2-startup install
```

### Verify Installation:
```bash
pm2 --version
```

## Step 2: Navigate to Backend Directory

```bash
cd Production/backend
```

## Step 3: Create PM2 Ecosystem File

Create a file named `ecosystem.config.js` in the backend directory:

```javascript
module.exports = {
  apps: [{
    name: 'everstays-backend',
    script: './dist/main.js',
    instances: 1, // or 'max' for cluster mode
    exec_mode: 'fork', // or 'cluster' for load balancing
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false, // set to true only in development
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
};
```

## Step 4: Create Logs Directory

```bash
mkdir -p logs
```

## Step 5: Build the Backend

```bash
npm run build
```

## Step 6: Ensure .env File Exists

Make sure you have a `.env` file in the backend directory with all required variables:
- DB_HOST
- DB_PORT
- DB_USERNAME
- DB_PASSWORD
- DB_NAME
- JWT_SECRET
- PORT
- NODE_ENV
- FRONTEND_URL

## Step 7: Start Application with PM2

### Start in Production Mode:
```bash
pm2 start ecosystem.config.js --env production
```

### Or start directly:
```bash
pm2 start dist/main.js --name everstays-backend --env production
```

## Step 8: Save PM2 Configuration

This saves the current PM2 process list so it can be restored on server restart:

```bash
pm2 save
```

## Step 9: Setup PM2 to Start on System Boot

### On Linux (Ubuntu/Debian):
```bash
pm2 startup
# Follow the instructions shown (usually involves running a sudo command)
pm2 save
```

### On Linux (CentOS/RHEL):
```bash
pm2 startup systemd
# Follow the instructions shown
pm2 save
```

### On Windows:
```bash
pm2-startup install
pm2 save
```

## Step 10: Verify PM2 is Running

### Check Status:
```bash
pm2 list
```

### View Logs:
```bash
# All logs
pm2 logs

# Specific app logs
pm2 logs everstays-backend

# Last 100 lines
pm2 logs everstays-backend --lines 100
```

### Monitor Resources:
```bash
pm2 monit
```

## Step 11: Test the Application

```bash
# Check if backend is responding
curl http://localhost:3000

# Or test a specific endpoint
curl http://localhost:3000/api/health
```

## Common PM2 Commands

### Process Management:
```bash
# Start application
pm2 start ecosystem.config.js --env production

# Stop application
pm2 stop everstays-backend

# Restart application
pm2 restart everstays-backend

# Reload application (zero-downtime)
pm2 reload everstays-backend

# Delete application from PM2
pm2 delete everstays-backend

# Stop all applications
pm2 stop all

# Restart all applications
pm2 restart all
```

### Monitoring:
```bash
# List all processes
pm2 list

# Show detailed information
pm2 show everstays-backend

# Monitor in real-time
pm2 monit

# View logs
pm2 logs

# View logs with timestamps
pm2 logs --timestamp

# Clear logs
pm2 flush
```

### Updates and Maintenance:
```bash
# Update PM2
npm install -g pm2@latest

# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Generate startup script
pm2 startup
```

## Step 12: Configure Auto-Restart on Failure

PM2 automatically restarts your application if it crashes. The configuration in `ecosystem.config.js` includes:
- `autorestart: true` - Automatically restart on crash
- `max_restarts: 10` - Maximum restart attempts
- `min_uptime: '10s'` - Minimum uptime before considering it stable

## Step 13: Set Up Log Rotation (Optional but Recommended)

PM2 has built-in log rotation. Install the module:

```bash
pm2 install pm2-logrotate
```

Configure it:
```bash
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## Troubleshooting

### Application not starting:
1. Check logs: `pm2 logs everstays-backend`
2. Verify .env file exists and has correct values
3. Check if port 3000 is already in use: `netstat -tulpn | grep 3000`
4. Verify build was successful: `ls -la dist/`

### PM2 not persisting after reboot:
1. Run `pm2 startup` again and follow instructions
2. Run `pm2 save` after starting your app

### High memory usage:
1. Check with `pm2 monit`
2. Adjust `max_memory_restart` in ecosystem.config.js
3. Consider using cluster mode for better performance

## Production Checklist

- [ ] PM2 installed globally
- [ ] Backend built successfully (`npm run build`)
- [ ] .env file configured with production values
- [ ] Application starts with PM2
- [ ] PM2 save executed
- [ ] PM2 startup configured
- [ ] Logs directory created
- [ ] Application accessible on configured port
- [ ] Auto-restart tested (kill process and verify restart)
- [ ] Log rotation configured (optional)

## Next Steps

After PM2 is set up, proceed to configure Nginx for frontend static file serving and reverse proxy for the backend API.
