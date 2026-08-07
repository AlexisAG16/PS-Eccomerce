import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api/axiosConfig";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { IoGameControllerOutline } from "react-icons/io5";
import GameModal from "../../components/GameModal";

const OrderTrackingPage = () => {
  const { user } = useContext(AuthContext);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameUrl, setGameUrl] = useState(null);

  const [order, setOrder] = useState(null);
  const [shipping, setShipping] = useState(null); // 👈 Nuevo estado para el envío
  const [loading, setLoading] = useState(true);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const handlePlayClick = async () => {
    try {
      // Mostramos loader rápido de verificación
      Swal.fire({
        title: 'Verificando disponibilidad...',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      const res = await api.get(`/games/check-turn/ruleta`);
      Swal.close(); // Cerramos el loader

      if (!res.data.canPlay) {
        return Swal.fire({
          title: '¡TURNO TERMINADO!',
          text: res.data.message,
          icon: 'info',
          confirmButtonColor: '#1a5276',
          customClass: { popup: 'rounded-[2rem]' }
        });
      }

      // Si puede jugar, abrimos el juego normalmente
      setGameUrl(`${window.location.origin}${import.meta.env.BASE_URL}minigames/ruleta`);
      setIsGameOpen(true);
    } catch (err) {
      Swal.close();
      console.error("Error al validar turno", err);
    }
  };

  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: '<span style="font-family: sans-serif; font-weight: 900; font-style: italic; text-transform: uppercase;">¿CANCELAR PEDIDO?</span>',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a5276', // Tu azul Patrician Software
      cancelButtonColor: '#d33',
      confirmButtonText: 'SÍ, CANCELAR',
      cancelButtonText: 'VOLVER',
      reverseButtons: true,
      background: '#162238',
      borderRadius: '2rem',
      customClass: {
        popup: 'rounded-[2rem] border-t-8 border-brand-secondary', // El toque naranja
        title: 'text-brand-text tracking-tighter',
        confirmButton: 'font-black uppercase italic tracking-widest text-[10px] py-3 px-6 rounded-full',
        cancelButton: 'font-black uppercase italic tracking-widest text-[10px] py-3 px-6 rounded-full'
      }
    });

    if (result.isConfirmed) {
      try {
        // Mostramos un loader mientras procesa
        Swal.fire({
          title: 'Procesando...',
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
          showConfirmButton: false,
        });

        await api.patch(`/orders/${orderId}/cancel`);

        await Swal.fire({
          icon: 'success',
          title: 'CANCELADO',
          text: 'Tu pedido ha sido cancelado correctamente.',
          confirmButtonColor: '#f29964', // Naranja para el éxito
          timer: 2000
        });

        navigate('/catalogo');
      } catch (err) {
        console.error("Error al cancelar:", err);
        Swal.fire({
          icon: 'error',
          title: 'ERROR',
          text: 'No pudimos procesar la cancelación. Por favor, contactanos.',
          confirmButtonColor: '#1a5276'
        });
      }
    }
  };

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        console.log(res);

        const orderData = res.data.data;
        setOrder(orderData);
        setShipping(orderData.shipping || {});

        // 🎯 CÁLCULO DE PUNTOS DE LA ORDEN
        setEarnedPoints(orderData.points || 0);

        if (user && user.role) {
          const roleName = typeof user.role === 'object' ? user.role.name : null;
          if (['admin', 'super_admin', 'operator'].includes(roleName)) {
            return navigate(`/admin/ordenes/detalle/${orderId}`, { replace: true });
          }
        }
      } catch (err) {
        console.error("Error al rastrear orden:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndRedirect();
  }, [orderId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-brand-bg">
        <ClipLoader color="#f29964" size={50} speedMultiplier={0.8} />
        <p className="mt-6 text-brand-text font-black uppercase italic text-[10px] tracking-[0.3em] animate-pulse">
          Sincronizando con la central...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="fixed inset-0 z-100 bg-brand-bg flex flex-col items-center justify-center p-4">
        {/* Icono o Logo opcional */}
        <div className="mb-6 opacity-20">
          <img src={`${import.meta.env.BASE_URL}ps-icon.png`} alt="Patrician Software" className="w-32" />
        </div>

        <div className="text-center">
          <h1 className="font-black uppercase italic text-brand-text tracking-tighter text-4xl md:text-6xl mb-2">
            404
          </h1>
          <p className="font-bold uppercase italic text-brand-text-muted tracking-tight text-lg mb-8">
            Orden no encontrada
          </p>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-highlight text-brand-primary font-black uppercase italic text-sm tracking-widest rounded-full hover:bg-brand-accent transition-all duration-300 shadow-lg hover:shadow-brand-highlight/20 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const isShipping = order.deliveryType === 'SHIPPING';

  return (
    <div className="min-h-screen w-full bg-brand-bg flex items-center justify-center p-4 md:p-10 border-t-8 border-brand-highlight">

      {/* --- CARD PRINCIPAL (Más ancho y con mejor aire) --- */ }
      <div className="w-full max-w-3xl bg-brand-bg rounded-[3.5rem] shadow-[0_20px_50px_rgba(26,82,118,0.1)] border border-brand-border relative overflow-hidden flex flex-col md:flex-row">

        {/* Decoración Lateral (Solo visible en desktop) */ }
        <div className="hidden md:block w-2 bg-brand-secondary" />

          <div className="flex-1 p-8 md:p-14">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-12">
              <div className="text-center md:text-left">
                <p className="text-brand-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-2">Patrician Logistics</p>
                <h1 className="text-3xl md:text-4xl font-black text-brand-text uppercase italic tracking-tighter leading-none">
                  Estado del <br /> Pedido
                </h1>
              </div>
              <div className="bg-brand-surface px-6 py-4 rounded-3xl border border-brand-border text-center">
                <p className="text-[9px] font-black text-brand-text-muted uppercase tracking-widest mb-1">ID Seguimiento</p>
                <p className="font-black text-brand-highlight text-lg">#{order._id.slice(-6).toUpperCase()}</p>
              </div>
            </div>

            {/* --- LÍNEA DE TIEMPO ESTILIZADA --- */}
            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <p className="text-[11px] font-black uppercase text-brand-highlight tracking-widest">
                  {isShipping ? "📦 Progreso del Envío" : "📍 Estado de Retiro"}
                </p>
                <span className="bg-brand-primary text-brand-text px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic shadow-lg shadow-brand-primary/20">
                {isShipping ? (shipping?.status ?? "PROCESANDO") : (order?.status ?? "PENDIENTE")}
                </span>
              </div>

              {/* Barra de Progreso con Glow */}
              <div className="w-full bg-brand-surface h-4 rounded-full p-1 border border-brand-border shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-1000 bg-linear-to-r from-brand-highlight to-brand-secondary shadow-[0_0_15px_rgba(242,153,100,0.4)]"
                  style={{
                    width: isShipping
                      ? (['DELIVERED', 'COMPLETED'].includes(shipping?.status) ? '100%' : shipping?.status === 'SHIPPED' ? '75%' : '25%')
                      : (['PAID', 'COMPLETED'].includes(order.status) ? '100%' : '50%') // 👈 Corrección aquí
                  }}
                />
              </div>
            </div>

            {/* --- MENSAJE DINÁMICO --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-brand-surface p-8 rounded-[2.5rem] border border-brand-highlight/10 flex flex-col justify-center text-center md:text-left">
              {isShipping ? (
                <>
                  <p className="text-brand-text font-black uppercase italic text-lg mb-2 leading-tight">
                    {shipping?.status
                      ? `Tu envío está ${shipping.status}`
                      : "Estamos preparando tu paquete"}
                  </p>
                  <p className="text-brand-text-muted text-[10px] font-bold uppercase leading-relaxed tracking-wider">
                    {shipping?.trackingCode
                      ? `Seguimiento: ${shipping.trackingCode}`
                      : "Pronto recibirás un mail con los datos del transporte."}
                  </p>
                </>
                ) : (
                  <>
                    <p className="text-brand-text font-black uppercase italic text-lg mb-2">¡Listo para Retiro!</p>
                    {/* <p className="text-brand-secondary text-[10px] font-black uppercase leading-relaxed tracking-wider">
                      {order.status === 'PAID'
                        ? "Presentar DNI del titular. La factura de compra se entregará junto con el producto."
                        : "Esperando confirmación de pago."}
                    </p> */}
                  </>
                )}
              </div>

            {/* Detalle de Productos Integrado */}
            <div className="bg-brand-surface p-8 rounded-[2.5rem] border border-brand-border flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-black text-brand-text-muted uppercase tracking-[0.2em] mb-4">Items comprados</p>
                <div className="space-y-3 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase text-brand-text">
                      <span className="truncate max-w-[120px]">{item.productName} <span className="text-brand-secondary">x{item.quantity}</span></span>
                      {/* 💡 IMPORTANTE: Usamos item.price o item.unitPrice según guarde tu modelo */}
                      <span className="italic opacity-60">${(item.price || item.unitPrice || 0).toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🔥 NUEVO RESUMEN DE PRECIOS CON CUPÓN */}
              <div className="mt-4 pt-4 border-t border-brand-border space-y-1.5 text-[9px] font-black uppercase tracking-tight text-brand-text-muted">
                {/* Si hubo un cupón/descuento aplicados en la orden original */}
                {order.discount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-brand-text">${Number(order.subtotal || 0).toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>Descuento Cupón:</span>
                      <span>-${Number(order.discount).toLocaleString('es-AR')}</span>
                    </div>
                  </>
                )}

                {/* Total real que se guardó en la orden de MongoDB */}
                <div className="flex justify-between text-xs font-black text-brand-text border-t border-dashed border-brand-border pt-2 mt-1">
                  <span className="text-brand-secondary italic">Total Pagado:</span>
                  <span className="text-base font-black italic text-brand-highlight">${Number(order.total || 0).toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>
            </div>

            {/* ========================================================================= */}
            {/* 🎯 NUEVA SECCIÓN DE FIDELIZACIÓN Y MINIJUEGOS (PUNTOS Y ACCESO)           */}
            {/* ========================================================================= */}
            <div className="mt-4 mb-10 flex flex-col sm:flex-row gap-4 items-stretch justify-center max-w-2xl mx-auto">

              {/* Card de Puntos Acumulados */}
              {earnedPoints > 0 && (
                <div className="flex-1 p-6 bg-linear-to-br from-brand-surface to-brand-bg rounded-[2.5rem] border border-brand-border flex flex-col justify-center items-center text-center shadow-xs">
                  <div className="bg-linear-to-r from-yellow-400 to-orange-500 text-white px-5 py-1.5 rounded-full shadow-md mb-2 animate-pulse">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {user ? `¡Llevás ${earnedPoints} Puntos!` : `¡Sumás ${earnedPoints} Puntos!`}
                    </span>
                  </div>
                  {/* 🎯 TEXTO SINCERADO: Avisa que se entregan al recibir el producto */}
                  <p className="text-[9px] text-brand-text-muted font-bold uppercase leading-relaxed tracking-tighter max-w-[200px]">
                    {user
                      ? "Se acreditarán en tu cuenta de forma automática en cuanto retires o se entregue tu pedido."
                      : "Esto recibirías si te hicieras una cuenta para no perder tus beneficios."}
                  </p>
                </div>
              )}

              {/* Card de Acceso al Minijuego */}
              <div className="flex-1 p-6 bg-brand-primary/5 rounded-[2.5rem] border-2 border-dashed border-brand-highlight/20 flex flex-col justify-between items-center text-center">
                {!user ? (
                  // 🔒 CASO 1: VISITANTE / INVITADO (No está logueado)
                  <>
                    <div>
                      <p className="text-brand-secondary text-[11px] font-black uppercase mb-1 tracking-wider flex items-center justify-center gap-1">
                        ¡Multiplicá tus puntos! 🎯
                      </p>
                      <p className="text-brand-text-muted text-[9px] font-medium uppercase tracking-tight mb-3 max-w-[220px] leading-tight">
                        Los minijuegos están reservados para la comunidad. Creá tu cuenta para guardar estos <span className="font-bold text-brand-highlight">{earnedPoints} puntos</span> y canjearlos por premios espectaculares.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/register')}
                      className="w-full py-3 bg-brand-secondary text-brand-text hover:bg-brand-accent rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      Unirme / Iniciar Sesión
                    </button>
                  </>
                ) : !['PAID', 'COMPLETED'].includes(order.status) ? ( // 👈 CAMBIO CRÍTICO AQUÍ
                  // 💳 CASO 2: LOGUEADO PERO NO PAGÓ (Freno de mano por negocio)
                  <>
                    <div>
                      <p className="text-amber-600 text-[11px] font-black uppercase mb-1 tracking-wider flex items-center justify-center gap-1">
                        Aboná tu pedido para jugar ⏱️
                      </p>
                      <p className="text-brand-text-muted text-[9px] font-medium uppercase tracking-tight mb-3 max-w-[220px] leading-tight">
                        ¡La ruleta se desbloqueará de inmediato en cuanto registremos el pago de tu orden #{order._id.slice(-6).toUpperCase()}!
                      </p>
                    </div>
                    <button
                      disabled
                      className="w-full py-3 bg-brand-surface border-2 border-brand-border text-brand-text-muted rounded-2xl font-black uppercase italic text-[10px] tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Esperando Acreditación...
                    </button>
                  </>
                ) : (
                  // 👑 CASO 3: LOGUEADO Y PAGADO/COMPLETADO (Acceso total concedido)
                  <>
                    <div>
                      <p className="text-brand-highlight text-[11px] font-black uppercase mb-1 tracking-wider flex items-center justify-center gap-1">
                        ¿Querés más puntos? 🕹️
                      </p>
                      <p className="text-brand-text-muted text-[9px] font-medium uppercase tracking-tight mb-3 max-w-[220px] leading-tight">
                        ¡Pago verificado! Jugá ahora mismo a la ruleta y ganá beneficios exclusivos.
                      </p>
                    </div>
                    <button
                      onClick={handlePlayClick}
                      className="w-full py-3 bg-brand-bg border-2 border-brand-highlight text-brand-text hover:bg-brand-accent hover:text-brand-text rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <IoGameControllerOutline size={14} />
                      Jugar Ruleta
                    </button>
                  </>
                )}
              </div>

            </div>

            {/* Botón de Acción */}
            <button
              onClick={() => navigate('/catalogo')}
              className="group w-full py-5 bg-brand-primary text-brand-text rounded-4xl font-black uppercase italic text-xs tracking-[0.3em] hover:bg-brand-accent transition-all duration-300 shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-4 cursor-pointer"
            >
              <span>Seguir comprando</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>

            {/* BOTÓN DE CANCELAR: Solo si el estado permite cancelación */}
            {["CREATED", "PENDING_PAYMENT"].includes(order.status) && (
              <button
                onClick={handleCancelOrder}
                className="w-full mt-4 py-3 border-2 border-brand-border text-brand-text-muted hover:text-red-500 hover:border-red-500 rounded-4xl font-black uppercase italic text-[9px] tracking-[0.2em] transition-all duration-300 cursor-pointer"
              >
                Cancelar Compra
              </button>
            )}
          </div>
      </div>

      {user && (
        <GameModal
          isOpen={isGameOpen}
          onClose={() => {
            setIsGameOpen(false);
            setGameUrl(null);
          }}
          gameUrl={gameUrl}
        />
      )}
    </div>
  );
};

export default OrderTrackingPage;
