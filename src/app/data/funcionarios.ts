// src/app/data/funcionarios.ts
import { UnidadeId } from './unidades';

export type Cargo = 'Gerente' | 'Cozinha' | 'Garçom' | 'Caixa' | 'Delivery' | 'Limpeza';

export interface Funcionario {
  id: string;
  nome: string;
  cargo: Cargo;
  unidade: UnidadeId;
  avatarEmoji: string;
  avatarColor: string;
  telefone?: string;
  dataAdmissao: string; // 'YYYY-MM-DD'
  status: 'ativo' | 'inativo';
  // Vínculo opcional com uma conta real do Supabase Auth (tabela `profiles`).
  // Quando presente, este funcionário também é um usuário autenticado do sistema.
  profileId?: string;
}

export const CARGOS: Cargo[] = ['Gerente', 'Cozinha', 'Garçom', 'Caixa', 'Delivery', 'Limpeza'];

export const AVATAR_EMOJIS = ['👤', '👨‍🍳', '👩‍🍳', '🧑‍💼', '👨‍💼', '👩‍💼', '🛵', '🧑‍🔧', '🧹', '🧑'];

export const AVATAR_COLORS = ['#E50914', '#FF6B35', '#9B59B6', '#3498DB', '#1ABC9C', '#F39C12', '#E91E63'];

export const funcionariosIniciais: Funcionario[] = [
  { id: 'f1', nome: 'Renata Souza',    cargo: 'Gerente',  unidade: 'vila-mariana', avatarEmoji: '👩‍💼', avatarColor: '#E50914', telefone: '(11) 98888-1001', dataAdmissao: '2023-03-10', status: 'ativo' },
  { id: 'f2', nome: 'Bruno Tanaka',    cargo: 'Cozinha',  unidade: 'vila-mariana', avatarEmoji: '👨‍🍳', avatarColor: '#FF6B35', telefone: '(11) 98888-1002', dataAdmissao: '2023-05-22', status: 'ativo' },
  { id: 'f3', nome: 'Carla Mendes',    cargo: 'Garçom',   unidade: 'vila-mariana', avatarEmoji: '🧑‍💼', avatarColor: '#3498DB', telefone: '(11) 98888-1003', dataAdmissao: '2024-01-15', status: 'ativo' },
  { id: 'f4', nome: 'Diego Ferreira',  cargo: 'Delivery', unidade: 'vila-mariana', avatarEmoji: '🛵',   avatarColor: '#1ABC9C', telefone: '(11) 98888-1004', dataAdmissao: '2024-02-01', status: 'ativo' },
  { id: 'f5', nome: 'Yuna Park',       cargo: 'Cozinha',  unidade: 'pinheiros',    avatarEmoji: '👩‍🍳', avatarColor: '#9B59B6', telefone: '(11) 98888-1005', dataAdmissao: '2024-06-03', status: 'ativo' },
  { id: 'f6', nome: 'Felipe Lima',     cargo: 'Caixa',    unidade: 'pinheiros',    avatarEmoji: '🧑‍💼', avatarColor: '#F39C12', telefone: '(11) 98888-1006', dataAdmissao: '2024-07-19', status: 'ativo' },
  { id: 'f7', nome: 'Marina Costa',    cargo: 'Limpeza',  unidade: 'pinheiros',    avatarEmoji: '🧹',   avatarColor: '#E91E63', telefone: '(11) 98888-1007', dataAdmissao: '2024-09-12', status: 'inativo' },
];