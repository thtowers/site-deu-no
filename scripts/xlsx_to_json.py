#!/usr/bin/env python3
import sys
import os

try:
    import pandas as pd
except ImportError:
    print("Erro: A biblioteca 'pandas' não está instalada.")
    print("Instale executando: pip install pandas openpyxl")
    sys.exit(1)

def convert_xlsx_to_json(xlsx_path, json_path, sheet_name=0):
    if not os.path.exists(xlsx_path):
        print(f"Erro: Arquivo Excel não encontrado: {xlsx_path}")
        sys.exit(1)
        
    try:
        # Lê o Excel usando pandas
        # openpyxl é necessário para ler arquivos .xlsx no pandas
        df = pd.read_excel(xlsx_path, sheet_name=sheet_name)
        
        # Converte para JSON
        # orient='records' exporta como uma lista de objetos: [{col1: val1, col2: val2}, ...]
        df.to_json(json_path, orient='records', force_ascii=False, indent=4)
        print(f"✓ Sucesso! '{xlsx_path}' [Aba: {sheet_name}] convertido para '{json_path}'")
    except Exception as e:
        print(f"Erro na conversão: {e}")
        print("Certifique-se de que a biblioteca 'openpyxl' está instalada: pip install openpyxl")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso:")
        print("  1. Listar abas da planilha:")
        print("     python3 scripts/xlsx_to_json.py <arquivo_excel.xlsx>")
        print("  2. Converter uma aba específica para JSON (nome automático da aba):")
        print("     python3 scripts/xlsx_to_json.py <arquivo_excel.xlsx> <nome_ou_indice_da_aba>")
        print("  3. Converter TODAS as abas para arquivos JSON individuais:")
        print("     python3 scripts/xlsx_to_json.py <arquivo_excel.xlsx> all")
        print("  4. Converter com caminho de destino personalizado:")
        print("     python3 scripts/xlsx_to_json.py <arquivo_excel.xlsx> <arquivo_destino.json> <nome_ou_indice_da_aba>")
        sys.exit(1)
        
    xlsx_file = sys.argv[1]
    
    if not os.path.exists(xlsx_file):
        print(f"Erro: Arquivo Excel não encontrado: {xlsx_file}")
        sys.exit(1)
        
    # Se forneceu apenas o arquivo Excel, lista as abas disponíveis
    if len(sys.argv) == 2:
        try:
            xl = pd.ExcelFile(xlsx_file)
            print(f"\nPlanilhas (abas) encontradas em '{xlsx_file}':")
            for idx, name in enumerate(xl.sheet_names):
                print(f"  [{idx}] {name}")
            print("\nPara converter uma aba específica, execute:")
            print(f"  python3 scripts/xlsx_to_json.py \"{xlsx_file}\" \"NomeDaAba\"")
            print("Para converter todas as abas de uma vez, execute:")
            print(f"  python3 scripts/xlsx_to_json.py \"{xlsx_file}\" all")
        except ImportError:
            print("Erro: A biblioteca 'pandas' ou 'openpyxl' não está instalada.")
            print("Instale executando: pip install pandas openpyxl")
        except Exception as e:
            print(f"Erro ao ler as abas: {e}")
        sys.exit(0)
        
    # Tratamento para 2 ou mais argumentos
    if len(sys.argv) == 3:
        # Se o segundo argumento é "all", converte todas as abas
        if sys.argv[2].lower() == 'all':
            try:
                xl = pd.ExcelFile(xlsx_file)
                sheet_names = xl.sheet_names
            except Exception as e:
                print(f"Erro ao ler as abas: {e}")
                sys.exit(1)
                
            print(f"\nConvertendo todas as abas de '{xlsx_file}'...")
            excel_dir = os.path.dirname(xlsx_file)
            for sheet_name in sheet_names:
                sanitized = "".join(c for c in sheet_name if c not in '\\/:*?"<>|')
                json_file = os.path.join(excel_dir, f"{sanitized}.json")
                convert_xlsx_to_json(xlsx_file, json_file, sheet_name)
            print("\n✓ Concluído! Todas as abas foram convertidas com sucesso.")
            sys.exit(0)
            
        # Se o segundo argumento termina com .json, é o arquivo de destino
        elif sys.argv[2].endswith('.json'):
            json_file = sys.argv[2]
            sheet = 0
        else:
            # Caso contrário, é o nome/índice da aba e geramos o JSON na mesma pasta
            target_sheet = sys.argv[2]
            
            try:
                xl = pd.ExcelFile(xlsx_file)
                sheet_names = xl.sheet_names
            except Exception as e:
                print(f"Erro ao ler as abas: {e}")
                sys.exit(1)
                
            resolved_sheet_name = target_sheet
            if target_sheet.isdigit():
                sheet_idx = int(target_sheet)
                if sheet_idx < len(sheet_names):
                    resolved_sheet_name = sheet_names[sheet_idx]
                else:
                    print(f"Erro: Aba de índice {sheet_idx} não encontrada.")
                    sys.exit(1)
            else:
                if target_sheet not in sheet_names:
                    print(f"Erro: Aba '{target_sheet}' não encontrada.")
                    sys.exit(1)
                    
            # Sanatizar nome da aba para nome do arquivo
            sanitized = "".join(c for c in resolved_sheet_name if c not in '\\/:*?"<>|')
            excel_dir = os.path.dirname(xlsx_file)
            json_file = os.path.join(excel_dir, f"{sanitized}.json")
            sheet = resolved_sheet_name
    else:
        json_file = sys.argv[2]
        sheet = sys.argv[3]
        
    # Se sheet for um número, converte para int
    if isinstance(sheet, str) and sheet.isdigit():
        sheet = int(sheet)
        
    convert_xlsx_to_json(xlsx_file, json_file, sheet)
