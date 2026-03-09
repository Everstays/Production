# EverStays Backend - Clean Install Script for Windows/PowerShell
# This script performs a clean installation to fix npm errors

$ErrorActionPreference = "Stop"

Write-Host "🧹 Starting clean installation..." -ForegroundColor Cyan
Write-Host ""

# Get the directory where the script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "📂 Working directory: $ScriptDir" -ForegroundColor Blue
Write-Host ""

# Step 1: Stop PM2 process if running
Write-Host "Step 1: Stopping application (if running)..." -ForegroundColor Yellow
try {
    pm2 stop everstays-backend 2>$null
    Write-Host "  Application stopped" -ForegroundColor Green
} catch {
    Write-Host "  Application not running or PM2 not installed" -ForegroundColor Gray
}
Write-Host ""

# Step 2: Remove old files
Write-Host "Step 2: Removing old installation files..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  Removing node_modules..."
    Remove-Item -Recurse -Force node_modules
    Write-Host "  ✓ node_modules removed" -ForegroundColor Green
} else {
    Write-Host "  node_modules not found (already clean)" -ForegroundColor Gray
}

if (Test-Path "package-lock.json") {
    Write-Host "  Removing package-lock.json..."
    Remove-Item -Force package-lock.json
    Write-Host "  ✓ package-lock.json removed" -ForegroundColor Green
} else {
    Write-Host "  package-lock.json not found" -ForegroundColor Gray
}
Write-Host ""

# Step 3: Clear npm cache
Write-Host "Step 3: Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "  ✓ npm cache cleared" -ForegroundColor Green
Write-Host ""

# Step 4: Install dependencies
Write-Host "Step 4: Installing dependencies (production only)..." -ForegroundColor Yellow
npm install --omit=dev
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "  ✗ Installation failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Build application
Write-Host "Step 5: Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Application built successfully" -ForegroundColor Green
} else {
    Write-Host "  ✗ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Restart application
Write-Host "Step 6: Restarting application..." -ForegroundColor Yellow
if (Get-Command pm2 -ErrorAction SilentlyContinue) {
    $pm2List = pm2 list 2>$null
    if ($pm2List -match "everstays-backend") {
        pm2 restart everstays-backend
        Write-Host "  ✓ Application restarted" -ForegroundColor Green
    } else {
        pm2 start ecosystem.config.js --env production
        Write-Host "  ✓ Application started" -ForegroundColor Green
    }
    pm2 save
} else {
    Write-Host "  PM2 not found. Please start the application manually." -ForegroundColor Gray
}
Write-Host ""

Write-Host "🎉 Clean installation completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  - Check application status: pm2 list"
Write-Host "  - View logs: pm2 logs everstays-backend"
Write-Host "  - Test API: curl http://localhost:3000"
Write-Host ""
