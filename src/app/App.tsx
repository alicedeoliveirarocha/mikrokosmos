// src/app/App.tsx
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { InsumoProvider } from './context/InsumoContext';
import '../i18n/config';

export default function App() {
  return (
    <InsumoProvider>
      <RouterProvider router={router} />
    </InsumoProvider>
  );
}