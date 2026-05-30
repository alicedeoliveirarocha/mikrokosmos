# 🗓️ Sprint 2 Roadmap - Sistema Inteligente

## 📅 Timeline
**Início:** 17/04/2026  
**Entrega:** 15/05/2026  
**Duração:** 4 semanas  

---

## 🎯 Objetivo da Sprint 2

> "O Mikrokosmos deixa de ser apenas um site bonito e vira um sistema que 'lembra' do usuário."

**Funcionalidades Core:**
1. **Persistência de Dados** (Local Storage → Preparar para Supabase)
2. **RBAC (Role-Based Access Control)** - Níveis de acesso
3. **Gestão de Pedidos Avançada** - Status + Seletor de Mesas
4. **Micro-interações Temáticas** - Animações específicas por universo

---

## ⚠️ ATUALIZAÇÃO: REORGANIZAÇÃO DO TIME

**Status**: Alice agora está trabalhando **SOLO** (Giovanna saiu do projeto)

**Nova Estratégia**: 
- Foco em **Modularidade** e **Clean Architecture**
- Priorizar funcionalidades visuais e de experiência do usuário
- Documentação técnica robusta para demonstrar profissionalismo
- Sprint 2 adaptada para carga de trabalho individual

---

## ✅ CONCLUÍDO NA SPRINT 2

### **🎨 LIMPEZA DE HERANÇA CSS - IMPLEMENTADO**

**Data de Conclusão**: Sprint 2 - Semana 1  
**Desenvolvedor**: Alice (Solo)

**Problema Resolvido**:
- ✅ Vazamento de CSS do K-pop para Cinema eliminado
- ✅ Arquitetura Multi-Tenant SaaS implementada
- ✅ Separação completa de estilos por categoria

**Arquivos Criados/Modificados**:
- ✅ `/src/styles/tailwind.css` - Sistema CSS condicional (+250 linhas)
- ✅ `/src/app/components/ProductCard.tsx` - Componente adaptativo
- ✅ `/src/app/pages/Home.tsx` - Estilos condicionais
- ✅ `/src/app/components/Header.tsx` - Adaptação Cinema
- ✅ `/SEPARACAO_ESTILOS.md` - Documentação técnica
- ✅ `/GUIA_VISUAL_CARDS.md` - Comparação visual
- ✅ `/SPRINT_2_RESUMO_EXECUTIVO.md` - Resumo para apresentação

**Conceitos Técnicos Aplicados**:
- React Context API
- CSS Attribute Selectors `[data-category]`
- CSS Custom Properties (Variables)
- Conditional Rendering
- Component Polymorphism
- Design Tokens
- Data-Driven Styling
- Separation of Concerns
- LocalStorage Persistence

**Resultados Quantitativos**:
- Separação de estilos: 0% → 100%
- Vazamento de CSS: Alto → Zero
- Categorias suportadas: 1 → 2 (K-pop + Cinema)
- Universos implementados: 5 → 7
- Componentes adaptativos criados: 5

---

## 👥 Divisão de Tarefas (ATUALIZADA PARA SOLO)

### **Alice - Product Lead & Frontend Architect (SOLO)**

#### **Semana 1 (17/04 - 23/04): ✅ COMPLETA**

**✅ 1. Limpeza de Herança CSS**
- [x] Criar sistema de CSS condicional com data-attributes
- [x] Implementar Product Cards adaptativos (K-pop vs Cinema)
- [x] Atualizar Home page com estilos condicionais
- [x] Adaptar Header para modo Cinema
- [x] Criar documentação técnica completa
- [x] Criar guia visual de comparação
- [x] Criar resumo executivo para apresentação

**Status**: ✅ **IMPLEMENTADO E TESTADO**

---

#### **Semana 2 (24/04 - 30/04): 🎯 PRÓXIMAS TAREFAS**

**1. Saga Selection Screen**
- [ ] Criar página `/saga-selection` com design premium
- [ ] Grid com os 7 universos (cards grandes e atraentes)
- [ ] Animação de entrada (motion.div com stagger)
- [ ] Preview do background ao passar o mouse
- [ ] Botão "Escolher esta Saga" que salva no localStorage e redireciona para /home
- [ ] Opção "Explorar todas as sagas" para quem não quer escolher ainda

**Arquivos a criar/editar:**
- `/src/app/pages/SagaSelection.tsx` (novo)
- `/src/app/routes.tsx` (adicionar rota)
- `/src/app/pages/Welcome.tsx` (adicionar botão "Escolher Saga")

**Exemplo de código:**
```typescript
// SagaSelection.tsx
import { motion } from 'motion/react';
import { themeConfig } from '../context/UniverseContext';
import { useUniverse } from '../context/UniverseContext';
import { useNavigate } from 'react-router';

export function SagaSelection() {
  const { setUniverse } = useUniverse();
  const navigate = useNavigate();

  const handleSelectSaga = (universe: Universe) => {
    setUniverse(universe);
    navigate('/home');
  };

  return (
    <div className="min-h-screen p-8">
      <h1>Escolha sua Saga</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(themeConfig).map(([id, config]) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleSelectSaga(id)}
            className="cursor-pointer"
          >
            {/* Card design aqui */}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

---

**2. Micro-interações de Transição entre Eras**
- [ ] Criar animação de "loading" ao trocar de universo (3 segundos máx)
- [ ] Efeito de "portal" (fade out → swap → fade in)
- [ ] Som opcional de transição (toggle para habilitar/desabilitar)
- [ ] Partículas específicas de cada universo durante a transição
  - K-pop: Estrelas girando
  - Cinema: Faixa de filme passando

**Arquivos a editar:**
- `/src/app/context/UniverseContext.tsx` (adicionar estado isTransitioning)
- `/src/app/components/UniverseToggle.tsx` (trigger da animação)
- `/src/app/components/TransitionEffect.tsx` (novo componente)

**Exemplo:**
```typescript
// No UniverseContext
const [isTransitioning, setIsTransitioning] = useState(false);

