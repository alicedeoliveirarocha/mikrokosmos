// src/app/pages/Learning.tsx
import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { useTranslation } from 'react-i18next';
import { Code, Database, Palette, Rocket, CheckCircle2 } from 'lucide-react';

export function Learning() {
  const { t } = useTranslation();

  const concepts = [
    {
      week: 'Semana 1-2', date: '03/03 - 11/03',
      title: 'JavaScript ES6+ & DOM',
      topics: ['Variáveis, Tipos de Dados e Operadores','Estruturas de Controle e Laços','Funções e Escopo - Modularização','Manipulação de DOM - Dinamismo no cardápio'],
      implemented: ['Context API','React Hooks','Event Handlers','Dynamic Rendering'],
      icon: Code, color: '#00FFFF',
    },
    {
      week: 'Semana 3-4', date: '17/03 - 01/04',
      title: 'Arrays, Objetos & BaaS',
      topics: ['Trabalhando com Objetos e Arrays','Eventos e Interatividade - Carrinho','Introdução ao Firebase e Supabase','Sprint 2: CRUD Cardápio'],
      implemented: ['Product Data Management','Cart State','Context Providers','CRUD Operations'],
      icon: Database, color: '#FF1493',
    },
    {
      week: 'Semana 5-7', date: '07/04 - 22/04',
      title: 'API & UX/UI Design',
      topics: ['Real-time Database: CRUD de Pedidos','Fetch API e Async/Await','UX/UI Design: Status e Feedback','Animações e Transições CSS'],
      implemented: ['Motion Animations','Toast Notifications','Glassmorphism','Responsive Design'],
      icon: Palette, color: '#9C27B0',
    },
    {
      week: 'Semana 8-12', date: '28/04 - 10/06',
      title: 'React & Deploy',
      topics: ['Componentização: React','Integração de Módulos com Frameworks','Segurança: Regras de Acesso','Hospedagem e CI/CD (Vercel)'],
      implemented: ['React Components','React Router','TypeScript','Production Build'],
      icon: Rocket, color: '#FF1744',
    },
  ];

  const techStack = [
    { name: 'React 18', desc: 'UI Library' },
    { name: 'TypeScript', desc: 'Type Safety' },
    { name: 'Tailwind CSS v4', desc: 'Styling' },
    { name: 'Motion', desc: 'Animations' },
    { name: 'React Router', desc: 'Navigation' },
    { name: 'Lucide React', desc: 'Icons' },
    { name: 'Sonner', desc: 'Toasts' },
  ];

  const features = [
    '4 Themed Universes','Shopping Cart','12 Unique Products','Smooth Animations',
    'Responsive Design','Glassmorphism UI','Context API','TypeScript',
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('learning.title')}</h1>
          <p className="text-xl text-white/70 mb-2">{t('learning.subtitle')}</p>
          <p className="text-white/50">{t('learning.period')}</p>
        </motion.div>

        <div className="space-y-6 mb-16">
          {concepts.map((concept, index) => (
            <motion.div key={concept.week}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-[var(--primary-neon)]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${concept.color}20`, border: `2px solid ${concept.color}` }}>
                  <concept.icon className="w-7 h-7" style={{ color: concept.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{concept.title}</h3>
                      <p className="text-sm text-white/60">{concept.week} • {concept.date}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-2">{t('learning.scheduleTopics')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {concept.topics.map((topic) => (
                        <div key={topic} className="flex items-start gap-2 text-sm text-white/70">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: concept.color }} />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-2">{t('learning.implemented')}</p>
                    <div className="flex flex-wrap gap-2">
                      {concept.implemented.map((feature) => (
                        <span key={feature} className="px-3 py-1 rounded-full text-xs font-medium border"
                          style={{ backgroundColor: `${concept.color}15`, borderColor: `${concept.color}40`, color: concept.color }}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{t('learning.techStack')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {techStack.map((tech, index) => (
              <motion.div key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--primary-neon)]/50 transition-all">
                <p className="font-bold text-white mb-1 text-sm">{tech.name}</p>
                <p className="text-xs text-white/50">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }} className="mt-12 text-center">
          <h3 className="text-xl font-bold text-white mb-4">{t('learning.features')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feature) => (
              <span key={feature}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm hover:border-[var(--primary-neon)]/30 transition-all">
                {feature}
              </span>
            ))}
          </div>
        </motion.div>
      </main>
      <UniverseToggle />
    </div>
  );
}