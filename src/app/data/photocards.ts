export type Rarity = 'common' | 'rare' | 'ultra-rare';

export type Group =
  | 'bts'
  | 'blackpink'
  | 'aespa'
  | 'enhypen'
  | 'redvelvet'
  | 'newjeans'
  | 'illit';

export interface Photocard {
  id: string;
  member: string;
  groupName: string;
  group: Group;
  rarity: Rarity;
  era: string;
  imageUrl: string;
  isGroupPhoto?: boolean;
  isPreDebut?: boolean;
}

export interface GroupConfig {
  gradient: string;
  accentColor: string;
}

export const GROUP_CONFIG: Record<Group, GroupConfig> = {
  bts:       { gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', accentColor: '#A78BFA' },
  blackpink: { gradient: 'linear-gradient(135deg, #1a0a1a 0%, #2d0a2d 50%, #000000 100%)', accentColor: '#F9A8D4' },
  aespa:     { gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2d 50%, #0a1a2d 100%)', accentColor: '#67E8F9' },
  enhypen:   { gradient: 'linear-gradient(135deg, #0a0f1a 0%, #0a1f0a 50%, #1a0a0a 100%)', accentColor: '#6EE7B7' },
  redvelvet: { gradient: 'linear-gradient(135deg, #1a0a0a 0%, #2d0a0a 50%, #1a0a1a 100%)', accentColor: '#FCA5A5' },
  newjeans:  { gradient: 'linear-gradient(135deg, #0a1020 0%, #0a2030 50%, #102040 100%)', accentColor: '#93C5FD' },
  illit:     { gradient: 'linear-gradient(135deg, #1a0a10 0%, #2d0a20 50%, #1a0a2d 100%)', accentColor: '#F9A8D4' },
};

export const photocards: Photocard[] = [
  // BTS
  { id: 'bts-rm-common',    member: 'RM',        groupName: 'BTS', group: 'bts', rarity: 'common',     era: 'Airport Fashion',       imageUrl: '/photocards/BTS/rm-common.jpg' },
  { id: 'bts-jin-common',   member: 'Jin',       groupName: 'BTS', group: 'bts', rarity: 'common',     era: 'Casual',                imageUrl: '/photocards/BTS/jin-common.jpg' },
  { id: 'bts-suga-common',  member: 'Suga',      groupName: 'BTS', group: 'bts', rarity: 'common',     era: 'Airport',               imageUrl: '/photocards/BTS/suga-common.jpg' },
  { id: 'bts-jhope-common', member: 'J-Hope',    groupName: 'BTS', group: 'bts', rarity: 'common',     era: 'Daily',                 imageUrl: '/photocards/BTS/jhope-common.jpg' },
  { id: 'bts-jimin-common', member: 'Jimin',     groupName: 'BTS', group: 'bts', rarity: 'common',     era: 'Casual',                imageUrl: '/photocards/BTS/jimin-common.jpg' },
  { id: 'bts-v-common',     member: 'V',         groupName: 'BTS', group: 'bts', rarity: 'common',     era: 'Airport',               imageUrl: '/photocards/BTS/v-common.jpg' },
  { id: 'bts-jk-common',    member: 'Jungkook',  groupName: 'BTS', group: 'bts', rarity: 'common',     era: 'Selca',                 imageUrl: '/photocards/BTS/jk-common.jpg' },
  { id: 'bts-jk-rare',      member: 'Jungkook',  groupName: 'BTS', group: 'bts', rarity: 'rare',       era: 'Butter',                imageUrl: '/photocards/BTS/jk-rare.jpg' },
  { id: 'bts-v-rare',       member: 'V',         groupName: 'BTS', group: 'bts', rarity: 'rare',       era: 'Dynamite',              imageUrl: '/photocards/BTS/v-rare.jpg' },
  { id: 'bts-jimin-rare',   member: 'Jimin',     groupName: 'BTS', group: 'bts', rarity: 'rare',       era: 'Filter',                imageUrl: '/photocards/BTS/jimin-rare.jpg' },
  { id: 'bts-jin-rare',     member: 'Jin',       groupName: 'BTS', group: 'bts', rarity: 'rare',       era: 'Astronaut',             imageUrl: '/photocards/BTS/jin-rare.jpg' },
  { id: 'bts-jhope-rare',   member: 'J-Hope',    groupName: 'BTS', group: 'bts', rarity: 'rare',       era: 'Jack in the Box',       imageUrl: '/photocards/BTS/jhope-rare.jpg' },
  { id: 'bts-suga-rare',    member: 'Suga',      groupName: 'BTS', group: 'bts', rarity: 'rare',       era: 'Agust D',               imageUrl: '/photocards/BTS/suga-rare.jpg' },
  { id: 'bts-rm-rare',      member: 'RM',        groupName: 'BTS', group: 'bts', rarity: 'rare',       era: 'Indigo',                imageUrl: '/photocards/BTS/rm-rare.jpg' },
  { id: 'bts-ultra-rare',   member: 'BTS',       groupName: 'BTS', group: 'bts', rarity: 'ultra-rare', era: 'Permission to Dance',   imageUrl: '/photocards/BTS/bts-ultra-rare.jpg', isGroupPhoto: true },

  // BLACKPINK
  { id: 'bp-jennie-common', member: 'Jennie',    groupName: 'BLACKPINK', group: 'blackpink', rarity: 'common',     era: 'Airport',       imageUrl: '/photocards/BLACKPINK/jennie-common.jpg' },
  { id: 'bp-jisoo-common',  member: 'Jisoo',     groupName: 'BLACKPINK', group: 'blackpink', rarity: 'common',     era: 'Paris',         imageUrl: '/photocards/BLACKPINK/jisoo-common.jpg' },
  { id: 'bp-rose-common',   member: 'Rose',      groupName: 'BLACKPINK', group: 'blackpink', rarity: 'common',     era: 'Selca',         imageUrl: '/photocards/BLACKPINK/rose-common.jpg' },
  { id: 'bp-lisa-common',   member: 'Lisa',      groupName: 'BLACKPINK', group: 'blackpink', rarity: 'common',     era: 'Daily',         imageUrl: '/photocards/BLACKPINK/lisa-common.jpg' },
  { id: 'bp-lisa-rare',     member: 'Lisa',      groupName: 'BLACKPINK', group: 'blackpink', rarity: 'rare',       era: 'LALISA',        imageUrl: '/photocards/BLACKPINK/lisa-rare.jpg' },
  { id: 'bp-jennie-rare',   member: 'Jennie',    groupName: 'BLACKPINK', group: 'blackpink', rarity: 'rare',       era: 'Solo',          imageUrl: '/photocards/BLACKPINK/jennie-rare.jpg' },
  { id: 'bp-rose-rare',     member: 'Rose',      groupName: 'BLACKPINK', group: 'blackpink', rarity: 'rare',       era: 'On The Ground', imageUrl: '/photocards/BLACKPINK/rose-rare.jpg' },
  { id: 'bp-jisoo-rare',    member: 'Jisoo',     groupName: 'BLACKPINK', group: 'blackpink', rarity: 'rare',       era: 'Flower',        imageUrl: '/photocards/BLACKPINK/jisoo-rare.jpg' },
  { id: 'bp-ultra-rare',    member: 'BLACKPINK', groupName: 'BLACKPINK', group: 'blackpink', rarity: 'ultra-rare', era: 'Met Gala 2026', imageUrl: '/photocards/BLACKPINK/bp-ultra-rare.jpg', isGroupPhoto: true },

  // AESPA
  { id: 'ae-karina-common',   member: 'Karina',   groupName: 'aespa', group: 'aespa', rarity: 'common',     era: 'Selca',       imageUrl: '/photocards/AESPA/karina-common.jpg' },
  { id: 'ae-giselle-common',  member: 'Giselle',  groupName: 'aespa', group: 'aespa', rarity: 'common',     era: 'Airport',     imageUrl: '/photocards/AESPA/giselle-common.jpg' },
  { id: 'ae-winter-common',   member: 'Winter',   groupName: 'aespa', group: 'aespa', rarity: 'common',     era: 'Daily',       imageUrl: '/photocards/AESPA/winter-common.jpg' },
  { id: 'ae-ningning-common', member: 'Ningning', groupName: 'aespa', group: 'aespa', rarity: 'common',     era: 'Stage',       imageUrl: '/photocards/AESPA/ningning-common.jpg' },
  { id: 'ae-karina-rare',     member: 'Karina',   groupName: 'aespa', group: 'aespa', rarity: 'rare',       era: 'Savage',      imageUrl: '/photocards/AESPA/karina-rare.jpg' },
  { id: 'ae-winter-rare',     member: 'Winter',   groupName: 'aespa', group: 'aespa', rarity: 'rare',       era: 'Drama',       imageUrl: '/photocards/AESPA/winter-rare.jpg' },
  { id: 'ae-karina-rare2',    member: 'Karina',   groupName: 'aespa', group: 'aespa', rarity: 'rare',       era: 'Supernova',   imageUrl: '/photocards/AESPA/karina-rare2.jpg' },
  { id: 'ae-giselle-rare',    member: 'Giselle',  groupName: 'aespa', group: 'aespa', rarity: 'rare',       era: 'Whiplash',    imageUrl: '/photocards/AESPA/giselle-rare.jpg' },
  { id: 'ae-ningning-rare',   member: 'Ningning', groupName: 'aespa', group: 'aespa', rarity: 'rare',       era: 'Girls',       imageUrl: '/photocards/AESPA/ningning-rare.jpg' },
  { id: 'ae-ultra-rare',      member: 'aespa',    groupName: 'aespa', group: 'aespa', rarity: 'ultra-rare', era: 'Black Mamba', imageUrl: '/photocards/AESPA/aespa-ultra-rare.jpg', isGroupPhoto: true },

  // ENHYPEN
  { id: 'en-heeseung-common', member: 'Heeseung', groupName: 'ENHYPEN', group: 'enhypen', rarity: 'common',     era: 'Selca',           imageUrl: '/photocards/ENHYPEN/heeseung-common.jpg' },
  { id: 'en-jay-common',      member: 'Jay',      groupName: 'ENHYPEN', group: 'enhypen', rarity: 'common',     era: 'Airport',         imageUrl: '/photocards/ENHYPEN/jay-common.jpg' },
  { id: 'en-jake-common',     member: 'Jake',     groupName: 'ENHYPEN', group: 'enhypen', rarity: 'common',     era: 'Stage',           imageUrl: '/photocards/ENHYPEN/jake-common.jpg' },
  { id: 'en-sunoo-common',    member: 'Sunoo',    groupName: 'ENHYPEN', group: 'enhypen', rarity: 'common',     era: 'Cute Daily',      imageUrl: '/photocards/ENHYPEN/sunoo-common.jpg' },
  { id: 'en-jungwon-common',  member: 'Jungwon',  groupName: 'ENHYPEN', group: 'enhypen', rarity: 'common',     era: 'Beach',           imageUrl: '/photocards/ENHYPEN/jungwon-common.jpg' },
  { id: 'en-niki-common',     member: 'Ni-ki',    groupName: 'ENHYPEN', group: 'enhypen', rarity: 'common',     era: 'Street',          imageUrl: '/photocards/ENHYPEN/niki-common.jpg' },
  { id: 'en-sunghoon-common', member: 'Sunghoon', groupName: 'ENHYPEN', group: 'enhypen', rarity: 'common',     era: 'Fansign',         imageUrl: '/photocards/ENHYPEN/sunghoon-common.jpg' },
  { id: 'en-heeseung-rare',   member: 'Heeseung', groupName: 'ENHYPEN', group: 'enhypen', rarity: 'rare',       era: 'Dark Blood',      imageUrl: '/photocards/ENHYPEN/heeseung-rare.jpg' },
  { id: 'en-sunghoon-rare',   member: 'Sunghoon', groupName: 'ENHYPEN', group: 'enhypen', rarity: 'rare',       era: 'Romance Untold',  imageUrl: '/photocards/ENHYPEN/sunghoon-rare.jpg' },
  { id: 'en-jake-rare',       member: 'Jake',     groupName: 'ENHYPEN', group: 'enhypen', rarity: 'rare',       era: 'Romance Untold',  imageUrl: '/photocards/ENHYPEN/jake-rare.jpg' },
  { id: 'en-jungwon-rare',    member: 'Jungwon',  groupName: 'ENHYPEN', group: 'enhypen', rarity: 'rare',       era: 'Future Perfect',  imageUrl: '/photocards/ENHYPEN/jungwon-rare.jpg' },
  { id: 'en-ultra-rare',      member: 'ENHYPEN',  groupName: 'ENHYPEN', group: 'enhypen', rarity: 'ultra-rare', era: 'ENniversary 2025',imageUrl: '/photocards/ENHYPEN/enhypen-ultra-rare.jpg', isGroupPhoto: true },

  // RED VELVET
  { id: 'rv-irene-common',  member: 'Irene',      groupName: 'Red Velvet', group: 'redvelvet', rarity: 'common',     era: 'Daily',          imageUrl: '/photocards/REDVELVET/irene-common.jpg' },
  { id: 'rv-seulgi-common', member: 'Seulgi',     groupName: 'Red Velvet', group: 'redvelvet', rarity: 'common',     era: 'Airport',        imageUrl: '/photocards/REDVELVET/seulgi-common.jpg' },
  { id: 'rv-wendy-common',  member: 'Wendy',      groupName: 'Red Velvet', group: 'redvelvet', rarity: 'common',     era: 'Daily',          imageUrl: '/photocards/REDVELVET/wendy-common.jpg' },
  { id: 'rv-joy-common',    member: 'Joy',        groupName: 'Red Velvet', group: 'redvelvet', rarity: 'common',     era: 'Stage',          imageUrl: '/photocards/REDVELVET/joy-common.jpg' },
  { id: 'rv-yeri-common',   member: 'Yeri',       groupName: 'Red Velvet', group: 'redvelvet', rarity: 'common',     era: 'Instagram',      imageUrl: '/photocards/REDVELVET/yeri-common.jpg' },
  { id: 'rv-irene-rare',    member: 'Irene',      groupName: 'Red Velvet', group: 'redvelvet', rarity: 'rare',       era: 'Like A Flower',  imageUrl: '/photocards/REDVELVET/irene-rare.jpg' },
  { id: 'rv-seulgi-rare',   member: 'Seulgi',     groupName: 'Red Velvet', group: 'redvelvet', rarity: 'rare',       era: 'Psycho',         imageUrl: '/photocards/REDVELVET/seulgi-rare.jpg' },
  { id: 'rv-wendy-rare',    member: 'Wendy',      groupName: 'Red Velvet', group: 'redvelvet', rarity: 'rare',       era: 'After The Rain', imageUrl: '/photocards/REDVELVET/wendy-rare.jpg' },
  { id: 'rv-joy-rare',      member: 'Joy',        groupName: 'Red Velvet', group: 'redvelvet', rarity: 'rare',       era: 'Hello',          imageUrl: '/photocards/REDVELVET/joy-rare.jpg' },
  { id: 'rv-yeri-rare',     member: 'Yeri',       groupName: 'Red Velvet', group: 'redvelvet', rarity: 'rare',       era: 'WISH',           imageUrl: '/photocards/REDVELVET/yeri-rare.jpg' },
  { id: 'rv-ultra-rare',    member: 'Red Velvet', groupName: 'Red Velvet', group: 'redvelvet', rarity: 'ultra-rare', era: 'Chill Kill',     imageUrl: '/photocards/REDVELVET/rv-ultra-rare.jpg', isGroupPhoto: true },

  // NEWJEANS
  { id: 'nj-minji-common',    member: 'Minji',    groupName: 'NewJeans', group: 'newjeans', rarity: 'common',     era: 'Selca',      imageUrl: '/photocards/NEWJEANS/minji-common.jpg' },
  { id: 'nj-hanni-common',    member: 'Hanni',    groupName: 'NewJeans', group: 'newjeans', rarity: 'common',     era: 'Airport',    imageUrl: '/photocards/NEWJEANS/hanni-common.jpg' },
  { id: 'nj-danielle-common', member: 'Danielle', groupName: 'NewJeans', group: 'newjeans', rarity: 'common',     era: 'Daily',      imageUrl: '/photocards/NEWJEANS/danielle-common.jpg' },
  { id: 'nj-haerin-common',   member: 'Haerin',   groupName: 'NewJeans', group: 'newjeans', rarity: 'common',     era: 'Street',     imageUrl: '/photocards/NEWJEANS/haerin-common.jpg' },
  { id: 'nj-hyein-common',    member: 'Hyein',    groupName: 'NewJeans', group: 'newjeans', rarity: 'common',     era: 'Cute Daily', imageUrl: '/photocards/NEWJEANS/hyein-common.jpg' },
  { id: 'nj-haerin-rare',     member: 'Haerin',   groupName: 'NewJeans', group: 'newjeans', rarity: 'rare',       era: 'ETA',        imageUrl: '/photocards/NEWJEANS/haerin-rare.jpg' },
  { id: 'nj-minji-rare',      member: 'Minji',    groupName: 'NewJeans', group: 'newjeans', rarity: 'rare',       era: 'OMG',        imageUrl: '/photocards/NEWJEANS/minji-rare.jpg' },
  { id: 'nj-hanni-rare',      member: 'Hanni',    groupName: 'NewJeans', group: 'newjeans', rarity: 'rare',       era: 'Ditto',      imageUrl: '/photocards/NEWJEANS/hanni-rare.jpg' },
  { id: 'nj-danielle-rare',   member: 'Danielle', groupName: 'NewJeans', group: 'newjeans', rarity: 'rare',       era: 'Super Shy',  imageUrl: '/photocards/NEWJEANS/danielle-rare.jpg' },
  { id: 'nj-ultra-rare',      member: 'NewJeans', groupName: 'NewJeans', group: 'newjeans', rarity: 'ultra-rare', era: 'Hype Boy',   imageUrl: '/photocards/NEWJEANS/nj-ultra-rare.jpg',  isGroupPhoto: true },
  { id: 'nj-ultra-rare2',     member: 'NewJeans', groupName: 'NewJeans', group: 'newjeans', rarity: 'ultra-rare', era: 'UNO Night',  imageUrl: '/photocards/NEWJEANS/nj-ultra-rare2.jpg', isGroupPhoto: true },
  { id: 'nj-ultra-rare3',     member: 'NewJeans', groupName: 'NewJeans', group: 'newjeans', rarity: 'ultra-rare', era: 'MV Colorido',imageUrl: '/photocards/NEWJEANS/nj-ultra-rare3.jpg', isGroupPhoto: true },

  // ILLIT
  { id: 'il-yunah-common',  member: 'Yunah',  groupName: 'ILLIT', group: 'illit', rarity: 'common',     era: 'Selca',            imageUrl: '/photocards/ILLIT/yunah-common.jpg' },
  { id: 'il-minju-common',  member: 'Minju',  groupName: 'ILLIT', group: 'illit', rarity: 'common',     era: 'Airport',          imageUrl: '/photocards/ILLIT/minju-common.jpg' },
  { id: 'il-moka-common',   member: 'Moka',   groupName: 'ILLIT', group: 'illit', rarity: 'common',     era: 'Selca',            imageUrl: '/photocards/ILLIT/moka-common.jpg' },
  { id: 'il-wonhee-common', member: 'Wonhee', groupName: 'ILLIT', group: 'illit', rarity: 'common',     era: 'Airport',          imageUrl: '/photocards/ILLIT/wonhee-common.jpg' },
  { id: 'il-iroha-common',  member: 'Iroha',  groupName: 'ILLIT', group: 'illit', rarity: 'common',     era: 'Daily',            imageUrl: '/photocards/ILLIT/iroha-common.jpg' },
  { id: 'il-moka-rare',     member: 'Moka',   groupName: 'ILLIT', group: 'illit', rarity: 'rare',       era: 'Magnetic',         imageUrl: '/photocards/ILLIT/moka-rare.jpg' },
  { id: 'il-yunah-rare',    member: 'Yunah',  groupName: 'ILLIT', group: 'illit', rarity: 'rare',       era: 'Tick Tack',        imageUrl: '/photocards/ILLIT/yunah-rare.jpg' },
  { id: 'il-wonhee-rare',   member: 'Wonhee', groupName: 'ILLIT', group: 'illit', rarity: 'rare',       era: 'My World',         imageUrl: '/photocards/ILLIT/wonhee-rare.jpg' },
  { id: 'il-ultra-rare',    member: 'ILLIT',  groupName: 'ILLIT', group: 'illit', rarity: 'ultra-rare', era: 'Not Cute Anymore', imageUrl: '/photocards/ILLIT/illit-ultra-rare.jpg', isGroupPhoto: true },
];