// src/app/components/PratoEditorModal.tsx
// ═══════════════════════════════════════════════════════════════
// EDITOR DE PRATOS 🍽️✏️ — o coração do painel admin do cardápio.
// Edita/cria pratos direto na tabela products do Supabase, incluindo
// as TRADUÇÕES das descrições (jsonb multilíngue, 6 idiomas).
// Usado em DOIS lugares: aba "Pratos" do Analytics e botão de editar
// no ProductDetail (só admin). O RLS garante: se um não-admin tentar
// salvar, o banco recusa.
// Regras do projeto respeitadas: nome é marca (não traduz), preço
// sempre em BRL no dado (conversão só na exibição).
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useProducts } from '../context/ProductsContext';
import { getProductImage } from '../utils/productImages';

const LANGS = ['pt-BR', 'en', 'es', 'ko', 'ja', 'zh'] as const;
const LANG_LABELS: Record<string, string> = {
  'pt-BR': '🇧🇷 PT', en: '🇺🇸 EN', es: '🇪🇸 ES', ko: '🇰🇷 KO', ja: '🇯🇵 JA', zh: '🇨🇳 ZH',
};

const UNIVERSOS = [
  'both', 'aespa', 'bts', 'blackpink', 'enhypen', 'redvelvet', 'newjeans', 'illit',
  'starwars', 'marvel', 'spiderman', 'meangirls', 'interstellar',
];
const UNIVERSO_LABELS: Record<string, string> = {
  aespa: 'aespa', bts: 'BTS', blackpink: 'BLACKPINK', enhypen: 'ENHYPEN',
  redvelvet: 'Red Velvet', newjeans: 'NewJeans', illit: 'ILLIT',
  starwars: 'Star Wars', marvel: 'Marvel', spiderman: 'Spider-Man',
  meangirls: 'Mean Girls', interstellar: 'Interstellar',
};

const CULINARIAS = ['coreana', 'japonesa', 'fusion', 'ocidental', 'internacional'];

const IMAGENS = [
  'yakisoba-frango', 'x-burguer-katsu', 'pink-drink', 'sunomono', 'salmao-grelhado',
  'joy-roll', 'asinhas-copa', 'drink-hexa', 'cheesecake-coracao', 'bibimbap-comeback',
  'soda-brilhante', 'pipoca-horror', 'drink-sangrento',
];

interface FormState {
  id: string;
  nome: string;
  preco: string;
  categoria: string;
  universo: string;
  culinaria: string;
  image_url: string;
  ativo: boolean;
  ingredientes: string;
  alergenos: string;
  calorias: string;
  proteinas: string;
  carboidratos: string;
  gorduras: string;
  descricao: Record<string, string>;
  descricao_longa: Record<string, string>;
}

const emptyLangs = () => Object.fromEntries(LANGS.map(L => [L, ''])) as Record<string, string>;

const blankForm = (): FormState => ({
  id: `custom-${Date.now().toString(36)}`,
  nome: '',
  preco: '',
  categoria: 'Pratos Principais',
  universo: 'both',
  culinaria: '',
  image_url: 'yakisoba-frango',
  ativo: true,
  ingredientes: '',
  alergenos: '',
  calorias: '0',
  proteinas: '0g',
  carboidratos: '0g',
  gorduras: '0g',
  descricao: emptyLangs(),
  descricao_longa: emptyLangs(),
});

interface PratoEditorModalProps {
  open: boolean;
  productId?: string | null; // null/undefined = criar prato novo
  onClose: () => void;
}

