# 🌌 MIKROKOSMOS — SaaS de Gestão pra Restaurantes Temáticos

[English](./README.md) · **Português (Brasil)**

> Sistema full-stack de gestão pra restaurantes temáticos e cafés de K-pop — nascido como projeto universitário premiado, transformado em SaaS multilíngue e em tempo real.

🔗 **Demo ao vivo:** https://mikrokosmos-i9bp.vercel.app

---

## ✨ O que ele faz

O MIKROKOSMOS permite que um restaurante temático rode a operação inteira — cardápio, pedidos, cozinha, delivery e analytics — enquanto entrega ao cliente uma experiência imersiva que alterna entre os universos **K-pop** e **Cinema** (cada um com identidade visual, playlists e pratos temáticos próprios).

**Quatro papéis, quatro experiências:**

| Papel | O que vê |
|---|---|
| 🍽️ **Cliente** | Cardápio temático, carrinho, checkout e rastreamento do pedido em mapa real |
| 👨‍🍳 **Cozinha** | Fila de pedidos em tempo real com gestão de status |
| 🛵 **Delivery** | Fluxo de retirada/entrega com escolha de rota e mapa ao vivo |
| 🛡️ **Admin** | Dashboard completo: Matriz BCG, analytics de vendas, estoque, funcionários e editor de cardápio self-service |

## 🌍 Internacionalização no coração

Não é um app traduzido — é um app **arquitetado pra i18n**:

- **6 idiomas**: português, inglês, espanhol, coreano, japonês e chinês
- **A moeda acompanha o idioma**: preços são armazenados em BRL e convertidos na exibição (R$ → $, €, ₩, ¥) via `Intl.NumberFormat` — em todas as telas que mostram dinheiro, incluindo eixos e tooltips de gráficos
- **O banco nunca guarda texto traduzido ou formatado.** Status de pedido, formas de pagamento e papéis são slugs canônicos (`'preparando'`, `'cartao'`); a tradução acontece só na renderização. O cliente japonês e a cozinha brasileira veem o *mesmo* pedido, cada um no próprio idioma
- **As traduções do cardápio vivem dentro do dado**: cada prato carrega suas descrições nos 6 idiomas num objeto `jsonb` — editável pelo painel admin, sem código

## 🛠️ Gestão de cardápio self-service (o momento SaaS)

O operador do restaurante gerencia o cardápio **sem encostar em código**:

- Editor completo de pratos em dois lugares: a aba **"Pratos"** do admin e um **botão de editar em cada página de produto** (só admin)
- Edita preço, foto, ingredientes, alérgenos, nutrição — e as **traduções de cada descrição, por idioma, em um formulário com abas**
- Desativa um prato e ele some do cardápio de todos os clientes conectados **em tempo real**
- Cria pratos novos que já nascem multilíngues

## ⚡ Tempo real em tudo

Construído sobre **Supabase Realtime** (replicação lógica do PostgreSQL):

- Cozinha marca pedido como pronto → painel do delivery e a tela de rastreamento do cliente atualizam na hora, sem F5
- Admin edita um prato → todo cardápio aberto atualiza ao vivo
- O entregador escolhe uma entre até 3 rotas alternativas → o mapa do cliente redesenha só com a rota escolhida

## 🗺️ Rastreamento de entrega real

- Mapa **Leaflet** com tiles escuros CARTO combinando com a estética cyberpunk
- **Pipeline de geocodificação feito pro Brasil**: ViaCEP resolve a rua e a busca estruturada do Nominatim posiciona (a busca direta por CEP no Nominatim devolve bairros errados no Brasil — descoberto e contornado)
- **Roteamento real via OSRM** com rotas alternativas; a escolha da rota é restrita aos papéis delivery/admin
- **ETA dinâmico** com contagem regressiva baseada na duração real da rota × progresso da entrega, formatado por idioma

## 🔐 Segurança (RLS auditado)

Todas as regras de acesso são aplicadas **no banco** via Row Level Security — o front-end nunca é a fronteira de segurança. Uma autoauditoria encontrou e corrigiu vulnerabilidades reais:

- ❌ Escalação de privilégio (usuário conseguia se autopromover a admin) → ✅ bloqueado por trigger `guard_role_change`; só admin altera papéis
- ❌ E-mails expostos publicamente → ✅ perfis restritos ao dono + equipe
- ❌ Pedidos podiam ser criados em nome de terceiros → ✅ INSERT amarrado ao usuário autenticado
- Visitante usa carrinho em localStorage; usuário logado usa carrinho no banco com **merge no login**

## 🧰 Stack

**React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · react-i18next · Recharts · Leaflet · Supabase (PostgreSQL, Auth, RLS, Realtime) · Vercel**

## 🏆 História de origem

O MIKROKOSMOS começou como projeto da disciplina de Desenvolvimento Front-End no Unasp-SP, onde conquistou o **2º lugar na competição da turma com nota máxima** — com destaque especial pra internacionalização. De lá pra cá, foi re-engenheirado de um protótipo que vivia só no navegador (localStorage) pra um sistema com banco de dados, tempo real e gestão self-service.

## 🗺️ Roadmap até o mercado

Faseamento consciente — demo hoje, produto amanhã:

- [ ] **Multi-tenancy** (`tenant_id` + isolamento via RLS) pra atender vários restaurantes numa mesma instalação
- [ ] **Pagamento real** (Stripe / Mercado Pago) substituindo o checkout simulado
- [ ] **Conteúdo temático original** no lugar das referências com marca registrada (grupos de K-pop / franquias de cinema são só demo; comercializar exige IP licenciado ou próprio)
- [ ] Posição GPS do entregador ao vivo via Realtime

## 👩‍💻 Autoras

**Alice de Oliveira Rocha** — arquitetura & desenvolvimento · **Giovanna** — colaboradora

---

*"On Wednesdays we wear pink — and ship features."* 💜
