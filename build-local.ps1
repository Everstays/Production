# EverStays Local Build Script for Windows PowerShell
# This script builds all components locally for testing before deployment

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting EverStays Local Build..." -ForegroundColor Cyan
Write-Host ""

# Function to build backend
function Build-Backend {
    Write-Host "📦 Building Backend..." -ForegroundColor Blue
    Set-Location backend
    
    if (-not (Test-Path ".env")) {
        Write-Host "⚠️  Warning: .env file not found. Creating from .env.example if it exists..." -ForegroundColor Yellow
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "⚠️  Please update .env with your actual configuration" -ForegroundColor Yellow
        } else {
            Write-Host "❌ Error: .env.example not found. Please create .env file manually." -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host "Installing dependencies..."
    npm install
    
    Write-Host "Building application..."
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend built successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend build failed!" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ..
    Write-Host ""
}

# Function to build admin frontend
function Build-Admin {
    Write-Host "📦 Building Admin Frontend..." -ForegroundColor Blue
    Set-Location admin
    
    if (-not (Test-Path ".env")) {
        Write-Host "⚠️  Warning: .env file not found. Creating from .env.example if it exists..." -ForegroundColor Yellow
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
        }
    }
    
    Write-Host "Installing dependencies..."
    npm install
    
    Write-Host "Building for production..."
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Admin frontend built successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Admin frontend build failed!" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ..
    Write-Host ""
}

# Function to build user frontend
function Build-User {
    Write-Host "📦 Building User Frontend..." -ForegroundColor Blue
    Set-Location user
    
    if (-not (Test-Path ".env")) {
        Write-Host "⚠️  Warning: .env file not found. Creating from .env.example if it exists..." -ForegroundColor Yellow
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
        }
    }
    
    Write-Host "Installing dependencies..."
    npm install
    
    Write-Host "Building for production..."
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ User frontend built successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ User frontend build failed!" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ..
    Write-Host ""
}

# Main build process
Write-Host "Starting build process..."
Write-Host ""

Build-Backend
Build-Admin
Build-User

Write-Host ""
Write-Host "🎉 All builds completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Build outputs:"
Write-Host "  - Backend: backend/dist/"
Write-Host "  - Admin: admin/dist/"
Write-Host "  - User: user/dist/"
Write-Host ""
Write-Host "To test the backend:"
Write-Host "  cd backend && npm run start:prod"
Write-Host ""
Write-Host "To preview frontends:"
Write-Host "  cd admin && npm run preview"
Write-Host "  cd user && npm run preview"
Write-Host ""
