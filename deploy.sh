#!/bin/bash

# EverStays Production Deployment Script
# Usage: ./deploy.sh [backend|user|admin|all] [--init-db]
#
# Options:
#   --init-db    Initialize database schema (run npm run init:db)
#   --skip-build Skip building (useful for quick restarts)

set -e  # Exit on error

DEPLOY_TARGET=${1:-all}
INIT_DB=false
SKIP_BUILD=false

# Parse additional arguments
for arg in "$@"; do
    case $arg in
        --init-db)
            INIT_DB=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
    esac
done

echo "🚀 Starting EverStays Production Deployment..."
echo "Target: $DEPLOY_TARGET"
if [ "$INIT_DB" = true ]; then
    echo "📊 Database initialization: ENABLED"
fi
if [ "$SKIP_BUILD" = true ]; then
    echo "⚡ Build step: SKIPPED"
fi
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if .env file exists
check_env_file() {
    local env_file=$1
    if [ ! -f "$env_file" ]; then
        echo -e "${RED}❌ Error: $env_file not found!${NC}"
        echo -e "${YELLOW}   Please create $env_file with required environment variables.${NC}"
        return 1
    fi
    return 0
}

# Function to validate backend environment variables
validate_backend_env() {
    local env_path=$1
    if [ ! -f "$env_path" ]; then
        echo -e "${RED}❌ Error: $env_path not found!${NC}"
        echo -e "${YELLOW}   Current directory: $(pwd)${NC}"
        echo -e "${YELLOW}   Required variables: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, JWT_SECRET${NC}"
        return 1
    fi
    
    # Check for required variables (basic check)
    if ! grep -q "DB_HOST=" "$env_path" || ! grep -q "DB_PASSWORD=" "$env_path"; then
        echo -e "${YELLOW}⚠️  Warning: Some required environment variables may be missing in $env_path${NC}"
    fi
    
    return 0
}

deploy_backend() {
    echo -e "${BLUE}📦 Deploying Backend...${NC}"
    
    # Get script directory (where deploy.sh is located)
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local backend_dir="$script_dir/backend"
    local env_file="$backend_dir/.env"
    
    # Check if backend directory exists - try multiple locations
    if [ ! -d "$backend_dir" ]; then
        # Try relative path from current directory
        if [ -d "backend" ]; then
            backend_dir="$(cd backend && pwd)"
        elif [ -d "./backend" ]; then
            backend_dir="$(cd ./backend && pwd)"
        else
            echo -e "${RED}❌ Error: Backend directory not found!${NC}"
            echo -e "${YELLOW}   Checked: $backend_dir${NC}"
            echo -e "${YELLOW}   Also checked: ./backend${NC}"
            echo -e "${YELLOW}   Current directory: $(pwd)${NC}"
            return 1
        fi
    fi
    
    # Change to backend directory first
    cd "$backend_dir" || {
        echo -e "${RED}❌ Error: Cannot change to backend directory: $backend_dir${NC}"
        return 1
    }
    
    # Now check for .env file (we're now in the backend directory)
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ Error: .env file not found in backend directory!${NC}"
        echo -e "${YELLOW}   Backend directory: $(pwd)${NC}"
        echo -e "${YELLOW}   Expected: $(pwd)/.env${NC}"
        echo -e "${YELLOW}   Please create .env file with required environment variables.${NC}"
        cd "$script_dir" 2>/dev/null || cd .. 2>/dev/null || true
        return 1
    fi
    
    # Validate environment file (now we're in backend directory, so .env is relative)
    if ! validate_backend_env ".env"; then
        echo -e "${RED}❌ Backend deployment aborted.${NC}"
        cd "$script_dir" 2>/dev/null || cd .. 2>/dev/null || true
        return 1
    fi

    # Create logs directory if it doesn't exist
    mkdir -p logs

    if [ "$SKIP_BUILD" = false ]; then
        echo "Installing dependencies..."
        npm install --production

        echo "Building application..."
        npm run build
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Build failed!${NC}"
            cd ..
            return 1
        fi
    else
        echo -e "${YELLOW}⚡ Skipping build step...${NC}"
    fi

    # Initialize database if requested
    if [ "$INIT_DB" = true ]; then
        echo -e "${BLUE}📊 Initializing database schema...${NC}"
        if npm run init:db; then
            echo -e "${GREEN}✅ Database initialized successfully${NC}"
        else
            echo -e "${YELLOW}⚠️  Database initialization failed or database already initialized${NC}"
            echo -e "${YELLOW}   This is normal if the database was already set up.${NC}"
        fi
    fi

    echo "Checking if PM2 process exists..."
    # Delete the process if it exists (stopped or running) to avoid restart issues
    if pm2 describe everstays-backend &>/dev/null; then
        echo -e "${YELLOW}Removing existing backend process...${NC}"
        pm2 delete everstays-backend 2>/dev/null || true
    fi

    # Start the application fresh
    echo -e "${GREEN}Starting backend process with PM2...${NC}"
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --env production
    else
        pm2 start dist/main.js --name "everstays-backend" --env production
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend process started successfully${NC}"
        
        # Wait a moment for the app to start
        sleep 2
        
        # Check if process is running
        if pm2 describe everstays-backend | grep -q "online"; then
            echo -e "${GREEN}✓ Backend is online${NC}"
        else
            echo -e "${YELLOW}⚠️  Backend process may still be starting...${NC}"
        fi
        
        pm2 save
    else
        echo -e "${RED}✗ Failed to start backend process${NC}"
        echo -e "${YELLOW}   Check logs with: pm2 logs everstays-backend${NC}"
        cd ..
        return 1
    fi

    # Return to script directory
    cd "$script_dir" 2>/dev/null || cd .. 2>/dev/null || true
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    echo ""
}

