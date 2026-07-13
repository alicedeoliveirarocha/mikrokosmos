// src/app/components/Header.tsx
import { ShoppingCart, ArrowLeft, Info, GraduationCap, User, ChefHat, Bike, BarChart3, Film, Sparkles, MoreVertical } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useUniverse } from '../context/UniverseContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { orders } = useOrders();
  const { categoria } = useUniverse();
  const { t } = useTranslation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isHome = location.pathname === '/home';
  const isCinema = location.pathname === '/cinema';
  const isCinemaMode = categoria === 'Cinema';
  const isKpopMode = categoria === 'Kpop';

  const isAdmin = user?.role === 'admin';
  const isCozinha = user?.role === 'cozinha' || isAdmin;
  const isDelivery = user?.role === 'delivery' || isAdmin;

  const pendingOrders = orders.filter(o => ['pendente', 'preparando'].includes(o.status)).length;
  const deliveryOrders = orders.filter(o => ['pronto', 'saiu-para-entrega'].includes(o.status)).length;

  const moreItems: {
    key: string; label: string; icon: typeof Info; path: string; badge?: number; show: boolean;
  }[] = [
    { key: 'analytics', label: t('nav.analytics'), icon: BarChart3,    path: '/analytics', show: isAdmin },
    { key: 'cozinha',   label: t('nav.kitchen'),    icon: ChefHat,     path: '/cozinha',   show: isCozinha, badge: pendingOrders },
    { key: 'delivery',  label: t('nav.delivery'),   icon: Bike,        path: '/delivery',  show: isDelivery, badge: deliveryOrders },
    { key: 'learning',  label: t('nav.learning'),   icon: GraduationCap, path: '/learning', show: true },
    { key: 'info',      label: t('nav.info'),       icon: Info,        path: '/info',      show: true },
  ].filter(i => i.show);

  // Tamanho dos botões — bem menor no celular, cresce a partir de sm:
  const btnSize = 'w-8 h-8 sm:w-9 sm:h-9';
  const iconSize = 'w-3.5 h-3.5 sm:w-4 sm:h-4';

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/20">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">

          {/* Esquerda: botão voltar + logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            {!isHome && !isCinema && (
              <button
                onClick={() => navigate(-1)}
                className={`${btnSize} flex-shrink-0 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors`}
              >
                <ArrowLeft className={iconSize} />
              </button>
            )}
            <div onClick={() => navigate('/home')} className="cursor-pointer min-w-0 flex-shrink">
              <h1 className={`text-sm sm:text-2xl md:text-3xl font-bold tracking-normal sm:tracking-[0.2em] md:tracking-[0.3em] text-white neon-text leading-tight whitespace-nowrap ${isCinemaMode ? 'font-serif' : ''}`}>
                MIKROKOSMOS
              </h1>
              <p className="text-[10px] text-white/60 tracking-wider hidden sm:block">
                {isCinemaMode ? 'Cinematic Experience System' : 'Themed-Sync System'}
              </p>
            </div>
          </div>

          {/* Direita: ações — compactas no celular, mesma ordem sempre */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 flex-shrink-0">

            <LanguageSwitcher />

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cinema')}
              className={`${btnSize} rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors`}
              title={isKpopMode ? t('photocards.title') : t('nav.cinema')}
            >
              {isKpopMode ? <Sparkles className={iconSize} /> : <Film className={iconSize} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isAuthenticated ? '/perfil' : '/auth')}
              className={`${btnSize} rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors`}
              title={isAuthenticated ? t('nav.profile') : t('nav.login')}
            >
              <User className={iconSize} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/carrinho')}
              className={`${btnSize} relative rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors`}
              title={t('nav.cart')}
            >
              <ShoppingCart className={iconSize} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-black"
                  style={{ backgroundColor: 'var(--primary-neon)' }}>
                  {itemCount}
                </span>
              )}
            </motion.button>

            {moreItems.length > 0 && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setMoreOpen(prev => !prev)}
                  className={`${btnSize} relative rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors`}
                  {...{title: t('nav.moreOptions')}}
                >
                  <MoreVertical className={iconSize} />
                  {(pendingOrders > 0 || deliveryOrders > 0) && (isCozinha || isDelivery) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-black"
                      style={{ backgroundColor: 'var(--primary-neon)' }}>
                      {pendingOrders + deliveryOrders}
                    </span>
                  )}
                </motion.button>

                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[180px]">
                      {moreItems.map(item => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.key}
                            onClick={() => { navigate(item.path); setMoreOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all text-left"
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {!!item.badge && item.badge > 0 && (
                              <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-black"
                                style={{ backgroundColor: 'var(--primary-neon)' }}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}