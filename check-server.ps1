# Check if TypeGPT Proxy Server is running
Write-Host "Checking TypeGPT Proxy Server status..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://192.168.1.249:7000/health" -Method GET
    if ($response.StatusCode -eq 200) {
        $content = $response.Content | ConvertFrom-Json
        Write-Host "✅ Server is running!" -ForegroundColor Green
        Write-Host "Status: $($content.status)" -ForegroundColor Cyan
        Write-Host "Message: $($content.message)" -ForegroundColor Cyan
        Write-Host "Access the dashboard at: http://192.168.1.249:7000" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Server returned status code: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Server is not accessible. Please make sure it's running." -ForegroundColor Red
    Write-Host "Start the server by running: start-server.bat" -ForegroundColor Yellow
}