@echo off
cd /d "%~dp0"
node scripts/run_local_tutor.mjs
if errorlevel 1 pause
