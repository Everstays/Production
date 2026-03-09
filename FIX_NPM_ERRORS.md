# Fixing npm Installation Errors

## Error: ENOTEMPTY - Directory not empty

This error occurs when npm tries to rename a directory during installation but the target directory already exists or is not empty.

## Solution: Clean Install

### Step 1: Stop the Application (if running)
```bash
# If using PM2
pm2 stop everstays-backend

# Or if running directly
# Kill the process
```

### Step 2: Navigate to Backend Directory
```bash
cd /var/www/webapp/backend
```

### Step 3: Remove Existing Installation
```bash
# Remove node_modules
rm -rf node_modules

# Remove package-lock.json
rm -f package-lock.json

# Optional: Remove dist folder if you want a fresh build
# rm -rf dist
```

### Step 4: Clear npm Cache
```bash
# Clear npm cache
npm cache clean --force

# Verify cache is cleared
npm cache verify
```

### Step 5: Clean Install
```bash
# Install dependencies fresh
npm install --omit=dev

# Or if you need dev dependencies too
npm install
```

### Step 6: Rebuild the Application
```bash
npm run build
```

### Step 7: Restart Application
```bash
# If using PM2
pm2 restart everstays-backend

# Or start fresh
pm2 start ecosystem.config.js --env production
```

## Alternative: Using npm ci (Recommended for Production)

`npm ci` is faster and more reliable for production environments:

```bash
# Remove node_modules
rm -rf node_modules

# Clear cache
npm cache clean --force

# Use npm ci (requires package-lock.json)
npm ci --omit=dev

# Build
npm run build
```

## If Error Persists

### Option 1: Check File Permissions
```bash
# Check current permissions
ls -la node_modules/ | head -20

# Fix permissions (if needed)
sudo chown -R $USER:$USER /var/www/webapp/backend
sudo chmod -R 755 /var/www/webapp/backend
```

### Option 2: Check Disk Space
```bash
# Check available disk space
df -h

# Check inode usage
df -i
```

### Option 3: Manual Directory Cleanup
```bash
# Remove the problematic directory manually
rm -rf node_modules/cli-table3

# Then try install again
npm install --omit=dev
```

### Option 4: Use Different npm Version
```bash
# Check current npm version
npm --version

# Update npm
npm install -g npm@latest

# Or use specific version
npm install -g npm@10.9.0
```

## Complete Clean Install Script

Create a script to automate the cleanup:

```bash
#!/bin/bash
# save as: clean-install.sh

cd /var/www/webapp/backend

echo "Stopping application..."
pm2 stop everstays-backend || true

echo "Removing old files..."
rm -rf node_modules
rm -f package-lock.json

echo "Clearing npm cache..."
npm cache clean --force

echo "Installing dependencies..."
npm install --omit=dev

echo "Building application..."
npm run build

echo "Restarting application..."
pm2 restart everstays-backend || pm2 start ecosystem.config.js --env production

echo "Done!"
```

Make it executable and run:
```bash
chmod +x clean-install.sh
./clean-install.sh
```

## Prevention Tips

1. **Always use `--omit=dev` in production** instead of `--production` flag
2. **Use `npm ci` instead of `npm install`** in production (requires package-lock.json)
3. **Keep package-lock.json in version control**
4. **Clear cache periodically**: `npm cache clean --force`

## Common npm Commands for Production

```bash
# Production install (no dev dependencies)
npm install --omit=dev

# Clean install (faster, more reliable)
npm ci --omit=dev

# Clear cache
npm cache clean --force

# Verify cache
npm cache verify

# Check for outdated packages
npm outdated

# Audit for vulnerabilities
npm audit
```
