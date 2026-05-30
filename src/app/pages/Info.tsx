import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { UniverseToggle } from '../components/UniverseToggle';
import { Sparkles, Users, Coffee, Calendar, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Info() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: 'Themed-Sync System',
      desc: 'Sistema que sincroniza o visual do restaurante com eras musicais K-pop',
      color: '#00FFFF',
    },
    {
      icon: Coffee,
      title: 'Gastronomia Narrativa',
      desc: 'Pratos temáticos inspirados em músicas e conceitos dos grupos',
      color: '#FF1493',
    },
    {
      icon: Users,
      title: '4 Universos',
      desc: 'AESPA, ENHYPEN, BTS e BLACKPINK com identidades visuais únicas',
      color: '#9C27B0',
    },
    {
      icon: Calendar,
      title: 'Experiência Imersiva',
      desc: 'Design galaxy com glassmorphism e animações suaves',
      color: '#FF1744',
    },
    {
      icon: GraduationCap,
      title: 'Educação Continuada',
      desc: 'Treinamento e suporte para garantir a eficiência do sistema',
      color: '#FFD700',
    },
  ];

  const universes = [
    {
      name: 'AESPA',
      theme: 'Cyberpunk Era',
      colors: 'Ciano & Verde Neon',
      tracks: 'Supernova, Next Level, Savage',
    },
    {
      name: 'ENHYPEN',
      theme: 'Dark Fantasy',
      colors: 'Vermelho Sangue & Dourado',
      tracks: 'Bite Me, Given-Taken, Drunk-Dazed',
    },
    {
      name: 'BTS',
      theme: 'Purple Era',
      colors: 'Roxo & Dourado',
      tracks: 'Dynamite, Butter, Mikrokosmos',
    },
    {
      name: 'BLACKPINK',
      theme: 'Pink Venom',
      colors: 'Rosa & Pink',
      tracks: 'Pink Venom, How You Like That, Lalisa',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white neon-text mb-4">
            MIKROKOSMOS
          </h1>
          <p className="text-xl text-white/80 mb-2">Themed-Sync System</p>
          <p className="text-white/60 max-w-2xl mx-auto">
            Um SaaS revolucionário que transforma a experiência gastronômica através da
            sincronização com universos musicais K-pop.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-[var(--primary-neon)]/50 transition-all"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `${feature.color}20`,
                  border: `2px solid ${feature.color}`,
                }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Universos Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Nossos Universos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {universes.map((universe, index) => (
              <motion.div
                key={universe.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:scale-105 transition-all"
              >
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--primary-neon)' }}>
                  {universe.name}
                </h3>
                <p className="text-white/80 font-semibold mb-3">{universe.theme}</p>
                <div className="space-y-2 text-sm">
                  <p className="text-white/60">
                    <span className="text-white">Cores:</span> {universe.colors}
                  </p>
                  <p className="text-white/60">
                    <span className="text-white">Faixas:</span> {universe.tracks}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Concept Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">O Conceito</h2>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              <strong className="text-white">Mikrokosmos</strong> não é apenas uma comanda
              digital comum - é um SaaS (Software as a Service) que utiliza o design para criar
              uma <strong className="text-white">experiência de fã dentro de um restaurante ou café</strong>.
            </p>
            <p>
              Através do nosso <strong className="text-white">Themed-Sync System</strong>, o
              estabelecimento pode mudar completamente sua identidade visual com um clique,
              acompanhando os lançamentos da indústria musical coreana.
            </p>
            <p>
              Cada prato no cardápio é uma <strong className="text-white">narrativa gastronômica</strong>,
              conectando os clientes aos seus artistas favoritos através de nomes temáticos e
              apresentações visuais únicas.
            </p>
            <p className="text-white font-semibold pt-4">
              É uma extensão do videoclipe do artista favorito do cliente, transformada em
              experiência culinária.
            </p>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-4">Tecnologias</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'React Router'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm"
              >
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