/* global Chart */
// charts.js - Módulo de Visualização de Gráficos Financeiros e de Vendas "Deu Nó"

const Charts = {
  // Instâncias dos gráficos salvos para destruição segura
  instances: {
    evolucao: null,
    comparativo: null,
    produtos: null,
    pagamentos: null
  },

  // Cores do Design System Deu Nó aplicadas aos Gráficos (Tema Light Luxury)
  colors: {
    accent: '#3f4d41',         // Verde Oliva Profundo (Marca)
    accentGlow: 'rgba(63, 77, 65, 0.15)',
    accentSolid: '#526354',
    success: '#78877a',        // Verde Oliva Claro
    successGlow: 'rgba(120, 135, 122, 0.15)',
    danger: '#b84a39',         // Terracota / Vermelho Queimado
    dangerGlow: 'rgba(184, 74, 57, 0.15)',
    info: '#356075',           // Azul Slate / Oceano
    purple: '#6a526e',         // Ameixa Terroso
    gridLines: 'rgba(63, 77, 65, 0.06)', // Linhas finas oliva-claras
    text: '#5c625c'            // Cinza-esverdeado suave para legendas
  },

  // 1. INICIALIZADOR PRINCIPAL DOS GRÁFICOS
  init(vendas) {
    this.renderEvolucao(vendas);
    this.renderComparativo(vendas);
    this.renderProdutos(vendas);
    this.renderPagamentos(vendas);
  },

  // 2. FUNÇÃO DE ATUALIZAÇÃO RÁPIDA (CHAMADA QUANDO HOUVER ALTERAÇÕES DE DADOS)
  update(vendas) {
    this.init(vendas);
  },

  // 3. GRÁFICO 1: EVOLUÇÃO DE VENDAS POR MÊS (LINHA COM GRADIENTE)
  renderEvolucao(vendas) {
    const canvas = document.getElementById('chart-evolucao');
    if (!canvas) return;

    if (this.instances.evolucao) {
      this.instances.evolucao.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    // Processamento de dados: agrupar faturamento por mês
    const faturamentoPorMes = this.agruparFinanceiroPorMes(vendas);
    const labels = Object.keys(faturamentoPorMes);
    const valores = Object.values(faturamentoPorMes).map(item => item.faturamento);

    // Gradiente abaixo da linha (Verde Oliva -> Creme transparente)
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(63, 77, 65, 0.25)');
    gradient.addColorStop(1, 'rgba(250, 249, 247, 0.00)');

    this.instances.evolucao = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Faturamento Bruto (R$)',
          data: valores,
          borderColor: this.colors.accent,
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4, // Curva suave
          pointBackgroundColor: this.colors.accent,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: this.getGlobalOptions()
    });
  },

  // 4. GRÁFICO 2: COMPARATIVO ENTRE MESES (BARRAS LADO A LADO - FATURAMENTO X LUCRO)
  renderComparativo(vendas) {
    const canvas = document.getElementById('chart-comparativo');
    if (!canvas) return;

    if (this.instances.comparativo) {
      this.instances.comparativo.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    const dadosMensais = this.agruparFinanceiroPorMes(vendas);
    const labels = Object.keys(dadosMensais);
    const faturamentos = Object.values(dadosMensais).map(item => item.faturamento);
    const lucros = Object.values(dadosMensais).map(item => item.lucro);

    // Gradientes das Barras
    const gradFaturamento = ctx.createLinearGradient(0, 0, 0, 250);
    gradFaturamento.addColorStop(0, '#356075'); // Azul Slate
    gradFaturamento.addColorStop(1, 'rgba(53, 96, 117, 0.2)');

    const gradLucro = ctx.createLinearGradient(0, 0, 0, 250);
    gradLucro.addColorStop(0, '#3f4d41'); // Verde Oliva
    gradLucro.addColorStop(1, 'rgba(63, 77, 65, 0.2)');

    this.instances.comparativo = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Faturamento',
            data: faturamentos,
            backgroundColor: gradFaturamento,
            borderColor: this.colors.info,
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Lucro Líquido',
            data: lucros,
            backgroundColor: gradLucro,
            borderColor: this.colors.accent,
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: this.getGlobalOptions()
    });
  },

  // 5. GRÁFICO 3: PRODUTOS MAIS VENDIDOS (BARRAS HORIZONTAIS)
  renderProdutos(vendas) {
    const canvas = document.getElementById('chart-produtos');
    if (!canvas) return;

    if (this.instances.produtos) {
      this.instances.produtos.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    // Obter ranking de vendas de produtos
    const ranking = {};
    vendas.forEach(v => {
      if (!ranking[v.produto_nome]) {
        ranking[v.produto_nome] = { qtd: 0, faturamento: 0, lucro: 0 };
      }
      ranking[v.produto_nome].qtd += v.quantidade;
      ranking[v.produto_nome].faturamento += v.valor_venda;
      ranking[v.produto_nome].lucro += v.lucro;
    });

    // Ordenar por faturamento descendente e pegar top 5
    const topProdutos = Object.entries(ranking)
      .sort((a, b) => b[1].faturamento - a[1].faturamento)
      .slice(0, 5);

    const labels = topProdutos.map(item => item[0]);
    const faturamentos = topProdutos.map(item => item[1].faturamento);
    const lucros = topProdutos.map(item => item[1].lucro);

    this.instances.produtos = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Faturamento (R$)',
            data: faturamentos,
            backgroundColor: 'rgba(63, 77, 65, 0.85)', // Oliva
            borderColor: this.colors.accent,
            borderWidth: 1,
            borderRadius: 3
          },
          {
            label: 'Lucro Gerado (R$)',
            data: lucros,
            backgroundColor: 'rgba(194, 157, 56, 0.85)', // Ocre Dourado Deu Nó
            borderColor: '#c29d38',
            borderWidth: 1,
            borderRadius: 3
          }
        ]
      },
      options: {
        indexAxis: 'y', // Inverter para barras horizontais
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: this.colors.text,
              font: { family: 'Poppins', size: 11 }
            }
          },
          tooltip: {
            backgroundColor: '#1c241e',
            titleColor: '#ffffff',
            bodyColor: '#e8e6e3',
            borderColor: 'rgba(63, 77, 65, 0.2)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: R$ ${context.raw.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: this.colors.gridLines },
            ticks: {
              color: this.colors.text,
              font: { family: 'Poppins', size: 10 },
              callback: function(value) { return 'R$ ' + value; }
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#1c241e',
              font: { family: 'Playfair Display', size: 12, weight: '600' }
            }
          }
        }
      }
    });
  },

  // 6. GRÁFICO 4: DISTRIBUIÇÃO POR FORMA DE PAGAMENTO (DONUT)
  renderPagamentos(vendas) {
    const canvas = document.getElementById('chart-pagamentos');
    if (!canvas) return;

    if (this.instances.pagamentos) {
      this.instances.pagamentos.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    const pagamentos = { PIX: 0, Cartão: 0, Dinheiro: 0 };
    vendas.forEach(v => {
      if (pagamentos[v.pagamento] !== undefined) {
        pagamentos[v.pagamento] += v.valor_venda;
      }
    });

    const labels = Object.keys(pagamentos);
    const valores = Object.values(pagamentos);

    this.instances.pagamentos = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: valores,
          backgroundColor: [
            '#3f4d41', // Verde Oliva Profundo (PIX)
            '#356075', // Azul Slate (Cartão)
            '#c29d38'  // Ocre Dourado (Dinheiro)
          ],
          borderColor: '#ffffff', // Borda branca entre as fatias no Light Mode
          borderWidth: 2,
          hoverOffset: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: this.colors.text,
              font: { family: 'Poppins', size: 11 }
            }
          },
          tooltip: {
            backgroundColor: '#1c241e',
            titleColor: '#ffffff',
            bodyColor: '#e8e6e3',
            borderColor: 'rgba(63, 77, 65, 0.2)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const valor = context.raw;
                const pct = total > 0 ? ((valor / total) * 100).toFixed(1) : 0;
                return ` ${context.label}: R$ ${valor.toFixed(2)} (${pct}%)`;
              }
            }
          }
        },
        cutout: '65%' // Efeito de rosca/donut fino luxuoso
      }
    });
  },

  // 7. FUNÇÃO UTILITÁRIA DE COMPORTAMENTO GLOBAL DOS GRÁFICOS
  getGlobalOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: this.colors.text,
            font: { family: 'Poppins', size: 11 }
          }
        },
        tooltip: {
          backgroundColor: '#1c241e',
          titleColor: '#ffffff',
          bodyColor: '#e8e6e3',
          borderColor: 'rgba(63, 77, 65, 0.2)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: R$ ${context.raw.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: this.colors.gridLines },
          ticks: {
            color: this.colors.text,
            font: { family: 'Poppins', size: 11 }
          }
        },
        y: {
          grid: { color: this.colors.gridLines },
          ticks: {
            color: this.colors.text,
            font: { family: 'Poppins', size: 11 },
            callback: function(value) { return 'R$ ' + value; }
          }
        }
      }
    };
  },

  // 8. FUNÇÃO UTILITÁRIA DE AGRUPAMENTO MENSAL
  agruparFinanceiroPorMes(vendas) {
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const resultado = {};

    resultado['Março'] = { faturamento: 0, lucro: 0 };
    resultado['Abril'] = { faturamento: 0, lucro: 0 };
    resultado['Maio'] = { faturamento: 0, lucro: 0 };

    vendas.forEach(v => {
      const data = new Date(v.created_at);
      const nomeMes = nomesMeses[data.getMonth()];
      
      if (!resultado[nomeMes]) {
        resultado[nomeMes] = { faturamento: 0, lucro: 0 };
      }
      
      resultado[nomeMes].faturamento += parseFloat(v.valor_venda);
      resultado[nomeMes].lucro += parseFloat(v.lucro);
    });

    Object.keys(resultado).forEach(mes => {
      if (resultado[mes].faturamento === 0 && resultado[mes].lucro === 0 && mes !== 'Março' && mes !== 'Abril' && mes !== 'Maio') {
        delete resultado[mes];
      }
    });

    return resultado;
  }
};
