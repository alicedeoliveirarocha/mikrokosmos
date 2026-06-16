// src/app/App.tsx
import { RouterProvider } from 'react-router';
import { router } from './routes';
import '../i18n/config'; // inicializa o i18n — não remover!

export default function App() {
  return <RouterProvider router={router} />;
}