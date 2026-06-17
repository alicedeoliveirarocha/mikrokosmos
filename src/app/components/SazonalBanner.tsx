// src/app/components/SazonalBanner.tsx
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';

interface SazonalBannerProps {
  onVerCardapio: () => void;
}

export function SazonalBanner({ onVerCardapio }: SazonalBannerProps) {
  const { categoria } = useUniverse();
  const { t } = useTranslation();
  const isCinema = categoria === 'Cinema';

  const temas = [
    { emoji: '🌎', label: t('sazonal.themeCopa') },
    { emoji: '💕', label: t('sazonal.themeNamorados') },
    { emoji: '🎤', label: t('sazonal.themeComeback') },
    { emoji: '🎃', label: t('sazonal.themeHorror') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      onClick={onVerCardapio}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onVerCardapio(); }}
      className={`
        mb-8 p-6 cursor-pointer backdrop-blur-sm transition-all
        ${isCinema ? 'rounded-sm' : 'rounded-2xl'}
      `}
      style={{
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary-neon) 18%, transparent), color-mix(in srgb, var(--primary-neon) 4%, transparent))',
        border: '1px solid color-mix(in srgb, var(--primary-neon) 35%, transparent)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--primary-neon)' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--primary-neon)' }}>
              {t('sazonal.eyebrow')}
            </span>
          </div>
          <h2 className={`text-2xl font-bold text-white ${isCinema ? 'font-serif' : ''}`}>
            {t('sazonal.title')}
          </h2>
          <p className="text-white/60 text-sm mt-1">{t('sazonal.subtitle')}</p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className={`px-5 py-2.5 font-bold text-black text-sm whitespace-nowrap ${isCinema ? 'rounded-sm tracking-wider uppercase' : 'rounded-full'}`}
          style={{ backgroundColor: 'var(--primary-neon)' }}
        >
          {t('sazonal.cta')} →
        </motion.div>
      </div>

      <div className="flex gap-2 flex-wrap mt-4">
        {temas.map((tema) => (
          <span
            key={tema.label}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-white/80 bg-white/10 border border-white/10"
          >
            {tema.emoji} {tema.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}