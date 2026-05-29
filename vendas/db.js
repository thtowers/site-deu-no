/* global supabase */
// db.js - Camada de Persistência Híbrida (LocalStorage & Supabase) com Catálogo Oficial Deu Nó

const LOCAL_KEYS = {
  PRODUTOS: 'site_semijoias_produtos',
  VENDAS: 'site_semijoias_vendas',
  CLIENTES: 'site_semijoias_clientes',
  CATEGORIAS: 'site_semijoias_categorias',
  USUARIOS: 'site_semijoias_usuarios',
  INSUMOS: 'site_semijoias_insumos',
  SUPABASE_URL: 'site_semijoias_supa_url',
  SUPABASE_KEY: 'site_semijoias_supa_key'
};

// Declaração do cliente Supabase global (será inicializado dinamicamente)
let supabaseClient = null;

const DB = {
  // 1. GERENCIAMENTO DE CREDENCIAIS DO SUPABASE
  getSupabaseConfig() {
    const url = localStorage.getItem(LOCAL_KEYS.SUPABASE_URL);
    const key = localStorage.getItem(LOCAL_KEYS.SUPABASE_KEY);
    if (url && key) {
      return { url, key };
    }
    return null;
  },

  setSupabaseConfig(url, key) {
    if (url && key) {
      localStorage.setItem(LOCAL_KEYS.SUPABASE_URL, url.trim());
      localStorage.setItem(LOCAL_KEYS.SUPABASE_KEY, key.trim());
      this.initSupabase();
      return true;
    }
    return false;
  },

  clearSupabaseConfig() {
    localStorage.removeItem(LOCAL_KEYS.SUPABASE_URL);
    localStorage.removeItem(LOCAL_KEYS.SUPABASE_KEY);
    supabaseClient = null;
  },

  initSupabase() {
    const config = this.getSupabaseConfig();
    if (config && typeof supabase !== 'undefined') {
      try {
        supabaseClient = supabase.createClient(config.url, config.key);
        console.log("Supabase inicializado com sucesso!");
        return true;
      } catch (err) {
        console.error("Erro ao inicializar Supabase:", err);
        supabaseClient = null;
      }
    }
    return false;
  },

  isSupabaseActive() {
    if (!supabaseClient) {
      this.initSupabase();
    }
    return supabaseClient !== null;
  },

  // 2. FUNÇÕES DE BANCO LOCAL (LOCALSTORAGE)
  getLocalData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  setLocalData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  async validarUsuario(username, password) {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabaseClient
          .from('usuarios')
          .select('*')
          .eq('username', username.trim())
          .eq('password', password.trim());
        if (error) throw error;
        if (data && data.length > 0) {
          return { sucesso: true, usuario: data[0] };
        }
      } catch (err) {
        console.warn("Erro no Supabase ao validar login, caindo para o LocalStorage:", err);
      }
    }
    
    // Fallback LocalStorage
    const usuarios = this.getLocalData(LOCAL_KEYS.USUARIOS);
    const userObj = usuarios.find(u => u.username.trim().toLowerCase() === username.trim().toLowerCase() && u.password === password.trim());
    if (userObj) {
      return { sucesso: true, usuario: userObj };
    }
    return { sucesso: false };
  },

  // 3. OPERAÇÕES DE PRODUTOS (CRUD)
  async getProdutos() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabaseClient
          .from('produtos')
          .select('*')
          .order('nome', { ascending: true });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Erro no Supabase, caindo para o LocalStorage:", err);
      }
    }
    return this.getLocalData(LOCAL_KEYS.PRODUTOS).sort((a, b) => a.nome.localeCompare(b.nome));
  },

  async salvarProduto(produto) {
    // Validações e Cálculos automáticos
    produto.custo = parseFloat(produto.custo) || 0;
    produto.mao_obra = parseFloat(produto.mao_obra) || 0;
    produto.valor_venda = parseFloat(produto.valor_venda) || 0;
    produto.valor_venda_atacado = parseFloat(produto.valor_venda_atacado) || 0;
    produto.margem_desejada_varejo = parseFloat(produto.margem_desejada_varejo) || 0;
    produto.margem_desejada_atacado = parseFloat(produto.margem_desejada_atacado) || 0;
    produto.estoque = parseInt(produto.estoque) || 0;
    
    // Lucro = Valor Total - (Custo + Mão de Obra)
    produto.lucro = produto.valor_venda - (produto.custo + produto.mao_obra);
    produto.lucro_atacado = produto.valor_venda_atacado - (produto.custo + produto.mao_obra);
    
    // Classificação de Margem de Lucro Varejo (%)
    const margem = produto.valor_venda > 0 ? (produto.lucro / produto.valor_venda) * 100 : 0;
    if (margem >= 50) {
      produto.status_margem = 'alta'; // Verde
    } else if (margem >= 25) {
      produto.status_margem = 'media'; // Amarelo
    } else {
      produto.status_margem = 'baixa'; // Vermelho
    }

    // Classificação de Margem de Lucro Atacado (%)
    const margemAtacado = produto.valor_venda_atacado > 0 ? (produto.lucro_atacado / produto.valor_venda_atacado) * 100 : 0;
    if (margemAtacado >= 40) {
      produto.status_margem_atacado = 'alta'; // Verde
    } else if (margemAtacado >= 20) {
      produto.status_margem_atacado = 'media'; // Amarelo
    } else {
      produto.status_margem_atacado = 'baixa'; // Vermelho
    }

    if (this.isSupabaseActive()) {
      try {
        if (!produto.sku) {
          // Gerar SKU temporário para a nuvem
          const prefix = produto.categoria.substring(0, 3).toUpperCase();
          produto.sku = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        
        if (produto.id && produto.id.length > 20) { // Indica UUID do Supabase
          const { data, error } = await supabaseClient
            .from('produtos')
            .update(produto)
            .eq('id', produto.id)
            .select();
          if (error) throw error;
          return data[0];
        } else {
          // Novo produto
          delete produto.id; // Deixar o Supabase gerar o UUID
          const { data, error } = await supabaseClient
            .from('produtos')
            .insert([produto])
            .select();
          if (error) throw error;
          return data[0];
        }
      } catch (err) {
        console.warn("Erro no Supabase ao salvar produto, usando LocalStorage:", err);
      }
    }

    // Lógica LocalStorage
    const produtos = this.getLocalData(LOCAL_KEYS.PRODUTOS);
    if (produto.id) {
      // Editar
      const idx = produtos.findIndex(p => p.id === produto.id);
      if (idx !== -1) {
        produtos[idx] = { ...produtos[idx], ...produto };
      }
    } else {
      // Criar Novo
      produto.id = Date.now().toString();
      produto.created_at = new Date().toISOString();
      // Gerar SKU padrão
      const prefix = produto.categoria.substring(0, 3).toUpperCase();
      const seq = String(produtos.length + 1).padStart(4, '0');
      produto.sku = `${prefix}-${new Date().getFullYear()}-${seq}`;
      produtos.push(produto);
    }
    this.setLocalData(LOCAL_KEYS.PRODUTOS, produtos);
    return produto;
  },

  async deletarProduto(id) {
    if (this.isSupabaseActive()) {
      try {
        const { error } = await supabaseClient
          .from('produtos')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn("Erro no Supabase ao deletar, usando LocalStorage:", err);
      }
    }
    const produtos = this.getLocalData(LOCAL_KEYS.PRODUTOS);
    const filtrados = produtos.filter(p => p.id !== id);
    this.setLocalData(LOCAL_KEYS.PRODUTOS, filtrados);
    return true;
  },

  // 4. OPERAÇÕES DE CLIENTES (CRUD)
  async getClientes() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabaseClient
          .from('clientes')
          .select('*')
          .order('nome', { ascending: true });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Erro no Supabase ao obter clientes, usando LocalStorage:", err);
      }
    }
    return this.getLocalData(LOCAL_KEYS.CLIENTES).sort((a, b) => a.nome.localeCompare(b.nome));
  },

  async salvarCliente(cliente) {
    cliente.total_compras = parseFloat(cliente.total_compras) || 0;

    if (this.isSupabaseActive()) {
      try {
        if (cliente.id && cliente.id.length > 20) {
          const { data, error } = await supabaseClient
            .from('clientes')
            .update(cliente)
            .eq('id', cliente.id)
            .select();
          if (error) throw error;
          return data[0];
        } else {
          delete cliente.id;
          const { data, error } = await supabaseClient
            .from('clientes')
            .insert([cliente])
            .select();
          if (error) throw error;
          return data[0];
        }
      } catch (err) {
        console.warn("Erro no Supabase ao salvar cliente, usando LocalStorage:", err);
      }
    }

    const clientes = this.getLocalData(LOCAL_KEYS.CLIENTES);
    if (cliente.id) {
      const idx = clientes.findIndex(c => c.id === cliente.id);
      if (idx !== -1) {
        clientes[idx] = { ...clientes[idx], ...cliente };
      }
    } else {
      cliente.id = Date.now().toString();
      cliente.created_at = new Date().toISOString();
      clientes.push(cliente);
    }
    this.setLocalData(LOCAL_KEYS.CLIENTES, clientes);
    return cliente;
  },

  // 5. OPERAÇÕES DE VENDAS
  async getVendas() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabaseClient
          .from('vendas')
          .select(`
            *,
            produtos (
              nome,
              categoria,
              sku
            )
          `)
          .order('created_at', { ascending: false });
        if (error) throw error;
        
        return data.map(v => ({
          ...v,
          produto_nome: v.produtos ? v.produtos.nome : 'Produto Removido',
          produto_sku: v.produtos ? v.produtos.sku : 'N/A'
        }));
      } catch (err) {
        console.warn("Erro no Supabase ao obter vendas, usando LocalStorage:", err);
      }
    }
    const vendas = this.getLocalData(LOCAL_KEYS.VENDAS);
    const produtos = this.getLocalData(LOCAL_KEYS.PRODUTOS);
    
    return vendas.map(v => {
      const prod = produtos.find(p => p.id === v.produto_id);
      return {
        ...v,
        produto_nome: prod ? prod.nome : 'Produto Removido',
        produto_sku: prod ? prod.sku : 'N/A'
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async registrarVenda(venda) {
    venda.quantidade = parseInt(venda.quantidade) || 1;
    venda.valor_venda = parseFloat(venda.valor_venda) || 0;
    
    let produtoEncontrado = null;

    if (this.isSupabaseActive()) {
      try {
        const { data: prodData, error: prodErr } = await supabaseClient
          .from('produtos')
          .select('*')
          .eq('id', venda.produto_id)
          .single();
        if (prodErr) throw prodErr;
        produtoEncontrado = prodData;

        const custoTotalPeca = (parseFloat(produtoEncontrado.custo) + parseFloat(produtoEncontrado.mao_obra));
        venda.lucro = venda.valor_venda - (custoTotalPeca * venda.quantidade);
        
        const novoEstoque = Math.max(0, produtoEncontrado.estoque - venda.quantidade);
        await supabaseClient
          .from('produtos')
          .update({ estoque: novoEstoque })
          .eq('id', produtoEncontrado.id);

        const { data: cliData } = await supabaseClient
          .from('clientes')
          .select('*')
          .eq('nome', venda.cliente_nome);

        if (cliData && cliData.length > 0) {
          const novoTotal = parseFloat(cliData[0].total_compras) + venda.valor_venda;
          await supabaseClient
            .from('clientes')
            .update({ total_compras: novoTotal })
            .eq('id', cliData[0].id);
        } else {
          await supabaseClient
            .from('clientes')
            .insert([{
              nome: venda.cliente_nome,
              tipo_cliente: venda.tipo_cliente,
              total_compras: venda.valor_venda
            }]);
        }

        venda.created_at = venda.created_at || new Date().toISOString();
        const { data: novaVenda, error: vendaErr } = await supabaseClient
          .from('vendas')
          .insert([venda])
          .select();
        if (vendaErr) throw vendaErr;

        return {
          ...novaVenda[0],
          produto_nome: produtoEncontrado.nome,
          produto_sku: produtoEncontrado.sku
        };
      } catch (err) {
        console.warn("Erro no Supabase ao registrar venda, tentando LocalStorage:", err);
      }
    }

    // Lógica LocalStorage
    const vendas = this.getLocalData(LOCAL_KEYS.VENDAS);
    const produtos = this.getLocalData(LOCAL_KEYS.PRODUTOS);
    const clientes = this.getLocalData(LOCAL_KEYS.CLIENTES);

    const prodIdx = produtos.findIndex(p => p.id === venda.produto_id);
    if (prodIdx !== -1) {
      produtoEncontrado = produtos[prodIdx];
      produtoEncontrado.estoque = Math.max(0, produtoEncontrado.estoque - venda.quantidade);
      produtos[prodIdx] = produtoEncontrado;
      this.setLocalData(LOCAL_KEYS.PRODUTOS, produtos);

      const custoTotalPeca = produtoEncontrado.custo + produtoEncontrado.mao_obra;
      venda.lucro = venda.valor_venda - (custoTotalPeca * venda.quantidade);
    } else {
      venda.lucro = 0;
    }

    const cliIdx = clientes.findIndex(c => c.nome.toLowerCase() === venda.cliente_nome.toLowerCase());
    if (cliIdx !== -1) {
      clientes[cliIdx].total_compras += venda.valor_venda;
    } else {
      clientes.push({
        id: Date.now().toString(),
        nome: venda.cliente_nome,
        telefone: '',
        tipo_cliente: venda.tipo_cliente,
        total_compras: venda.valor_venda,
        created_at: new Date().toISOString()
      });
    }
    this.setLocalData(LOCAL_KEYS.CLIENTES, clientes);

    venda.id = Date.now().toString();
    venda.created_at = venda.created_at || new Date().toISOString();
    vendas.push(venda);
    this.setLocalData(LOCAL_KEYS.VENDAS, vendas);

    return {
      ...venda,
      produto_nome: produtoEncontrado ? produtoEncontrado.nome : 'Produto Removido',
      produto_sku: produtoEncontrado ? produtoEncontrado.sku : 'N/A'
    };
  },

  // 6. OPERAÇÕES DE CATEGORIAS (CRUD DINÂMICO)
  async getCategorias() {
    const cats = this.getLocalData(LOCAL_KEYS.CATEGORIAS);
    if (cats.length === 0) {
      const padroes = ['Colar', 'Brinco', 'Pulseira', 'Anel'];
      this.setLocalData(LOCAL_KEYS.CATEGORIAS, padroes);
      return padroes;
    }
    return cats.sort((a, b) => a.localeCompare(b));
  },

  async salvarCategoria(nome) {
    const cats = await this.getCategorias();
    const nomeLimpo = nome.trim();
    if (nomeLimpo && !cats.map(c => c.toLowerCase()).includes(nomeLimpo.toLowerCase())) {
      cats.push(nomeLimpo);
      this.setLocalData(LOCAL_KEYS.CATEGORIAS, cats);
      return cats;
    }
    return cats;
  },

  async deletarCategoria(nome) {
    let cats = await this.getCategorias();
    cats = cats.filter(c => c.toLowerCase() !== nome.toLowerCase().trim());
    this.setLocalData(LOCAL_KEYS.CATEGORIAS, cats);
    return cats;
  },

  // 6. OPERAÇÕES DE INSUMOS (CRUD)
  async getInsumos() {
    return this.getLocalData(LOCAL_KEYS.INSUMOS).sort((a, b) => a.nome.localeCompare(b.nome) || a.especificacao.localeCompare(b.especificacao));
  },

  async salvarInsumo(insumo) {
    insumo.preco_custo = parseFloat(insumo.preco_custo) || 0;
    insumo.estoque_atual = parseFloat(insumo.estoque_atual) || 0;
    insumo.estoque_minimo = parseFloat(insumo.estoque_minimo) || 0;

    const insumos = this.getLocalData(LOCAL_KEYS.INSUMOS);
    if (insumo.id) {
      const idx = insumos.findIndex(i => i.id === insumo.id);
      if (idx !== -1) {
        insumos[idx] = { ...insumos[idx], ...insumo };
      }
    } else {
      insumo.id = 'i_' + Date.now().toString();
      insumo.created_at = new Date().toISOString();
      insumos.push(insumo);
    }
    this.setLocalData(LOCAL_KEYS.INSUMOS, insumos);
    return insumo;
  },

  async deletarInsumo(id) {
    let insumos = this.getLocalData(LOCAL_KEYS.INSUMOS);
    insumos = insumos.filter(i => i.id !== id);
    this.setLocalData(LOCAL_KEYS.INSUMOS, insumos);
    return true;
  },

  // 7. CARREGADOR DE DADOS DO CATÁLOGO REAL DEU NÓ (SEEDER)
  semearSeVazio() {
    const produtosExistentes = this.getLocalData(LOCAL_KEYS.PRODUTOS);
    const vendasExistentes = this.getLocalData(LOCAL_KEYS.VENDAS);
    const usuariosExistentes = this.getLocalData(LOCAL_KEYS.USUARIOS);

    // Seeder de Usuários
    if (usuariosExistentes.length === 0) {
      console.log("Semeando usuários locais padrão...");
      this.setLocalData(LOCAL_KEYS.USUARIOS, [
        { id: 'u1', username: 'admin', password: 'deuno2026', nome: 'Thiago Administrador', created_at: new Date().toISOString() }
      ]);
    }

    // Seeder de Insumos
    const insumosExistentes = this.getLocalData(LOCAL_KEYS.INSUMOS);
    if (insumosExistentes.length === 0) {
      console.log("Semeando insumos locais padrão...");
      this.setLocalData(LOCAL_KEYS.INSUMOS, [
        { id: 'i1', nome: 'Corda Náutica 4mm', tipo: 'corda', especificacao: 'Verde Militar', preco_custo: 5.00, unidade_medida: 'metro', estoque_atual: 50, estoque_minimo: 10, created_at: new Date().toISOString() },
        { id: 'i2', nome: 'Corda Náutica 4mm', tipo: 'corda', especificacao: 'Caramelo', preco_custo: 5.00, unidade_medida: 'metro', estoque_atual: 40, estoque_minimo: 10, created_at: new Date().toISOString() },
        { id: 'i3', nome: 'Argola de Metal 20mm', tipo: 'argola', especificacao: 'Ouro', preco_custo: 1.20, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 20, created_at: new Date().toISOString() },
        { id: 'i4', nome: 'Argola de Metal 20mm', tipo: 'argola', especificacao: 'Prata', preco_custo: 1.00, unidade_medida: 'unidade', estoque_atual: 80, estoque_minimo: 20, created_at: new Date().toISOString() },
        { id: 'i5', nome: 'Resina Pingente Domo', tipo: 'resina', especificacao: 'Tartaruga', preco_custo: 8.50, unidade_medida: 'unidade', estoque_atual: 15, estoque_minimo: 5, created_at: new Date().toISOString() }
      ]);
    }

    if (produtosExistentes.length > 0 || vendasExistentes.length > 0) {
      return;
    }

    console.log("Semeando banco de dados local com catálogo real Deu Nó e histórico financeiro...");

    // 17 PRODUTOS OFICIAIS DO CATÁLOGO DEU NÓ COM FOTOS REAIS
    const produtosSeed = [
      // COLARES
      { id: 'p1', nome: 'Colar Rastro', categoria: 'Colar', sku: 'COL-RASTRO', custo: 10.00, mao_obra: 5.00, valor_venda: 40.00, lucro: 25.00, estoque: 15, status_margem: 'alta', foto: '/assets/produtos/rastro.webp', created_at: new Date('2026-02-15T10:00:00Z').toISOString() },
      { id: 'p2', nome: 'Colar Fluxo', categoria: 'Colar', sku: 'COL-FLUXO', custo: 12.00, mao_obra: 5.00, valor_venda: 45.00, lucro: 28.00, estoque: 20, status_margem: 'alta', foto: '/assets/produtos/fluxo.webp', created_at: new Date('2026-02-15T11:00:00Z').toISOString() },
      { id: 'p3', nome: 'Colar Traço', categoria: 'Colar', sku: 'COL-TRACO', custo: 14.00, mao_obra: 6.00, valor_venda: 58.00, lucro: 38.00, estoque: 12, status_margem: 'alta', foto: '/assets/produtos/traco.webp', created_at: new Date('2026-02-16T09:00:00Z').toISOString() },
      { id: 'p4', nome: 'Colar Ângulo', categoria: 'Colar', sku: 'COL-ANGULO', custo: 15.00, mao_obra: 6.00, valor_venda: 60.00, lucro: 39.00, estoque: 10, status_margem: 'alta', foto: '/assets/produtos/angulo.webp', created_at: new Date('2026-02-18T14:00:00Z').toISOString() },
      { id: 'p5', nome: 'Colar Ponto', categoria: 'Colar', sku: 'COL-PONTO', custo: 15.00, mao_obra: 6.00, valor_venda: 60.00, lucro: 39.00, estoque: 25, status_margem: 'alta', foto: '/assets/produtos/ponto.webp', created_at: new Date('2026-02-20T16:00:00Z').toISOString() },
      { id: 'p6', nome: 'Colar Vínculo', categoria: 'Colar', sku: 'COL-VINCULO', custo: 16.00, mao_obra: 7.00, valor_venda: 65.00, lucro: 42.00, estoque: 8, status_margem: 'alta', foto: '/assets/produtos/vinculo.webp', created_at: new Date('2026-02-21T10:00:00Z').toISOString() },
      { id: 'p7', nome: 'Colar Eixo', categoria: 'Colar', sku: 'COL-EIXO', custo: 18.00, mao_obra: 7.00, valor_venda: 70.00, lucro: 45.00, estoque: 18, status_margem: 'alta', foto: '/assets/produtos/eixo.webp', created_at: new Date('2026-02-22T11:00:00Z').toISOString() },
      { id: 'p8', nome: 'Colar Domo', categoria: 'Colar', sku: 'COL-DOMO', custo: 20.00, mao_obra: 8.00, valor_venda: 75.00, lucro: 47.00, estoque: 6, status_margem: 'alta', foto: '/assets/produtos/domo.webp', created_at: new Date('2026-02-23T14:00:00Z').toISOString() },
      { id: 'p9', nome: 'Colar Velo', categoria: 'Colar', sku: 'COL-VELO', custo: 20.00, mao_obra: 8.00, valor_venda: 75.00, lucro: 47.00, estoque: 10, status_margem: 'alta', foto: '/assets/produtos/velo.webp', created_at: new Date('2026-02-24T15:00:00Z').toISOString() },
      { id: 'p10', nome: 'Colar Ciclo', categoria: 'Colar', sku: 'COL-CICLO', custo: 22.00, mao_obra: 8.00, valor_venda: 80.00, lucro: 50.00, estoque: 7, status_margem: 'alta', foto: '/assets/produtos/ciclo.webp', created_at: new Date('2026-02-25T16:00:00Z').toISOString() },
      { id: 'p11', nome: 'Colar Eco', categoria: 'Colar', sku: 'COL-ECO', custo: 24.00, mao_obra: 9.00, valor_venda: 85.00, lucro: 52.00, estoque: 14, status_margem: 'alta', foto: '/assets/produtos/eco.webp', created_at: new Date('2026-02-26T17:00:00Z').toISOString() },
      
      // PULSEIRAS
      { id: 'p12', nome: 'Pulseira Orvalho', categoria: 'Pulseira', sku: 'PUL-ORVALHO', custo: 12.00, mao_obra: 5.00, valor_venda: 48.00, lucro: 31.00, estoque: 22, status_margem: 'alta', foto: '/assets/produtos/orvalho.webp', created_at: new Date('2026-02-27T10:00:00Z').toISOString() },
      { id: 'p13', nome: 'Pulseira Elo', categoria: 'Pulseira', sku: 'PUL-ELO', custo: 13.00, mao_obra: 5.00, valor_venda: 50.00, lucro: 32.00, estoque: 30, status_margem: 'alta', foto: '/assets/produtos/elo.webp', created_at: new Date('2026-02-27T11:00:00Z').toISOString() },
      { id: 'p14', nome: 'Pulseira Laço', categoria: 'Pulseira', sku: 'PUL-LACO', custo: 14.00, mao_obra: 6.00, valor_venda: 55.00, lucro: 35.00, estoque: 15, status_margem: 'alta', foto: '/assets/produtos/laco.webp', created_at: new Date('2026-02-28T09:00:00Z').toISOString() },
      
      // BRINCOS
      { id: 'p15', nome: 'Brinco Bae', categoria: 'Brinco', sku: 'BRI-BAE', custo: 7.00, mao_obra: 3.00, valor_venda: 30.00, lucro: 20.00, estoque: 40, status_margem: 'alta', foto: '/assets/produtos/bae.webp', created_at: new Date('2026-02-28T14:00:00Z').toISOString() },
      { id: 'p16', nome: 'Brinco Douré', categoria: 'Brinco', sku: 'BRI-DOURE', custo: 9.00, mao_obra: 4.00, valor_venda: 40.00, lucro: 27.00, estoque: 20, status_margem: 'alta', foto: '/assets/produtos/doure.webp', created_at: new Date('2026-02-28T15:00:00Z').toISOString() },
      { id: 'p17', nome: 'Brinco Amá', categoria: 'Brinco', sku: 'BRI-AMA', custo: 10.00, mao_obra: 4.00, valor_venda: 45.00, lucro: 31.00, estoque: 35, status_margem: 'alta', foto: '/assets/produtos/ama.webp', created_at: new Date('2026-02-28T16:00:00Z').toISOString() }
    ];
    this.setLocalData(LOCAL_KEYS.PRODUTOS, produtosSeed);

    // CLIENTES DE TESTE (Histórico consolidado com os novos produtos)
    const clientesSeed = [
      { id: 'c1', nome: 'Mariana Silva Souza', telefone: '(11) 98888-7777', tipo_cliente: 'varejo', total_compras: 525.00, created_at: new Date('2026-03-01T10:00:00Z').toISOString() },
      { id: 'c2', nome: 'Juliana Costa Semijoias', telefone: '(21) 97777-6666', tipo_cliente: 'atacado', total_compras: 870.00, created_at: new Date('2026-03-05T12:00:00Z').toISOString() },
      { id: 'c3', nome: 'Camila de Oliveira Lima', telefone: '(31) 96666-5555', tipo_cliente: 'varejo', total_compras: 705.00, created_at: new Date('2026-03-10T15:00:00Z').toISOString() },
      { id: 'c4', nome: 'Beatriz Santos Revendas', telefone: '(19) 95555-4444', tipo_cliente: 'atacado', total_compras: 2440.00, created_at: new Date('2026-03-12T11:00:00Z').toISOString() }
    ];
    this.setLocalData(LOCAL_KEYS.CLIENTES, clientesSeed);

    // HISTÓRICO DE VENDAS REALISTAS BASEADAS NAS PEÇAS REAIS (Março, Abril e Maio de 2026)
    const vendasSeed = [
      // MARÇO 2026
      { id: 'v1', produto_id: 'p1', cliente_nome: 'Mariana Silva Souza', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 2, valor_venda: 80.00, lucro: 50.00, observacoes: 'Cliente adorou o acabamento em verde militar', created_at: new Date('2026-03-02T14:30:00Z').toISOString() },
      { id: 'v2', produto_id: 'p2', cliente_nome: 'Camila de Oliveira Lima', tipo_cliente: 'varejo', pagamento: 'Cartão', quantidade: 3, valor_venda: 135.00, lucro: 84.00, observacoes: 'Modelo mesclado preto/dourado', created_at: new Date('2026-03-11T10:15:00Z').toISOString() },
      { id: 'v3', produto_id: 'p13', cliente_nome: 'Juliana Costa Semijoias', tipo_cliente: 'atacado', pagamento: 'Cartão', quantidade: 10, valor_venda: 400.00, lucro: 220.00, observacoes: 'Lote atacado inicial de pulseiras', created_at: new Date('2026-03-15T16:00:00Z').toISOString() },
      { id: 'v4', produto_id: 'p17', cliente_nome: 'Mariana Silva Souza', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 45.00, lucro: 31.00, observacoes: '', created_at: new Date('2026-03-22T18:20:00Z').toISOString() },
      { id: 'v5', produto_id: 'p13', cliente_nome: 'Camila de Oliveira Lima', tipo_cliente: 'varejo', pagamento: 'Dinheiro', quantidade: 2, valor_venda: 100.00, lucro: 64.00, observacoes: '', created_at: new Date('2026-03-29T11:45:00Z').toISOString() },

      // ABRIL 2026
      { id: 'v6', produto_id: 'p1', cliente_nome: 'Mariana Silva Souza', tipo_cliente: 'varejo', pagamento: 'Cartão', quantidade: 1, valor_venda: 40.00, lucro: 25.00, observacoes: '', created_at: new Date('2026-04-03T11:00:00Z').toISOString() },
      { id: 'v7', produto_id: 'p15', cliente_nome: 'Beatriz Santos Revendas', tipo_cliente: 'atacado', pagamento: 'PIX', quantidade: 20, valor_venda: 440.00, lucro: 240.00, observacoes: 'Desconto atacado brinco Bae', created_at: new Date('2026-04-09T09:30:00Z').toISOString() },
      { id: 'v8', produto_id: 'p13', cliente_nome: 'Camila de Oliveira Lima', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 50.00, lucro: 32.00, observacoes: '', created_at: new Date('2026-04-14T17:10:00Z').toISOString() },
      { id: 'v9', produto_id: 'p1', cliente_nome: 'Juliana Costa Semijoias', tipo_cliente: 'atacado', pagamento: 'Dinheiro', quantidade: 10, valor_venda: 320.00, lucro: 170.00, observacoes: 'Atacado lote Rastro', created_at: new Date('2026-04-20T14:00:00Z').toISOString() },
      { id: 'v10', produto_id: 'p17', cliente_nome: 'Mariana Silva Souza', tipo_cliente: 'varejo', pagamento: 'Cartão', quantidade: 2, valor_venda: 90.00, lucro: 62.00, observacoes: 'Cartão de Crédito', created_at: new Date('2026-04-25T16:40:00Z').toISOString() },
      { id: 'v11', produto_id: 'p5', cliente_nome: 'Camila de Oliveira Lima', tipo_cliente: 'varejo', pagamento: 'Dinheiro', quantidade: 3, valor_venda: 180.00, lucro: 117.00, observacoes: 'Rami branco e cinza mescla', created_at: new Date('2026-04-29T15:20:00Z').toISOString() },

      // MAIO 2026
      { id: 'v12', produto_id: 'p1', cliente_nome: 'Mariana Silva Souza', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 2, valor_venda: 80.00, lucro: 50.00, observacoes: '', created_at: new Date('2026-05-02T13:00:00Z').toISOString() },
      { id: 'v13', produto_id: 'p17', cliente_nome: 'Beatriz Santos Revendas', tipo_cliente: 'atacado', pagamento: 'Cartão', quantidade: 40, valor_venda: 1400.00, lucro: 840.00, observacoes: 'Atacado brincos Amá para revenda', created_at: new Date('2026-05-08T10:00:00Z').toISOString() },
      { id: 'v14', produto_id: 'p13', cliente_nome: 'Camila de Oliveira Lima', tipo_cliente: 'varejo', pagamento: 'Cartão', quantidade: 3, valor_venda: 150.00, lucro: 96.00, observacoes: '', created_at: new Date('2026-05-13T16:15:00Z').toISOString() },
      { id: 'v15', produto_id: 'p15', cliente_nome: 'Beatriz Santos Revendas', tipo_cliente: 'atacado', pagamento: 'PIX', quantidade: 25, valor_venda: 600.00, lucro: 350.00, observacoes: 'Pedido extra brinco Bae', created_at: new Date('2026-05-18T09:45:00Z').toISOString() },
      { id: 'v16', produto_id: 'p1', cliente_nome: 'Juliana Costa Semijoias', tipo_cliente: 'atacado', pagamento: 'PIX', quantidade: 5, valor_venda: 150.00, lucro: 75.00, observacoes: 'Suplementar colares', created_at: new Date('2026-05-22T14:30:00Z').toISOString() },
      { id: 'v17', produto_id: 'p5', cliente_nome: 'Mariana Silva Souza', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 3, valor_venda: 180.00, lucro: 117.00, observacoes: 'Vários tons pastéis de Ponto', created_at: new Date('2026-05-26T17:00:00Z').toISOString() },
      { id: 'v18', produto_id: 'p2', cliente_nome: 'Camila de Oliveira Lima', tipo_cliente: 'varejo', pagamento: 'Dinheiro', quantidade: 2, valor_venda: 90.00, lucro: 56.00, observacoes: '', created_at: new Date('2026-05-27T15:00:00Z').toISOString() }
    ];
    this.setLocalData(LOCAL_KEYS.VENDAS, vendasSeed);
  }
};

// Executa a semeadura automática ao carregar o arquivo
DB.semearSeVazio();
// Inicializa conexão se as chaves do Supabase já estiverem salvas
DB.initSupabase();
