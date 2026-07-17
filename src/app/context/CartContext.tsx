// src/app/context/CartContext.tsx
// ═══════════════════════════════════════════════════════════════
// Carrinho HÍBRIDO — a tabela cart_items finalmente sai da solidão:
//   - Visitante (sem login): carrinho no localStorage, como antes.
//   - Logado: carrinho no Supabase (tabela cart_items) → sobrevive a
//     fechar a aba e sincroniza entre celular/computador.
//   - No login: o carrinho de visitante é FUNDIDO com o da nuvem
//     (soma quantidades) e o localStorage é limpo.
// API pública idêntica à anterior — nenhum outro componente muda.
// ═══════════════════════════════════════════════════════════════
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  nome: string;
  desc: string;
  preco: number;
  categoria: string;
  imageUrl: string;
  quantidade: number;
  [key: string]: any;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantidade'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_KEY = 'mikrokosmos_cart';

function safeParse(raw: string): CartItem[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// Uma linha da tabela = um produto no carrinho do usuário.
// product_data guarda o produto inteiro (jsonb); quantidade separada.
function rowToItem(row: any): CartItem {
  return { ...(row.product_data as object), quantidade: row.quantidade } as CartItem;
}

function upsertRow(userId: string, item: CartItem) {
  const { quantidade, ...productData } = item;
  return supabase.from('cart_items').upsert(
    {
      user_id: userId,
      product_id: item.id,
      product_data: productData,
      quantidade,
    },
    { onConflict: 'user_id,product_id' }
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const readyRef = useRef(false); // evita gravar antes de carregar

  // ── Carregamento: visitante lê o localStorage; logado lê o Supabase
  // (fundindo o carrinho de visitante, se existir) ──
  useEffect(() => {
    readyRef.current = false;
    let cancel = false;

    if (!user) {
      const stored = localStorage.getItem(LOCAL_KEY);
      setItems(stored ? safeParse(stored) : []);
      readyRef.current = true;
      return;
    }

    (async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (cancel) return;
      let remote: CartItem[] = !error && data ? data.map(rowToItem) : [];

      // Fusão: itens escolhidos antes do login entram no carrinho da nuvem
      const stored = localStorage.getItem(LOCAL_KEY);
      const local = stored ? safeParse(stored) : [];
      if (local.length) {
        for (const li of local) {
          const ex = remote.find(r => r.id === li.id);
          if (ex) ex.quantidade += li.quantidade;
          else remote.push(li);
        }
        localStorage.removeItem(LOCAL_KEY);
        await Promise.all(remote.map(it => upsertRow(user.id, it)));
      }

      if (!cancel) {
        setItems(remote);
        readyRef.current = true;
      }
    })();

    return () => {
      cancel = true;
    };
  }, [user?.id]);

  // ── Persistência por operação ──
  const persistItem = (item: CartItem) => {
    if (!readyRef.current) return;
    if (user) upsertRow(user.id, item);
  };

  const persistRemove = (productId: string) => {
    if (!readyRef.current) return;
    if (user) {
      supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .then(() => {});
    }
  };

  const persistLocal = (next: CartItem[]) => {
    if (!user) localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  };

  const addToCart = (product: Omit<CartItem, 'quantidade'>, quantity = 1) => {
    setItems(current => {
      const existing = current.find(item => item.id === product.id);
      const next = existing
        ? current.map(item =>
            item.id === product.id
              ? { ...item, quantidade: item.quantidade + quantity }
              : item
          )
        : [...current, { ...product, quantidade: quantity } as CartItem];

      const changed = next.find(i => i.id === product.id)!;
      persistItem(changed);
      persistLocal(next);
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(current => {
      const next = current.filter(item => item.id !== productId);
      persistRemove(productId);
      persistLocal(next);
      return next;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(current => {
      const next = current.map(item =>
        item.id === productId ? { ...item, quantidade: quantity } : item
      );
      const changed = next.find(i => i.id === productId);
      if (changed) persistItem(changed);
      persistLocal(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      supabase.from('cart_items').delete().eq('user_id', user.id).then(() => {});
    } else {
      localStorage.removeItem(LOCAL_KEY);
    }
  };

  const total = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}