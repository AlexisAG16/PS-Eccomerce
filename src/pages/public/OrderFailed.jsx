import { useLocation, Navigate, useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const OrderError = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("DEBUG [OrderError]: Datos recibidos en location.state", location.state);

  // Si no viene del checkout, al lobby
  if (!location.state?.fromCheckout) {
    console.warn("DEBUG [OrderError]: Bloqueo activado por falta de fromCheckout");
    return <Navigate to="/" replace />;
  }

  const { orderId = "N/A", errorMessage = "La transacción fue rechazada por la entidad emisora." } = location.state || {};

  return (
    <div className="max-w-2xl mx-auto my-20 p-10 bg-white rounded-[3rem] shadow-2xl text-center border border-red-50 relative overflow-hidden">
      {/* Decoración de fondo en rojo suave */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-50 rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-50 rounded-full opacity-50" />

      <div className="relative z-10">
        {/* Icono de error con animación de pulso */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-red-200 text-red-600 font-black"
        >
          ✕
        </motion.div>

        <h1 className="text-3xl font-black text-brand-primary uppercase italic tracking-tighter mb-2">
          Pago Interrumpido
        </h1>

        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-10 px-10 leading-relaxed">
          Algo no salió como esperábamos con Mercado Pago. No te preocupes, no se ha realizado ningún cargo.
        </p>

        {/* Info de la Orden Fallida */}
        <div className="bg-[#fff5f5] rounded-[2.5rem] border border-red-100 inline-block mb-10 p-8 w-full max-w-sm">
          <span className="text-[10px] font-black uppercase text-red-400 block mb-2 tracking-[0.2em]">
            Motivo del Error
          </span>
          <p className="text-xs font-bold text-gray-700 uppercase italic mb-6 leading-tight">
            "{errorMessage}"
          </p>

          <div className="pt-4 border-t border-red-100">
            <span className="text-[9px] font-black uppercase text-gray-400 block mb-1 tracking-[0.2em]">
              Referencia de Orden
            </span>
            <code className="text-[11px] font-black text-brand-primary tracking-widest opacity-60">
              {orderId.toUpperCase()}
            </code>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center pt-2 max-w-xs mx-auto">
          {/* Botón principal: Reintentar (vuelve al checkout) */}
          <button
            onClick={() => {
              console.log("DEBUG [OrderError]: Intentando reintento con ID:", orderId);
              navigate(`/orden/recibo/${orderId}`, {
                state: { fromCheckout: true },
                replace: true
              });
            }}
            className="w-full px-10 py-4 bg-brand-secondary text-white rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-[#e68a55] transition-all shadow-lg shadow-brand-secondary/30"
          >
            Reintentar Pago
          </button>

          {/* Botón secundario: Volver al inicio */}
          <button
            onClick={() => navigate('/')}
            className="w-full px-10 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
          >
            Volver al Inicio
          </button>
        </div>

        <p className="mt-8 text-[9px] text-gray-300 font-black uppercase tracking-widest leading-relaxed">
          Si el problema persiste, contactanos por WhatsApp <br /> indicando el ID de referencia.
        </p>
      </div>
    </div>
  );
};

export default OrderError;