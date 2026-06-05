# Relatório de Implementação: Módulo de Gestão de Insumos, Matéria-Prima & Ficha Técnica (Deu Nó)

Este documento apresenta a especificação técnica e o resumo simplificado de todas as funcionalidades, lógicas de negócios, fluxos de persistência e melhorias estruturais implementadas no dia de hoje na SPA de administração de vendas.

---

## 1. Resumo Técnico (Especificação de Engenharia)

### 1.1. Arquitetura da Persistência de Dados (`vendas/db.js`)
* **Mapeamento de Chaves:** Adição da chave de persistência `LOCAL_KEYS.INSUMOS` mapeada para `'site_semijoias_insumos'`.
* **CRUD de Insumos:** 
  * `getInsumos()`: Retorna o array de insumos ordenado alfabeticamente por Nome e por Especificação.
  * `salvarInsumo(insumo)`: Recebe o objeto insumo, realiza o parser seguro de números de ponto flutuante, gera identificador único sequencial (`i_timestamp`) e persiste no banco local.
  * `deletarInsumo(id)`: Remove a referência pelo identificador único e atualiza o estado local.
* **Modelo Associativo de Ficha Técnica (BOM):** Em vez de tabelas associativas e relacionais complexas, a composição da peça acabada é acoplada diretamente como um atributo `composicao` (tipo `Array` de `Object`) dentro de cada produto acabado, no formato:
  ```json
  composicao: [
    { "insumo_id": "i1", "quantidade": 1.25 },
    { "insumo_id": "i3", "quantidade": 2.00 }
  ]
  ```
* **Dados Sementes (Seeder):** Implementação de carga de dados padrão contendo registros reais de Cordas Náuticas de 4mm (Verde Militar e Caramelo), Argolas de Metal de 20mm (Ouro e Prata) e Pingentes de Resina para testes imediatos.

### 1.2. Integrações do Controlador SPA (`vendas/app.js`)
* **Estado Global e Carregamento:** 
  * Extensão do estado global (`App.state.insumos` e `App.state.filtros.insumos`) para suporte imediato às operações em memória.
  * Chamada paralela em `carregarDados()` garantindo sincronismo antes da inicialização do painel.
* **Roteador SPA:** Injeção da rota `#sec-insumos` e tratamento de transição de abas na barra de menu lateral.
* **Tabela de Insumos Reativa:** Renderização dinâmica calculando o limite físico de estoque:
  * **Status Crítico (Estoque Mínimo ou inferior):** `estoque_atual <= estoque_minimo` (Vermelho).
  * **Status Alerta (Até 50% acima do mínimo):** `estoque_atual <= estoque_minimo * 1.5` (Amarelo).
  * **Status Saudável:** Qualquer valor acima do alerta (Verde).
* **Ficha Técnica Interativa no Modal:** 
  * Adição de linhas dinâmicas de composição integradas a seletores HTML preenchidos com os insumos ativos do estado.
  * Ouvintes reativos de eventos (`input` e `change`) recalculando frações de custo monetário de insumo individual (`custo = preço * quantidade`).
  * Função `recalcularCustosFichaTecnica()` que soma o custo de todos os insumos da composição e altera de forma automatizada o input de custo do produto (`#prod-custo`), disparando a calculadora de lucros e margens desejadas (Varejo e Atacado) do produto acabado de forma fluida.
* **Persistência de Composição de Insumo:** 
  * Atualização do preenchimento do modal de edição de produto para recuperar e desenhar a composição original.
  * Coleta reativa da ficha técnica do DOM no envio do formulário de produto.

### 1.3. Lógica de Baixa Proporcional Pós-Transação
* Ao registrar uma venda bem-sucedida em `handleSubmitVenda()`, o sistema detecta se o produto vendido possui uma ficha técnica de insumos associada.
* Se sim, percorre a composição e deduz proporcionalmente o estoque de cada insumo físico com base na quantidade de peças vendidas:
  $$\text{Novo Estoque Insumo} = \text{Estoque Atual} - (\text{Quantidade Consumida na Peça} \times \text{Quantidade de Peças Vendidas})$$
* Persiste o novo saldo do insumo na base local e atualiza os componentes de UI de forma imediata.

### 1.4. Previsibilidade de Ruptura (Alertas de Estoque)
* Varredura contínua do status físico dos insumos agregada à geração de insights do Dashboard.
* Injeção automatizada de balhas de alerta visual contendo o nome do insumo, especificação e quantidade física restante direta no topo do painel de insights do Dashboard toda vez que um insumo atinge limite Crítico.

### 1.5. Resiliência e Blindagem contra Erros de Tipos (Bug Fix)
* Correção e blindagem de conversores monetários nas funções `renderizarTabelaProdutos()`, `renderizarTabelaVendas()` e `renderizarTabelaInsumos()`.
* Substituição de chamadas diretas a métodos numéricos por validações robustas com fallbacks seguros (`parseFloat(valor) || 0`), prevenindo erros de execução (`TypeError`) decorrentes de dados legados vazios ou parciais de testes anteriores gravados no LocalStorage.

---

## 2. Resumo Simples (Visão Geral de Negócios)

### 2.1. Cadastro Completo de Matéria-Prima
Você agora tem controle total sobre os insumos utilizados nas suas semijoias e artesanatos. É possível cadastrar itens como cordas (por metro), argolas e pingentes (por unidade), associando a eles cores, tamanhos, preço de custo e limites de estoque mínimos individuais.

### 2.2. Ficha Técnica e Preço Calculado Automaticamente
Ao criar ou editar um produto no catálogo:
* Você pode listar quais insumos são necessários para produzir aquela peça e a quantidade exata utilizada.
* O sistema calcula o custo dos componentes em tempo real e insere o valor total no campo de custo do produto.
* Os lucros e as margens desejadas de venda (tanto para o varejo quanto para o atacado) são recalculados na hora de forma automática.

### 2.3. Baixa de Estoque sem Esforço
Toda vez que você realizar a venda de um colar ou pulseira, o sistema analisa a ficha técnica daquele produto e deduz automaticamente do seu estoque a quantidade de corda ou argolas utilizada na venda. Você não precisa dar baixa manual de matéria-prima.

### 2.4. Alertas de Compras no Dashboard
O sistema funciona como um assistente de compras. Se a quantidade de alguma corda ou metal cair abaixo do estoque mínimo de segurança, um aviso em vermelho bem destacado aparecerá no painel de insights do seu dashboard, alertando sobre a necessidade imediata de reposição para evitar a parada da produção.

### 2.5. Navegação Segura e Correção do Menu
Todas as tabelas do painel foram blindadas contra dados antigos e incompletos de testes passados. O menu lateral agora navega de forma imediata e 100% livre de travamentos.
