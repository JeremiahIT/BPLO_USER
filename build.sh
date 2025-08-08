#!/bin/bash

echo "🚀 Starting BPLO User Frontend Build..."

# Navigate to user directory
cd user

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Make react-scripts executable
echo "🔧 Setting permissions..."
chmod +x node_modules/.bin/react-scripts

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build files are in: user/build/"
