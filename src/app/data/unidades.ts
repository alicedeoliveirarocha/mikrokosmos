// src/app/data/unidades.ts
// Unidades (filiais) do restaurante Mikrokosmos

export type UnidadeId = 'vila-mariana' | 'pinheiros';

export interface Unidade {
  id: UnidadeId;
  nome: string;
  bairro: string;
  endereco: string;
  isMatriz: boolean;
}

export const unidades: Unidade[] = [
  {
    id: 'vila-mariana',
    nome: 'Mikrokosmos — Vila Mariana',
    bairro: 'Vila Mariana',
    endereco: 'Rua Domingos de Morais, 1.234',
    isMatriz: true,
  },
  {
    id: 'pinheiros',
    nome: 'Mikrokosmos — Pinheiros',
    bairro: 'Pinheiros',
    endereco: 'Rua Teodoro Sampaio, 567',
    isMatriz: false,
  },
];

export function getUnidade(id: UnidadeId): Unidade {
  return unidades.find(u => u.id === id) || unidades[0];
}