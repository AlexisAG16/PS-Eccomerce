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
      <h1 className="text-4xl font-black text-gray-800 uppercase italic tracking-tighter mb-10">
        Mis <span className="text-air-azul">Órdenes</span>
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 uppercase tracking-widest text-sm italic">No tienes órdenes registradas aún.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            // Contenedor principal flex-col para que el despliegue quede debajo
            <div key={order._id} className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col transition-all">

              {/* FILA PRINCIPAL */}
              <div className="flex justify-between items-center gap-6">
                <div className="flex gap-4 items-center">
                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${order.isExpired || order.status === 'CANCELLED' ? 'bg-gray-200' : 'bg-air-azul/10'}`}>
                    <FaBoxOpen className={order.isExpired || order.status === 'CANCELLED' ? 'text-gray-500' : 'text-air-azul'} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pedido #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-lg font-bold text-gray-800 italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs font-bold text-air-naranja italic uppercase">{order.status}</p>
                  </div>
                </div>

                <div className="flex gap-6 items-center">
                  <span className="text-xl font-black tracking-tighter text-gray-800">${order.total.toLocaleString()}</span>
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="cursor-pointer bg-gray-100 text-gray-600 p-3 rounded-full hover:bg-air-azul hover:text-white transition-all"
                  >
                    {expandedOrderId === order._id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* CONTENIDO DESPLEGABLE */}
              {expandedOrderId === order._id && (
                <div className="mt-8 pt-8 border-t border-gray-100 grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">

                  {/* Items */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Productos</h4>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-gray-700">{item.quantity}x {item.productName}</span>
                        <span className="font-bold text-gray-900">${item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Info Estado (Envío y Pago) */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Estado de gestión</h4>

                    {/* Envío */}
                    <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
                      <FaTruck className={order.shipping ? "text-green-600" : "text-gray-400"} />
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-800">{order.shipping ? `Envío: ${order.shipping.status}` : "Envío: Pendiente"}</p>
                        <p className="text-xs text-gray-500">
                          {order.shipping ? `${order.shipping.carrier} - ${order.shipping.trackingNumber || 'Sin tracking'}` : "Aún no se ha despachado"}
                        </p>
                      </div>
                    </div>

                    {/* Pago */}
                    <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
                      <FaCreditCard className={order.payment ? "text-blue-600" : "text-gray-400"} />
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-800">{order.payment ? `Pago: ${order.payment.status}` : "Pago: Sin procesar"}</p>
                        <p className="text-xs text-gray-500">{order.payment ? `Método: ${order.payment.provider}` : "No se detectó registro de pago"}</p>
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