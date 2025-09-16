# Enable firewall rule for Chat NCP Proxy Server
# Run this script as Administrator

Write-Host "Enabling firewall rule for Chat NCP Proxy Server on port 7000..." -ForegroundColor Green

try {
    # Create firewall rule for port 7000
    netsh advfirewall firewall add rule name="Chat NCP Proxy Server" dir=in action=allow protocol=TCP localport=7000
    Write-Host "Firewall rule created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Failed to create firewall rule. Please run this script as Administrator." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Press any key to exit..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")