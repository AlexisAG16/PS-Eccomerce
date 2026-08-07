import { Link } from "react-router";
import { AiOutlineBell } from "react-icons/ai";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const NotificationBell = ({ isStaff }) => {
  const [pendingCount, setPendingCount] = useState(0);

  // --- NUEVA FUNCIÓN PARA LIMPIAR EL CONTADOR ---
  const handleBellClick = () => {
    setPendingCount(0);
    // Opcional: Si tenés un endpoint para marcar como leídas, lo llamarías aquí:
    // api.put('/orders/mark-as-seen');
  };

  useEffect(() => {
    if (!isStaff) return;

    const checkOrders = async () => {
      // Solo pedimos si la pestaña está activa
      if (document.visibilityState === 'visible') {
        try {
          const res = await api.get('/orders/stats/pending');
          setPendingCount(res.data.count);
        } catch (e) {
          console.log("Error checking orders");
        }
      }
    };

    checkOrders();
    const interval = setInterval(checkOrders, 60000);
    window.addEventListener('focus', checkOrders);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkOrders);
    };
  }, [isStaff]);

  if (!isStaff) return null; // Si no es staff, ni siquiera renderizamos el componente

  return (
    <Link
      onClick={handleBellClick} // 👈 AGREGAMOS EL CLICK AQUÍ
      to="/admin/ordenes"
      className="relative bg-brand-surface text-brand-secondary p-3 rounded-full hover:bg-brand-primary-light transition shadow-lg group border border-brand-border flex items-center justify-center"
    >
      <AiOutlineBell size={22} />

      {pendingCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full animate-bounce shadow-md border-2 border-brand-bg">
          {pendingCount}
        </span>
      )}

      {/* Tooltip */}
      <span className="absolute top-14 right-0 scale-0 group-hover:scale-100 transition-all bg-air-azul text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
        {pendingCount > 0 ? `${pendingCount} Pedidos Pendientes` : "Sin pedidos nuevos"}
      </span>
    </Link>
  );
};

export default NotificationBell;
