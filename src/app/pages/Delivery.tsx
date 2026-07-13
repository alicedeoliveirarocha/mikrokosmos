// src/app/pages/Delivery.tsx
import { useState } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { RoleBanner } from '../components/RoleBanner';
import { DeliveryMap } from '../components/DeliveryMap';
import { useOrders, OrderStatus } from '../context/OrdersContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Package, CheckCircle, X, Map, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function Delivery() {
  const { orders, updateOrderStatus } = useOrders();
  const { t, i18n } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('saiu-para-entrega');
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);

  const readyOrders = orders.filter(order => order.status === 'pronto');
  const filteredOrders = orders.filter(order => order.status === selectedStatus);

  const onRouteLabel = t('delivery.status.onRoute');
  const deliveredLabel = t('delivery.status.delivered');

  const statusConfig: Record<string, { label: string; icon: typeof Navigation; color: string }> = {
    'saiu-para-entrega': { label: onRouteLabel, icon: Navigation, color: '#FF9800' },
    entregue: { label: deliveredLabel, icon: CheckCircle, color: '#4CAF50' },
  };

  const deliveryStatuses: OrderStatus[] = ['saiu-para-entrega', 'entregue'];

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    const cfg = statusConfig[newStatus];
    toast.success(t('delivery.updated', { label: cfg ? cfg.label : newStatus }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      'pt-BR': 'pt-BR', en: 'en-US', es: 'es-ES',
      ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-CN',
    };
    return date.toLocaleString(localeMap[i18n.language] || 'pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  };

  const getStatusCount = (status: OrderStatus) =>
    orders.filter(order => order.status === status).length;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <RoleBanner
          role="delivery"
          title={t('delivery.bannerTitle')}
          description={t('delivery.bannerDesc')}
        />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* Prontos para retirar */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStatus('pronto')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedStatus === 'pronto' ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Package className="w-5 h-5" style={{ color: '#00FFFF' }} />
                <span className="text-2xl font-bold" style={{ color: '#00FFFF' }}>{readyOrders.length}</span>
              </div>
              <p className="text-white text-sm font-medium">{t('delivery.status.ready')}</p>
            </motion.button>

            {deliveryStatuses.map((status) => {
              const cfg = statusConfig[status];
              if (!cfg) return null;
              const Icon = cfg.icon;
              return (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStatus(status)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedStatus === status ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                    <span className="text-2xl font-bold" style={{ color: cfg.color }}>{getStatusCount(status)}</span>
                  </div>
                  <p className="text-white text-sm font-medium">{cfg.label}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div className="space-y-4">
          {/* Pedidos prontos */}
          {selectedStatus === 'pronto' && (
            readyOrders.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
                <p className="text-white/60 text-lg">{t('delivery.noReadyOrders')}</p>
              </motion.div>
            ) : (
              readyOrders.map((order, index) => (
                <motion.div key={order.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{t('delivery.orderNumber')}{order.id.slice(-8)}</h3>
                      <p className="text-white/60 text-sm">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right mt-3 md:mt-0">
                      <p className="text-3xl font-bold" style={{ color: 'var(--primary-neon)' }}>
                        R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {order.customer_name && (
                    <div className="mb-4 space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                        <MapPin className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-neon)' }} />
                        <div>
                          <p className="text-white font-medium">{order.customer_name}</p>
                          {order.customer_phone && (
                            <p className="text-white/60 text-sm">📱 {order.customer_phone}</p>
                          )}
                          {order.customer_address && (
                            <p className="text-white/80 text-sm mt-1">{order.customer_address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <p className="text-white/60 text-sm font-medium">{t('delivery.items', { count: order.items.length })}</p>
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <p className="text-white text-sm">{item.product.nome}</p>
                        <p className="text-white/80 text-sm font-bold">x{item.quantidade}</p>
                      </div>
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusChange(order.id, 'saiu-para-entrega')}
                    className="w-full px-4 py-4 rounded-xl font-bold text-black"
                    style={{ backgroundColor: '#FF9800', boxShadow: '0 10px 30px rgba(255,152,0,0.3)' }}>
                    {t('delivery.pickupOrder')}
                  </motion.button>
                </motion.div>
              ))
            )
          )}

          {/* Pedidos em entrega ou entregues */}
          {selectedStatus !== 'pronto' && (
            filteredOrders.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
                <p className="text-white/60 text-lg">
                  {t('delivery.noOrders', { status: statusConfig[selectedStatus]?.label?.toLowerCase() ?? '' })}
                </p>
              </motion.div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div key={order.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{t('delivery.orderNumber')}{order.id.slice(-8)}</h3>
                      <p className="text-white/60 text-sm">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right mt-3 md:mt-0">
                      <p className="text-3xl font-bold" style={{ color: 'var(--primary-neon)' }}>
                        R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {order.customer_name && (
                    <div className="mb-4 p-3 bg-white/5 rounded-xl">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-neon)' }} />
                        <div>
                          <p className="text-white font-medium">{order.customer_name}</p>
                          {order.customer_phone && (
                            <p className="text-white/60 text-sm">📱 {order.customer_phone}</p>
                          )}
                          {order.customer_address && (
                            <p className="text-white/80 text-sm mt-1">{order.customer_address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedStatus === 'saiu-para-entrega' && (
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setTrackingOrder(order.id)}
                        className="px-4 py-4 rounded-xl font-bold text-white border-2 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        style={{ borderColor: '#00FFFF' }}>
                        <Map className="w-5 h-5" />
                        {t('delivery.track')}
                      </motion.button>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusChange(order.id, 'entregue')}
                        className="px-4 py-4 rounded-xl font-bold text-black"
                        style={{ backgroundColor: '#4CAF50', boxShadow: '0 10px 30px rgba(76,175,80,0.3)' }}>
                        {t('delivery.confirm')}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))
            )
          )}
        </div>
      </main>

      <AnimatePresence>
        {trackingOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
            onClick={() => setTrackingOrder(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute inset-4 md:inset-8 rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                onClick={() => setTrackingOrder(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </motion.button>
              {(() => {
                const order = orders.find(o => o.id === trackingOrder);
                if (!order) return null;
                return (
                  <DeliveryMap
                    orderId={order.id.slice(-8)}
                    customerName={order.customer_name || t('delivery.defaultCustomer')}
                    customerAddress={order.customer_address || t('delivery.defaultAddress')}
                    customerPhone={order.customer_phone}
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