import { FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-brand-surface rounded-[4rem] border-4 border-dashed border-gray-100 shadow-inner my-10 mx-4">
      {/* Icono */}
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
        <FiLock className="text-4xl text-red-400" />
      </div>

      {/* Título y Mensaje */}
      <h1 className="text-4xl font-black uppercase italic text-[#1a5276] tracking-tighter">
        403 - Acceso Denegado
      </h1>

      <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mt-4 max-w-sm text-center leading-relaxed">
        Lo sentimos, no tienes los permisos necesarios para visualizar esta sección.
        Si crees que esto es un error, contacta al administrador del sistema.
      </p>

      {/* Botones */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase italic text-[10px] tracking-widest shadow-lg hover:scale-105 transition-transform cursor-pointer"
        >
          Volver al Inicio
        </button>

        <button
          onClick={() => window.history.back()}
          className="px-8 py-4 text-brand-text border-2 border-gray-200 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:border-gray-300 transition-colors cursor-pointer bg-brand-secondary"
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
};

export default ForbiddenPage;