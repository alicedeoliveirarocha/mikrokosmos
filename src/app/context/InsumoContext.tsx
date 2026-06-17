// src/app/context/InsumoContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Insumo, insumosIniciais, productInsumos, getInsumosMappingKey } from '../data/insumos';

const STORAGE_KEY = 'mikrokosmos_estoque';

interface ConsumoItem {
  nome: string;
  categoria: string;
  quantidade: number;
}

interface InsumoContextType {
  insumos: Insumo[];
  lowStockItems: Insumo[];
  outOfStockItems: Insumo[];
  consumeInsumos: (items: ConsumoItem[]) => void;
  restock: (insumoId: string, quantidade: number) => void;
  discardStock: (insumoId: string, quantidade: number, motivo?: string) => void;
  resetStock: () => void;
  getStockPercent: (insumo: Insumo) => number;
  getStockStatus: (insumo: Insumo) => 'ok' | 'low' | 'critical' | 'out';
  totalStockValue: number;
}

const InsumoContext = createContext<InsumoContextType | null>(null);

function loadStock(): Insumo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return insumosIniciais;
}

function saveStock(insumos: Insumo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(insumos));
  } catch {}
}

export function InsumoProvider({ children }: { children: ReactNode }) {
  const [insumos, setInsumos] = useState<Insumo[]>(loadStock);

  useEffect(() => {
    saveStock(insumos);
  }, [insumos]);

  // Consumo automático quando um pedido é confirmado
  const consumeInsumos = useCallback((items: ConsumoItem[]) => {
    setInsumos(prev => {
      const updated = [...prev];
      items.forEach(item => {
        const key = getInsumosMappingKey(item.nome, item.categoria);
        const recipe = productInsumos[key] || productInsumos['default'];
        recipe.forEach(({ insumoId, quantidade }) => {
          const idx = updated.findIndex(i => i.id === insumoId);
          if (idx >= 0) {
            const totalConsumo = quantidade * item.quantidade;
            updated[idx] = {
              ...updated[idx],
              quantidadeAtual: Math.max(0, updated[idx].quantidadeAtual - totalConsumo),
            };
          }
        });
      });
      return updated;
    });
  }, []);

  // Repor estoque manualmente (admin) — entrada de mercadoria
  const restock = useCallback((insumoId: string, quantidade: number) => {
    setInsumos(prev => prev.map(i =>
      i.id === insumoId
        ? { ...i, quantidadeAtual: i.quantidadeAtual + quantidade }
        : i
    ));
  }, []);

  // Retirar/descartar estoque manualmente — perda, validade, quebra etc.
  // (Diferente de consumeInsumos: aqui é uma baixa manual, não ligada a um pedido)
  const discardStock = useCallback((insumoId: string, quantidade: number, motivo?: string) => {
    setInsumos(prev => prev.map(i =>
      i.id === insumoId
        ? { ...i, quantidadeAtual: Math.max(0, i.quantidadeAtual - quantidade) }
        : i
    ));
    // Aqui poderíamos logar o motivo em um histórico futuramente
  }, []);

  const resetStock = useCallback(() => {
    setInsumos(insumosIniciais);
  }, []);

  const getStockPercent = useCallback((insumo: Insumo) => {
    const max = insumo.quantidadeMinima * 4;
    return Math.min(100, Math.round((insumo.quantidadeAtual / max) * 100));
  }, []);

  const getStockStatus = useCallback((insumo: Insumo): 'ok' | 'low' | 'critical' | 'out' => {
    if (insumo.quantidadeAtual <= 0)                              return 'out';
    if (insumo.quantidadeAtual <= insumo.quantidadeMinima * 0.5) return 'critical';
    if (insumo.quantidadeAtual <= insumo.quantidadeMinima)       return 'low';
    return 'ok';
  }, []);

  const lowStockItems    = insumos.filter(i => getStockStatus(i) === 'low' || getStockStatus(i) === 'critical');
  const outOfStockItems  = insumos.filter(i => getStockStatus(i) === 'out');
  const totalStockValue  = insumos.reduce((sum, i) => sum + i.quantidadeAtual * i.custoUnitario, 0);

  return (
    <InsumoContext.Provider value={{
      insumos,
      lowStockItems,
      outOfStockItems,
      consumeInsumos,
      restock,
      discardStock,
      resetStock,
      getStockPercent,
      getStockStatus,
      totalStockValue,
    }}>
      {children}
    </InsumoContext.Provider>
  );
}

export function useInsumos() {
  const ctx = useContext(InsumoContext);
  if (!ctx) throw new Error('useInsumos must be used within InsumoProvider');
  return ctx;
}