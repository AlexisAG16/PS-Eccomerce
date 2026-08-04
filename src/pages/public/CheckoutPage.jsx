import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import CouponInput from '../../components/forms/fields/CouponInput';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { FiMessageSquare, FiCopy, FiMail, FiCheckCircle } from 'react-icons/fi';

const CheckoutPage = () => {
  // 1. Extrae 'orderId' tal cual viene de la URL (del Route)
  const { user, loading: authLoading } = useContext(AuthContext);
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [copied, setCopied] = useState(false);

  // DATOS Patrician Software E-commerce
  const PS_WHATSAPP = "5491132328989";
  const PS_EMAIL = "ventas@patriciansoftware.com.ar";
  const PS_ALIAS = "PATRICIAN.SOFTWARE";
  const PS_CBU = "0110543220034321987654";

  const onSubmitOrder = async (formData) => {
    // 1. Extraemos el referido si existe
    const affiliateRef = localStorage.getItem('PS_affiliate_ref');

    const orderPayload = {
      ...formData,
      items: order.items, // Usamos lo que ya tiene la orden cargada
      subtotal: order.subtotal,
      discount: appliedCoupon ? appliedCoupon.discountAmount : 0,
      total: order.total, // El total ya restado

      // Aquí viajan al controlador
      couponId: appliedCoupon ? appliedCoupon._id : null,
      couponCode: appliedCoupon ? appliedCoupon.code : null,

      affiliateCode: affiliateRef || null
    };

    try {
      const res = await api.post('/orders', orderPayload);
      // Si la compra es exitosa, podemos limpiar el referido
      localStorage.removeItem('PS_affiliate_ref');
      // ... redirección a éxito
    } catch (err) {
      toast.error("Error al procesar pedido");
    }
  };

  const handleCouponApply = (coupon) => {
    setAppliedCoupon(coupon);
    // Aquí recalculas el total usando: total - coupon.discountAmount
  };

  /* MERCADO PAGO DESCARTADO */
  // 1. EFECTO DE RETORNO (Captura si el usuario viene de pagar en MP)
  useEffect(() => {
    const status = searchParams.get('status');
    const detail = searchParams.get('payment_status_detail');
    const paymentId = searchParams.get('payment_id'); // Útil para logs o debugging

    if (!status || status === 'null') return;

    // 1. Si es aprobado, navegamos al éxito
    if (status === 'approved') {
      navigate('/pago-exitoso', {
        state: {
          fromCheckout: true,
          orderId,
          paymentId, // 💡 Lo pasamos por si quieres guardarlo en la orden
          deliveryType: order?.deliveryType
        },
        replace: true
      });
      return;
    }

    // 2. Si es error, procesamos el mensaje
    if (['rejected', 'failure', 'pending'].includes(status)) {
      const errorMessages = {
        cc_rejected_insufficient_amount: "Tu tarjeta no tiene fondos suficientes.",
        cc_rejected_bad_filled_security_code: "El código de seguridad es incorrecto.",
        cc_rejected_call_for_authorize: "Debes autorizar el pago con tu banco.",
        cc_rejected_invalid_installments: "Tu tarjeta no acepta esa cantidad de cuotas.",
        default: "El pago fue rechazado o cancelado por la entidad emisora."
      };

      const msg = errorMessages[detail] || errorMessages.default;

      navigate('/pago-fallido', {
        state: { fromCheckout: true, orderId, errorMessage: msg },
        replace: true
      });
    }
  }, [searchParams, orderId, navigate, order]);

  // 2. EFECTO DE CARGA (El que ya tenías, intacto)
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || authLoading) return; // Esperar a que el auth termine

      try {
        setLoading(true);
        setError(null);

        const guestId = localStorage.getItem('guestOrderId');
        const config = {};

        // Si NO hay usuario logueado, intentamos usar el header de invitado
        if (!user && guestId) {
          config.headers = { 'x-guest-order-id': guestId };
        }

        // Si hay usuario pero la orden pertenece a un invitado, 
        // el backend debería permitir verlo si el email coincide, 
        // pero lo más seguro es que usemos el header solo si es necesario.
        const res = await api.get(`/orders/checkout/${orderId}`, config);

        setOrder(res.data.data);
      } catch (err) {
        console.error("Error cargando orden:", err);
        // Personalizar el error según la respuesta del server
        const msg = err.response?.data?.message || "No tienes permiso para ver esta orden.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, authLoading]);

  // COPIAR LINK DE SEGUIMIENTO AL PORTAPAPELES
  const handleCopyTrackingLink = () => {
    const trackingUrl = `${window.location.origin}/track/${orderId}`;
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    toast.success("¡Link de seguimiento copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  // REDIRECCIÓN A WHATSAPP CON MENSAJE PRESET
  const handleWhatsAppRedirect = () => {
    const shortId = order._id.slice(-6).toUpperCase();
    const message = `Hola Patrician Software E-commerce! 👋 Acabo de generar la orden #${shortId} por un total de $${order.total.toLocaleString('es-AR')}. Quiero coordinar el pago de la misma.`;
    window.open(`https://wa.me/${PS_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // 3. FUNCIÓN DE PAGO (Modificada para Redirección Externa)
  const handlePayment = async () => {
    if (!orderId) {
      toast.error("Error: No se pudo identificar la orden.");
      return;
    }

    if (isRedirecting) return;

    // 1. Declaramos idCarga aquí
    const idCarga = toast.loading("Redirigiendo a Mercado Pago...");

    try {
      setIsRedirecting(true);
      const guestId = localStorage.getItem('guestOrderId');
      const config = {};

      if (!user && guestId) {
        config.headers = { 'x-guest-order-id': guestId };
      }

      const payload = appliedCoupon ? { couponId: appliedCoupon._id } : {};

      const res = await api.post(`/payments/checkout/${orderId}`, payload, config);

      if (res.data.success && res.data.paymentLink) {
        // 2. Cerramos el toast de carga antes de redirigir
        toast.dismiss(idCarga);
        window.location.href = res.data.paymentLink;
      } else {
        throw new Error("No se pudo obtener el link de pago");
      }
    } catch (err) {
      setIsRedirecting(false);
      // 3. Cerramos el toast de carga también en el error
      toast.dismiss(idCarga);

      console.log("ERROR COMPLETO:", err);
      navigate('/pago-fallido', {
        state: { fromCheckout: true, orderId },
        replace: true
      });
    }
  };

  // --- ESTADO: CARGANDO (Spinner Patrician Software) ---
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand-primary/10 border-t-brand-secondary rounded-full mb-4"
        />
        <p className="text-brand-primary font-black italic uppercase tracking-widest text-sm animate-pulse">
          Cargando confirmación...
        </p>
      </div>
    );
  }

  // --- ESTADO: ERROR (Cruz Roja) ---
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto my-20 p-10 bg-white rounded-[3rem] shadow-xl border border-red-50 text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-gray-800 uppercase italic mb-2">¡Ups! Algo salió mal</h2>
        <p className="text-gray-500 text-xs font-bold leading-relaxed mb-8 uppercase tracking-tight">
          {error}
        </p>
        <button
          onClick={() => navigate('/catalogo')}
          className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-gray-200 transition-all"
        >
          Volver al Catálogo
        </button>
      </motion.div>
    );
  }

  // --- ESTADO: ÉXITO (Resumen y Pago) ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 bg-white rounded-[3rem] shadow-2xl my-10 border border-gray-50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full -mr-10 -mt-10" />

      <header className="text-center mb-10">
        <div className="inline-block bg-brand-secondary text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-3">
          Pedido Registrado Vía WhatsApp
        </div>
        <h1 className="text-3xl font-black text-brand-primary uppercase italic tracking-tighter">
          Orden #{order._id.slice(-6).toUpperCase()}
        </h1>
      </header>

      {/* DETALLE DE PRODUCTOS */}
      <div className="bg-[#f8fafc] rounded-4xl p-8 mb-6 border border-gray-100">
        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-[0.2em] italic border-b border-gray-200 pb-2">
          Resumen de Compra
        </h3>
        <ul className="space-y-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="font-black text-brand-primary uppercase text-xs tracking-tight">{item.productName}</span>
                <span className="text-[10px] text-gray-400 font-bold tracking-widest">CANTIDAD: {item.quantity}</span>
              </div>
              <span className="font-black text-gray-700 italic">${item.subtotal.toLocaleString('es-AR')}</span>
            </li>
          ))}
        </ul>

        {/* CUPONES */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          {user ? (
            <CouponInput
              cart={order.items}
              total={order.subtotal}
              onApply={(resData) => {
                const { couponId, discountAmount } = resData;
                if (!couponId || discountAmount <= 0) {
                  toast.error("El cupón no aplicó ningún descuento.");
                  return;
                }
                setOrder(prev => ({
                  ...prev,
                  total: Math.max(0, prev.subtotal - discountAmount),
                  couponId: couponId,
                  couponCode: order.couponCode
                }));
                setAppliedCoupon({ _id: couponId, discountAmount: discountAmount });
                toast.success("¡Cupón aplicado!");
              }}
            />
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-tight">¿Tienes un cupón de descuento?</p>
              <p className="text-[10px] text-amber-600 uppercase mt-1">
                Debes <span className="font-black underline cursor-pointer" onClick={() => navigate('/login')}>Iniciar Sesión</span> para usarlo.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-brand-secondary tracking-widest">Total Final</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Acuerdo de pago Mayorista</span>
          </div>
          <span className="text-4xl font-black text-brand-primary italic tracking-tighter">
            ${order.total.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* 🏛️ NUEVA SECCIÓN DE DATOS DE TRANSFERENCIA BANCARIA DIRECTA */}
      <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-3xl p-6 mb-6 space-y-3">
        <h4 className="text-xs font-black text-brand-primary uppercase italic tracking-wider">🏛️ Datos para Transferencia Directa</h4>
        <p className="text-[11px] font-bold text-gray-600 uppercase">Si prefiere agilizar el despacho, realice la transferencia aquí:</p>
        <div className="bg-white p-4 rounded-xl border text-xs font-mono text-gray-700 space-y-1.5 select-all">
          <div><span className="font-sans font-black text-[10px] text-gray-400 uppercase block">Alias Bancario</span>{PS_ALIAS}</div>
          <div className="pt-1.5 border-t border-gray-100"><span className="font-sans font-black text-[10px] text-gray-400 uppercase block">CBU</span>{PS_CBU}</div>
        </div>
        <p className="text-[9px] font-bold text-brand-secondary uppercase italic">⚠️ Envíe el comprobante de pago por WhatsApp indicando su número de orden.</p>
      </div>

      {/* 🗺️ PASOS E INSTRUCCIONES DE SEGUIMIENTO */}
      <div className="space-y-4 mb-8">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest italic border-b pb-2">Próximos pasos recomendados:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* BOTÓN WHATSAPP */}
          <button
            onClick={handleWhatsAppRedirect}
            className="w-full bg-[#25D366] hover:opacity-90 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer uppercase italic text-[11px] tracking-wider"
          >
            <FiMessageSquare className="text-base" /> Coordinar por WhatsApp
          </button>

          {/* BOTÓN COPIAR COMPARTIR */}
          <button
            onClick={handleCopyTrackingLink}
            className={`w-full p-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer uppercase italic text-[11px] tracking-wider border-2 ${copied
                ? "bg-green-50 border-green-500 text-green-600"
                : "bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            {copied ? <FiCheckCircle className="text-base" /> : <FiCopy className="text-base" />}
            {copied ? "¡Link Copiado!" : "Copiar Link de Rastreo"}
          </button>
        </div>

        {/* SOPORTE VÍA CORREO */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase">
          <FiMail className="text-brand-primary" /> Soporte logístico institucional: <span className="text-brand-primary lowercase select-all font-bold">{PS_EMAIL}</span>
        </div>
      </div>

      <p className="text-[9px] text-center text-gray-400 uppercase font-black tracking-[0.15em] px-6 leading-relaxed bg-gray-50 py-3 rounded-2xl border">
        💡 Nota: El equipo administrativo audita las órdenes entrantes de forma constante. Nos comunicaremos directamente al teléfono provisto en su registro si detectamos inconsistencias o demoras en la asignación del stock.
      </p>
    </motion.div>
  );
};

export default CheckoutPage;
