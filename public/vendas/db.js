/* global supabase */
// db.js - Camada de Persistência Híbrida (LocalStorage & Supabase) com Catálogo Oficial Deu Nó

// Polyfill de segurança para localStorage/sessionStorage bloqueados em modo privado de alguns navegadores/tablets
(function() {
  function testStorage(type) {
    try {
      const storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }
  function createMemoryStorage() {
    const data = {};
    return {
      getItem(key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null; },
      setItem(key, value) { data[key] = String(value); },
      removeItem(key) { delete data[key]; },
      clear() { for (const k in data) delete data[k]; },
      key(i) { return Object.keys(data)[i] || null; },
      get length() { return Object.keys(data).length; }
    };
  }
  if (!testStorage('localStorage')) {
    console.warn('LocalStorage is blocked or not supported. Falling back to memory storage.');
    Object.defineProperty(window, 'localStorage', { value: createMemoryStorage(), writable: true, configurable: true });
  }
  if (!testStorage('sessionStorage')) {
    console.warn('SessionStorage is blocked or not supported. Falling back to memory storage.');
    Object.defineProperty(window, 'sessionStorage', { value: createMemoryStorage(), writable: true, configurable: true });
  }
})();

const LOCAL_KEYS = {
  PRODUTOS: 'site_semijoias_produtos',
  VENDAS: 'site_semijoias_vendas',
  CLIENTES: 'site_semijoias_clientes',
  CATEGORIAS: 'site_semijoias_categorias',
  USUARIOS: 'site_semijoias_usuarios',
  INSUMOS: 'site_semijoias_insumos',
  SUPABASE_URL: 'site_semijoias_supa_url',
  SUPABASE_KEY: 'site_semijoias_supa_key',
  SUPABASE_DISABLED: 'site_semijoias_supa_disabled'
};

// Declaração do cliente Supabase global (será inicializado dinamicamente)
// Declaração do cliente Supabase global (será inicializado dinamicamente)
let supabaseClient = null;

// ==================== SEEDS DE DADOS GLOBAIS (PRODUTOS, CLIENTES E VENDAS) ====================
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
      { id: 'p15', nome: 'Brinco Bae', categoria: 'Brinco', sku: 'BRI-BAE', custo: 7.00, mao_obra: 3.00, valor_venda: 30.00, lucro: 20.00, estoque: 0, status_margem: 'alta', foto: '/assets/produtos/bae.webp', created_at: new Date('2026-02-28T14:00:00Z').toISOString() },
      { id: 'p16', nome: 'Brinco Douré', categoria: 'Brinco', sku: 'BRI-DOURE', custo: 9.00, mao_obra: 4.00, valor_venda: 40.00, lucro: 27.00, estoque: 20, status_margem: 'alta', foto: '/assets/produtos/doure.webp', created_at: new Date('2026-02-28T15:00:00Z').toISOString() },
      { id: 'p17', nome: 'Brinco Amá', categoria: 'Brinco', sku: 'BRI-AMA', custo: 10.00, mao_obra: 4.00, valor_venda: 45.00, lucro: 31.00, estoque: 35, status_margem: 'alta', foto: '/assets/produtos/ama.webp', created_at: new Date('2026-02-28T16:00:00Z').toISOString() }
,
      { id: 'p18', nome: 'Colar Sopro', categoria: 'Colar', sku: 'COL-SOPRO', custo: 60.02, mao_obra: 10.00, valor_venda: 85.00, lucro: 24.98, estoque: 10, status_margem: 'alta', foto: '/assets/produtos/sopro.webp', created_at: new Date('2026-02-28T17:00:00Z').toISOString() }
    ];

const clientesSeed = [
      { id: 'c1', nome: 'Mariana Silva Souza', telefone: '(11) 98888-7777', tipo_cliente: 'varejo', total_compras: 525.00, created_at: new Date('2026-03-01T10:00:00Z').toISOString() },
      { id: 'c2', nome: 'Juliana Costa Semijoias', telefone: '(21) 97777-6666', tipo_cliente: 'atacado', total_compras: 870.00, created_at: new Date('2026-03-05T12:00:00Z').toISOString() },
      { id: 'c3', nome: 'Camila de Oliveira Lima', telefone: '(31) 96666-5555', tipo_cliente: 'varejo', total_compras: 705.00, created_at: new Date('2026-03-10T15:00:00Z').toISOString() },
      { id: 'c4', nome: 'Beatriz Santos Revendas', telefone: '(19) 95555-4444', tipo_cliente: 'atacado', total_compras: 2440.00, created_at: new Date('2026-03-12T11:00:00Z').toISOString() }
    ];

