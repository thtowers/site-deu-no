# Pasta Logo

Coloque o arquivo **"Deu Nó.pdf"** nesta pasta.

Depois, execute o script `convert-logo.bat` na raiz do projeto para converter o PDF em PNG.

## Conversão Manual

Se preferir converter manualmente, você pode:

1. **Usar ferramentas online:**
   - https://www.ilovepdf.com/pdf-to-png
   - https://convertio.co/pdf-png/
   - https://www.zamzar.com/convert/pdf-to-png/

2. **Usar Python:**
   ```bash
   pip install PyMuPDF
   python convert-pdf-to-png.py
   ```

3. **Usar Adobe Acrobat ou outras ferramentas:**
   - Abra o PDF
   - Exporte como PNG (300 DPI recomendado)

Após a conversão, o arquivo "Deu Nó.png" será usado automaticamente no header do site.
