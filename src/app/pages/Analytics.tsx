import { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { RoleBanner } from '../components/RoleBanner';
import { useOrders } from '../context/OrdersContext';
import { products } from '../data/products';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, ShoppingCart, Package, BarChart3, PieChart, Download } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar, PieChart as RePieChart, Pie, Legend } from 'recharts';

export function Analytics() {
  const { orders } = useOrders();
  const [selectedPeriod, setSelectedPeriod] = useState<'hoje' | 'semana' | 'mes' | 'tudo'>('tudo');

  // Calcular métricas gerais
  const completedOrders = orders.filter(o => o.status === 'entregue');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = completedOrders.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calcular vendas por produto
  const productSales = new Map<string, { quantity: number; revenue: number }>();
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      const current = productSales.get(item.product.id) || { quantity: 0, revenue: 0 };
      productSales.set(item.product.id, {
        quantity: current.quantity + item.quantidade,
        revenue: current.revenue + (item.product.preco * item.quantidade),
      });
    });
  });

  // Dados para Matriz BCG - memorizado para evitar recalculos
  // Eixo X: Participação de Mercado Relativa (% de vendas do produto / média de vendas)
  // Eixo Y: Taxa de Crescimento (simulado baseado em vendas recentes)
  const bcgData = useMemo(() => {
    const totalProductRevenue = Array.from(productSales.values()).reduce((sum, p) => sum + p.revenue, 0);
    const avgProductRevenue = totalProductRevenue / productSales.size || 1;

    // Função para gerar um número pseudo-aleatório baseado em uma string (seed)
    const seededRandom = (seed: string) => {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash % 100);
    };

    return products.map(product => {
      const sales = productSales.get(product.id) || { quantity: 0, revenue: 0 };
      const marketShare = (sales.revenue / avgProductRevenue) * 100; // Participação relativa
      const growthRate = seededRandom(product.id); // Simulado entre 0-100% (estável)

      let category = '';
      let color = '';

      if (marketShare > 100 && growthRate > 50) {
        category = '⭐ Estrela';
        color = '#FFD700'; // Dourado
      } else if (marketShare > 100 && growthRate <= 50) {
        category = '🐄 Vaca Leiteira';
        color = '#4CAF50'; // Verde
      } else if (marketShare <= 100 && growthRate > 50) {
        category = '❓ Interrogação';
        color = '#FF9800'; // Laranja
      } else {
        category = '🐶 Abacaxi';
        color = '#F44336'; // Vermelho
      }

      return {
        id: product.id,
        name: product.nome,
        x: marketShare,
        y: growthRate,
        z: sales.revenue,
        category,
        color,
        quantity: sales.quantity,
        revenue: sales.revenue,
      };
    });
  }, [productSales]);

  // Categorias BCG
  const bcgCategories = [
    { name: '⭐ Estrelas', count: bcgData.filter(p => p.category === '⭐ Estrela').length, color: '#FFD700', desc: 'Alto crescimento + Alta participação' },
    { name: '🐄 Vacas Leiteiras', count: bcgData.filter(p => p.category === '🐄 Vaca Leiteira').length, color: '#4CAF50', desc: 'Baixo crescimento + Alta participação' },
    { name: '❓ Interrogações', count: bcgData.filter(p => p.category === '❓ Interrogação').length, color: '#FF9800', desc: 'Alto crescimento + Baixa participação' },
    { name: '🐶 Abacaxis', count: bcgData.filter(p => p.category === '🐶 Abacaxi').length, color: '#F44336', desc: 'Baixo crescimento + Baixa participação' },
  ];

  // Top 5 produtos mais vendidos
  const topProducts = products
    .map(product => ({
      ...product,
      sales: productSales.get(product.id) || { quantity: 0, revenue: 0 },
    }))
    .sort((a, b) => b.sales.revenue - a.sales.revenue)
    .slice(0, 5);

  // Vendas por categoria - memorizado
  const categoryData = useMemo(() => {
    const categorySales = new Map<string, number>();
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const current = categorySales.get(item.product.categoria) || 0;
        categorySales.set(item.product.categoria, current + (item.product.preco * item.quantidade));
      });
    });

    return Array.from(categorySales.entries())
      .filter(([name, value]) => name && value > 0)
      .map(([name, value], index) => ({
        id: `cat-${name}-${index}`,
        name,
        value,
      }));
  }, [completedOrders]);

  // Vendas por universo - memorizado
  const universeData = useMemo(() => {
    const universeSales = new Map<string, number>();
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const universo = item.product.universo === 'both' ? 'Todos' : item.product.universo;
        const current = universeSales.get(universo) || 0;
        universeSales.set(universo, current + (item.product.preco * item.quantidade));
      });
    });

    const nameMap: Record<string, string> = {
      'aespa': 'aespa',
      'bts': 'BTS',
      'blackpink': 'BLACKPINK',
      'enhypen': 'ENHYPEN',
      'redvelvet': 'Red Velvet',
      'starwars': 'Star Wars',
      'marvel': 'Marvel',
      'Todos': 'Todos'
    };

    return Array.from(universeSales.entries())
      .filter(([name, value]) => name && value > 0)
      .map(([name, value], index) => ({
        id: `univ-${name}-${index}`,
        name: nameMap[name] || name,
        value,
      }));
  }, [completedOrders]);

  // Status de pedidos
  const ordersByStatus = {
    pendente: orders.filter(o => o.status === 'pendente').length,
    preparando: orders.filter(o => o.status === 'preparando').length,
    pronto: orders.filter(o => o.status === 'pronto').length,
    'saiu-para-entrega': orders.filter(o => o.status === 'saiu-para-entrega').length,
    entregue: orders.filter(o => o.status === 'entregue').length,
    cancelado: orders.filter(o => o.status === 'cancelado').length,
  };

  const COLORS = useMemo(() => ['#00FFFF', '#9D00FF', '#FF006E', '#FFD700', '#4CAF50', '#FF5722', '#2196F3'], []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 p-3 rounded-xl">
          <p className="text-white font-bold mb-1">{data.name}</p>
          <p className="text-white/60 text-sm">Vendidas: {data.quantity}</p>
          <p className="text-white/60 text-sm">Receita: R$ {data.revenue.toFixed(2)}</p>
          <p className="text-white/60 text-sm">Categoria: {data.category}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {/* Banner de Papel */}
        <RoleBanner
          role="admin"
          title="Analytics & Dashboard"
          description="Painel Administrativo - Visualize métricas, análises e relatórios completos"
        />

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-6">
            <div
              className="hidden w-16 h-16 rounded-full items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, var(--gradient-from), var(--gradient-to))`,
                boxShadow: '0 10px 40px rgba(0, 255, 255, 0.4)'
              }}
            >
              <BarChart3 className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white neon-text">Analytics & BCG</h1>
              <p className="text-white/60">Matriz BCG e Relatórios de Desempenho</p>
            </div>
          </div>

          {/* Filtro de Período */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['hoje', 'semana', 'mes', 'tudo'] as const).map((period) => (
              <motion.button
                key={period}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedPeriod === period
                    ? 'bg-white/20 text-white border-2 border-white/30'
                    : 'bg-white/5 text-white/60 border border-white/10'
                }`}
              >
                {period === 'hoje' ? 'Hoje' : period === 'semana' ? 'Esta Semana' : period === 'mes' ? 'Este Mês' : 'Tudo'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-white/60 text-sm mb-1">Receita Total</p>
            <p className="text-3xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-white/60 text-sm mb-1">Pedidos Concluídos</p>
            <p className="text-3xl font-bold text-white">{totalOrders}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-white/60 text-sm mb-1">Ticket Médio</p>
            <p className="text-3xl font-bold text-white">R$ {averageTicket.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-neon-20)' }}
              >
                <PieChart className="w-6 h-6" style={{ color: 'var(--primary-neon)' }} />
              </div>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary-neon)' }} />
            </div>
            <p className="text-white/60 text-sm mb-1">Produtos Vendidos</p>
            <p className="text-3xl font-bold text-white">{productSales.size}</p>
          </motion.div>
        </div>

        {/* Matriz BCG */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Matriz BCG</h2>
              <p className="text-white/60 text-sm">Boston Consulting Group - Análise de Portfólio</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center gap-2 hover:bg-white/20 transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar
            </motion.button>
          </div>

          {/* Legenda BCG */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {bcgCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <p className="text-white font-medium text-sm">{cat.name}</p>
                </div>
                <p className="text-white/60 text-xs mb-1">{cat.desc}</p>
                <p className="text-white font-bold">{cat.count} produtos</p>
              </div>
            ))}
          </div>

          {/* Gráfico de Dispersão BCG */}
          <div className="bg-black/30 rounded-2xl p-4">
            {bcgData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Participação de Mercado (%)"
                    stroke="#fff"
                    tick={{ fill: '#fff' }}
                    label={{ value: 'Participação de Mercado Relativa (%)', position: 'insideBottom', offset: -10, fill: '#fff' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Taxa de Crescimento (%)"
                    stroke="#fff"
                    tick={{ fill: '#fff' }}
                    label={{ value: 'Taxa de Crescimento (%)', angle: -90, position: 'insideLeft', fill: '#fff' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter
                    name="⭐ Estrelas"
                    data={bcgData.filter(d => d.category === '⭐ Estrela')}
                    fill="#FFD700"
                  />
                  <Scatter
                    name="🐄 Vacas Leiteiras"
                    data={bcgData.filter(d => d.category === '🐄 Vaca Leiteira')}
                    fill="#4CAF50"
                  />
                  <Scatter
                    name="❓ Interrogações"
                    data={bcgData.filter(d => d.category === '❓ Interrogação')}
                    fill="#FF9800"
                  />
                  <Scatter
                    name="🐶 Abacaxis"
                    data={bcgData.filter(d => d.category === '🐶 Abacaxi')}
                    fill="#F44336"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-white/60">
                Sem dados para exibir
              </div>
            )}
          </div>

          {/* Linha divisória 50/50 */}
          <p className="text-white/40 text-xs text-center mt-4">
            Divisão: Eixo Y (50%) = Alto/Baixo Crescimento | Eixo X (100%) = Alta/Baixa Participação
          </p>
        </motion.div>

        {/* Top 5 Produtos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">🏆 Top 5 Produtos Mais Vendidos</h2>
          
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{ 
                    backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--primary-neon-20)',
                    color: index < 3 ? '#000' : 'var(--primary-neon)'
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold">{product.nome}</p>
                  <p className="text-white/60 text-sm">{product.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{product.sales.quantity} vendas</p>
                  <p className="text-white/60 text-sm">R$ {product.sales.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gráficos de Vendas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Vendas por Categoria */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Vendas por Categoria</h2>
            
            <div className="bg-black/30 rounded-2xl p-4">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#fff" tick={{ fill: '#fff', fontSize: 12 }} />
                    <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px'
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="var(--primary-neon)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/60">
                  Sem dados para exibir
                </div>
              )}
            </div>
          </motion.div>

          {/* Vendas por Universo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Vendas por Eras & Sagas</h2>
            
            <div className="bg-black/30 rounded-2xl p-4">
              {universeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={universeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {universeData.map((entry, index) => (
                        <Cell
                          key={entry.id}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ color: '#fff' }} />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/60">
                  Sem dados para exibir
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Status de Pedidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">📊 Status dos Pedidos</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-400 text-sm mb-1">⏳ Pendente</p>
              <p className="text-white text-2xl font-bold">{ordersByStatus.pendente}</p>
            </div>
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <p className="text-orange-400 text-sm mb-1">🔥 Preparando</p>
              <p className="text-white text-2xl font-bold">{ordersByStatus.preparando}</p>
            </div>
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <p className="text-cyan-400 text-sm mb-1">✅ Pronto</p>
              <p className="text-white text-2xl font-bold">{ordersByStatus.pronto}</p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-blue-400 text-sm mb-1">🚀 Em Entrega</p>
              <p className="text-white text-2xl font-bold">{ordersByStatus['saiu-para-entrega']}</p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-green-400 text-sm mb-1">🎉 Entregue</p>
              <p className="text-white text-2xl font-bold">{ordersByStatus.entregue}</p>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm mb-1">❌ Cancelado</p>
              <p className="text-white text-2xl font-bold">{ordersByStatus.cancelado}</p>
            </div>
          </div>
        </motion.div>

        {/* Resumo Executivo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">📝 Resumo Executivo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white/80">Total de Pedidos:</span>
                <span className="text-white font-bold text-lg">{orders.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white/80">Taxa de Conclusão:</span>
                <span className="text-green-400 font-bold text-lg">
                  {orders.length > 0 ? ((completedOrders.length / orders.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white/80">Taxa de Cancelamento:</span>
                <span className="text-red-400 font-bold text-lg">
                  {orders.length > 0 ? ((ordersByStatus.cancelado / orders.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white/80">Categoria Mais Vendida:</span>
                <span className="text-white font-bold text-lg">
                  {categoryData.length > 0 
                    ? categoryData.reduce((max, cat) => cat.value > max.value ? cat : max).name 
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white/80">Universo Mais Popular:</span>
                <span className="text-white font-bold text-lg">
                  {universeData.length > 0 
                    ? universeData.reduce((max, u) => u.value > max.value ? u : max).name 
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-white/80">Pedidos Ativos:</span>
                <span className="text-white font-bold text-lg">
                  {ordersByStatus.pendente + ordersByStatus.preparando + ordersByStatus.pronto + ordersByStatus['saiu-para-entrega']}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <UniverseToggle />
    </div>
  );
}