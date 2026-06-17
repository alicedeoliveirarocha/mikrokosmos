// src/app/context/InsumoContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Insumo, insumosIniciais, insumosIniciaisPinheiros, productInsumos, getInsumosMappingKey } from '../data/insumos';
import { UnidadeId } from '../data/unidades';

const STORAGE_KEY = 'mikrokosmos_estoque';
const STORAGE_KEY_PINHEIROS = 'mikrokosmos_estoque_pinheiros';
const STORAGE_KEY_TRANSFERS = 'mikrokosmos_transferencias';

export interface Transferencia {
  id: string;
  insumoId: string;
  nomeInsumo: string;
  quantidade: number;
  unidadeMedida: string;
  de: UnidadeId;
  para: UnidadeId;
  timestamp: string; // ISO
}

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
  // ─── Unidades & Transferência de estoque ───
  insumosPinheiros: Insumo[];
  transferHistory: Transferencia[];
  totalStockValuePinheiros: number;
  transferStock: (insumoId: string, quantidade: number, de: UnidadeId, para: UnidadeId) => { success: boolean; message: string };
  resetUnidades: () => void;
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

function loadStockPinheiros(): Insumo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PINHEIROS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return insumosIniciaisPinheiros;
}

function saveStockPinheiros(insumos: Insumo[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PINHEIROS, JSON.stringify(insumos));
  } catch {}
}

function loadTransfers(): Transferencia[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSFERS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveTransfers(transfers: Transferencia[]) {
  try {
    localStorage.setItem(STORAGE_KEY_TRANSFERS, JSON.stringify(transfers));
  } catch {}
}

export function InsumoProvider({ children }: { children: ReactNode }) {
  const [insumos, setInsumos] = useState<Insumo[]>(loadStock);
  const [insumosPinheiros, setInsumosPinheiros] = useState<Insumo[]>(loadStockPinheiros);
  const [transferHistory, setTransferHistory] = useState<Transferencia[]>(loadTransfers);

  useEffect(() => {
    saveStock(insumos);
  }, [insumos]);

  useEffect(() => {
    saveStockPinheiros(insumosPinheiros);
  }, [insumosPinheiros]);

  useEffect(() => {
    saveTransfers(transferHistory);
  }, [transferHistory]);

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

  // Transferência de estoque entre unidades (Vila Mariana ↔ Pinheiros)
  const transferStock = useCallback((
    insumoId: string,
    quantidade: number,
    de: UnidadeId,
    para: UnidadeId
  ): { success: boolean; message: string } => {
    if (de === para) {
      return { success: false, message: 'Origem e destino não podem ser a mesma unidade.' };
    }
    if (quantidade <= 0) {
      return { success: false, message: 'Quantidade deve ser maior que zero.' };
    }

    const origemArray = de === 'vila-mariana' ? insumos : insumosPinheiros;
    const itemOrigem = origemArray.find(i => i.id === insumoId);

    if (!itemOrigem) {
      return { success: false, message: 'Insumo não encontrado na unidade de origem.' };
    }
    if (itemOrigem.quantidadeAtual < quantidade) {
      return {
        success: false,
        message: `Estoque insuficiente: a unidade de origem só tem ${itemOrigem.quantidadeAtual} ${itemOrigem.unidade}.`,
      };
    }

    // Subtrai da origem
    const aplicarSubtracao = (arr: Insumo[]) => arr.map(i =>
      i.id === insumoId ? { ...i, quantidadeAtual: i.quantidadeAtual - quantidade } : i
    );
    const aplicarAdicao = (arr: Insumo[]) => arr.map(i =>
      i.id === insumoId ? { ...i, quantidadeAtual: i.quantidadeAtual + quantidade } : i
    );

    if (de === 'vila-mariana') {
      setInsumos(prev => aplicarSubtracao(prev));
      setInsumosPinheiros(prev => aplicarAdicao(prev));
    } else {
      setInsumosPinheiros(prev => aplicarSubtracao(prev));
      setInsumos(prev => aplicarAdicao(prev));
    }

    setTransferHistory(prev => [
      {
        id: `t_${Date.now()}`,
        insumoId,
        nomeInsumo: itemOrigem.nome,
        quantidade,
        unidadeMedida: itemOrigem.unidade,
        de,
        para,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ].slice(0, 50)); // mantém só as 50 últimas

    return { success: true, message: `${quantidade} ${itemOrigem.unidade} de ${itemOrigem.nome} transferido(s) com sucesso!` };
  }, [insumos, insumosPinheiros]);

  const resetUnidades = useCallback(() => {
    setInsumos(insumosIniciais);
    setInsumosPinheiros(insumosIniciaisPinheiros);
    setTransferHistory([]);
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
  const totalStockValuePinheiros = insumosPinheiros.reduce((sum, i) => sum + i.quantidadeAtual * i.custoUnitario, 0);

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
      insumosPinheiros,
      transferHistory,
      totalStockValuePinheiros,
      transferStock,
      resetUnidades,
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