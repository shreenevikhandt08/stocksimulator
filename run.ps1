# Start the SNS Capital desk (reads HOST/PORT from backend/.env or process env)
Set-Location $PSScriptRoot\backend

function Get-DotEnvValue {
  param([string]$Key, [string]$Default = "")
  $paths = @(
    (Join-Path $PSScriptRoot ".env"),
    (Join-Path $PSScriptRoot "backend\.env")
  )
  foreach ($p in $paths) {
    if (-not (Test-Path $p)) { continue }
    foreach ($line in Get-Content $p) {
      $t = $line.Trim()
      if (-not $t -or $t.StartsWith("#") -or ($t.IndexOf("=") -lt 1)) { continue }
      $idx = $t.IndexOf("=")
      $k = $t.Substring(0, $idx).Trim()
      if ($k -eq $Key) {
        return $t.Substring($idx + 1).Trim().Trim('"').Trim("'")
      }
    }
  }
  return $Default
}

$HostBind = if ($env:HOST) { $env:HOST } else { Get-DotEnvValue "HOST" "127.0.0.1" }
$Port = if ($env:PORT) { $env:PORT } else { Get-DotEnvValue "PORT" "8000" }
$BaseUrl = if ($HostBind -eq "0.0.0.0") { "http://127.0.0.1:$Port" } else { "http://${HostBind}:$Port" }

function Test-Desk {
  try {
    $r = Invoke-WebRequest -Uri "$BaseUrl/api/health" -UseBasicParsing -TimeoutSec 2
    return $r.StatusCode -eq 200
  } catch {
    return $false
  }
}

if (Test-Desk) {
  Write-Host "Already running: $BaseUrl"
  exit 0
}

if (-not (Test-Path .\.venv\Scripts\python.exe)) {
  python -m venv .venv
  .\.venv\Scripts\pip install -r requirements.txt
}

Write-Host "Desk: $BaseUrl  (bind ${HostBind}:${Port})"
.\.venv\Scripts\python -m uvicorn app.main:app --host $HostBind --port $Port
if ($LASTEXITCODE -ne 0) {
  if (Test-Desk) {
    Write-Host "Already running: $BaseUrl"
    exit 0
  }
  exit $LASTEXITCODE
}
