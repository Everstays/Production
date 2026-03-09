# Fix PM2 Process Not Found Error

## Error: `[PM2][ERROR] Process 0 not found`

This error occurs when PM2 thinks a process exists but can't actually restart it. This usually happens when:
- The process was deleted but PM2's internal state still references it
- The process is in a stopped/errored state
- PM2's process list is out of sync

## Quick Fix

### Option 1: Delete and Recreate the Process

```bash
# Delete the problematic process
pm2 delete everstays-backend

# Start it fresh
cd /var/www/webapp/backend
pm2 start ecosystem.config.js --env production
# or
pm2 start dist/main.js --name "everstays-backend" --env production

# Save the configuration
pm2 save
```

### Option 2: Reset PM2 (if multiple processes are affected)

```bash
# Stop all processes
pm2 stop all

# Delete all processes
pm2 delete all

# Kill PM2 daemon
pm2 kill

# Restart PM2
pm2 resurrect

# Or start your processes fresh
cd /var/www/webapp/backend
pm2 start ecosystem.config.js --env production
pm2 save
```

### Option 3: Use the Updated Deploy Script

The deploy script has been updated to handle this automatically. It will:
1. Check if the process actually exists using `pm2 describe`
2. Try to restart it
3. If restart fails, delete and recreate it automatically

Just run:
```bash
cd /var/www/webapp
./deploy.sh backend
```

## Verify PM2 Status

```bash
# List all processes
pm2 list

# Show detailed info about a process
pm2 describe everstays-backend

# Check process status
pm2 status

# View logs
pm2 logs everstays-backend
```

## Prevention

The updated deploy script now:
- Uses `pm2 describe` instead of `pm2 list | grep` for more accurate checking
- Handles restart failures gracefully
- Automatically deletes and recreates if restart fails
- Uses `--omit=dev` instead of `--production` flag

## Manual Process Management

If you need to manually manage the process:

```bash
# Start process
pm2 start ecosystem.config.js --env production

# Stop process
pm2 stop everstays-backend

# Restart process
pm2 restart everstays-backend

# Delete process
pm2 delete everstays-backend

# Reload process (zero-downtime)
pm2 reload everstays-backend

# Show process info
pm2 show everstays-backend

# Monitor process
pm2 monit
```

## Common Issues and Solutions

### Issue: Process shows as "stopped" but can't restart
**Solution:**
```bash
pm2 delete everstays-backend
pm2 start ecosystem.config.js --env production
```

### Issue: Process shows in list but doesn't exist
**Solution:**
```bash
pm2 kill
pm2 resurrect  # If you have saved processes
# Or start fresh
pm2 start ecosystem.config.js --env production
pm2 save
```

### Issue: Multiple processes with same name
**Solution:**
```bash
# Delete all instances
pm2 delete everstays-backend

# Start fresh with one instance
pm2 start ecosystem.config.js --env production
pm2 save
```

## Updated Deploy Script Features

The deploy script now includes:
- ✅ Better process detection using `pm2 describe`
- ✅ Automatic error handling and recovery
- ✅ Fallback to delete and recreate if restart fails
- ✅ Support for ecosystem.config.js file
- ✅ Uses `--omit=dev` flag correctly
