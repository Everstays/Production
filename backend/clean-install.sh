#!/bin/bash

# EverStays Backend - Clean Install Script
# This script performs a clean installation to fix npm errors

set -e  # Exit on error

echo "🧹 Starting clean installation..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📂 Working directory: $SCRIPT_DIR${NC}"
echo ""

# Step 1: Stop PM2 process if running
echo -e "${YELLOW}Step 1: Stopping application (if running)...${NC}"
pm2 stop everstays-backend 2>/dev/null || echo "  Application not running or PM2 not installed"
echo ""

# Step 2: Remove old files
echo -e "${YELLOW}Step 2: Removing old installation files...${NC}"
if [ -d "node_modules" ]; then
    echo "  Removing node_modules..."
    rm -rf node_modules
    echo -e "  ${GREEN}✓ node_modules removed${NC}"
else
    echo "  node_modules not found (already clean)"
fi

if [ -f "package-lock.json" ]; then
    echo "  Removing package-lock.json..."
    rm -f package-lock.json
    echo -e "  ${GREEN}✓ package-lock.json removed${NC}"
else
    echo "  package-lock.json not found"
fi
echo ""

# Step 3: Clear npm cache
echo -e "${YELLOW}Step 3: Clearing npm cache...${NC}"
npm cache clean --force || true
echo -e "  ${GREEN}✓ npm cache cleared${NC}"
echo ""

# Step 4: Install dependencies
echo -e "${YELLOW}Step 4: Installing dependencies (production only)...${NC}"
npm install 
if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "  ${RED}✗ Installation failed${NC}"
    exit 1
fi
echo ""

# Step 5: Build application
echo -e "${YELLOW}Step 5: Building application...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✓ Application built successfully${NC}"
else
    echo -e "  ${RED}✗ Build failed${NC}"
    exit 1
fi
echo ""

# Step 6: Restart application
echo -e "${YELLOW}Step 6: Restarting application...${NC}"
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "everstays-backend"; then
        pm2 restart everstays-backend
        echo -e "  ${GREEN}✓ Application restarted${NC}"
    else
        pm2 start ecosystem.config.js --env production
        echo -e "  ${GREEN}✓ Application started${NC}"
    fi
    pm2 save
else
    echo "  PM2 not found. Please start the application manually."
fi
echo ""

echo -e "${GREEN}🎉 Clean installation completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "  - Check application status: pm2 list"
echo "  - View logs: pm2 logs everstays-backend"
echo "  - Test API: curl http://localhost:3000"
echo ""

