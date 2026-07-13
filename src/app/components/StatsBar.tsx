// src/app/components/StatsBar.tsx
import { motion } from 'motion/react';
import { TrendingUp, Clock, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function StatsBar() {
  const { t } = useTranslation();

  const stats = [
    { icon: TrendingUp, labelKey: 'statsBar.ordersToday', value: '127', change: '+12%' },
    { icon: Clock,      labelKey: 'statsBar.avgTime',     value: '18min', change: '-5min' },
    { icon: Star,       labelKey: 'statsBar.rating',      value: '4.9',  change: '+0.2' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-3 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div key={stat.labelKey}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-[var(--primary-neon)]/30 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--primary-neon)20' }}>
              <stat.icon className="w-4 h-4" style={{ color: 'var(--primary-neon)' }} />
            </div>
            <span className="text-xs text-white/60">{t(stat.labelKey)}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stat.value}</span>
            <span className="text-xs text-green-400">{stat.change}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}