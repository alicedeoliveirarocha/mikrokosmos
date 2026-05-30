# 🔐 Sistema RBAC + LocalStorage + Custom Responses

**Data de Implementação:** 16 de Abril de 2026  
**Status:** ✅ Completo  
**Implementado por:** Alice (Solo)

---

## 📋 Resumo Executivo

Implementação dos itens **B, C e D** do checklist do Mikrokosmos:

- **B:** Sistema de níveis de acesso (RBAC) para diferentes usuários
- **C:** Sistema de persistência com Local Storage para salvar dados
- **D:** Sistema de custom responses (mensagens personalizadas por role)

---

## 🎯 B. Sistema RBAC (Role-Based Access Control)

### Papéis do Sistema

O sistema agora suporta 4 níveis de acesso diferentes:

| Role | Nome | Descrição | Ícone | Cor |
|------|------|-----------|-------|-----|
| `cliente` | Cliente | Fazer pedidos e navegar pelo cardápio | 👤 UserCircle | Cyan (#00FFFF) |
| `cozinha` | Cozinha | Gerenciar preparo de pedidos | 👨‍🍳 ChefHat | Laranja (#FF6B35) |
| `delivery` | Delivery | Controlar entregas | 🚴 Bike | Dourado (#FFD700) |
| `admin` | Admin | Acesso total ao sistema | 🛡️ Shield | Roxo (#9C27B0) |

### Arquivos Modificados/Criados

#### 1. `/src/app/context/AuthContext.tsx` ✨
**Mudanças:**
- Adicionado tipo `UserRole` com 4 papéis
- Campo `role` adicionado à interface `User`
- Função `hasRole()` para verificar permissões
- Função `switchRole()` para trocar papel (demo/testes)
- Parâmetro `role` no registro de usuários

**Exemplo de uso:**
```typescript
const { user, hasRole } = useAuth();

// Verificar se tem um papel específico
if (hasRole('admin')) {
  // Mostrar conteúdo admin
}

// Verificar múltiplos papéis
if (hasRole(['cozinha', 'admin'])) {
  // Acesso permitido para cozinha OU admin
}
```

#### 2. `/src/app/components/ProtectedRoute.tsx` 🆕
Componente de proteção de rotas baseado em RBAC.

**Uso:**
```tsx
// Rota protegida - requer autenticação
<Route path="/perfil" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />

// Rota protegida - apenas para cozinha e admin
<Route path="/cozinha" element={
  <ProtectedRoute allowedRoles={['cozinha', 'admin']}>
    <Kitchen />
  </ProtectedRoute>
} />
```

**Features:**
- Redirecionamento automático se não autenticado
- Tela de "Acesso Negado" elegante com glassmorphism
- Mostra papel atual do usuário
- Indica quais papéis têm acesso

#### 3. `/src/app/components/RoleSwitcher.tsx` 🆕
Botão flutuante para trocar entre papéis (modo demonstração).

**Features:**
- Botão flutuante no canto inferior esquerdo
- Modal elegante com todos os papéis disponíveis
- Indicador visual do papel ativo
- Toast de confirmação ao trocar papel
- Design adaptado às cores de cada papel

---

## 💾 C. Sistema de Persistência com LocalStorage

### Dados Salvos Automaticamente

Todos os dados abaixo são salvos no `localStorage` do navegador e persistem entre sessões:

#### 1. **Usuário Autenticado**
- **Chave:** `mikrokosmos_user`
- **Conteúdo:** Dados do usuário atual (sem senha)
- **Quando:** Login/Registro/Atualização de perfil

```json
{
  "id": "user_1745020800000",
  "nome": "Alice",
  "email": "alice@mikrokosmos.com",
  "role": "admin",
  "dataCriacao": "2026-04-16T12:00:00.000Z"
}
```

#### 2. **Banco de Usuários**
- **Chave:** `mikrokosmos_users`
- **Conteúdo:** Array com todos os usuários registrados
- **Quando:** Registro de novo usuário

```json
[
  {
    "id": "user_1745020800000",
    "nome": "Alice",
    "email": "alice@mikrokosmos.com",
    "senha": "senha123",
    "role": "admin",
    "dataCriacao": "2026-04-16T12:00:00.000Z"
  }
]
```

#### 3. **Carrinho de Compras**
- **Chave:** `mikrokosmos_cart`
- **Conteúdo:** Array de produtos no carrinho
- **Quando:** Adicionar/remover/atualizar itens

```json
[
  {
    "id": "prod_001",
    "nome": "Cosmic Bibimbap",
    "preco": 42.90,
    "quantidade": 2,
    "categoria": "Pratos Principais"
  }
]
```

#### 4. **Pedidos**
- **Chave:** `mikrokosmos_orders`
- **Conteúdo:** Array de todos os pedidos realizados
- **Quando:** Novo pedido/atualização de status

#### 5. **Universo/Tema Selecionado**
- **Chave:** `mikrokosmos-universe`
- **Conteúdo:** Nome do universo ativo
- **Quando:** Troca de tema

```json
"aespa"
```

#### 6. **Preferências de Notificação**
- **Chave:** `mikrokosmos_notification_prefs`
- **Conteúdo:** Objeto com preferências por usuário
- **Quando:** Ativação/desativação de notificações

### Arquivos Modificados

#### `/src/app/context/CartContext.tsx` ✨
- **Adicionado:** `useEffect` para carregar carrinho do localStorage ao iniciar
- **Adicionado:** `useEffect` para salvar carrinho automaticamente quando mudar
- **Resultado:** Carrinho persiste entre sessões

#### `/src/app/context/AuthContext.tsx` ✨
- **Já existente:** Salvamento de usuário no localStorage
- **Melhorado:** Agora salva também o papel (role) do usuário

#### `/src/app/context/UniverseContext.tsx` ✅
- **Já existente:** Salvamento do universo selecionado
- **Nenhuma mudança necessária**

#### `/src/app/context/OrdersContext.tsx` ✅
- **Já existente:** Salvamento de pedidos
- **Nenhuma mudança necessária**

---

## 💬 D. Sistema de Custom Responses

### Arquivo: `/src/app/utils/customResponses.ts` 🆕

Sistema completo de mensagens personalizadas baseadas no papel do usuário.

### Features

#### 1. Mensagens Específicas por Role

Cada papel tem suas próprias mensagens customizadas:

```typescript
// Cliente
customResponses.cliente.orderPlaced
// → "🎉 Pedido Realizado! Seu pedido foi confirmado..."

// Cozinha
customResponses.cozinha.orderReceived
// → "🔔 Novo Pedido! Um novo pedido chegou..."

// Delivery
customResponses.delivery.orderPicked
// → "📦 Pedido Coletado! Pedido retirado e a caminho..."

// Admin
customResponses.admin.systemUpdate
// → "🔄 Sistema Atualizado! As configurações foram atualizadas..."
```

#### 2. Mensagens de Boas-Vindas Contextuais

Função `getWelcomeMessage()` que gera saudações personalizadas baseadas em:
- **Horário do dia:** Bom dia / Boa tarde / Boa noite
- **Papel do usuário:** Mensagem customizada por role
- **Nome do usuário:** Personalização com o nome

```typescript
// Às 9h da manhã, role "cozinha", nome "João"
getWelcomeMessage('cozinha', 'João')
// → "Bom dia, Chef João! 👨‍🍳 Pronto para criar pratos incríveis?"

// Às 19h, role "cliente", nome "Maria"
getWelcomeMessage('cliente', 'Maria')
// → "Boa noite, Maria! 🌟 Explore nosso universo gastronômico K-pop."
```

#### 3. Helper Function

Função `getCustomResponse()` para buscar mensagens facilmente:

```typescript
const response = getCustomResponse('cozinha', 'orderReady');
toast.success(response.title, {
  description: response.message
});
```

#### 4. Preferências de Notificação

Funções para salvar preferências no localStorage:

```typescript
// Salvar preferência
saveNotificationPreference(userId, true);

// Buscar preferência
const enabled = getNotificationPreference(userId); // true/false
```

### Estrutura de Response

```typescript
interface CustomResponse {
  title: string;        // Título da mensagem
  message: string;      // Corpo da mensagem
  icon?: string;        // Emoji opcional
  variant?: 'success' | 'error' | 'info' | 'warning';
}
```

### Categorias de Mensagens

#### Cliente
- `welcome` - Boas-vindas
- `orderPlaced` - Pedido realizado
- `orderCanceled` - Pedido cancelado
- `cartEmpty` - Carrinho vazio
- `noAccess` - Acesso negado

#### Cozinha
- `welcome` - Boas-vindas
- `orderReceived` - Novo pedido
- `orderReady` - Pedido pronto
- `orderStarted` - Pedido em preparo
- `noOrders` - Sem pedidos

#### Delivery
- `welcome` - Boas-vindas
- `orderPicked` - Pedido coletado
- `orderDelivered` - Entrega concluída
- `noDeliveries` - Sem entregas

#### Admin
- `welcome` - Boas-vindas
- `systemUpdate` - Sistema atualizado
- `userCreated` - Usuário criado
- `dataExported` - Dados exportados

#### Universal (qualquer role)
- `error` - Erro genérico
- `success` - Sucesso
- `loading` - Carregando
- `saved` - Salvo

---

## 🎨 Integração Visual

### Página de Perfil Atualizada

`/src/app/pages/Profile.tsx` agora mostra:

1. **Mensagem de Boas-Vindas Contextual**
   - Muda baseada no horário e papel do usuário
   - Aparece no topo da página

2. **Card de Papel RBAC**
   - Ícone específico do papel
   - Cor específica do papel
   - Descrição das permissões
   - Design destacado com glassmorphism

3. **Indicadores Visuais**
   - Cada papel tem cor única
   - Ícone representativo
   - Animações smooth

### RoleSwitcher Visual

- **Botão flutuante:** Canto inferior esquerdo
- **Cor dinâmica:** Muda conforme papel ativo
- **Modal elegante:** Design galaxy/glassmorphism
- **Feedback visual:** Indicador de papel ativo
- **Descrições:** Cada papel explica suas permissões

---

## 🧪 Como Testar

### 1. Teste de RBAC

```bash
# 1. Faça login ou registre-se
# 2. Clique no botão flutuante no canto inferior esquerdo
# 3. Escolha um papel diferente (Cliente/Cozinha/Delivery/Admin)
# 4. Observe as mudanças:
#    - Mensagem de boas-vindas no perfil
#    - Card de papel no perfil
#    - Toast de confirmação
```

### 2. Teste de Persistência

```bash
# 1. Adicione produtos ao carrinho
# 2. Feche o navegador/aba
# 3. Reabra a página
# 4. Verifique: carrinho mantém os itens
# 5. Verifique: tema/universo mantém a seleção
# 6. Verifique: usuário continua logado
```

### 3. Teste de Custom Responses

```bash
# 1. Troque entre diferentes papéis
# 2. Observe mensagens diferentes ao trocar
# 3. Vá ao perfil: mensagem de boas-vindas muda
# 4. Teste em diferentes horários do dia
```

### 4. Inspeção do LocalStorage

```javascript
// Abra o DevTools (F12) → Console
// Execute os comandos abaixo:

// Ver usuário logado
console.log(localStorage.getItem('mikrokosmos_user'));

// Ver carrinho
console.log(localStorage.getItem('mikrokosmos_cart'));

// Ver todos os usuários
console.log(localStorage.getItem('mikrokosmos_users'));

// Ver universo selecionado
console.log(localStorage.getItem('mikrokosmos-universe'));
```

---

## 📊 Dados Estruturados

### LocalStorage Keys Usadas

| Chave | Tipo | Descrição | Tamanho Aprox. |
|-------|------|-----------|----------------|
| `mikrokosmos_user` | Object | Usuário logado | ~200 bytes |
| `mikrokosmos_users` | Array | Todos os usuários | ~200 bytes/user |
| `mikrokosmos_cart` | Array | Itens do carrinho | ~300 bytes/item |
| `mikrokosmos_orders` | Array | Histórico de pedidos | ~500 bytes/order |
| `mikrokosmos-universe` | String | Universo ativo | ~10 bytes |
| `mikrokosmos_notification_prefs` | Object | Preferências | ~50 bytes/user |
| `mikrokosmos_ratings` | Object | Avaliações | Variável |
| `mikrokosmos_favorites` | Object | Favoritos | Variável |

**Total estimado:** < 50KB (muito abaixo do limite de 5-10MB do localStorage)

---

## 🔒 Segurança

### Avisos Importantes

⚠️ **SENHAS EM PLAIN TEXT**
- Atualmente as senhas são salvas sem criptografia
- **Uso apenas para demonstração/desenvolvimento**
- **Em produção:** Usar hash (bcrypt) ou backend real

⚠️ **VALIDAÇÃO CLIENT-SIDE**
- Toda validação é feita no navegador
- **Em produção:** Implementar validação no servidor

⚠️ **RBAC CLIENT-SIDE**
- O RBAC atual é apenas visual/UX
- **Em produção:** Validar permissões no backend

### Recomendações para Produção

1. Migrar para backend real (Supabase/Firebase)
2. Implementar JWT para autenticação
3. Hash de senhas com bcrypt
4. Validação de permissões no servidor
5. Rate limiting em APIs
6. Sanitização de inputs

---

## 🎓 Conexão Educacional

### Cronograma do Professor - Conceitos Cobertos

✅ **JavaScript ES6+**
- Arrow functions
- Destructuring
- Template literals
- Spread operator
- Optional chaining

✅ **DOM Manipulation**
- LocalStorage API
- SessionStorage (conceito)
- Event handling

✅ **React Avançado**
- Context API (AuthContext, CartContext)
- Custom Hooks (useAuth, useRoleAccess)
- Component composition (ProtectedRoute)
- State management

✅ **TypeScript**
- Interfaces personalizadas
- Type unions (UserRole)
- Generics em funções
- Type guards

✅ **Patterns**
- RBAC (Role-Based Access Control)
- Higher-Order Components (ProtectedRoute)
- Factory Pattern (customResponses)
- Observer Pattern (localStorage sync)

---

## 🚀 Próximos Passos Sugeridos

### Melhorias Futuras

1. **RBAC Avançado**
   - [ ] Permissions granulares (não apenas roles)
   - [ ] Múltiplos papéis por usuário
   - [ ] Hierarquia de permissões

2. **Persistência Avançada**
   - [ ] Sincronização entre abas (BroadcastChannel)
   - [ ] Backup automático
   - [ ] Export/import de dados

3. **Custom Responses Avançado**
   - [ ] Histórico de notificações
   - [ ] Notificações push (Service Worker)
   - [ ] Sons customizados por role
   - [ ] Animações diferentes por tipo

4. **Segurança**
   - [ ] Migração para Supabase (backend real)
   - [ ] JWT tokens
   - [ ] Refresh tokens
   - [ ] 2FA (autenticação de dois fatores)

---

## 📝 Changelog

### v1.0.0 - 16/04/2026
- ✅ Sistema RBAC implementado (4 roles)
- ✅ Persistência com LocalStorage em todos os contexts
- ✅ Sistema de Custom Responses completo
- ✅ Componente ProtectedRoute para rotas protegidas
- ✅ RoleSwitcher para demonstração
- ✅ Página de Perfil atualizada com indicadores RBAC
- ✅ Mensagens de boas-vindas contextuais

---

## 🎉 Conclusão

O sistema **RBAC + LocalStorage + Custom Responses** está completo e funcional!

**Principais conquistas:**
- ✅ 4 níveis de acesso diferentes com controle granular
- ✅ Persistência total de dados (carrinho, usuário, pedidos, preferências)
- ✅ Sistema de mensagens personalizadas por papel e contexto
- ✅ Interface visual elegante e intuitiva
- ✅ Código modular e reutilizável
- ✅ Totalmente compatível com o cronograma educacional

**Stack utilizada:**
- React + TypeScript
- Context API
- LocalStorage API
- Motion (Framer Motion)
- Sonner (Toast notifications)
- Lucide React (Icons)

---

**Desenvolvido com 💜 por Alice para o Mikrokosmos**  
*Themed-Sync System | SaaS Multi-Tenant K-pop & Cinema*
