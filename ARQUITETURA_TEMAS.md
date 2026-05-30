# 🎨 Arquitetura Universal de Temas - Mikrokosmos

## 📋 Visão Geral

O sistema de temas do Mikrokosmos foi **completamente desvinculado do K-pop**, criando uma arquitetura verdadeiramente escalável onde **K-pop e Cinema são tratados igualmente**. Não existe mais um "tema padrão" - o sistema se adapta dinamicamente ao universo ativo.

---

## 🔧 Componentes Principais

### 1. **UniverseContext** (`/src/app/context/UniverseContext.tsx`)

**O que faz:**
- Gerencia o estado global do universo/tema ativo
- Injeta CSS variables dinamicamente no `document.documentElement`
- Salva a preferência do usuário no `localStorage`
- Exporta a configuração de todos os 7 universos (5 K-pop + 2 Cinema)

**Principais recursos:**

```typescript
// Persistência automática
localStorage.setItem('mikrokosmos-universe', universe);

// CSS Variables injetadas
--primary-neon: #00FFFF (ou cor do tema ativo)
--gradient-from: #00FFFF (ou cor do tema ativo)
--gradient-to: #0080FF (ou cor do tema ativo)
--accent-color: #0080FF (nova variável)

// Data attributes no HTML
data-universe="aespa" (ou universo ativo)
data-categoria="Kpop" (ou "Cinema")
```

**Como usar:**
```typescript
import { useUniverse } from '../context/UniverseContext';

const { universeActive, setUniverse, categoria, universeName } = useUniverse();
```

---

### 2. **Layout.tsx** (`/src/app/components/Layout.tsx`)

**Antes (problema):**
```tsx
// ❌ Lógica baseada em ROTA - Cinema só funcionava na página /cinema
const isCinema = location.pathname === '/cinema';
<div className={isCinema ? 'cinema-mode' : 'galaxy-background'}>
```

**Depois (solução):**
```tsx
// ✅ Lógica baseada em CATEGORIA - Funciona em QUALQUER página
const { categoria } = useUniverse();
<div className="universe-background" data-category={categoria}>
```

**Resultado:**
- Star Wars e Marvel agora funcionam em **todas as rotas**
- AESPA, BTS, etc. também funcionam em **todas as rotas**
- Basta trocar o universo no UniverseToggle!

---

### 3. **tailwind.css** (`/src/styles/tailwind.css`)

**Antes (problema):**
```css
/* ❌ CSS hardcodado do AESPA como padrão */
:root {
  --primary-neon: #00FFFF; /* Sempre AESPA */
}
.galaxy-background { /* Sempre K-pop */ }
```

**Depois (solução):**
```css
/* ✅ Sistema Universal com Data Attributes */
.universe-background[data-category="Kpop"] {
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  /* Efeito galaxy com estrelas */
}

.universe-background[data-category="Cinema"] {
  background: #050505;
  /* Efeito cinematic escuro */
}
```

**Resultado:**
- Nenhum tema é "hardcodado" como padrão
- K-pop e Cinema têm estilos de background completamente diferentes
- Transições suaves entre os universos

---

## 🎯 Como Adicionar Novos Universos

### Exemplo: Adicionar "Anime"

**1. Adicione no UniverseContext:**
```typescript
type Universe = 'aespa' | 'enhypen' | 'bts' | 'blackpink' | 'redvelvet' | 'starwars' | 'marvel' | 'anime'; // ← Adicione aqui

const themeConfig = {
  // ... outros temas
  anime: {
    name: 'ANIME',
    primaryColor: '#FF1493',
    gradientFrom: '#FF1493',
    gradientTo: '#8A2BE2',
    categoria: 'Anime' as const, // Nova categoria!
    accentColor: '#FF69B4',
  },
};
```

**2. Adicione o background no tailwind.css:**
```css
.universe-background[data-category="Anime"] {
  background: linear-gradient(180deg, #1a0033 0%, #000000 100%);
}

.universe-background[data-category="Anime"]::before {
  /* Efeitos visuais específicos do Anime */
}
```

**3. Pronto!** O sistema já vai funcionar em todas as páginas.

---

## 💾 Persistência de Dados

### LocalStorage Structure

```typescript
// Universo ativo
localStorage.getItem('mikrokosmos-universe') // "starwars", "aespa", etc.

// Próximos passos (Sprint 2):
localStorage.getItem('mikrokosmos-user-address') // Dados de entrega
localStorage.getItem('mikrokosmos-user-profile') // Nome, foto, etc.
localStorage.getItem('mikrokosmos-favorite-saga') // Saga favorita do usuário
```

**Benefícios:**
- O usuário não precisa escolher o tema toda vez
- Funciona offline
- Preparado para adicionar mais dados de usuário

---

## 🚀 Próximos Passos (Sprint 2 & 3)

### Alice (Product Lead & Frontend Architect)
- [ ] Criar micro-interações nas transições entre eras
- [ ] Adicionar "Saga Selection Screen" na tela Welcome
- [ ] Implementar sistema de "Photocards/Tickets" colecionáveis
- [ ] Melhorar a página Analytics com gráficos específicos por categoria

### Giovanna (Fullstack & Data Systems)
- [ ] Implementar RBAC (Role-Based Access Control)
- [ ] Criar formulário de entrega com persistência
- [ ] Sistema de mudança de status de pedidos
- [ ] Histórico de pedidos no perfil

### Dupla
- [ ] Deploy no Vercel/Netlify
- [ ] Testes em dispositivos móveis
- [ ] Documentação final para o professor

---

## 📊 Diagrama do Sistema

```
┌─────────────────────────────────────────┐
│         UniverseProvider (Context)       │
│  - Gerencia estado global do universo   │
│  - Salva no localStorage                │
│  - Injeta CSS variables                 │
└─────────────┬───────────────────────────┘
              │
              ├─► Layout.tsx
              │   └─► <div data-category={categoria}>
              │
              ├─► UniverseToggle.tsx
              │   └─► Botões para trocar universo
              │
              ├─► Home.tsx, Cinema.tsx, etc.
              │   └─► Usam useUniverse() para dados
              │
              └─► tailwind.css
                  └─► Estilos se adaptam via [data-category]
```

---

## 🎓 Para o Professor (CEO)

**Conceitos Aplicados:**
- ✅ **Context API**: Gerenciamento de estado global
- ✅ **LocalStorage**: Persistência de dados no navegador
- ✅ **CSS Variables**: Temas dinâmicos
- ✅ **Data Attributes**: Seleção condicional de estilos
- ✅ **TypeScript**: Type safety em todos os componentes
- ✅ **Separation of Concerns**: Lógica separada da apresentação

**Resultado:**
Um SaaS verdadeiramente **multi-tenant** onde cada restaurante pode escolher entre 7 experiências temáticas diferentes usando o **mesmo código base**.

---

## 📝 Changelog

### v2.0.0 - Reset do Main (15/04/2026)
- ✅ Desvinculação completa do CSS do K-pop
- ✅ Sistema universal baseado em categorias
- ✅ Persistência de preferências do usuário
- ✅ Suporte para 7 universos (5 K-pop + 2 Cinema)
- ✅ Background se adapta automaticamente em todas as rotas
- ✅ Preparado para adicionar novas categorias (Anime, etc.)

---

**Desenvolvido por:** Alice (Product Lead) & Giovanna (Fullstack)  
**Data:** 15/04/2026  
**Projeto:** Mikrokosmos - Comanda Digital Temática SaaS
