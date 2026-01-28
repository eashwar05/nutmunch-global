@echo off
echo Starting Nutmunch Fullstack App...

:: Start Backend
start "Nutmunch Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

:: Start Frontend
start "Nutmunch Frontend" cmd /k "npm run dev"

echo Both services started in separate windows.
