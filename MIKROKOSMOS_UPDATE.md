# 🌌 Mikrokosmos - Comanda Digital Temática K-pop

## 🎭 Novas Funcionalidades - Sprint Red Velvet & Cinema

### ✨ O que foi adicionado?

#### 1️⃣ **Era Red Velvet** 🍒
Adicionamos o **Red Velvet** como a quinta Era disponível no Themed-Sync System!

**Características da Era Red Velvet:**
- **Cor Principal:** `#FF0000` (Vermelho vibrante "Red Flavor")
- **Gradiente:** Vermelho para Rosa Choque (`#FF0000` → `#FF69B4`)
- **Tema:** ReVe Festival - Pastel-Hologram
- **Estética:** Vintage K-pop com tons vermelhos intensos e detalhes em rosa

**Como acessar:**
1. Clique no botão flutuante "Era: [NOME]" no canto inferior direito
2. Selecione "RED VELVET - ReVe Festival" na lista
3. Todo o sistema mudará para a paleta de cores Red Velvet instantaneamente

#### 2️⃣ **Modo Cinema** 🎬
Uma experiência completamente nova que transforma o Mikrokosmos em um cinema K-pop imersivo!

**Funcionalidades do Cinema:**
- **Sessões em Cartaz:** Filmes conceituais dos grupos K-pop
  - Whiplash: The Movie (AESPA)
  - Dark Moon: Lunar Eclipse (ENHYPEN)
  - The ReVe Festival: Cinema Edition (RED VELVET)
  
- **Combos & Snacks:** Cardápio especial de cinema
  - Combo K-pop Lover (Pipoca + Refri + Photocard)
  - Combo Luxury Box (Pipoca XL + 2 Refris + Nachos + Light Stick)
  - Combo Snack Time (Hot Dog + Suco + Chocolate)

- **Design Diferenciado:**
  - Background estilo projetor de cinema
  - Efeitos de iluminação cinematográfica (spotlight)
  - Film grain texture para atmosfera vintage
  - Botões em formato de ingresso (ticket-shape)
  - Glassmorphism escuro simulando vitrines de cinema

**Como acessar:**
1. Na página Welcome, clique em "🎬 MODO CINEMA"
2. Ou use o botão "Cinema" no header (ícone de filme)
3. Navegue pelas sessões e combos disponíveis

---

## 🎨 Sistema de Temas Atualizado

### Eras Disponíveis:
1. **AESPA** - Cyberpunk Era (`#00FFFF`)
2. **ENHYPEN** - Dark Fantasy (`#FF1744`)
3. **BTS** - Purple Era (`#9C27B0`)
4. **BLACKPINK** - Pink Venom (`#FF1493`)
5. **RED VELVET** - ReVe Festival (`#FF0000`) ✨ **NOVO!**

Cada Era sincroniza automaticamente:
- Cores de texto e bordas
- Brilho neon e sombras
- Gradientes de fundo
- Efeitos de hover e animações

---

## 📁 Arquivos Modificados

### Contexto e Lógica:
- `UniverseContext.tsx` - Adicionado tipo e configuração Red Velvet
- `routes.tsx` - Nova rota `/cinema`

### Componentes:
- `UniverseToggle.tsx` - Red Velvet na lista de seleção
- `Header.tsx` - Botão Cinema no menu
- `Welcome.tsx` - Atualizado para 5 universos + botão Cinema

### Estilos:
- `tailwind.css` - Adicionados:
  - `.era-redvelvet` - Estilos específicos da Era
  - `.cinema-mode` - Background de cinema
  - `.cinema-glass` - Glassmorphism escuro
  - `.ticket-shape` - Formato de ingresso
  - `.spotlight` - Efeito de holofote
  - `.film-grain` - Textura de filme

### Páginas:
- **NOVO:** `Cinema.tsx` - Página completa do modo cinema

---

## 🚀 Como Usar no Projeto

### Navegação:
```
/ (Welcome)
  ├── /home (Menu Principal - Galaxy Mode)
  ├── /cinema (Cinema Mode) ✨ NOVO!
  ├── /carrinho (Carrinho)
  ├── /cozinha (Painel Cozinha)
  ├── /delivery (Painel Delivery)
  ├── /analytics (Dashboard Analytics)
  └── ... outras rotas
```