deploy_user() {
    echo -e "${BLUE}📦 Deploying User Frontend...${NC}"
    cd user
    
    if [ "$SKIP_BUILD" = false ]; then
        echo "Installing dependencies..."
        npm install

        echo "Building for production..."
        npm run build
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Build failed!${NC}"
            cd ..
            return 1
        fi
    else
        echo -e "${YELLOW}⚡ Skipping build step...${NC}"
    fi
    
    # Verify dist directory exists
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ Error: dist directory not found!${NC}"
        echo -e "${YELLOW}   Build may have failed.${NC}"
        cd ..
        return 1
    fi
    
    # Nginx serves static files from user/dist
    # No need for PM2 serve if Nginx is configured
    echo -e "${GREEN}✅ User frontend built successfully!${NC}"
    echo -e "${YELLOW}ℹ️  Nginx should be configured to serve everstays.in from user/dist${NC}"
    echo -e "${YELLOW}   Path: $(pwd)/dist${NC}"
    
    cd ..
    echo -e "${GREEN}✅ User frontend deployed successfully!${NC}"
    echo ""
}

deploy_admin() {
    echo -e "${BLUE}📦 Deploying Admin Frontend...${NC}"
    cd admin
    
    if [ "$SKIP_BUILD" = false ]; then
        echo "Installing dependencies..."
        npm install

        echo "Building for production..."
        npm run build
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Build failed!${NC}"
            cd ..
            return 1
        fi
    else
        echo -e "${YELLOW}⚡ Skipping build step...${NC}"
    fi
    
    # Verify dist directory exists
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ Error: dist directory not found!${NC}"
        echo -e "${YELLOW}   Build may have failed.${NC}"
        cd ..
        return 1
    fi
    
    # Nginx serves static files from admin/dist
    # No need for PM2 serve if Nginx is configured
    echo -e "${GREEN}✅ Admin frontend built successfully!${NC}"
    echo -e "${YELLOW}ℹ️  Nginx should be configured to serve admin.everstays.in from admin/dist${NC}"
    echo -e "${YELLOW}   Path: $(pwd)/dist${NC}"
    
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
        echo -e "${RED}❌ Invalid target: $DEPLOY_TARGET${NC}"
        echo "Usage: ./deploy.sh [backend|user|admin|all] [--init-db] [--skip-build]"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh all              # Deploy everything"
        echo "  ./deploy.sh backend          # Deploy only backend"
        echo "  ./deploy.sh all --init-db    # Deploy and initialize database"
        echo "  ./deploy.sh backend --skip-build  # Restart backend without rebuilding"
        exit 1
        ;;
esac

# Final status
echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "📊 PM2 Status:"
pm2 list
echo ""
echo "📝 Useful commands:"
echo "  View logs:        pm2 logs [app-name]"
echo "  Monitor:          pm2 monit"
echo "  Restart all:      pm2 restart all"
echo "  Stop all:         pm2 stop all"
echo "  View backend:     pm2 logs everstays-backend"
echo ""
echo "🌐 Frontend Status:"
echo "  User frontend:    Check Nginx is serving user/dist"
echo "  Admin frontend:   Check Nginx is serving admin/dist"
echo ""
echo "💡 Database:"
if [ "$INIT_DB" = false ]; then
    echo "  To initialize DB: ./deploy.sh backend --init-db"
else
    echo "  ✅ Database initialization was attempted"
fi
echo ""