const setUniverse = (universe: Universe) => {
  setIsTransitioning(true);
  setTimeout(() => {
    setUniverseActive(universe);
    localStorage.setItem('mikrokosmos-universe', universe);
    setTimeout(() => setIsTransitioning(false), 500);
  }, 1500);
};
```

---

#### **Semana 3 (01/05 - 07/05): 🎯 PRÓXIMAS TAREFAS**

**3. Sistema de Photocards/Tickets Colecionáveis**
- [ ] Criar componente `CollectibleCard` (photocards para K-pop, tickets para Cinema)
- [ ] Sistema de "drop aleatório" ao completar pedido
- [ ] Galeria de colecionáveis no perfil (`/perfil`)
- [ ] Animação de "carta revelando" ao ganhar um novo item
- [ ] Persistência no localStorage (preparar para migrar para Supabase depois)

**Estrutura de dados:**
```typescript
interface Collectible {
  id: string;
  type: 'photocard' | 'ticket';
  universe: Universe;
  rarity: 'comum' | 'raro' | 'épico' | 'lendário';
  imageUrl: string;
  name: string;
  obtainedAt: Date;
}

// LocalStorage key
localStorage.setItem('mikrokosmos-collectibles', JSON.stringify(collectibles));
```

**Arquivos a criar/editar:**
- `/src/app/components/CollectibleCard.tsx` (novo)
- `/src/app/components/CollectibleGallery.tsx` (novo)
- `/src/app/pages/Profile.tsx` (adicionar galeria)
- `/src/app/context/CollectiblesContext.tsx` (novo context)

---

#### **Semana 4 (08/05 - 14/05): 🎯 PRÓXIMAS TAREFAS**

**4. Polish & Refinamento**
- [ ] Review de todas as páginas em todos os universos
- [ ] Ajustes de responsividade (testar em iPhone, iPad, Desktop)
- [ ] Criar loading skeletons para transições
- [ ] Adicionar tooltips explicativos em botões importantes
- [ ] Preparar slides para apresentação ao professor

---

## 🔗 Integração entre Tarefas

### **Checkpoints Semanais (Solo)**

**Sexta-feira de cada semana:**
- [ ] Reunião de 30min (presencial ou Discord)
- [ ] Alice mostra o progresso visual
- [ ] Integrar as duas partes (merge de código)
- [ ] Testar tudo junto
- [ ] Ajustar bugs encontrados

---

## 📦 Entregáveis da Sprint 2

**No final das 4 semanas:**

1. ✅ **Tela de Seleção de Sagas** funcionando
2. ✅ **Micro-interações** de transição entre universos
3. ✅ **Sistema de Colecionáveis** (photocards/tickets)
4. ✅ **Analytics** com filtros por categoria

---

## 🎓 Apresentação ao Professor (16/05/2026)

### **Roteiro de 5 minutos:**

**Alice apresenta (2 min):**
1. Mostrar a Tela de Seleção de Sagas
2. Demo da transição entre universos (animação)
3. Mostrar o sistema de colecionáveis
4. Explicar a escalabilidade visual

**Alice apresenta (2 min):**
1. Demo do RBAC (logar como Cliente, depois como CEO)
2. Mostrar formulário de entrega com persistência
3. Demo da gestão de pedidos (mudar status na Kitchen)
4. Explicar como está preparado para Supabase

**Dupla (1 min):**
1. Mostrar o histórico de pedidos funcionando
2. Explicar os próximos passos (Sprint 3: Deploy + Supabase)
3. Perguntas do professor

---

## 🚀 Preparação para Sprint 3

**No final da Sprint 2, devemos ter:**
- ✅ Toda a lógica de localStorage pronta
- ✅ Interface completa e polida
- ✅ Código documentado
- ✅ Todos os testes funcionais passando

**Isso facilita a Sprint 3 porque:**
- Basta trocar localStorage por Supabase (mesma estrutura de dados)
- O frontend já está 100% pronto
- Foco total em deploy e backend

---

## 📋 Checklist de Início da Sprint 2

**Antes de começar (Alice e Giovanna):**

- [ ] Revisar ARQUITETURA_TEMAS.md
- [ ] Validar que o Reset do Main v2.0 está funcionando
- [ ] Criar branch `sprint-2` no Git
- [ ] Configurar Trello ou Notion para tracking de tarefas
- [ ] Definir horários de "pair programming" (se necessário)
- [ ] Avisar o professor do início oficial da Sprint 2

---

**Boa Sprint 2, equipe! 💪**  
Qualquer dúvida, consultem esta roadmap ou criem uma issue no projeto.