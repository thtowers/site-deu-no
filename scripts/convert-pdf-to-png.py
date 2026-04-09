#!/usr/bin/env python3
"""
Script para converter Deu Nó.pdf para PNG
Requer: pip install pdf2image Pillow
Ou: pip install PyMuPDF
"""

import os
import sys
from pathlib import Path

# Caminhos
base_dir = Path(__file__).parent
logo_dir = base_dir / "public" / "Logo"
pdf_file = logo_dir / "Deu Nó.pdf"
png_file = logo_dir / "Deu Nó.png"

def convert_with_pymupdf():
    """Tenta converter usando PyMuPDF (fitz)"""
    try:
        import fitz  # PyMuPDF
        print("Usando PyMuPDF para converter...")
        
        if not pdf_file.exists():
            print(f"Erro: Arquivo não encontrado: {pdf_file}")
            return False
        
        # Abre o PDF
        doc = fitz.open(pdf_file)
        
        # Pega a primeira página
        page = doc[0]
        
        # Converte para imagem (300 DPI para boa qualidade)
        mat = fitz.Matrix(300/72, 300/72)  # 300 DPI
        pix = page.get_pixmap(matrix=mat)
        
        # Salva como PNG
        pix.save(png_file)
        doc.close()
        
        print(f"✓ Convertido com sucesso: {png_file}")
        return True
    except ImportError:
        print("PyMuPDF não instalado. Tentando pdf2image...")
        return False
    except Exception as e:
        print(f"Erro ao converter com PyMuPDF: {e}")
        return False

def convert_with_pdf2image():
    """Tenta converter usando pdf2image"""
    try:
        from pdf2image import convert_from_path
        print("Usando pdf2image para converter...")
        
        if not pdf_file.exists():
            print(f"Erro: Arquivo não encontrado: {pdf_file}")
            return False
        
        # Converte PDF para imagens (300 DPI)
        images = convert_from_path(pdf_file, dpi=300)
        
        # Salva a primeira página como PNG
        if images:
            images[0].save(png_file, 'PNG')
            print(f"✓ Convertido com sucesso: {png_file}")
            return True
        else:
            print("Erro: Nenhuma imagem gerada do PDF")
            return False
    except ImportError:
        print("pdf2image não instalado. Tentando PyMuPDF...")
        return False
    except Exception as e:
        print(f"Erro ao converter com pdf2image: {e}")
        return False

def convert_with_pillow():
    """Tenta converter usando Pillow (se o PDF for uma imagem)"""
    try:
        from PIL import Image
        print("Tentando abrir PDF como imagem com Pillow...")
        
        if not pdf_file.exists():
            print(f"Erro: Arquivo não encontrado: {pdf_file}")
            return False
        
        # Pillow não suporta PDF diretamente, mas vamos tentar
        # Na verdade, isso não vai funcionar, mas deixamos como fallback
        print("Pillow não suporta PDF diretamente.")
        return False
    except Exception as e:
        print(f"Erro: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Conversor de PDF para PNG")
    print("=" * 50)
    
    # Verifica se o arquivo existe
    if not pdf_file.exists():
        print(f"\n❌ Arquivo não encontrado: {pdf_file}")
        print(f"\nPor favor, coloque o arquivo 'Deu Nó.pdf' na pasta:")
        print(f"   {logo_dir}")
        sys.exit(1)
    
    print(f"\nArquivo encontrado: {pdf_file}")
    print(f"Convertendo para: {png_file}\n")
    
    # Tenta diferentes métodos
    success = False
    
    # Tenta PyMuPDF primeiro (mais rápido e não precisa de poppler)
    if not success:
        success = convert_with_pymupdf()
    
    # Tenta pdf2image (requer poppler)
    if not success:
        success = convert_with_pdf2image()
    
    if not success:
        print("\n" + "=" * 50)
        print("❌ Não foi possível converter o PDF.")
        print("\nPor favor, instale uma das seguintes bibliotecas:")
        print("  1. PyMuPDF: pip install PyMuPDF")
        print("  2. pdf2image: pip install pdf2image")
        print("     (pdf2image também requer poppler: https://github.com/oschwartz10612/poppler-windows/releases)")
        print("\nOu use uma ferramenta online como:")
        print("  - https://www.ilovepdf.com/pdf-to-png")
        print("  - https://convertio.co/pdf-png/")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✓ Conversão concluída com sucesso!")
    print(f"✓ Arquivo PNG criado: {png_file}")
    print("\nAgora você pode atualizar o Header.jsx para usar:")
    print('   src="/Logo/Deu Nó.png"')
