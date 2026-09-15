@echo off
setlocal

set "REPO_URL=https://github.com/Maruthu123/Conscious-Cravings.git"
set "REPO_DIR=%~dp0Conscious-Cravings"

echo.
echo ==========================================
echo Conscious-Cravings GitHub Update
echo ==========================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: Git is not installed or not in PATH.
  pause
  exit /b 1
)

if not exist "%REPO_DIR%\.git" (
  echo Cloning existing GitHub repository...
  git clone "%REPO_URL%" "%REPO_DIR%"
  if errorlevel 1 (
    echo.
    echo Clone failed. Make sure you are signed in to GitHub in Git Credential Manager.
    pause
    exit /b 1
  )
)

echo Copying updated project files...
robocopy "%~dp0" "%REPO_DIR%" /E /XD "Conscious-Cravings" "node_modules" "dist" ".git" /XF "PUSH-TO-GITHUB.bat" >nul
set "RC=%ERRORLEVEL%"
if %RC% GEQ 8 (
  echo ERROR: File copy failed.
  pause
  exit /b 1
)

cd /d "%REPO_DIR%"

echo.
echo Checking changes...
git status

git add .
git diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo No new changes to commit.
) else (
  echo.
  echo Creating update commit...
  git commit -m "Update Conscious Cravings application"
  if errorlevel 1 (
    echo Commit failed.
    pause
    exit /b 1
  )
)

echo.
echo Pushing to GitHub...
git push origin main
if errorlevel 1 (
  echo.
  echo Push failed. Run "git pull --rebase origin main" and resolve any conflict shown by Git.
  pause
  exit /b 1
)

echo.
echo ==========================================
echo SUCCESS - GitHub has been updated.
echo ==========================================
echo.
echo Repository:
echo %REPO_URL%
echo.
pause
