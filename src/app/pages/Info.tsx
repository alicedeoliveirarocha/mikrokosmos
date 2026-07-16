// src/app/pages/Info.tsx
import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { useTranslation } from 'react-i18next';
import { Sparkles, Users, Coffee, Calendar, GraduationCap } from 'lucide-react';

export function Info() {
  const { t } = useTranslation();

  const features = [
    { icon: Sparkles,      key: 'themedSync',  color: '#00FFFF' },
    { icon: Coffee,        key: 'gastronomy',  color: '#FF1493' },
    { icon: Users,         key: 'universes',   color: '#9C27B0' },
    { icon: Calendar,      key: 'immersive',   color: '#FF1744' },
    { icon: GraduationCap, key: 'education',   color: '#FFD700' },
  ];

  // Nomes, temas de era e tracks são marca — não traduzem.
  // As cores traduzem via info.universeColors.{slug}
  const universes = [
    { slug: 'aespa',     name: 'AESPA',     theme: 'Cyberpunk Era', tracks: 'Supernova, Next Level, Savage' },
    { slug: 'enhypen',   name: 'ENHYPEN',   theme: 'Dark Fantasy',  tracks: 'Bite Me, Given-Taken, Drunk-Dazed' },
    { slug: 'bts',       name: 'BTS',       theme: 'Purple Era',    tracks: 'Dynamite, Butter, Mikrokosmos' },
    { slug: 'blackpink', name: 'BLACKPINK', theme: 'Pink Venom',    tracks: 'Pink Venom, How You Like That, Lalisa' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white neon-text mb-4">MIKROKOSMOS</h1>
          <p className="text-xl text-white/80 mb-2">Themed-Sync System</p>
          <p className="text-white/60 max-w-2xl mx-auto">{t('info.heroDesc')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div key={feature.key}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-[var(--primary-neon)]/50 transition-all">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}20`, border: `2px solid ${feature.color}` }}>
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t(`info.features.${feature.key}.title`)}</h3>
              <p className="text-white/60">{t(`info.features.${feature.key}.desc`)}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('info.universesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {universes.map((universe, index) => (
              <motion.div key={universe.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:scale-105 transition-all">
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--primary-neon)' }}>{universe.name}</h3>
                <p className="text-white/80 font-semibold mb-3">{universe.theme}</p>
                <div className="space-y-2 text-sm">
                  <p className="text-white/60">
                    <span className="text-white">{t('info.colors')}</span> {t(`info.universeColors.${universe.slug}`)}
                  </p>
                  <p className="text-white/60">
                    <span className="text-white">{t('info.tracks')}</span> {universe.tracks}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-6">{t('info.concept.title')}</h2>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p dangerouslySetInnerHTML={{ __html: t('info.concept.p1') }} />
            <p dangerouslySetInnerHTML={{ __html: t('info.concept.p2') }} />
            <p dangerouslySetInnerHTML={{ __html: t('info.concept.p3') }} />
            <p className="text-white font-semibold pt-4">{t('info.concept.tagline')}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }} className="mt-16 text-center">
          <h3 className="text-xl font-bold text-white mb-4">{t('info.tech')}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'React Router'].map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </main>
      <UniverseToggle />
    </div>
  );
}