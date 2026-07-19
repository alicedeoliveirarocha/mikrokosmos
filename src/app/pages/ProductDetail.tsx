// src/app/pages/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductImage } from '../utils/productImages';
import { Minus, Plus, Trash2, Heart, Flame, Apple } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { StarRating } from '../components/StarRating';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../lib/currency';

// Tema festivo por evento sazonal, identificado pelo emoji no início do nome do produto.
function getSeasonalCelebration(nome: string): string[] | null {
  if (nome.startsWith('🌎')) return ['🎉', '⚽', '🟡', '🟢', '🎊'];
  if (nome.startsWith('💕')) return ['💕', '❤️', '💖', '✨'];
  if (nome.startsWith('🎤')) return ['✨', '🌟', '💫', '🎤'];
  if (nome.startsWith('🎃')) return ['🩸', '💀', '🎃', '🦇'];
  return null;
}

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { format } = useCurrency(); // FIX moeda: preços na moeda do idioma ativo
  const { products } = useProducts(); // cardápio vem do Supabase, já no idioma ativo
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [celebration, setCelebration] = useState<string[] | null>(null);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (!product) return;

    const allRatings = JSON.parse(localStorage.getItem('mikrokosmos_product_ratings') || '{}');
    const productRatings = allRatings[product.id] || [];

    if (productRatings.length > 0) {
      const sum = productRatings.reduce((acc: number, r: any) => acc + r.rating, 0);
      setAverageRating(sum / productRatings.length);
      setTotalRatings(productRatings.length);
    }

    if (isAuthenticated && user) {
      const userRatingData = productRatings.find((r: any) => r.userId === user.id);
      if (userRatingData) setUserRating(userRatingData.rating);
    }

    if (isAuthenticated && user) {
      const favorites = JSON.parse(localStorage.getItem('mikrokosmos_favorites') || '{}');
      const userFavorites = favorites[user.id] || [];
      setIsFavorite(userFavorites.includes(product.id));
    }
  }, [product, user, isAuthenticated]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">{t('productDetail.notFound')}</p>
      </div>
    );
  }

  // Descrição longa já vem localizada do ProductsContext
  // (jsonb multilíngue do banco → idioma ativo, com fallback pt-BR)
  const longDesc = product.descLonga;

  const handleAddToCart = () => {
    if (quantity === 0) return;

    const theme = product.categoria === 'Sazonal' ? getSeasonalCelebration(product.nome) : null;

    const finish = () => {
      addToCart(product, quantity);
      toast.success(t('productDetail.toastAdded', { quantity, nome: product.nome }));
      navigate('/home');
    };

    if (theme) {
      setCelebration(theme);
      setTimeout(finish, 900);
    } else {
      finish();
    }
  };

  const handleRatingChange = (rating: number) => {
    if (!isAuthenticated || !user) {
      toast.error(t('productDetail.loginToRate'));
      navigate('/auth');
      return;
    }

    const allRatings = JSON.parse(localStorage.getItem('mikrokosmos_product_ratings') || '{}');
    const productRatings = allRatings[product.id] || [];
    const filteredRatings = productRatings.filter((r: any) => r.userId !== user.id);
    filteredRatings.push({ userId: user.id, rating, date: new Date().toISOString() });
    allRatings[product.id] = filteredRatings;
    localStorage.setItem('mikrokosmos_product_ratings', JSON.stringify(allRatings));

    setUserRating(rating);
    const sum = filteredRatings.reduce((acc: number, r: any) => acc + r.rating, 0);
    setAverageRating(sum / filteredRatings.length);
    setTotalRatings(filteredRatings.length);

    toast.success(t('productDetail.ratedSuccess', { rating }));
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated || !user) {
      toast.error(t('productDetail.loginToFavorite'));
      navigate('/auth');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('mikrokosmos_favorites') || '{}');
    const userFavorites = favorites[user.id] || [];

    if (isFavorite) {
      favorites[user.id] = userFavorites.filter((fav: string) => fav !== product.id);
      toast.success(t('productDetail.removedFavorite'));
    } else {
      userFavorites.push(product.id);
      favorites[user.id] = userFavorites;
      toast.success(t('productDetail.addedFavorite'));
    }

    localStorage.setItem('mikrokosmos_favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Overlay de celebração sazonal */}
      <AnimatePresence>
        {celebration && (
          <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => {
              const emoji = celebration[i % celebration.length];
              const startX = Math.random() * 100;
              const delay = Math.random() * 0.25;
              const duration = 1.1 + Math.random() * 0.6;
              const spin = Math.random() > 0.5 ? 220 : -220;
              const size = 22 + Math.random() * 18;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, top: '100vh', left: `${startX}vw`, rotate: 0, scale: 0.7 + Math.random() * 0.6 }}
                  animate={{ opacity: 0, top: '-10vh', rotate: spin }}
                  exit={{ opacity: 0 }}
                  transition={{ duration, delay, ease: 'easeOut' }}
                  style={{ position: 'absolute', fontSize: size }}
                >
                  {emoji}
                </motion.span>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Imagem do Produto */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-80 md:h-96 rounded-3xl overflow-hidden mb-6"
        >
          <ImageWithFallback
            src={getProductImage(product.imageUrl)}
            alt={product.nome}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <button
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110"
          >
            <Heart className={`w-6 h-6 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </motion.div>

        {/* Informações do Produto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 mb-6"
        >
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.nome}</h1>
            <p className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--primary-neon)' }}>
              {format(product.preco)}
            </p>
            <p className="text-white/80 text-lg leading-relaxed mb-4">{longDesc}</p>

            {/* Rating */}
            <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/80">{t('productDetail.avgRating')}</span>
                <div className="flex items-center gap-2">
                  <StarRating rating={averageRating} readonly size={20} />
                  <span className="text-white/60 text-sm">
                    {averageRating > 0 ? averageRating.toFixed(1) : '—'} ({totalRatings})
                  </span>
                </div>
              </div>

              {isAuthenticated && (
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-white/80">{t('productDetail.yourRating')}</span>
                  <StarRating rating={userRating} onRatingChange={handleRatingChange} size={24} />
                </div>
              )}
            </div>
          </div>

          {/* Controle de Quantidade */}
          <div className="mb-6">
            <p className="text-white/60 text-sm mb-3">{t('productDetail.quantity')}</p>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-white transition-all hover:bg-white/10"
                style={{ borderColor: 'var(--primary-neon)' }}
                disabled={quantity === 0}
              >
                <Minus className="w-6 h-6" />
              </motion.button>

              <span className="text-3xl font-bold text-white w-16 text-center">{quantity}</span>

              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-white transition-all hover:bg-white/10"
                style={{ borderColor: 'var(--primary-neon)' }}
              >
                <Plus className="w-6 h-6" />
              </motion.button>

              {quantity > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(0)}
                  className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 transition-all hover:bg-red-500/30"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Valor Total */}
          <div className="flex items-center justify-between py-4 border-t border-white/10 mb-6">
            <span className="text-white/80 text-lg">{t('productDetail.totalValue')}</span>
            <span className="text-3xl font-bold" style={{ color: 'var(--primary-neon)' }}>
              {format(product.preco * quantity)}
            </span>
          </div>

          {/* Botão Adicionar */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className="w-full py-5 rounded-2xl font-bold text-lg text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{
              backgroundColor: quantity > 0 ? 'var(--primary-neon)' : '#666',
              boxShadow: quantity > 0 ? '0 10px 30px rgba(0, 255, 255, 0.3)' : 'none'
            }}
          >
            {quantity > 0 ? t('productDetail.addToCart') : t('productDetail.selectQuantity')}
          </motion.button>
        </motion.div>

        {/* Informações Nutricionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-neon)' }}>
              <Flame className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white">{t('productDetail.nutrition')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: product.nutricao.calorias,     key: 'calories' },
              { value: product.nutricao.proteinas,    key: 'protein' },
              { value: product.nutricao.carboidratos, key: 'carbs' },
              { value: product.nutricao.gorduras,     key: 'fat' },
            ].map(({ value, key }) => (
              <div key={key} className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--primary-neon)' }}>{value}</p>
                <p className="text-white/60 text-sm">{t(`productDetail.${key}`)}</p>
              </div>
            ))}
          </div>

          {/* Ingredientes — traduzidos via ingredients.*, com fallback pro nome original */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Apple className="w-5 h-5" style={{ color: 'var(--primary-neon)' }} />
              <h3 className="text-lg font-bold text-white">{t('productDetail.ingredients')}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.ingredientes.map((ingrediente, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-sm bg-white/10 text-white border border-white/20">
                  {t(`ingredients.${ingrediente}`, { defaultValue: ingrediente })}
                </span>
              ))}
            </div>
          </div>

          {/* Alérgenos — traduzidos via allergens.*, com fallback pro nome original */}
          {product.alergenos && product.alergenos.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
              <p className="text-yellow-400 font-bold mb-2">⚠️ {t('productDetail.allergenAlert')}</p>
              <p className="text-white/80 text-sm">
                {t('productDetail.contains')} {product.alergenos.map(a => t(`allergens.${a}`, { defaultValue: a })).join(', ')}
              </p>
            </div>
          )}
        </motion.div>
      </main>

      <UniverseToggle />
    </div>
  );
}