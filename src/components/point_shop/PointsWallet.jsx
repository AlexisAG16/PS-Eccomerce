import { useContext } from "react";
import { FaStar } from "react-icons/fa"; // Usamos una estrella como ícono de punto
import { AuthContext } from "../../contexts/AuthContext";
import { FaUser } from "react-icons/fa";

const PointsWallet = ({ pointsOverride }) => {
  const { user } = useContext(AuthContext);

  const userPoints = pointsOverride !== undefined ? pointsOverride : (user?.points || 0);

  return (
    <div className="w-full mb-10">
      <div className="bg-brand-surface p-8 rounded-4xl shadow-xl border-4 border-brand-border relative overflow-hidden group">

        {/* Decoración de fondo (Círculos sutiles) */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-bg/50 rounded-full group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-bg/40 rounded-full" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">

          {/* Info del Usuario */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-bg/70 flex items-center justify-center border-2 border-brand-border overflow-hidden shadow-inner">
                < FaUser size={60} className="text-brand-secondary" />
            </div>
            <div className="flex flex-col">
              <p className="text-brand-text-muted text-xs uppercase font-black tracking-widest opacity-80">
                Tu Billetera Patrician Software
              </p>
              <h2 className="text-brand-text text-2xl font-bold leading-tight">
                ¡Hola, {user?.firstName || 'Invitado'}!
              </h2>
              <p className="text-brand-text-muted/80 text-xs italic mt-1">
                Sumá puntos con cada compra y canjealos por premios.
              </p>
            </div>
          </div>

          {/* Saldo de Puntos */}
          <div className="bg-brand-bg/50 backdrop-blur-sm px-8 py-5 rounded-2xl flex items-center gap-4 border border-brand-border shadow-lg md:self-stretch">
            <div className="text-brand-secondary text-5xl animate-pulse">
              <FaStar />
            </div>
            <div className="flex flex-col items-end">
              <p className="text-brand-text-muted text-[10px] uppercase font-black tracking-[0.3em]">
                Puntos Disponibles
              </p>
              <span className="text-brand-text text-5xl font-black italic tracking-tighter leading-none">
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
