import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const STATUS_MAP = {
  CREATED: { label: "Orden Creada" },
  PENDING_PAYMENT: { label: "Esperando Pago" },
  PAID: { label: "Pago Acreditado" },
  SHIPPED: { label: "En Despacho" },
  COMPLETED: { label: "Pedido Finalizado" },
  CANCELLED: { label: "Venta Anulada" }
};

const STATUS_CONFIG = {
  PAID: {
    title: '¿Confirmar Pago?',
    text: 'Se registrará el ingreso de dinero y se validará el stock de forma definitiva.',
    icon: 'info',
    confirmButtonColor: '#1a5276',
    confirmButtonText: 'SÍ, MARCAR COMO PAGADO'
  },
  SHIPPED: {
    title: '¿Orden Despachada?',
    text: 'Asegúrate de haber generado la guía de envío antes de cambiar el estado.',
    icon: 'question',
    confirmButtonColor: '#1a5276',
    confirmButtonText: 'SÍ, DESPACHADO'
  },
  COMPLETED: {
    title: '¿Finalizar Pedido?',
    text: 'La orden se marcará como entregada con éxito. Esta acción es definitiva.',
    icon: 'success',
    confirmButtonColor: '#1a5276',
    confirmButtonText: 'SÍ, COMPLETAR'
  },
  CANCELLED: {
    title: '¿ANULAR ORDEN?',
    text: 'Se cancelará la venta y se devolverá el stock a los productos. ¡Acción irreversible!',
    icon: 'warning',
    confirmButtonColor: '#d33',
    confirmButtonText: 'SÍ, ANULAR VENTA'
  }
};

const FINAL_STATES = ["COMPLETED", "CANCELLED"];

const AdminFullOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (order) setNotes(order.notes || "");
  }, [order]);

  const handleUpdateOrderNotes = async () => {
    try {
      await api.patch(`/orders/${id}/notes`, { notes });
      toast.success("Comentario guardado");
    } catch (err) {
      toast.error("Error al guardar nota");
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Asumiendo que tu backend devuelve la orden populada con pagos y envíos
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.data);
      } catch (error) {
        toast.error("Error al cargar la orden completa");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    const currentStatus = order.status;

    if (currentStatus === newStatus) return;

    if (FINAL_STATES.includes(currentStatus)) {
      return Swal.fire({
        title: 'Acción Bloqueada',
        text: `Esta orden ya está en estado ${currentStatus} y no puede ser modificada.`,
        icon: 'error',
        confirmButtonColor: '#1a5276'
      });
    }

    const config = STATUS_CONFIG[newStatus] || { title: '¿Cambiar estado?', text: `Pasar a ${newStatus}` };

    const result = await Swal.fire({
      ...config,
      showCancelButton: true,
      cancelButtonText: 'VOLVER',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-[3rem] p-10 border-4 border-brand-primary/10',
        confirmButton: 'rounded-2xl font-black uppercase italic text-[10px] tracking-widest px-8 py-4',
        cancelButton: 'rounded-2xl font-black uppercase italic text-[10px] tracking-widest px-8 py-4 bg-gray-100 text-gray-400'
      }
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Procesando...',
        html: 'Sincronizando inventario y logística.',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      try {
        // YA NO USAMOS EL RESPONSE, solo necesitamos confirmar que llegó al 200
        await api.patch(`/orders/${id}/status`, { status: newStatus });

        // Actualizamos el estado local directamente
        setOrder(prev => ({ ...prev, status: newStatus }));

        Swal.fire({
          title: '¡Sincronizado!',
          text: `La orden ahora está en estado ${newStatus}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[2rem]' }
        });

      } catch (err) {
        Swal.fire({
          title: 'Error Crítico',
          text: err.response?.data?.message || 'Error al actualizar el estado',
          icon: 'error',
          confirmButtonColor: '#1a5276'
        });
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><ClipLoader color="#1a5276" size={50} /></div>;
  if (!order) return <div className="pt-40 text-center uppercase font-black italic text-brand-primary">Orden no encontrada</div>;

  return (
    <>
      {/* HEADER DE GESTIÓN */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="text-brand-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-2">Gestión Integral</p>
          <h1 className="text-4xl font-black text-brand-primary uppercase italic tracking-tighter">
            Orden #{order._id.slice(-6).toUpperCase()}
          </h1>
        </div>
        {/* Badge de estado principal */}
        <div className="bg-brand-primary text-white px-6 py-2 rounded-full font-black italic uppercase text-xs tracking-widest">
          {order.status}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 space-y-6">

          {/* PRODUCTOS */}
          <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl">
            <h3 className="text-brand-primary font-black uppercase italic text-xs mb-8">Productos</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <Link to={`/admin/productos/detalle/${item.productId._id}`} key={idx} className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl">
                  {/* Miniatura del producto (opcional, ya que ahora lo tenés en el populate) */}
                  {item.productId?.images?.[0]?.xs && (
                    <img src={item.productId.images[0].xs} className="w-12 h-12 rounded-xl object-cover" alt="prod" />
                  )}
                  <div className="flex-1">
                    <p className="font-black uppercase text-sm">{item.productName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Cant: {item.quantity} x ${item.unitPrice.toLocaleString()}</p>
                  </div>
                  <p className="font-black italic text-brand-primary">${item.subtotal.toLocaleString()}</p>
                </Link>
              ))}
            </div>

            {/* RESUMEN DE DINERO */}
            <div className="mt-8 pt-8 border-t border-dashed border-gray-200 space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase text-gray-400">
                <span>Subtotal</span>
                <span>${order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase text-gray-400">
                <span>Envío</span>
                <span>${order.shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-black uppercase text-brand-primary italic pt-4">
                <span>Total</span>
                <span>${order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 💳 SECCIÓN DE PAGOS (Estilo Cronología) */}
          {/* 💳 SECCIÓN DE PAGOS (Ajustado a lastPayment) */}
          <div className="bg-brand-primary rounded-[3rem] p-8 text-white shadow-2xl">
            <h3 className="font-black uppercase italic text-[10px] tracking-widest mb-8 opacity-60">
              Información de Pago
            </h3>

            {/* CAMBIO CLAVE: Aquí debe decir order.lastPayment */}
            {order.lastPayment ? (
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <p className="text-[9px] font-black uppercase text-white/40">Iniciado el</p>
                  <p className="text-[10px] font-bold">
                    {new Date(order.lastPayment.createdAt).toLocaleString('es-AR')}
                  </p>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-2">
                  <p className="text-[9px] font-black uppercase text-white/40">Aprobación</p>
                  <p className="text-[10px] font-bold">
                    {(() => {
                      const payment = order.lastPayment;
                      if (!payment) return 'Sin pago';

                      // 1. Normalizamos el status (tu DB tiene "APPROVED", MP tiene "approved")
                      const status = (payment.status || payment.rawResponse?.status || '').toLowerCase();

                      // 2. BUSCAMOS LA FECHA (Según tu debug está en rawResponse.raw.date_approved)
                      const date = payment.date_approved ||
                        payment.rawResponse?.date_approved ||
                        payment.rawResponse?.raw?.date_approved;

                      // 3. Verificamos
                      if (status === 'approved' && date) {
                        return new Date(date).toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                      }

                      return 'Pendiente';
                    })()}
                  </p>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[8px] font-black uppercase text-white/40 mb-1">Estado en Pasarela</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${order.lastPayment.status === 'APPROVED' ? 'bg-green-400' : 'bg-orange-400'} animate-pulse`} />
                    <p className="text-sm font-black italic text-brand-secondary uppercase">
                      {/* Accediendo al status dentro de rawResponse del JSON que pasaste */}
                      {order.lastPayment.rawResponse?.status || order.lastPayment.status}
                    </p>
                  </div>
                  <p className="text-[10px] text-white/60 leading-tight mt-1">
                    {order.lastPayment.rawResponse?.status_detail || 'Accreditado'}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/admin/pagos/detalle/${order.lastPayment._id}`)}
                  className="w-full mt-4 bg-white/10 hover:bg-brand-secondary text-white py-4 rounded-2xl font-black uppercase italic text-[9px] tracking-widest transition-all border border-white/20"
                >
                  👁️ Ver Detalles de Pago
                </button>
              </div>
            ) : (
              <p className="text-[10px] italic text-white/40 font-bold uppercase">
                Para garantizar la seguridad de tus transacciones, Mercado Pago es nuestra única plataforma oficial de procesamiento de pagos. Recomendamos no utilizar canales alternativos, ya que Patrician Software no podrá hacerse responsable por compras o gestiones realizadas fuera de nuestro sistema oficial. Evita riesgos innecesarios y opera siempre a través de los medios autorizados.
              </p>
            )}
          </div>
        </main>

        <aside className="lg:col-span-4 space-y-6">

          {/* INFO CLIENTE Y DIRECCIÓN */}
          <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl">
            <h3 className="text-brand-primary font-black uppercase italic text-xs mb-6">Entrega y Cliente</h3>
            <div className="space-y-6">
              {/* Datos Personales (Soporta Invitado y Usuario Logueado) */}
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Comprador</p>

                {order.guest ? (
                  // 🛒 CASO 1: COMPRA COMO INVITADO
                  <>
                    <p className="font-black text-sm uppercase">
                      {order.guest.firstName} {order.guest.lastName}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold">{order.guest.email}</p>
                    <p className="text-[10px] text-gray-500 font-bold">{order.guest.phone}</p>
                  </>
                ) : (
                  // 👤 CASO 2: COMPRA COMO USUARIO LOGUEADO
                  <>
                    <p className="font-black text-sm uppercase">
                      {order.userId?.firstName || 'Usuario'} {order.userId?.lastName || 'Registrado'}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold">{order.userId?.email || 'Sin Email'}</p>
                    <p className="text-[10px] text-gray-500 font-bold">{order.userId?.phone || 'Sin Teléfono'}</p>
                  </>
                )}
              </div>

              {/* Cartel de tipo de cuenta */}
              <div className="mt-4 p-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border">
                {order.userId ? (
                  <div className="bg-green-50 border-green-200 text-green-600 p-2 rounded-xl">
                    👤 Usuario Registrado
                    <p className="text-[8px] font-medium text-gray-400 mt-1 lowercase">
                      ID: {order.userId._id || order.userId}
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border-amber-200 text-amber-600 p-2 rounded-xl">
                    🛒 Compra como Invitado (Guest)
                  </div>
                )}
              </div>

              {/* Dirección Física */}
              {order.deliveryType === 'SHIPPING' && order.shippingAddress && (
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <p className="text-[9px] font-black text-brand-secondary uppercase mb-1">Dirección de Envío</p>
                  <p className="text-xs font-black uppercase">
                    {order.shippingAddress.street} {order.shippingAddress.number}
                    {order.shippingAddress.apartment && ` - ${order.shippingAddress.apartment}`}
                  </p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase">
                    {order.shippingAddress.city} ({order.shippingAddress.postalCode})
                  </p>
                  {order.shippingAddress.reference && (
                    <p className="text-[9px] italic text-gray-400 mt-2">Ref: {order.shippingAddress.reference}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* LOGÍSTICA (Botón de Gestión) */}
          {order.deliveryType === 'SHIPPING' && (
            <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl">
              <h3 className="text-brand-primary font-black uppercase italic text-xs mb-4">Estado Logístico</h3>
              {order.shipping ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1 rounded-full">
                      {order.shipping.status}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/envios/detalle/${order.shipping._id}`)}
                    className="w-full bg-brand-secondary text-white py-3 rounded-2xl text-[10px] font-black uppercase italic shadow-lg shadow-orange-200"
                  >
                    Gestionar Envío
                  </button>
                </div>
              ) : (
                <p className="text-[10px] italic text-gray-400 font-bold">Envío no inicializado.</p>
              )}
            </div>
          )}

          {/* ESTADOS (Tu lógica de botones) */}
          <div className="bg-brand-primary rounded-[3rem] p-8 text-white shadow-2xl no-print">
            {/* ACCIONES DE ESTADO */}
            <h3 className="font-black uppercase italic text-[10px] tracking-widest mb-8 opacity-60">Control de Pedido</h3>
            <div className="flex flex-col gap-3">
              {/* 1. Definimos qué botones mostrar según el estado actual */}
              {(() => {
                const current = order.status;
                let actions = [];

                if (current === "CREATED" || current === "PENDING_PAYMENT") {
                  actions = ["PAID", "CANCELLED"];
                } else if (current === "PAID") {
                  actions = ["SHIPPED", "CANCELLED"];
                } else if (current === "SHIPPED") {
                  actions = ["COMPLETED"];
                }

                if (actions.length === 0) {
                  return (
                    <div className="text-center py-6 border-2 border-white/10 rounded-3xl bg-white/5">
                      <p className="text-[10px] font-black uppercase italic text-brand-secondary tracking-widest">
                        {current === "COMPLETED" ? "✓ Pedido Finalizado" : "✕ Venta Anulada"}
                      </p>
                    </div>
                  );
                }

                return actions.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`
            relative py-5 px-6 rounded-2xl font-black uppercase italic text-[11px] tracking-[0.2em] 
            transition-all duration-300 shadow-lg border-2
            ${st === 'CANCELLED'
                        ? 'bg-transparent border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white'
                        : 'bg-white/10 border-white/10 hover:border-brand-secondary hover:text-brand-secondary'}
            cursor-pointer
          `}
                  >
                    {st === 'CANCELLED' ? `⚠ ${STATUS_MAP[st].label}` : STATUS_MAP[st].label}
                  </button>
                ));
              })()}
            </div>

            {FINAL_STATES.includes(order.status) && (
              <p className="mt-6 text-[8px] font-bold uppercase text-center opacity-40 italic tracking-widest">
                El historial de esta orden está archivado
              </p>
            )}
          </div>

          {/* INFO CLIENTE */}
          <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl print:border-black print:rounded-2xl">
            <h3 className="text-brand-primary font-black uppercase italic text-xs mb-6 border-b pb-4 print:text-black print:border-black">
              Datos de Entrega
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1 print:text-black">Método</p>
                <p className="font-black text-brand-primary uppercase italic text-sm print:text-black">
                  {order.deliveryType === 'PICKUP' ? '📍 Retiro en Local' : '🚚 Envío a Domicilio'}
                </p>
              </div>

              {/* Cambiá esto en tu JSX */}
              {order.deliveryType === 'SHIPPING' && order.shipping && (
                <button
                  onClick={() => navigate(`/admin/envios/detalle/${order.shipping._id}`)}
                  className="w-full mt-4 bg-brand-secondary/10 text-brand-secondary py-3 rounded-2xl font-black uppercase italic text-[9px] tracking-widest hover:bg-brand-secondary hover:text-white transition-all border border-brand-secondary/20"
                >
                  🚚 Ver Hoja de Ruta Logística
                </button>
              )}
            </div>

            {/* Firma al pie para el retiro */}
            <div className="hidden print:block mt-16 pt-8 border-t-2 border-black border-dashed">
              <p className="text-[8px] font-black text-center uppercase mb-8 italic">Firma del cliente al recibir</p>
              <div className="h-px bg-black w-full" />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default AdminFullOrderDetail;