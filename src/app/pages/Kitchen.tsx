import { useState } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { RoleBanner } from '../components/RoleBanner';
import { useOrders, OrderStatus } from '../context/OrdersContext';
import { motion } from 'motion/react';
import { ChefHat, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Kitchen() {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pendente');

  const statusConfig = {
    pendente: { label: 'Pendentes', icon: AlertCircle, color: '#FFD700' },
    preparando: { label: 'Em Preparo', icon: Clock, color: '#FF9800' },
    pronto: { label: 'Prontos', icon: CheckCircle, color: '#00FFFF' },
    cancelado: { label: 'Cancelados', icon: XCircle, color: '#FF1744' },
  };

  const kitchenStatuses: OrderStatus[] = ['pendente', 'preparando', 'pronto', 'cancelado'];
  const filteredOrders = orders.filter(order => order.status === selectedStatus);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Pedido atualizado para: ${statusConfig[newStatus]?.label || newStatus}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusCount = (status: OrderStatus) => {
    return orders.filter(order => order.status === status).length;
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {/* Banner de Papel */}
        <RoleBanner
          role="cozinha"
          title="Cozinha"
          description="Painel de Controle de Pedidos - Gerencie e acompanhe todos os pedidos"
        />

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Filtros de Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kitchenStatuses.map((status) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              const count = getStatusCount(status);

              return (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStatus(status)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedStatus === status
                      ? 'bg-white/10 border-white/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                    <span
                      className="text-2xl font-bold"
                      style={{ color: config.color }}
                    >
                      {count}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium">{config.label}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center"
            >
              <p className="text-white/60 text-lg">Nenhum pedido {statusConfig[selectedStatus].label.toLowerCase()}</p>
            </motion.div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
              >
                {/* Cabeçalho do Pedido */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Pedido #{order.id.slice(-8)}</h3>
                    <p className="text-white/60 text-sm">{formatDate(order.createdAt)}</p>
                    {order.customerName && (
                      <p className="text-white/80 text-sm mt-1">Cliente: {order.customerName}</p>
                    )}
                  </div>
                  <div className="text-right mt-3 md:mt-0">
                    <p 
                      className="text-3xl font-bold"
                      style={{ color: 'var(--primary-neon)' }}
                    >
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.product.nome}</p>
                        <p className="text-white/60 text-sm">{item.product.categoria}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">x{item.quantidade}</p>
                        <p className="text-white/60 text-sm">
                          R$ {(item.product.preco * item.quantidade).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Observações */}
                {order.observacoes && (
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <p className="text-yellow-400 text-sm font-bold mb-1">📝 Observações:</p>
                    <p className="text-white/80 text-sm">{order.observacoes}</p>
                  </div>
                )}

                {/* Ações */}
                <div className="flex flex-wrap gap-2">
                  {selectedStatus === 'pendente' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'preparando')}
                      className="flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-black"
                      style={{ backgroundColor: '#FF9800' }}
                    >
                      Iniciar Preparo
                    </motion.button>
                  )}
                  
                  {selectedStatus === 'preparando' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'pronto')}
                      className="flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-black"
                      style={{ backgroundColor: 'var(--primary-neon)' }}
                    >
                      Marcar como Pronto
                    </motion.button>
                  )}

                  {selectedStatus === 'pronto' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'saiu-para-entrega')}
                      className="flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-black"
                      style={{ backgroundColor: '#4CAF50' }}
                    >
                      Enviar para Entrega
                    </motion.button>
                  )}

                  {selectedStatus !== 'cancelado' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'cancelado')}
                      className="px-4 py-3 rounded-xl font-bold text-white bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 transition-all"
                    >
                      Cancelar
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      <UniverseToggle />
    </div>
  );
}
