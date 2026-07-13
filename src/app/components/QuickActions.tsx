// src/app/components/QuickActions.tsx
import { motion } from 'motion/react';
import { Sparkles, Info, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export function QuickActions() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      icon: Sparkles,
      labelKey: 'quickActions.switchEra',
      descKey: 'quickActions.switchEraDesc',
      action: () => {
        const toggleButton = document.querySelector('[title="Era Atual"]') as HTMLElement;
        toggleButton?.click();
      },
      color: '#00FFFF',
    },
    {
      icon: Info,
      labelKey: 'quickActions.about',
      descKey: 'quickActions.aboutDesc',
      action: () => navigate('/info'),
      color: '#FF1493',
    },
    {
      icon: GraduationCap,
      labelKey: 'quickActions.learning',
      descKey: 'quickActions.learningDesc',
      action: () => navigate('/learning'),
      color: '#9C27B0',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-24 left-6 z-40 hidden md:flex flex-col gap-3"
    >
      {actions.map((action, index) => (
        <motion.button
          key={action.labelKey}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}
          onClick={action.action}
          className="group bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-all flex items-center gap-3"
          style={{ borderColor: `${action.color}30` }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${action.color}20`, border: `2px solid ${action.color}` }}>
            <action.icon className="w-5 h-5" style={{ color: action.color }} />
          </div>
          <div className="text-left opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all duration-300">
            <p className="text-white font-semibold text-sm whitespace-nowrap">{t(action.labelKey)}</p>
            <p className="text-white/60 text-xs whitespace-nowrap">{t(action.descKey)}</p>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}