import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

export const useAffiliateTracker = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');

    if (ref) {
      // Guardamos en minúsculas para evitar errores de comparación después
      localStorage.setItem('PS_affiliate_ref', ref.toLowerCase());

      // Opcional: Limpiamos la URL para que quede "limpia" (estético)
      // window.history.replaceState({}, document.title, window.location.pathname);

      console.log("Socio de negocio detectado:", ref);
    }
  }, [searchParams]);
};
