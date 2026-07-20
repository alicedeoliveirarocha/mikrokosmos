// src/app/pages/OrderTracking.tsx
import { useState } from 'react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { DeliveryMap } from '../components/DeliveryMap';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Package, CheckCircle, Navigation, X, Map, Clock, ChefHat, Bike } from 'lucide-react';
import { useCurrency } from '../../lib/currency';

export function OrderTracking() {
  const { orders } = useOrders();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { format } = useCurrency(); // FIX moeda: total do pedido na moeda do idioma ativo
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);

  const myOrders = orders.filter(o =>
    o.user_id === user?.id || o.customer_name === user?.nome
  );

  const statusConfig = {
    'pendente':          { labelKey: 'orders.status.pending',    icon: Clock,       color: '#FF9800', emoji: '⏳' },
    'preparando':        { labelKey: 'orders.status.preparing',   icon: ChefHat,     color: '#00FFFF', emoji: '👨‍🍳' },
    'pronto':            { labelKey: 'orders.status.ready',       icon: Package,     color: '#9C27B0', emoji: '✅' },
    'saiu-para-entrega': { labelKey: 'orders.status.onTheWay',    icon: Bike,        color: '#FF6B35', emoji: '🛵' },
    'entregue':          { labelKey: 'orders.status.delivered',   icon: CheckCircle, color: '#4CAF50', emoji: '🎉' },
    'cancelado':         { labelKey: 'orders.status.cancelled',   icon: X,           color: '#f44336', emoji: '❌' },
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString.replace(' ', 'T'));
    const localeMap: Record<string, string> = {
      'pt-BR': 'pt-BR', 'en': 'en-US', 'es': 'es-ES',
      'ko': 'ko-KR', 'ja': 'ja-JP', 'zh': 'zh-CN',
    };
    const locale = localeMap[i18n.language] || 'pt-BR';
    return date.toLocaleString(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  if (myOrders.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Package className="w-24 h-24 mx-auto mb-6 text-white/20" />
            <h2 className="text-3xl font-bold text-white mb-4">{t('orders.empty')}</h2>
            <p className="text-white/60 mb-8">{t('orders.emptyDesc')}</p>
          </motion.div>
        </div>
        <UniverseToggle />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8"
        >
          {t('orders.title')}
        </motion.h1>

        <div className="space-y-4">
          {myOrders.map((order, index) => {
            const config = statusConfig[order.status] || statusConfig['pendente'];
            const Icon = config.icon;
            const canTrack = order.status === 'saiu-para-entrega';

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white">{t('orders.orderNumber')}#{order.id.slice(-8)}</h3>
                    <p className="text-white/40 text-sm">{formatDate(order.created_at)}</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--primary-neon)' }}>
                    {format(order.total)}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl"
                  style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}40` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">{t('orders.statusLabel')}</p>
                    <p className="font-bold text-white">{config.emoji} {t(config.labelKey)}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-1 mb-4">
                  {['pendente', 'preparando', 'pronto', 'saiu-para-entrega', 'entregue'].map((s, i) => {
                    const statuses = ['pendente', 'preparando', 'pronto', 'saiu-para-entrega', 'entregue'];
                    const currentIndex = statuses.indexOf(order.status);
                    const isActive = i <= currentIndex && order.status !== 'cancelado';
                    return (
                      <div key={s} className="flex-1 h-2 rounded-full transition-all"
                        style={{ backgroundColor: isActive ? config.color : 'rgba(255,255,255,0.1)' }} />
                    );
                  })}
                </div>

                {/* Itens */}
                <div className="space-y-1 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.product.nome}</span>
                      <span className="text-white/50">x{item.quantidade}</span>
                    </div>
                  ))}
                </div>

                {/* Botão Track */}
                {canTrack && (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setTrackingOrder(order.id)}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-black"
                    style={{ backgroundColor: '#FF6B35', boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)' }}
                  >
                    <Map className="w-5 h-5" />
                    {t('orders.trackDriver')}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Fullscreen Map */}
      <AnimatePresence>
        {trackingOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
            onClick={() => setTrackingOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute inset-4 md:inset-8 rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* O X antigo morava AQUI e foi removido de propósito:
                  ele era z-10 e vinha antes do DeliveryMap no DOM, então os
                  elementos internos do mapa pintavam por cima — no celular o
                  card do ETA (largura total) cobria o X e o cliente ficava
                  preso. Agora o X vive DENTRO do DeliveryMap (via onClose),
                  com z-30, visível nos dois modos e em qualquer tela. */}
              {(() => {
                const order = orders.find(o => o.id === trackingOrder);
                if (!order) return null;
                return (
                  <DeliveryMap
                    /* BUG RESOLVIDO: passava order.id.slice(-8) e o DeliveryMap
                       nunca achava o pedido no orders → sem Realtime (rota
                       escolhida, GPS, chip de percurso) justamente na tela do
                       cliente. Agora vai o id COMPLETO; o nº curto (#8c612c8a)
                       continua aparecendo porque o card interno abrevia na
                       exibição. */
                    orderId={order.id}
                    customerName={order.customer_name || t('orders.you')}
                    customerAddress={order.customer_address || t('orders.yourAddress')}
                    customerPhone={order.customer_phone}
                    estimatedTime="15-20 min"
                    status="on-route"
                    onClose={() => setTrackingOrder(null)}
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