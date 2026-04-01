# Script para iniciar o servidor de desenvolvimento
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $scriptPath

Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Green
npm run dev
