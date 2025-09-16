@echo off
echo Enabling firewall rule for Chat NCP Proxy Server...
echo.

powershell -Command "Start-Process powershell -ArgumentList '-File \"%~dp0enable-firewall.ps1\"' -Verb RunAs"

echo.
echo Script executed. Please check the PowerShell window for results.
echo Press any key to exit...
pause >nul