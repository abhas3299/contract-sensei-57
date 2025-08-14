#!/bin/bash

# 🚀 Contract Analyzer Deployment Script
# This script automates the build and deployment process

set -e  # Exit on any error

echo "🚀 Starting Contract Analyzer deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check if required commands exist
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

check_command "npm"
check_command "git"

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Check for TypeScript errors
print_status "Checking TypeScript compilation..."
if npm run build --dry-run &> /dev/null || npm run build &> /dev/null; then
    print_success "TypeScript compilation successful"
else
    print_error "TypeScript compilation failed. Please fix the errors first."
    exit 1
fi

# Build the application
print_status "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check build output
if [ -d "dist" ]; then
    print_success "Build output directory 'dist' created"
    print_status "Build contents:"
    ls -la dist/
else
    print_error "Build output directory 'dist' not found"
    exit 1
fi

# Check for environment variables
print_status "Checking environment configuration..."

if [ -f ".env.local" ]; then
    print_success "Found .env.local file"
    if grep -q "VITE_API_URL" .env.local; then
        print_success "VITE_API_URL is configured"
    else
        print_warning "VITE_API_URL not found in .env.local"
    fi
else
    print_warning "No .env.local file found. Please create one with your configuration."
fi

# Check backend configuration
if [ -d "backend" ]; then
    print_status "Backend directory found"
    if [ -f "backend/env.example" ]; then
        print_success "Backend environment example file found"
    fi
else
    print_warning "Backend directory not found"
fi

# Git status check
print_status "Checking git status..."
if git diff --quiet; then
    print_success "Working directory is clean"
else
    print_warning "Working directory has uncommitted changes"
    git status --short
fi

# Deployment instructions
echo ""
echo "🎯 Deployment Instructions:"
echo "=========================="
echo ""
echo "1. Frontend (Netlify):"
echo "   - Push your code to GitHub"
echo "   - Connect repository to Netlify"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: dist"
echo "   - Set environment variable VITE_API_URL"
echo ""
echo "2. Backend (Render/Railway):"
echo "   - Deploy backend/app directory"
echo "   - Set environment variables from backend/env.example"
echo "   - Update CORS origins with your Netlify domain"
echo ""
echo "3. Database:"
echo "   - Create PostgreSQL database on Supabase/NeonDB"
echo "   - Update DATABASE_URL in backend environment"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""

# Check if Netlify CLI is available
if command -v netlify &> /dev/null; then
    print_status "Netlify CLI found"
    echo ""
    read -p "Would you like to deploy to Netlify now? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deploying to Netlify..."
        netlify deploy --prod
    fi
else
    print_warning "Netlify CLI not found. Install with: npm install -g netlify-cli"
fi

print_success "Deployment script completed!"
print_status "Your application is ready for deployment to Netlify"
