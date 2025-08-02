@echo off
echo 🤖 Setting up AI Summary React Frontend...
echo.

cd frontend

echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Frontend setup complete!
echo.
echo 🚀 To start the React app:
echo    cd frontend
echo    npm start
echo.
echo 📱 The app will open at http://localhost:3000
echo.
pause 