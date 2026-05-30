// src/app/routes.tsx
// Rotas com RBAC real — cliente NÃO consegue acessar /cozinha, /delivery ou /analytics

import { createBrowserRouter } from "react-router";
import { Welcome } from "./pages/Welcome";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Info } from "./pages/Info";
import { Learning } from "./pages/Learning";
import { Auth } from "./pages/Auth";
import { Profile } from "./pages/Profile";
import { Kitchen } from "./pages/Kitchen";
import { Delivery } from "./pages/Delivery";
import { Analytics } from "./pages/Analytics";
import { Cinema } from "./pages/Cinema";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      // Rotas públicas
      { index: true, Component: Welcome },
      { path: "home", Component: Home },
      { path: "produto/:id", Component: ProductDetail },
      { path: "info", Component: Info },
      { path: "learning", Component: Learning },
      { path: "auth", Component: Auth },
      { path: "cinema", Component: Cinema },

      // Requer login (qualquer role)
      {
        path: "carrinho",
        Component: () => (
          <ProtectedRoute requireAuth={true}>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfil",
        Component: () => (
          <ProtectedRoute requireAuth={true}>
            <Profile />
          </ProtectedRoute>
        ),
      },

      // COZINHA — só cozinha e admin
      {
        path: "cozinha",
        Component: () => (
          <ProtectedRoute allowedRoles={['cozinha', 'admin']}>
            <Kitchen />
          </ProtectedRoute>
        ),
      },

      // DELIVERY — só delivery e admin
      {
        path: "delivery",
        Component: () => (
          <ProtectedRoute allowedRoles={['delivery', 'admin']}>
            <Delivery />
          </ProtectedRoute>
        ),
      },

      // ANALYTICS — só admin
      {
        path: "analytics",
        Component: () => (
          <ProtectedRoute allowedRoles={['admin']}>
            <Analytics />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
