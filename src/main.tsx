import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { AuthProvider } from "./app/context/AuthContext";
import { UniverseProvider } from "./app/context/UniverseContext";
import { CartProvider } from "./app/context/CartContext";
import { OrdersProvider } from "./app/context/OrdersContext";
import { AccessTrackingProvider } from "./app/context/AccessTrackingContext";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <UniverseProvider>
      <AccessTrackingProvider>
        <CartProvider>
          <OrdersProvider>
            <App />
            <Toaster
              position="top-center"
              richColors
              theme="dark"
              toastOptions={{
                style: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }
              }}
            />
          </OrdersProvider>
        </CartProvider>
      </AccessTrackingProvider>
    </UniverseProvider>
  </AuthProvider>
);