/* global DB, Charts */
// app.js - Lógica de Negócios, Eventos, Controle SPA e Autenticação

const App = {
  // Estado local para facilitar exibições e filtros rápidos
  state: {
    produtos: [],
    vendas: [],
    clientes: [],
    insumos: [],
    filtros: {
      vendas: { busca: '', mes: 'todos', tipo: 'todos', pagamento: 'todos' },
      produtos: { busca: '', categoria: 'todos' },
      clientes: { busca: '', tipo: 'todos' },
      insumos: { busca: '', tipo: 'todos' }
    }
  },

  // 1. INICIALIZADOR GLOBAL
  async init() {
    this.registerServiceWorkersAndStyles();
    this.bindEvents();
    
    // Configurar manipuladores adicionais de login
    document.getElementById('form-login')?.addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('btn-logout')?.addEventListener('click', (e) => this.handleLogout(e));
    document.getElementById('btn-toggle-password')?.addEventListener('click', () => {
      const input = document.getElementById('login-password');
      const icon = document.getElementById('password-toggle-icon');
      if (input && icon) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'fas fa-eye-slash';
        } else {
          input.type = 'password';
          icon.className = 'fas fa-eye';
        }
      }
    });

    // Carregar dados estáticos e relacionais em segundo plano
    await this.carregarDados();
    this.initSPARouter();

    // Verificação activa de login
    if (this.isUserLoggedIn()) {
      this.exibirPainelAdmin();
      const nomeAdmin = sessionStorage.getItem('deu_no_admin_nome') || 'Administrador';
      this.showToast('Sessão Ativa', `Bem-vindo de volta, ${nomeAdmin}!`, 'success');
    } else {
      this.exibirTelaLogin();
    }
  },

  registerServiceWorkersAndStyles() {
    // Configurar campos do Supabase nas configurações na inicialização
    const config = DB.getSupabaseConfig();
    if (config) {
      const urlInput = document.getElementById('supa-url');
      const keyInput = document.getElementById('supa-key');
      if (urlInput) urlInput.value = config.url;
      if (keyInput) keyInput.value = config.key;
    }
    this.atualizarStatusSupabaseUI();
  },

  // 2. SISTEMA DE AUTENTICAÇÃO (LOGIN & LOGOUT)
  isUserLoggedIn() {
    return sessionStorage.getItem('deu_no_admin_logged') === 'true';
  },

  async handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    if (!user || !pass) {
      this.showToast('Campos Vazios', 'Por favor, digite o usuário e a senha.', 'warning');
      return;
    }

    try {
      const resposta = await DB.validarUsuario(user, pass);
      if (resposta.sucesso) {
        sessionStorage.setItem('deu_no_admin_logged', 'true');
        sessionStorage.setItem('deu_no_admin_nome', resposta.usuario.nome || 'Administrador');
        this.exibirPainelAdmin();
        this.showToast('Login Efetuado', `Olá, ${resposta.usuario.nome || 'Administrador'}! Acesso autorizado.`, 'success');
      } else {
        this.showToast('Acesso Negado', 'Usuário ou senha incorretos. Tente novamente.', 'danger');
      }
    } catch (err) {
      console.error("Erro na autenticação:", err);
      this.showToast('Erro de Conexão', 'Não foi possível validar o acesso.', 'danger');
    }
  },

  handleLogout(e) {
    e.preventDefault();
    if (confirm('Tem certeza que deseja sair e bloquear o painel administrativo?')) {
      sessionStorage.removeItem('deu_no_admin_logged');
      window.location.reload();
    }
  },

  exibirPainelAdmin() {
    const loginContainer = document.getElementById('login-container');
    const mainAppContainer = document.getElementById('main-app-container');
    
    if (loginContainer) loginContainer.style.display = 'none';
    if (mainAppContainer) mainAppContainer.style.display = 'flex';

    // Os gráficos (Canvas) e insights DEVEM carregar após o contêiner principal estar visível (display: flex)
    // para evitar que o Chart.js renderize com altura 0px devido ao container oculto.
    this.atualizarDashboard();
  },

  exibirTelaLogin() {
    const loginContainer = document.getElementById('login-container');
    const mainAppContainer = document.getElementById('main-app-container');
    
    if (loginContainer) loginContainer.style.display = 'flex';
    if (mainAppContainer) mainAppContainer.style.display = 'none';
  },

  // 3. BUSCA DE DADOS E RELACIONAMENTOS
  async carregarDados() {
    this.state.produtos = await DB.getProdutos();
    this.state.vendas = await DB.getVendas();
    this.state.clientes = await DB.getClientes();
    this.state.categorias = await DB.getCategorias();
    this.state.insumos = await DB.getInsumos();
    
    this.popularSelectProdutosFormVenda();
    this.popularSelectsCategorias();
    this.atualizarDatalistClientesFormVenda();
  },

  // 4. ROTEADOR SPA (INTERNA DAS ABAS)
  initSPARouter() {
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSectionId = link.getAttribute('data-target');
        
        navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');

        const sections = document.querySelectorAll('.app-section');
        sections.forEach(sec => sec.classList.remove('active'));
        
        const targetSec = document.getElementById(targetSectionId);
        if (targetSec) {
          targetSec.classList.add('active');
        }

        if (targetSectionId === 'sec-dashboard') {
          this.atualizarDashboard();
        } else if (targetSectionId === 'sec-registrar-venda') {
          this.inicializarDataFormVenda();
        } else if (targetSectionId === 'sec-vendas') {
          this.renderizarTabelaVendas();
        } else if (targetSectionId === 'sec-produtos') {
          this.renderizarTabelaProdutos();
        } else if (targetSectionId === 'sec-clientes') {
          this.renderizarTabelaClientes();
        } else if (targetSectionId === 'sec-insumos') {
          this.renderizarTabelaInsumos();
        } else if (targetSectionId === 'sec-financeiro') {
          this.renderizarAbaFinanceiro();
        }
      });
    });
  },

  navegarParaAba(targetSectionId) {
    const navLink = document.querySelector(`.nav-item[data-target="${targetSectionId}"]`);
    if (navLink) {
      navLink.click();
    }
  },

  inicializarDataFormVenda() {
    const inputData = document.getElementById('venda-data');
    if (inputData && !inputData.value) {
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().substring(0, 16);
      inputData.value = localISOTime;
    }
  },

  // 5. ATUALIZAÇÕES DO DASHBOARD (KPIS E INSIGHTS MENSAIS)
  atualizarDashboard() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    // Análise focada em Maio/2026 conforme dados do Seeder e data atual
    const mesAnalise = 4; // Maio (Base 0)
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise;
    });

    const faturamentoMes = vendasMes.reduce((sum, v) => sum + parseFloat(v.valor_venda), 0);
    const lucroMes = vendasMes.reduce((sum, v) => sum + parseFloat(v.lucro), 0);
    
    const colaresVendidos = vendasMes
      .filter(v => v.produto_nome.toLowerCase().includes('colar') || (v.produtos && v.produtos.categoria === 'Colar'))
      .reduce((sum, v) => sum + v.quantidade, 0);

    const ticketMedio = vendasMes.length > 0 ? faturamentoMes / vendasMes.length : 0;

    const totalVarejo = vendasMes.filter(v => v.tipo_cliente === 'varejo').reduce((sum, v) => sum + v.valor_venda, 0);
    const totalAtacado = vendasMes.filter(v => v.tipo_cliente === 'atacado').reduce((sum, v) => sum + v.valor_venda, 0);

    this.setDOMText('kpi-faturamento', `R$ ${faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('kpi-lucro', `R$ ${lucroMes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('kpi-colares', `${colaresVendidos} peças`);
    this.setDOMText('kpi-ticket', `R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    
    this.setDOMText('kpi-varejo', `R$ ${totalVarejo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('kpi-atacado', `R$ ${totalAtacado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    // Calcular produto mais vendido no mês atual
    const rankingQtd = {};
    vendasMes.forEach(v => {
      rankingQtd[v.produto_nome] = (rankingQtd[v.produto_nome] || 0) + v.quantidade;
    });
    const topProduto = Object.entries(rankingQtd).sort((a, b) => b[1] - a[1])[0];
    const topProdutoNome = topProduto ? topProduto[0] : 'Nenhum';
    const topProdutoQtd = topProduto ? `${topProduto[1]} un` : '0 un';

    // Calcular cliente com maior lucro real acumulado no mês atual
    const rankingLucro = {};
    vendasMes.forEach(v => {
      rankingLucro[v.cliente_nome] = (rankingLucro[v.cliente_nome] || 0) + parseFloat(v.lucro);
    });
    const topLucro = Object.entries(rankingLucro).sort((a, b) => b[1] - a[1])[0];
    const topLucroNome = topLucro ? topLucro[0] : 'Nenhum';
    const topLucroVal = topLucro ? `R$ ${topLucro[1].toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00';

    // Calcular melhor categoria do mês atual (por faturamento)
    const rankingCat = {};
    vendasMes.forEach(v => {
      const prod = produtos.find(p => p.id === v.produto_id);
      const cat = prod ? prod.categoria : 'Outros';
      rankingCat[cat] = (rankingCat[cat] || 0) + parseFloat(v.valor_venda);
    });
    const topCat = Object.entries(rankingCat).sort((a, b) => b[1] - a[1])[0];
    const topCatNome = topCat ? topCat[0] : 'Nenhuma';
    const topCatVal = topCat ? `R$ ${topCat[1].toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00';

    // Injetar novos KPIs na UI
    this.setDOMText('kpi-produto-top', topProdutoNome);
    this.setDOMText('kpi-produto-top-qtd', topProdutoQtd);
    this.setDOMText('kpi-produto-lucro', topLucroNome);
    this.setDOMText('kpi-produto-lucro-val', topLucroVal);
    this.setDOMText('kpi-categoria-top', topCatNome);
    this.setDOMText('kpi-categoria-top-val', topCatVal);

    // Atualizar Gráficos dinâmicos Deu Nó
    if (this.isUserLoggedIn()) {
      Charts.update(vendas);
    }

    this.gerarInsightsAutomáticos(vendas, faturamentoMes, lucroMes, totalAtacado);
  },

  setDOMText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  },

  // 6. GERAÇÃO DE INSIGHTS AUTOMÁTICOS COMPARATIVOS
  gerarInsightsAutomáticos(vendas, faturamentoMaio, lucroMaio, faturamentoAtacadoMaio) {
    const container = document.getElementById('dashboard-insights-list');
    if (!container) return;

    container.innerHTML = '';

    // Alertas de estoque crítico de insumos
    const insumosCriticos = (this.state.insumos || []).filter(i => i.estoque_atual <= i.estoque_minimo);
    if (insumosCriticos.length > 0) {
      insumosCriticos.forEach(insumo => {
        const div = document.createElement('div');
        div.className = `insight-bubble trend-down`;
        div.style.borderColor = 'var(--danger)';
        div.style.background = 'rgba(220, 53, 69, 0.05)';
        div.style.color = 'var(--text-primary)';
        div.innerHTML = `
          <i class="fas fa-triangle-exclamation" style="margin-right: 8px; color: var(--danger)"></i>
          <strong>ALERTA DE RUPTURA:</strong> Estoque crítico de <strong>${insumo.nome} (${insumo.especificacao})</strong>. Restam apenas <strong>${insumo.estoque_atual} ${insumo.unidade_medida === 'metro' ? 'm' : insumo.unidade_medida === 'grama' ? 'g' : 'un'}</strong> (Limite mínimo: ${insumo.estoque_minimo}).
        `;
        container.appendChild(div);
      });
    }

    const vendasAbril = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === 3 && dt.getFullYear() === 2026;
    });

    const faturamentoAbril = vendasAbril.reduce((sum, v) => sum + parseFloat(v.valor_venda), 0);
    const lucroAbril = vendasAbril.reduce((sum, v) => sum + parseFloat(v.lucro), 0);

    if (faturamentoAbril > 0) {
      const pctFaturamento = ((faturamentoMaio - faturamentoAbril) / faturamentoAbril) * 100;
      const isPos = pctFaturamento >= 0;
      
      const div = document.createElement('div');
      div.className = `insight-bubble ${isPos ? 'trend-up' : 'trend-down'}`;
      div.innerHTML = `
        <i class="fas ${isPos ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}" style="margin-right: 8px; color: var(--accent)"></i>
        Suas vendas <strong>${isPos ? 'cresceram' : 'caíram'} ${Math.abs(pctFaturamento).toFixed(1)}%</strong> em faturamento este mês comparado a Abril (De R$ ${faturamentoAbril.toFixed(0)} para R$ ${faturamentoMaio.toFixed(0)}).
      `;
      container.appendChild(div);
    }

    if (lucroAbril > 0) {
      const pctLucro = ((lucroMaio - lucroAbril) / lucroAbril) * 100;
      const isPos = pctLucro >= 0;
      
      const div = document.createElement('div');
      div.className = `insight-bubble ${isPos ? 'trend-up' : 'trend-down'}`;
      div.innerHTML = `
        <i class="fas ${isPos ? 'fa-chart-line' : 'fa-triangle-exclamation'}" style="margin-right: 8px; color: var(--accent)"></i>
        O lucro líquido do negócio <strong>${isPos ? 'subiu' : 'caiu'} ${Math.abs(pctLucro).toFixed(1)}%</strong> comparado a Abril. Foco na ${isPos ? 'manutenção do ritmo' : 'redução de custos'}.
      `;
      container.appendChild(div);
    }

    const ranking = {};
    const vendasMaio = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === 4 && dt.getFullYear() === 2026;
    });

    vendasMaio.forEach(v => {
      ranking[v.produto_nome] = (ranking[v.produto_nome] || 0) + v.quantidade;
    });

    const topProduto = Object.entries(ranking).sort((a, b) => b[1] - a[1])[0];
    if (topProduto) {
      const div = document.createElement('div');
      div.className = 'insight-bubble';
      div.innerHTML = `
        <i class="fas fa-crown" style="margin-right: 8px; color: var(--accent)"></i>
        O <strong>${topProduto[0]}</strong> foi o seu produto mais vendido este mês, com um total de <strong>${topProduto[1]} unidades</strong>.
      `;
      container.appendChild(div);
    }

    if (faturamentoMaio > 0) {
      const pctAtacado = (faturamentoAtacadoMaio / faturamentoMaio) * 100;
      const div = document.createElement('div');
      div.className = 'insight-bubble';
      div.innerHTML = `
        <i class="fas fa-boxes-packing" style="margin-right: 8px; color: var(--purple)"></i>
        As vendas de <strong>Atacado</strong> representaram <strong>${pctAtacado.toFixed(0)}% do seu faturamento bruto</strong> de Maio.
      `;
      container.appendChild(div);
    }
  },

  // 7. Q&A DE INTELIGÊNCIA DE NEGÓCIOS
  responderPerguntaDeNegocio(perguntaKey) {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    const mesAnalise = 4;
    const anoAnalise = 2026;
    const vendasMaio = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise;
    });

    let resposta = "";

    switch(perguntaKey) {
      case 'colar': {
        const colarQtds = {};
        vendasMaio.forEach(v => {
          if (v.produto_nome.toLowerCase().includes('colar')) {
            colarQtds[v.produto_nome] = (colarQtds[v.produto_nome] || 0) + v.quantidade;
          }
        });
        const topColar = Object.entries(colarQtds).sort((a,b) => b[1] - a[1])[0];
        if (topColar) {
          resposta = `O colar mais vendido deste mês foi o <strong>"${topColar[0]}"</strong>, com <strong>${topColar[1]} peças</strong> comercializadas.`;
        } else {
          resposta = "Sem registros de colares vendidos neste mês.";
        }
        break;
      }

      case 'lucro_peca': {
        const lucrosPorPeca = {};
        vendasMaio.forEach(v => {
          lucrosPorPeca[v.produto_nome] = (lucrosPorPeca[v.produto_nome] || 0) + parseFloat(v.lucro);
        });
        const topLucro = Object.entries(lucrosPorPeca).sort((a,b) => b[1] - a[1])[0];
        if (topLucro) {
          resposta = `A peça com maior retorno financeiro foi o <strong>"${topLucro[0]}"</strong>, gerando <strong>R$ ${topLucro[1].toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} de lucro líquido real</strong>.`;
        } else {
          resposta = "Sem dados de lucratividade para o mês corrente.";
        }
        break;
      }

      case 'canal': {
        const fatVarejo = vendasMaio.filter(v => v.tipo_cliente === 'varejo').reduce((sum, v) => sum + v.valor_venda, 0);
        const fatAtacado = vendasMaio.filter(v => v.tipo_cliente === 'atacado').reduce((sum, v) => sum + v.valor_venda, 0);
        
        if (fatVarejo > fatAtacado) {
          resposta = `Você vendeu mais no <strong>Varejo</strong> (R$ ${fatVarejo.toLocaleString('pt-BR', {maximumFractionDigits: 0})} vs R$ ${fatAtacado.toLocaleString('pt-BR', {maximumFractionDigits: 0})} do Atacado). O varejo representou <strong>${((fatVarejo / (fatVarejo + fatAtacado)) * 100).toFixed(0)}%</strong>.`;
        } else if (fatAtacado > fatVarejo) {
          resposta = `Você vendeu mais no <strong>Atacado</strong> (R$ ${fatAtacado.toLocaleString('pt-BR', {maximumFractionDigits: 0})} vs R$ ${fatVarejo.toLocaleString('pt-BR', {maximumFractionDigits: 0})} do Varejo). O atacado representou <strong>${((fatAtacado / (fatVarejo + fatAtacado)) * 100).toFixed(0)}%</strong>.`;
        } else {
          resposta = "Canais empatados ou sem vendas em Maio.";
        }
        break;
      }

      case 'evolucao_mes': {
        const vendasAbril = vendas.filter(v => {
          const dt = new Date(v.created_at);
          return dt.getMonth() === 3 && dt.getFullYear() === 2026;
        });
        const fatAbril = vendasAbril.reduce((sum, v) => sum + parseFloat(v.valor_venda), 0);
        const fatMaio = vendasMaio.reduce((sum, v) => sum + parseFloat(v.valor_venda), 0);
        
        if (fatAbril > 0) {
          const pct = ((fatMaio - fatAbril) / fatAbril) * 100;
          const isPos = pct >= 0;
          resposta = `Seu faturamento <strong>${isPos ? 'AUMENTOU' : 'CAIU'} ${Math.abs(pct).toFixed(1)}%</strong> comparado a Abril. Faturamento de Abril: <strong>R$ ${fatAbril.toLocaleString('pt-BR', {maximumFractionDigits: 0})}</strong> | Maio: <strong>R$ ${fatMaio.toLocaleString('pt-BR', {maximumFractionDigits: 0})}</strong>.`;
        } else {
          resposta = "Sem registros do mês de Abril para fins de comparação.";
        }
        break;
      }

      case 'categoria': {
        const catFaturamentos = {};
        vendasMaio.forEach(v => {
          const prodObj = produtos.find(p => p.id === v.produto_id);
          const categoria = prodObj ? prodObj.categoria : 'Outros';
          catFaturamentos[categoria] = (catFaturamentos[categoria] || 0) + v.valor_venda;
        });
        const topCat = Object.entries(catFaturamentos).sort((a,b) => b[1] - a[1])[0];
        if (topCat) {
          resposta = `A categoria com maior desempenho foi a de <strong>"${topCat[0]}"</strong>, gerando <strong>R$ ${topCat[1].toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>.`;
        } else {
          resposta = "Sem dados categorizados neste mês.";
        }
        break;
      }

      case 'baixa_margem': {
        const baixas = produtos.filter(p => p.status_margem === 'baixa');
        if (baixas.length > 0) {
          const nomes = baixas.map(p => `"${p.nome}"`).join(', ');
          resposta = `Há <strong>${baixas.length} produto(s)</strong> com margem abaixo do recomendado (<25%): <strong>${nomes}</strong>.`;
        } else {
          resposta = "Parabéns! <strong>Nenhum produto</strong> cadastrado possui margem de lucro baixa.";
        }
        break;
      }

      case 'lucro_liquido': {
        const lucLiq = vendasMaio.reduce((sum, v) => sum + parseFloat(v.lucro), 0);
        resposta = `O lucro líquido de Maio foi de <strong>R$ ${lucLiq.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> (já descontados os custos de materiais e mão de obra de cada peça).`;
        break;
      }
    }

    const answerBox = document.getElementById('qa-answer-box');
    const answerText = document.getElementById('qa-answer-text');
    if (answerBox && answerText) {
      answerBox.classList.add('active');
      answerText.innerHTML = resposta;
    }
  },

  // 8. RENDERIZAÇÃO DE PRODUTOS
  renderizarTabelaProdutos() {
    const tbody = document.getElementById('table-produtos-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const busca = this.state.filtros.produtos.busca.toLowerCase();
    const categoria = this.state.filtros.produtos.categoria;

    const filtrados = this.state.produtos.filter(p => {
      const matchBusca = p.nome.toLowerCase().includes(busca) || p.sku.toLowerCase().includes(busca);
      const matchCat = categoria === 'todos' || p.categoria === categoria;
      return matchBusca && matchCat;
    });

    if (filtrados.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" class="empty-state">
            <i class="fas fa-boxes-stacked"></i>
            <h3>Nenhum produto encontrado</h3>
            <p>Ajuste sua busca ou cadastre um novo produto.</p>
          </td>
        </tr>
      `;
      return;
    }

    filtrados.forEach(p => {
      const tr = document.createElement('tr');
      
      const imgHtml = p.foto 
        ? `<img src="${p.foto}" alt="${p.nome}" class="product-table-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="product-placeholder-avatar" style="display: none;"><i class="fas fa-gem"></i></div>`
        : `<div class="product-placeholder-avatar" style="display: flex;"><i class="fas fa-gem"></i></div>`;

      const custoTotal = p.custo + p.mao_obra;
      const valorVendaAtacado = p.valor_venda_atacado || 0;
      const lucroAtacado = p.lucro_atacado !== undefined ? p.lucro_atacado : (valorVendaAtacado > 0 ? (valorVendaAtacado - custoTotal) : 0);
      const margemAtacado = valorVendaAtacado > 0 ? (lucroAtacado / valorVendaAtacado) * 100 : 0;
      
      let statusMargemAtacado = p.status_margem_atacado;
      if (!statusMargemAtacado) {
        if (margemAtacado >= 40) statusMargemAtacado = 'alta';
        else if (margemAtacado >= 20) statusMargemAtacado = 'media';
        else statusMargemAtacado = 'baixa';
      }

      tr.innerHTML = `
        <td style="text-align: center; vertical-align: middle;">
          <div style="display: flex; justify-content: center; align-items: center;">
            ${imgHtml}
          </div>
        </td>
        <td style="font-weight: 600; color: var(--accent); font-family: 'Playfair Display', serif; font-size: 15px; vertical-align: middle;">${p.nome}</td>
        <td style="vertical-align: middle;">${p.categoria}</td>
        <td style="font-family: monospace; font-size: 13px; color: var(--text-gold); font-weight: 600; vertical-align: middle;">${p.sku}</td>
        <td style="color: var(--text-muted); vertical-align: middle;">R$ ${(parseFloat(p.custo) || 0).toFixed(2)}</td>
        <td style="vertical-align: middle;">R$ ${(parseFloat(p.valor_venda) || 0).toFixed(2)}</td>
        <td style="vertical-align: middle;">R$ ${(parseFloat(valorVendaAtacado) || 0).toFixed(2)}</td>
        <td style="vertical-align: middle;">
          <span class="badge badge-${p.status_margem === 'alta' ? 'success' : p.status_margem === 'media' ? 'warning' : 'danger'}">
            R$ ${(parseFloat(p.lucro) || 0).toFixed(2)} (${Math.round(p.valor_venda > 0 ? ((parseFloat(p.lucro) || 0) / p.valor_venda) * 100 : 0)}%)
          </span>
        </td>
        <td style="vertical-align: middle;">
          <span class="badge badge-${statusMargemAtacado === 'alta' ? 'success' : statusMargemAtacado === 'media' ? 'warning' : 'danger'}">
            R$ ${(parseFloat(lucroAtacado) || 0).toFixed(2)} (${Math.round(margemAtacado)}%)
          </span>
        </td>
        <td style="font-weight: 600; color: ${p.estoque <= 5 ? 'var(--danger)' : 'var(--text-primary)'}; vertical-align: middle;">
          ${p.estoque} un
        </td>
        <td style="text-align: center; vertical-align: middle; white-space: nowrap;">
          <button class="btn-action btn-action-edit" data-id="${p.id}" title="Editar Peça">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-action btn-action-delete" data-id="${p.id}" data-nome="${p.nome}" title="Apagar Peça">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Vincular eventos de Editar e Excluir
    tbody.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.abrirModalEdicao(id);
      });
    });

    tbody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const nome = e.currentTarget.getAttribute('data-nome');
        this.abrirConfirmacaoExclusao(id, nome);
      });
    });
  },

  // 9. RENDERIZAÇÃO DE VENDAS
  renderizarTabelaVendas() {
    const tbody = document.getElementById('table-vendas-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtros = this.state.filtros.vendas;
    const busca = filtros.busca.toLowerCase();

    const filtrados = this.state.vendas.filter(v => {
      const matchBusca = v.cliente_nome.toLowerCase().includes(busca) || v.produto_nome.toLowerCase().includes(busca);
      
      let matchMes = true;
      if (filtros.mes !== 'todos') {
        const dt = new Date(v.created_at);
        matchMes = dt.getMonth() === parseInt(filtros.mes);
      }
      
      const matchTipo = filtros.tipo === 'todos' || v.tipo_cliente === filtros.tipo;
      const matchPag = filtros.pagamento === 'todos' || v.pagamento === filtros.pagamento;

      return matchBusca && matchMes && matchTipo && matchPag;
    });

    if (filtrados.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-state">
            <i class="fas fa-receipt"></i>
            <h3>Nenhuma venda encontrada</h3>
            <p>Ajuste os filtros ou registre uma nova venda.</p>
          </td>
        </tr>
      `;
      return;
    }

    filtrados.forEach(v => {
      const tr = document.createElement('tr');
      const dt = new Date(v.created_at);
      const dataFormatada = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

      tr.innerHTML = `
        <td style="font-weight: 600; font-family: 'Playfair Display'; font-size: 15px; color: var(--accent);">${v.produto_nome}</td>
        <td>${v.cliente_nome}</td>
        <td style="font-size: 13px; color: var(--text-secondary);">${dataFormatada}</td>
        <td>
          <span class="badge ${v.tipo_cliente === 'varejo' ? 'badge-info' : 'badge-purple'}">
            ${v.tipo_cliente}
          </span>
        </td>
        <td><i class="far fa-credit-card" style="margin-right: 6px; color: var(--accent);"></i>${v.pagamento}</td>
        <td style="font-weight: 600;">${v.quantidade}x</td>
        <td style="font-weight: 600; color: var(--text-primary);">R$ ${(parseFloat(v.valor_venda) || 0).toFixed(2)}</td>
        <td style="color: var(--accent); font-weight: 600;">+ R$ ${(parseFloat(v.lucro) || 0).toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  // 10. RENDERIZAÇÃO DE CLIENTES
  renderizarTabelaClientes() {
    const tbody = document.getElementById('table-clientes-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const busca = this.state.filtros.clientes.busca.toLowerCase();
    const tipo = this.state.filtros.clientes.tipo;

    const filtrados = this.state.clientes.filter(c => {
      const matchBusca = c.nome.toLowerCase().includes(busca) || (c.telefone && c.telefone.includes(busca));
      const matchTipo = tipo === 'todos' || c.tipo_cliente === tipo;
      return matchBusca && matchTipo;
    });

    if (filtrados.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="empty-state">
            <i class="fas fa-users-slash"></i>
            <h3>Nenhum cliente cadastrado</h3>
            <p>Seus clientes aparecem aqui automaticamente ao registrar vendas.</p>
          </td>
        </tr>
      `;
      return;
    }

    filtrados.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600; font-family: 'Playfair Display'; font-size: 15px; color: var(--accent);">${c.nome}</td>
        <td style="font-family: monospace;">${c.telefone || 'Não Informado'}</td>
        <td>
          <span class="badge ${c.tipo_cliente === 'varejo' ? 'badge-info' : 'badge-purple'}">
            ${c.tipo_cliente}
          </span>
        </td>
        <td style="font-weight: 700; color: var(--accent);">R$ ${c.total_compras.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  // 11. FINANCEIRO
  renderizarAbaFinanceiro() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;

    const faturamentoTotal = vendas.reduce((sum, v) => sum + parseFloat(v.valor_venda), 0);
    const lucroTotal = vendas.reduce((sum, v) => sum + parseFloat(v.lucro), 0);
    
    let custoProducaoTotal = 0;
    let custoMaoObraTotal = 0;

    vendas.forEach(v => {
      const prod = produtos.find(p => p.id === v.produto_id);
      if (prod) {
        custoProducaoTotal += prod.custo * v.quantidade;
        custoMaoObraTotal += prod.mao_obra * v.quantidade;
      }
    });

    this.setDOMText('fin-faturamento-total', `R$ ${faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('fin-custo-total', `R$ ${custoProducaoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('fin-mao-obra-total', `R$ ${custoMaoObraTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('fin-lucro-liquido-total', `R$ ${lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    const margemMediaGeral = faturamentoTotal > 0 ? (lucroTotal / faturamentoTotal) * 100 : 0;
    this.setDOMText('fin-margem-geral', `${margemMediaGeral.toFixed(1)}%`);
  },

  // 12. BINDAGEM DE EVENTOS
  bindEvents() {
    ['btn-abrir-venda-modal', 'btn-abrir-venda-modal-sec'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        e.preventDefault();
        this.navegarParaAba('sec-registrar-venda');
      });
    });
    this.addModalTrigger('btn-abrir-produto-modal', 'modal-produto', false);
    this.addModalTrigger('btn-abrir-cliente-modal', 'modal-cliente', false);

    // Clique no Card de Faturamento para abrir detalhamento
    document.getElementById('kpi-card-faturamento')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderizarFaturamentoDetalhado();
      
      const sections = document.querySelectorAll('.app-section');
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('sec-faturamento-detalhado');
      if (targetSec) targetSec.classList.add('active');

      document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-target') === 'sec-dashboard') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });

    // Clique no Card de Lucro para abrir detalhamento
    document.getElementById('kpi-card-lucro')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderizarLucroDetalhado();
      
      const sections = document.querySelectorAll('.app-section');
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('sec-lucro-detalhado');
      if (targetSec) targetSec.classList.add('active');

      document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-target') === 'sec-dashboard') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });

    // Clique no Card de Colares Vendidos
    document.getElementById('kpi-card-colares')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderizarColaresDetalhado();
      const sections = document.querySelectorAll('.app-section');
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('sec-colares-detalhado');
      if (targetSec) targetSec.classList.add('active');
      document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-target') === 'sec-dashboard') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });

    // Clique no Card de Ticket Médio
    document.getElementById('kpi-card-ticket')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderizarTicketDetalhado();
      const sections = document.querySelectorAll('.app-section');
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('sec-ticket-detalhado');
      if (targetSec) targetSec.classList.add('active');
      document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-target') === 'sec-dashboard') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });

    // Clique no Card de Vendido no Varejo
    document.getElementById('kpi-card-varejo')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderizarVarejoDetalhado();
      const sections = document.querySelectorAll('.app-section');
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('sec-varejo-detalhado');
      if (targetSec) targetSec.classList.add('active');
      document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-target') === 'sec-dashboard') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });

    // Clique no Card de Vendido no Atacado
    document.getElementById('kpi-card-atacado')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderizarAtacadoDetalhado();
      const sections = document.querySelectorAll('.app-section');
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('sec-atacado-detalhado');
      if (targetSec) targetSec.classList.add('active');
      document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-target') === 'sec-dashboard') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });

    // Clique no Card de Produto Mais Vendido
    document.getElementById('kpi-card-produto-top')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderizarProdutoTopDetalhado();
      const sections = document.querySelectorAll('.app-section');
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('sec-produto-top-detalhado');
      if (targetSec) targetSec.classList.add('active');
      document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-target') === 'sec-dashboard') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });

    // Clique no Card de Melhor Lucro Real
    document.getElementById('kpi-card-produto-lucro')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderizarProdutoLucroDetalhado();
      const sections = document.querySelectorAll('.app-section');
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('sec-produto-lucro-detalhado');
      if (targetSec) targetSec.classList.add('active');
      document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-target') === 'sec-dashboard') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });

    // Clique no Card de Melhor Categoria
    document.getElementById('kpi-card-categoria-top')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderizarCategoriaTopDetalhado();
      const sections = document.querySelectorAll('.app-section');
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById('sec-categoria-top-detalhado');
      if (targetSec) targetSec.classList.add('active');
      document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-target') === 'sec-dashboard') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });

    // Botão Voltar do Faturamento Detalhado
    document.querySelectorAll('.btn-voltar-dashboard').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navegarParaAba('sec-dashboard');
      });
    });

    document.getElementById('btn-abrir-categorias-modal')?.addEventListener('click', () => {
      const modal = document.getElementById('modal-categorias');
      if (modal) {
        modal.classList.add('active');
        this.renderizarListaCategorias();
      }
    });

    document.getElementById('form-nova-categoria')?.addEventListener('submit', (e) => this.handleSubmitNovaCategoria(e));

    const btnCloses = document.querySelectorAll('.btn-close-modal, .btn-cancel-form');
    btnCloses.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    const inputsPrecoProduto = ['prod-custo', 'prod-mao-obra', 'prod-venda', 'prod-venda-atacado'];
    inputsPrecoProduto.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => this.calcularMargemFormProduto('venda', e.target.id));
      }
    });

    const elMargem = document.getElementById('prod-margem-desejada');
    if (elMargem) {
      elMargem.addEventListener('input', () => this.calcularMargemFormProduto('margem-varejo'));
    }

    const elMargemAtacado = document.getElementById('prod-margem-atacado');
    if (elMargemAtacado) {
      elMargemAtacado.addEventListener('input', () => this.calcularMargemFormProduto('margem-atacado'));
    }

    const selectProdVenda = document.getElementById('venda-produto-id');
    if (selectProdVenda) {
      selectProdVenda.addEventListener('change', () => this.sincronizarProdutoSelecionadoFormVenda());
    }

    const selectTipoClienteVenda = document.getElementById('venda-tipo-cliente');
    const inputValorVenda = document.getElementById('venda-valor-venda');
    const inputQtdVenda = document.getElementById('venda-qtd');

    if (selectTipoClienteVenda) {
      selectTipoClienteVenda.addEventListener('change', () => {
        this.sincronizarProdutoSelecionadoFormVenda();
      });
    }

    if (inputQtdVenda) {
      inputQtdVenda.addEventListener('input', () => {
        this.sincronizarProdutoSelecionadoFormVenda();
      });
    }

    if (inputValorVenda) {
      inputValorVenda.addEventListener('input', () => {
        if (selectTipoClienteVenda.value === 'atacado') {
          this.calcularMargemFormVendaAtacado();
        }
      });
    }

    // Monitora seleção de cliente no input para identificar segmentação automática (Varejo/Atacado)
    const inputCliente = document.getElementById('venda-cliente');
    if (inputCliente) {
      inputCliente.addEventListener('input', () => {
        const nomeDigitado = inputCliente.value.trim().toLowerCase();
        if (!nomeDigitado) return;

        // Tenta encontrar o cliente pelo nome completo
        const clienteEncontrado = this.state.clientes.find(c => c.nome.trim().toLowerCase() === nomeDigitado);
        if (clienteEncontrado && clienteEncontrado.tipo_cliente) {
          const hiddenTipo = document.getElementById('venda-tipo-cliente');
          if (hiddenTipo && hiddenTipo.value !== clienteEncontrado.tipo_cliente) {
            hiddenTipo.value = clienteEncontrado.tipo_cliente;
            hiddenTipo.dispatchEvent(new Event('change'));

            // Atualiza visualmente os botões do Segmented Control
            const segmentedButtons = document.querySelectorAll('.segmented-control .segmented-btn');
            segmentedButtons.forEach(b => {
              if (b.getAttribute('data-value') === clienteEncontrado.tipo_cliente) {
                b.classList.add('active');
              } else {
                b.classList.remove('active');
              }
            });
            
            this.showToast('Cliente Identificado', `Canal de venda ajustado automaticamente para "${clienteEncontrado.tipo_cliente.toUpperCase()}"!`, 'info');
          }
        }
      });
    }

    document.getElementById('form-produto')?.addEventListener('submit', (e) => this.handleSubmitProduto(e));
    document.getElementById('form-produto')?.addEventListener('reset', () => {
      const valInvest = document.getElementById('calc-invest-val');
      const valLucroVarejo = document.getElementById('calc-lucro-varejo-val');
      const valLucroAtacado = document.getElementById('calc-lucro-atacado-val');
      if (valInvest) valInvest.textContent = 'R$ 0.00';
      if (valLucroVarejo) {
        valLucroVarejo.textContent = 'R$ 0.00 (0%)';
        valLucroVarejo.style.color = '';
      }
      if (valLucroAtacado) {
        valLucroAtacado.textContent = 'R$ 0.00 (0%)';
        valLucroAtacado.style.color = '';
      }

      // Reverter textos do modal e limpar id de edicao
      const elId = document.getElementById('prod-id');
      if (elId) elId.value = '';
      const elTitulo = document.getElementById('modal-produto-titulo');
      const elSubmit = document.getElementById('btn-submit-produto');
      if (elTitulo) elTitulo.textContent = 'Cadastrar Novo Produto';
      if (elSubmit) elSubmit.textContent = 'Cadastrar Peça';

      // Limpar ficha técnica
      const fichaContainer = document.getElementById('ficha-insumos-container');
      const fichaEmpty = document.getElementById('ficha-insumos-empty');
      if (fichaContainer) fichaContainer.innerHTML = '';
      if (fichaEmpty) fichaEmpty.style.display = 'block';
    });
    document.getElementById('form-venda')?.addEventListener('submit', (e) => this.handleSubmitVenda(e));
    document.getElementById('form-cliente')?.addEventListener('submit', (e) => this.handleSubmitCliente(e));
    document.getElementById('form-supabase-config')?.addEventListener('submit', (e) => this.handleSubmitSupabase(e));
    document.getElementById('btn-desconectar-supa')?.addEventListener('click', (e) => this.handleDesconectarSupabase(e));

    // Escutadores para o modal de confirmacao de exclusao
    document.querySelector('.btn-cancel-delete')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('modal-confirmacao-exclusao')?.classList.remove('active');
    });

    document.querySelector('.btn-confirm-delete')?.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (id) {
        try {
          await DB.deletarProduto(id);
          await this.carregarDados();
          this.renderizarTabelaProdutos();
          
          document.getElementById('modal-confirmacao-exclusao')?.classList.remove('active');
          this.showToast('Peça Apagada', 'O produto foi excluído com sucesso.', 'success');
          this.atualizarDashboard();
        } catch (err) {
          console.error("Erro ao apagar produto:", err);
          this.showToast('Erro ao Excluir', 'Não foi possível remover o produto.', 'danger');
        }
      }
    });

    const btnQAs = document.querySelectorAll('.btn-qa');
    btnQAs.forEach(btn => {
      btn.addEventListener('click', () => {
        const perguntaKey = btn.getAttribute('data-qa');
        this.responderPerguntaDeNegocio(perguntaKey);
      });
    });

    this.bindFiltroInput('busca-produtos', 'produtos', 'busca', () => this.renderizarTabelaProdutos());
    this.bindFiltroSelect('filtro-produtos-categoria', 'produtos', 'categoria', () => this.renderizarTabelaProdutos());

    this.bindFiltroInput('busca-vendas', 'vendas', 'busca', () => this.renderizarTabelaVendas());
    this.bindFiltroSelect('filtro-vendas-mes', 'vendas', 'mes', () => this.renderizarTabelaVendas());
    this.bindFiltroSelect('filtro-vendas-tipo', 'vendas', 'tipo', () => this.renderizarTabelaVendas());
    this.bindFiltroSelect('filtro-vendas-pagamento', 'vendas', 'pagamento', () => this.renderizarTabelaVendas());

    this.bindFiltroInput('busca-clientes', 'clientes', 'busca', () => this.renderizarTabelaClientes());
    this.bindFiltroSelect('filtro-clientes-tipo', 'clientes', 'tipo', () => this.renderizarTabelaClientes());

    document.getElementById('btn-exportar-csv-vendas')?.addEventListener('click', () => this.exportarVendasParaCSV());
    document.getElementById('btn-imprimir-pdf-vendas')?.addEventListener('click', () => window.print());
    document.getElementById('btn-limpar-vendas')?.addEventListener('click', () => {
      document.getElementById('modal-confirmacao-limpar-vendas')?.classList.add('active');
    });

    const modalLimpar = document.getElementById('modal-confirmacao-limpar-vendas');
    if (modalLimpar) {
      modalLimpar.querySelector('.btn-close-modal')?.addEventListener('click', () => {
        modalLimpar.classList.remove('active');
      });
      modalLimpar.querySelector('.btn-cancelar-limpar')?.addEventListener('click', () => {
        modalLimpar.classList.remove('active');
      });
      modalLimpar.querySelector('.btn-confirmar-limpar')?.addEventListener('click', async () => {
        try {
          await DB.limparTodasVendas();
          this.state.vendas = [];
          this.showToast('Vendas Limpas', 'Todas as vendas foram excluídas com sucesso!', 'success');
          this.atualizarDashboard();
          this.renderizarTabelaVendas();
          modalLimpar.classList.remove('active');
        } catch (err) {
          console.error(err);
          this.showToast('Erro ao Limpar', 'Não foi possível limpar o histórico de vendas.', 'danger');
        }
      });
    }

    // === CONTROLES TOUCH DE VENDAS ===
    // Stepper de Quantidade (+ / -)
    const btnMinus = document.getElementById('venda-qtd-minus');
    const btnPlus = document.getElementById('venda-qtd-plus');
    const inputQtd = document.getElementById('venda-qtd');

    if (btnMinus && btnPlus && inputQtd) {
      btnMinus.addEventListener('click', (e) => {
        e.preventDefault();
        let val = parseInt(inputQtd.value) || 1;
        if (val > 1) {
          inputQtd.value = val - 1;
          inputQtd.dispatchEvent(new Event('input')); // Recalcula
        }
      });

      btnPlus.addEventListener('click', (e) => {
        e.preventDefault();
        let val = parseInt(inputQtd.value) || 1;
        inputQtd.value = val + 1;
        inputQtd.dispatchEvent(new Event('input')); // Recalcula
      });
    }

    // Segmented Control de Canal de Venda (Varejo / Atacado)
    const segmentedButtons = document.querySelectorAll('.segmented-control .segmented-btn');
    const hiddenTipo = document.getElementById('venda-tipo-cliente');

    segmentedButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        segmentedButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const val = btn.getAttribute('data-value');
        if (hiddenTipo) {
          hiddenTipo.value = val;
          hiddenTipo.dispatchEvent(new Event('change'));
        }
      });
    });

    // Evento de alteração no tipo de cliente (canal de venda)
    if (hiddenTipo) {
      hiddenTipo.addEventListener('change', () => {
        // O campo agora é sempre readonly para evitar edições manuais
        inputValorVenda.setAttribute('readonly', 'true');
        inputValorVenda.style.borderColor = 'var(--border)';
        
        // Recalcula o valor da venda com base no novo canal selecionado (varejo ou atacado)
        this.sincronizarProdutoSelecionadoFormVenda();
      });
    }

    // Grid de Formas de Pagamento
    const paymentButtons = document.querySelectorAll('.payment-grid-touch .payment-btn');
    const hiddenPagamento = document.getElementById('venda-pagamento');

    paymentButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        paymentButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const val = btn.getAttribute('data-value');
        if (hiddenPagamento) {
          hiddenPagamento.value = val;
        }
      });
    });

    // === EVENTOS DE INSUMOS E FILTROS ===
    this.bindFiltroInput('busca-insumos', 'insumos', 'busca', () => this.renderizarTabelaInsumos());
    this.bindFiltroSelect('filtro-insumos-tipo', 'insumos', 'tipo', () => this.renderizarTabelaInsumos());

    document.getElementById('btn-abrir-insumo-modal')?.addEventListener('click', () => {
      this.abrirModalInsumo();
    });

    document.getElementById('form-insumo')?.addEventListener('submit', (e) => this.handleSubmitInsumo(e));
    document.getElementById('form-insumo')?.addEventListener('reset', () => {
      const elId = document.getElementById('insumo-id');
      if (elId) elId.value = '';
      const elTitulo = document.getElementById('modal-insumo-titulo');
      const elSubmit = document.getElementById('btn-submit-insumo');
      if (elTitulo) elTitulo.textContent = 'Cadastrar Novo Material';
      if (elSubmit) elSubmit.textContent = 'Cadastrar Material';
    });

    document.getElementById('btn-add-ficha-material')?.addEventListener('click', () => {
      this.abrirModalBuscaInsumo('nova');
    });

    // Eventos do Modal de Seleção de Insumos (Ficha Técnica)
    const buscaInput = document.getElementById('busca-insumo-termo');
    if (buscaInput) {
      buscaInput.addEventListener('input', () => this.renderizarListaBuscaInsumos());
    }

    const tagButtons = document.querySelectorAll('#busca-insumo-categorias .btn-tag');
    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tagButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderizarListaBuscaInsumos();
      });
    });

    document.getElementById('btn-close-modal-selecionar-insumo')?.addEventListener('click', () => {
      const modal = document.getElementById('modal-selecionar-insumo');
      if (modal) modal.classList.remove('active');
    });
  },

  addModalTrigger(btnId, modalId, isVenda) {
    document.getElementById(btnId)?.addEventListener('click', () => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        if (isVenda) {
          const inputData = document.getElementById('venda-data');
          if (inputData) {
            const tzoffset = (new Date()).getTimezoneOffset() * 60000;
            const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().substring(0, 16);
            inputData.value = localISOTime;
          }
        }
      }
    });
  },

  bindFiltroInput(id, modulo, chave, callback) {
    document.getElementById(id)?.addEventListener('input', (e) => {
      this.state.filtros[modulo][chave] = e.target.value;
      callback();
    });
  },

  bindFiltroSelect(id, modulo, chave, callback) {
    document.getElementById(id)?.addEventListener('change', (e) => {
      this.state.filtros[modulo][chave] = e.target.value;
      callback();
    });
  },

  // 13. CALCULADORAS DE MARGEM DINÂMICA
  calcularMargemFormProduto(origem = 'venda', triggerId = '') {
    const custo = parseFloat(document.getElementById('prod-custo').value) || 0;
    const maoObra = parseFloat(document.getElementById('prod-mao-obra').value) || 0;
    const invest = custo + maoObra;

    const elVendaVarejo = document.getElementById('prod-venda');
    const elMargemVarejo = document.getElementById('prod-margem-desejada');
    const elVendaAtacado = document.getElementById('prod-venda-atacado');
    const elMargemAtacado = document.getElementById('prod-margem-atacado');

    let vendaVarejo = parseFloat(elVendaVarejo ? elVendaVarejo.value : 0) || 0;
    let margemVarejo = parseFloat(elMargemVarejo ? elMargemVarejo.value : 0) || 0;
    let vendaAtacado = parseFloat(elVendaAtacado ? elVendaAtacado.value : 0) || 0;
    let margemAtacado = parseFloat(elMargemAtacado ? elMargemAtacado.value : 0) || 0;

    // Caso o trigger seja a alteração da Margem Desejada de Varejo
    if (origem === 'margem-varejo' || (origem === 'margem' && triggerId === 'prod-margem-desejada')) {
      if (margemVarejo >= 100) margemVarejo = 99;
      if (margemVarejo < 0) margemVarejo = 0;
      if (elMargemVarejo) elMargemVarejo.value = margemVarejo;

      if (invest > 0) {
        vendaVarejo = invest / (1 - (margemVarejo / 100));
        if (elVendaVarejo) elVendaVarejo.value = vendaVarejo.toFixed(2);
      } else {
        vendaVarejo = 0;
        if (elVendaVarejo) elVendaVarejo.value = '';
      }
    } 
    // Caso o trigger seja a alteração da Margem Desejada de Atacado
    else if (origem === 'margem-atacado' || (origem === 'margem' && triggerId === 'prod-margem-atacado')) {
      if (margemAtacado >= 100) margemAtacado = 99;
      if (margemAtacado < 0) margemAtacado = 0;
      if (elMargemAtacado) elMargemAtacado.value = margemAtacado;

      if (invest > 0) {
        vendaAtacado = invest / (1 - (margemAtacado / 100));
        if (elVendaAtacado) elVendaAtacado.value = vendaAtacado.toFixed(2);
      } else {
        vendaAtacado = 0;
        if (elVendaAtacado) elVendaAtacado.value = '';
      }
    } 
    // Caso seja input de preço ou custo/mão-obra
    else {
      // Varejo
      if (triggerId === 'prod-venda' || triggerId === '') {
        if (vendaVarejo > 0) {
          const lucro = vendaVarejo - invest;
          const margemCalculada = (lucro / vendaVarejo) * 100;
          if (elMargemVarejo) {
            elMargemVarejo.value = Math.max(0, Math.round(margemCalculada));
          }
        } else if (vendaVarejo === 0 && margemVarejo > 0 && invest > 0) {
          vendaVarejo = invest / (1 - (margemVarejo / 100));
          if (elVendaVarejo) elVendaVarejo.value = vendaVarejo.toFixed(2);
        } else {
          if (elMargemVarejo && triggerId === 'prod-venda') {
            elMargemVarejo.value = '';
          }
        }
      }

      // Atacado
      if (triggerId === 'prod-venda-atacado' || triggerId === '') {
        if (vendaAtacado > 0) {
          const lucro = vendaAtacado - invest;
          const margemCalculada = (lucro / vendaAtacado) * 100;
          if (elMargemAtacado) {
            elMargemAtacado.value = Math.max(0, Math.round(margemCalculada));
          }
        } else if (vendaAtacado === 0 && margemAtacado > 0 && invest > 0) {
          vendaAtacado = invest / (1 - (margemAtacado / 100));
          if (elVendaAtacado) elVendaAtacado.value = vendaAtacado.toFixed(2);
        } else {
          if (elMargemAtacado && triggerId === 'prod-venda-atacado') {
            elMargemAtacado.value = '';
          }
        }
      }

      // Se alterou custo/mao_obra, atualiza tudo com base nas margens desejadas caso os preços estejam vazios, ou recalcula margens caso preços estejam preenchidos
      if (triggerId === 'prod-custo' || triggerId === 'prod-mao-obra') {
        if (vendaVarejo > 0) {
          const lucro = vendaVarejo - invest;
          const margemCalculada = (lucro / vendaVarejo) * 100;
          if (elMargemVarejo) elMargemVarejo.value = Math.max(0, Math.round(margemCalculada));
        } else if (margemVarejo > 0 && invest > 0) {
          vendaVarejo = invest / (1 - (margemVarejo / 100));
          if (elVendaVarejo) elVendaVarejo.value = vendaVarejo.toFixed(2);
        }

        if (vendaAtacado > 0) {
          const lucro = vendaAtacado - invest;
          const margemCalculada = (lucro / vendaAtacado) * 100;
          if (elMargemAtacado) elMargemAtacado.value = Math.max(0, Math.round(margemCalculada));
        } else if (margemAtacado > 0 && invest > 0) {
          vendaAtacado = invest / (1 - (margemAtacado / 100));
          if (elVendaAtacado) elVendaAtacado.value = vendaAtacado.toFixed(2);
        }
      }
    }

    // Lucros e Margens finais para exibir no box de cálculo
    const lucroVarejo = vendaVarejo - invest;
    const margemVarejoCalculada = vendaVarejo > 0 ? (lucroVarejo / vendaVarejo) * 100 : 0;

    const lucroAtacado = vendaAtacado - invest;
    const margemAtacadoCalculada = vendaAtacado > 0 ? (lucroAtacado / vendaAtacado) * 100 : 0;

    const valInvest = document.getElementById('calc-invest-val');
    const valLucroVarejo = document.getElementById('calc-lucro-varejo-val');
    const valLucroAtacado = document.getElementById('calc-lucro-atacado-val');

    if (valInvest) valInvest.textContent = `R$ ${invest.toFixed(2)}`;
    if (valLucroVarejo) {
      valLucroVarejo.textContent = `R$ ${lucroVarejo.toFixed(2)} (${Math.round(margemVarejoCalculada)}%)`;
      valLucroVarejo.style.color = margemVarejoCalculada >= 50 ? 'var(--success)' : margemVarejoCalculada >= 25 ? 'var(--warning)' : 'var(--danger)';
    }
    if (valLucroAtacado) {
      valLucroAtacado.textContent = `R$ ${lucroAtacado.toFixed(2)} (${Math.round(margemAtacadoCalculada)}%)`;
      valLucroAtacado.style.color = margemAtacadoCalculada >= 40 ? 'var(--success)' : margemAtacadoCalculada >= 20 ? 'var(--warning)' : 'var(--danger)';
    }
  },

  abrirModalEdicao(prodId) {
    const prod = this.state.produtos.find(p => p.id === prodId);
    if (!prod) return;

    const elId = document.getElementById('prod-id');
    const elNome = document.getElementById('prod-nome');
    const elCategoria = document.getElementById('prod-categoria');
    const elCusto = document.getElementById('prod-custo');
    const elMaoObra = document.getElementById('prod-mao-obra');
    const elVenda = document.getElementById('prod-venda');
    const elVendaAtacado = document.getElementById('prod-venda-atacado');
    const elMargemVarejo = document.getElementById('prod-margem-desejada');
    const elMargemAtacado = document.getElementById('prod-margem-atacado');
    const elEstoque = document.getElementById('prod-estoque');
    const elFotoUrl = document.getElementById('prod-foto-url');
    const elFotoFile = document.getElementById('prod-foto-file');

    if (elId) elId.value = prod.id;
    if (elNome) elNome.value = prod.nome;
    if (elCategoria) elCategoria.value = prod.categoria;
    if (elCusto) elCusto.value = prod.custo;
    if (elMaoObra) elMaoObra.value = prod.mao_obra;
    if (elVenda) elVenda.value = prod.valor_venda;
    if (elVendaAtacado) elVendaAtacado.value = prod.valor_venda_atacado || '';
    if (elMargemVarejo) elMargemVarejo.value = prod.margem_desejada_varejo || '';
    if (elMargemAtacado) elMargemAtacado.value = prod.margem_desejada_atacado || '';
    if (elEstoque) elEstoque.value = prod.estoque;
    if (elFotoUrl) elFotoUrl.value = prod.foto || '';
    if (elFotoFile) elFotoFile.value = '';

    // Injetar composição da Ficha Técnica do produto
    const fichaContainer = document.getElementById('ficha-insumos-container');
    const fichaEmpty = document.getElementById('ficha-insumos-empty');
    if (fichaContainer) fichaContainer.innerHTML = '';
    
    if (prod.composicao && prod.composicao.length > 0) {
      if (fichaEmpty) fichaEmpty.style.display = 'none';
      prod.composicao.forEach(comp => {
        this.adicionarLinhaFichaTecnica(comp.insumo_id, comp.quantidade);
      });
    } else {
      if (fichaEmpty) fichaEmpty.style.display = 'block';
    }

    const elTitulo = document.getElementById('modal-produto-titulo');
    const elSubmit = document.getElementById('btn-submit-produto');
    if (elTitulo) elTitulo.textContent = 'Editar Peça';
    if (elSubmit) elSubmit.textContent = 'Salvar Alterações';

    this.calcularMargemFormProduto('venda');

    const modal = document.getElementById('modal-produto');
    if (modal) modal.classList.add('active');
  },

  abrirConfirmacaoExclusao(prodId, prodNome) {
    const elNome = document.getElementById('delete-prod-nome');
    if (elNome) elNome.textContent = prodNome;

    const modal = document.getElementById('modal-confirmacao-exclusao');
    if (modal) {
      modal.classList.add('active');
      const btnConfirmar = modal.querySelector('.btn-confirm-delete');
      if (btnConfirmar) {
        btnConfirmar.setAttribute('data-id', prodId);
      }
    }
  },

  sincronizarProdutoSelecionadoFormVenda() {
    const select = document.getElementById('venda-produto-id');
    const prodId = select.value;
    
    const inputValor = document.getElementById('venda-valor-venda');
    const inputQtd = document.getElementById('venda-qtd');
    const stockWarn = document.getElementById('venda-estoque-warn');

    if (!prodId) {
      if (inputValor) inputValor.value = '';
      return;
    }

    const prod = this.state.produtos.find(p => p.id === prodId);
    if (prod) {
      const qtd = parseInt(inputQtd.value) || 1;
      const tipo = document.getElementById('venda-tipo-cliente').value;
      
      if (tipo === 'varejo') {
        const totalVenda = prod.valor_venda * qtd;
        if (inputValor) inputValor.value = totalVenda.toFixed(2);
      } else if (tipo === 'atacado') {
        const totalVenda = (prod.valor_venda_atacado || prod.valor_venda) * qtd;
        if (inputValor) inputValor.value = totalVenda.toFixed(2);
      }

      if (stockWarn) {
        const custoUn = prod.custo + prod.mao_obra;
        const totalCusto = custoUn * qtd;
        document.getElementById('venda-calc-custo').textContent = `R$ ${totalCusto.toFixed(2)}`;

        if (prod.estoque < qtd) {
          stockWarn.innerHTML = `<i class="fas fa-triangle-exclamation" style="color: var(--danger)"></i> Saldo em estoque insuficiente! Disponível: ${prod.estoque} un.`;
        } else {
          stockWarn.innerHTML = `<i class="fas fa-check" style="color: var(--accent)"></i> Peça em estoque (Disponível: ${prod.estoque} un).`;
        }
      }

      // Verifica se o produto consome corda genérica
      const vendaCorGroup = document.getElementById('venda-cor-corda-group');
      const selectCorCorda = document.getElementById('venda-cor-corda');
      
      const consomeCordaGenerica = prod.composicao && prod.composicao.some(item => item.insumo_id === 'i_corda_generica');
      
      if (consomeCordaGenerica) {
        if (vendaCorGroup) {
          vendaCorGroup.style.display = 'block';
          this.popularSelectCoresCorda();
          if (selectCorCorda) {
            selectCorCorda.setAttribute('required', 'true');
          }
        }
      } else {
        if (vendaCorGroup) {
          vendaCorGroup.style.display = 'none';
          if (selectCorCorda) {
            selectCorCorda.removeAttribute('required');
            selectCorCorda.value = '';
          }
        }
      }

      this.calcularMargemFormVendaAtacado();
    }
  },

  popularSelectCoresCorda() {
    const select = document.getElementById('venda-cor-corda');
    if (!select) return;

    const valorAtual = select.value;
    select.innerHTML = '<option value="">-- Selecione a Cor da Corda --</option>';
    
    // Filtrar apenas insumos do tipo 'corda' e que não sejam o genérico
    const insumosCores = this.state.insumos.filter(ins => ins.tipo === 'corda' && ins.id !== 'i_corda_generica');
    
    // Ordenar alfabeticamente pelo nome (que é "Corda [cor]")
    insumosCores.sort((a, b) => a.nome.localeCompare(b.nome));

    insumosCores.forEach(ins => {
      const option = document.createElement('option');
      option.value = ins.id;
      // Mostrar estoque atual no texto da option para ajudar na decisão do usuário
      option.textContent = `${ins.nome.replace('Corda ', '')} (Estoque: ${ins.estoque_atual}m)`;
      select.appendChild(option);
    });

    if (valorAtual) {
      select.value = valorAtual;
    }
  },

  calcularMargemFormVendaAtacado() {
    const select = document.getElementById('venda-produto-id');
    const prodId = select.value;
    const prod = this.state.produtos.find(p => p.id === prodId);

    const calcBox = document.getElementById('venda-calc-box');
    const valLucro = document.getElementById('venda-calc-lucro');
    const valMargem = document.getElementById('venda-calc-margem');

    if (!prod || !calcBox || !valLucro || !valMargem) return;

    const qtd = parseInt(document.getElementById('venda-qtd').value) || 1;
    const valorVendaTotal = parseFloat(document.getElementById('venda-valor-venda').value) || 0;
    
    const custoUnidade = prod.custo + prod.mao_obra;
    const totalCusto = custoUnidade * qtd;
    document.getElementById('venda-calc-custo').textContent = `R$ ${totalCusto.toFixed(2)}`;

    const lucroReal = valorVendaTotal - totalCusto;
    const margemReal = valorVendaTotal > 0 ? (lucroReal / valorVendaTotal) * 100 : 0;

    valLucro.textContent = `R$ ${lucroReal.toFixed(2)}`;
    valMargem.textContent = `${margemReal.toFixed(0)}%`;

    valLucro.className = 'calc-value';
    valMargem.className = 'calc-value';

    if (margemReal >= 50) {
      valLucro.classList.add('pos');
      valMargem.classList.add('pos');
    } else if (margemReal < 25) {
      valLucro.classList.add('neg');
      valMargem.classList.add('neg');
    }
  },

  popularSelectProdutosFormVenda() {
    const select = document.getElementById('venda-produto-id');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Selecione uma peça do catálogo...</option>';
    
    this.state.produtos.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.nome} (Disponível: ${p.estoque} un | R$ ${p.valor_venda.toFixed(2)})`;
      select.appendChild(opt);
    });
  },

  popularSelectsCategorias() {
    const filtroSelect = document.getElementById('filtro-produtos-categoria');
    const formSelect = document.getElementById('prod-categoria');
    
    if (filtroSelect) {
      const valorAtual = filtroSelect.value;
      filtroSelect.innerHTML = '<option value="todos">Todas Categorias</option>';
      this.state.categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filtroSelect.appendChild(option);
      });
      if (this.state.categorias.includes(valorAtual) || valorAtual === 'todos') {
        filtroSelect.value = valorAtual;
      } else {
        filtroSelect.value = 'todos';
        this.state.filtros.produtos.categoria = 'todos';
      }
    }
    
    if (formSelect) {
      const valorAtual = formSelect.value;
      formSelect.innerHTML = '';
      this.state.categorias.forEach((cat, index) => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        if (index === 0 && !valorAtual) {
          option.selected = true;
        }
        formSelect.appendChild(option);
      });
      if (this.state.categorias.includes(valorAtual)) {
        formSelect.value = valorAtual;
      }
    }
  },

  renderizarListaCategorias() {
    const container = document.getElementById('categorias-list-container');
    if (!container) return;
    
    if (this.state.categorias.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 16px; font-size: 13px;">Nenhuma categoria ativa.</div>';
      return;
    }
    
    container.innerHTML = '';
    this.state.categorias.forEach(cat => {
      const item = document.createElement('div');
      item.className = 'categoria-item';
      
      const isOutros = cat.toLowerCase() === 'outros';
      
      item.innerHTML = `
        <span class="categoria-nome">${cat}</span>
        ${isOutros ? 
          `<span style="font-size: 11px; color: var(--text-muted); font-style: italic; padding: 4px 8px;">Sistema</span>` : 
          `<button type="button" class="btn-delete-cat" title="Excluir Categoria" data-nome="${cat}">
            <i class="fas fa-trash"></i>
          </button>`
        }
      `;
      
      if (!isOutros) {
        item.querySelector('.btn-delete-cat').addEventListener('click', () => {
          this.handleDeletarCategoria(cat);
        });
      }
      
      container.appendChild(item);
    });
  },

  async handleSubmitNovaCategoria(e) {
    e.preventDefault();
    const inputNome = document.getElementById('cat-novo-nome');
    if (!inputNome) return;
    
    const nome = inputNome.value.trim();
    if (!nome) return;

    if (this.state.categorias.map(c => c.toLowerCase()).includes(nome.toLowerCase())) {
      this.showToast('Categoria já existe', `A categoria "${nome}" já está cadastrada.`, 'warning');
      return;
    }

    this.state.categorias = await DB.salvarCategoria(nome);
    inputNome.value = '';
    
    this.popularSelectsCategorias();
    this.renderizarListaCategorias();
    
    this.showToast('Categoria Cadastrada', `A categoria "${nome}" foi adicionada com sucesso.`, 'success');
  },

  async handleDeletarCategoria(nome) {
    const produtosNaCategoria = this.state.produtos.filter(p => p.categoria.toLowerCase() === nome.toLowerCase().trim());
    
    let mensagemConfirmacao = `Tem certeza que deseja apagar a categoria "${nome}"?`;
    if (produtosNaCategoria.length > 0) {
      mensagemConfirmacao = `Atenção: Existem ${produtosNaCategoria.length} produto(s) nesta categoria. Se você apagá-la, a categoria deles será alterada para "Outros". Deseja prosseguir?`;
    }
    
    if (confirm(mensagemConfirmacao)) {
      try {
        this.state.categorias = await DB.deletarCategoria(nome);
        
        if (!this.state.categorias.map(c => c.toLowerCase()).includes('outros')) {
          this.state.categorias = await DB.salvarCategoria('Outros');
        }

        if (produtosNaCategoria.length > 0) {
          for (const prod of produtosNaCategoria) {
            prod.categoria = 'Outros';
            await DB.salvarProduto(prod);
          }
          this.state.produtos = await DB.getProdutos();
        }

        this.popularSelectsCategorias();
        this.renderizarListaCategorias();
        this.renderizarTabelaProdutos();
        this.atualizarDashboard();
        
        this.showToast('Categoria Removida', `A categoria "${nome}" foi apagada com sucesso.`, 'success');
      } catch (err) {
        console.error("Erro ao deletar categoria:", err);
        this.showToast('Erro ao remover', 'Não foi possível apagar a categoria.', 'danger');
      }
    }
  },

  converterArquivoParaBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  // 14. SUBMITS DE CADASTROS
  async handleSubmitProduto(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const nome = document.getElementById('prod-nome').value.trim();
    const categoria = document.getElementById('prod-categoria').value;
    const custo = parseFloat(document.getElementById('prod-custo').value);
    const maoObraInput = document.getElementById('prod-mao-obra');
    const maoObraRaw = maoObraInput ? maoObraInput.value.trim() : '';
    const maoObra = parseFloat(maoObraRaw);
    const valorVenda = parseFloat(document.getElementById('prod-venda').value);
    const valorVendaAtacado = parseFloat(document.getElementById('prod-venda-atacado').value) || 0;
    const margemDesejadaVarejo = parseFloat(document.getElementById('prod-margem-desejada').value) || 0;
    const margemDesejadaAtacado = parseFloat(document.getElementById('prod-margem-atacado').value) || 0;
    const estoque = parseInt(document.getElementById('prod-estoque').value) || 0;

    // Validação explícita de campo de mão de obra vazio/indefinido
    if (maoObraRaw === '' || isNaN(maoObra)) {
      this.showToast('Mão de Obra Requerida', 'Por favor, defina um valor para o campo "Valor Mão de Obra (R$)".', 'warning');
      if (maoObraInput) {
        maoObraInput.focus();
        maoObraInput.style.borderColor = 'var(--danger)';
      }
      return;
    }

    // Resetar cor de borda caso esteja válida
    if (maoObraInput) {
      maoObraInput.style.borderColor = '';
    }

    if (!nome || !categoria || isNaN(custo) || isNaN(maoObra) || isNaN(valorVenda) || isNaN(valorVendaAtacado)) {
      this.showToast('Formulário Inválido', 'Por favor, preencha todos os dados.', 'danger');
      return;
    }

    const fotoUrlInput = document.getElementById('prod-foto-url');
    const fotoFileInput = document.getElementById('prod-foto-file');
    let fotoUrl = fotoUrlInput ? fotoUrlInput.value.trim() : '';

    if (fotoFileInput && fotoFileInput.files && fotoFileInput.files[0]) {
      const file = fotoFileInput.files[0];
      try {
        fotoUrl = await this.converterArquivoParaBase64(file);
      } catch (err) {
        console.error("Erro ao converter imagem para base64:", err);
      }
    }

    // Obter composição da Ficha Técnica
    const composicao = [];
    const rows = document.querySelectorAll('.ficha-insumo-row');
    rows.forEach(row => {
      const select = row.querySelector('.ficha-insumo-select');
      const qtdEl = row.querySelector('.ficha-insumo-qtd');
      const insumoId = select.value;
      const qtd = parseFloat(qtdEl.value) || 0;
      if (insumoId && qtd > 0) {
        composicao.push({ insumo_id: insumoId, quantidade: qtd });
      }
    });

    const produto = { 
      nome, 
      categoria, 
      custo, 
      mao_obra: maoObra, 
      valor_venda: valorVenda, 
      valor_venda_atacado: valorVendaAtacado,
      margem_desejada_varejo: margemDesejadaVarejo,
      margem_desejada_atacado: margemDesejadaAtacado,
      estoque,
      foto: fotoUrl,
      composicao
    };
    if (id) {
      produto.id = id;
    }
    
    try {
      const isEdicao = !!id;
      await DB.salvarProduto(produto);
      await this.carregarDados();
      this.renderizarTabelaProdutos();
      
      document.getElementById('modal-produto').classList.remove('active');
      document.getElementById('form-produto').reset();
      
      const msgTitulo = isEdicao ? 'Peça Atualizada' : 'Peça Cadastrada';
      const msgCorpo = isEdicao ? `"${nome}" foi atualizado com sucesso!` : `"${nome}" foi inserido com sucesso!`;
      this.showToast(msgTitulo, msgCorpo, 'success');
      this.atualizarDashboard();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      this.showToast('Erro ao Salvar', 'Não foi possível registrar o produto.', 'danger');
    }
  },

  async handleSubmitVenda(e) {
    e.preventDefault();
    const produtoId = document.getElementById('venda-produto-id').value;
    const clienteNome = document.getElementById('venda-cliente').value.trim();
    const dataVenda = document.getElementById('venda-data').value;
    const quantidade = parseInt(document.getElementById('venda-qtd').value);
    const tipoCliente = document.getElementById('venda-tipo-cliente').value;
    const pagamento = document.getElementById('venda-pagamento').value;
    const valorVenda = parseFloat(document.getElementById('venda-valor-venda').value);
    const observacoes = document.getElementById('venda-obs').value.trim();

    if (!produtoId || !clienteNome || !dataVenda || isNaN(quantidade) || !pagamento || isNaN(valorVenda)) {
      this.showToast('Campos Inválidos', 'Por favor, confira os dados da transação.', 'danger');
      return;
    }

    const prod = this.state.produtos.find(p => p.id === produtoId);
    if (prod && prod.estoque < quantidade) {
      if (!confirm(`O estoque atual deste produto é de ${prod.estoque} peças. Deseja continuar e registrar saldo negativo?`)) {
        return;
      }
    }

    const venda = {
      produto_id: produtoId,
      cliente_nome: clienteNome,
      tipo_cliente: tipoCliente,
      pagamento: pagamento,
      quantidade: quantidade,
      valor_venda: valorVenda,
      observacoes: observacoes,
      created_at: new Date(dataVenda).toISOString()
    };

    try {
      await DB.registrarVenda(venda);

      // Baixa proporcional de insumos baseada na composição da peça
      if (prod && prod.composicao && prod.composicao.length > 0) {
        const corCordaIdSelected = document.getElementById('venda-cor-corda')?.value;

        for (const item of prod.composicao) {
          let insumoIdABaixar = item.insumo_id;
          
          // Se for o insumo genérico de corda e houver uma cor selecionada, direcionamos a baixa para a cor!
          if (item.insumo_id === 'i_corda_generica' && corCordaIdSelected) {
            insumoIdABaixar = corCordaIdSelected;
          }

          const insumo = this.state.insumos.find(i => i.id === insumoIdABaixar);
          if (insumo) {
            const quantidadeConsumida = item.quantidade * quantidade;
            insumo.estoque_atual = Math.max(0, insumo.estoque_atual - quantidadeConsumida);
            await DB.salvarInsumo(insumo);

            // Alerta proativo imediato de estoque crítico
            if (insumo.estoque_atual <= insumo.estoque_minimo) {
              this.showToast(
                'Alerta de Estoque', 
                `A corda "${insumo.nome.replace('Corda ', '')}" atingiu o limite crítico (Restam apenas ${insumo.estoque_atual}m)!`, 
                'danger'
              );
            }
          }
        }
      }

      await this.carregarDados();
      this.renderizarTabelaVendas();

      // Se a aba de insumos estiver ativa, atualiza a tabela correspondente
      const tabInsumos = document.getElementById('sec-insumos');
      if (tabInsumos && tabInsumos.classList.contains('active')) {
        this.renderizarTabelaInsumos();
      }
      
      document.getElementById('modal-venda')?.classList.remove('active');
      this.resetarFormVenda();

      this.showToast('Venda Registrada!', `Lançamento efetuado para ${clienteNome}.`, 'success');
      this.atualizarDashboard();
    } catch (err) {
      console.error("Erro ao registrar venda:", err);
      this.showToast('Erro de Registro', 'Falha ao processar a venda.', 'danger');
    }
  },

  resetarFormVenda() {
    const form = document.getElementById('form-venda');
    if (!form) return;
    form.reset();

    // Restaurar stepper para 1
    const inputQtd = document.getElementById('venda-qtd');
    if (inputQtd) inputQtd.value = 1;

    // Restaurar canal de venda para Varejo
    const segmentedButtons = document.querySelectorAll('.segmented-control .segmented-btn');
    const hiddenTipo = document.getElementById('venda-tipo-cliente');
    segmentedButtons.forEach(b => {
      if (b.getAttribute('data-value') === 'varejo') {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    if (hiddenTipo) {
      hiddenTipo.value = 'varejo';
      hiddenTipo.dispatchEvent(new Event('change'));
    }

    // Restaurar forma de pagamento para PIX
    const paymentButtons = document.querySelectorAll('.payment-grid-touch .payment-btn');
    const hiddenPagamento = document.getElementById('venda-pagamento');
    paymentButtons.forEach(b => {
      if (b.getAttribute('data-value') === 'PIX') {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    if (hiddenPagamento) hiddenPagamento.value = 'PIX';

    // Limpar avisos e relógios
    document.getElementById('venda-estoque-warn').innerHTML = '';
    
    // Limpar seleção de cor de corda e ocultar contêiner
    const selectCorCorda = document.getElementById('venda-cor-corda');
    if (selectCorCorda) {
      selectCorCorda.value = '';
      selectCorCorda.removeAttribute('required');
    }
    const vendaCorGroup = document.getElementById('venda-cor-corda-group');
    if (vendaCorGroup) {
      vendaCorGroup.style.display = 'none';
    }

    this.inicializarDataFormVenda();
  },

  async handleSubmitCliente(e) {
    e.preventDefault();
    const nome = document.getElementById('cli-nome').value.trim();
    const telefone = document.getElementById('cli-telefone').value.trim();
    const tipo = document.getElementById('cli-tipo').value;

    if (!nome) {
      this.showToast('Preenchimento Inválido', 'O nome do cliente é obrigatório.', 'danger');
      return;
    }

    const cliente = { nome, telefone, tipo_cliente: tipo, total_compras: 0 };
    
    try {
      await DB.salvarCliente(cliente);
      await this.carregarDados();
      this.renderizarTabelaClientes();

      document.getElementById('modal-cliente').classList.remove('active');
      document.getElementById('form-cliente').reset();

      this.showToast('Cliente Adicionado', `O cliente "${nome}" foi cadastrado com sucesso!`, 'success');
    } catch (err) {
      console.error("Erro ao cadastrar cliente:", err);
      this.showToast('Erro ao cadastrar', 'Falha ao salvar a ficha do cliente.', 'danger');
    }
  },

  async handleSubmitSupabase(e) {
    e.preventDefault();
    const url = document.getElementById('supa-url').value.trim();
    const key = document.getElementById('supa-key').value.trim();

    if (!url || !key) {
      this.showToast('Credenciais Inválidas', 'Preencha a URL e a Anon Key.', 'danger');
      return;
    }

    const sucesso = DB.setSupabaseConfig(url, key);
    if (sucesso) {
      try {
        await this.carregarDados();
        this.atualizarDashboard();
        this.atualizarStatusSupabaseUI();
        this.showToast('Conectado à Nuvem', 'Seu banco de dados agora está ativado no Supabase!', 'success');
      } catch (err) {
        console.error("Erro ao conectar Supabase:", err);
        this.showToast('Falha na Conexão', 'Não foi possível sincronizar as tabelas do Supabase.', 'danger');
      }
    } else {
      this.showToast('Erro na Conexão', 'Não foi possível configurar a biblioteca do Supabase.', 'danger');
    }
  },

  async handleDesconectarSupabase(e) {
    e.preventDefault();
    DB.clearSupabaseConfig();
    document.getElementById('supa-url').value = '';
    document.getElementById('supa-key').value = '';
    
    await this.carregarDados();
    this.atualizarDashboard();
    this.atualizarStatusSupabaseUI();
    this.showToast('Banco Local Ativo', 'Desconectado do Supabase. Operando via LocalStorage.', 'info');
  },

  atualizarStatusSupabaseUI() {
    const dot = document.getElementById('supa-status-dot');
    const text = document.getElementById('supa-status-text');
    
    if (dot && text) {
      const active = DB.isSupabaseActive();
      if (active) {
        dot.className = 'status-dot active';
        text.innerHTML = 'Conexão Estabelecida! Operando em <strong>Nuvem (Supabase)</strong>.';
      } else {
        dot.className = 'status-dot inactive';
        text.innerHTML = 'Desconectado da Nuvem. Operando em <strong>Banco de Dados Local (LocalStorage)</strong>.';
      }
    }
  },

  // 15. EXPORTAÇÃO CSV
  exportarVendasParaCSV() {
    const vendas = this.state.vendas;
    if (vendas.length === 0) {
      this.showToast('Exportação Inválida', 'Não há registros de vendas.', 'danger');
      return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM
    csvContent += "Produto;Cliente;Data;Tipo;Pagamento;Quantidade;Valor Total Venda (R$);Lucro Real (R$)\r\n";

    vendas.forEach(v => {
      const dt = new Date(v.created_at);
      const dataStr = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
      
      const linha = [
        v.produto_nome.replace(/;/g, ','),
        v.cliente_nome.replace(/;/g, ','),
        dataStr,
        v.tipo_cliente,
        v.pagamento,
        v.quantidade,
        v.valor_venda.toFixed(2).replace('.', ','),
        v.lucro.toFixed(2).replace('.', ',')
      ];

      csvContent += linha.join(";") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const dataHoraStr = new Date().toISOString().slice(0,10);
    link.setAttribute("download", `relatorio_vendas_deuno_${dataHoraStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('Download Concluído', 'Relatório CSV exportado com sucesso!', 'success');
  },

  // === MÓDULO DE GESTÃO DE INSUMOS & MATÉRIA-PRIMA ===
  renderizarTabelaInsumos() {
    const tbody = document.getElementById('table-insumos-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const busca = (this.state.filtros.insumos?.busca || '').toLowerCase();
    const tipo = this.state.filtros.insumos?.tipo || 'todos';

    const filtrados = this.state.insumos.filter(insumo => {
      const matchBusca = insumo.nome.toLowerCase().includes(busca) || 
                         insumo.especificacao.toLowerCase().includes(busca);
      const matchTipo = tipo === 'todos' || insumo.tipo === tipo;
      return matchBusca && matchTipo;
    });

    if (filtrados.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state" style="text-align: center; padding: 24px; color: var(--text-muted);">
            <i class="fas fa-box-open" style="font-size: 24px; margin-bottom: 8px; display: block; color: var(--text-gold);"></i>
            Nenhum material encontrado com os filtros atuais.
          </td>
        </tr>
      `;
      return;
    }

    filtrados.forEach(insumo => {
      const tr = document.createElement('tr');
      
      // Calcular limite de estoque
      const precoCusto = parseFloat(insumo.preco_custo) || 0;
      const estoqueAtual = parseFloat(insumo.estoque_atual) || 0;
      const estoqueMinimo = parseFloat(insumo.estoque_minimo) || 0;

      let badgeClass = 'badge-success';
      let statusTexto = 'Saudável';
      if (estoqueAtual <= estoqueMinimo) {
        badgeClass = 'badge-danger';
        statusTexto = 'Crítico';
      } else if (estoqueAtual <= estoqueMinimo * 1.5) {
        badgeClass = 'badge-warning';
        statusTexto = 'Alerta';
      }

      const precoCustoStr = precoCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const estoqueAtualStr = `${estoqueAtual} ${insumo.unidade_medida === 'metro' ? 'm' : insumo.unidade_medida === 'grama' ? 'g' : 'un'}`;
      const estoqueMinimoStr = `${estoqueMinimo} ${insumo.unidade_medida === 'metro' ? 'm' : insumo.unidade_medida === 'grama' ? 'g' : 'un'}`;

      tr.innerHTML = `
        <td style="font-weight: 600; color: var(--text-primary);">${insumo.nome}</td>
        <td style="text-transform: capitalize; color: var(--text-secondary);">${insumo.tipo}</td>
        <td style="color: var(--text-secondary);">${insumo.especificacao}</td>
        <td style="font-weight: 600; color: var(--text-gold);">${precoCustoStr}</td>
        <td style="text-transform: capitalize; color: var(--text-secondary);">${insumo.unidade_medida}</td>
        <td style="font-weight: 700; color: ${estoqueAtual <= estoqueMinimo ? 'var(--danger)' : 'var(--text-primary)'}">${estoqueAtualStr}</td>
        <td style="color: var(--text-muted);">${estoqueMinimoStr}</td>
        <td><span class="badge ${badgeClass}">${statusTexto}</span></td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 8px; justify-content: center;">
            <button class="btn btn-secondary btn-touch-icon btn-editar-insumo" data-id="${insumo.id}" title="Editar Material" style="padding: 6px 10px; height: auto;">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-touch-icon btn-deletar-insumo" data-id="${insumo.id}" title="Apagar Material" style="padding: 6px 10px; height: auto; background: var(--danger); border-color: var(--danger); color: white;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Registrar eventos para os botões recém-criados
    tbody.querySelectorAll('.btn-editar-insumo').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.abrirModalInsumo(id);
      });
    });

    tbody.querySelectorAll('.btn-deletar-insumo').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deletarInsumo(id);
      });
    });
  },

  abrirModalInsumo(id = '') {
    const modal = document.getElementById('modal-insumo');
    const form = document.getElementById('form-insumo');
    if (!modal || !form) return;

    form.reset();

    const elId = document.getElementById('insumo-id');
    const elNome = document.getElementById('insumo-nome');
    const elTipo = document.getElementById('insumo-tipo');
    const elEspecificacao = document.getElementById('insumo-especificacao');
    const elPreco = document.getElementById('insumo-preco');
    const elUnidade = document.getElementById('insumo-unidade');
    const elEstoqueAtual = document.getElementById('insumo-estoque-atual');
    const elEstoqueMinimo = document.getElementById('insumo-estoque-minimo');

    const elTitulo = document.getElementById('modal-insumo-titulo');
    const elSubmit = document.getElementById('btn-submit-insumo');

    if (id) {
      // Edição
      const insumo = this.state.insumos.find(i => i.id === id);
      if (!insumo) return;

      if (elId) elId.value = insumo.id;
      if (elNome) elNome.value = insumo.nome;
      if (elTipo) elTipo.value = insumo.tipo;
      if (elEspecificacao) elEspecificacao.value = insumo.especificacao;
      if (elPreco) elPreco.value = insumo.preco_custo;
      if (elUnidade) elUnidade.value = insumo.unidade_medida;
      if (elEstoqueAtual) elEstoqueAtual.value = insumo.estoque_atual;
      if (elEstoqueMinimo) elEstoqueMinimo.value = insumo.estoque_minimo;

      if (elTitulo) elTitulo.textContent = 'Editar Material';
      if (elSubmit) elSubmit.textContent = 'Salvar Alterações';
    } else {
      // Novo
      if (elId) elId.value = '';
      if (elEstoqueAtual) elEstoqueAtual.value = 10;
      if (elEstoqueMinimo) elEstoqueMinimo.value = 5;

      if (elTitulo) elTitulo.textContent = 'Cadastrar Novo Material';
      if (elSubmit) elSubmit.textContent = 'Cadastrar Material';
    }

    modal.classList.add('active');
  },

  async handleSubmitInsumo(e) {
    e.preventDefault();
    const id = document.getElementById('insumo-id').value;
    const nome = document.getElementById('insumo-nome').value.trim();
    const tipo = document.getElementById('insumo-tipo').value;
    const especificacao = document.getElementById('insumo-especificacao').value.trim();
    const precoCusto = parseFloat(document.getElementById('insumo-preco').value);
    const unidadeMedida = document.getElementById('insumo-unidade').value;
    const estoqueAtual = parseFloat(document.getElementById('insumo-estoque-atual').value) || 0;
    const estoqueMinimo = parseFloat(document.getElementById('insumo-estoque-minimo').value) || 0;

    if (!nome || !tipo || !especificacao || isNaN(precoCusto)) {
      this.showToast('Campos Inválidos', 'Por favor, confira os dados do material.', 'danger');
      return;
    }

    const insumo = {
      nome,
      tipo,
      especificacao,
      preco_custo: precoCusto,
      unidade_medida: unidadeMedida,
      estoque_atual: estoqueAtual,
      estoque_minimo: estoqueMinimo
    };

    if (id) {
      insumo.id = id;
    }

    try {
      const isEdicao = !!id;
      await DB.salvarInsumo(insumo);
      await this.carregarDados();
      this.renderizarTabelaInsumos();

      const modal = document.getElementById('modal-insumo');
      if (modal) modal.classList.remove('active');
      document.getElementById('form-insumo').reset();

      const msgTitulo = isEdicao ? 'Material Atualizado' : 'Material Cadastrado';
      const msgCorpo = isEdicao ? `"${nome}" foi atualizado com sucesso!` : `"${nome}" foi cadastrado com sucesso!`;
      this.showToast(msgTitulo, msgCorpo, 'success');
      this.atualizarDashboard();
    } catch (err) {
      console.error("Erro ao salvar insumo:", err);
      this.showToast('Erro ao Salvar', 'Não foi possível registrar o material.', 'danger');
    }
  },

  async deletarInsumo(id) {
    const insumo = this.state.insumos.find(i => i.id === id);
    if (!insumo) return;

    if (confirm(`Deseja realmente excluir o material "${insumo.nome} (${insumo.especificacao})"?`)) {
      try {
        await DB.deletarInsumo(id);
        await this.carregarDados();
        this.renderizarTabelaInsumos();
        this.showToast('Material Removido', 'O material foi excluído com sucesso.', 'success');
        this.atualizarDashboard();
      } catch (err) {
        console.error("Erro ao deletar insumo:", err);
        this.showToast('Erro ao Excluir', 'Não foi possível remover o material.', 'danger');
      }
    }
  },

  adicionarLinhaFichaTecnica(insumoId = '', quantidade = 1) {
    const container = document.getElementById('ficha-insumos-container');
    const emptyEl = document.getElementById('ficha-insumos-empty');
    if (!container) return;

    if (emptyEl) emptyEl.style.display = 'none';

    if (this.state.insumos.length === 0) {
      this.showToast('Nenhum Material', 'Cadastre materiais na aba de Materiais antes de compor a peça!', 'warning');
      return;
    }

    const row = document.createElement('div');
    row.className = 'ficha-insumo-row';
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';
    row.style.marginBottom = '8px';

    // Gerar options dos insumos cadastrados
    let optionsHtml = '<option value="">-- Escolha o Material --</option>';
    this.state.insumos.forEach(ins => {
      optionsHtml += `<option value="${ins.id}" data-preco="${ins.preco_custo}" data-unidade="${ins.unidade_medida}">${ins.nome} (${ins.especificacao}) - ${ins.preco_custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/${ins.unidade_medida === 'metro' ? 'm' : ins.unidade_medida === 'grama' ? 'g' : 'un'}</option>`;
    });

    row.innerHTML = `
      <!-- Select real escondido para manter compatibilidade com a lógica existente -->
      <select class="form-control ficha-insumo-select" style="display: none;" required>
        ${optionsHtml}
      </select>
      
      <!-- Caixa de toque bonita que exibe o insumo selecionado -->
      <div class="ficha-insumo-trigger" style="flex: 2; font-size: 11px; padding: 6px 10px; height: 35px; border: 1px solid var(--border-dim); border-radius: var(--radius-sm); background: var(--bg-card); display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; min-width: 0;">
        <span class="ficha-insumo-label" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">-- Escolha o Material --</span>
        <i class="fas fa-search" style="color: var(--text-muted); font-size: 10px; margin-left: 4px; flex-shrink: 0;"></i>
      </div>
      
      <input type="number" class="form-control ficha-insumo-qtd" placeholder="Qtd" min="0.01" step="0.01" style="flex: 1; font-size: 11px; padding: 6px 8px; height: 35px; max-width: 80px;" value="${quantidade}" required>
      <span class="ficha-insumo-custo" style="font-size: 11px; font-weight: 600; min-width: 65px; text-align: right; color: var(--text-secondary);">R$ 0.00</span>
      <button type="button" class="btn-delete-ficha-insumo" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 0 4px; font-size: 13px; flex-shrink: 0;">
        <i class="fas fa-trash"></i>
      </button>
    `;

    container.appendChild(row);

    const selectEl = row.querySelector('.ficha-insumo-select');
    const triggerEl = row.querySelector('.ficha-insumo-trigger');
    const qtdEl = row.querySelector('.ficha-insumo-qtd');
    const custoEl = row.querySelector('.ficha-insumo-custo');
    const deleteBtn = row.querySelector('.btn-delete-ficha-insumo');

    if (insumoId) {
      selectEl.value = insumoId;
    }

    const atualizarCustoLinha = () => {
      const selectedOption = selectEl.options[selectEl.selectedIndex];
      const preco = parseFloat(selectedOption?.getAttribute('data-preco')) || 0;
      const labelText = selectedOption ? selectedOption.text : '-- Escolha o Material --';
      
      const labelEl = row.querySelector('.ficha-insumo-label');
      if (labelEl) {
        labelEl.textContent = labelText.split(' - R$')[0]; // Nome limpo sem o preço repetido para economizar espaço
      }

      const qtd = parseFloat(qtdEl.value) || 0;
      const custoLinha = preco * qtd;
      custoEl.textContent = custoLinha.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.recalcularCustosFichaTecnica();
    };

    selectEl.addEventListener('change', atualizarCustoLinha);
    qtdEl.addEventListener('input', atualizarCustoLinha);

    // Abre o modal de busca ao clicar na caixa do insumo
    triggerEl.addEventListener('click', () => {
      this.abrirModalBuscaInsumo(row);
    });

    deleteBtn.addEventListener('click', () => {
      row.remove();
      if (container.querySelectorAll('.ficha-insumo-row').length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
      }
      this.recalcularCustosFichaTecnica();
    });

    // Rodar cálculo inicial
    atualizarCustoLinha();
  },

  recalcularCustosFichaTecnica() {
    let custoTotalInsumos = 0;
    const rows = document.querySelectorAll('.ficha-insumo-row');
    
    rows.forEach(row => {
      const select = row.querySelector('.ficha-insumo-select');
      const qtdEl = row.querySelector('.ficha-insumo-qtd');
      const selectedOption = select.options[select.selectedIndex];
      const preco = parseFloat(selectedOption?.getAttribute('data-preco')) || 0;
      const qtd = parseFloat(qtdEl.value) || 0;
      custoTotalInsumos += preco * qtd;
    });

    const elCusto = document.getElementById('prod-custo');
    if (elCusto) {
      elCusto.value = custoTotalInsumos.toFixed(2);
      elCusto.dispatchEvent(new Event('input'));
    }
  },

  abrirModalBuscaInsumo(alvo = 'nova') {
    this.state.linhaFichaAtiva = alvo;
    
    const buscaInput = document.getElementById('busca-insumo-termo');
    if (buscaInput) buscaInput.value = '';

    const tagButtons = document.querySelectorAll('#busca-insumo-categorias .btn-tag');
    tagButtons.forEach(b => {
      if (b.getAttribute('data-tipo') === 'todos') {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    this.renderizarListaBuscaInsumos();

    const modal = document.getElementById('modal-selecionar-insumo');
    if (modal) modal.classList.add('active');
  },

  renderizarListaBuscaInsumos() {
    const listaEl = document.getElementById('busca-insumo-lista');
    if (!listaEl) return;

    const termo = (document.getElementById('busca-insumo-termo')?.value || '').toLowerCase().trim();
    const btnAtivo = document.querySelector('#busca-insumo-categorias .btn-tag.active');
    const tipoFiltro = btnAtivo ? btnAtivo.getAttribute('data-tipo') : 'todos';

    const insumosFiltrados = this.state.insumos.filter(ins => {
      // Oculta todas as cordas com cor na seleção de Ficha Técnica,
      // permitindo escolher APENAS o insumo genérico "Corda (Sem Cor)".
      if (ins.tipo === 'corda' && ins.id !== 'i_corda_generica') {
        return false;
      }

      const bateTermo = !termo || 
        ins.nome.toLowerCase().includes(termo) || 
        (ins.especificacao && ins.especificacao.toLowerCase().includes(termo)) ||
        (ins.tipo && ins.tipo.toLowerCase().includes(termo));
      
      const bateTipo = tipoFiltro === 'todos' || ins.tipo === tipoFiltro;

      return bateTermo && bateTipo;
    });

    if (insumosFiltrados.length === 0) {
      listaEl.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">
          <i class="fas fa-box-open" style="font-size: 28px; display: block; margin-bottom: 10px; color: var(--border);"></i>
          Nenhum material encontrado.
        </div>
      `;
      return;
    }

    listaEl.innerHTML = '';
    insumosFiltrados.forEach(ins => {
      const card = document.createElement('div');
      card.className = 'busca-insumo-card';
      
      card.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 3px; max-width: 72%;">
          <span style="font-weight: 600; font-size: 13px; color: var(--accent);">${ins.nome}</span>
          <span style="font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
            <i class="fas fa-tags" style="font-size: 9px; color: var(--text-muted);"></i> 
            ${ins.tipo.toUpperCase()} &bull; ${ins.especificacao}
          </span>
        </div>
        <div style="text-align: right; display: flex; flex-direction: column; gap: 2px;">
          <span style="font-weight: 700; font-size: 13px; color: var(--text-gold);">${ins.preco_custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          <span style="font-size: 10px; color: var(--text-muted);">por ${ins.unidade_medida === 'metro' ? 'm' : ins.unidade_medida === 'grama' ? 'g' : 'un'}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        const modal = document.getElementById('modal-selecionar-insumo');
        
        if (this.state.linhaFichaAtiva === 'nova') {
          this.adicionarLinhaFichaTecnica(ins.id, 1);
        } else {
          const row = this.state.linhaFichaAtiva;
          const selectEl = row.querySelector('.ficha-insumo-select');
          if (selectEl) {
            selectEl.value = ins.id;
            selectEl.dispatchEvent(new Event('change'));
          }
        }
        
        if (modal) modal.classList.remove('active');
      });

      listaEl.appendChild(card);
    });
  },

  // 16. TOAST NOTIFICATIONS
  showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-circle-check';
    if (type === 'danger') iconClass = 'fa-circle-exclamation';
    else if (type === 'info') iconClass = 'fa-circle-info';

    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas ${iconClass}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    const progress = toast.querySelector('.toast-progress');
    if (progress) {
      progress.style.transition = 'width 4s linear';
      setTimeout(() => { progress.style.width = '0%'; }, 50);
    }

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  },

  atualizarDatalistClientesFormVenda() {
    const datalist = document.getElementById('venda-clientes-datalist');
    if (!datalist) return;

    datalist.innerHTML = '';
    
    // Ordenar clientes por nome em ordem alfabética
    const clientesOrdenados = [...this.state.clientes].sort((a, b) => a.nome.localeCompare(b.nome));

    clientesOrdenados.forEach(c => {
      const option = document.createElement('option');
      option.value = c.nome;
      
      const details = [];
      if (c.tipo_cliente) details.push(c.tipo_cliente.toUpperCase());
      if (c.telefone) details.push(c.telefone);
      
      if (details.length > 0) {
        option.textContent = details.join(' | ');
      }
      
      datalist.appendChild(option);
    });
  },

  renderizarFaturamentoDetalhado() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    // Análise focada em Maio/2026
    const mesAnalise = 4; // Maio (Base 0)
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise;
    });

    const faturamentoMes = vendasMes.reduce((sum, v) => sum + parseFloat(v.valor_venda), 0);
    const totalVarejo = vendasMes.filter(v => v.tipo_cliente === 'varejo').reduce((sum, v) => sum + v.valor_venda, 0);
    const totalAtacado = vendasMes.filter(v => v.tipo_cliente === 'atacado').reduce((sum, v) => sum + v.valor_venda, 0);
    const ticketMedio = vendasMes.length > 0 ? faturamentoMes / vendasMes.length : 0;

    // Atualizar KPIs
    this.setDOMText('det-fat-total', `R$ ${faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-fat-varejo', `R$ ${totalVarejo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-fat-atacado', `R$ ${totalAtacado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-fat-transacoes', `${vendasMes.length}`);
    this.setDOMText('det-fat-ticket', `R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    // Renderizar tabela e cards
    const tbody = document.getElementById('det-fat-table-body');
    const mobileContainer = document.getElementById('det-fat-cards-mobile');

    if (!tbody || !mobileContainer) return;

    tbody.innerHTML = '';
    mobileContainer.innerHTML = '';

    if (vendasMes.length === 0) {
      const emptyState = `
        <tr>
          <td colspan="7" class="empty-state" style="text-align: center; padding: 32px; color: var(--text-muted);">
            <i class="fas fa-receipt" style="font-size: 28px; margin-bottom: 8px; display: block; color: var(--accent);"></i>
            Nenhuma transação registrada neste mês.
          </td>
        </tr>
      `;
      tbody.innerHTML = emptyState;
      mobileContainer.innerHTML = `
        <div style="text-align: center; padding: 32px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border);">
          <i class="fas fa-receipt" style="font-size: 28px; margin-bottom: 8px; display: block; color: var(--accent);"></i>
          Nenhuma transação registrada neste mês.
        </div>
      `;
      return;
    }

    const vendasOrdenadas = [...vendasMes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    vendasOrdenadas.forEach(v => {
      const dt = new Date(v.created_at);
      const dataStr = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const prod = produtos.find(p => p.id === v.produto_id);
      const fotoUrl = prod && prod.foto ? prod.foto : '/assets/cores/bordo_sf.svg';
      const sku = prod && prod.sku ? prod.sku : 'SKU-N/D';

      // Desktop Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color: var(--text-secondary); font-size: 13px;">${dataStr}</td>
        <td style="font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <img src="${fotoUrl}" style="width: 28px; height: 28px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div>
            <div>${v.produto_nome}</div>
            <span style="font-size: 10px; color: var(--text-muted); font-weight: normal;">${sku}</span>
          </div>
        </td>
        <td style="color: var(--text-secondary); font-size: 13px;">${v.cliente_nome}</td>
        <td>
          <span class="badge ${v.tipo_cliente === 'varejo' ? 'badge-success' : 'badge-warning'}" style="font-size: 11px;">
            ${v.tipo_cliente === 'varejo' ? 'Varejo' : 'Atacado'}
          </span>
        </td>
        <td>
          <span style="font-size: 11px; font-weight: 500; color: var(--text-secondary); display: inline-flex; align-items: center; gap: 4px;">
            <i class="${v.pagamento === 'PIX' ? 'fab fa-pix' : v.pagamento === 'Cartão' ? 'fas fa-credit-card' : 'fas fa-money-bill-wave'}" style="font-size: 10px; color: var(--text-muted);"></i>
            ${v.pagamento}
          </span>
        </td>
        <td style="text-align: right; font-weight: 500;">${v.quantidade} un</td>
        <td style="text-align: right; font-weight: 700; color: var(--accent);">R$ ${parseFloat(v.valor_venda).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.style.background = 'var(--bg-primary)';
      card.style.border = '1px solid var(--border-dim)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '8px';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-dim); padding-bottom: 8px; margin-bottom: 2px;">
          <span style="font-size: 11px; color: var(--text-muted);">${dataStr}</span>
          <span style="font-weight: 700; color: var(--text-gold); font-size: 14px;">R$ ${parseFloat(v.valor_venda).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${fotoUrl}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${v.produto_nome}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Cliente: <strong>${v.cliente_nome}</strong></div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
          <div style="display: flex; gap: 6px;">
            <span class="badge ${v.tipo_cliente === 'varejo' ? 'badge-success' : 'badge-warning'}" style="font-size: 9px; padding: 3px 6px;">
              ${v.tipo_cliente === 'varejo' ? 'Varejo' : 'Atacado'}
            </span>
            <span style="font-size: 10px; background: rgba(0,0,0,0.03); padding: 3px 6px; border-radius: 4px; color: var(--text-secondary); display: inline-flex; align-items: center; gap: 3px; border: 1px solid var(--border-dim);">
              <i class="${v.pagamento === 'PIX' ? 'fab fa-pix' : v.pagamento === 'Cartão' ? 'fas fa-credit-card' : 'fas fa-money-bill-wave'}" style="font-size: 8px;"></i>
              ${v.pagamento}
            </span>
          </div>
          <span style="font-size: 11px; font-weight: 500; color: var(--text-secondary);">${v.quantidade} un</span>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  },

  renderizarLucroDetalhado() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    const mesAnalise = 4; // Maio
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise;
    });

    const receitaTotal = vendasMes.reduce((sum, v) => sum + parseFloat(v.valor_venda), 0);
    const lucroTotal = vendasMes.reduce((sum, v) => sum + parseFloat(v.lucro), 0);

    let custoMaterialTotal = 0;
    let custoMaoObraTotal = 0;

    vendasMes.forEach(v => {
      const prod = produtos.find(p => p.id === v.produto_id);
      const custoMatUnitario = prod ? parseFloat(prod.custo) || 0 : 0;
      const custoMOUntario = prod ? parseFloat(prod.mao_obra) || 0 : 0;
      custoMaterialTotal += custoMatUnitario * v.quantidade;
      custoMaoObraTotal += custoMOUntario * v.quantidade;
    });

    const margemMedia = receitaTotal > 0 ? (lucroTotal / receitaTotal) * 100 : 0;

    // Atualizar KPIs
    this.setDOMText('det-luc-receita', `R$ ${receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-luc-materiais', `R$ ${custoMaterialTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-luc-mao-obra', `R$ ${custoMaoObraTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-luc-liquido', `R$ ${lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-luc-margem', `${margemMedia.toFixed(1)}%`);

    // Renderizar tabela e cards
    const tbody = document.getElementById('det-luc-table-body');
    const mobileContainer = document.getElementById('det-luc-cards-mobile');

    if (!tbody || !mobileContainer) return;

    tbody.innerHTML = '';
    mobileContainer.innerHTML = '';

    if (vendasMes.length === 0) {
      const emptyState = `
        <tr>
          <td colspan="8" class="empty-state" style="text-align: center; padding: 32px; color: var(--text-muted);">
            <i class="fas fa-wallet" style="font-size: 28px; margin-bottom: 8px; display: block; color: var(--accent);"></i>
            Nenhuma transação registrada neste mês.
          </td>
        </tr>
      `;
      tbody.innerHTML = emptyState;
      mobileContainer.innerHTML = `
        <div style="text-align: center; padding: 32px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border);">
          <i class="fas fa-wallet" style="font-size: 28px; margin-bottom: 8px; display: block; color: var(--accent);"></i>
          Nenhuma transação registrada neste mês.
        </div>
      `;
      return;
    }

    const vendasOrdenadas = [...vendasMes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    vendasOrdenadas.forEach(v => {
      const dt = new Date(v.created_at);
      const dataStr = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const prod = produtos.find(p => p.id === v.produto_id);
      const fotoUrl = prod && prod.foto ? prod.foto : '/assets/cores/bordo_sf.svg';
      const sku = prod && prod.sku ? prod.sku : 'SKU-N/D';

      const custoMatUnitario = prod ? parseFloat(prod.custo) || 0 : 0;
      const custoMOUntario = prod ? parseFloat(prod.mao_obra) || 0 : 0;
      const custoMatLinha = custoMatUnitario * v.quantidade;
      const custoMOLinha = custoMOUntario * v.quantidade;

      const valorVenda = parseFloat(v.valor_venda) || 0;
      const lucroReal = parseFloat(v.lucro) || 0;
      const margemLinha = valorVenda > 0 ? (lucroReal / valorVenda) * 100 : 0;

      let badgeClass = 'badge-success';
      if (margemLinha < 25) {
        badgeClass = 'badge-danger';
      } else if (margemLinha < 45) {
        badgeClass = 'badge-warning';
      }

      // Desktop Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color: var(--text-secondary); font-size: 13px;">${dataStr}</td>
        <td style="font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <img src="${fotoUrl}" style="width: 28px; height: 28px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div>
            <div>${v.produto_nome}</div>
            <span style="font-size: 10px; color: var(--text-muted); font-weight: normal;">${sku} &bull; ${v.quantidade} un</span>
          </div>
        </td>
        <td style="color: var(--text-secondary); font-size: 13px;">${v.cliente_nome}</td>
        <td style="text-align: right; color: var(--danger); font-size: 13px;">R$ ${custoMatLinha.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--warning); font-size: 13px;">R$ ${custoMOLinha.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-weight: 500; font-size: 13px;">R$ ${valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-weight: 700; color: var(--success); font-size: 13px;">R$ ${lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right;">
          <span class="badge ${badgeClass}" style="font-size: 11px;">${margemLinha.toFixed(1)}%</span>
        </td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.style.background = 'var(--bg-primary)';
      card.style.border = '1px solid var(--border-dim)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '8px';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-dim); padding-bottom: 8px; margin-bottom: 2px;">
          <span style="font-size: 11px; color: var(--text-muted);">${dataStr}</span>
          <span class="badge ${badgeClass}" style="font-size: 10px; padding: 3px 8px;">Margem: ${margemLinha.toFixed(1)}%</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${fotoUrl}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${v.produto_nome}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Cliente: <strong>${v.cliente_nome}</strong> &bull; ${v.quantidade} un</div>
          </div>
        </div>
        
        <div style="background: rgba(0,0,0,0.015); padding: 8px 12px; border-radius: 6px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 11px; margin-top: 2px; border: 1px solid var(--border-dim);">
          <div>
            <div style="color: var(--text-muted); font-size: 9px; text-transform: uppercase;">Custo Mat.</div>
            <div style="color: var(--danger); font-weight: 600; margin-top: 1px;">R$ ${custoMatLinha.toFixed(2)}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 9px; text-transform: uppercase;">Custo M.O.</div>
            <div style="color: var(--warning); font-weight: 600; margin-top: 1px;">R$ ${custoMOLinha.toFixed(2)}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 9px; text-transform: uppercase;">Venda Bruta</div>
            <div style="color: var(--text-primary); font-weight: 600; margin-top: 1px;">R$ ${valorVenda.toFixed(2)}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; border-top: 1px solid rgba(0,0,0,0.03); padding-top: 6px;">
          <span style="font-size: 11px; color: var(--text-secondary); font-weight: 500;">Lucro Líquido Real:</span>
          <span style="font-weight: 700; color: var(--success); font-size: 14px;">R$ ${lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  },

  renderizarColaresDetalhado() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    const mesAnalise = 4; // Maio
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise;
    });

    const vendasColares = vendasMes.filter(v => {
      const prod = produtos.find(p => p.id === v.produto_id);
      const cat = prod && prod.categoria ? prod.categoria.toLowerCase() : '';
      return cat.includes('colar');
    });

    const totalPecas = vendasColares.reduce((sum, v) => sum + parseInt(v.quantidade || 0), 0);
    const receitaTotal = vendasColares.reduce((sum, v) => sum + parseFloat(v.valor_venda || 0), 0);
    const lucroTotal = vendasColares.reduce((sum, v) => sum + parseFloat(v.lucro || 0), 0);
    const ticketMedio = totalPecas > 0 ? receitaTotal / totalPecas : 0;

    // Atualizar sub-KPIs
    this.setDOMText('det-col-pecas', `${totalPecas} peças`);
    this.setDOMText('det-col-receita', `R$ ${receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-col-lucro', `R$ ${lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-col-ticket', `R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    const tbody = document.getElementById('det-col-table-body');
    const mobileContainer = document.getElementById('det-col-cards-mobile');

    if (!tbody || !mobileContainer) return;

    tbody.innerHTML = '';
    mobileContainer.innerHTML = '';

    if (vendasColares.length === 0) {
      const emptyState = `
        <tr>
          <td colspan="8" class="empty-state" style="text-align: center; padding: 32px; color: var(--text-muted);">
            <i class="fas fa-gem" style="font-size: 28px; margin-bottom: 8px; display: block; color: var(--accent);"></i>
            Nenhum colar vendido neste mês.
          </td>
        </tr>
      `;
      tbody.innerHTML = emptyState;
      mobileContainer.innerHTML = `
        <div style="text-align: center; padding: 32px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border);">
          <i class="fas fa-gem" style="font-size: 28px; margin-bottom: 8px; display: block; color: var(--accent);"></i>
          Nenhum colar vendido neste mês.
        </div>
      `;
      return;
    }

    const ordenadas = [...vendasColares].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    ordenadas.forEach(v => {
      const dt = new Date(v.created_at);
      const dataStr = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const prod = produtos.find(p => p.id === v.produto_id);
      const fotoUrl = prod && prod.foto ? prod.foto : '/assets/cores/bordo_sf.svg';
      const sku = prod && prod.sku ? prod.sku : 'SKU-N/D';

      const valorVenda = parseFloat(v.valor_venda) || 0;
      const lucroReal = parseFloat(v.lucro) || 0;
      const margemLinha = valorVenda > 0 ? (lucroReal / valorVenda) * 100 : 0;

      let badgeClass = 'badge-success';
      if (margemLinha < 25) {
        badgeClass = 'badge-danger';
      } else if (margemLinha < 45) {
        badgeClass = 'badge-warning';
      }

      // Desktop Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color: var(--text-secondary); font-size: 13px;">${dataStr}</td>
        <td style="font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <img src="${fotoUrl}" style="width: 28px; height: 28px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div>
            <div>${v.produto_nome}</div>
            <span style="font-size: 10px; color: var(--text-muted); font-weight: normal;">${sku}</span>
          </div>
        </td>
        <td style="color: var(--text-secondary); font-size: 13px;">${v.cliente_nome}</td>
        <td>
          <span class="badge ${v.tipo_cliente === 'varejo' ? 'badge-success' : 'badge-warning'}" style="font-size: 11px;">
            ${v.tipo_cliente === 'varejo' ? 'Varejo' : 'Atacado'}
          </span>
        </td>
        <td style="text-align: right; font-weight: 500;">${v.quantidade} un</td>
        <td style="text-align: right; font-weight: 500;">R$ ${valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-weight: 700; color: var(--success);">R$ ${lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right;">
          <span class="badge ${badgeClass}" style="font-size: 11px;">${margemLinha.toFixed(1)}%</span>
        </td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.style.background = 'var(--bg-primary)';
      card.style.border = '1px solid var(--border-dim)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '8px';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-dim); padding-bottom: 8px; margin-bottom: 2px;">
          <span style="font-size: 11px; color: var(--text-muted);">${dataStr}</span>
          <span class="badge ${badgeClass}" style="font-size: 10px; padding: 3px 8px;">Margem: ${margemLinha.toFixed(1)}%</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${fotoUrl}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${v.produto_nome}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Cliente: <strong>${v.cliente_nome}</strong> &bull; ${v.quantidade} un</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
          <span style="font-size: 11px; color: var(--text-secondary); font-weight: 500;">Valor Venda:</span>
          <span style="font-weight: 700; color: var(--accent); font-size: 14px;">R$ ${valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.03); padding-top: 6px;">
          <span style="font-size: 11px; color: var(--text-secondary); font-weight: 500;">Lucro Líquido:</span>
          <span style="font-weight: 700; color: var(--success); font-size: 14px;">R$ ${lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  },

  renderizarTicketDetalhado() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    const mesAnalise = 4; // Maio
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise;
    });

    const faturamentoGeral = vendasMes.reduce((sum, v) => sum + parseFloat(v.valor_venda || 0), 0);
    const pecasGerais = vendasMes.reduce((sum, v) => sum + parseInt(v.quantidade || 0), 0);
    const ticketGeral = pecasGerais > 0 ? faturamentoGeral / pecasGerais : 0;

    // Agrupar por produto
    const prodMap = {};
    vendasMes.forEach(v => {
      if (!prodMap[v.produto_id]) {
        prodMap[v.produto_id] = {
          id: v.produto_id,
          nome: v.produto_nome,
          quantidade: 0,
          faturamento: 0,
          lucro: 0
        };
      }
      prodMap[v.produto_id].quantidade += parseInt(v.quantidade || 0);
      prodMap[v.produto_id].faturamento += parseFloat(v.valor_venda || 0);
      prodMap[v.produto_id].lucro += parseFloat(v.lucro || 0);
    });

    const ranking = Object.values(prodMap).map(p => {
      const prodData = produtos.find(prod => prod.id === p.id);
      const custoMatUnitario = prodData ? parseFloat(prodData.custo) || 0 : 0;
      const custoMOUntario = prodData ? parseFloat(prodData.mao_obra) || 0 : 0;
      const custoTotalUnitario = custoMatUnitario + custoMOUntario;
      const custosTotais = custoTotalUnitario * p.quantidade;
      return {
        ...p,
        sku: prodData && prodData.sku ? prodData.sku : 'SKU-N/D',
        categoria: prodData && prodData.categoria ? prodData.categoria : 'Sem cat.',
        foto: prodData && prodData.foto ? prodData.foto : '/assets/cores/bordo_sf.svg',
        ticket: p.quantidade > 0 ? p.faturamento / p.quantidade : 0,
        custosTotais: custosTotais
      };
    }).sort((a, b) => b.ticket - a.ticket);

    const lider = ranking.length > 0 ? ranking[0] : null;

    // Atualizar sub-KPIs
    this.setDOMText('det-tkt-geral', `R$ ${ticketGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-tkt-lider', lider ? lider.nome : 'Nenhum');
    this.setDOMText('det-tkt-receita', `R$ ${faturamentoGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    const tbody = document.getElementById('det-tkt-table-body');
    const mobileContainer = document.getElementById('det-tkt-cards-mobile');

    if (!tbody || !mobileContainer) return;

    tbody.innerHTML = '';
    mobileContainer.innerHTML = '';

    if (ranking.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state" style="text-align: center; padding:32px;">Nenhum produto vendido.</td></tr>';
      mobileContainer.innerHTML = '<div style="text-align:center; padding:32px;">Nenhum produto vendido.</div>';
      return;
    }

    ranking.forEach((p, idx) => {
      // Desktop Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-gold); text-align: center;">#${idx + 1}</td>
        <td style="font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <img src="${p.foto}" style="width: 28px; height: 28px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div>
            <div>${p.nome}</div>
            <span style="font-size: 10px; color: var(--text-muted); font-weight: normal;">${p.sku}</span>
          </div>
        </td>
        <td style="color: var(--text-secondary); font-size: 13px;">${p.categoria}</td>
        <td style="text-align: right; font-weight: 500;">${p.quantidade} un</td>
        <td style="text-align: right; font-weight: 500;">R$ ${p.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--danger);">R$ ${p.custosTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--success); font-weight: 600;">R$ ${p.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-weight: 700; color: var(--info);">R$ ${p.ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.style.background = 'var(--bg-primary)';
      card.style.border = '1px solid var(--border-dim)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '8px';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-dim); padding-bottom: 8px; margin-bottom: 2px;">
          <span style="font-weight: 700; color: var(--text-gold);">Ranking #${idx + 1}</span>
          <span class="badge badge-info" style="font-size: 10px; padding: 3px 8px;">Ticket: R$ ${p.ticket.toFixed(2)}</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${p.foto}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.nome}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">Categoria: ${p.categoria} &bull; ${p.quantidade} un</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 11px;">
          <span style="color: var(--text-secondary);">Faturamento total:</span>
          <span style="font-weight: 600; color: var(--text-primary);">R$ ${p.faturamento.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.03); padding-top: 6px; font-size: 11px;">
          <span style="color: var(--text-secondary);">Lucro Acumulado:</span>
          <span style="font-weight: 700; color: var(--success);">R$ ${p.lucro.toFixed(2)}</span>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  },

  renderizarVarejoDetalhado() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    const mesAnalise = 4; // Maio
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise && v.tipo_cliente === 'varejo';
    });

    const receitaTotal = vendasMes.reduce((sum, v) => sum + parseFloat(v.valor_venda || 0), 0);
    const pecasTotais = vendasMes.reduce((sum, v) => sum + parseInt(v.quantidade || 0), 0);
    const ticketMedio = pecasTotais > 0 ? receitaTotal / pecasTotais : 0;
    const lucroTotal = vendasMes.reduce((sum, v) => sum + parseFloat(v.lucro || 0), 0);

    // Agrupar por produto
    const prodMap = {};
    vendasMes.forEach(v => {
      if (!prodMap[v.produto_id]) {
        prodMap[v.produto_id] = {
          id: v.produto_id,
          nome: v.produto_nome,
          quantidade: 0,
          faturamento: 0,
          lucro: 0
        };
      }
      prodMap[v.produto_id].quantidade += parseInt(v.quantidade || 0);
      prodMap[v.produto_id].faturamento += parseFloat(v.valor_venda || 0);
      prodMap[v.produto_id].lucro += parseFloat(v.lucro || 0);
    });

    const ranking = Object.values(prodMap).map(p => {
      const prodData = produtos.find(prod => prod.id === p.id);
      const custoMatUnitario = prodData ? parseFloat(prodData.custo) || 0 : 0;
      const custoMOUntario = prodData ? parseFloat(prodData.mao_obra) || 0 : 0;
      const custosTotais = (custoMatUnitario + custoMOUntario) * p.quantidade;
      const margem = p.faturamento > 0 ? (p.lucro / p.faturamento) * 100 : 0;
      return {
        ...p,
        sku: prodData && prodData.sku ? prodData.sku : 'SKU-N/D',
        foto: prodData && prodData.foto ? prodData.foto : '/assets/cores/bordo_sf.svg',
        custosTotais: custosTotais,
        margem: margem
      };
    }).sort((a, b) => b.faturamento - a.faturamento);

    // Atualizar sub-KPIs
    this.setDOMText('det-var-receita', `R$ ${receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-var-pecas', `${pecasTotais} un`);
    this.setDOMText('det-var-ticket', `R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-var-lucro', `R$ ${lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    const tbody = document.getElementById('det-var-table-body');
    const mobileContainer = document.getElementById('det-var-cards-mobile');

    if (!tbody || !mobileContainer) return;

    tbody.innerHTML = '';
    mobileContainer.innerHTML = '';

    if (ranking.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state" style="text-align: center; padding:32px;">Nenhum produto vendido no varejo.</td></tr>';
      mobileContainer.innerHTML = '<div style="text-align:center; padding:32px;">Nenhum produto vendido no varejo.</div>';
      return;
    }

    ranking.forEach((p, idx) => {
      let badgeClass = 'badge-success';
      if (p.margem < 25) {
        badgeClass = 'badge-danger';
      } else if (p.margem < 45) {
        badgeClass = 'badge-warning';
      }

      // Desktop Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-gold); text-align: center;">#${idx + 1}</td>
        <td style="font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <img src="${p.foto}" style="width: 28px; height: 28px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div>${p.nome}</div>
        </td>
        <td style="color: var(--text-secondary); font-size: 13px;">${p.sku}</td>
        <td style="text-align: right; font-weight: 500;">${p.quantidade} un</td>
        <td style="text-align: right; font-weight: 500;">R$ ${p.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--danger);">R$ ${p.custosTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--success); font-weight: 600;">R$ ${p.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right;">
          <span class="badge ${badgeClass}" style="font-size: 11px;">${p.margem.toFixed(1)}%</span>
        </td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.style.background = 'var(--bg-primary)';
      card.style.border = '1px solid var(--border-dim)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '8px';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-dim); padding-bottom: 8px; margin-bottom: 2px;">
          <span style="font-weight: 700; color: var(--text-gold);">Ranking Varejo #${idx + 1}</span>
          <span class="badge ${badgeClass}" style="font-size: 10px; padding: 3px 8px;">Margem: ${p.margem.toFixed(1)}%</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${p.foto}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.nome}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${p.sku} &bull; ${p.quantidade} un</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 11px;">
          <span style="color: var(--text-secondary);">Receita Varejo:</span>
          <span style="font-weight: 600; color: var(--text-primary);">R$ ${p.faturamento.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.03); padding-top: 6px; font-size: 11px;">
          <span style="color: var(--text-secondary);">Lucro Real Varejo:</span>
          <span style="font-weight: 700; color: var(--success);">R$ ${p.lucro.toFixed(2)}</span>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  },

  renderizarAtacadoDetalhado() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    const mesAnalise = 4; // Maio
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise && v.tipo_cliente === 'atacado';
    });

    const receitaTotal = vendasMes.reduce((sum, v) => sum + parseFloat(v.valor_venda || 0), 0);
    const pecasTotais = vendasMes.reduce((sum, v) => sum + parseInt(v.quantidade || 0), 0);
    const ticketMedio = pecasTotais > 0 ? receitaTotal / pecasTotais : 0;
    const lucroTotal = vendasMes.reduce((sum, v) => sum + parseFloat(v.lucro || 0), 0);

    // Agrupar por produto
    const prodMap = {};
    vendasMes.forEach(v => {
      if (!prodMap[v.produto_id]) {
        prodMap[v.produto_id] = {
          id: v.produto_id,
          nome: v.produto_nome,
          quantidade: 0,
          faturamento: 0,
          lucro: 0
        };
      }
      prodMap[v.produto_id].quantidade += parseInt(v.quantidade || 0);
      prodMap[v.produto_id].faturamento += parseFloat(v.valor_venda || 0);
      prodMap[v.produto_id].lucro += parseFloat(v.lucro || 0);
    });

    const ranking = Object.values(prodMap).map(p => {
      const prodData = produtos.find(prod => prod.id === p.id);
      const custoMatUnitario = prodData ? parseFloat(prodData.custo) || 0 : 0;
      const custoMOUntario = prodData ? parseFloat(prodData.mao_obra) || 0 : 0;
      const custosTotais = (custoMatUnitario + custoMOUntario) * p.quantidade;
      const margem = p.faturamento > 0 ? (p.lucro / p.faturamento) * 100 : 0;
      return {
        ...p,
        sku: prodData && prodData.sku ? prodData.sku : 'SKU-N/D',
        foto: prodData && prodData.foto ? prodData.foto : '/assets/cores/bordo_sf.svg',
        custosTotais: custosTotais,
        margem: margem
      };
    }).sort((a, b) => b.faturamento - a.faturamento);

    // Atualizar sub-KPIs
    this.setDOMText('det-ata-receita', `R$ ${receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-ata-pecas', `${pecasTotais} un`);
    this.setDOMText('det-ata-ticket', `R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-ata-lucro', `R$ ${lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    const tbody = document.getElementById('det-ata-table-body');
    const mobileContainer = document.getElementById('det-ata-cards-mobile');

    if (!tbody || !mobileContainer) return;

    tbody.innerHTML = '';
    mobileContainer.innerHTML = '';

    if (ranking.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state" style="text-align: center; padding:32px;">Nenhum produto vendido no atacado.</td></tr>';
      mobileContainer.innerHTML = '<div style="text-align:center; padding:32px;">Nenhum produto vendido no atacado.</div>';
      return;
    }

    ranking.forEach((p, idx) => {
      let badgeClass = 'badge-success';
      if (p.margem < 25) {
        badgeClass = 'badge-danger';
      } else if (p.margem < 45) {
        badgeClass = 'badge-warning';
      }

      // Desktop Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-gold); text-align: center;">#${idx + 1}</td>
        <td style="font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <img src="${p.foto}" style="width: 28px; height: 28px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div>${p.nome}</div>
        </td>
        <td style="color: var(--text-secondary); font-size: 13px;">${p.sku}</td>
        <td style="text-align: right; font-weight: 500;">${p.quantidade} un</td>
        <td style="text-align: right; font-weight: 500;">R$ ${p.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--danger);">R$ ${p.custosTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--success); font-weight: 600;">R$ ${p.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right;">
          <span class="badge ${badgeClass}" style="font-size: 11px;">${p.margem.toFixed(1)}%</span>
        </td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.style.background = 'var(--bg-primary)';
      card.style.border = '1px solid var(--border-dim)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '8px';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-dim); padding-bottom: 8px; margin-bottom: 2px;">
          <span style="font-weight: 700; color: var(--text-gold);">Ranking Atacado #${idx + 1}</span>
          <span class="badge ${badgeClass}" style="font-size: 10px; padding: 3px 8px;">Margem: ${p.margem.toFixed(1)}%</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${p.foto}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.nome}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${p.sku} &bull; ${p.quantidade} un</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 11px;">
          <span style="color: var(--text-secondary);">Receita Atacado:</span>
          <span style="font-weight: 600; color: var(--text-primary);">R$ ${p.faturamento.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.03); padding-top: 6px; font-size: 11px;">
          <span style="color: var(--text-secondary);">Lucro Real Atacado:</span>
          <span style="font-weight: 700; color: var(--success);">R$ ${p.lucro.toFixed(2)}</span>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  },

  renderizarProdutoTopDetalhado() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    const mesAnalise = 4; // Maio
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise;
    });

    const totalPecasGerais = vendasMes.reduce((sum, v) => sum + parseInt(v.quantidade || 0), 0);

    // Agrupar por produto
    const prodMap = {};
    vendasMes.forEach(v => {
      if (!prodMap[v.produto_id]) {
        prodMap[v.produto_id] = {
          id: v.produto_id,
          nome: v.produto_nome,
          quantidade: 0,
          faturamento: 0,
          lucro: 0
        };
      }
      prodMap[v.produto_id].quantidade += parseInt(v.quantidade || 0);
      prodMap[v.produto_id].faturamento += parseFloat(v.valor_venda || 0);
      prodMap[v.produto_id].lucro += parseFloat(v.lucro || 0);
    });

    const ranking = Object.values(prodMap).map(p => {
      const prodData = produtos.find(prod => prod.id === p.id);
      const part = totalPecasGerais > 0 ? (p.quantidade / totalPecasGerais) * 100 : 0;
      return {
        ...p,
        sku: prodData && prodData.sku ? prodData.sku : 'SKU-N/D',
        categoria: prodData && prodData.categoria ? prodData.categoria : 'Sem cat.',
        foto: prodData && prodData.foto ? prodData.foto : '/assets/cores/bordo_sf.svg',
        participacao: part
      };
    }).sort((a, b) => b.quantidade - a.quantidade);

    const campeao = ranking.length > 0 ? ranking[0] : null;

    // Atualizar sub-KPIs
    this.setDOMText('det-top-total-pecas', `${totalPecasGerais} un`);
    this.setDOMText('det-top-campeao', campeao ? campeao.nome : 'Nenhum');
    this.setDOMText('det-top-campeao-qtd', campeao ? `${campeao.quantidade} un` : '0 un');

    const tbody = document.getElementById('det-top-table-body');
    const mobileContainer = document.getElementById('det-top-cards-mobile');

    if (!tbody || !mobileContainer) return;

    tbody.innerHTML = '';
    mobileContainer.innerHTML = '';

    if (ranking.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state" style="text-align: center; padding:32px;">Nenhum produto vendido.</td></tr>';
      mobileContainer.innerHTML = '<div style="text-align:center; padding:32px;">Nenhum produto vendido.</div>';
      return;
    }

    ranking.forEach((p, idx) => {
      // Desktop Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-gold); text-align: center;">#${idx + 1}</td>
        <td style="font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <img src="${p.foto}" style="width: 28px; height: 28px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div>
            <div>${p.nome}</div>
            <span style="font-size: 10px; color: var(--text-muted); font-weight: normal;">${p.sku}</span>
          </div>
        </td>
        <td style="color: var(--text-secondary); font-size: 13px;">${p.categoria}</td>
        <td style="text-align: right; font-weight: 700; color: var(--accent);">${p.quantidade} un</td>
        <td style="text-align: right; font-weight: 500;">R$ ${p.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--success); font-weight: 600;">R$ ${p.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-weight: 600; color: var(--info);">${p.participacao.toFixed(1)}%</td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.style.background = 'var(--bg-primary)';
      card.style.border = '1px solid var(--border-dim)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '8px';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-dim); padding-bottom: 8px; margin-bottom: 2px;">
          <span style="font-weight: 700; color: var(--text-gold);">Pos #${idx + 1} &bull; ${p.participacao.toFixed(1)}% do vol</span>
          <span class="badge badge-warning" style="font-size: 10px; padding: 3px 8px;">Volume: ${p.quantidade} un</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${p.foto}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-dim);" onerror="this.src='/assets/cores/bordo_sf.svg'">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.nome}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">Categoria: ${p.categoria}</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 11px;">
          <span style="color: var(--text-secondary);">Faturamento Gerado:</span>
          <span style="font-weight: 600; color: var(--text-primary);">R$ ${p.faturamento.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.03); padding-top: 6px; font-size: 11px;">
          <span style="color: var(--text-secondary);">Lucro Real Gerado:</span>
          <span style="font-weight: 700; color: var(--success);">R$ ${p.lucro.toFixed(2)}</span>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  },

  renderizarProdutoLucroDetalhado() {
    const vendas = this.state.vendas;
    
    const mesAnalise = 4; // Maio
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise;
    });

    const lucroTotalGeral = vendasMes.reduce((sum, v) => sum + parseFloat(v.lucro || 0), 0);
    const receitaTotalGeral = vendasMes.reduce((sum, v) => sum + parseFloat(v.valor_venda || 0), 0);
    const margemMediaGeral = receitaTotalGeral > 0 ? (lucroTotalGeral / receitaTotalGeral) * 100 : 0;

    // Agrupar por cliente
    const clienteMap = {};
    vendasMes.forEach(v => {
      const nome = v.cliente_nome || 'Consumidor';
      if (!clienteMap[nome]) {
        clienteMap[nome] = {
          nome: nome,
          quantidade: 0,
          faturamento: 0,
          lucro: 0
        };
      }
      clienteMap[nome].quantidade += parseInt(v.quantidade || 0);
      clienteMap[nome].faturamento += parseFloat(v.valor_venda || 0);
      clienteMap[nome].lucro += parseFloat(v.lucro || 0);
    });

    const ranking = Object.values(clienteMap).map(c => {
      const margem = c.faturamento > 0 ? (c.lucro / c.faturamento) * 100 : 0;
      const custoTotal = c.faturamento - c.lucro;
      return {
        ...c,
        custosTotais: custoTotal,
        margem: margem
      };
    }).sort((a, b) => b.lucro - a.lucro);

    const estrela = ranking.length > 0 ? ranking[0] : null;

    // Atualizar sub-KPIs
    this.setDOMText('det-rlu-total', `R$ ${lucroTotalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    this.setDOMText('det-rlu-lider', estrela ? estrela.nome : 'Nenhum');
    this.setDOMText('det-rlu-margem-geral', `${margemMediaGeral.toFixed(1)}%`);

    const tbody = document.getElementById('det-rlu-table-body');
    const mobileContainer = document.getElementById('det-rlu-cards-mobile');

    if (!tbody || !mobileContainer) return;

    tbody.innerHTML = '';
    mobileContainer.innerHTML = '';

    if (ranking.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state" style="text-align: center; padding:32px;">Nenhum cliente registrado.</td></tr>';
      mobileContainer.innerHTML = '<div style="text-align:center; padding:32px;">Nenhum cliente registrado.</div>';
      return;
    }

    ranking.forEach((p, idx) => {
      let badgeClass = 'badge-success';
      if (p.margem < 25) {
        badgeClass = 'badge-danger';
      } else if (p.margem < 45) {
        badgeClass = 'badge-warning';
      }

      // Desktop Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-gold); text-align: center;">#${idx + 1}</td>
        <td style="font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--success); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
            ${p.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <div>${p.nome}</div>
          </div>
        </td>
        <td style="text-align: right; font-weight: 500;">${p.quantidade} un</td>
        <td style="text-align: right; font-weight: 500;">R$ ${p.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--danger);">R$ ${p.custosTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--success); font-weight: 700; font-size: 13px;">R$ ${p.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right;">
          <span class="badge ${badgeClass}" style="font-size: 11px;">${p.margem.toFixed(1)}%</span>
        </td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.style.background = 'var(--bg-primary)';
      card.style.border = '1px solid var(--border-dim)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '8px';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-dim); padding-bottom: 8px; margin-bottom: 2px;">
          <span style="font-weight: 700; color: var(--text-gold);">Rentabilidade #${idx + 1}</span>
          <span class="badge ${badgeClass}" style="font-size: 10px; padding: 3px 8px;">Margem: ${p.margem.toFixed(1)}%</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--success); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold;">
            ${p.nome.charAt(0).toUpperCase()}
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.nome}</div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">Peças compradas &bull; ${p.quantidade} un</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 11px;">
          <span style="color: var(--text-secondary);">Receita / Custos:</span>
          <span style="font-weight: 600; color: var(--text-primary);">R$ ${p.faturamento.toFixed(2)} / R$ ${p.custosTotais.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.03); padding-top: 6px; font-size: 11px;">
          <span style="color: var(--text-secondary); font-weight: 500;">Lucro Líquido Acumulado:</span>
          <span style="font-weight: 700; color: var(--success); font-size: 14px;">R$ ${p.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  },

  renderizarCategoriaTopDetalhado() {
    const vendas = this.state.vendas;
    const produtos = this.state.produtos;
    
    const mesAnalise = 4; // Maio
    const anoAnalise = 2026;

    const vendasMes = vendas.filter(v => {
      const dt = new Date(v.created_at);
      return dt.getMonth() === mesAnalise && dt.getFullYear() === anoAnalise;
    });

    // Agrupar por categoria
    const catMap = {};
    vendasMes.forEach(v => {
      const prodData = produtos.find(prod => prod.id === v.produto_id);
      const catName = prodData && prodData.categoria ? prodData.categoria : 'Sem categoria';
      if (!catMap[catName]) {
        catMap[catName] = {
          nome: catName,
          quantidade: 0,
          faturamento: 0,
          lucro: 0,
          custos: 0
        };
      }
      const custoMatUnitario = prodData ? parseFloat(prodData.custo) || 0 : 0;
      const custoMOUntario = prodData ? parseFloat(prodData.mao_obra) || 0 : 0;
      const custoTotalUnitario = custoMatUnitario + custoMOUntario;
      const custosTotais = custoTotalUnitario * parseInt(v.quantidade || 0);

      catMap[catName].quantidade += parseInt(v.quantidade || 0);
      catMap[catName].faturamento += parseFloat(v.valor_venda || 0);
      catMap[catName].lucro += parseFloat(v.lucro || 0);
      catMap[catName].custos += custosTotais;
    });

    const ranking = Object.values(catMap).map(c => {
      const margem = c.faturamento > 0 ? (c.lucro / c.faturamento) * 100 : 0;
      return {
        ...c,
        margem: margem
      };
    }).sort((a, b) => b.faturamento - a.faturamento);

    const lider = ranking.length > 0 ? ranking[0] : null;
    const liderLucro = [...ranking].sort((a, b) => b.lucro - a.lucro)[0] || null;

    // Atualizar sub-KPIs
    this.setDOMText('det-cat-lider', lider ? lider.nome : 'Nenhuma');
    this.setDOMText('det-cat-lider-receita', lider ? `R$ ${lider.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00');
    this.setDOMText('det-cat-lider-lucro', liderLucro ? `R$ ${liderLucro.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00');

    const tbody = document.getElementById('det-cat-table-body');
    const mobileContainer = document.getElementById('det-cat-cards-mobile');

    if (!tbody || !mobileContainer) return;

    tbody.innerHTML = '';
    mobileContainer.innerHTML = '';

    if (ranking.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state" style="text-align: center; padding:32px;">Nenhuma categoria vendida.</td></tr>';
      mobileContainer.innerHTML = '<div style="text-align:center; padding:32px;">Nenhuma categoria vendida.</div>';
      return;
    }

    ranking.forEach((c, idx) => {
      let badgeClass = 'badge-success';
      if (c.margem < 25) {
        badgeClass = 'badge-danger';
      } else if (c.margem < 45) {
        badgeClass = 'badge-warning';
      }

      // Desktop Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-gold); text-align: center;">#${idx + 1}</td>
        <td style="font-weight: 600; color: var(--text-primary); font-size: 14px;">${c.nome}</td>
        <td style="text-align: right; font-weight: 500;">${c.quantidade} peças</td>
        <td style="text-align: right; font-weight: 600; color: var(--info);">R$ ${c.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--danger);">R$ ${c.custos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--success); font-weight: 700;">R$ ${c.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right;">
          <span class="badge ${badgeClass}" style="font-size: 11px;">${c.margem.toFixed(1)}%</span>
        </td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.style.background = 'var(--bg-primary)';
      card.style.border = '1px solid var(--border-dim)';
      card.style.borderRadius = 'var(--radius-md)';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '8px';

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-dim); padding-bottom: 8px; margin-bottom: 2px;">
          <span style="font-weight: 700; color: var(--text-gold);">Categoria #${idx + 1} &bull; ${c.nome}</span>
          <span class="badge ${badgeClass}" style="font-size: 10px; padding: 3px 8px;">Margem: ${c.margem.toFixed(1)}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
          <span style="color: var(--text-secondary);">Quantidade:</span>
          <span style="font-weight: 600; color: var(--text-primary);">${c.quantidade} peças</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
          <span style="color: var(--text-secondary);">Faturamento Total:</span>
          <span style="font-weight: 600; color: var(--info);">R$ ${c.faturamento.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.03); padding-top: 6px; font-size: 11px;">
          <span style="color: var(--text-secondary); font-weight: 500;">Lucro Líquido Acumulado:</span>
          <span style="font-weight: 700; color: var(--success); font-size: 14px;">R$ ${c.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      `;
      mobileContainer.appendChild(card);
    });
  }
};

// Disparar o carregamento da aplicação assim que a janela estiver pronta
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
