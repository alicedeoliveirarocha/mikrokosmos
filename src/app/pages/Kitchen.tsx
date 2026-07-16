// src/app/pages/Kitchen.tsx
// FIX: o toast de "enviar para entrega" mostrava o slug cru "saiu-para-entrega"
// porque esse status não existia no statusConfig da cozinha. Agora há um mapa
// de labels que cobre TODOS os status possíveis, reaproveitando a chave
// delivery.status.onRoute que já existe nos 6 locales.
// FIX 2 (Lote 4): categoria do item traduzida via categories.* com fallback.
import { useState } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { RoleBanner } from '../components/RoleBanner';
import { useOrders, OrderStatus } from '../context/OrdersContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ChefHat, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Kitchen() {
  const { orders, updateOrderStatus } = useOrders();
  const { t, i18n } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pendente');

  const statusConfig = {
    pendente:   { label: t('kitchen.status.pending'),   icon: AlertCircle,   color: '#FFD700' },
    preparando: { label: t('kitchen.status.preparing'), icon: Clock,         color: '#FF9800' },
    pronto:     { label: t('kitchen.status.ready'),     icon: CheckCircle,   color: '#00FFFF' },
    cancelado:  { label: t('kitchen.status.cancelled'), icon: XCircle,       color: '#FF1744' },
  };

  // Labels para o toast — cobre também status que não são "da cozinha",
  // como 'saiu-para-entrega' (reusa a chave do namespace delivery) e 'entregue'.
  const statusLabels: Record<string, string> = {
    pendente: t('kitchen.status.pending'),
    preparando: t('kitchen.status.preparing'),
    pronto: t('kitchen.status.ready'),
    cancelado: t('kitchen.status.cancelled'),
    'saiu-para-entrega': t('delivery.status.onRoute'),
    entregue: t('delivery.status.delivered'),
  };

  const kitchenStatuses: OrderStatus[] = ['pendente', 'preparando', 'pronto', 'cancelado'];
  const filteredOrders = orders.filter(order => order.status === selectedStatus);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(t('kitchen.updated', { label: statusLabels[newStatus] || newStatus }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      'pt-BR': 'pt-BR', 'en': 'en-US', 'es': 'es-ES',
      'ko': 'ko-KR', 'ja': 'ja-JP', 'zh': 'zh-CN',
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
          role="cozinha"
          title={t('kitchen.bannerTitle')}
          description={t('kitchen.bannerDesc')}
        />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kitchenStatuses.map((status) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              const count = getStatusCount(status);
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
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                    <span className="text-2xl font-bold" style={{ color: config.color }}>{count}</span>
                  </div>
                  <p className="text-white text-sm font-medium">{config.label}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
              <p className="text-white/60 text-lg">
                {t('kitchen.noOrders', { status: statusConfig[selectedStatus].label.toLowerCase() })}
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
                    <h3 className="text-xl font-bold text-white mb-1">{t('kitchen.orderNumber')}{order.id.slice(-8)}</h3>
                    <p className="text-white/60 text-sm">{formatDate(order.createdAt || order.created_at)}</p>
                    {order.customerName || order.customer_name ? (
                      <p className="text-white/80 text-sm mt-1">
                        {t('kitchen.customer')} {order.customerName || order.customer_name}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right mt-3 md:mt-0">
                    <p className="text-3xl font-bold" style={{ color: 'var(--primary-neon)' }}>
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.product.nome}</p>
                        <p className="text-white/60 text-sm">{t(`categories.${item.product.categoria}`, { defaultValue: item.product.categoria })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">x{item.quantidade}</p>
                        <p className="text-white/60 text-sm">R$ {(item.product.preco * item.quantidade).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {(order.observacoes || order.notes) && (
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <p className="text-yellow-400 text-sm font-bold mb-1">📝 {t('kitchen.notes')}</p>
                    <p className="text-white/80 text-sm">{order.observacoes || order.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedStatus === 'pendente' && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'preparando')}
                      className="flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-black"
                      style={{ backgroundColor: '#FF9800' }}>
                      {t('kitchen.startPrep')}
                    </motion.button>
                  )}
                  {selectedStatus === 'preparando' && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'pronto')}
                      className="flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-black"
                      style={{ backgroundColor: 'var(--primary-neon)' }}>
                      {t('kitchen.markReady')}
                    </motion.button>
                  )}
                  {selectedStatus === 'pronto' && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'saiu-para-entrega')}
                      className="flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-black"
                      style={{ backgroundColor: '#4CAF50' }}>
                      {t('kitchen.sendDelivery')}
                    </motion.button>
                  )}
                  {selectedStatus !== 'cancelado' && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'cancelado')}
                      className="px-4 py-3 rounded-xl font-bold text-white bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 transition-all">
                      {t('kitchen.cancel')}
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