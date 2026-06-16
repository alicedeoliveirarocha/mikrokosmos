import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Sparkles, ArrowRight, GraduationCap, User, ChefHat, Bike, BarChart3, Film } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useUniverse } from '../context/UniverseContext';

export function Welcome() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const { categoria } = useUniverse();
  const [showContent, setShowContent] = useState(false);

  const pendingOrders = orders.filter(o => ['pendente', 'preparando'].includes(o.status)).length;
  const deliveryOrders = orders.filter(o => ['pronto', 'saiu-para-entrega'].includes(o.status)).length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const isKpop = categoria === 'Kpop';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Logo animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-[0.3em] text-white neon-text mb-4">
            MIKROKOSMOS
          </h1>
          <p className="text-lg md:text-xl text-white/60 tracking-wider mb-2">
            Themed-Sync System
          </p>
        </motion.div>

        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Bem-vindo ao futuro da gastronomia K-pop!
              <br />
              Uma experiência imersiva que sincroniza sabor e música.
            </p>

            {/* Cards de features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
              >
                <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: '#00FFFF' }} />
                <h3 className="text-white font-bold mb-2">7 Universos K-pop</h3>
                <p className="text-white/60 text-sm">BTS, BLACKPINK, AESPA, ENHYPEN, RED VELVET, NEWJEANS, ILLIT</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
              >
                <div className="text-4xl mb-3">🍜</div>
                <h3 className="text-white font-bold mb-2">Cardápio Temático</h3>
                <p className="text-white/60 text-sm">Pratos inspirados em hits K-pop</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
              >
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-white font-bold mb-2">Experiência Galaxy</h3>
                <p className="text-white/60 text-sm">Design futurista e imersivo</p>
              </motion.div>
            </div>

            {/* Botão principal */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="px-10 py-5 rounded-full font-bold text-lg text-black flex items-center gap-3 mx-auto shadow-2xl"
              style={{
                backgroundColor: '#00FFFF',
                boxShadow: '0 0 40px rgba(0, 255, 255, 0.5)',
              }}
            >
              ENTRAR NO MIKROKOSMOS
              <ArrowRight className="w-6 h-6" />
            </motion.button>

            {/* Botão Cinema / Photocards */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cinema')}
              className="mt-4 px-10 py-5 rounded-full font-bold text-lg text-white border-2 flex items-center gap-3 mx-auto hover:bg-white/5 transition-all"
              style={{
                borderColor: '#D4AF37',
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
              }}
            >
              {isKpop
                ? <><Sparkles className="w-6 h-6" /> PHOTOCARDS</>
                : <><Film className="w-6 h-6" /> MODO CINEMA</>
              }
              <ArrowRight className="w-6 h-6" />
            </motion.button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <p className="text-white/40 text-sm">
                Toque para começar sua jornada gastronômica
              </p>
              <div className="flex items-center gap-4">
                {!isAuthenticated && (
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-sm text-white/80 hover:text-white flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </button>
                )}
                <button
                  onClick={() => navigate('/info')}
                  className="text-sm text-white/60 hover:text-white underline transition-colors"
                >
                  Saiba mais
                </button>
              </div>
            </div>

            {/* Acesso Rápido */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8 max-w-2xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/analytics')}
                className="p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/30 transition-all"
              >
                <BarChart3 className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--primary-neon)' }} />
                <p className="text-white text-sm font-medium">Analytics</p>
                <p className="text-white/60 text-xs mt-1">BCG & Métricas</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/cozinha')}
                className="relative p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/30 transition-all"
              >
                <ChefHat className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--primary-neon)' }} />
                <p className="text-white text-sm font-medium">Cozinha</p>
                {pendingOrders > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-black"
                    style={{ backgroundColor: 'var(--primary-neon)' }}
                  >
                    {pendingOrders}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/delivery')}
                className="relative p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/30 transition-all"
              >
                <Bike className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--primary-neon)' }} />
                <p className="text-white text-sm font-medium">Delivery</p>
                {deliveryOrders > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-black"
                    style={{ backgroundColor: 'var(--primary-neon)' }}
                  >
                    {deliveryOrders}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}