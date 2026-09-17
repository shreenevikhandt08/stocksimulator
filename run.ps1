# Start the SNS Capital desk
Set-Location $PSScriptRoot\backend

function Test-Desk {
  try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/health" -UseBasicParsing -TimeoutSec 2
    return $r.StatusCode -eq 200
  } catch {
    return $false
  }
}

if (Test-Desk) {
  Write-Host "Already running: http://127.0.0.1:8000"
  exit 0
}

if (-not (Test-Path .\.venv\Scripts\python.exe)) {
  python -m venv .venv
  .\.venv\Scripts\pip install -r requirements.txt
}

Write-Host "Desk: http://127.0.0.1:8000"
.\.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
if ($LASTEXITCODE -ne 0) {
  if (Test-Desk) {
    Write-Host "Already running: http://127.0.0.1:8000"
    exit 0
  }
  exit $LASTEXITCODE
}
