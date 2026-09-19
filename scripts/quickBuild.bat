@echo off
setlocal enabledelayedexpansion

echo Cleaning...
call npm run clean

echo Building...
call npm run build
