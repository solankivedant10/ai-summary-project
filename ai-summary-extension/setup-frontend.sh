#!/bin/bash

echo "🤖 Setting up AI Summary React Frontend..."
echo

cd frontend

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo
echo "✅ Frontend setup complete!"
echo
echo "🚀 To start the React app:"
echo "   cd frontend"
echo "   npm start"
echo
echo "📱 The app will open at http://localhost:3000"
echo 