import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// Componentes Patrician Software
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import MetricItem from "../../../components/detail/MetricItem";
import DetailCard from "../../../components/detail/DetailCard";
import InfoRow from "../../../components/detail/InfoRow";
import { FiDollarSign, FiCreditCard, FiActivity, FiShield, FiFileText, FiCornerUpLeft } from "react-icons/fi";
import PaymentActionPanel from "../../../components/detail/PaymentActionPanel";

const STATUS_CONFIG = {
  APPROVED: { label: 'Aprobado', color: 'text-green-500', bg: 'bg-green-500', text: 'El pago fue procesado con éxito.' },
  approved: { label: 'Aprobado', color: 'text-green-500', bg: 'bg-green-500', text: 'El pago fue procesado con éxito.' },
  PENDING: { label: 'Pendiente', color: 'text-amber-500', bg: 'bg-amber-500', text: 'El usuario aún debe completar el pago.' },
  REJECTED: { label: 'Rechazado', color: 'text-red-500', bg: 'bg-red-500', text: 'La transacción fue declinada.' },
  REFUNDED: { label: 'Reembolsado', color: 'text-purple-500', bg: 'bg-purple-500', text: 'El dinero fue devuelto al cliente.' },
  CANCELLED: { label: 'Cancelado', color: 'text-brand-text-muted', bg: 'bg-brand-surface0', text: 'El pago fue anulado.' }
};

const AdminPaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (payment) setNotes(payment.notes || "");
  }, [payment]);

  useEffect(() => {
    const fetchPayment = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/payments/${id}`);
        const data = response.data.data || response.data;
        setPayment(data);
      } catch (error) {
        toast.error("Error al cargar el pago");
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  const handleUpdateNotes = async () => {
    try {
      Swal.showLoading();
      await api.patch(`/payments/${id}`, { notes });
      setPayment({ ...payment, notes });
      Swal.fire({ icon: 'success', title: 'Notas actualizadas', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire('Error', 'No se pudieron guardar las notas', 'error');
    }
  };

  const handleRefund = async () => {
    const result = await Swal.fire({
      title: '¿Reembolsar Pago?',
      text: "Esta acción intentará devolver el dinero a través de Mercado Pago.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a5276',
      confirmButtonText: 'SÍ, REEMBOLSAR',
      cancelButtonText: 'CANCELAR',
      customClass: { popup: 'rounded-[3rem]' }
    });

    if (result.isConfirmed) {
      try {
        Swal.showLoading();
        await api.patch('/orders/' + payment.orderId + '/status', { status: 'CANCELLED' });
        setPayment({ ...payment, status: 'REFUNDED' });
        Swal.fire('¡Éxito!', 'Reembolso procesado.', 'success');
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'No se pudo procesar el reembolso.', 'error');
      }
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <ClipLoader color="#1a5276" size={50} />
      <p className="mt-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest italic animate-pulse">Consultando Transacción...</p>
    </div>
  );

  if (!payment) return <div className="pt-40 text-center uppercase font-black italic text-brand-text">Pago no encontrado</div>;

  const mpData = payment.rawResponse?.raw || {};
  const statusInfo = STATUS_CONFIG[payment.status] || { label: payment.status, color: 'text-brand-text-muted' };

  const headerActions = (
    <button
      onClick={() => navigate(`/admin/ordenes/detalle/${payment.orderId?._id || payment.orderId}`)}
      className="bg-brand-primary text-white px-8 py-3 rounded-full font-black uppercase italic text-[10px] tracking-widest hover:bg-brand-secondary transition-all shadow-lg"
    >
      Ver Orden Relacionada
    </button>
  );

  return (
    <AdminDetailLayout
      title={`Pago #${id?.slice(-8).toUpperCase()}`}
      subtitle="Auditoría de Transacción y Flujo de Fondos"
      headerActions={headerActions}
    >
      {/* MÉTRICAS FINANCIERAS */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricItem
          label="Monto Bruto"
          value={`$${payment.amount?.toLocaleString('es-AR')}`}
          icon={FiDollarSign}
          colorClass="text-brand-text"
        />
        <MetricItem
          label="Estado"
          value={statusInfo.label}
          icon={FiActivity}
          colorClass={statusInfo.color}
        />
        <MetricItem
          label="Plataforma"
          value={payment.provider?.replace('_', ' ') || 'Mercado Pago'}
          icon={FiShield}
          colorClass="text-blue-500"
        />
        <MetricItem
          label="Neto Estimado"
          value={`$${mpData.transaction_details?.net_received_amount?.toLocaleString('es-AR') || '---'}`}
          icon={FiCornerUpLeft}
          colorClass="text-brand-secondary"
        />
      </div>

      {/* COLUMNA IZQUIERDA: RESUMEN DE TRANSACCIÓN */}
      <main className="lg:col-span-8 space-y-6">
        <DetailCard title="Desglose de Operación">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="p-8 bg-brand-surface rounded-[2.5rem] border border-brand-border">
              <p className="text-[10px] font-black text-brand-text-muted uppercase mb-2">Pasarela de Pago (Gateway)</p>
              <p className="text-2xl font-black text-brand-text uppercase italic">
                {mpData.payment_method_id || 'N/A'}
              </p>
              <p className="text-[10px] font-bold text-brand-text-muted mt-1 uppercase">
                {mpData.payment_type_id} • **** {mpData.card?.last_four_digits || '0000'}
              </p>
            </div>
            <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100">
              <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Identificador Externo</p>
              <p className="text-xl font-mono font-bold text-brand-text">
                {mpData.id || 'N/A'}
              </p>
              <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase">ID Mercado Pago</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-dashed pt-8">
            <h4 className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-4">Datos del Pagador</h4>
            <InfoRow label="Email Registrado" value={mpData.payer?.email || 'No disponible'} />
            <InfoRow label="ID de Usuario MP" value={mpData.payer?.id || 'N/A'} />
          </div>

          {/* LOG TÉCNICO */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Respuesta de Sistema (Raw Data)</h4>
              <span className="text-[8px] font-mono text-brand-text-muted/50">Format: JSON_SERIALIZED</span>
            </div>
            <div className="bg-gray-900 rounded-4xl p-6 overflow-x-auto max-h-[300px] border-4 border-gray-800 shadow-inner">
              <pre className="text-green-400 font-mono text-[10px] leading-relaxed">
                {JSON.stringify(payment.rawResponse, null, 2)}
              </pre>
            </div>
          </div>
        </DetailCard>
      </main>

      {/* COLUMNA DERECHA: ESTADO Y CONTROL */}
      <aside className="lg:col-span-4 space-y-6">
        <DetailCard title="Cronología" dark>
          <InfoRow
            label="Iniciado el"
            value={payment.createdAt ? new Date(payment.createdAt).toLocaleString('es-AR') : '---'}
            dark
          />
          <InfoRow
            label="Aprobación"
            value={mpData.date_approved ? new Date(mpData.date_approved).toLocaleString('es-AR') : 'Pendiente'}
            dark
          />
          <div className="mt-6">
            <PaymentActionPanel
              payment={{ ...payment, status: payment.status.toUpperCase() }}
              onRefund={handleRefund}
            />
          </div>

          <div className="mt-4 p-4 bg-brand-surface/5 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase text-white/40 mb-1">Estado en Pasarela</p>
            <p className="text-sm font-black italic text-brand-secondary uppercase">{mpData.status || 'N/A'}</p>
            <p className="text-[10px] text-white/60 leading-tight mt-1">{mpData.status_detail || 'Esperando confirmación'}</p>
          </div>
        </DetailCard>

        {/* NOTAS */}
        <DetailCard title="Auditoría de Notas">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-brand-surface border-none rounded-2xl p-5 text-xs font-bold text-brand-text-muted focus:ring-2 focus:ring-brand-primary transition-all min-h-[120px] resize-none"
            placeholder="Escriba observaciones sobre este pago..."
          />
          <button
            onClick={handleUpdateNotes}
            className="w-full mt-4 py-4 bg-brand-primary text-white rounded-4xl font-black uppercase italic text-[10px] tracking-widest hover:bg-brand-secondary transition-all shadow-md"
          >
            Guardar Observación
          </button>
        </DetailCard>
      </aside>
    </AdminDetailLayout>
  );
};

export default AdminPaymentDetail;
