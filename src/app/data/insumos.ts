// src/app/data/insumos.ts
// Insumos (ingredientes) do restaurante Mikrokosmos

export interface Insumo {
  id: string;
  nome: string;
  unidade: 'kg' | 'g' | 'L' | 'ml' | 'un' | 'cx';
  quantidadeAtual: number;
  quantidadeMinima: number; // alerta de estoque baixo
  custoUnitario: number;    // R$ por unidade
  categoria: 'proteina' | 'vegetal' | 'grao' | 'molho' | 'bebida' | 'embalagem' | 'outro';
  emoji: string;
}

export interface ProductInsumo {
  insumoId: string;
  quantidade: number; // quantidade consumida por porção
}

// ─── Estoque inicial ───────────────────────────────────────────────
export const insumosIniciais: Insumo[] = [
  // Proteínas
  { id: 'barriga-porco',  nome: 'Barriga de Porco',        unidade: 'kg',  quantidadeAtual: 12,  quantidadeMinima: 4,  custoUnitario: 42.00, categoria: 'proteina',  emoji: '🥩' },
  { id: 'file-mignon',    nome: 'Filé Mignon',              unidade: 'kg',  quantidadeAtual: 6,   quantidadeMinima: 2,  custoUnitario: 89.00, categoria: 'proteina',  emoji: '🥩' },
  { id: 'salmao',         nome: 'Salmão',                   unidade: 'kg',  quantidadeAtual: 5,   quantidadeMinima: 2,  custoUnitario: 65.00, categoria: 'proteina',  emoji: '🐟' },
  { id: 'frango',         nome: 'Frango',                   unidade: 'kg',  quantidadeAtual: 15,  quantidadeMinima: 5,  custoUnitario: 18.00, categoria: 'proteina',  emoji: '🍗' },

  // Vegetais & Grãos
  { id: 'pepino',         nome: 'Pepino',                   unidade: 'kg',  quantidadeAtual: 3,   quantidadeMinima: 2,  custoUnitario: 4.50,  categoria: 'vegetal',   emoji: '🥒' },
  { id: 'tteok',          nome: 'Tteok (Bolinho de Arroz)', unidade: 'kg',  quantidadeAtual: 8,   quantidadeMinima: 3,  custoUnitario: 22.00, categoria: 'grao',      emoji: '🍡' },
  { id: 'arroz-japones',  nome: 'Arroz Japonês',            unidade: 'kg',  quantidadeAtual: 20,  quantidadeMinima: 8,  custoUnitario: 14.00, categoria: 'grao',      emoji: '🍚' },
  { id: 'nori',           nome: 'Folha de Nori',            unidade: 'un',  quantidadeAtual: 200, quantidadeMinima: 50, custoUnitario: 0.80,  categoria: 'outro',     emoji: '🌿' },
  { id: 'farinha-panko',  nome: 'Farinha Panko',            unidade: 'kg',  quantidadeAtual: 7,   quantidadeMinima: 3,  custoUnitario: 11.00, categoria: 'outro',     emoji: '🌾' },

  // Molhos & Temperos
  { id: 'gochujang',      nome: 'Molho Gochujang',          unidade: 'L',   quantidadeAtual: 4,   quantidadeMinima: 2,  custoUnitario: 28.00, categoria: 'molho',     emoji: '🌶️' },
  { id: 'shoyu',          nome: 'Molho Shoyu',              unidade: 'L',   quantidadeAtual: 6,   quantidadeMinima: 2,  custoUnitario: 12.00, categoria: 'molho',     emoji: '🫙' },
  { id: 'vinagre-arroz',  nome: 'Vinagre de Arroz',         unidade: 'L',   quantidadeAtual: 3,   quantidadeMinima: 1,  custoUnitario: 8.50,  categoria: 'molho',     emoji: '🍶' },
  { id: 'oleo-gergelim',  nome: 'Óleo de Gergelim',         unidade: 'L',   quantidadeAtual: 2,   quantidadeMinima: 1,  custoUnitario: 32.00, categoria: 'molho',     emoji: '🫙' },
  { id: 'doce-leite',     nome: 'Doce de Leite',            unidade: 'kg',  quantidadeAtual: 4,   quantidadeMinima: 2,  custoUnitario: 14.00, categoria: 'outro',     emoji: '🥛' },

  // Bebidas
  { id: 'xarope-frutas',  nome: 'Xarope de Frutas',         unidade: 'L',   quantidadeAtual: 8,   quantidadeMinima: 3,  custoUnitario: 15.00, categoria: 'bebida',    emoji: '🍹' },
  { id: 'cha-verde',      nome: 'Chá Verde (granel)',        unidade: 'kg',  quantidadeAtual: 2,   quantidadeMinima: 0.5,custoUnitario: 45.00, categoria: 'bebida',    emoji: '🍵' },

  // Embalagens
  { id: 'caixa-bento',    nome: 'Caixa Bento',              unidade: 'un',  quantidadeAtual: 150, quantidadeMinima: 30, custoUnitario: 2.50,  categoria: 'embalagem', emoji: '📦' },
  { id: 'palito',         nome: 'Hashis (par)',              unidade: 'un',  quantidadeAtual: 500, quantidadeMinima: 100,custoUnitario: 0.30,  categoria: 'embalagem', emoji: '🥢' },
];

