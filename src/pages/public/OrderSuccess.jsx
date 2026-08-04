import { useLocation, Navigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import useCart from '../../hooks/useCart';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axiosConfig';
import { IoGameControllerOutline } from "react-icons/io5";

const OrderSuccess = () => {
  const location = useLocation();
  const { clearCart } = useCart();

  const [orderInfo] = useState(() => {
    const stateFromLocation = location.state || {};

    // Si entramos con datos frescos, los anclamos
    if (stateFromLocation.orderId) {
      sessionStorage.setItem('lastOrder', JSON.stringify(stateFromLocation));
      return stateFromLocation;
    }

    // Si no (por un refresh), intentamos recuperar del ancla
    const saved = sessionStorage.getItem('lastOrder');
    return saved ? JSON.parse(saved) : {};
  });

  const {
    orderId,
    deliveryType = 'SHIPPING',
    fromCheckout
  } = orderInfo;

  // 1. Extraemos los datos INMEDIATAMENTE al inicio
  // const state = location.state || {};
  // const { orderId, deliveryType = 'SHIPPING', fromCheckout } = state;

  // 2. Definimos estados
  const [orderStatus, setOrderStatus] = useState('loading');
  const [earnedPoints, setEarnedPoints] = useState(0); // 🎯 Estado para puntos
  const hasRun = useRef(false);
  const frameRef = useRef(null);

  // 3. Efecto de Confeti y Limpieza (Solo una vez)
  useEffect(() => {
    if (!fromCheckout || hasRun.current) return;
    hasRun.current = true;

    clearCart();
    localStorage.removeItem('guestOrderId');

    const duration = 600;
    const animationEnd = Date.now() + duration;
    const colors = ['#1a5276', '#f29964'];

    const frame = () => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return cancelAnimationFrame(frameRef.current);

      confetti({ particleCount: 15, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors });
      confetti({ particleCount: 15, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors });

      frameRef.current = requestAnimationFrame(frame);
    };

    frameRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameRef.current);
  }, [fromCheckout, clearCart]);

  // 4. Verificación de la orden (Soluciona el Axios 400)
  useEffect(() => {
    const verifyOrder = async () => {
      if (!orderId) return;
      try {
        const res = await api.get(`/orders/checkout/${orderId}`);
        setOrderStatus(res.data.status);

        // 🎯 Calculamos los puntos sumando lo que viene en cada item de la orden
        if (res.data.items) {
          const totalPoints = res.data.items.reduce((acc, item) => acc + (item.points || 0), 0);
          setEarnedPoints(totalPoints);
        }
      } catch (err) {
        console.error("Error Patrician Software Verify:", err);
        setOrderStatus('error');
      }
    };
    verifyOrder();
  }, [orderId]);

  // 5. Guardia de seguridad
  if (!fromCheckout && !orderId) {
    return <Navigate to="/" replace />;
  }

  const isPickup = deliveryType === 'PICKUP';

  return (
    <div className="max-w-2xl mx-auto my-20 p-10 bg-white rounded-[3rem] shadow-2xl text-center border border-green-50 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-primary/5 rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-secondary/10 rounded-full" />

      <div className="relative z-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-green-200">
          ✓
        </div>

        <h1 className="text-3xl font-black text-brand-primary uppercase italic tracking-tighter mb-2">
          ¡Misión Cumplida!
        </h1>

        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-10">
          {isPickup ? "Tu pedido está listo para retirar" : "Tu pedido está en camino"}
        </p>

        {/* 🎯 SECCIÓN DE PUNTOS GANADOS */}
        {earnedPoints > 0 && (
          <div className="mb-10 animate-bounce">
            <div className="inline-block bg-linear-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full shadow-lg">
              <span className="text-xs font-black uppercase tracking-widest">¡Ganaste {earnedPoints} Puntos!</span>
            </div>
            <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
              Canjealos por premios en nuestra tienda de puntos
            </p>
          </div>
        )}

        {/* CONTENEDOR DEL QR */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 inline-block mb-10 transition-transform hover:scale-105 duration-300">
          <div className="p-4 bg-white inline-block rounded-4xl">
            <QRCodeSVG
              value={`https://ps-eccomerce.netlify.app/track/${orderId}`}
              size={160}
              fgColor="#1a5276"
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="mt-2 pb-6 px-4">
            <span className="text-[10px] font-black uppercase text-gray-300 block mb-1 tracking-[0.2em]">
              ID de Operación
            </span>
            <strong className="text-sm font-black text-brand-primary tracking-tight italic break-all">
              {orderId?.toUpperCase()}
            </strong>
          </div>
        </div>

        {/* 🎯 SECCIÓN MINIJUEGO */}
        <div className="mb-10 p-6 bg-brand-primary/5 rounded-4xl border-2 border-dashed border-brand-primary/20 max-w-sm mx-auto">
          <p className="text-brand-primary text-[11px] font-black uppercase mb-3 tracking-wider">
            ¿Querés más puntos? 🕹️
          </p>
          <p className="text-gray-500 text-[10px] mb-4 leading-tight">
            Jugá a nuestro minijuego y multiplicá tus chances de ganar descuentos exclusivos.
          </p>
          <button
            onClick={() => window.location.href = '/minijuego'}
            className="w-full py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-black uppercase italic text-[10px] tracking-widest hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <IoGameControllerOutline size={16} />
            Jugar Minijuego
          </button>
        </div>

        {isPickup && (
          <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 mx-auto max-w-sm">
            <p className="text-brand-primary text-[10px] font-black uppercase italic">
              📍 Retirá por nuestra sucursal central
            </p>
            <a
              href="https://maps.google.com/..."
              target="_blank"
              className="text-[9px] font-bold text-brand-secondary underline uppercase tracking-tighter"
            >
              Ver ubicación en mapa
            </a>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-2">
          <button className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-[#154360] transition-all shadow-lg shadow-brand-primary/30"
            onClick={() => window.location.href = `/track/${orderId}`}>
            Consultar Detalles
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-[#154360] transition-all shadow-lg shadow-brand-primary/30"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
