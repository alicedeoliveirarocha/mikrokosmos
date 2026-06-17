<div align="center">

# 🌌 MIKROKOSMOS
### Themed-Sync System

*Uma experiência gastronômica imersiva que sincroniza sabor, música e cultura K-pop*

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://mikrokosmos-i9bp.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

</div>

---

## 🍜 Sobre o Projeto

O **Mikrokosmos** é um sistema de restaurante temático K-pop desenvolvido como projeto acadêmico. Cada mesa do restaurante é sincronizada com uma *era* de um grupo K-pop diferente — alterando o tema visual, o cardápio exibido e a trilha sonora ambiente em tempo real.

O sistema também conta com um modo **Cinema**, onde as eras são trocadas por sagas cinematográficas (Star Wars, Marvel, Interstellar e outros).

🔗 **Demo ao vivo:** [mikrokosmos-i9bp.vercel.app](https://mikrokosmos-i9bp.vercel.app)

---

## ✨ Funcionalidades

### 🎵 Sistema K-pop
- **7 Universos K-pop:** BTS, BLACKPINK, AESPA, ENHYPEN, RED VELVET, NEWJEANS, ILLIT
- Tema visual dinâmico sincronizado com a era ativa
- Música ambiente por grupo (sons customizados)

### 🃏 Photocards
- +77 photocards reais dos grupos
- Sistema de raridades: Common, Rare, Ultra Rare, Legendary
- Efeito shimmer animado nos cards Ultra Rare
- 3 photocards grátis por pedido (opcional)

### 🎬 Modo Cinema
- 5 sagas cinematográficas: Star Wars, Spider-Man, Mean Girls, Marvel, Interstellar
- Tema visual alternativo com estética cinematográfica
- Photocards exclusivos de cinema

### 🛒 Carrinho & Pedidos
- Múltiplos métodos de pagamento: PIX, Dinheiro, Cartão
- Dados do cliente salvos localmente (endereços múltiplos, cartões)
- Observações por pedido
- Acompanhamento de pedido em tempo real

### 👥 Sistema de Roles
| Role | Acesso |
|------|--------|
| `cliente` | Cardápio, carrinho, meus pedidos |
| `cozinha` | Painel de pedidos da cozinha |
| `delivery` | Painel de entregas |
| `admin` | Tudo + Analytics |

### 🌍 Internacionalização (i18n)
Suporte completo a 6 idiomas:
🇧🇷 Português · 🇺🇸 English · 🇰🇷 한국어 · 🇯🇵 日本語 · 🇪🇸 Español · 🇨🇳 中文

### 📊 Analytics
- Dashboard BCG (Matriz de portfólio)
- Métricas de vendas por categoria
- Análise de universos mais populares

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| **React 18** + **TypeScript** | Interface e tipagem |
| **Vite** | Build e bundler |
| **Tailwind CSS** | Estilização |
| **Framer Motion** | Animações |
| **Supabase** | Banco de dados e autenticação |
| **React Router v7** | Navegação |
| **i18next** | Internacionalização |
| **Sonner** | Notificações toast |
| **Lucide React** | Ícones |
| **Recharts** | Gráficos analytics |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase (para o banco de dados)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/alicedeolivirarocha/mikrokosmos.git
cd mikrokosmos

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves do Supabase

# 4. Rode o projeto
npm run dev
```

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Header.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ...
│   ├── context/          # Contextos React (Auth, Cart, Orders, Universe)
│   ├── data/             # Dados estáticos (produtos, photocards)
│   ├── pages/            # Páginas da aplicação
│   │   ├── Welcome.tsx
│   │   ├── Home.tsx
│   │   ├── Cart.tsx
│   │   ├── Cinema.tsx
│   │   ├── Kitchen.tsx
│   │   ├── Delivery.tsx
│   │   └── Analytics.tsx
│   └── routes.tsx
├── i18n/
│   ├── config.ts
│   └── locales/          # Traduções (pt-BR, en, ko, ja, es, zh)
└── lib/
    └── supabase.ts
```

---

## 👩‍💻 Equipe

| Nome | GitHub |
|------|--------|
| **Alice de Oliveira Rocha** | [@alicedeolivirarocha](https://github.com/alicedeolivirarocha) |
| **Giovanna** | — |

---

## 📚 Contexto Acadêmico

Projeto desenvolvido para a disciplina de **Desenvolvimento de Sistemas** — Sprint 3.

**Entregas do Sprint 3:**
- [x] Photocards com sistema de raridades
- [x] 77+ cards reais dos 7 grupos K-pop
- [x] Fluxo completo de pedido com pagamento
- [x] Internacionalização (6 idiomas)
- [x] Modo Cinema com 5 sagas
- [x] Sistema de roles (cliente / cozinha / delivery / admin)
- [x] Analytics com métricas de vendas

---

<div align="center">
  <sub>Feito com 💜 e muito K-pop</sub>
</div>