### Alternar entre Modos:
- **Galaxy Mode (Restaurante):** Padrão, foco em cardápio temático
- **Cinema Mode:** Experiência imersiva de cinema + gastronomia

Ambos os modos mantêm:
- Sistema de carrinho
- Autenticação
- Pedidos
- Troca de Eras
- Responsividade

---

## 🎓 Integração com o Cronograma Acadêmico

**Semana 1-3 (Heloísa & Alice):**
- ✅ Sistema de Roles (RBAC) - Preparado para expansão
- ✅ Red Velvet Era implementada
- ✅ Cinema Mode como feature SaaS
- ✅ Testes em todas as eras

**Tecnologias Demonstradas:**
- **React Context API** - UniverseContext com novo tipo
- **TypeScript** - Type safety na Era Red Velvet
- **CSS Variables** - Themed-Sync dinâmico
- **React Router** - Rota Cinema
- **Motion (Framer Motion)** - Animações suaves
- **Responsive Design** - Mobile-first

---

## 🎬 Conceitos de Design Aplicados

### Red Velvet Era:
- **Referência Visual:** Álbuns "The Red" e "ReVe Festival"
- **Paleta:** Vermelho intenso + Rosa choque
- **Mood:** Retro, vintage, glamour

### Cinema Mode:
- **Referência:** Cinemas de luxo + Music videos K-pop
- **Iluminação:** Efeito projetor + holofotes
- **Texturas:** Film grain + glassmorphism escuro
- **Layout:** Cartazes de filme + tickets

---

## 📱 Screenshots & Uso

### Trocar Era para Red Velvet:
1. Botão flutuante inferior direito
2. Popup com 5 opções
3. Seleção instantânea

### Acessar Cinema:
1. Welcome → Botão "🎬 MODO CINEMA"
2. Header → Ícone de filme
3. Explorar sessões e combos

---

## 🔮 Próximas Expansões Sugeridas

### Para Alice (UX/UI):
- [ ] Animações de transição entre Eras
- [ ] Photocard modal ao finalizar pedido no Cinema
- [ ] Trailer videos nos cards de sessão

### Para Heloísa (Backend/Logic):
- [ ] Integrar ingressos ao sistema de pedidos
- [ ] RBAC: Cliente vê Cinema / CEO vê Analytics de ingressos
- [ ] Persistência de "Sessão favorita" por usuário

### Para Giovanna (Data/Firebase):
- [ ] Salvar histórico de Eras preferidas
- [ ] Analytics de vendas por Era
- [ ] Dashboard: Qual Era vende mais?

---

## 💡 Dicas de Apresentação

**Roteiro Alice:**
> "Professor, além de adicionar o Red Velvet como quinta Era, criamos o 'Cinema Mode' - uma experiência paralela onde o restaurante se transforma em um cinema K-pop. É SaaS na prática: um único sistema, múltiplas experiências visuais, mantendo todas as funcionalidades."

**Roteiro Heloísa:**
> "No código, cada componente React respeita o 'universeActive' do Context. Adicionamos Red Velvet ao tipo Union do TypeScript e ao themeConfig. A nova rota /cinema usa os mesmos hooks (useCart, useUniverse) - isso é reutilização de código na prática."

**Demo ao Vivo:**
1. Welcome → Mostrar 5 Eras
2. Trocar para Red Velvet
3. Entrar no Cinema Mode
4. Voltar pro Galaxy Mode
5. Mostrar que carrinho persiste em ambos

---

## 🎯 Objetivos Alcançados

✅ **Themed-Sync System** expandido para 5 Eras  
✅ **Dual Experience:** Galaxy + Cinema  
✅ **Glassmorphism** aplicado em ambos os modos  
✅ **Responsivo** e acessível  
✅ **TypeScript** com type safety  
✅ **React Router** com rotas aninhadas  
✅ **Context API** compartilhado  
✅ **Motion** para animações  
✅ **Cronograma** alinhado  

---

**Versão:** 2.0 - Red Velvet & Cinema Update  
**Data:** Abril 2026  
**Equipe:** Alice (PM/UX), Heloísa (Backend), Giovanna (Data)  
**Stack:** React + TypeScript + Tailwind CSS v4 + Motion

🌌 **Welcome to Mikrokosmos - Where Music Meets Flavor!**
