#!/bin/bash

echo "========================================"
echo "AI Summary Extension Setup"
echo "========================================"
echo

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo
echo "Creating environment file..."
cp env.example backend/.env

echo
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo
echo "Next steps:"
echo "1. Start the backend: npm run start-backend"
echo "2. Load the extension in Chrome:"
echo "   - Go to chrome://extensions/"
echo "   - Enable Developer mode"
echo "   - Click 'Load unpacked'"
echo "   - Select the chrome-extension folder"
echo "3. Open frontend/index.html in your browser"
echo
echo "Backend will run on: http://localhost:3001"
echo 