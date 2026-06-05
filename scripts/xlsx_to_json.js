#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Para poder verificar os argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length < 1) {
  console.log("Uso:");
  console.log("  1. Listar abas da planilha:");
  console.log("     node scripts/xlsx_to_json.js <arquivo_excel.xlsx>");
  console.log("  2. Converter uma aba específica para JSON (nome automático da aba):");
  console.log("     node scripts/xlsx_to_json.js <arquivo_excel.xlsx> <nome_ou_indice_da_aba>");
  console.log("  3. Converter TODAS as abas para arquivos JSON individuais:");
  console.log("     node scripts/xlsx_to_json.js <arquivo_excel.xlsx> all");
  console.log("  4. Converter com caminho de destino personalizado:");
  console.log("     node scripts/xlsx_to_json.js <arquivo_excel.xlsx> <arquivo_destino.json> <nome_ou_indice_da_aba>");
  process.exit(1);
}

const xlsxPath = args[0];

// Importação dinâmica do 'xlsx' para poder exibir uma mensagem amigável caso não esteja instalado
try {
  const { default: XLSX } = await import('xlsx');
  
  if (!fs.existsSync(xlsxPath)) {
    console.error(`Erro: Arquivo Excel não encontrado: ${xlsxPath}`);
    process.exit(1);
  }

  // Lê o arquivo Excel
  const workbook = XLSX.readFile(xlsxPath);

  // Se forneceu apenas o arquivo Excel, lista as abas disponíveis
  if (args.length === 1) {
    console.log(`\nPlanilhas (abas) encontradas em '${xlsxPath}':`);
    workbook.SheetNames.forEach((name, idx) => {
      console.log(`  [${idx}] ${name}`);
    });
    console.log("\nPara converter uma aba específica, execute:");
    console.log(`  node scripts/xlsx_to_json.js "${xlsxPath}" "NomeDaAba"`);
    console.log("Para converter todas as abas de uma vez, execute:");
    console.log(`  node scripts/xlsx_to_json.js "${xlsxPath}" all`);
    process.exit(0);
  }

  const excelDir = path.dirname(xlsxPath);

  // Se o usuário quer converter TODAS as abas
  if (args.length === 2 && args[1].toLowerCase() === 'all') {
    console.log(`\nConvertendo todas as abas de '${xlsxPath}'...`);
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const sanitizedSheetName = sheetName.replace(/[\\/:*?"<>|]/g, "_");
      const jsonPath = path.join(excelDir, `${sanitizedSheetName}.json`);
      
      fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`  ✓ Aba [${sheetName}] convertida para '${jsonPath}'`);
    });
    console.log("\n✓ Concluído! Todas as abas foram convertidas com sucesso.");
    process.exit(0);
  }

  let jsonPath;
  let targetSheet;

  if (args.length === 2) {
    // Se o segundo argumento terminar com .json, trata como arquivo de destino personalizado e assume aba 0
    if (args[1].endsWith('.json')) {
      jsonPath = args[1];
      targetSheet = 0;
    } else {
      // Caso contrário, trata como o nome ou índice da aba, e o destino será automático
      targetSheet = args[1];
      
      // Resolve o nome real da aba para usá-lo como nome do arquivo JSON
      let resolvedSheetName = targetSheet;
      if (!isNaN(targetSheet)) {
        const sheetIndex = parseInt(targetSheet, 10);
        resolvedSheetName = workbook.SheetNames[sheetIndex];
        if (!resolvedSheetName) {
          console.error(`Erro: Aba de índice ${sheetIndex} não encontrada. Abas disponíveis: ${workbook.SheetNames.join(', ')}`);
          process.exit(1);
        }
      } else {
        if (!workbook.SheetNames.includes(targetSheet)) {
          console.error(`Erro: Aba '${targetSheet}' não encontrada. Abas disponíveis: ${workbook.SheetNames.join(', ')}`);
          process.exit(1);
        }
      }
      
      const sanitizedSheetName = resolvedSheetName.replace(/[\\/:*?"<>|]/g, "_");
      jsonPath = path.join(excelDir, `${sanitizedSheetName}.json`);
      targetSheet = resolvedSheetName;
    }
  } else {
    // Caso tenha 3 ou mais argumentos (ex: node script.js planilha.xlsx destino.json "Minha Aba")
    jsonPath = args[1];
    targetSheet = args[2];
  }

  // Resolve qual aba ler (por índice ou por nome) para a conversão
  let sheetName = targetSheet;
  if (!isNaN(targetSheet)) {
    const sheetIndex = parseInt(targetSheet, 10);
    sheetName = workbook.SheetNames[sheetIndex];
    if (!sheetName) {
      console.error(`Erro: Aba de índice ${sheetIndex} não encontrada. Abas disponíveis: ${workbook.SheetNames.join(', ')}`);
      process.exit(1);
    }
  } else {
    if (!workbook.SheetNames.includes(targetSheet)) {
      console.error(`Erro: Aba '${targetSheet}' não encontrada. Abas disponíveis: ${workbook.SheetNames.join(', ')}`);
      process.exit(1);
    }
  }

  const worksheet = workbook.Sheets[sheetName];
  
  // Converte a aba para JSON (lista de objetos)
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  // Salva no arquivo de destino
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
  console.log(`✓ Sucesso! '${xlsxPath}' [Aba: ${sheetName}] convertido para '${jsonPath}'`);
} catch (err) {
  if (err.code === 'ERR_MODULE_NOT_FOUND' || err.message.includes('Cannot find package')) {
    console.error("Erro: A biblioteca 'xlsx' (SheetJS) não está instalada no projeto.");
    console.error("Instale-a executando:");
    console.error("  npm install xlsx");
  } else {
    console.error("Erro ao converter:", err.message);
  }
  process.exit(1);
}
