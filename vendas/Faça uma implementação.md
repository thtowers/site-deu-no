Faça uma implementação completa de um Admin de Controle de Vendas para um site de acessórios/semijoias, com foco em gestão financeira, análise de vendas e tomada de decisão.

O sistema precisa ser intuitivo, moderno e muito fácil de usar no dia a dia.

OBJETIVO:
Criar um painel administrativo onde eu consiga controlar vendas, lucro real das peças, clientes, desempenho dos produtos e comparar resultados mensais.

### 1. MÓDULO DE CADASTRO DE PRODUTOS

Criar um cadastro de produtos (ex: colares, brincos, pulseiras etc.) contendo:

- Nome da peça
- Categoria (colar, brinco, pulseira, anel etc.)
- SKU (automático)
- Foto da peça
- Valor total da peça (preço de venda)
- Custo da peça
- Valor da mão de obra
- Lucro automático

Lógica do lucro:

Lucro = Valor Total da Peça - (Custo da Peça + Mão de Obra)

Exibir automaticamente:
- Valor investido
- Margem de lucro (%)
- Lucro bruto por peça

O admin deve mostrar visualmente se uma peça possui:
- lucro alto
- lucro médio
- lucro baixo

Exemplo:
Verde = alta margem
Amarelo = média
Vermelho = margem baixa

### 2. MÓDULO DE VENDAS

Criar uma tela de registro de vendas simples e rápida.

Campos da venda:

- Produto vendido (ex: Colar X)
- Nome do cliente
- Data da venda
- Quantidade
- Tipo de cliente:
  - Varejo
  - Atacado
- Forma de pagamento:
  - PIX
  - Cartão
  - Dinheiro
  - Boleto
  - Parcelado
- Valor vendido
- Lucro da venda
- Observações opcionais

Regras importantes:

Se for atacado:
- permitir preço diferente do varejo
- mostrar margem real de lucro

Ao registrar venda:
- atualizar estoque automaticamente
- atualizar métricas do dashboard

### 3. DASHBOARD DE VENDAS (PRIORIDADE ALTA)

Criar um dashboard visual e inteligente.

KPIs principais:

- Total vendido no mês
- Lucro do mês
- Quantidade de colares vendidos no mês
- Ticket médio
- Produto mais vendido
- Produto com maior lucro
- Melhor categoria do mês
- Total vendido no varejo
- Total vendido no atacado

Gráficos:

1. Evolução de vendas por mês
(gráfico de linha)

2. Comparativo entre meses
Exemplo:
Janeiro x Fevereiro

Mostrar:
- crescimento %
- queda %
- diferença em faturamento
- diferença em lucro

3. Produtos mais vendidos
(gráfico de barras)

Mostrar:
- quantidade vendida
- faturamento
- lucro gerado

4. Distribuição por forma de pagamento
(gráfico pizza/donut)

### 4. RELATÓRIOS

Criar relatórios filtráveis por:

- mês
- período
- produto
- cliente
- atacado/varejo
- forma de pagamento

Exportar:
- PDF
- Excel

### 5. LÓGICA DE INTELIGÊNCIA DE NEGÓCIO

O sistema deve responder perguntas automaticamente no dashboard, como:

"Qual colar vendeu mais esse mês?"

"Qual peça deu mais lucro?"

"Estou vendendo mais no atacado ou varejo?"

"Meu faturamento aumentou ou caiu comparado ao mês anterior?"

"Qual categoria está performando melhor?"

"Quais produtos têm baixa margem?"

"Quanto lucrei líquido esse mês?"

### 6. EXPERIÊNCIA DO ADMIN

Interface inspirada em dashboards modernos de e-commerce.

Criar:

- Dashboard principal
- Página de vendas
- Página de produtos
- Página de clientes
- Relatórios
- Financeiro

UX importante:
- Poucos cliques
- Cadastro rápido
- Visual limpo
- Busca rápida
- Filtros avançados
- Mobile responsivo

### 7. MODELAGEM DE BANCO DE DADOS

Criar estrutura escalável para:

TABELA PRODUTOS
- id
- nome
- categoria
- custo
- mão_obra
- valor_venda
- lucro
- estoque
- created_at

TABELA VENDAS
- id
- produto_id
- cliente
- tipo_cliente
- pagamento
- quantidade
- valor_venda
- lucro
- created_at

TABELA CLIENTES
- id
- nome
- telefone
- tipo_cliente
- total_compras

### 8. DIFERENCIAL IMPORTANTE

Adicionar insights automáticos no dashboard, por exemplo:

“Suas vendas cresceram 23% em relação ao mês passado.”

“Colar Amá foi o produto mais vendido este mês.”

“Atacado representou 41% do faturamento.”

“Seu lucro caiu 12% devido ao aumento do custo.”

A implementação deve priorizar:
- escalabilidade
- boa UX
- performance
- arquitetura limpa
- organização intuitiva do admin
- lógica real de negócio
