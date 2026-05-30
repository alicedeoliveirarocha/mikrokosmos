import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Universe = 'aespa' | 'enhypen' | 'bts' | 'blackpink' | 'redvelvet' | 'newjeans' | 'illit' | 'starwars' | 'marvel' | 'spiderman' | 'meangirls' | 'interstellar';

interface UniverseContextType {
  universeActive: Universe;
  setUniverse: (universe: Universe) => void;
  primaryColor: string;
  gradientFrom: string;
  gradientTo: string;
  universeName: string;
  categoria: 'Kpop' | 'Cinema';
}

const UniverseContext = createContext<UniverseContextType | undefined>(undefined);

// Configuração de temas expandida com mais variáveis
const themeConfig = {
  aespa: {
    name: 'AESPA',
    primaryColor: '#00FFFF',
    gradientFrom: '#00FFFF',
    gradientTo: '#00FF88',
    categoria: 'Kpop' as const,
    accentColor: '#0080FF',
  },
  enhypen: {
    name: 'ENHYPEN',
    primaryColor: '#FF1744',
    gradientFrom: '#FF1744',
    gradientTo: '#FFD700',
    categoria: 'Kpop' as const,
    accentColor: '#FF5722',
  },
  bts: {
    name: 'BTS',
    primaryColor: '#9C27B0',
    gradientFrom: '#9C27B0',
    gradientTo: '#FFD700',
    categoria: 'Kpop' as const,
    accentColor: '#7B1FA2',
  },
  blackpink: {
    name: 'BLACKPINK',
    primaryColor: '#FF1493',
    gradientFrom: '#FF1493',
    gradientTo: '#FF69B4',
    categoria: 'Kpop' as const,
    accentColor: '#FF69B4',
  },
  redvelvet: {
    name: 'RED VELVET',
    primaryColor: '#FF0000',
    gradientFrom: '#FF0000',
    gradientTo: '#FF69B4',
    categoria: 'Kpop' as const,
    accentColor: '#DC143C',
  },
  newjeans: {
    name: 'NEWJEANS',
    primaryColor: '#7EC8E3',
    gradientFrom: '#7EC8E3',
    gradientTo: '#B4E7CE',
    categoria: 'Kpop' as const,
    accentColor: '#5FB3D1',
  },
  illit: {
    name: 'ILLIT',
    primaryColor: '#FFB6C1',
    gradientFrom: '#FFB6C1',
    gradientTo: '#E6E6FA',
    categoria: 'Kpop' as const,
    accentColor: '#FF69B4',
  },
  starwars: {
    name: 'STAR WARS',
    primaryColor: '#FFE81F',
    gradientFrom: '#FFE81F',
    gradientTo: '#00FF00',
    categoria: 'Cinema' as const,
    accentColor: '#FFD700',
  },
  marvel: {
    name: 'MARVEL',
    primaryColor: '#ED1D24',
    gradientFrom: '#ED1D24',
    gradientTo: '#FFD700',
    categoria: 'Cinema' as const,
    accentColor: '#C41E3A',
  },
  spiderman: {
    name: 'SPIDER-MAN',
    primaryColor: '#E62429',
    gradientFrom: '#E62429',
    gradientTo: '#0066CC',
    categoria: 'Cinema' as const,
    accentColor: '#DC143C',
  },
  meangirls: {
    name: 'MEAN GIRLS',
    primaryColor: '#FF69B4',
    gradientFrom: '#FF69B4',
    gradientTo: '#FFB6C1',
    categoria: 'Cinema' as const,
    accentColor: '#FF1493',
  },
  interstellar: {
    name: 'INTERSTELLAR',
    primaryColor: '#4A90E2',
    gradientFrom: '#4A90E2',
    gradientTo: '#1C1C1C',
    categoria: 'Cinema' as const,
    accentColor: '#2E5C8A',
  },
};

// Função para obter o universo salvo ou retornar null
function getSavedUniverse(): Universe | null {
  try {
    const saved = localStorage.getItem('mikrokosmos-universe');
    if (saved && saved in themeConfig) {
      return saved as Universe;
    }
  } catch (error) {
    console.warn('Failed to load saved universe:', error);
  }
  return null;
}

export function UniverseProvider({ children }: { children: ReactNode }) {
  // Usa o universo salvo ou 'aespa' como fallback inicial
  const [universeActive, setUniverseActive] = useState<Universe>(() => {
    return getSavedUniverse() || 'aespa';
  });

  const currentTheme = themeConfig[universeActive];

  // Atualiza as CSS variables quando o tema muda
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-neon', currentTheme.primaryColor);
    root.style.setProperty('--gradient-from', currentTheme.gradientFrom);
    root.style.setProperty('--gradient-to', currentTheme.gradientTo);
    root.style.setProperty('--accent-color', currentTheme.accentColor);
    
    // Adiciona atributo data-universe ao HTML para permitir seleções CSS específicas
    root.setAttribute('data-universe', universeActive);
    root.setAttribute('data-categoria', currentTheme.categoria);
  }, [currentTheme, universeActive]);

  const setUniverse = (universe: Universe) => {
    setUniverseActive(universe);
    // Persiste a escolha do usuário
    try {
      localStorage.setItem('mikrokosmos-universe', universe);

      // Dispara evento customizado para tracking de acesso
      window.dispatchEvent(new CustomEvent('universe-changed', { detail: { universe } }));
    } catch (error) {
      console.warn('Failed to save universe preference:', error);
    }
  };

  return (
    <UniverseContext.Provider value={{
      universeActive,
      setUniverse,
      primaryColor: currentTheme.primaryColor,
      gradientFrom: currentTheme.gradientFrom,
      gradientTo: currentTheme.gradientTo,
      universeName: currentTheme.name,
      categoria: currentTheme.categoria,
    }}>
      {children}
    </UniverseContext.Provider>
  );
}

export function useUniverse() {
  const context = useContext(UniverseContext);
  if (!context) {
    throw new Error('useUniverse must be used within UniverseProvider');
  }
  return context;
}

// Export da configuração de temas para uso em outros lugares se necessário
export { themeConfig };
export type { Universe };