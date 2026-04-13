@echo off
echo Copiando imagem chocolate.jpeg...
echo.

set "SOURCE=C:\Users\Thiago\Desktop\P.A.R.A\1. Projetos - com Prazos\Deu Nó Site 💻\Logo\Pessoas\chocolate.jpeg"
set "DEST=%~dp0public\Logo\Pessoas\chocolate.jpeg"

if not exist "%SOURCE%" (
    echo ERRO: Arquivo fonte nao encontrado!
    echo Procurando em: %SOURCE%
    pause
    exit /b 1
)

if not exist "%~dp0public\Logo\Pessoas" (
    mkdir "%~dp0public\Logo\Pessoas"
)

copy "%SOURCE%" "%DEST%" /Y

if exist "%DEST%" (
    echo.
    echo Sucesso! Imagem copiada para:
    echo %DEST%
) else (
    echo.
    echo ERRO: Falha ao copiar a imagem!
)

echo.
pause
