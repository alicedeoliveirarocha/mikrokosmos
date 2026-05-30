# 🌌 MIKROKOSMOS - Themed-Sync System v2.0

> Um SaaS de Comanda Digital Temática que oferece experiências imersivas de K-pop e Cinema através de um sistema universal de temas

![Status](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg)

## 📖 Sobre o Projeto

**Mikrokosmos** é um **SaaS (Software as a Service) multi-tenant** que permite restaurantes e cafés oferecerem experiências temáticas completas aos seus clientes. O sistema foi desenvolvido com uma arquitetura escalável que suporta múltiplas categorias de entretenimento usando a mesma base de código.

### 🎯 Conceito Principal

O projeto implementa um **Themed-Sync System** universal que sincroniza toda a identidade visual do estabelecimento com "universos" temáticos de entretenimento, transformando a gastronomia em uma experiência narrativa e imersiva.

## 🚀 Novidades v2.0 (Reset do Main - 15/04/2026)

### ✨ Arquitetura Universal de Temas

**Antes:** O sistema tinha CSS "casado" com K-pop, e os temas de Cinema só funcionavam em páginas específicas.

**Agora:** Arquitetura completamente neutra onde **K-pop e Cinema são tratados igualmente**, funcionando em TODAS as rotas.

- ✅ **7 Universos Temáticos** (5 K-pop + 2 Cinema)
- ✅ **Sistema de Categorias** (Kpop / Cinema)
- ✅ **Persistência de Preferências** (localStorage)
- ✅ **CSS Variables Dinâmicas** (injetadas em tempo real)
- ✅ **Data Attributes** para seleção de estilos
- ✅ **Preparado para Expansão** (fácil adicionar Anime, Disney, etc.)

📚 **Documentação Técnica:** [ARQUITETURA_TEMAS.md](./ARQUITETURA_TEMAS.md)

## ✨ Principais Características

### 🎨 7 Universos Temáticos

#### **Categoria K-pop (Galaxy Background)**

