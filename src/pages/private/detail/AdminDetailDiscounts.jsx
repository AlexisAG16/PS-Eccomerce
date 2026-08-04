import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import DiscountModal from "../../../components/forms/DiscountForm"; // Asumiendo que existe
import MetricItem from "../../../components/detail/MetricItem";
import DetailCard from "../../../components/detail/DetailCard";
import { EditButton, StatusToggleButton } from "../../../components/ui/Button";
import InfoRow from "../../../components/detail/InfoRow";
import { FiTag, FiCalendar, FiPercent, FiClock, FiBarChart2, FiBox } from "react-icons/fi";

const AdminDiscountDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDiscount = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/discounts/${id}`);
      setDiscount(response.data.data);
    } catch (error) {
      toast.error("Error al obtener datos de la campaña");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscount();
  }, [id]);

  const toggleStatus = async () => {
    try {
      const newStatus = !discount.isActive;
      // Ajustar según tu endpoint de update
      await api.patch(`/discounts/${id}`, { isActive: newStatus });
      setDiscount({ ...discount, isActive: newStatus });
      toast.info(`Campaña ${newStatus ? 'Activada' : 'Pausada'}`);
    } catch (err) {
      toast.error("Error al cambiar estado");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <ClipLoader color="#1a5276" size={50} />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Consultando cronograma promocional...</p>
    </div>
  );

  if (!discount) return <div className="pt-40 text-center uppercase font-black italic text-brand-primary">Campaña no encontrada</div>;

  const headerActions = (
    <div className="flex gap-3">
      <EditButton onClick={() => setIsModalOpen(true)} />
      <StatusToggleButton isActive={discount.isActive} onToggle={toggleStatus} />
    </div>
  );

  // Lógica de vigencia
  const now = new Date();
  const isExpired = new Date(discount.endDate) < now;
  const isUpcoming = new Date(discount.startDate) > now;

  let statusText = "Vigente";
  let statusColor = "text-green-500";
  if (isExpired) { statusText = "Finalizada"; statusColor = "text-red-500"; }
  if (isUpcoming) { statusText = "Programada"; statusColor = "text-blue-500"; }

  return (
    <AdminDetailLayout
      title={discount.name}
      subtitle="Configuración de Beneficio y Alcance"
      headerActions={headerActions}
    >
      {/* MÉTRICAS DE CAMPAÑA */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricItem
          label="Valor Descuento"
          value={discount.discountType === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
          icon={discount.discountType === 'percentage' ? FiPercent : FiTag}
          colorClass="text-brand-secondary"
        />
        <MetricItem
          label="Estado Temporal"
          value={statusText}
          icon={FiClock}
          colorClass={statusColor}
        />
        <MetricItem
          label="Tipo"
          value={discount.discountType === 'percentage' ? 'Porcentual' : 'Monto Fijo'}
          icon={FiBarChart2}
          colorClass="text-brand-primary"
        />
        <MetricItem
          label="Categorías"
          value={discount.applicableCategories?.length || 0}
          icon={FiBox}
          colorClass="text-gray-400"
        />
      </div>

      {/* INFORMACIÓN PRINCIPAL */}
      <main className="lg:col-span-7">
        <DetailCard title="Descripción de Campaña">
          <div className="p-6 bg-gray-50 rounded-4xl border border-gray-100 italic text-gray-600">
            {discount.description || "Sin descripción técnica adicional."}
          </div>
          <div className="mt-8 space-y-4">
            <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Alcance de Categorías</h4>
            <div className="flex flex-wrap gap-2">
              {discount.applicableCategories?.length > 0 ? (
                discount.applicableCategories.map(cat => (
                  <Link to={`/admin/categorias/detalle/${cat._id}`} key={cat._id}>
                    <span className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase italic text-brand-primary">
                      {cat.categoryName}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">Aplicable a todo el catálogo general.</p>
              )}
            </div>
          </div>
        </DetailCard>
      </main>

      {/* CRONOGRAMA Y AJUSTES */}
      <aside className="lg:col-span-5 space-y-6">
        <DetailCard title="Cronograma de Activación" dark>
          <InfoRow
            label="Fecha de Inicio"
            value={new Date(discount.startDate).toLocaleDateString()}
            icon={FiCalendar}
            dark
          />
          <InfoRow
            label="Fecha de Cierre"
            value={new Date(discount.endDate).toLocaleDateString()}
            icon={FiCalendar}
            dark
          />
          <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase text-white/40 mb-1">Días Restantes / Transcurridos</p>
            <p className="text-xl font-black italic">
              {Math.ceil((new Date(discount.endDate) - now) / (1000 * 60 * 60 * 24))} DÍAS
            </p>
          </div>
        </DetailCard>

        <DetailCard title="Parámetros de Sistema">
          <InfoRow label="ID de Referencia" value={id.slice(-8).toUpperCase()} />
          <InfoRow label="Última Modificación" value={new Date(discount.updatedAt).toLocaleDateString()} />
          <InfoRow label="Creado el" value={new Date(discount.createdAt).toLocaleDateString()} />
        </DetailCard>
      </aside>

      <DiscountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        discountToEdit={discount}
        onRefresh={fetchDiscount}
      />
    </AdminDetailLayout>
  );
};

export default AdminDiscountDetail;