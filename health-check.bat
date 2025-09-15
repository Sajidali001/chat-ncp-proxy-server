@echo off
echo Chat NCP Proxy Server Health Check
echo ==================================
echo.

powershell -Command "& {try { $response = Invoke-WebRequest -Uri 'http://localhost:7000/health' -Method GET; if ($response.StatusCode -eq 200) { Write-Host '✅ Server is healthy and responding correctly' -ForegroundColor Green } else { Write-Host '❌ Server health check failed with HTTP code: ' $response.StatusCode -ForegroundColor Red } } catch { Write-Host '❌ Server health check failed with error: ' $_.Exception.Message -ForegroundColor Red }}"

echo.
echo For continuous monitoring, consider using PM2 or a monitoring service.