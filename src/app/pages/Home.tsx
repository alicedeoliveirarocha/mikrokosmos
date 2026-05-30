import { useState } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { UniverseToggle } from '../components/UniverseToggle';
import { StatsBar } from '../components/StatsBar';
import { products } from '../data/products';
import { useUniverse } from '../context/UniverseContext';
import { motion } from 'motion/react';

export function Home() {
  const { universeActive, universeName, categoria } = useUniverse();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.categoria)))];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'Todos' || product.categoria === selectedCategory;
    const universeMatch = product.universo === 'both' || product.universo === universeActive;

    // Filtra culinária coreana/japonesa SOMENTE para K-pop
    // Cinema NÃO deve mostrar pratos coreanos/japoneses
    const culinariaMatch = categoria === 'Cinema'
      ? !product.culinaria || (product.culinaria !== 'coreana' && product.culinaria !== 'japonesa')
      : true; // K-pop pode mostrar qualquer culinária

    return categoryMatch && universeMatch && culinariaMatch;
  });

  const isKpop = categoria === 'Kpop';
  const isCinema = categoria === 'Cinema';

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Info da Mesa - Estilo adaptável */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mb-8 p-6 backdrop-blur-sm
            ${isKpop 
              ? 'rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10' 
              : 'rounded-sm bg-black/60 border border-[#D4AF37]/20'
            }
          `}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className={`text-xl font-bold text-white mb-1 ${isCinema ? 'font-serif' : ''}`}>
                {isCinema ? 'Sessão: ' : 'Mesa: '}
                <span style={{ color: isKpop ? 'var(--primary-neon)' : '#D4AF37' }}>
                  MK-01
                </span>
              </h2>
              <p className="text-white/60 text-sm">
                Status: <span className="text-green-400">Ativo</span>
              </p>
            </div>
            <div 
              className={`
                px-4 py-2 backdrop-blur-sm
                ${isKpop 
                  ? 'rounded-full border' 
                  : 'rounded-sm border font-mono tracking-wide'
                }
              `}
              style={{ borderColor: isKpop ? 'var(--primary-neon)' : '#D4AF37' }}
            >
              <span className="text-white/80 text-sm">
                {isCinema ? 'Saga Atual: ' : 'Era Atual: '}
              </span>
              <span 
                className="font-bold"
                style={{ color: isKpop ? 'var(--primary-neon)' : '#D4AF37' }}
              >
                {universeName}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Filtros de Categoria - Estilo adaptável */}
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
                  ? isCinema 
                    ? 'text-black shadow-lg shadow-[#D4AF37]/30' 
                    : 'text-black shadow-lg shadow-[var(--primary-neon)]/30'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                }
              `}
              style={
                selectedCategory === category
                  ? { 
                      background: isCinema 
                        ? 'linear-gradient(135deg, #D4AF37 0%, #C9A22E 100%)' 
                        : 'var(--primary-neon)' 
                    }
                  : {}
              }
            >
              {category}
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
              {isCinema 
                ? 'Nenhum item disponível para esta saga.' 
                : 'Nenhum produto encontrado para esta era.'
              }
            </p>
          </div>
        )}
      </main>

      <UniverseToggle />
    </div>
  );
}