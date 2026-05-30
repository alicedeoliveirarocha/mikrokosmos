// src/lib/supabase.ts
// Arquivo de conexão com o Supabase — cria a pasta src/lib primeiro

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos baseados no banco que criamos
export type UserRole = 'cliente' | 'cozinha' | 'delivery' | 'admin';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  observacoes?: string;
  total: number;
  status: 'pendente' | 'preparando' | 'pronto' | 'saiu-para-entrega' | 'entregue' | 'cancelado';
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product: {
    id: string;
    nome: string;
    preco: number;
    categoria: string;
  };
  quantidade: number;
}
