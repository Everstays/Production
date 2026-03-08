#!/bin/bash

# EverStays Local Build Script
# This script builds all components locally for testing before deployment

set -e  # Exit on error

echo "🚀 Starting EverStays Local Build..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to build backend
build_backend() {
    echo -e "${BLUE}📦 Building Backend...${NC}"
    cd backend
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  Warning: .env file not found. Creating from .env.example if it exists...${NC}"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            echo -e "${YELLOW}⚠️  Please update .env with your actual configuration${NC}"
        else
            echo -e "${RED}❌ Error: .env.example not found. Please create .env file manually.${NC}"
            exit 1
        fi
    fi
    
    echo "Installing dependencies..."
    npm install
    
    echo "Building application..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend built successfully!${NC}"
    else
        echo -e "${RED}❌ Backend build failed!${NC}"
        exit 1
    fi
    
    cd ..
    echo ""
}

# Function to build admin frontend
build_admin() {
    echo -e "${BLUE}📦 Building Admin Frontend...${NC}"
    cd admin
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  Warning: .env file not found. Creating from .env.example if it exists...${NC}"
        if [ -f ".env.example" ]; then
            cp .env.example .env
        fi
    fi
    
    echo "Installing dependencies..."
    npm install
    
    echo "Building for production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Admin frontend built successfully!${NC}"
    else
        echo -e "${RED}❌ Admin frontend build failed!${NC}"
        exit 1
    fi
    
    cd ..
    echo ""
}

# Function to build user frontend
build_user() {
    echo -e "${BLUE}📦 Building User Frontend...${NC}"
    cd user
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  Warning: .env file not found. Creating from .env.example if it exists...${NC}"
        if [ -f ".env.example" ]; then
            cp .env.example .env
        fi
    fi
    
    echo "Installing dependencies..."
    npm install
    
    echo "Building for production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ User frontend built successfully!${NC}"
    else
        echo -e "${RED}❌ User frontend build failed!${NC}"
        exit 1
    fi
    
    cd ..
    echo ""
}

# Main build process
echo "Starting build process..."
echo ""

build_backend
build_admin
build_user

echo ""
echo -e "${GREEN}🎉 All builds completed successfully!${NC}"
echo ""
echo "Build outputs:"
echo "  - Backend: backend/dist/"
echo "  - Admin: admin/dist/"
echo "  - User: user/dist/"
echo ""
echo "To test the backend:"
echo "  cd backend && npm run start:prod"
echo ""
echo "To preview frontends:"
echo "  cd admin && npm run preview"
echo "  cd user && npm run preview"
echo ""
