@echo off
setlocal enabledelayedexpansion

echo Installing packages...
call npm install

echo Cleaning...
call npm run clean

echo Linting...
call npm run lint

echo Building...
call npm run build
