// src/lib/supabase.ts
// Arquivo de conexão com o Supabase
// NOVO: Order.selected_route (rota escolhida) e courier_lat/lng/updated_at
// (posição GPS real do entregador) — tudo sincronizado via Realtime.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehsqzftkwpcuhmaimzas.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoc3F6ZnRrd3BjdWhtYWltemFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMTQ3NzMsImV4cCI6MjA5NTU5MDc3M30.cM4q75ec050Mt8X0Uq6d8h2CFgjLRvmQRMaxw-daNio';

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
  selected_route?: number; // índice da rota OSRM escolhida pelo entregador
  courier_lat?: number | null;        // posição REAL do entregador (GPS do celular)
  courier_lng?: number | null;
  courier_updated_at?: string | null; // frescor do GPS (expira em 2 min no mapa)
  payment_method?: 'pix' | 'dinheiro' | 'cartao' | 'boleto'; // slug — tradução na exibição
  payment_ref?: string; // últimos 4 do cartão ou código do boleto
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