const vendasSeed = [
      { id: 'v_maio_1', produto_id: 'p2', cliente_nome: 'Hellen', tipo_cliente: 'varejo', pagamento: 'Dinheiro', quantidade: 1, valor_venda: 45.00, lucro: 14.85, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 30.15, Mão de obra: R$ 10', created_at: '2026-05-01T12:00:00.000Z' },
      { id: 'v_maio_2', produto_id: 'p10', cliente_nome: 'Helena', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 80.00, lucro: 25.67, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 54.33, Mão de obra: R$ 10', created_at: '2026-05-01T12:00:00.000Z' },
      { id: 'v_maio_3', produto_id: 'p2', cliente_nome: 'Vangêla', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 45.00, lucro: 14.85, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 30.15, Mão de obra: R$ 10', created_at: '2026-05-02T12:00:00.000Z' },
      { id: 'v_maio_4', produto_id: 'p5', cliente_nome: 'Flavia', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 60.00, lucro: 18.44, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 41.56, Mão de obra: R$ 10', created_at: '2026-05-02T12:00:00.000Z' },
      { id: 'v_maio_5', produto_id: 'p1', cliente_nome: 'Itamara', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 40.00, lucro: 13.61, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 26.39, Mão de obra: R$ 10', created_at: '2026-05-03T12:00:00.000Z' },
      { id: 'v_maio_6', produto_id: 'p2', cliente_nome: 'Itamara', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 45.00, lucro: 14.85, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 30.15, Mão de obra: R$ 10', created_at: '2026-05-03T12:00:00.000Z' },
      { id: 'v_maio_7', produto_id: 'p2', cliente_nome: 'Juliana', tipo_cliente: 'varejo', pagamento: 'Dinheiro', quantidade: 1, valor_venda: 45.00, lucro: 14.85, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 30.15, Mão de obra: R$ 10', created_at: '2026-05-03T12:00:00.000Z' },
      { id: 'v_maio_8', produto_id: 'p11', cliente_nome: 'Flavia', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 85.00, lucro: 24.36, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 60.64, Mão de obra: R$ 10', created_at: '2026-05-03T12:00:00.000Z' },
      { id: 'v_maio_9', produto_id: 'p1', cliente_nome: 'Regina', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 40.00, lucro: 13.61, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 26.39, Mão de obra: R$ 10', created_at: '2026-05-05T12:00:00.000Z' },
      { id: 'v_maio_10', produto_id: 'p1', cliente_nome: 'Ticiane', tipo_cliente: 'atacado', pagamento: 'Cartão', quantidade: 1, valor_venda: 35.00, lucro: 8.61, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 26.39, Mão de obra: R$ 10', created_at: '2026-05-02T12:00:00.000Z' },
      { id: 'v_maio_11', produto_id: 'p8', cliente_nome: 'Ticiane', tipo_cliente: 'atacado', pagamento: 'Cartão', quantidade: 1, valor_venda: 70.00, lucro: 22.42, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 47.58, Mão de obra: R$ 10', created_at: '2026-05-02T12:00:00.000Z' },
      { id: 'v_maio_12', produto_id: 'p17', cliente_nome: 'Ticiane', tipo_cliente: 'atacado', pagamento: 'Cartão', quantidade: 1, valor_venda: 40.00, lucro: 6.81, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 33.19, Mão de obra: R$ 5', created_at: '2026-05-02T12:00:00.000Z' },
      { id: 'v_maio_13', produto_id: 'p2', cliente_nome: 'Kassiane', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 45.00, lucro: 14.85, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 30.15, Mão de obra: R$ 10', created_at: '2026-05-05T12:00:00.000Z' },
      { id: 'v_maio_14', produto_id: 'p2', cliente_nome: 'Íris', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 45.00, lucro: 14.85, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 30.15, Mão de obra: R$ 10', created_at: '2026-05-05T12:00:00.000Z' },
      { id: 'v_maio_15', produto_id: 'p11', cliente_nome: 'Neusa', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 85.00, lucro: 24.36, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 60.64, Mão de obra: R$ 10', created_at: '2026-05-06T12:00:00.000Z' },
      { id: 'v_maio_16', produto_id: 'p11', cliente_nome: 'Emmily', tipo_cliente: 'atacado', pagamento: 'PIX', quantidade: 1, valor_venda: 78.00, lucro: 17.36, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 60.64, Mão de obra: R$ 10', created_at: '2026-05-08T12:00:00.000Z' },
      { id: 'v_maio_17', produto_id: 'p10', cliente_nome: 'Emmily', tipo_cliente: 'atacado', pagamento: 'PIX', quantidade: 1, valor_venda: 72.00, lucro: 17.67, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 54.33, Mão de obra: R$ 10', created_at: '2026-05-08T12:00:00.000Z' },
      { id: 'v_maio_18', produto_id: 'p7', cliente_nome: 'Emmily', tipo_cliente: 'atacado', pagamento: 'PIX', quantidade: 1, valor_venda: 62.00, lucro: 17.71, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 44.29, Mão de obra: R$ 10', created_at: '2026-05-08T12:00:00.000Z' },
      { id: 'v_maio_19', produto_id: 'p16', cliente_nome: 'Emmily', tipo_cliente: 'atacado', pagamento: 'PIX', quantidade: 1, valor_venda: 35.00, lucro: 8.09, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 26.91, Mão de obra: R$ 5', created_at: '2026-05-08T12:00:00.000Z' },
      { id: 'v_maio_20', produto_id: 'p17', cliente_nome: 'Emmily', tipo_cliente: 'atacado', pagamento: 'PIX', quantidade: 1, valor_venda: 40.00, lucro: 6.81, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 33.19, Mão de obra: R$ 5', created_at: '2026-05-08T12:00:00.000Z' },
      { id: 'v_maio_21', produto_id: 'p14', cliente_nome: 'Alda', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 55.00, lucro: 10.97, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 37.03, Mão de obra: R$ 5', created_at: '2026-05-10T12:00:00.000Z' },
      { id: 'v_maio_22', produto_id: 'p15', cliente_nome: 'Alda', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 30.00, lucro: 5.35, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 19.65, Mão de obra: R$ 5', created_at: '2026-05-10T12:00:00.000Z' },
      { id: 'v_maio_23', produto_id: 'p11', cliente_nome: 'Degilane', tipo_cliente: 'varejo', pagamento: 'Dinheiro', quantidade: 1, valor_venda: 85.00, lucro: 24.36, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 60.64, Mão de obra: R$ 10', created_at: '2026-05-13T12:00:00.000Z' },
      { id: 'v_maio_24', produto_id: 'p10', cliente_nome: 'Degilane', tipo_cliente: 'varejo', pagamento: 'Dinheiro', quantidade: 1, valor_venda: 80.00, lucro: 25.67, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 54.33, Mão de obra: R$ 10', created_at: '2026-05-13T12:00:00.000Z' },
      { id: 'v_maio_25', produto_id: 'p4', cliente_nome: 'Degilane', tipo_cliente: 'varejo', pagamento: 'Dinheiro', quantidade: 1, valor_venda: 60.00, lucro: 24.09, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 35.91, Mão de obra: R$ 10', created_at: '2026-05-13T12:00:00.000Z' },
      { id: 'v_maio_26', produto_id: 'p1', cliente_nome: 'Mylena', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 40.00, lucro: 13.61, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 26.39, Mão de obra: R$ 10', created_at: '2026-05-13T12:00:00.000Z' },
      { id: 'v_maio_27', produto_id: 'p18', cliente_nome: 'Mylena', tipo_cliente: 'varejo', pagamento: 'PIX', quantidade: 1, valor_venda: 85.00, lucro: 24.98, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 60.02, Mão de obra: R$ 10', created_at: '2026-05-13T12:00:00.000Z' },
      { id: 'v_maio_28', produto_id: 'p4', cliente_nome: 'Ana', tipo_cliente: 'atacado', pagamento: 'Cartão', quantidade: 1, valor_venda: 50.00, lucro: 14.09, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 35.91, Mão de obra: R$ 10', created_at: '2026-05-23T12:00:00.000Z' },
      { id: 'v_maio_29', produto_id: 'p12', cliente_nome: 'Ana', tipo_cliente: 'atacado', pagamento: 'Cartão', quantidade: 1, valor_venda: 42.00, lucro: 10.07, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 32.23, Mão de obra: R$ 5', created_at: '2026-05-23T12:00:00.000Z' },
      { id: 'v_maio_30', produto_id: 'p7', cliente_nome: 'Jucilene', tipo_cliente: 'varejo', pagamento: 'Dinheiro', quantidade: 1, valor_venda: 70.00, lucro: 25.71, observacoes: 'Venda registrada via planilha de Maio. Custo: R$ 44.29, Mão de obra: R$ 10', created_at: '2026-05-28T12:00:00.000Z' }
    ];


const DB = {
  async semearSupabaseSeVazio() {
    if (!supabaseClient) return;
    
    try {
      // 1. Verificar se a tabela de produtos está vazia no Supabase
      const { data: prods, error: errProds } = await supabaseClient
        .from('produtos')
        .select('id')
        .limit(1);
        
      if (errProds) {
        console.error("Erro ao verificar produtos no Supabase:", errProds);
        return;
      }
      
      if (prods.length > 0) {
        console.log("Supabase já possui produtos cadastrados. Pulando semeadura da nuvem.");
        return;
      }
      
      console.log("Banco de dados Supabase vazio! Iniciando semeadura automática...");
      
      // 2. Semear produtos (gerando UUIDs e mapeando IDs antigos 'p1'..'p18')
      const idMapping = {};
      
      for (const prod of produtosSeed) {
        const prodCopy = { ...prod };
        const oldId = prodCopy.id;
        delete prodCopy.id; // Deixar Supabase gerar UUID
        
        const { data: inserted, error: errIns } = await supabaseClient
          .from('produtos')
          .insert([prodCopy])
          .select()
          .single();
          
        if (errIns) {
          console.error(`Erro ao semear produto ${prod.nome} no Supabase:`, errIns);
          continue;
        }
        
        idMapping[oldId] = inserted.id;
      }
      
      console.log("Produtos semeados no Supabase com sucesso. Semeando clientes...");
      
      // 3. Semear clientes
      const { error: errCli } = await supabaseClient
        .from('clientes')
        .insert(clientesSeed.map(c => {
          const cCopy = { ...c };
          delete cCopy.id; // Deixar Supabase gerar UUID
          return cCopy;
        }));
        
      if (errCli) {
        console.error("Erro ao semear clientes no Supabase:", errCli);
      }
      
      console.log("Clientes semeados no Supabase com sucesso. Semeando vendas...");
      
      // 4. Semear vendas mapeando produto_id para os novos UUIDs
      const salesToInsert = vendasSeed.map(v => {
        const vCopy = { ...v };
        delete vCopy.id; // Deixar Supabase gerar UUID
        vCopy.produto_id = idMapping[v.produto_id] || v.produto_id;
        return vCopy;
      }).filter(v => v.produto_id && v.produto_id.length > 20); // Garante que foi mapeado para UUID
      
      const { error: errVendas } = await supabaseClient
        .from('vendas')
        .insert(salesToInsert);
        
      if (errVendas) {
        console.error("Erro ao semear vendas no Supabase:", errVendas);
      }
      
      console.log("✓ Semeadura automática do Supabase concluída!");

      // 5. Semear insumos do localStorage no Supabase (se a tabela estiver vazia)
      await this.migrarInsumosParaSupabase();

    } catch (e) {
      console.error("Erro geral na semeadura do Supabase:", e);
    }
  },

  async migrarInsumosParaSupabase() {
    if (!supabaseClient) return;
    try {
      // Verifica se já existe algum insumo no Supabase
      const { data: existentes, error: errCheck } = await supabaseClient
        .from('insumos')
        .select('id')
        .limit(1);

      if (errCheck) { console.warn('Não foi possível verificar insumos no Supabase:', errCheck); return; }
      if (existentes && existentes.length > 0) {
        console.log('Supabase já possui insumos. Migração ignorada.');
        return;
      }

      // Buscar insumos do localStorage
      const insumosLocais = this.getLocalData(LOCAL_KEYS.INSUMOS);
      if (!insumosLocais || insumosLocais.length === 0) {
        console.log('Nenhum insumo local para migrar.');
        return;
      }

      console.log(`Migrando ${insumosLocais.length} insumos para o Supabase...`);

      const payload = insumosLocais.map(i => ({
        local_id: i.id,
        nome: i.nome,
        tipo: i.tipo || 'outros',
        especificacao: i.especificacao || '',
        preco_custo: parseFloat(i.preco_custo) || 0,
        unidade_medida: i.unidade_medida || 'unidade',
        estoque_atual: parseFloat(i.estoque_atual) || 0,
        estoque_minimo: parseFloat(i.estoque_minimo) || 0
      }));

      // Inserir em lotes de 100 para evitar limites da API
      for (let i = 0; i < payload.length; i += 100) {
        const lote = payload.slice(i, i + 100);
        const { error: errIns } = await supabaseClient.from('insumos').insert(lote);
        if (errIns) { console.error('Erro ao migrar lote de insumos:', errIns); }
      }

      console.log('✓ Insumos migrados para o Supabase com sucesso!');
    } catch (e) {
      console.error('Erro ao migrar insumos para o Supabase:', e);
    }
  },
  // 1. GERENCIAMENTO DE CREDENCIAIS DO SUPABASE
  getSupabaseConfig() {
    if (localStorage.getItem(LOCAL_KEYS.SUPABASE_DISABLED) === 'true') {
      return null;
    }
    const envUrl = window.ENV?.SUPABASE_URL;
    const envKey = window.ENV?.SUPABASE_KEY;
    if (envUrl && envUrl.trim() !== '' && envKey && envKey.trim() !== '') {
      return { url: envUrl.trim(), key: envKey.trim() };
    }
    const url = localStorage.getItem(LOCAL_KEYS.SUPABASE_URL);
    const key = localStorage.getItem(LOCAL_KEYS.SUPABASE_KEY);
    if (url && key) {
      return { url: url.trim(), key: key.trim() };
    }
    return null;
  },

  setSupabaseConfig(url, key) {
    if (url && key) {
      localStorage.removeItem(LOCAL_KEYS.SUPABASE_DISABLED);
      localStorage.setItem(LOCAL_KEYS.SUPABASE_URL, url.trim());
      localStorage.setItem(LOCAL_KEYS.SUPABASE_KEY, key.trim());
      this.initSupabase();
      return true;
    }
    return false;
  },

  clearSupabaseConfig() {
    localStorage.setItem(LOCAL_KEYS.SUPABASE_DISABLED, 'true');
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
        // Semear produtos/vendas se o Supabase estiver vazio
        this.semearSupabaseSeVazio();
        // Sempre migrar insumos do localStorage → Supabase se a tabela estiver vazia
        this.migrarInsumosParaSupabase();
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
    const defaultUsername = window.ENV?.DEFAULT_USERNAME || 'admin';
    const defaultPassword = window.ENV?.DEFAULT_PASSWORD || '';
    const userObj = usuarios.find(u => {
      const isMatch = u.username.trim().toLowerCase() === username.trim().toLowerCase();
      const expectedPassword = isMatch && u.username.trim().toLowerCase() === defaultUsername.trim().toLowerCase() ? defaultPassword : u.password;
      return isMatch && expectedPassword === password.trim();
    });
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

  async limparTodasVendas() {
    if (this.isSupabaseActive()) {
      try {
        const { error } = await supabaseClient
          .from('vendas')
          .delete()
          .gt('created_at', '2000-01-01T00:00:00Z');
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn("Erro no Supabase ao limpar vendas, usando LocalStorage:", err);
      }
    }
    this.setLocalData(LOCAL_KEYS.VENDAS, []);
    return true;
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
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabaseClient
          .from('insumos')
          .select('*')
          .order('nome', { ascending: true });
        if (error) throw error;
        // Normalizar: usar local_id como id se disponível para compatibilidade
        return data.map(i => ({ ...i, id: i.local_id || i.id }));
      } catch (err) {
        console.warn('Erro no Supabase ao obter insumos, usando LocalStorage:', err);
      }
    }
    const insumos = this.getLocalData(LOCAL_KEYS.INSUMOS);
    
    // Garante que a corda genérica exista no banco mesmo que o usuário já tenha semeado anteriormente
    const temGenerico = insumos.some(i => i.id === 'i_corda_generica');
    if (!temGenerico) {
      const insumoCordaGenerica = {
        id: 'i_corda_generica',
        nome: 'Corda (Sem Cor)',
        tipo: 'corda',
        especificacao: 'Náutica 4mm',
        preco_custo: 4.00,
        unidade_medida: 'metro',
        estoque_atual: 9999,
        estoque_minimo: 0,
        created_at: new Date().toISOString()
      };
      insumos.push(insumoCordaGenerica);
      this.setLocalData(LOCAL_KEYS.INSUMOS, insumos);
    }

    return insumos.sort((a, b) => a.nome.localeCompare(b.nome) || a.especificacao.localeCompare(b.especificacao));
  },

  async salvarInsumo(insumo) {
    insumo.preco_custo = parseFloat(insumo.preco_custo) || 0;
    insumo.estoque_atual = parseFloat(insumo.estoque_atual) || 0;
    insumo.estoque_minimo = parseFloat(insumo.estoque_minimo) || 0;

    if (this.isSupabaseActive()) {
      try {
        const payload = {
          local_id: insumo.id || null,
          nome: insumo.nome,
          tipo: insumo.tipo,
          especificacao: insumo.especificacao || '',
          preco_custo: insumo.preco_custo,
          unidade_medida: insumo.unidade_medida,
          estoque_atual: insumo.estoque_atual,
          estoque_minimo: insumo.estoque_minimo
        };

        if (insumo.id) {
          // Atualizar: buscar por local_id ou id
          const { data: existing } = await supabaseClient
            .from('insumos')
            .select('id')
            .or(`local_id.eq.${insumo.id},id.eq.${insumo.id}`)
            .maybeSingle();

          if (existing) {
            const { data, error } = await supabaseClient
              .from('insumos')
              .update(payload)
              .eq('id', existing.id)
              .select()
              .single();
            if (error) throw error;
            return { ...data, id: data.local_id || data.id };
          } else {
            // Não encontrado — inserir
            payload.local_id = insumo.id;
            const { data, error } = await supabaseClient
              .from('insumos')
              .insert([payload])
              .select()
              .single();
            if (error) throw error;
            return { ...data, id: data.local_id || data.id };
          }
        } else {
          insumo.id = 'i_' + Date.now().toString();
          payload.local_id = insumo.id;
          const { data, error } = await supabaseClient
            .from('insumos')
            .insert([payload])
            .select()
            .single();
          if (error) throw error;
          return { ...data, id: data.local_id || data.id };
        }
      } catch (err) {
        console.warn('Erro no Supabase ao salvar insumo, usando LocalStorage:', err);
      }
    }

    // Fallback LocalStorage
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
    if (this.isSupabaseActive()) {
      try {
        const { error } = await supabaseClient
          .from('insumos')
          .delete()
          .or(`local_id.eq.${id},id.eq.${id}`);
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn('Erro no Supabase ao deletar insumo, usando LocalStorage:', err);
      }
    }
    let insumos = this.getLocalData(LOCAL_KEYS.INSUMOS);
    insumos = insumos.filter(i => i.id !== id);
    this.setLocalData(LOCAL_KEYS.INSUMOS, insumos);
    return true;
  },

  // Forçar sincronização completa: apaga os insumos do Supabase e reenvia os do localStorage
  async sincronizarTodosInsumosParaNuvem() {
    if (!supabaseClient) throw new Error('Supabase não está conectado');

    const insumosLocais = this.getLocalData(LOCAL_KEYS.INSUMOS);
    if (!insumosLocais || insumosLocais.length === 0) return 0;

    // 1. Deletar tudo no Supabase
    const { error: delErr } = await supabaseClient
      .from('insumos')
      .delete()
      .gt('created_at', '1970-01-01T00:00:00Z');
    if (delErr) throw delErr;

    // 2. Reenviar todos do localStorage
    const payload = insumosLocais.map(i => ({
      local_id: i.id,
      nome: i.nome,
      tipo: i.tipo || 'outros',
      especificacao: i.especificacao || '',
      preco_custo: parseFloat(i.preco_custo) || 0,
      unidade_medida: i.unidade_medida || 'unidade',
      estoque_atual: parseFloat(i.estoque_atual) || 0,
      estoque_minimo: parseFloat(i.estoque_minimo) || 0
    }));

    for (let i = 0; i < payload.length; i += 100) {
      const lote = payload.slice(i, i + 100);
      const { error: insErr } = await supabaseClient.from('insumos').insert(lote);
      if (insErr) throw insErr;
    }

    console.log(`✓ ${payload.length} insumos sincronizados para o Supabase.`);
    return payload.length;
  },

  // 7. CARREGADOR DE DADOS DO CATÁLOGO REAL DEU NÓ (SEEDER)
  semearSeVazio() {
    let produtosExistentes = this.getLocalData(LOCAL_KEYS.PRODUTOS);
    let vendasExistentes = this.getLocalData(LOCAL_KEYS.VENDAS);
    const usuariosExistentes = this.getLocalData(LOCAL_KEYS.USUARIOS);

    // Seeder de Usuários
    if (usuariosExistentes.length === 0) {
      console.log("Semeando usuários locais padrão...");
      this.setLocalData(LOCAL_KEYS.USUARIOS, [
        { id: 'u1', username: window.ENV?.DEFAULT_USERNAME || 'admin', password: window.ENV?.DEFAULT_PASSWORD || '', nome: 'Thiago Administrador', created_at: new Date().toISOString() }
      ]);
    }

    // Seeder de Insumos - Exclusivo do arquivo insumo.md
    let insumosExistentes = this.getLocalData(LOCAL_KEYS.INSUMOS);
    
    // Lista de cores oficiais extraída de src/data/colorsCatalog.js
    const coresCatalogo = [
      "Amarelo Manteiga", "Areia", "Areia com Poá marrom", "Areia com Poá marrom escuro",
      "Areia e Caramelo Mesclada", "Azul Anil", "Azul Bebê", "Azul Marinho",
      "Azul Marinho com Poá branco", "Azul Petróleo", "Azul Royal", "Bege",
      "Bege Natural", "Bordô", "Branco", "Caramelo", "Chumbo", "Cinza",
      "Laranja", "Marrom", "Marrom Escuro", "Mostarda", "Prata e Dourado", "Preto",
      "Preto com Poá branco", "Preto e Dourado", "Rami", "Rami Branco", "Rosa",
      "Rosa Bebê", "Roxo", "Terracota", "Turquesa", "Verde", "Verde Bandeira",
      "Verde Escuro", "Verde Jade", "Verde Limão", "Verde Militar",
      "Verde Militar com Poá branco", "Vermelho", "Vermelho com Poá azul marinho",
      "Vermelho Figo", "Vermelho Vivo", "Vinho"
    ];

    // Gerar os insumos de cordas dinamicamente a partir das cores do catálogo (Preço: R$ 4,00 / metro)
    const insumoCordaGenerica = {
      id: 'i_corda_generica',
      nome: 'Corda (Sem Cor)',
      tipo: 'corda',
      especificacao: 'Náutica 4mm',
      preco_custo: 4.00,
      unidade_medida: 'metro',
      estoque_atual: 9999, // Estoque alto para não alertar a si mesma
      estoque_minimo: 0,
      created_at: new Date().toISOString()
    };

    const insumosCordas = [
      insumoCordaGenerica,
      ...coresCatalogo.map((cor, index) => ({
        id: `i_corda_${index + 1}`,
        nome: `Corda ${cor}`,
        tipo: 'corda',
        especificacao: 'Náutica 4mm',
        preco_custo: 4.00,
        unidade_medida: 'metro',
        estoque_atual: 100,
        estoque_minimo: 10,
        created_at: new Date().toISOString()
      }))
    ];

    // Insumos restantes extraídos de vendas/planilha/insumo.md (Embalagem, Metais, Resinas e Acabamentos)
    const insumosRestantes = [
      { id: 'i_plan_2', nome: 'Embalagem', tipo: 'embalagem', especificacao: 'Padrão', preco_custo: 3.00, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      
      // Metais
      { id: 'i_plan_3', nome: 'Tubo 19mm', tipo: 'metal', especificacao: 'Código: 660-5', preco_custo: 3.44, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_4', nome: 'PIRCING', tipo: 'metal', especificacao: 'Código: 345-7', preco_custo: 6.49, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_5', nome: 'Base Colar 119mm', tipo: 'metal', especificacao: 'Código: 1808-32', preco_custo: 11.40, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_6', nome: 'Pingente Red com Strass 40mm', tipo: 'metal', especificacao: 'Código: 584-22', preco_custo: 12.24, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_7', nome: 'Tubo 36mm', tipo: 'metal', especificacao: 'Código: PAIQ194-6', preco_custo: 5.69, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_8', nome: 'Pingente Coração', tipo: 'metal', especificacao: 'Código: 384-21', preco_custo: 5.64, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_9', nome: 'Base Organica Colar 102mm', tipo: 'metal', especificacao: 'Código: MOLC165-102', preco_custo: 16.20, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_10', nome: 'Passador 24mm', tipo: 'metal', especificacao: 'Código: 1254-22', preco_custo: 10.18, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_11', nome: 'Base Argola Brinco 35mm', tipo: 'metal', especificacao: 'Código: MOB179-34', preco_custo: 18.82, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_12', nome: 'Base Brinco 9,80mm', tipo: 'metal', especificacao: 'Código: MOB67-10', preco_custo: 5.80, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_13', nome: 'Passador 22mm', tipo: 'metal', especificacao: 'Código: 1255-22', preco_custo: 9.21, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_14', nome: 'Passador duplo 23mm', tipo: 'metal', especificacao: 'Código: 1147-21', preco_custo: 3.38, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      
      // Resina
      { id: 'i_plan_15', nome: 'GOTA', tipo: 'resina', especificacao: 'Padrão', preco_custo: 12.50, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_16', nome: 'BOLA OVAL', tipo: 'resina', especificacao: 'Padrão', preco_custo: 2.80, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_17', nome: 'ENTREMEIO CARIOC', tipo: 'resina', especificacao: 'Padrão', preco_custo: 8.90, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_18', nome: 'CASCALHO CARIOCA', tipo: 'resina', especificacao: 'Padrão', preco_custo: 3.25, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      
      // Acabamento
      { id: 'i_plan_19', nome: 'Cola', tipo: 'acabamento', especificacao: 'Código: CP4540', preco_custo: 1.00, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_20', nome: 'Mão de obra', tipo: 'acabamento', especificacao: 'Padrão', preco_custo: 10.00, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_21', nome: 'Pingente Strass 8mm', tipo: 'acabamento', especificacao: 'Código: 205-26', preco_custo: 1.07, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_22', nome: 'Terminal 21mm', tipo: 'acabamento', especificacao: 'Código: POIQ119-11', preco_custo: 4.38, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_23', nome: 'Corrente argola', tipo: 'acabamento', especificacao: 'Código: CR-65', preco_custo: 0.17, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_24', nome: 'Fech Lagosta 14mm', tipo: 'acabamento', especificacao: 'Código: FIM357-14', preco_custo: 3.04, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_25', nome: 'Corrente', tipo: 'acabamento', especificacao: 'Código: CR-436', preco_custo: 1.00, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_26', nome: 'Terminal 13mm', tipo: 'acabamento', especificacao: 'Código: 971-9', preco_custo: 3.46, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_27', nome: 'Terminal 30mm', tipo: 'acabamento', especificacao: 'Código: 293-24', preco_custo: 7.48, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_28', nome: 'Argola 13mm', tipo: 'acabamento', especificacao: 'Código: AR10-15', preco_custo: 0.43, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_29', nome: 'Caneca 20mm', tipo: 'acabamento', especificacao: 'Código: PGIR224-12', preco_custo: 3.78, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_30', nome: 'Chapa', tipo: 'acabamento', especificacao: 'Código: AC71-45', preco_custo: 0.74, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() },
      { id: 'i_plan_31', nome: 'Corrente Cartier', tipo: 'acabamento', especificacao: 'Código: CR-424', preco_custo: 0.27, unidade_medida: 'unidade', estoque_atual: 100, estoque_minimo: 10, created_at: new Date().toISOString() }
    ];

    const insumosPlanilha = [...insumosCordas, ...insumosRestantes];

    // Força a atualização dos insumos limpando versões antigas do banco local
    const DB_VERSION_KEY = 'site_semijoias_insumos_version';
    const VERSAO_ATUAL = 'v6';
    const versaoSalva = localStorage.getItem(DB_VERSION_KEY);

    if (versaoSalva !== VERSAO_ATUAL) {
      console.log(`Nova versão de banco de insumos detectada (${VERSAO_ATUAL}). Forçando atualização...`);
      this.setLocalData(LOCAL_KEYS.INSUMOS, insumosPlanilha);
      localStorage.setItem(DB_VERSION_KEY, VERSAO_ATUAL);
      insumosExistentes = insumosPlanilha;
    } else if (insumosExistentes.length === 0) {
      console.log("Semeando exclusivamente os insumos reais do arquivo insumo.md...");
      this.setLocalData(LOCAL_KEYS.INSUMOS, insumosPlanilha);
      localStorage.setItem(DB_VERSION_KEY, VERSAO_ATUAL);
      insumosExistentes = insumosPlanilha;
    }

    
    this.setLocalData(LOCAL_KEYS.PRODUTOS, produtosSeed);

    // CLIENTES DE TESTE (Histórico consolidado com os novos produtos)
    
    this.setLocalData(LOCAL_KEYS.CLIENTES, clientesSeed);

    // HISTÓRICO DE VENDAS REALISTAS BASEADAS NAS PEÇAS REAIS (Março, Abril e Maio de 2026)
    
    this.setLocalData(LOCAL_KEYS.VENDAS, vendasSeed);

    // Força a atualização/mesclagem dos dados locais (vendas e produtos de Maio)
    const DB_DATA_VERSION_KEY = 'site_semijoias_data_version';
    const DATA_VERSION_ATUAL = 'v4';
    const dataVersaoSalva = localStorage.getItem(DB_DATA_VERSION_KEY);

    if (dataVersaoSalva !== DATA_VERSION_ATUAL) {
      console.log(`Nova versão de dados detectada (${DATA_VERSION_ATUAL}). Atualizando base local...\n(Se necessário, limpe o cache do navegador ou LocalStorage para atualizar completamente)`);
      
      // Mesclar Produtos
      const prodsAtuais = this.getLocalData(LOCAL_KEYS.PRODUTOS);
      produtosSeed.forEach(seedProd => {
        const idx = prodsAtuais.findIndex(p => p.sku === seedProd.sku);
        if (idx !== -1) {
          prodsAtuais[idx] = { ...seedProd, estoque: prodsAtuais[idx].estoque };
        } else {
          prodsAtuais.push(seedProd);
        }
      });
      this.setLocalData(LOCAL_KEYS.PRODUTOS, prodsAtuais);

      // Sobrescrever Vendas para deixar apenas as importadas de Maio
      this.setLocalData(LOCAL_KEYS.VENDAS, vendasSeed);

      localStorage.setItem(DB_DATA_VERSION_KEY, DATA_VERSION_ATUAL);
      vendasExistentes = vendasSeed;
      produtosExistentes = prodsAtuais;
    }

    if (produtosExistentes.length > 0 || vendasExistentes.length > 0) {
      return;
    }

    console.log("Semeando banco de dados local com catálogo real Deu Nó e histórico financeiro...");

    // 17 PRODUTOS OFICIAIS DO CATÁLOGO DEU NÓ COM FOTOS REAIS
    

  }
};

// Executa a semeadura automática ao carregar o arquivo
DB.semearSeVazio();
// Inicializa conexão se as chaves do Supabase já estiverem salvas
DB.initSupabase();

// Garantir que o estoque do Brinco Bae seja 0 (indisponível) no banco local
try {
  const prods = DB.getLocalData(LOCAL_KEYS.PRODUTOS);
  if (prods && prods.length > 0) {
    const baeProd = prods.find(p => p.sku === 'BRI-BAE');
    if (baeProd && baeProd.estoque !== 0) {
      baeProd.estoque = 0;
      DB.setLocalData(LOCAL_KEYS.PRODUTOS, prods);
      console.log("Estoque do Brinco Bae atualizado para 0 (indisponível).");
    }
  }
} catch (e) {
  console.error("Erro ao migrar estoque do Brinco Bae:", e);
}
