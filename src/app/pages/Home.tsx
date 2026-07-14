// src/app/pages/Home.tsx
import { useState } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { UniverseToggle } from '../components/UniverseToggle';
import { StatsBar } from '../components/StatsBar';
import { SazonalBanner } from '../components/SazonalBanner';
import { products } from '../data/products';
import { useUniverse } from '../context/UniverseContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export function Home() {
  const { universeActive, universeName, categoria } = useUniverse();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const rawCategories = Array.from(new Set(products.map(p => p.categoria)));
  const categories = ['all', ...rawCategories];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.categoria === selectedCategory;
    const universeMatch = product.universo === 'both' || product.universo === universeActive;
    const culinariaMatch = categoria === 'Cinema'
      ? !product.culinaria || (product.culinaria !== 'coreana' && product.culinaria !== 'japonesa')
      : true;
    return categoryMatch && universeMatch && culinariaMatch;
  });

  const isKpop = categoria === 'Kpop';
  const isCinema = categoria === 'Cinema';

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Info da Mesa */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mb-8 p-6 backdrop-blur-sm
            ${isKpop
              ? 'rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10'
              : 'rounded-sm bg-black/60'
            }
          `}
          style={{ borderColor: isCinema ? 'color-mix(in srgb, var(--primary-neon) 20%, transparent)' : undefined }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className={`text-xl font-bold text-white mb-1 ${isCinema ? 'font-serif' : ''}`}>
                {isCinema ? t('home.session') : t('home.table')}:{' '}
                <span style={{ color: 'var(--primary-neon)' }}>MK-01</span>
              </h2>
              <p className="text-white/60 text-sm">
                {t('home.status')}: <span className="text-green-400">{t('home.statusActive')}</span>
              </p>
            </div>
            <div
              className={`px-4 py-2 backdrop-blur-sm ${isKpop ? 'rounded-full border' : 'rounded-sm border font-mono tracking-wide'}`}
              style={{ borderColor: 'var(--primary-neon)' }}
            >
              <span className="text-white/80 text-sm">
                {isCinema ? t('home.currentSaga') : t('home.currentEra')}:{' '}
              </span>
              <span className="font-bold" style={{ color: 'var(--primary-neon)' }}>
                {universeName}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Banner Sazonal — Copa do Mundo / Dia dos Namorados / Comeback Season / Cinema Horror Night */}
        <SazonalBanner onVerCardapio={() => setSelectedCategory('Sazonal')} />

        {/* Filtros de Categoria — nomes traduzidos via categories.*, com fallback para o nome original */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2 whitespace-nowrap font-medium transition-all duration-300
                ${isKpop ? 'rounded-full' : 'rounded-sm tracking-wide'}
                ${selectedCategory === category
                  ? 'text-black shadow-lg'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                }
              `}
              style={selectedCategory === category ? { backgroundColor: 'var(--primary-neon)' } : {}}
            >
              {category === 'all' ? t('home.all') : t(`categories.${category}`, { defaultValue: category })}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className={`text-white/60 text-lg ${isCinema ? 'font-serif' : ''}`}>
              {isCinema ? t('home.noProductsCinema') : t('home.noProductsKpop')}
            </p>
          </div>
        )}
      </main>

      <UniverseToggle />
    </div>
  );
}