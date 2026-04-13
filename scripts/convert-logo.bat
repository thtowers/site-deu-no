@echo off
echo ========================================
echo Conversor de PDF para PNG
echo ========================================
echo.

REM Verifica se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo Python nao encontrado!
    echo Por favor, instale Python primeiro.
    pause
    exit /b 1
)

REM Verifica se o arquivo PDF existe
if not exist "public\Logo\Deu Nó.pdf" (
    echo.
    echo ERRO: Arquivo nao encontrado!
    echo.
    echo Por favor, coloque o arquivo "Deu Nó.pdf" na pasta:
    echo    public\Logo\
    echo.
    pause
    exit /b 1
)

echo Arquivo encontrado! Convertendo...
echo.

REM Tenta instalar PyMuPDF se não estiver instalado
python -c "import fitz" >nul 2>&1
if errorlevel 1 (
    echo Instalando PyMuPDF...
    pip install PyMuPDF
)

REM Executa o script de conversão
python convert-pdf-to-png.py

echo.
pause
