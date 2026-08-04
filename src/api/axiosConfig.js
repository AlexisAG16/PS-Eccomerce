import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  // Asegúrate de que en tu .env VITE_BASE_URL termine en /api/v1 o lo que corresponda
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // <--- ESTO ES VITAL AQUÍ
  headers: {
    // 'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Opcional: Esto ayuda si usas otras librerías que dependan del axios global,
// pero lo más importante es que tu instancia 'api' lo tenga.
axios.defaults.withCredentials = true;

// INTERCEPTOR PARA RELAJAR ERRORES
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 1. Manejo de errores de servidor/not found (Modificado para no engañar al Front)
    if (status === 500 || status === 404) {
      console.warn("⚠️ Error controlado:", error.config.url);

      // 🚨 Cambiamos Promise.resolve por Promise.reject
      // Le pasamos el 'error' original para que el catch de BaseForm pueda leer response.data.error
      return Promise.reject(error);
    }

    // 2. Manejo de SESIÓN EXPIRADA (401)
    if (status === 401) {
      const isLoginRequest = error.config.url.includes('/auth/login');
      const isCheckAuthRequest = error.config.url.includes('/auth/me');

      if (!isLoginRequest && !isCheckAuthRequest) {
        toast.error("Sesión expirada. Redirigiendo...", { toastId: "expired" });

        setTimeout(() => {
          window.location.href = `${import.meta.env.BASE_URL}login`;
        }, 1500);
      }
    }

    return Promise.reject(error);
  }
);;

export default api;
