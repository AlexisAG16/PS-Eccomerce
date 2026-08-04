import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import RewardModal from "../../../components/forms/RewardForm";
import MetricItem from "../../../components/detail/MetricItem";
import DetailCard from "../../../components/detail/DetailCard";
import { EditButton, StatusToggleButton } from "../../../components/ui/Button";
import InfoRow from "../../../components/detail/InfoRow";
import { FiGift, FiTag, FiUsers, FiSettings, FiActivity, FiLayers } from "react-icons/fi";

const AdminRewardDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReward = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/rewards/${id}`);
      setReward(response.data.data);
    } catch (error) {
      toast.error("Error al obtener datos de la recompensa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReward();
  }, [id]);

  const toggleStatus = async () => {
    try {
      const newStatus = !reward.isActive;
      // Usamos el endpoint de delete que en tu sistema suele ser un toggle de isActive
      await api.delete(`/rewards/${id}`);
      setReward({ ...reward, isActive: newStatus });
      toast.info(`Recompensa ${newStatus ? 'Activada' : 'Desactivada'}`);
    } catch (err) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <ClipLoader color="#1a5276" size={50} />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Analizando parámetros de lealtad...</p>
    </div>
  );

  if (!reward) return <div className="pt-40 text-center uppercase font-black italic text-brand-primary">Recompensa no encontrada</div>;

  const isLowStock = reward.stock !== -1 && reward.stock <= 5;
  const isInfinite = reward.stock === -1;

  const headerActions = (
    <div className="flex gap-3">
      <EditButton onClick={() => setIsModalOpen(true)} />
      <StatusToggleButton
        isActive={reward.isActive}
        onToggle={toggleStatus}
      />
    </div>
  );

  return (
    <AdminDetailLayout
      title={reward.title}
      subtitle="Expediente de Configuración de Recompensa"
      headerActions={headerActions}
    >
      {/* MÉTRICAS RÁPIDAS */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricItem
          label="Costo de Canje"
          value={`${reward.pointsCost} PTS`}
          icon={FiActivity}
          colorClass="text-brand-primary font-black"
        />
        <MetricItem
          label="Stock Disponible"
          value={isInfinite ? "∞" : reward.stock}
          icon={FiGift}
          colorClass={isLowStock ? 'text-red-500 animate-pulse' : 'text-brand-secondary'}
        />
        <MetricItem
          label="Tipo de Beneficio"
          value={reward.config?.discountType === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}
          icon={FiTag}
          colorClass="text-gray-400"
        />
        <MetricItem
          label="Estado Visible"
          value={reward.isActive ? "ACTIVO" : "OCULTO"}
          icon={FiSettings}
          colorClass={reward.isActive ? "text-green-500" : "text-gray-300"}
        />
      </div>

      <main className="lg:col-span-7 space-y-6">
        {/* CARD DE BENEFICIO PRINCIPAL */}
        <div className="relative overflow-hidden bg-brand-primary p-10 md:p-16 rounded-[3rem] text-white shadow-xl group">
          <FiGift className="absolute -right-10 -bottom-10 text-white/10 text-[15rem] group-hover:rotate-12 transition-transform duration-700" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-2">Valor de Recompensa</p>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
              {reward.config?.discountType === 'percentage' ? `${reward.config.value}%` : `$${reward.config.value}`}
              <span className="text-2xl md:text-4xl ml-2 text-brand-secondary block md:inline uppercase not-italic tracking-normal">OFF</span>
            </h2>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-12 bg-white/30" />
              <p className="text-sm font-light italic text-white/80">Código autogenerado de uso único al canjear.</p>
            </div>
          </div>
        </div>

        <DetailCard title="Reglas Generales de Aplicación">
          <InfoRow
            label="Monto Mínimo de Compra"
            value={`$${reward.config?.minOrderAmount?.toLocaleString('es-AR') || 0}`}
            highlight={reward.config?.minOrderAmount > 0}
          />
          <InfoRow
            label="Cantidad Mínima de Ítems"
            value={`${reward.config?.minItems || 0} unidades`}
          />
          <InfoRow
            label="Alcance de Aplicación"
            value={reward.config?.categoryRestriction ? "Restringido a Categoría" : "Global (Toda la tienda)"}
          />
          {reward.config?.categoryRestriction && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiLayers className="text-brand-secondary" />
                <span className="text-[10px] font-black uppercase text-gray-500 italic">Categoría Exclusiva:</span>
              </div>
              <Link
                to={`/admin/categorias/detalle/${reward.config.categoryRestriction._id || reward.config.categoryRestriction}`}
                className="text-xs font-black text-brand-primary hover:underline uppercase italic"
              >
                {reward.config.categoryRestriction.categoryName || "Ver Categoría"}
              </Link>
            </div>
          )}
        </DetailCard>
      </main>

      {/* DERECHA: LOGÍSTICA Y CONTROL */}
      <aside className="lg:col-span-5 space-y-6">
        <DetailCard title="Parámetros de Sistema" dark>
          <InfoRow label="ID de Referencia" value={reward._id} dark />
          <InfoRow
            label="Disponibilidad"
            value={isInfinite ? "Stock Ilimitado" : `${reward.stock} unidades restantes`}
            dark
          />
          <InfoRow
            label="Fecha de Creación"
            value={new Date(reward.createdAt).toLocaleDateString()}
            dark
          />
          <InfoRow
            label="Última Actualización"
            value={new Date(reward.updatedAt).toLocaleDateString()}
            dark
          />
        </DetailCard>

        <DetailCard title="Simulación de Canje">
          <div className="space-y-4">
            <p className="text-[11px] text-gray-500 leading-relaxed italic">
              Cuando un usuario canjea esta recompensa por <strong>{reward.pointsCost} puntos</strong>, el sistema realizará las siguientes acciones:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Generación de código REW-XXXXXX
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Vencimiento automático (30 días)
              </li>
              <li className="flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Descuento de puntos en perfil usuario
              </li>
            </ul>
          </div>
        </DetailCard>
      </aside>

      {/* BOTÓN DE RETORNO */}
      <div className="lg:col-span-12 mt-6">
        <Link
          to="/admin/recompensas"
          className="flex flex-row justify-center items-center gap-4 p-8 w-full bg-white text-brand-text font-black uppercase italic rounded-[3rem] hover:bg-gray-50 transition-all group shadow-sm border border-gray-100"
        >
          <span className="tracking-[0.3em] text-xs">Volver al panel de recompensas</span>
        </Link>
      </div>

      <RewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rewardToEdit={reward}
        onRefresh={fetchReward}
      />
    </AdminDetailLayout>
  );
}

export default AdminRewardDetail;