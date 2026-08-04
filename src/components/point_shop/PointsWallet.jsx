import { useContext } from "react";
import { FaStar } from "react-icons/fa"; // Usamos una estrella como ícono de punto
import { AuthContext } from "../../contexts/AuthContext";
import { FaUser } from "react-icons/fa";

const PointsWallet = ({ pointsOverride }) => {
  const { user } = useContext(AuthContext);

  const userPoints = pointsOverride !== undefined ? pointsOverride : (user?.points || 0);

  return (
    <div className="w-full mb-10">
      <div className="bg-linear-to-r from-[#6c6bc8] to-[#8a88d6] p-8 rounded-4xl shadow-xl border-4 border-[#E6E5F8]/30 relative overflow-hidden group">

        {/* Decoración de fondo (Círculos sutiles) */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/5 rounded-full" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">

          {/* Info del Usuario */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50 overflow-hidden shadow-inner">
                < FaUser size={60} className="text-brand-secondary" />
            </div>
            <div className="flex flex-col">
              <p className="text-[#E6E5F8] text-xs uppercase font-black tracking-widest opacity-80">
                Tu Billetera Patrician Software
              </p>
              <h2 className="text-white text-2xl font-bold leading-tight">
                ¡Hola, {user?.firstName || 'Invitado'}!
              </h2>
              <p className="text-[#E6E5F8]/80 text-xs italic mt-1">
                Sumá puntos con cada compra y canjealos por premios.
              </p>
            </div>
          </div>

          {/* Saldo de Puntos */}
          <div className="bg-white/10 backdrop-blur-sm px-8 py-5 rounded-2xl flex items-center gap-4 border border-white/20 shadow-lg md:self-stretch">
            <div className="text-brand-secondary text-5xl animate-pulse">
              <FaStar />
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[#E6E5F8] text-[10px] uppercase font-black tracking-[0.3em]">
                Puntos Disponibles
              </p>
              <span className="text-white text-5xl font-black italic tracking-tighter leading-none">
                {userPoints.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsWallet;
