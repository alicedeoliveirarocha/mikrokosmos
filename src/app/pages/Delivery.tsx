import { useState } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { RoleBanner } from '../components/RoleBanner';
import { DeliveryMap } from '../components/DeliveryMap';
import { useOrders, OrderStatus } from '../context/OrdersContext';
import { motion, AnimatePresence } from 'motion/react';
import { Bike, MapPin, Package, CheckCircle, Navigation, X, Map } from 'lucide-react';
import { toast } from 'sonner';

export function Delivery() {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('saiu-para-entrega');
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);

  const statusConfig = {
    'saiu-para-entrega': { label: 'Em Entrega', icon: Navigation, color: '#FF9800' },
    'entregue': { label: 'Entregues', icon: CheckCircle, color: '#4CAF50' },
  };

  const deliveryStatuses: OrderStatus[] = ['saiu-para-entrega', 'entregue'];
  const filteredOrders = orders.filter(order => order.status === selectedStatus);

  // Também mostrar pedidos prontos que ainda não saíram para entrega
  const readyOrders = orders.filter(order => order.status === 'pronto');

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Pedido atualizado: ${statusConfig[newStatus]?.label || newStatus}`);
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
          role="delivery"
          title="Delivery"
          description="Painel do Motoboy - Gerencie entregas e confirme recebimentos"
        />

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Filtros de Status */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* Pedidos Prontos para Retirar */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStatus('pronto')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedStatus === 'pronto'
                  ? 'bg-white/10 border-white/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Package className="w-5 h-5" style={{ color: '#00FFFF' }} />
                <span
                  className="text-2xl font-bold"
                  style={{ color: '#00FFFF' }}
                >
                  {readyOrders.length}
                </span>
              </div>
              <p className="text-white text-sm font-medium">Prontos</p>
            </motion.button>

            {deliveryStatuses.map((status) => {
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
          {/* Pedidos Prontos */}
          {selectedStatus === 'pronto' && (
            <>
              {readyOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center"
                >
                  <p className="text-white/60 text-lg">Nenhum pedido pronto para retirada</p>
                </motion.div>
              ) : (
                readyOrders.map((order, index) => (
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

                    {/* Informações de Entrega */}
                    {order.customerName && (
                      <div className="mb-4 space-y-2">
                        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                          <MapPin className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-neon)' }} />
                          <div>
                            <p className="text-white font-medium">{order.customerName}</p>
                            {order.customerPhone && (
                              <p className="text-white/60 text-sm">📱 {order.customerPhone}</p>
                            )}
                            {order.customerAddress && (
                              <p className="text-white/80 text-sm mt-1">{order.customerAddress}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Itens do Pedido */}
                    <div className="space-y-2 mb-4">
                      <p className="text-white/60 text-sm font-medium">Itens ({order.items.length}):</p>
                      {order.items.map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex justify-between items-center p-2 bg-white/5 rounded-lg"
                        >
                          <p className="text-white text-sm">{item.product.nome}</p>
                          <p className="text-white/80 text-sm font-bold">x{item.quantidade}</p>
                        </div>
                      ))}
                    </div>

                    {/* Ação */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'saiu-para-entrega')}
                      className="w-full px-4 py-4 rounded-xl font-bold text-black"
                      style={{ 
                        backgroundColor: '#FF9800',
                        boxShadow: '0 10px 30px rgba(255, 152, 0, 0.3)'
                      }}
                    >
                      🚀 Retirar Pedido
                    </motion.button>
                  </motion.div>
                ))
              )}
            </>
          )}

          {/* Pedidos em Entrega ou Entregues */}
          {selectedStatus !== 'pronto' && (
            <>
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center"
                >
                  <p className="text-white/60 text-lg">
                    Nenhum pedido {statusConfig[selectedStatus]?.label.toLowerCase()}
                  </p>
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

                    {/* Informações de Entrega */}
                    {order.customerName && (
                      <div className="mb-4 p-3 bg-white/5 rounded-xl">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-neon)' }} />
                          <div>
                            <p className="text-white font-medium">{order.customerName}</p>
                            {order.customerPhone && (
                              <p className="text-white/60 text-sm">📱 {order.customerPhone}</p>
                            )}
                            {order.customerAddress && (
                              <p className="text-white/80 text-sm mt-1">{order.customerAddress}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ações */}
                    {selectedStatus === 'saiu-para-entrega' && (
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setTrackingOrder(order.id)}
                          className="px-4 py-4 rounded-xl font-bold text-white border-2 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                          style={{
                            borderColor: '#00FFFF',
                          }}
                        >
                          <Map className="w-5 h-5" />
                          Track
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStatusChange(order.id, 'entregue')}
                          className="px-4 py-4 rounded-xl font-bold text-black"
                          style={{
                            backgroundColor: '#4CAF50',
                            boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)'
                          }}
                        >
                          ✅ Confirmar
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </>
          )}
        </div>
      </main>

      {/* Fullscreen Delivery Tracking Map */}
      <AnimatePresence>
        {trackingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
            onClick={() => setTrackingOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute inset-4 md:inset-8 rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTrackingOrder(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </motion.button>

              {/* Map component */}
              {(() => {
                const order = orders.find(o => o.id === trackingOrder);
                if (!order) return null;

                return (
                  <DeliveryMap
                    orderId={order.id.slice(-8)}
                    customerName={order.customerName || 'Cliente'}
                    customerAddress={order.customerAddress || 'Endereço não informado'}
                    customerPhone={order.customerPhone}
                    estimatedTime="15-20 min"
                    status="on-route"
                  />
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UniverseToggle />
    </div>
  );
}
