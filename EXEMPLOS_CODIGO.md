# 💻 Exemplos de Código - Expansões Futuras

## 🎨 Como adicionar uma nova Era

### 1. Atualizar o UniverseContext

```typescript
// /src/app/context/UniverseContext.tsx

// Adicione o novo tipo
type Universe = 'aespa' | 'enhypen' | 'bts' | 'blackpink' | 'redvelvet' | 'novaera';

// Adicione a configuração
const themeConfig = {
  // ... outras eras
  novaera: {
    name: 'NOVA ERA',
    primaryColor: '#FF00FF', // Sua cor primária
    gradientFrom: '#FF00FF',
    gradientTo: '#00FFFF',
  },
};
```

### 2. Atualizar o UniverseToggle

```typescript
// /src/app/components/UniverseToggle.tsx

const universes = [
  // ... outras eras
  { id: 'novaera', name: 'NOVA ERA', desc: 'Descrição' },
] as const;
```

### 3. Adicionar CSS customizado (opcional)

```css
/* /src/styles/tailwind.css */

/* NOVA ERA Styles */
.era-novaera .galaxy-background::after {
  background: radial-gradient(
    circle,
    #FF00FF 0%,
    #00FFFF 50%,
    transparent 70%
  );
}
```

---

## 🎬 Como adicionar uma nova página temática

### Estrutura básica

```typescript
// /src/app/pages/NovoModo.tsx

import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useUniverse } from '../context/UniverseContext';
import { useCart } from '../context/CartContext';

export function NovoModo() {
  const navigate = useNavigate();
  const { universeName, primaryColor } = useUniverse();
  const { items } = useCart();

  return (
    <div className="custom-background min-h-screen pb-20">
      {/* Seu conteúdo aqui */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6"
      >
        <h1 className="text-4xl font-bold text-white">
          Novo Modo
        </h1>
        <p style={{ color: primaryColor }}>
          Era Atual: {universeName}
        </p>
      </motion.div>
    </div>
  );
}
```

### Adicionar rota

```typescript
// /src/app/routes.tsx

import { NovoModo } from "./pages/NovoModo";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      // ... outras rotas
      { path: "novomodo", Component: NovoModo },
    ],
  },
]);
```

### Atualizar Layout (se necessário)

```typescript
// /src/app/components/Layout.tsx

export function Layout() {
  const location = useLocation();
  const isCinema = location.pathname === '/cinema';
  const isNovoModo = location.pathname === '/novomodo';

  return (
    <div className={
      isCinema ? 'cinema-mode' : 
      isNovoModo ? 'novo-modo-background' : 
      'galaxy-background'
    }>
      {/* ... */}
    </div>
  );
}
```

---

## 🔐 Como adicionar RBAC (Role-Based Access Control)

### 1. Criar tipos de usuário

```typescript
// /src/app/context/AuthContext.tsx

type UserRole = 'cliente' | 'cozinha' | 'delivery' | 'ceo';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl?: string;
}
```

### 2. Filtrar navegação por role

```typescript
// /src/app/components/Header.tsx

const { user } = useAuth();

// Exemplo: Apenas CEO vê Analytics
{user?.role === 'ceo' && (
  <button onClick={() => navigate('/analytics')}>
    <BarChart3 className="w-5 h-5" />
    Analytics
  </button>
)}

// Exemplo: Cozinha e CEO vêem painel de cozinha
{['cozinha', 'ceo'].includes(user?.role || '') && (
  <button onClick={() => navigate('/cozinha')}>
    <ChefHat className="w-5 h-5" />
    Cozinha
  </button>
)}
```

### 3. Proteger rotas

```typescript
// /src/app/components/ProtectedRoute.tsx

import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (!allowedRoles.includes(user?.role || 'cliente')) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
}
```

Uso nas rotas:

```typescript
// /src/app/routes.tsx

{ 
  path: "analytics", 
  Component: () => (
    <ProtectedRoute allowedRoles={['ceo']}>
      <Analytics />
    </ProtectedRoute>
  )
},
```

---

## 🎨 Como criar novos estilos CSS customizados

### Glassmorphism customizado

```css
/* /src/styles/tailwind.css */

.glass-custom {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
}
```

### Animação personalizada

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
```

### Efeito neon customizado

```css
.neon-custom {
  text-shadow: 
    0 0 5px var(--primary-neon),
    0 0 10px var(--primary-neon),
    0 0 20px var(--primary-neon),
    0 0 40px var(--primary-neon);
  animation: pulse-neon 2s ease-in-out infinite;
}

@keyframes pulse-neon {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

---

## 📊 Como adicionar novos gráficos

### Usando Recharts

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { era: 'AESPA', vendas: 400 },
  { era: 'ENHYPEN', vendas: 300 },
  { era: 'BTS', vendas: 600 },
  { era: 'BLACKPINK', vendas: 500 },
  { era: 'RED VELVET', vendas: 450 },
];

