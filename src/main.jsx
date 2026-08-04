import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import 'leaflet/dist/leaflet.css'

// 1. Importás las herramientas de TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. Creás la instancia con una configuración agresiva de caché
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // No re-consultar al cambiar de pestaña
      retry: 1,                    // Solo 1 reintento si falla

      // 🔥 ALIGERAR PROCESOS AL MÁXIMO GLOBALMENTE:
      staleTime: 1000 * 60 * 60,   // ⏱️ 1 HORA completa. Durante este tiempo, cualquier dato en caché NO se vuelve a pedir al backend.
      gcTime: 1000 * 60 * 90,      // Keep alive en memoria por 90 minutos.
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <CartProvider>
            <App />
          </CartProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
