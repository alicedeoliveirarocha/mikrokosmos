# 🖼️ Referência de Imagens Red Velvet

## Imagens Fornecidas pelo Usuário

As seguintes imagens foram fornecidas como referência visual para a Era Red Velvet:

### 1. Red Velvet Fantasy House
**ID:** `figma:asset/d647babbb3a88ed8edc9f17c6150061b234756c9.png`
**Descrição:** Casa fantástica com estética pastel e vermelho, decoração whimsical, árvores e elementos de jardim encantado
**Uso Sugerido:** 
- Banner principal Red Velvet
- Background da página de produtos Red Velvet
- Hero section em páginas temáticas

**Como usar:**
```typescript
import redVelvetHouse from 'figma:asset/d647babbb3a88ed8edc9f17c6150061b234756c9.png';

<img src={redVelvetHouse} alt="Red Velvet Fantasy House" />
```

---

### 2. Red Velvet Mansion with Members
**ID:** `figma:asset/7910e1dc6625245b4c61e6f9969147067f273dce.png`
**Descrição:** Mansão vintage com membros do Red Velvet em silhueta, montanhas ao fundo, atmosfera misteriosa em tons de cinza e vermelho
**Uso Sugerido:**
- Card de sessão do Cinema ("Dark Moon" style adaptado para RV)
- Background de página de perfil quando Red Velvet está ativo
- Modal de "Sobre a Era"

**Como usar:**
```typescript
import redVelvetMansion from 'figma:asset/7910e1dc6625245b4c61e6f9969147067f273dce.png';

<img src={redVelvetMansion} alt="Red Velvet Mansion" />
```

**Atualmente usado em:** `/src/app/pages/Cinema.tsx` - Sessão "Dark Moon"

---

### 3. Red Velvet Members (Dark Concept)
**ID:** `figma:asset/0b88ab61eba8b431bd8dde4986c28296fad37b78.png`
**Descrição:** Cinco membros do Red Velvet em formação, looks pretos elegantes, conceito dark/chic
**Uso Sugerido:**
- Galeria de membros
- Página "About Red Velvet"
- Background para produtos premium

**Como usar:**
```typescript
import redVelvetMembers from 'figma:asset/0b88ab61eba8b431bd8dde4986c28296fad37b78.png';

<img src={redVelvetMembers} alt="Red Velvet Members" />
```

---

### 4. "The Red" Album Cover
**ID:** `figma:asset/20e9f3bfb7f90d5ecdbfe007b2a25d7b7b8e15a4.png`
**Descrição:** Capa do 1º álbum "The Red" com design tipográfico vermelho sobre fundo lavanda/rosa
**Uso Sugerido:**
- Ícone da Era Red Velvet no seletor
- Thumbnail de produtos Red Velvet
- Badge decorativo

**Como usar:**
```typescript
import theRedAlbum from 'figma:asset/20e9f3bfb7f90d5ecdbfe007b2a25d7b7b8e15a4.png';

<img src={theRedAlbum} alt="The Red Album" />
```

**Atualmente usado em:** `/src/app/pages/Cinema.tsx` - Sessão "The ReVe Festival"

---

### 5. Red Velvet "Perfect Velvet" Album
**ID:** `figma:asset/f90ede4152b876b4acf46e6b867f09c2d845808a.png`
**Descrição:** Capa do álbum "Perfect Velvet" com membros em roupas de estilo Chanel, fundo vermelho intenso
**Uso Sugerido:**
- Background de produtos de alto valor (combos premium)
- Hero section de página especial Red Velvet
- Banner promocional

**Como usar:**
```typescript
import perfectVelvet from 'figma:asset/f90ede4152b876b4acf46e6b867f09c2d845808a.png';

<img src={perfectVelvet} alt="Perfect Velvet Album" />
```

---

### 6. Red Velvet "Peek-A-Boo" Performance
**ID:** `figma:asset/810a47463f4d120ebaa75f92b7cc85410c2db7ac.png`
**Descrição:** Silhuetas das membros em performance, iluminação azul dramática, conceito misterioso
**Uso Sugerido:**
- Background de loading screens quando Red Velvet está ativo
- Header animado
- Splash screen de transição entre modos

**Como usar:**
```typescript
import peekABoo from 'figma:asset/810a47463f4d120ebaa75f92b7cc85410c2db7ac.png';

<img src={peekABoo} alt="Peek-A-Boo Performance" />
```

---

