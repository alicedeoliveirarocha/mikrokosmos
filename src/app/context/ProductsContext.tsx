// src/app/context/ProductsContext.tsx
// ═══════════════════════════════════════════════════════════════
// O CARDÁPIO SAI DO CÓDIGO E VAI PRO BANCO 🍽️☁️
//   - Busca os pratos da tabela `products` do Supabase.
//   - As descrições vêm em jsonb multilíngue {"pt-BR", "en", ...} e
//     este contexto resolve o idioma ativo NA HORA (troca de idioma
//     → cardápio re-resolve sozinho, sem reload).
//   - Realtime: admin edita um prato → cardápio de todo mundo atualiza.
//   - Fallback: se a rede/Supabase falhar, usa o products.ts estático
//     com as traduções dos JSONs — o app NUNCA fica sem cardápio.
// API: useProducts() → { products, allProducts, loading, refresh }
//   products    = só pratos ativos, já localizados (pro cardápio)
//   allProducts = tudo, inclusive inativos (pro painel do admin)
// ═══════════════════════════════════════════════════════════════
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { products as staticProducts, Product } from '../data/products';

// Linha crua da tabela products
export interface DbProductRow {
  id: string;
  nome: string;
  descricao: Record<string, string> | null;
  descricao_longa: Record<string, string> | null;
  preco: number | string;
  categoria: string;
  universo: string;
  culinaria?: string | null;
  image_url?: string | null;
  ingredientes?: string[] | null;
  alergenos?: string[] | null;
  nutricao?: Product['nutricao'] | null;
  ativo?: boolean | null;
}

export type MenuProduct = Product & { ativo: boolean };

interface ProductsContextType {
  products: MenuProduct[];     // ativos, localizados — o cardápio
  allProducts: MenuProduct[];  // tudo (admin vê inativos também)
  loading: boolean;
  refresh: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Resolve um campo multilíngue no idioma ativo:
// idioma exato → pt-BR → primeira tradução que existir → ''
function pick(obj: Record<string, string> | null | undefined, lang: string): string {
  if (!obj) return '';
  return obj[lang] ?? obj['pt-BR'] ?? Object.values(obj)[0] ?? '';
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState<DbProductRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    if (!error && data && data.length > 0) {
      setRows(data as DbProductRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();

    // Admin edita um prato → o cardápio de todos atualiza ao vivo
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Recalcula quando os dados OU o idioma mudam
  const allProducts: MenuProduct[] = useMemo(() => {
    const lang = i18n.language;

    if (rows) {
      return rows.map((r) => ({
        id: r.id,
        nome: r.nome, // marca — nunca traduz
        desc: pick(r.descricao, lang),
        descLonga: pick(r.descricao_longa, lang),
        preco: Number(r.preco),
        categoria: r.categoria,
        universo: r.universo as Product['universo'],
        culinaria: (r.culinaria ?? undefined) as Product['culinaria'],
        imageUrl: r.image_url ?? 'yakisoba-frango',
        nutricao: r.nutricao ?? { calorias: 0, proteinas: '0g', carboidratos: '0g', gorduras: '0g' },
        ingredientes: r.ingredientes ?? [],
        alergenos: r.alergenos && r.alergenos.length > 0 ? r.alergenos : undefined,
        ativo: r.ativo !== false,
      }));
    }

    // Fallback estático: traduções via JSONs, como sempre foi
    return staticProducts.map((p) => ({
      ...p,
      desc: t(`products.${p.id}`, { defaultValue: p.desc }),
      descLonga: t(`productsLong.${p.id}`, { defaultValue: p.descLonga }),
      ativo: true,
    }));
  }, [rows, i18n.language, t]);

  const products = useMemo(() => allProducts.filter((p) => p.ativo), [allProducts]);

  return (
    <ProductsContext.Provider value={{ products, allProducts, loading, refresh: load }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within ProductsProvider');
  return context;
}

export type { Product };