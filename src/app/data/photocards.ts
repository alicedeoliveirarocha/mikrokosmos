export type Rarity = 'common' | 'rare' | 'ultra-rare';
export type GroupId = 'bts' | 'aespa' | 'enhypen' | 'blackpink' | 'redvelvet' | 'newjeans' | 'illit';

export interface Photocard {
  id: string;
  member: string;
  group: GroupId;
  groupName: string;
  era: string;
  rarity: Rarity;
  isPreDebut?: boolean;
  isGroupPhoto?: boolean;
  description: string;
  price: number;
  dropRate: number;
}

export const GROUP_CONFIG: Record<GroupId, { gradient: string; accentColor: string; textColor: string }> = {
  bts:       { gradient: 'linear-gradient(135deg, #1a0030, #4a0080, #9C27B0, #FFD700)', accentColor: '#9C27B0', textColor: '#FFD700' },
  blackpink: { gradient: 'linear-gradient(135deg, #1a0010, #6b0030, #FF1493, #FF69B4)', accentColor: '#FF1493', textColor: '#FFB6C1' },
  aespa:     { gradient: 'linear-gradient(135deg, #001a1a, #004040, #00FFFF, #00FF88)', accentColor: '#00FFFF', textColor: '#00FFFF' },
  enhypen:   { gradient: 'linear-gradient(135deg, #1a0000, #600000, #FF1744, #FFD700)', accentColor: '#FF1744', textColor: '#FFD700' },
  redvelvet: { gradient: 'linear-gradient(135deg, #1a0000, #5a0000, #FF0000, #FF69B4)', accentColor: '#FF0000', textColor: '#FFB6C1' },
  newjeans:  { gradient: 'linear-gradient(135deg, #001020, #003060, #7EC8E3, #B4E7CE)', accentColor: '#7EC8E3', textColor: '#B4E7CE' },
  illit:     { gradient: 'linear-gradient(135deg, #1a0015, #500040, #FFB6C1, #E6E6FA)', accentColor: '#FFB6C1', textColor: '#E6E6FA' },
};

const pc = (
  id: string, member: string, group: GroupId, era: string,
  rarity: Rarity, description: string, price: number, dropRate: number,
  opts?: { isPreDebut?: boolean; isGroupPhoto?: boolean }
): Photocard => ({
  id, member, group, groupName: GROUP_CONFIG[group] ? {
    bts:'BTS', aespa:'AESPA', enhypen:'ENHYPEN', blackpink:'BLACKPINK',
    redvelvet:'RED VELVET', newjeans:'NEWJEANS', illit:'ILLIT'
  }[group] : group,
  era, rarity, description, price, dropRate, ...opts,
});

