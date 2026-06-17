// src/app/components/UnidadesPanel.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, ArrowRightLeft, RotateCcw, History, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInsumos } from '../context/InsumoContext';
import { unidades, getUnidade, UnidadeId } from '../data/unidades';

export function UnidadesPanel() {
  const { t } = useTranslation();
  const {
    insumos,
    insumosPinheiros,
    totalStockValue,
    totalStockValuePinheiros,
    transferStock,
    transferHistory,
    resetUnidades,
  } = useInsumos();

  const [insumoSelecionado, setInsumoSelecionado] = useState(insumos[0]?.id || '');
  const [quantidade, setQuantidade] = useState('');
  const [de, setDe] = useState<UnidadeId>('pinheiros');
  const [para, setPara] = useState<UnidadeId>('vila-mariana');
  const [feedback, setFeedback] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null);

  const stockPorUnidade: Record<UnidadeId, typeof insumos> = {
    'vila-mariana': insumos,
    'pinheiros': insumosPinheiros,
  };

  const itemOrigem = stockPorUnidade[de].find(i => i.id === insumoSelecionado);

  const handleSwap = () => {
    setDe(para);
    setPara(de);
  };

  const handleTransferir = () => {
    const qtd = parseFloat(quantidade);
    if (!qtd || qtd <= 0) {
      setFeedback({ tipo: 'erro', texto: t('unidades.invalidQty') });
      return;
    }
    const resultado = transferStock(insumoSelecionado, qtd, de, para);
    setFeedback({ tipo: resultado.success ? 'ok' : 'erro', texto: resultado.message });
    if (resultado.success) setQuantidade('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6" style={{ color: 'var(--primary-neon)' }} />
            {t('unidades.title')}
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {t('unidades.subtitle')}
          </p>
        </div>
        <button
          onClick={resetUnidades}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" /> {t('unidades.resetButton')}
        </button>
      </div>

      {/* Comparativo das duas unidades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {unidades.map(u => (
          <div key={u.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-bold">{u.nome}</span>
              {u.isMatriz && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/20">
                  {t('unidades.matrizBadge')}
                </span>
              )}
            </div>
            <p className="text-white/40 text-xs mb-3">{u.endereco}</p>
            <p className="text-white/70 text-sm">
              {t('unidades.stockValue')} <span className="text-white font-bold">
                R$ {(u.id === 'vila-mariana' ? totalStockValue : totalStockValuePinheiros).toFixed(2)}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Formulário de transferência */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" style={{ color: 'var(--primary-neon)' }} />
          {t('unidades.transferTitle')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <select
            value={de}
            onChange={(e) => {
              const novaOrigem = e.target.value as UnidadeId;
              setDe(novaOrigem);
              if (novaOrigem === para) setPara(novaOrigem === 'vila-mariana' ? 'pinheiros' : 'vila-mariana');
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm"
          >
            {unidades.map(u => <option key={u.id} value={u.id}>{t('unidades.from')} {u.nome}</option>)}
          </select>

          <button
            onClick={handleSwap}
            className="mx-auto p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
            title={t('unidades.swapTitle')}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <select
            value={para}
            onChange={(e) => {
              const novoDestino = e.target.value as UnidadeId;
              setPara(novoDestino);
              if (novoDestino === de) setDe(novoDestino === 'vila-mariana' ? 'pinheiros' : 'vila-mariana');
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm"
          >
            {unidades.map(u => <option key={u.id} value={u.id}>{t('unidades.to')} {u.nome}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-3">
          <select
            value={insumoSelecionado}
            onChange={(e) => { setInsumoSelecionado(e.target.value); setFeedback(null); }}
            className="w-full px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm"
          >
            {insumos.map(i => (
              <option key={i.id} value={i.id}>{i.emoji} {i.nome}</option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            step="0.1"
            placeholder={t('unidades.qtyPlaceholder', { unit: itemOrigem?.unidade || '' })}
            value={quantidade}
            onChange={(e) => { setQuantidade(e.target.value); setFeedback(null); }}
            className="w-full px-3 py-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-sm placeholder:text-white/30"
          />

          <button
            onClick={handleTransferir}
            className="px-5 py-2.5 rounded-xl font-bold text-white text-sm whitespace-nowrap"
            style={{ backgroundColor: 'var(--primary-neon)' }}
          >
            {t('unidades.transferButton')}
          </button>
        </div>

        {itemOrigem && (
          <p className="text-white/40 text-xs">
            {t('unidades.availableIn', { unidade: getUnidade(de).nome.split('—')[1]?.trim() })}: <span className="text-white/70 font-semibold">{itemOrigem.quantidadeAtual} {itemOrigem.unidade}</span>
          </p>
        )}

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: feedback.tipo === 'ok' ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)',
                color: feedback.tipo === 'ok' ? '#4CAF50' : '#F44336',
              }}
            >
              {feedback.tipo === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {feedback.texto}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabela comparativa rápida (onde tem sobra / onde falta) */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto">
        <h3 className="text-white font-bold mb-3 text-sm">{t('unidades.quickComparison')}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/40 text-left text-xs">
              <th className="pb-2">{t('unidades.colInsumo')}</th>
              <th className="pb-2 text-right">Vila Mariana</th>
              <th className="pb-2 text-right">Pinheiros</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map(i => {
              const p = insumosPinheiros.find(x => x.id === i.id);
              const diffGrande = Math.abs(i.quantidadeAtual - (p?.quantidadeAtual || 0)) > i.quantidadeMinima;
              return (
                <tr key={i.id} className="border-t border-white/5">
                  <td className="py-1.5 text-white/80">{i.emoji} {i.nome}</td>
                  <td className={`py-1.5 text-right ${diffGrande && i.quantidadeAtual < (p?.quantidadeAtual || 0) ? 'text-orange-400' : 'text-white/60'}`}>
                    {i.quantidadeAtual} {i.unidade}
                  </td>
                  <td className={`py-1.5 text-right ${diffGrande && (p?.quantidadeAtual || 0) < i.quantidadeAtual ? 'text-orange-400' : 'text-white/60'}`}>
                    {p?.quantidadeAtual ?? '—'} {i.unidade}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Histórico de transferências */}
      {transferHistory.length > 0 && (
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
            <History className="w-4 h-4" style={{ color: 'var(--primary-neon)' }} />
            {t('unidades.historyTitle')}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transferHistory.map(th => (
              <div key={th.id} className="flex items-center justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                <span className="text-white/70">
                  {th.quantidade} {th.unidadeMedida} {t('unidades.of')} <span className="text-white">{th.nomeInsumo}</span>
                  {' '}— {getUnidade(th.de).nome.split('—')[1]?.trim()} → {getUnidade(th.para).nome.split('—')[1]?.trim()}
                </span>
                <span className="text-white/30 text-xs whitespace-nowrap ml-2">
                  {new Date(th.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}