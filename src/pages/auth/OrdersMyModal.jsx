import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { FaTimes, FaShoppingBag, FaCalendarAlt, FaShippingFast, FaCheckCircle, FaExchangeAlt } from 'react-icons/fa';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router';

const statusStyles = {
  CREATED: 'bg-blue-50 text-blue-600 border-blue-200',
  PENDING_PAYMENT: 'bg-amber-50 text-amber-600 border-amber-200',
  PAID: 'bg-green-50 text-green-600 border-green-200',
  SHIPPED: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  COMPLETED: 'bg-gray-100 text-gray-700 border-gray-300',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
};

const orderTypeLabels = {
  RETAIL: 'Minorista',
  WHOLESALE: 'Mayorista'
};

const providerLabels = {
  mercado_pago: 'Mercado Pago',
  echeck: 'E-Check',
  transferencia: 'Transferencia Bancaria'
};

const OrdersMyModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        // 🎯 Forzamos el header 'Accept' para que el controlador devuelva JSON puro
        const response = await api.get('/orders/my', {
          headers: { 'Accept': 'application/json' }
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-4xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">

        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center gap-2">
            <span className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
              <FaShoppingBag className="text-brand-primary text-xs" />
            </span>
            Historial de mis Órdenes
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ClipLoader color="#1a5276" size={40} />
              <p className="mt-4 text-[9px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Buscando compras...</p>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="border border-gray-100 bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition-all">

                {/* INFO TOP GENERAL */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-brand-text bg-gray-100 px-3 py-1 rounded-xl">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <div className="flex items-center text-gray-400 gap-1 text-xs font-medium">
                      <FaCalendarAlt size={10} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                      {orderTypeLabels[order.orderType] || order.orderType}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${statusStyles[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-2 mb-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">

                      {/* 📝 NOMBRE Y CANTIDAD */}
                      <p className="text-gray-600 font-medium">
                        <span className="font-black text-brand-secondary">{item.quantity}x</span>{' '}
                        {/* Usamos 'productName' que ya viene directo en el ítem */}
                        {item.productName || 'Producto'}

                        {/* El SKU lo tenés guardado dentro de productSnapshot */}
                        {item.productSnapshot?.sku && (
                          <span className="text-[10px] text-gray-400 ml-2">
                            ({item.productSnapshot.sku})
                          </span>
                        )}
                      </p>

                      {/* 💰 PRECIO (Usamos directamente el subtotal que ya viene calculado de la DB) */}
                      <div className="text-right">
                        <p className="font-bold text-gray-800">${item.subtotal}</p>
                        {item.quantity > 1 && (
                          <p className="text-[9px] text-gray-400 font-medium">
                            (${item.unitPrice} c/u)
                          </p>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

                {/* Info dinámica de envíos y pagos cruzados */}
                <div className="bg-gray-50 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
                  <div className="text-[11px] text-gray-500 font-medium space-y-1">
                    <p>
                      🚚 Entrega: <span className="font-bold text-gray-700">{order.deliveryType === 'PICKUP' ? 'Retiro' : 'Envío'}</span>
                      {order.shipping?.status && <span className="ml-2 px-1.5 py-0.5 text-[9px] bg-zinc-200 rounded text-zinc-700 font-bold">{order.shipping.status}</span>}
                    </p>
                    <p>
                      💳 Pago:{' '}
                      <span className="font-bold text-gray-700">
                        {order.payment?.provider
                          ? (providerLabels[order.payment.provider] || order.payment.provider)
                          : 'Sin definir' // 👈 Si no hay intento de pago todavía, muestra esto
                        }
                      </span>
                      {order.payment?.status && (
                        <span className="ml-1.5 text-brand-secondary font-black text-[10px]">
                          ({order.payment.status})
                        </span>
                      )}
                    </p>
                  </div>

                  {/* REEMPLAZO DEL CONTENEDOR DE TOTAL / PRECIOS */}
                  <div className="text-right space-y-1 min-w-[120px]">

                    {/* 1. Si hubo descuento, mostramos el Subtotal previo */}
                    {(order.discount > 0 || order.shippingCost > 0) && (
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight flex justify-between gap-4">
                        <span>Subtotal:</span>
                        <span className="font-mono">${Number(order.subtotal || 0).toLocaleString('es-AR')}</span>
                      </div>
                    )}

                    {/* 2. Renglón del Cupón / Descuento aplicado */}
                    {order.discount > 0 && (
                      <div className="text-[10px] font-black text-red-500 uppercase tracking-tight flex justify-between gap-4">
                        <span>Descuento {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                        <span className="font-mono">-${Number(order.discount).toLocaleString('es-AR')}</span>
                      </div>
                    )}

                    {/* 3. Renglón del Costo de Envío */}
                    {order.shippingCost > 0 && (
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight flex justify-between gap-4">
                        <span>Envío:</span>
                        <span className="font-mono">+${Number(order.shippingCost).toLocaleString('es-AR')}</span>
                      </div>
                    )}

                    {/* 4. Total Neto definitivo impactado en la pasarela */}
                    <div className="pt-1 border-t border-dashed border-gray-200 mt-1">
                      <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest leading-none mb-0.5">Total Pagado</p>
                      <p className="text-xl font-black text-brand-primary tracking-tight italic">
                        ${Number(order.total || 0).toLocaleString('es-AR')}
                      </p>
                    </div>

                    {/* 🚀 FILA INFERIOR: BOTÓN PARA RETOMAR PAGO (Solo si corresponde) */}
                    {['CREATED', 'PENDING_PAYMENT'].includes(order.status) && (
                      <div className="flex justify-end pt-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            onClose(); // Cerramos el modal limpiamente
                            navigate(`/orden/recibo/${order._id}`); // 🎯 Navegación SPA fluida sin reload
                          }}
                          className="inline-flex items-center justify-center bg-brand-secondary text-white hover:bg-brand-primary px-5 py-2 rounded-xl font-black text-[10px] uppercase italic tracking-widest transition-all shadow-md active:scale-95 cursor-pointer gap-2"
                        >
                          <FaExchangeAlt size={10} className="animate-pulse" />
                          Pagar Ahora / Ver Recibo
                        </button>
                      </div>
                    )}

                  </div>
                </div>

              </div>

            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-medium text-sm">No registras ninguna orden en tu cuenta todavía.</p>
              <p className="text-[9px] uppercase font-black text-brand-secondary mt-1">¡Tus compras procesadas aparecerán aquí!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrdersMyModal;