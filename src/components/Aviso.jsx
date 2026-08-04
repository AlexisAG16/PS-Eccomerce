import { useEffect } from 'react';
import { useSearchParams } from 'react-router'; // O el hook de ruteo que uses
import Swal from 'sweetalert2';

const Aviso = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'cuenta_verificada') {
      Swal.fire({
        icon: 'success',
        title: '¡CUENTA VERIFICADA!',
        text: 'Tu correo ha sido confirmado. Ya puedes iniciar sesión.',
        confirmButtonColor: '#1a5276',
        timer: 4000,
        toast: true,
        position: 'top-end'
      });
    }

    if (error === 'enlace_invalido') {
      Swal.fire({
        icon: 'error',
        title: 'ENLACE INVÁLIDO',
        text: 'El enlace ha expirado o ya fue utilizado. Registrate nuevamente.',
        confirmButtonColor: '#d33',
        toast: true,
        position: 'top-end'
      });
    }
  }, [searchParams]);

  return null; // Este componente solo ejecuta lógica
};

export default Aviso;