export function GraficoVendasPorEra() {
  const { primaryColor } = useUniverse();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="era" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip 
          contentStyle={{ 
            background: 'rgba(0,0,0,0.8)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px'
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="vendas" 
          stroke={primaryColor}
          strokeWidth={2}
          dot={{ fill: primaryColor, r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 🎭 Como usar imagens dinâmicas das Eras

### Mapear imagens por Era

```typescript
const eraImages = {
  aespa: 'figma:asset/url-aespa.png',
  enhypen: 'figma:asset/url-enhypen.png',
  bts: 'figma:asset/url-bts.png',
  blackpink: 'figma:asset/url-blackpink.png',
  redvelvet: 'figma:asset/url-redvelvet.png',
};

export function HeroBanner() {
  const { universeActive } = useUniverse();
  
  return (
    <img 
      src={eraImages[universeActive]} 
      alt={`${universeActive} banner`}
      className="w-full h-64 object-cover rounded-2xl"
    />
  );
}
```

---

## 🔄 Como sincronizar com Firebase/Supabase

### Salvar Era preferida

```typescript
// Exemplo com localStorage (pode ser adaptado para Firebase)

export function UniverseProvider({ children }: { children: ReactNode }) {
  const [universeActive, setUniverseActive] = useState<Universe>(() => {
    const saved = localStorage.getItem('preferred-era');
    return (saved as Universe) || 'aespa';
  });

  const setUniverse = (universe: Universe) => {
    setUniverseActive(universe);
    localStorage.setItem('preferred-era', universe);
    
    // Se usar Firebase:
    // await updateDoc(doc(db, 'users', userId), { preferredEra: universe });
  };

  // ...
}
```

### Carregar dados do usuário

```typescript
// /src/app/context/AuthContext.tsx

useEffect(() => {
  if (user?.id) {
    // Firebase example
    const loadUserPreferences = async () => {
      const docRef = doc(db, 'users', user.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUniverse(data.preferredEra || 'aespa');
      }
    };
    
    loadUserPreferences();
  }
}, [user?.id]);
```

---

## 🎯 Padrões de Motion para animações

### Entrada de página

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {/* Conteúdo */}
</motion.div>
```

### Hover e Tap

```typescript
<motion.button
  whileHover={{ scale: 1.05, rotate: 2 }}
  whileTap={{ scale: 0.95 }}
  className="btn"
>
  Clique aqui
</motion.button>
```

### Stagger (sequência)

```typescript
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

---

## 🎨 Componente reutilizável: Card Temático

```typescript
// /src/app/components/ThemedCard.tsx

interface Props {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function ThemedCard({ title, description, icon, onClick, children }: Props) {
  const { primaryColor } = useUniverse();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="glass rounded-2xl p-6 cursor-pointer"
      style={{ borderColor: `${primaryColor}40` }}
    >
      {icon && (
        <div className="mb-4" style={{ color: primaryColor }}>
          {icon}
        </div>
      )}
      <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
      <p className="text-white/60 text-sm mb-4">{description}</p>
      {children}
    </motion.div>
  );
}
```

Uso:

```typescript
<ThemedCard
  title="Novo Recurso"
  description="Descrição do recurso"
  icon={<Star className="w-8 h-8" />}
  onClick={() => navigate('/recurso')}
>
  <button className="btn-primary">Acessar</button>
</ThemedCard>
```

---

## 📱 Responsive Design com Tailwind

```tsx
<div className="
  grid 
  grid-cols-1           // Mobile: 1 coluna
  md:grid-cols-2        // Tablet: 2 colunas
  lg:grid-cols-3        // Desktop: 3 colunas
  xl:grid-cols-4        // Desktop grande: 4 colunas
  gap-4                 // Espaçamento
">
  {items.map(item => (
    <div key={item.id} className="
      p-4 
      md:p-6               // Padding maior em tablet+
      text-sm 
      md:text-base         // Texto maior em tablet+
    ">
      {item.content}
    </div>
  ))}
</div>
```

---

## 🎓 Estrutura de pastas recomendada

```
src/app/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn)
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── ThemedCard.tsx
│   └── ...
│
├── context/            # Context API
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── UniverseContext.tsx
│   └── ...
│
├── pages/              # Páginas/Rotas
│   ├── Welcome.tsx
│   ├── Home.tsx
│   ├── Cinema.tsx
│   └── ...
│
├── data/               # Dados mockados
│   ├── products.ts
│   └── ...
│
├── utils/              # Funções utilitárias
│   └── ...
│
└── routes.tsx          # Configuração de rotas
```

---

**Dúvidas?** Consulte a documentação oficial:
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Motion: https://motion.dev
- React Router: https://reactrouter.com

🚀 **Bons estudos e desenvolvimento!**
