@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM Always run from this script's folder
cd /D "%~dp0"

REM Check Node
where node >nul 2>&1
IF ERRORLEVEL 1 (
  echo Node.js is required. Opening download page...
  start https://nodejs.org/en/download/
  echo Please install Node.js (LTS), then re-run this installer.
  pause
  exit /b 1
)

REM Install dependencies (uses npm ci if package-lock exists)
IF EXIST package-lock.json (
  call npm ci
) ELSE (
  call npm install
)
IF ERRORLEVEL 1 (
  echo Dependency install failed.
  pause
  exit /b 1
)

REM Build web and package installer
call npm run dist
IF ERRORLEVEL 1 (
  echo Build failed.
  pause
  exit /b 1
)

REM Find the generated installer in release\
set "REL=release"
set "SETUP="
for %%f in ("%REL%\*.exe") do (
  set "SETUP=%%f"
)

IF "%SETUP%"=="" (
  echo Installer not found in %REL%.
  pause
  exit /b 1
)

echo Launching installer: %SETUP%
start "" "%SETUP%"
exit /b 0
