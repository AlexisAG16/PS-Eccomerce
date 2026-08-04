import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import MetricItem from "../../../components/detail/MetricItem";
import DetailCard from "../../../components/detail/DetailCard";
import { EditButton, StatusToggleButton } from "../../../components/ui/Button";
import InfoRow from "../../../components/detail/InfoRow";
import {
  FiUser,
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiCode,
  FiActivity,
  FiMail,
  FiPhone,
  FiMapPin
} from "react-icons/fi";
import AffiliateModal from "../../../components/forms/AffiliateForm";

const AdminDetailAffiliates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAffiliate = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/affiliates/${id}`);
      setAffiliate(response.data.data);
    } catch (error) {
      toast.error("Error al obtener datos del afiliado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliate();
  }, [id]);

  const toggleStatus = async () => {
    try {
      const newStatus = !affiliate.isActive;
      // Usamos el endpoint DELETE que configuraste para desactivar
      await api.delete(`/affiliates/${id}`);
      setAffiliate({ ...affiliate, isActive: newStatus });
      toast.info(`Afiliado ${newStatus ? 'Reactivado' : 'Desactivado'}`);
    } catch (err) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <ClipLoader color="#1a5276" size={50} />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Consultando base de datos de socios...</p>
    </div>
  );

  if (!affiliate) return <div className="pt-40 text-center uppercase font-black italic text-brand-primary">Afiliado no encontrado</div>;

  const headerActions = (
    <div className="flex gap-3">
      <EditButton onClick={() => setIsModalOpen(true)} />
      <StatusToggleButton
        isActive={affiliate.isActive}
        onToggle={toggleStatus}
      />
    </div>
  );

  return (
    <AdminDetailLayout
      title={affiliate.affiliateCode?.toUpperCase()}
      subtitle="Expediente de Socio Comercial"
      headerActions={headerActions}
    >
      {/* SECCIÓN DE MÉTRICAS RÁPIDAS */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricItem
          label="Ganancias Totales"
          value={`$${affiliate.totalEarnings?.toLocaleString('es-AR')}`}
          icon={FiDollarSign}
          colorClass="text-green-500 font-black"
        />
        <MetricItem
          label="Comisión Base"
          value={`${affiliate.defaultCommission}%`}
          icon={FiTrendingUp}
          colorClass="text-brand-secondary"
        />
        <MetricItem
          label="Código Activo"
          value={`@${affiliate.affiliateCode}`}
          icon={FiCode}
          colorClass="text-brand-primary"
        />
        <MetricItem
          label="Estado Cuenta"
          value={affiliate.isActive ? 'ACTIVA' : 'SUSPENDIDA'}
          icon={FiActivity}
          colorClass={affiliate.isActive ? 'text-blue-400' : 'text-red-400'}
        />
      </div>

      {/* COLUMNA IZQUIERDA: DATOS DEL USUARIO */}
      <main className="lg:col-span-7 space-y-6">
        <DetailCard title="Identidad del Usuario Vinculado">
          <div className="flex flex-col md:flex-row gap-8 p-4">
            {/* Avatar o Letra Inicial */}
            <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-white text-4xl font-black italic shadow-xl shrink-0">
              {affiliate.user?.firstName?.charAt(0)}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-black text-brand-primary uppercase italic tracking-tighter">
                  {affiliate.user?.firstName} {affiliate.user?.lastName}
                </h3>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold uppercase">
                  ID de Usuario: {affiliate.user?._id}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <FiMail className="text-brand-secondary" />
                  <span className="text-sm font-medium">{affiliate.user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FiPhone className="text-brand-secondary" />
                  <span className="text-sm font-medium">{affiliate.user?.phone || 'Sin teléfono'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 md:col-span-2">
                  <FiMapPin className="text-brand-secondary" />
                  <span className="text-sm font-medium">
                    {affiliate.user?.address?.street} {affiliate.user?.address?.number}, {affiliate.user?.address?.city}
                  </span>
                </div>
              </div>

              <Link
                to={`/admin/usuarios/detalle/${affiliate.user?._id}`}
                className="inline-block text-[10px] font-black text-brand-primary uppercase border-b-2 border-brand-primary pb-1 hover:text-brand-secondary hover:border-brand-secondary transition-all"
              >
                Ver expediente de usuario completo →
              </Link>
            </div>
          </div>
        </DetailCard>

        <DetailCard title="Información Bancaria y Pagos" dark>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <InfoRow label="Método Preferido" value={affiliate.paymentMethod?.type} dark highlight />
            <InfoRow label="Identificador (Alias/CBU)" value={affiliate.paymentMethod?.identifier} dark />
            <InfoRow label="Titular de Cuenta" value={affiliate.paymentMethod?.holderName || 'No especificado'} dark />
            <InfoRow label="DNI/CUIT Titular" value={affiliate.paymentMethod?.holderDocument || 'No especificado'} dark />
          </div>
        </DetailCard>
      </main>

      {/* COLUMNA DERECHA: CONFIGURACIÓN Y TIEMPOS */}
      <aside className="lg:col-span-5 space-y-6">
        <DetailCard title="Configuración de Afiliación">
          <InfoRow label="Código de Rastreo" value={`@${affiliate.affiliateCode}`} />
          <InfoRow
            label="Tasa de Comisión"
            value={`${affiliate.defaultCommission}%`}
            highlight
          />
          <InfoRow label="Fecha de Registro" value={new Date(affiliate.createdAt).toLocaleDateString('es-AR')} />
          <InfoRow label="Última Actualización" value={new Date(affiliate.updatedAt).toLocaleDateString('es-AR')} />
        </DetailCard>

        <div className="p-8 bg-linear-to-br from-brand-primary to-[#2574a9] rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <FiTrendingUp className="absolute -right-4 -bottom-4 text-white/10 text-9xl rotate-12 group-hover:scale-110 transition-transform" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Rendimiento Histórico</h4>
          <p className="text-4xl font-black italic tracking-tighter">
            ${affiliate.totalEarnings?.toLocaleString('es-AR')}
          </p>
          <p className="text-[9px] uppercase font-bold mt-4 bg-white/20 inline-block px-3 py-1 rounded-full">
            Acumulado pagado y pendiente
          </p>
        </div>
      </aside>

      {/* ACCIÓN: LINK DE AFILIADO */}
      <div className="lg:col-span-12 mt-6">
        <button
          onClick={() => {
            const link = `https://ps-eccomerce.netlify.app/?ref=${affiliate.affiliateCode}`;
            navigator.clipboard.writeText(link);
            toast.success("Enlace copiado al portapapeles");
          }}
          className="flex flex-row justify-center items-center gap-4 p-8 w-full bg-white text-brand-primary font-black uppercase italic rounded-[3rem] hover:bg-gray-50 transition-all shadow-xl border-2 border-gray-100 group"
        >
          <FiCode className="text-xl" />
          <span className="tracking-[0.3em] text-xs">Generar y copiar enlace de referido</span>
        </button>
      </div>

      {/* MODAL PARA EDITAR */}
      <AffiliateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        affiliateToEdit={affiliate}
        onRefresh={fetchAffiliate}
      />
    </AdminDetailLayout>
  );
}

export default AdminDetailAffiliates;
