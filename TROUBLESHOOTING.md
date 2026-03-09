# Troubleshooting Production Deployment

## Quick Fixes for Common Build Errors

### 1. TypeScript Build Errors

**Error: `Cannot find type definition file`**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: `@types/node` syntax errors**
```bash
cd backend
npm install @types/node@^20.11.0 --save-dev
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: `Express.Multer.File` not found**
```bash
cd backend
npm install @types/express @types/multer --save-dev
npm run build
```

### 2. Database Connection Errors

**Error: `password authentication failed`**
- Check `backend/.env` has correct `DB_PASSWORD`
- Verify password matches your database provider
- Test connection: `cd backend && npm run init:db`

**Error: `connection is insecure`**
- Add to `backend/.env`: `DB_SSL=true`
- Or ensure database host includes 'neon.tech', 'supabase', etc.

**Error: `Unable to connect to database`**
```bash
# Test connection manually
cd backend
node -e "
const { Client } = require('pg');
require('dotenv').config();
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});
client.connect().then(() => {
  console.log('✅ Connected!');
  client.end();
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
"
```

### 3. PM2 Process Errors

**Backend won't start:**
```bash
# Check logs
pm2 logs everstays-backend

# Check if .env is loaded
pm2 show everstays-backend

# Restart
pm2 delete everstays-backend
cd backend
pm2 start ecosystem.config.js --env production
pm2 save
```

**Process keeps crashing:**
```bash
# Check error logs
pm2 logs everstays-backend --err

# Check if port is in use
netstat -tulpn | grep 3000

# Manual start to see errors
cd backend
node dist/main.js
```

### 4. Frontend Build Errors

**Build fails:**
```bash
cd user  # or admin
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

**Missing dependencies:**
```bash
npm install
npm audit fix
```

### 5. Manual Deployment Steps (If deploy.sh fails)

**Backend:**
```bash
cd /var/www/webapp/backend

# Clean install
rm -rf node_modules dist package-lock.json
npm install

# Build
npm run build

# Start with PM2
pm2 delete everstays-backend 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
```

**Frontend:**
```bash
# User frontend
cd /var/www/webapp/user
rm -rf node_modules dist
npm install
npm run build

# Admin frontend
cd /var/www/webapp/admin
rm -rf node_modules dist
npm install
npm run build
```

### 6. Check What's Wrong

**View detailed build output:**
```bash
cd backend
npm run build 2>&1 | tee build.log
# Check build.log for errors
```

**Check Node/npm versions:**
```bash
node --version  # Should be 18+
npm --version
```

**Check if files exist:**
```bash
ls -la backend/.env
ls -la backend/dist/main.js
ls -la user/dist/
ls -la admin/dist/
```

**Check PM2 status:**
```bash
pm2 list
pm2 logs
pm2 monit
```

### 7. Nuclear Option (Complete Reset)

If nothing works:
```bash
cd /var/www/webapp

# Stop everything
pm2 stop all
pm2 delete all

# Backend
cd backend
rm -rf node_modules dist package-lock.json
npm install
npm run build
pm2 start ecosystem.config.js --env production

# User frontend
cd ../user
rm -rf node_modules dist
npm install
npm run build

# Admin frontend
cd ../admin
rm -rf node_modules dist
npm install
npm run build

# Save PM2
pm2 save
pm2 startup
```

### 8. Common Environment Issues

**Missing .env file:**
```bash
cd backend
cat > .env << EOF
DB_HOST=your-host
DB_PORT=5432
DB_USERNAME=your-user
DB_PASSWORD=your-password
DB_NAME=your-database
DB_SSL=true
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://everstays.in,https://admin.everstays.in
EOF
```

**Wrong Node version:**
```bash
# Install Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

### 9. Quick Health Checks

**Backend is running:**
```bash
curl http://localhost:3000
pm2 list | grep everstays-backend
```

**Database is connected:**
```bash
cd backend
npm run init:db
```

**Frontend builds exist:**
```bash
ls -la user/dist/index.html
ls -la admin/dist/index.html
```

### 10. Get Help

If you're stuck, provide:
1. Full error message from `pm2 logs everstays-backend`
2. Output of `npm run build` in backend
3. Contents of `backend/.env` (remove passwords)
4. Output of `pm2 list`
5. Node version: `node --version`

## Emergency Rollback

If deployment breaks production:
```bash
# Stop new version
pm2 stop everstays-backend

# Restore from git
cd /var/www/webapp
git stash
git checkout HEAD~1  # Go back one commit
./deploy.sh backend

# Or restore from backup
pm2 restart everstays-backend
```