// ─── Estoque inicial — Unidade Pinheiros ───────────────────────────
// Distribuição diferente de propósito: Pinheiros tem sobra de Salmão e Filé
// (perto de fornecedores de peixe/carne nobre) mas pouco Frango; serve para
// a demo de "Transferir estoque entre unidades" fazer sentido de fato.
export const insumosIniciaisPinheiros: Insumo[] = [
  { id: 'barriga-porco',  nome: 'Barriga de Porco',        unidade: 'kg',  quantidadeAtual: 9,   quantidadeMinima: 4,  custoUnitario: 42.00, categoria: 'proteina',  emoji: '🥩' },
  { id: 'file-mignon',    nome: 'Filé Mignon',              unidade: 'kg',  quantidadeAtual: 14,  quantidadeMinima: 2,  custoUnitario: 89.00, categoria: 'proteina',  emoji: '🥩' },
  { id: 'salmao',         nome: 'Salmão',                   unidade: 'kg',  quantidadeAtual: 17,  quantidadeMinima: 2,  custoUnitario: 65.00, categoria: 'proteina',  emoji: '🐟' },
  { id: 'frango',         nome: 'Frango',                   unidade: 'kg',  quantidadeAtual: 3,   quantidadeMinima: 5,  custoUnitario: 18.00, categoria: 'proteina',  emoji: '🍗' },
  { id: 'pepino',         nome: 'Pepino',                   unidade: 'kg',  quantidadeAtual: 5,   quantidadeMinima: 2,  custoUnitario: 4.50,  categoria: 'vegetal',   emoji: '🥒' },
  { id: 'tteok',          nome: 'Tteok (Bolinho de Arroz)', unidade: 'kg',  quantidadeAtual: 4,   quantidadeMinima: 3,  custoUnitario: 22.00, categoria: 'grao',      emoji: '🍡' },
  { id: 'arroz-japones',  nome: 'Arroz Japonês',            unidade: 'kg',  quantidadeAtual: 11,  quantidadeMinima: 8,  custoUnitario: 14.00, categoria: 'grao',      emoji: '🍚' },
  { id: 'nori',           nome: 'Folha de Nori',            unidade: 'un',  quantidadeAtual: 340, quantidadeMinima: 50, custoUnitario: 0.80,  categoria: 'outro',     emoji: '🌿' },
  { id: 'farinha-panko',  nome: 'Farinha Panko',            unidade: 'kg',  quantidadeAtual: 2,   quantidadeMinima: 3,  custoUnitario: 11.00, categoria: 'outro',     emoji: '🌾' },
  { id: 'gochujang',      nome: 'Molho Gochujang',          unidade: 'L',   quantidadeAtual: 3,   quantidadeMinima: 2,  custoUnitario: 28.00, categoria: 'molho',     emoji: '🌶️' },
  { id: 'shoyu',          nome: 'Molho Shoyu',              unidade: 'L',   quantidadeAtual: 9,   quantidadeMinima: 2,  custoUnitario: 12.00, categoria: 'molho',     emoji: '🫙' },
  { id: 'vinagre-arroz',  nome: 'Vinagre de Arroz',         unidade: 'L',   quantidadeAtual: 4,   quantidadeMinima: 1,  custoUnitario: 8.50,  categoria: 'molho',     emoji: '🍶' },
  { id: 'oleo-gergelim',  nome: 'Óleo de Gergelim',         unidade: 'L',   quantidadeAtual: 5,   quantidadeMinima: 1,  custoUnitario: 32.00, categoria: 'molho',     emoji: '🫙' },
  { id: 'doce-leite',     nome: 'Doce de Leite',            unidade: 'kg',  quantidadeAtual: 3,   quantidadeMinima: 2,  custoUnitario: 14.00, categoria: 'outro',     emoji: '🥛' },
  { id: 'xarope-frutas',  nome: 'Xarope de Frutas',         unidade: 'L',   quantidadeAtual: 6,   quantidadeMinima: 3,  custoUnitario: 15.00, categoria: 'bebida',    emoji: '🍹' },
  { id: 'cha-verde',      nome: 'Chá Verde (granel)',        unidade: 'kg',  quantidadeAtual: 1.5, quantidadeMinima: 0.5,custoUnitario: 45.00, categoria: 'bebida',    emoji: '🍵' },
  { id: 'caixa-bento',    nome: 'Caixa Bento',              unidade: 'un',  quantidadeAtual: 90,  quantidadeMinima: 30, custoUnitario: 2.50,  categoria: 'embalagem', emoji: '📦' },
  { id: 'palito',         nome: 'Hashis (par)',              unidade: 'un',  quantidadeAtual: 280, quantidadeMinima: 100,custoUnitario: 0.30,  categoria: 'embalagem', emoji: '🥢' },
];

