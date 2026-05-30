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
import { PrivateRoute } from "./components/PrivateRoute";

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
          <PrivateRoute requireAuth={true}>
            <Cart />
          </PrivateRoute>
        ),
      },
      {
        path: "perfil",
        Component: () => (
          <PrivateRoute requireAuth={true}>
            <Profile />
          </PrivateRoute>
        ),
      },

      // COZINHA — só cozinha e admin
      {
        path: "cozinha",
        Component: () => (
          <PrivateRoute allowedRoles={['cozinha', 'admin']}>
            <Kitchen />
          </PrivateRoute>
        ),
      },

      // DELIVERY — só delivery e admin
      {
        path: "delivery",
        Component: () => (
          <PrivateRoute allowedRoles={['delivery', 'admin']}>
            <Delivery />
          </PrivateRoute>
        ),
      },

      // ANALYTICS — só admin
      {
        path: "analytics",
        Component: () => (
          <PrivateRoute allowedRoles={['admin']}>
            <Analytics />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
