import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

export const useReferral = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      // Guardamos el código por 30 días (o el tiempo que prefieras)
      localStorage.setItem('affiliate_ref', ref.toLowerCase());
      console.log("Referido capturado:", ref);
    }
  }, [searchParams]);
};