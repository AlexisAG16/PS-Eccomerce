import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { ClipLoader } from 'react-spinners';
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaTruck, FaChevronDown, FaChevronUp, FaCreditCard, FaInfoCircle } from 'react-icons/fa';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (error) {
        console.error("Error al cargar órdenes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) return <div className="flex justify-center mt-20"><ClipLoader size={40} color="#1a5276" /></div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10">
      <h1 className="text-4xl font-black text-brand-text uppercase italic tracking-tighter mb-10">
        Mis <span className="text-brand-highlight">Órdenes</span>
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-brand-text-muted uppercase tracking-widest text-sm italic">No tienes órdenes registradas aún.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            // Contenedor principal flex-col para que el despliegue quede debajo
            <div key={order._id} className="bg-brand-surface p-6 md:p-8 rounded-4xl shadow-sm border border-brand-border flex flex-col transition-all">

              {/* FILA PRINCIPAL */}
              <div className="flex justify-between items-center gap-6">
                <div className="flex gap-4 items-center">
                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${order.isExpired || order.status === 'CANCELLED' ? 'bg-brand-bg' : 'bg-brand-bg'}`}>
                    <FaBoxOpen className={order.isExpired || order.status === 'CANCELLED' ? 'text-brand-text-muted' : 'text-brand-highlight'} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-brand-text-muted tracking-widest">Pedido #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-lg font-bold text-brand-text italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs font-bold text-brand-highlight italic uppercase">{order.status}</p>
                  </div>
                </div>

                <div className="flex gap-6 items-center">
                  <span className="text-xl font-black tracking-tighter text-brand-text">${order.total.toLocaleString()}</span>
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="cursor-pointer bg-brand-bg text-brand-text-muted p-3 rounded-full hover:bg-brand-accent hover:text-brand-text transition-all"
                  >
                    {expandedOrderId === order._id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* CONTENIDO DESPLEGABLE */}
              {expandedOrderId === order._id && (
                <div className="mt-8 pt-8 border-t border-brand-border grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">

                  {/* Items */}
                  <div>
                    <h4 className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-4">Productos</h4>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-2 border-b border-brand-border">
                        <span className="text-brand-text-muted">{item.quantity}x {item.productName}</span>
                        <span className="font-bold text-brand-text">${item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Info Estado (Envío y Pago) */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-4">Estado de gestión</h4>

                    {/* Envío */}
                    <div className="bg-brand-bg p-4 rounded-2xl flex items-center gap-3 border border-brand-border">
                      <FaTruck className={order.shipping ? "text-green-300" : "text-brand-text-muted"} />
                      <div>
                        <p className="text-[10px] font-black uppercase text-brand-text">{order.shipping ? `Envío: ${order.shipping.status}` : "Envío: Pendiente"}</p>
                        <p className="text-xs text-brand-text-muted">
                          {order.shipping ? `${order.shipping.carrier} - ${order.shipping.trackingNumber || 'Sin tracking'}` : "Aún no se ha despachado"}
                        </p>
                      </div>
                    </div>

                    {/* Pago */}
                    <div className="bg-brand-bg p-4 rounded-2xl flex items-center gap-3 border border-brand-border">
                      <FaCreditCard className={order.payment ? "text-brand-secondary" : "text-brand-text-muted"} />
                      <div>
                        <p className="text-[10px] font-black uppercase text-brand-text">{order.payment ? `Pago: ${order.payment.status}` : "Pago: Sin procesar"}</p>
                        <p className="text-xs text-brand-text-muted">{order.payment ? `Método: ${order.payment.provider}` : "No se detectó registro de pago"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
