import os
import re
import base64

svg_dir = r"c:\Users\thtow\OneDrive\Desktop\Documentos\site-deu-no-main\public\assets\Cores"
downloads_dir = r"c:\Users\thtow\Downloads"

svgs = ["Turquesa.svg", "Preto.svg", "Marrom.svg", "Bege Natural.svg"]

for svg_file in svgs:
    filepath = os.path.join(svg_dir, svg_file)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # find xlink:href=".../Downloads/WhatsApp Image xxxx.jpeg"
    match = re.search(r'xlink:href=".*?Downloads/(WhatsApp Image [^"]*)"', content)
    if match:
        img_filename = match.group(1)
        img_path = os.path.join(downloads_dir, img_filename)
        if os.path.exists(img_path):
            with open(img_path, 'rb') as imgf:
                b64 = base64.b64encode(imgf.read()).decode('utf-8')
            
            # replace xlink:href with the data uri
            new_href = f'xlink:href="data:image/jpeg;base64,{b64}"'
            new_content = content.replace(match.group(0), new_href)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {svg_file} with embedded {img_filename}")
        else:
            print(f"Image not found for {svg_file}: {img_path}")
    else:
        print(f"No match for {svg_file}")