export const photocards: Photocard[] = [
  // ══════════════ BTS ══════════════
  // 🟫 Common — bonito mas deixa querer mais
  pc('bts-c-rm',    'RM',       'bts', 'Daily',        'common', 'RM — líder, filósofo e artista',            8,  2.2),
  pc('bts-c-jin',   'Jin',      'bts', 'Daily',        'common', 'Jin — o príncipe mais engraçado do mundo',  8,  2.2),
  pc('bts-c-suga',  'Suga',     'bts', 'Daily',        'common', 'Suga — genius produtor e Min Yoongi',       8,  2.2),
  pc('bts-c-jhope', 'J-Hope',   'bts', 'Daily',        'common', 'J-Hope — sunshine eterno do BTS',          8,  2.2),
  pc('bts-c-jm',    'Jimin',    'bts', 'Daily',        'common', 'Jimin — dançarino e artista nato',          8,  2.2),
  pc('bts-c-v',     'V',        'bts', 'Daily',        'common', 'V — artista multifacetado e Kim Taehyung',  8,  2.2),
  pc('bts-c-jk',    'Jungkook', 'bts', 'Daily',        'common', 'Jungkook — Golden Maknae do universo',      8,  2.2),
  // 🟦 Rare — concept, era específica, pré-debut e grupo
  pc('bts-r-jk',    'Jungkook', 'bts', 'Butter Era',       'rare', 'Jungkook em Butter — smooth como manteiga', 22, 0.7),
  pc('bts-r-v',     'V',        'bts', 'Dynamite Era',     'rare', 'V em Dynamite — aesthetic que parou o mundo', 22, 0.7),
  pc('bts-r-jm',    'Jimin',    'bts', 'Filter Era',       'rare', 'Jimin em Filter — eras solo, conceito puro', 22, 0.7),
  pc('bts-r-jin',   'Jin',      'bts', 'Astronaut Era',    'rare', 'Jin — Astronaut, última foto antes do militar', 22, 0.6),
  pc('bts-r-jhope', 'J-Hope',   'bts', 'Jack in the Box',  'rare', 'J-Hope — lado sombrio do sunshine',          22, 0.7),
  pc('bts-r-suga',  'Suga',     'bts', 'Agust D Era',      'rare', 'Suga como Agust D — alter ego genial',       22, 0.7),
  pc('bts-r-rm',    'RM',       'bts', 'Indigo Era',       'rare', 'RM em Indigo — álbum solo mais artístico',   22, 0.7),
  pc('bts-r-pd',    'Grupo',    'bts', 'Pré-Debut 2013',   'rare', 'BTS antes da estreia — onde tudo começou',  28, 0.4, { isPreDebut: true, isGroupPhoto: true }),
  pc('bts-r-group', 'Grupo',    'bts', 'Yet To Come Era',  'rare', 'BTS — 7 membros juntos, sempre',            28, 0.5, { isGroupPhoto: true }),
  // ⭐ Ultra Rare — full body, holográfico, perfeição
  pc('bts-ur', 'Grupo', 'bts', 'Permission to Dance', 'ultra-rare', '7 almas, 1 destino — BTS para sempre ✨', 55, 0.08, { isGroupPhoto: true }),

  // ══════════════ BLACKPINK ══════════════
  pc('bp-c-jisoo',  'Jisoo',  'blackpink', 'Daily', 'common', 'Jisoo — a mais elegante desde o pré-debut', 8, 3.0),
  pc('bp-c-jennie', 'Jennie', 'blackpink', 'Daily', 'common', 'Jennie — Human Gucci, sempre foi',          8, 3.0),
  pc('bp-c-rose',   'Rosé',   'blackpink', 'Daily', 'common', 'Rosé — voz que não sai da cabeça',          8, 3.0),
  pc('bp-c-lisa',   'Lisa',   'blackpink', 'Daily', 'common', 'Lisa — a rapper que dominou o mundo',       8, 3.0),
  pc('bp-r-lisa',   'Lisa',   'blackpink', 'LALISA Era',     'rare', 'Lisa — LALISA solo debut, história',  22, 0.9),
  pc('bp-r-jennie', 'Jennie', 'blackpink', 'Solo Era',       'rare', 'Jennie em Solo — 2018, ícone eterno', 22, 0.9),
  pc('bp-r-rose',   'Rosé',   'blackpink', 'On The Ground',  'rare', 'Rosé — On The Ground, solo poético',  22, 0.9),
  pc('bp-r-jisoo',  'Jisoo',  'blackpink', 'Flower Era',     'rare', 'Jisoo em Flower — beleza incomparável',22, 0.8),
  pc('bp-r-pd',     'Grupo',  'blackpink', 'Pré-Debut 2016', 'rare', 'BLACKPINK — antes de explodir o mundo', 28, 0.35, { isPreDebut: true, isGroupPhoto: true }),
  pc('bp-r-group',  'Grupo',  'blackpink', 'Born Pink Era',  'rare', 'BLACKPINK — Born Pink concept foto',  28, 0.5, { isGroupPhoto: true }),
  pc('bp-ur', 'Grupo', 'blackpink', 'How You Like That', 'ultra-rare', '4 Queens — full body, power supremo ✨', 55, 0.10, { isGroupPhoto: true }),

  // ══════════════ AESPA ══════════════
  pc('ae-c-karina',  'Karina',  'aespa', 'Daily', 'common', 'Karina — líder e visual da AESPA',     8, 3.0),
  pc('ae-c-giselle', 'Giselle', 'aespa', 'Daily', 'common', 'Giselle — rapper trilíngue da AESPA',  8, 3.0),
  pc('ae-c-winter',  'Winter',  'aespa', 'Daily', 'common', 'Winter — voz e stage presence únicos', 8, 3.0),
  pc('ae-c-ningning','Ningning','aespa', 'Daily', 'common', 'Ningning — main vocalist poderosa',    8, 3.0),
  pc('ae-r-karina',  'Karina',  'aespa', 'Savage Era',    'rare', 'Karina em Savage — perfeição fria',     22, 0.8),
  pc('ae-r-winter',  'Winter',  'aespa', 'Drama Era',     'rare', 'Winter em Drama — concept icônico',     22, 0.8),
  pc('ae-r-ningning','Ningning','aespa', 'Whiplash Era',  'rare', 'Ningning em Whiplash — vocal queen',    22, 0.8),
  pc('ae-r-giselle', 'Giselle', 'aespa', 'Girls Era',     'rare', 'Giselle em Girls — energy level 100',  22, 0.8),
  pc('ae-r-pd',  'Grupo', 'aespa', 'Pré-Debut 2020',  'rare', 'AESPA — trainee days na SM',             28, 0.35, { isPreDebut: true, isGroupPhoto: true }),
  pc('ae-r-group','Grupo', 'aespa', 'Supernova Era',   'rare', 'AESPA — ae-universe reunido',            28, 0.5, { isGroupPhoto: true }),
  pc('ae-ur', 'Grupo', 'aespa', 'Black Mamba Era', 'ultra-rare', '4 ae-girls — debut que redefiniu o 4th gen ✨', 55, 0.09, { isGroupPhoto: true }),

  // ══════════════ ENHYPEN ══════════════
  pc('en-c-jungwon', 'Jungwon', 'enhypen', 'Daily', 'common', 'Jungwon — líder eleito pelos fãs (ENGENE)', 8, 2.2),
  pc('en-c-heeseung','Heeseung','enhypen', 'Daily', 'common', 'Heeseung — all-rounder, o mais completo',   8, 2.2),
  pc('en-c-jay',     'Jay',     'enhypen', 'Daily', 'common', 'Jay — trilíngue, carismático e real',       8, 2.2),
  pc('en-c-jake',    'Jake',    'enhypen', 'Daily', 'common', 'Jake — Australian boy com coração coreano', 8, 2.2),
  pc('en-c-sunghoon','Sunghoon','enhypen', 'Daily', 'common', 'Sunghoon — ex-patinador, visual do grupo',  8, 2.2),
  pc('en-c-sunoo',   'Sunoo',   'enhypen', 'Daily', 'common', 'Sunoo — sorriso que aquece qualquer dia',   8, 2.2),
  pc('en-c-niki',    'Ni-ki',   'enhypen', 'Daily', 'common', 'Ni-ki — main dancer prodígio japonês',      8, 2.2),
  pc('en-r-heeseung','Heeseung','enhypen', 'Dark Blood Era',   'rare', 'Heeseung — Dark Blood, o lado sombrio',    22, 0.6),
  pc('en-r-jake',    'Jake',    'enhypen', 'Bite Me Era',      'rare', 'Jake em Bite Me — dark concept perfeito',  22, 0.7),
  pc('en-r-jungwon', 'Jungwon', 'enhypen', 'Future Perfect',  'rare', 'Jungwon — Future Perfect, líder nato',     22, 0.7),
  pc('en-r-sunghoon','Sunghoon','enhypen', 'Blessed-Cursed',  'rare', 'Sunghoon — visual em Blessed-Cursed',      22, 0.7),
  pc('en-r-pd',  'Grupo', 'enhypen', 'I-Land 2020',   'rare', 'ENHYPEN no I-Land — onde foram descobertos', 28, 0.35, { isPreDebut: true, isGroupPhoto: true }),
  pc('en-r-group','Grupo', 'enhypen', 'Dark Moon Era', 'rare', 'ENHYPEN — 7 membros concept oscuro',        28, 0.5, { isGroupPhoto: true }),
  pc('en-ur', 'Grupo', 'enhypen', 'Border: Day One', 'ultra-rare', 'ENHYPEN — debut completo, 7 almas juntas ✨', 55, 0.08, { isGroupPhoto: true }),

  // ══════════════ RED VELVET ══════════════
  pc('rv-c-irene',  'Irene',  'redvelvet', 'Daily', 'common', 'Irene — visual e líder, elegância pura',  8, 2.5),
  pc('rv-c-seulgi', 'Seulgi', 'redvelvet', 'Daily', 'common', 'Seulgi — Bear Goddess, poder e charme',   8, 2.5),
  pc('rv-c-wendy',  'Wendy',  'redvelvet', 'Daily', 'common', 'Wendy — main vocalist powerhouse',        8, 2.5),
  pc('rv-c-joy',    'Joy',    'redvelvet', 'Daily', 'common', 'Joy — a mais alta e a mais alegre',       8, 2.5),
  pc('rv-c-yeri',   'Yeri',   'redvelvet', 'Daily', 'common', 'Yeri — maknae icônica e fashionista',    8, 2.5),
  pc('rv-r-irene',  'Irene',  'redvelvet', 'Psycho Era',        'rare', 'Irene em Psycho — visual supremo',       22, 0.7),
  pc('rv-r-seulgi', 'Seulgi', 'redvelvet', 'Queendom Era',      'rare', 'Seulgi — Queendom, power concept',       22, 0.7),
  pc('rv-r-wendy',  'Wendy',  'redvelvet', 'After The Rain',    'rare', 'Wendy — retorno após acidente, força',   22, 0.7),
  pc('rv-r-joy',    'Joy',    'redvelvet', 'Hello Era',         'rare', 'Joy em Hello — solo debut icônico',      22, 0.7),
  pc('rv-r-yeri',   'Yeri',   'redvelvet', 'WISH Era',          'rare', 'Yeri em WISH — cresceu demais',          22, 0.7),
  pc('rv-r-pd',  'Grupo', 'redvelvet', 'Pré-Debut 2014',    'rare', 'Red Velvet — era SM trainee, o começo',  28, 0.35, { isPreDebut: true, isGroupPhoto: true }),
  pc('rv-r-group','Grupo', 'redvelvet', 'The ReVe Festival', 'rare', 'Red Velvet — festival concept reunidas', 28, 0.5, { isGroupPhoto: true }),
  pc('rv-ur', 'Grupo', 'redvelvet', 'Chill Kill Era', 'ultra-rare', '5 Queens — Red Velvet full body perfeitas ✨', 55, 0.09, { isGroupPhoto: true }),

  // ══════════════ NEWJEANS ══════════════
  pc('nj-c-minji',   'Minji',   'newjeans', 'Daily', 'common', 'Minji — líder e visual clássico atemporal', 8, 2.8),
  pc('nj-c-hanni',   'Hanni',   'newjeans', 'Daily', 'common', 'Hanni — trendsetter da geração',            8, 2.8),
  pc('nj-c-danielle','Danielle','newjeans', 'Daily', 'common', 'Danielle — Y2K aesthetic perfeita',         8, 2.8),
  pc('nj-c-haerin',  'Haerin',  'newjeans', 'Daily', 'common', 'Haerin — cat-like, visual mais especial',   8, 2.8),
  pc('nj-c-hyein',   'Hyein',   'newjeans', 'Daily', 'common', 'Hyein — maknae que virou fashion icon',     8, 2.8),
  pc('nj-r-haerin',  'Haerin',  'newjeans', 'ETA Era',       'rare', 'Haerin em ETA — aesthetic Y2K puro',    22, 0.8),
  pc('nj-r-hanni',   'Hanni',   'newjeans', 'Ditto Era',     'rare', 'Hanni em Ditto — dreamy concept',       22, 0.8),
  pc('nj-r-minji',   'Minji',   'newjeans', 'Super Shy Era', 'rare', 'Minji em Super Shy — líder radiante',   22, 0.8),
  pc('nj-r-pd',  'Grupo', 'newjeans', 'Pré-Debut 2022',  'rare', 'NewJeans — trainee days, HYBE era',       28, 0.35, { isPreDebut: true, isGroupPhoto: true }),
  pc('nj-r-group','Grupo', 'newjeans', 'OMG Era',         'rare', 'NewJeans — OMG group concept photo',      28, 0.5, { isGroupPhoto: true }),
  pc('nj-ur', 'Grupo', 'newjeans', 'Hype Boy Era', 'ultra-rare', 'NewJeans — debut que mudou o K-pop ✨', 55, 0.09, { isGroupPhoto: true }),

  // ══════════════ ILLIT ══════════════
  pc('il-c-yunah',  'Yunah',  'illit', 'Daily', 'common', 'Yunah — líder e visual do ILLIT',             8, 2.8),
  pc('il-c-minju',  'Minju',  'illit', 'Daily', 'common', 'Minju — main vocalist, presença de palco',    8, 2.8),
  pc('il-c-moka',   'Moka',   'illit', 'Daily', 'common', 'Moka — em hiatus mas sempre no coração 💕',  8, 2.8),
  pc('il-c-wonhee', 'Wonhee', 'illit', 'Daily', 'common', 'Wonhee — dancer principal do grupo',          8, 2.8),
  pc('il-c-iroha',  'Iroha',  'illit', 'Daily', 'common', 'Iroha — Japanese member, delicadeza',         8, 2.8),
  pc('il-r-moka',   'Moka',   'illit', 'Hiatus Special', 'rare', 'Moka — card especial de saudade, única 💕', 32, 0.25),
  pc('il-r-minju',  'Minju',  'illit', 'Magnetic Era',   'rare', 'Minju em Magnetic — ex-NMIXX brilhando', 22, 0.8),
  pc('il-r-yunah',  'Yunah',  'illit', 'Tick-Tack Era',  'rare', 'Yunah em Tick-Tack — líder em concept',  22, 0.8),
  pc('il-r-pd',  'Grupo', 'illit', 'Pré-Debut 2023',  'rare', 'ILLIT — Belift trainee era, o começo',    28, 0.35, { isPreDebut: true, isGroupPhoto: true }),
  pc('il-r-group','Grupo', 'illit', 'Magnetic Era',    'rare', 'ILLIT — Magnetic group concept foto',    28, 0.5, { isGroupPhoto: true }),
  pc('il-ur', 'Grupo', 'illit', 'My World Era', 'ultra-rare', 'ILLIT — debut completo, 5 estrelas ✨', 55, 0.09, { isGroupPhoto: true }),
];