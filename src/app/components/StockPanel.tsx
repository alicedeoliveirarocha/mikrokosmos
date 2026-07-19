// src/app/components/StockPanel.tsx
import { useState } from 'react';
import { useInsumos } from '../context/InsumoContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Plus, Minus, RotateCcw, TrendingDown, Warehouse } from 'lucide-react';
import { useCurrency } from '../../lib/currency';

const MOTIVO_KEYS = ['perda', 'vencido', 'quebra', 'outro'] as const;
const MOTIVO_CANONICAL: Record<string, string> = {
  perda: 'Perda', vencido: 'Vencido', quebra: 'Quebra', outro: 'Outro',
};

export function StockPanel() {
  const { insumos, lowStockItems, outOfStockItems, restock, discardStock, resetStock, getStockPercent, getStockStatus, totalStockValue } = useInsumos();
  const { t } = useTranslation();
  const { format } = useCurrency(); // FIX moeda: valor do estoque e custo unitário na moeda do idioma
  const [restockQtd, setRestockQtd] = useState<Record<string, string>>({});
  const [discardQtd, setDiscardQtd] = useState<Record<string, string>>({});
  const [discardMotivo, setDiscardMotivo] = useState<Record<string, string>>({});
  const [filterCat, setFilterCat] = useState<string>('all');

  const categories = ['all', 'proteina', 'vegetal', 'grao', 'molho', 'bebida', 'embalagem', 'outro'];

  const statusColor: Record<string, string> = {
    ok: '#4CAF50', low: '#FF9800', critical: '#FF5722', out: '#f44336',
  };

  const filtered = insumos.filter(i => filterCat === 'all' || i.categoria === filterCat);

  const handleRestock = (id: string) => {
    const qty = parseFloat(restockQtd[id] || '0');
    if (qty > 0) { restock(id, qty); setRestockQtd(prev => ({ ...prev, [id]: '' })); }
  };

  const handleDiscard = (id: string) => {
    const qty = parseFloat(discardQtd[id] || '0');
    if (qty > 0) {
      const motivoKey = discardMotivo[id] || 'outro';
      discardStock(id, qty, MOTIVO_CANONICAL[motivoKey] || 'Outro');
      setDiscardQtd(prev => ({ ...prev, [id]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Warehouse className="w-6 h-6" style={{ color: 'var(--primary-neon)' }} />
            {t('stock.title')}
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {t('stock.totalValue')} <span className="font-bold text-white">{format(totalStockValue)}</span>
          </p>
        </div>
        <button onClick={resetStock}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-sm">
          <RotateCcw className="w-4 h-4" /> {t('stock.resetBtn')}
        </button>
      </div>

      {(outOfStockItems.length > 0 || lowStockItems.length > 0) && (
        <div className="space-y-2">
          {outOfStockItems.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl border border-red-500/50 bg-red-500/10 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-bold text-sm">{t('stock.alerts.outTitle')}</p>
                <p className="text-red-300/80 text-xs mt-0.5">{outOfStockItems.map(i => i.emoji + ' ' + i.nome).join(' · ')}</p>
              </div>
            </motion.div>
          )}
          {lowStockItems.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl border border-orange-500/50 bg-orange-500/10 flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-orange-400 font-bold text-sm">{t('stock.alerts.lowTitle')}</p>
                <p className="text-orange-300/80 text-xs mt-0.5">{lowStockItems.map(i => i.emoji + ' ' + i.nome).join(' · ')}</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {(['ok', 'low', 'critical', 'out'] as const).map(s => (
          <div key={s} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold" style={{ color: statusColor[s] }}>
              {insumos.filter(i => getStockStatus(i) === s).length}
            </p>
            <p className="text-white/60 text-xs mt-1">{t(`stock.status.${s}`)}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              filterCat === cat ? 'text-black border-transparent' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
            }`}
            style={filterCat === cat ? { backgroundColor: 'var(--primary-neon)' } : {}}>
            {t(`stock.categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((insumo, i) => {
            const status = getStockStatus(insumo);
            const percent = getStockPercent(insumo);
            const color = statusColor[status];
            return (
              <motion.div key={insumo.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{insumo.emoji}</span>
                    <div>
                      <p className="text-white font-bold text-sm">{insumo.nome}</p>
                      <p className="text-white/40 text-xs">{format(insumo.custoUnitario)}/{insumo.unidade}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-sm" style={{ color }}>
                        {insumo.quantidadeAtual.toFixed(1)} {insumo.unidade}
                      </p>
                      <p className="text-white/40 text-xs">mín: {insumo.quantidadeMinima} {insumo.unidade}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: color + '25', color, border: `1px solid ${color}60` }}>
                      {t(`stock.status.${status}`)}
                    </span>
                  </div>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                    initial={{ width: 0 }} animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6, delay: i * 0.03 }} />
                </div>

                <div className="flex gap-2 mb-2">
                  <input type="number" min="0" step="0.5"
                    value={restockQtd[insumo.id] || ''}
                    onChange={e => setRestockQtd(prev => ({ ...prev, [insumo.id]: e.target.value }))}
                    placeholder={t('stock.restockPlaceholder', { unit: insumo.unidade })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-white/30" />
                  <button onClick={() => handleRestock(insumo.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                    style={{ backgroundColor: 'var(--primary-neon)' }}>
                    <Plus className="w-3 h-3" /> {t('stock.restockBtn')}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input type="number" min="0" step="0.5"
                    value={discardQtd[insumo.id] || ''}
                    onChange={e => setDiscardQtd(prev => ({ ...prev, [insumo.id]: e.target.value }))}
                    placeholder={t('stock.discardPlaceholder', { unit: insumo.unidade })}
                    className="flex-1 bg-white/5 border border-red-500/20 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-red-500/40" />
                  <select value={discardMotivo[insumo.id] || 'outro'}
                    onChange={e => setDiscardMotivo(prev => ({ ...prev, [insumo.id]: e.target.value }))}
                    className="bg-white/5 border border-red-500/20 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-red-500/40">
                    {MOTIVO_KEYS.map(m => (
                      <option key={m} value={m} className="bg-black">{t(`stock.reasons.${m}`)}</option>
                    ))}
                  </select>
                  <button onClick={() => handleDiscard(insumo.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 transition-colors">
                    <Minus className="w-3 h-3" /> {t('stock.discardBtn')}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}