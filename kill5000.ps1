$conns = Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -eq 5000 }
if ($conns) {
    $pids5000 = $conns.OwningProcess | Sort-Object -Unique
    foreach ($p in $pids5000) {
        Write-Host "Killing PID $p"
        Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 3
}
$still = Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -eq 5000 }
if ($still) { Write-Host "WARNING: port 5000 still in use" } else { Write-Host "OK: port 5000 free" }
