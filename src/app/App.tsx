// src/app/App.tsx
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { InsumoProvider } from './context/InsumoContext';
import { ProductsProvider } from './context/ProductsContext';
import '../i18n/config';

export default function App() {
  return (
    <InsumoProvider>
      <ProductsProvider>
        <RouterProvider router={router} />
      </ProductsProvider>
    </InsumoProvider>
  );
}