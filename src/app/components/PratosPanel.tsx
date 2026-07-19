// src/app/components/PratosPanel.tsx
// ═══════════════════════════════════════════════════════════════
// PAINEL DE PRATOS 🍽️ — aba do Analytics onde o admin gerencia o
// cardápio: buscar, editar, ativar/desativar e criar pratos.
// Tudo direto no Supabase; o Realtime atualiza o cardápio de todos.
// ═══════════════════════════════════════════════════════════════
import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Pencil, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useProducts } from '../context/ProductsContext';
import { useCurrency } from '../../lib/currency';
import { getProductImage } from '../utils/productImages';
import { PratoEditorModal } from './PratoEditorModal';

export function PratosPanel() {
  const { t } = useTranslation();
  const { allProducts, refresh } = useProducts();
  const { format } = useCurrency();
  const [busca, setBusca] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtrados = allProducts.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirNovo = () => { setEditingId(null); setEditorOpen(true); };
  const abrirEdicao = (id: string) => { setEditingId(id); setEditorOpen(true); };

  // Liga/desliga o prato no cardápio — some/aparece pra todo mundo via Realtime
  const toggleAtivo = async (id: string, ativo: boolean) => {
    const { error } = await supabase.from('products').update({ ativo: !ativo }).eq('id', id);
    if (error) {
      toast.error(t('pratosPanel.saveError'));
      return;
    }
    toast.success(t('pratosPanel.saved'));
    refresh();
  };

  return (
    <div>
      {/* Cabeçalho do painel */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">🍽️ {t('pratosPanel.title')}</h2>
          <p className="text-white/60 text-sm">{t('pratosPanel.subtitle')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={abrirNovo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-black"
          style={{ backgroundColor: 'var(--primary-neon)' }}
        >
          <Plus className="w-4 h-4" /> {t('pratosPanel.newDish')}
        </motion.button>
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder={t('pratosPanel.search')}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* Lista de pratos */}
      <div className="space-y-3">
        {filtrados.map(p => (
          <div
            key={p.id}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
            style={{ opacity: p.ativo ? 1 : 0.5 }}
          >
            <img src={getProductImage(p.imageUrl)} alt={p.nome} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <p className="text-white font-bold truncate">{p.nome}</p>
              <p className="text-white/50 text-sm truncate">
                {t(`categories.${p.categoria}`, { defaultValue: p.categoria })} · {format(p.preco)}
              </p>
            </div>

            {/* Toggle ativo/inativo */}
            <button
              onClick={() => toggleAtivo(p.id, p.ativo)}
              className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0"
              style={p.ativo
                ? { backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.4)' }
                : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.15)' }}
            >
              {p.ativo ? t('pratosPanel.active') : t('pratosPanel.inactive')}
            </button>

            {/* Editar */}
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => abrirEdicao(p.id)}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border"
              style={{ borderColor: 'var(--primary-neon)', color: 'var(--primary-neon)' }}
              title={t('pratosPanel.editDish')}
            >
              <Pencil className="w-4 h-4" />
            </motion.button>
          </div>
        ))}

        {filtrados.length === 0 && (
          <p className="text-center text-white/40 py-10">{t('analytics.noData')}</p>
        )}
      </div>

      <PratoEditorModal
        open={editorOpen}
        productId={editingId}
        onClose={() => setEditorOpen(false)}
      />
    </div>
  );
}