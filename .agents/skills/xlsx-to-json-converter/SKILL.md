---
name: xlsx-to-json-converter
description: "Use when you need to list, read, or convert Excel (.xlsx) files to JSON. Triggers: convert excel, convert xlsx, read xlsx, export excel to json, list sheets, list abas, xlsx_to_json.js, xlsx_to_json.py."
metadata:
  author: thiago
  version: "1.1.0"
---

# XLSX to JSON Converter

Use this skill when you need to convert Excel (`.xlsx`) spreadsheets to JSON files, list available sheets (abas) in an Excel file, or perform single-sheet/all-sheet extractions.

## Available Scripts

Two scripts are available in the `scripts/` directory:
1. **Node.js (Recommended)**: [xlsx_to_json.js](file:///home/thiago/Documentos/site-deu-no/scripts/xlsx_to_json.js) (using SheetJS)
2. **Python**: [xlsx_to_json.py](file:///home/thiago/Documentos/site-deu-no/scripts/xlsx_to_json.py) (using Pandas + OpenPyXL)

> [!NOTE]
> Since this project is a Node.js project, the **Node.js** script is the recommended method. The `xlsx` library is already installed in the project's `dependencies`.
> The Python script is also available as a fallback but requires `pip install pandas openpyxl` to be run first.

## Usage Guide

### 1. List Sheets (Abas) in an Excel File
To see all the sheets inside an Excel file before converting, run the script with only the input path:

#### Node.js (Recommended)
```bash
node scripts/xlsx_to_json.js <caminho_para_o_arquivo.xlsx>
```

#### Python
```bash
python3 scripts/xlsx_to_json.py <caminho_para_o_arquivo.xlsx>
```

**Example:**
```bash
node scripts/xlsx_to_json.js "vendas/planilha/ÂMAGO.xlsx"
```
*Output:*
```text
Planilhas (abas) encontradas em 'vendas/planilha/ÂMAGO.xlsx':
  [0] MATERIAL
  [1] PULSEIRA (CUSTO)
  [2] BRINCO (CUSTO)
  ...
```

---

### 2. Convert TODAS as Abas (Sheets) at Once
To convert all sheets in the Excel file into individual JSON files in the same directory, pass `"all"` as the second argument:

#### Node.js (Recommended)
```bash
node scripts/xlsx_to_json.js <caminho_para_o_arquivo.xlsx> all
```

#### Python
```bash
python3 scripts/xlsx_to_json.py <caminho_para_o_arquivo.xlsx> all
```

**Example:**
```bash
node scripts/xlsx_to_json.js "vendas/planilha/ÂMAGO.xlsx" all
```
*Creates individual JSON files like `MATERIAL.json`, `MAIO.json`, `JUNHO.json`, etc. inside `vendas/planilha/`.*

---

### 3. Convert a Specific Sheet (Aba) to JSON (Automatic Naming)
To convert a specific sheet and automatically name the output JSON file using the sheet's name in the same directory:

#### Node.js (Recommended)
```bash
node scripts/xlsx_to_json.js <caminho_para_o_arquivo.xlsx> <nome_ou_indice_da_aba>
```

#### Python
```bash
python3 scripts/xlsx_to_json.py <caminho_para_o_arquivo.xlsx> <nome_ou_indice_da_aba>
```

**Example (using Sheet Name):**
```bash
node scripts/xlsx_to_json.js "vendas/planilha/ÂMAGO.xlsx" "MAIO"
```
*Creates: `vendas/planilha/MAIO.json`*

**Example (using Sheet Index):**
```bash
node scripts/xlsx_to_json.js "vendas/planilha/ÂMAGO.xlsx" 0
```
*Creates: `vendas/planilha/MATERIAL.json`*

---

### 4. Convert with a Custom Destination Path
To specify exactly where to save the output JSON file:

#### Node.js (Recommended)
```bash
node scripts/xlsx_to_json.js <caminho_para_o_arquivo.xlsx> <caminho_destino.json> <nome_ou_indice_da_aba>
```

#### Python
```bash
python3 scripts/xlsx_to_json.py <caminho_para_o_arquivo.xlsx> <caminho_destino.json> <nome_ou_indice_da_aba>
```

**Example:**
```bash
node scripts/xlsx_to_json.js "vendas/planilha/ÂMAGO.xlsx" "public/vendas/dados_maio.json" "MAIO"
```

## Troubleshooting & Requirements

- **Node.js (SheetJS)**: Needs the `xlsx` package installed. Since it's in the dependencies list of the project, `npm install` should be enough.
- **Python (Pandas)**: Needs `pandas` and `openpyxl`. Run `pip install pandas openpyxl` to install.
- **Empty JSON `[]` output**: If the source Excel file is corrupt (e.g. composed of null bytes like `COLECÃO FLORESCER.xlsx`), the conversion will produce an empty array `[]`. Check that the file size is non-zero and valid before converting.
