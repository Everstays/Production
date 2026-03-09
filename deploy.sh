#!/bin/bash

# EverStays Deployment Script
# Usage: ./deploy.sh [backend|user|admin|all]

set -e  # Exit on error

DEPLOY_TARGET=${1:-all}

echo "🚀 Starting EverStays Deployment..."
echo "Target: $DEPLOY_TARGET"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

deploy_backend() {
    echo -e "${BLUE}📦 Building Backend...${NC}"
    cd backend

    echo "Installing dependencies..."
    npm install

    echo "Building application..."
    npm run build

    echo "Checking if PM2 process exists..."
    # Delete the process if it exists (stopped or running) to avoid restart issues
    if pm2 describe everstays-backend &>/dev/null; then
        echo -e "${YELLOW}Removing existing backend process...${NC}"
        pm2 delete everstays-backend 2>/dev/null || true
    fi

    # Start the application fresh
    echo -e "${GREEN}Starting backend process...${NC}"
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --env production
    else
        pm2 start dist/main.js --name "everstays-backend" --env production
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Process started successfully${NC}"
        pm2 save
    else
        echo -e "${RED}✗ Failed to start process${NC}"
        exit 1
    fi

    cd ..
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    echo ""

}

deploy_user() {
    echo -e "${BLUE}📦 Building User Frontend...${NC}"
    cd user
    
    echo "Installing dependencies..."
    npm install
    
    echo "Building for production..."
    npm run build
    
    # Nginx serves static files from user/dist
    # No need for PM2 serve if Nginx is configured
    echo -e "${GREEN}✅ User frontend built successfully!${NC}"
    echo -e "${YELLOW}ℹ️  Nginx should be configured to serve everstays.in from user/dist${NC}"
    
    cd ..
    echo -e "${GREEN}✅ User frontend deployed successfully!${NC}"
    echo ""
}

deploy_admin() {
    echo -e "${BLUE}📦 Building Admin Frontend...${NC}"
    cd admin
    
    echo "Installing dependencies..."
    npm install
    
    echo "Building for production..."
    npm run build
    
    # Nginx serves static files from admin/dist
    # No need for PM2 serve if Nginx is configured
    echo -e "${GREEN}✅ Admin frontend built successfully!${NC}"
    echo -e "${YELLOW}ℹ️  Nginx should be configured to serve admin.everstays.in from admin/dist${NC}"
    
    cd ..
    echo -e "${GREEN}✅ Admin frontend deployed successfully!${NC}"
    echo ""
}

# Main deployment logic
case $DEPLOY_TARGET in
    backend)
        deploy_backend
        ;;
    user)
        deploy_user
        ;;
    admin)
        deploy_admin
        ;;
    all)
        deploy_backend
        deploy_user
        deploy_admin
        ;;
    *)
        echo "❌ Invalid target: $DEPLOY_TARGET"
        echo "Usage: ./deploy.sh [backend|user|admin|all]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "PM2 Status:"
pm2 list
echo ""
echo "To view logs: pm2 logs"
echo "To monitor: pm2 monit"