1. **AESPA** - Cyberpunk Era
   - Cores: Ciano & Verde Neon (#00FFFF)
   - Estética futurista e tecnológica

2. **ENHYPEN** - Dark Fantasy
   - Cores: Vermelho Sangue & Dourado (#FF1744)
   - Estética vampírica e sofisticada

3. **BTS** - Purple Era
   - Cores: Roxo & Dourado (#9C27B0)
   - Estética ARMY com identidade roxa

4. **BLACKPINK** - Pink Venom
   - Cores: Rosa & Pink (#FF1493)
   - Estética poderosa e feminina

5. **RED VELVET** - ReVe Festival
   - Cores: Vermelho & Rosa (#FF0000)
   - Estética dual concept (Red + Velvet)

#### **Categoria Cinema (Cinematic Background)**

6. **STAR WARS** - Galactic Empire
   - Cores: Amarelo & Verde (#FFE81F)
   - Estética espacial e épica

7. **MARVEL** - Stark Industries
   - Cores: Vermelho & Dourado (#ED1D24)
   - Estética heroica e tecnológica

### 🍜 Gastronomia Narrativa

- **12+ produtos temáticos** inspirados em músicas e franchises
- Nomes criativos como "Supernova Ramen", "Force Awakens Burger", "Infinity Shake"
- Sistema de categorias: Pratos Principais, Combos, Bebidas, Entradas, Sushi, Sobremesas

### 🎭 Experiência UI/UX Adaptativa

- **Glassmorphism Dinâmico** - Efeito de vidro que se adapta ao tema
- **Backgrounds Inteligentes** - Galaxy (K-pop) vs Cinematic (Cinema)
- **Animações suaves** com Motion (Framer Motion)
- **Design responsivo** mobile-first
- **Neon effects** dinâmicos que mudam com o universo ativo

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18.3.1** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool

### Styling
- **Tailwind CSS v4** - Framework CSS utilitário
- **Custom CSS Variables** - Sistema de temas dinâmico
- **Data Attributes** - Seleção condicional de estilos

### Funcionalidades
- **React Router** - Navegação entre páginas (Data mode)
- **Motion (Framer Motion)** - Animações e transições
- **Context API** - Gerenciamento de estado global
- **Lucide React** - Ícones
- **Sonner** - Toast notifications

## 📚 Conexão com o Cronograma Educacional

Este projeto foi desenvolvido alinhado ao cronograma de **Desenvolvimento Front-End** (03/03/26 - 24/06/26) e implementa conceitos de:

### Módulo 1: JavaScript ES6+ (Semanas 1-4)
- ✅ Variáveis, tipos de dados e operadores
- ✅ Estruturas de controle e laços
- ✅ Funções e escopo - modularização
- ✅ Manipulação de DOM
- ✅ Objetos e Arrays
- ✅ Eventos e interatividade
- ✅ LocalStorage para persistência

### Módulo 2: BaaS & APIs (Semanas 5-8)
- ✅ Estrutura preparada para Firebase/Supabase
- ✅ CRUD de produtos (Frontend)
- ✅ Fetch API e Async/Await ready
- ✅ Real-time updates structure

### Módulo 3: React & Design (Semanas 9-12)
- ✅ Componentização com React
- ✅ UX/UI Design com feedback visual
- ✅ Animações e transições CSS
- ✅ React Router para navegação
- ✅ Context API para estado global
- ✅ Custom Hooks

## 🚀 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Header.tsx       # Cabeçalho com navegação
│   │   ├── ProductCard.tsx  # Card de produto
│   │   ├── UniverseToggle.tsx # Seletor de tema universal
│   │   ├── Layout.tsx       # Layout com background adaptativo
│   │   └── ...
│   ├── context/             # Contexts do React
│   │   ├── CartContext.tsx  # Carrinho de compras
│   │   ├── UniverseContext.tsx # Temas/Universos (v2.0)
│   │   ├── AuthContext.tsx  # Autenticação
│   │   └── OrdersContext.tsx # Pedidos
│   ├── data/                # Dados da aplicação
│   │   └── products.ts      # Catálogo de produtos
│   ├── pages/               # Páginas da aplicação
│   │   ├── Welcome.tsx      # Tela inicial
│   │   ├── Home.tsx         # Cardápio principal
│   │   ├── Cinema.tsx       # Experiência Cinema
│   │   ├── ProductDetail.tsx # Detalhes do produto
│   │   ├── Cart.tsx         # Carrinho
│   │   ├── Analytics.tsx    # Análise de dados (CEO)
│   │   ├── Kitchen.tsx      # Painel da cozinha
│   │   ├── Info.tsx         # Sobre o projeto
│   │   └── Learning.tsx     # Dashboard educacional
│   └── routes.tsx           # Configuração de rotas
├── styles/                  # Estilos globais
│   ├── tailwind.css         # Sistema universal de temas
│   └── theme.css            # Tema base
└── ...
```

## 🎓 Páginas Especiais

### 📊 Learning Dashboard (`/learning`)
Página que mapeia os conceitos do cronograma educacional implementados no projeto, mostrando:
- Timeline de aprendizado
- Tópicos por semana
- Features implementadas
- Stack tecnológica

### 📖 Info (`/info`)
Documentação completa do conceito Mikrokosmos:
- Features detalhadas
- Universos temáticos
- Filosofia do projeto
- Tech stack

### 📈 Analytics (`/analytics`)
Dashboard executivo com:
- Matriz BCG de produtos
- Gráficos de vendas
- KPIs importantes
- Análise por universo

## 🎯 Funcionalidades Implementadas

### v2.0 (Atual)
- [x] Sistema universal de temas (K-pop + Cinema)
- [x] Backgrounds adaptativos por categoria
- [x] Persistência de preferências (localStorage)
- [x] CSS Variables dinâmicas
- [x] Data attributes para seleção de estilos
- [x] 7 universos temáticos completos

### v1.0
- [x] Carrinho de compras com persistência de estado
- [x] Filtros por categoria
- [x] Animações suaves e responsivas
- [x] Design glassmorphism
- [x] Navegação entre páginas
- [x] Feedback visual (toasts)
- [x] Efeitos neon dinâmicos
- [x] Mobile-first responsive design

## 💡 Conceitos de Design

### Themed-Sync System v2.0
Sistema proprietário que permite mudança instantânea de identidade visual através de:

**CSS Variables (injetadas dinamicamente):**
```css
--primary-neon: #00FFFF;  /* Cor principal dinâmica */
--gradient-from: #00FFFF; /* Gradiente início */
--gradient-to: #0080FF;   /* Gradiente fim */
--accent-color: #0080FF;  /* Cor de destaque */
```

**Data Attributes (seleção condicional):**
```html
<div class="universe-background" data-category="Kpop">
  <!-- Background galaxy com estrelas -->
</div>

<div class="universe-background" data-category="Cinema">
  <!-- Background cinematic escuro -->
</div>
```

### Glassmorphism
Efeito de vidro fosco que cria profundidade:
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

## 🎨 Paleta de Cores por Universo

| Universo | Cor Principal | Gradiente | Categoria | Conceito |
|----------|--------------|-----------|-----------|----------|
| AESPA | `#00FFFF` | Ciano → Verde Neon | Kpop | Cyberpunk |
| ENHYPEN | `#FF1744` | Vermelho → Dourado | Kpop | Dark Fantasy |
| BTS | `#9C27B0` | Roxo → Dourado | Kpop | Purple Era |
| BLACKPINK | `#FF1493` | Rosa → Pink | Kpop | Pink Venom |
| RED VELVET | `#FF0000` | Vermelho → Rosa | Kpop | Dual Concept |
| STAR WARS | `#FFE81F` | Amarelo → Verde | Cinema | Galactic |
| MARVEL | `#ED1D24` | Vermelho → Dourado | Cinema | Heroic |

## 📋 Sprints e Roadmap

### ✅ Sprint 1 (Concluída - v2.0)
- Reset do Main - Arquitetura Universal
- 7 Universos Temáticos
- Persistência de preferências
- Sistema de categorias

### 🔄 Sprint 2 (Em Andamento)
**Objetivo:** "O Sistema Inteligente"

**Alice (Product Lead & Frontend Architect):**
- [ ] Tela de Seleção de Sagas
- [ ] Micro-interações de transição entre universos
- [ ] Sistema de Photocards/Tickets colecionáveis
- [ ] Analytics com filtros por categoria

**Giovanna (Fullstack & Data Systems):**
- [ ] RBAC (Role-Based Access Control)
- [ ] Formulário de entrega com persistência
- [ ] Gestão de pedidos com status
- [ ] Histórico de pedidos no perfil

📚 **Roadmap Completo:** [SPRINT_2_ROADMAP.md](./SPRINT_2_ROADMAP.md)

### 🔮 Sprint 3 (Planejada)
- [ ] Integração com Supabase
- [ ] Deploy em produção
- [ ] PWA (Progressive Web App)
- [ ] Sistema de notificações em tempo real

## 📚 Documentação Adicional

- 📖 [ARQUITETURA_TEMAS.md](./ARQUITETURA_TEMAS.md) - Documentação técnica do sistema de temas
- 🎬 [DEMO_PROFESSOR.md](./DEMO_PROFESSOR.md) - Guia de apresentação ao professor
- ✅ [CHECKLIST_VALIDACAO.md](./CHECKLIST_VALIDACAO.md) - Testes funcionais
- 🗓️ [SPRINT_2_ROADMAP.md](./SPRINT_2_ROADMAP.md) - Planejamento da Sprint 2

## 👥 Equipe de Desenvolvimento

- **Alice** - Product Lead & Frontend Architect
- **Giovanna** - Fullstack & Data Systems Engineer

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte do cronograma de Desenvolvimento Front-End.

---

<p align="center">
  Desenvolvido com 💜 por Alice & Giovanna
  <br>
  <strong>MIKROKOSMOS v2.0</strong> - SaaS Temático Universal
  <br>
  <em>Onde entretenimento e gastronomia se encontram</em>
</p>