export function PratoEditorModal({ open, productId, onClose }: PratoEditorModalProps) {
  const { t } = useTranslation();
  const { refresh, allProducts } = useProducts();
  const [form, setForm] = useState<FormState>(blankForm());
  const [langTab, setLangTab] = useState<string>('pt-BR');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const categorias = Array.from(new Set(allProducts.map(p => p.categoria)));

  // Carrega a linha CRUA do banco (com o jsonb de traduções completo)
  useEffect(() => {
    if (!open) return;
    setLangTab('pt-BR');
    if (!productId) {
      setForm(blankForm());
      return;
    }
    setLoading(true);
    supabase.from('products').select('*').eq('id', productId).single().then(({ data }) => {
      if (data) {
        setForm({
          id: data.id,
          nome: data.nome ?? '',
          preco: String(data.preco ?? ''),
          categoria: data.categoria ?? '',
          universo: data.universo ?? 'both',
          culinaria: data.culinaria ?? '',
          image_url: data.image_url ?? 'yakisoba-frango',
          ativo: data.ativo !== false,
          ingredientes: (data.ingredientes ?? []).join(', '),
          alergenos: (data.alergenos ?? []).join(', '),
          calorias: String(data.nutricao?.calorias ?? '0'),
          proteinas: data.nutricao?.proteinas ?? '0g',
          carboidratos: data.nutricao?.carboidratos ?? '0g',
          gorduras: data.nutricao?.gorduras ?? '0g',
          descricao: { ...emptyLangs(), ...(data.descricao ?? {}) },
          descricao_longa: { ...emptyLangs(), ...(data.descricao_longa ?? {}) },
        });
      }
      setLoading(false);
    });
  }, [open, productId]);

  const set = (patch: Partial<FormState>) => setForm(f => ({ ...f, ...patch }));

  const handleSave = async () => {
    if (!form.nome.trim() || !form.preco) {
      toast.error(t('pratosPanel.saveError'));
      return;
    }
    setSaving(true);
    const parseList = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);

    const { error } = await supabase.from('products').upsert({
      id: form.id,
      nome: form.nome.trim(),
      preco: parseFloat(form.preco.replace(',', '.')),
      categoria: form.categoria.trim(),
      universo: form.universo,
      culinaria: form.culinaria || null,
      image_url: form.image_url,
      ativo: form.ativo,
      ingredientes: parseList(form.ingredientes),
      alergenos: parseList(form.alergenos),
      nutricao: {
        calorias: parseInt(form.calorias) || 0,
        proteinas: form.proteinas,
        carboidratos: form.carboidratos,
        gorduras: form.gorduras,
      },
      descricao: form.descricao,
      descricao_longa: form.descricao_longa,
    });

    setSaving(false);
    if (error) {
      console.error(error);
      toast.error(t('pratosPanel.saveError'));
      return;
    }
    toast.success(t('pratosPanel.saved'));
    refresh(); // Realtime também avisa, mas o refresh deixa instantâneo
    onClose();
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors';
  const labelCls = 'block text-white/60 text-xs uppercase tracking-wider mb-1.5';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 p-6 md:p-8"
            style={{ backgroundColor: '#0c0c14', boxShadow: '0 25px 80px rgba(0,0,0,0.8)' }}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {productId ? t('pratosPanel.editDish') : t('pratosPanel.newDish')}
              </h2>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-10 h-10" style={{ color: 'var(--primary-neon)' }} />
                </motion.div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Nome + Preço */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t('pratosPanel.name')}</label>
                    <input className={inputCls} value={form.nome} onChange={e => set({ nome: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('pratosPanel.priceBRL')}</label>
                    <input className={inputCls} type="number" step="0.01" min="0" value={form.preco} onChange={e => set({ preco: e.target.value })} />
                  </div>
                </div>

                {/* Categoria + Universo + Culinária */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>{t('pratosPanel.category')}</label>
                    <input className={inputCls} list="mk-categorias" value={form.categoria} onChange={e => set({ categoria: e.target.value })} />
                    <datalist id="mk-categorias">
                      {categorias.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div>
                    <label className={labelCls}>{t('pratosPanel.universe')}</label>
                    <select className={inputCls} value={form.universo} onChange={e => set({ universo: e.target.value })}>
                      {UNIVERSOS.map(u => (
                        <option key={u} value={u} className="bg-black">
                          {u === 'both' ? t('home.all') : UNIVERSO_LABELS[u] ?? u}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>{t('pratosPanel.cuisine')}</label>
                    <select className={inputCls} value={form.culinaria} onChange={e => set({ culinaria: e.target.value })}>
                      <option value="" className="bg-black">{t('pratosPanel.cuisineNone')}</option>
                      {CULINARIAS.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Imagem + Ativo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className={labelCls}>{t('pratosPanel.image')}</label>
                    <select className={inputCls} value={form.image_url} onChange={e => set({ image_url: e.target.value })}>
                      {IMAGENS.map(k => <option key={k} value={k} className="bg-black">{k}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={getProductImage(form.image_url)} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                    <button
                      onClick={() => set({ ativo: !form.ativo })}
                      className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border"
                      style={form.ativo
                        ? { backgroundColor: 'var(--primary-neon)', color: '#000', borderColor: 'transparent' }
                        : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)' }}
                    >
                      {form.ativo ? t('pratosPanel.active') : t('pratosPanel.inactive')}
                    </button>
                  </div>
                </div>

                {/* Ingredientes + Alérgenos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t('pratosPanel.ingredients')} <span className="normal-case text-white/30">({t('pratosPanel.ingredientsHint')})</span></label>
                    <input className={inputCls} value={form.ingredientes} onChange={e => set({ ingredientes: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('pratosPanel.allergens')} <span className="normal-case text-white/30">({t('pratosPanel.ingredientsHint')})</span></label>
                    <input className={inputCls} value={form.alergenos} onChange={e => set({ alergenos: e.target.value })} />
                  </div>
                </div>

                {/* Nutrição — labels reaproveitados do productDetail */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {([
                    ['calorias', 'calories'], ['proteinas', 'protein'], ['carboidratos', 'carbs'], ['gorduras', 'fat'],
                  ] as const).map(([field, key]) => (
                    <div key={field}>
                      <label className={labelCls}>{t(`productDetail.${key}`)}</label>
                      <input className={inputCls} value={form[field]} onChange={e => set({ [field]: e.target.value } as any)} />
                    </div>
                  ))}
                </div>

                {/* ═══ Traduções das descrições (o jsonb multilíngue) ═══ */}
                <div className="pt-2">
                  <p className="text-white font-bold mb-3">🌐 {t('pratosPanel.translations')}</p>
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {LANGS.map(L => (
                      <button
                        key={L}
                        onClick={() => setLangTab(L)}
                        className="px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border"
                        style={langTab === L
                          ? { backgroundColor: 'var(--primary-neon)', color: '#000', borderColor: 'transparent' }
                          : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)' }}
                      >
                        {LANG_LABELS[L]}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>{t('pratosPanel.shortDesc')} — {LANG_LABELS[langTab]}</label>
                      <input
                        className={inputCls}
                        value={form.descricao[langTab] ?? ''}
                        onChange={e => set({ descricao: { ...form.descricao, [langTab]: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t('pratosPanel.longDesc')} — {LANG_LABELS[langTab]}</label>
                      <textarea
                        rows={3}
                        className={inputCls}
                        value={form.descricao_longa[langTab] ?? ''}
                        onChange={e => set({ descricao_longa: { ...form.descricao_longa, [langTab]: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-all">
                    {t('pratosPanel.cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-[2] py-3.5 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    style={{ backgroundColor: 'var(--primary-neon)' }}
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {t('pratosPanel.save')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}