// ─── Mapeamento Produto → Insumos consumidos ───────────────────────
// Baseado nos nomes/categorias dos produtos do cardápio
// quantidade = por 1 porção (1 unidade do produto)
export const productInsumos: Record<string, ProductInsumo[]> = {
  // Pratos de carne/porco (ex: Samgyeopsal)
  'samgyeopsal': [
    { insumoId: 'barriga-porco', quantidade: 0.35 },
    { insumoId: 'arroz-japones', quantidade: 0.15 },
    { insumoId: 'shoyu',         quantidade: 0.05 },
    { insumoId: 'oleo-gergelim', quantidade: 0.02 },
    { insumoId: 'palito',        quantidade: 2 },
  ],
  // Tteokbokki
  'tteokbokki': [
    { insumoId: 'tteok',         quantidade: 0.25 },
    { insumoId: 'gochujang',     quantidade: 0.08 },
    { insumoId: 'caixa-bento',   quantidade: 1 },
    { insumoId: 'palito',        quantidade: 2 },
  ],
  // Sunomono
  'sunomono': [
    { insumoId: 'pepino',        quantidade: 0.2 },
    { insumoId: 'vinagre-arroz', quantidade: 0.05 },
    { insumoId: 'shoyu',         quantidade: 0.03 },
    { insumoId: 'oleo-gergelim', quantidade: 0.01 },
  ],
  // Sushi / Pratos com arroz japonês
  'sushi': [
    { insumoId: 'arroz-japones', quantidade: 0.2 },
    { insumoId: 'salmao',        quantidade: 0.1 },
    { insumoId: 'nori',          quantidade: 3 },
    { insumoId: 'vinagre-arroz', quantidade: 0.03 },
    { insumoId: 'palito',        quantidade: 2 },
  ],
  // Steak / Filé
  'steak': [
    { insumoId: 'file-mignon',   quantidade: 0.3 },
    { insumoId: 'shoyu',         quantidade: 0.04 },
    { insumoId: 'arroz-japones', quantidade: 0.1 },
  ],
  // Frango frito / Karaage
  'karaage': [
    { insumoId: 'frango',        quantidade: 0.25 },
    { insumoId: 'farinha-panko', quantidade: 0.08 },
    { insumoId: 'shoyu',         quantidade: 0.05 },
  ],
  // Sobremesas
  'sobremesa': [
    { insumoId: 'doce-leite',    quantidade: 0.08 },
    { insumoId: 'caixa-bento',   quantidade: 1 },
  ],
  // Bebidas
  'bebida': [
    { insumoId: 'xarope-frutas', quantidade: 0.05 },
  ],
  // Combos (genérico)
  'combo': [
    { insumoId: 'arroz-japones', quantidade: 0.15 },
    { insumoId: 'caixa-bento',   quantidade: 1 },
    { insumoId: 'palito',        quantidade: 2 },
  ],
  // Default para qualquer produto não mapeado
  'default': [
    { insumoId: 'caixa-bento',   quantidade: 1 },
    { insumoId: 'palito',        quantidade: 2 },
  ],
};

// Helper: detecta qual mapeamento usar baseado no nome do produto
export function getInsumosMappingKey(productName: string, categoria: string): string {
  const name = productName.toLowerCase();
  const cat  = categoria.toLowerCase();

  if (name.includes('samgyeopsal') || name.includes('porco')) return 'samgyeopsal';
  if (name.includes('tteokbokki') || name.includes('tteok'))  return 'tteokbokki';
  if (name.includes('sunomono') || name.includes('pepino'))    return 'sunomono';
  if (name.includes('sushi') || name.includes('maki') || name.includes('nigiri')) return 'sushi';
  if (name.includes('steak') || name.includes('filé') || name.includes('bife'))   return 'steak';
  if (name.includes('karaage') || name.includes('katsu') || name.includes('frito')) return 'karaage';
  if (cat === 'sobremesas') return 'sobremesa';
  if (cat === 'bebidas')    return 'bebida';
  if (cat === 'combos')     return 'combo';
  return 'default';
}