### 7. "Cosmic" Album Cover
**ID:** `figma:asset/63b4adca0b4997b6531469627695f38b7ac9c62d.png`
**Descrição:** Arte do álbum "Cosmic" com halftone effect, tons de roxo e verde, estética retrô futurista
**Uso Sugerido:**
- Elemento decorativo em páginas Red Velvet
- Ícone de conquista/badge
- Background pattern sutil

**Como usar:**
```typescript
import cosmicAlbum from 'figma:asset/63b4adca0b4997b6531469627695f38b7ac9c62d.png';

<img src={cosmicAlbum} alt="Cosmic Album" />
```

---

## 🎨 Paleta de Cores Extraída

Baseado nas imagens fornecidas:

```css
/* Red Velvet Color Palette */
:root {
  --rv-primary-red: #FF0000;      /* Vermelho vibrante "Red Flavor" */
  --rv-accent-pink: #FF69B4;      /* Rosa choque */
  --rv-soft-pink: #FFB6C1;        /* Rosa suave */
  --rv-lavender: #E6E6FA;         /* Lavanda */
  --rv-dark-red: #8B0000;         /* Vermelho escuro */
  --rv-cream: #FFF8DC;            /* Creme/Cornsilk */
}
```

---

## 💡 Sugestões de Uso Futuro

### Página "Red Velvet Era" Dedicada
Criar uma página especial `/era/redvelvet` que:
- Use a imagem da Fantasy House como background hero
- Galeria com todas as capas de álbum
- Timeline da carreira do grupo
- Produtos exclusivos Red Velvet

### Carrossel de Eras na Welcome
Substituir os cards estáticos por um carrossel com:
- Imagem representativa de cada Era
- Red Velvet usa qualquer uma das 7 imagens fornecidas
- Transição suave com Motion

### Easter Eggs
- Clicar 5x no logo quando Red Velvet está ativo → exibe performance de "Peek-A-Boo"
- Photocard aleatória de Red Velvet ao completar pedido

---

## 📁 Estrutura de Assets Recomendada

Se migrar para assets locais:

```
src/assets/
├── eras/
│   ├── redvelvet/
│   │   ├── fantasy-house.png
│   │   ├── mansion.png
│   │   ├── members-dark.png
│   │   ├── the-red-album.png
│   │   ├── perfect-velvet.png
│   │   ├── peek-a-boo.png
│   │   └── cosmic-album.png
│   ├── aespa/
│   ├── enhypen/
│   ├── bts/
│   └── blackpink/
```

---

## 🔧 Componente Utilitário: EraImage

```typescript
// /src/app/components/EraImage.tsx

import { useUniverse } from '../context/UniverseContext';

interface EraImageProps {
  alt: string;
  className?: string;
  type?: 'hero' | 'card' | 'icon';
}

const eraImageMap = {
  aespa: {
    hero: 'figma:asset/aespa-hero.png',
    card: 'figma:asset/aespa-card.png',
    icon: 'figma:asset/aespa-icon.png',
  },
  redvelvet: {
    hero: 'figma:asset/d647babbb3a88ed8edc9f17c6150061b234756c9.png', // Fantasy House
    card: 'figma:asset/20e9f3bfb7f90d5ecdbfe007b2a25d7b7b8e15a4.png', // The Red
    icon: 'figma:asset/63b4adca0b4997b6531469627695f38b7ac9c62d.png', // Cosmic
  },
  // ... outras eras
};

export function EraImage({ alt, className, type = 'hero' }: EraImageProps) {
  const { universeActive } = useUniverse();
  const imageSrc = eraImageMap[universeActive]?.[type];

  if (!imageSrc) return null;

  return <img src={imageSrc} alt={alt} className={className} />;
}
```

Uso:
```typescript
<EraImage type="hero" alt="Era Background" className="w-full h-64 object-cover" />
```

---

## 📚 Referências de Design Red Velvet

### Álbuns Principais
1. **The Red** (2015) - Conceito vermelho vibrante, pop art
2. **The Velvet** (2016) - Conceito suave, R&B, tons pastéis
3. **Perfect Velvet** (2017) - Luxuoso, elegante, vermelho profundo
4. **The ReVe Festival** (2019) - Retrô, vintage, colorido
5. **Cosmic** (2024) - Futurista, space theme

### Estética Geral
- **Dual Concept:** "Red" (vibrante, enérgico) vs. "Velvet" (suave, elegante)
- **Cores:** Vermelho, rosa, lavanda, creme, preto
- **Temas:** Realeza, contos de fada, mistério, festa, espaço
- **Vibe:** Retro-futurismo, pastel goth, luxury pop

---

**Todas as imagens fornecidas estão prontas para uso com o formato `figma:asset` e podem ser integradas diretamente no código React/TypeScript!** ✨
