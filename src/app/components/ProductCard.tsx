import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Product } from '../data/products';
import { getProductImage } from '../utils/productImages';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { StarRating } from './StarRating';
import { useEffect, useState } from 'react';
import { useUniverse } from '../context/UniverseContext';
import { useCurrency } from '../../lib/currency';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { format } = useCurrency(); // FIX moeda: preço na moeda do idioma ativo
  const { categoria } = useUniverse();
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const allRatings = JSON.parse(localStorage.getItem('mikrokosmos_product_ratings') || '{}');
    const productRatings = allRatings[product.id] || [];
    
    if (productRatings.length > 0) {
      const sum = productRatings.reduce((acc: number, r: any) => acc + r.rating, 0);
      setAverageRating(sum / productRatings.length);
      setTotalRatings(productRatings.length);
    }
  }, [product.id]);

  const isKpop = categoria === 'Kpop';
  const isCinema = categoria === 'Cinema';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/produto/${product.id}`)}
      className="group cursor-pointer"
    >
      <div className={`
        product-card
        relative overflow-hidden backdrop-blur-sm 
        transition-all duration-300
        ${isKpop ? 'rounded-2xl' : 'rounded-sm'}
      `}>
        <div className={`relative overflow-hidden ${isKpop ? 'h-48' : 'h-56'}`}>
          <ImageWithFallback
            src={getProductImage(product.imageUrl)}
            alt={product.nome}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className={`
            absolute inset-0 
            ${isKpop 
              ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' 
              : 'bg-gradient-to-t from-black/95 via-black/40 to-transparent'
            }
          `} />
          
          <div className={`
            category-badge
            absolute top-3 left-3 px-3 py-1
            ${isKpop ? 'rounded-full' : 'rounded-sm'}
          `}>
            <span
              className="text-xs font-medium tracking-wider"
              style={{ color: isCinema ? 'var(--primary-neon)' : 'white' }}
            >
              {product.categoria}
            </span>
          </div>

          {isCinema && totalRatings > 0 && (
            <div
              className="absolute top-3 right-3 px-2 py-1 rounded-sm bg-black/70"
              style={{ border: '1px solid color-mix(in srgb, var(--primary-neon) 30%, transparent)' }}
            >
              <span className="text-xs font-mono" style={{ color: 'var(--primary-neon)' }}>
                ★ {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className={`
            font-bold text-white mb-1
            ${isKpop ? 'text-lg' : 'text-base tracking-wide'}
            ${isCinema ? 'font-serif' : ''}
          `}>
            {product.nome}
          </h3>
          
          <p className={`
            text-sm text-white/60 mb-2 line-clamp-2
            ${isCinema ? 'font-serif italic' : ''}
          `}>
            {product.desc /* já localizada pelo ProductsContext (banco → idioma ativo) */}
          </p>
          
          {isKpop && totalRatings > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={averageRating} readonly size={14} />
              <span className="text-xs text-white/50">
                {averageRating.toFixed(1)} ({totalRatings})
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span
              className={`text-2xl font-bold ${isCinema ? 'price-text' : ''}`}
              style={{ color: 'var(--primary-neon)' }}
            >
              {format(product.preco)}
            </span>
            
            {isKpop ? (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold"
                style={{ backgroundColor: 'var(--primary-neon)' }}
              >
                +
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 text-black font-bold text-sm tracking-wider uppercase rounded-sm"
                style={{ backgroundColor: 'var(--primary-neon)' }}
              >
                {t('common.view', { defaultValue: 'Ver' })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}