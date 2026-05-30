import { Outlet } from 'react-router';
import { UniverseProvider } from '../context/UniverseContext';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { OrdersProvider } from '../context/OrdersContext';
import { AccessTrackingProvider } from '../context/AccessTrackingContext';
import { Toaster } from 'sonner';
import { useUniverse } from '../context/UniverseContext';
import { RoleSwitcher } from './RoleSwitcher';

function LayoutContent() {
  const { categoria } = useUniverse();

  return (
    <div className="universe-background min-h-screen" data-category={categoria}>
      <div className="relative z-10">
        <Outlet />
      </div>
      <RoleSwitcher />
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
    </div>
  );
}

export function Layout() {
  return (
    <AuthProvider>
      <UniverseProvider>
        <AccessTrackingProvider>
          <CartProvider>
            <OrdersProvider>
              <LayoutContent />
            </OrdersProvider>
          </CartProvider>
        </AccessTrackingProvider>
      </UniverseProvider>
    </AuthProvider>
  );
}