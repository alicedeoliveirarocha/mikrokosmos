import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Universe } from './UniverseContext';

interface UniverseAccess {
  universe: Universe;
  accessCount: number;
  lastAccess: string;
}

interface AccessTrackingContextType {
  trackAccess: (universe: Universe) => void;
  getSortedUniverses: () => UniverseAccess[];
  getAccessCount: (universe: Universe) => number;
  resetTracking: () => void;
}

const AccessTrackingContext = createContext<AccessTrackingContextType | undefined>(undefined);

const STORAGE_KEY = 'mikrokosmos-access-tracking';

// Inicializa tracking com contagem zero para todos os universos
const initializeTracking = (): UniverseAccess[] => {
  const universes: Universe[] = [
    'aespa', 'enhypen', 'bts', 'blackpink', 'redvelvet', 'newjeans', 'illit',
    'starwars', 'marvel', 'spiderman', 'meangirls', 'interstellar'
  ];

  return universes.map(universe => ({
    universe,
    accessCount: 0,
    lastAccess: new Date().toISOString(),
  }));
};

function loadAccessData(): UniverseAccess[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as UniverseAccess[];
      // Garantir que todos os universos existem (adiciona novos se necessário)
      const currentUniverses = initializeTracking();
      return currentUniverses.map(current => {
        const existing = parsed.find(p => p.universe === current.universe);
        return existing || current;
      });
    }
  } catch (error) {
    console.warn('Failed to load access tracking:', error);
  }
  return initializeTracking();
}

export function AccessTrackingProvider({ children }: { children: ReactNode }) {
  const [accessData, setAccessData] = useState<UniverseAccess[]>(() => loadAccessData());

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accessData));
    } catch (error) {
      console.warn('Failed to save access tracking:', error);
    }
  }, [accessData]);

  // Escutar mudanças de universo para rastrear acessos
  useEffect(() => {
    const handleUniverseChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ universe: Universe }>;
      setAccessData(prev => {
        const updated = prev.map(item => {
          if (item.universe === customEvent.detail.universe) {
            return {
              ...item,
              accessCount: item.accessCount + 1,
              lastAccess: new Date().toISOString(),
            };
          }
          return item;
        });
        return updated;
      });
    };

    window.addEventListener('universe-changed', handleUniverseChange);
    return () => {
      window.removeEventListener('universe-changed', handleUniverseChange);
    };
  }, []);

  const trackAccess = (universe: Universe) => {
    setAccessData(prev => {
      const updated = prev.map(item => {
        if (item.universe === universe) {
          return {
            ...item,
            accessCount: item.accessCount + 1,
            lastAccess: new Date().toISOString(),
          };
        }
        return item;
      });
      return updated;
    });
  };

  // Retorna universos ordenados por número de acessos (maior primeiro)
  const getSortedUniverses = (): UniverseAccess[] => {
    return [...accessData].sort((a, b) => b.accessCount - a.accessCount);
  };

  const getAccessCount = (universe: Universe): number => {
    const item = accessData.find(d => d.universe === universe);
    return item?.accessCount || 0;
  };

  const resetTracking = () => {
    setAccessData(initializeTracking());
  };

  return (
    <AccessTrackingContext.Provider value={{
      trackAccess,
      getSortedUniverses,
      getAccessCount,
      resetTracking,
    }}>
      {children}
    </AccessTrackingContext.Provider>
  );
}

export function useAccessTracking() {
  const context = useContext(AccessTrackingContext);
  if (!context) {
    throw new Error('useAccessTracking must be used within AccessTrackingProvider');
  }
  return context;
}
