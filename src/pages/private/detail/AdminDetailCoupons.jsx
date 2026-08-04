import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import CouponModal from "../../../components/forms/CouponForm"; // Tu modal de edición de cupones
import MetricItem from "../../../components/detail/MetricItem";
import DetailCard from "../../../components/detail/DetailCard";
import { EditButton, StatusToggleButton } from "../../../components/ui/Button";
import InfoRow from "../../../components/detail/InfoRow";
import { FiTag, FiUsers, FiShoppingBag, FiActivity, FiAlertCircle, FiSettings, FiCalendar } from "react-icons/fi";

const AdminDetailCoupons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCoupon = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/coupons/${id}`);
      setCoupon(response.data.data);
    } catch (error) {
      toast.error("Error al obtener datos del cupón");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  const toggleStatus = async () => {
    try {
      const newStatus = !coupon.isActive;
      // Usamos tu misma convención de pegarle al DELETE para alternar/dar de baja
      const response = await api.delete(`/coupons/${id}`);
      setCoupon(response.data.data);
      toast.info(`Cupón ${newStatus ? 'Activado' : 'Pausado'}`);
    } catch (err) {
      toast.error("No se pudo cambiar el estado del cupón");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <ClipLoader color="#1a5276" size={50} />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Abriendo expediente de beneficio...</p>
    </div>
  );

  if (!coupon) return <div className="pt-40 text-center uppercase font-black italic text-brand-primary">Cupón no encontrado</div>;

  // Validaciones lógicas rápidas
  const now = new Date();
  const isExpired = now > new Date(coupon.endDate);
  const isNotVibrantYet = now < new Date(coupon.startDate);
  const hasUsageLimit = coupon.usageLimit && coupon.usageLimit > 0;
  const isLimitReached = hasUsageLimit && coupon.usedCount >= coupon.usageLimit;

  const originColors = {
    STORE_REWARD: 'bg-purple-100 text-purple-700',
    MARKETING_CAMPAIGN: 'bg-blue-100 text-blue-700',
    MANUAL: 'bg-amber-100 text-amber-700'
  };

  const headerActions = (
    <div className="flex gap-3">
      <EditButton onClick={() => setIsModalOpen(true)} />
      <StatusToggleButton
        isActive={coupon.isActive && !coupon.isUsed}
        onToggle={toggleStatus}
      />
    </div>
  );

  return (
    <AdminDetailLayout
      title={coupon.code}
      subtitle="Expediente Técnico de Cupón de Descuento"
      headerActions={headerActions}
    >
      {/* COLUMNA SUPERIOR: MÉTRICAS GENERALES */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <MetricItem label="Usos Registrados" value={coupon.usedCount} icon={FiActivity} colorClass="text-brand-primary font-black" />
        <MetricItem label="Límite Global" value={hasUsageLimit ? coupon.usageLimit : "∞"} icon={FiSettings} colorClass={isLimitReached ? 'text-red-500 font-black' : 'text-gray-400'} />
        <MetricItem label="Compra Mínima" value={`$${coupon.minOrderAmount?.toLocaleString('es-AR') || 0}`} icon={FiShoppingBag} colorClass="text-brand-secondary" />
        <MetricItem label="Tipo de Beneficio" value={coupon.discountType === 'percentage' ? 'Porcentual' : 'Monto Fijo'} icon={FiTag} colorClass="text-gray-500 font-bold" />
        <MetricItem label="Origen Cupón" value={coupon.origin || 'MARKETING'} icon={FiUsers} colorClass="text-gray-400" />
      </div>

      {/* COLUMNA IZQUIERDA: ALCANCE Y REGLAS */}
      <main className="lg:col-span-7 space-y-6">

        {/* CARD: ALCANCE (PRODUCTOS Y CATEGORÍAS) */}
        <DetailCard title="Alcance y Segmentación de Aplicación">

          {/* Categorías Elegibles */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-gray-200" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Categorías Elegibles
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {coupon.applicableCategories?.map((cat) => (
                <Link to={`/admin/categorias/detalle/${cat._id || cat}`} key={cat._id || cat} className="group">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase italic tracking-wider bg-gray-100 text-gray-500 hover:bg-gray-200 group-hover:scale-105 transition-all">
                    📁 {cat.categoryName || "Ver Categoría"}
                  </span>
                </Link>
              ))}
              {(!coupon.applicableCategories || coupon.applicableCategories.length === 0) && (
                <span className="text-[10px] text-gray-400 italic">Global (Aplica a todas las categorías si no hay restricción)</span>
              )}
            </div>
          </div>

          {/* Productos Exclusivos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-gray-200" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Productos Vinculados Específicos
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {coupon.applicableProducts?.map((prod) => (
                <Link to={`/admin/productos/detalle/${prod._id || prod}`} key={prod._id || prod} className="flex justify-between items-center p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all">
                  <span className="text-xs font-bold uppercase tracking-tighter text-brand-primary">{prod.productName || "Ver Ficha del Producto"}</span>
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border">SKU: {prod.sku || 'N/A'}</span>
                </Link>
              ))}
              {(!coupon.applicableProducts || coupon.applicableProducts.length === 0) && (
                <span className="text-[10px] text-gray-400 italic px-1">Aplica a todo el catálogo general disponible.</span>
              )}
            </div>
          </div>
        </DetailCard>

        {/* CARD: EXCLUSIVIDAD DE USUARIO / RECOMPENSAS */}
        {(coupon.userId || coupon.rewardId) && (
          <DetailCard title="Trazabilidad y Asignación Directa">
            {coupon.userId && (
              <InfoRow
                label="Propietario Exclusivo (User ID)"
                value={
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">{coupon.userId.email || coupon.userId}</span>
                    <span className="text-[9px] font-black text-brand-secondary uppercase mt-0.5">🔒 Intransferible</span>
                  </div>
                }
              />
            )}
            {coupon.rewardId && (
              <InfoRow label="ID Canje en Tienda de Puntos" value={<span className="font-mono text-xs text-purple-600 font-bold">{coupon.rewardId}</span>} />
            )}
          </DetailCard>
        )}

        {/* ALERTAS DE ESTADO CRÍTICAS */}
        <div className="space-y-3">
          {isExpired && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
              <FiAlertCircle className="text-red-500 text-xl shrink-0" />
              <p className="text-[10px] text-red-700 font-bold uppercase leading-tight">
                Vigencia Caducada: Este cupón superó su fecha límite y fue desactivado por el sistema de ruteo.
              </p>
            </div>
          )}
          {isLimitReached && (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3">
              <FiAlertCircle className="text-orange-500 text-xl shrink-0" />
              <p className="text-[10px] text-orange-700 font-bold uppercase leading-tight">
                Límite Agotado: Se alcanzó el número máximo de canjes globales permitidos ({coupon.usageLimit} un).
              </p>
            </div>
          )}
        </div>
      </main>

      {/* CONFIGURACIÓN DERECHA: REGLAS Y FECHAS */}
      <aside className="lg:col-span-5 space-y-6">

        {/* CARD: BENEFICIO REAL */}
        <DetailCard title="Magnitud del Descuento">
          <InfoRow
            label="Valor Nominal Aplicado"
            value={
              <span className="text-3xl text-brand-primary font-black italic">
                {coupon.discountType === 'percentage' ? `${coupon.value}%` : `$${coupon.value?.toLocaleString('es-AR')}`}
              </span>
            }
            highlight
          />
          {coupon.maxDiscountAmount && (
            <InfoRow label="Tope Máximo de Descuento" value={`$${coupon.maxDiscountAmount.toLocaleString('es-AR')}`} />
          )}
          <InfoRow label="Origen de Campaña" value={<span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${originColors[coupon.origin] || 'bg-gray-100 text-gray-600'}`}>{coupon.origin}</span>} />
        </DetailCard>

        {/* CARD: REGLAS OPERATIVAS */}
        <DetailCard title="Reglas Operativas de Validación" dark>
          <InfoRow label="Monto Mínimo de Pedido" value={`$${coupon.minOrderAmount?.toLocaleString('es-AR') || 0}`} dark />
          <InfoRow label="Items Mínimos Requeridos" value={`${coupon.minItems || 0} unidades`} dark />
          <InfoRow label="Usos Permitidos por Cliente" value={`${coupon.usagePerUser || 1} uso(s)`} dark />
          <InfoRow label="Estado Único de Canje" value={coupon.isUsed ? "🔴 Ya Canjeado (Exclusivo)" : "🟢 Disponible para Uso"} dark darkHighlight={coupon.isUsed} />
          {coupon.usedAt && <InfoRow label="Fecha de Canje" value={new Date(coupon.usedAt).toLocaleString('es-AR')} dark />}
        </DetailCard>

        {/* CARD: CRONOGRAMA */}
        <DetailCard title="Cronograma de Activación">
          <InfoRow
            label="Inicio de Vigencia"
            value={
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-700">
                <FiCalendar className="text-gray-400" />
                {new Date(coupon.startDate).toLocaleDateString('es-AR')} a las 00:00h
              </div>
            }
          />
          <InfoRow
            label="Fin de Vigencia"
            value={
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-700">
                <FiCalendar className="text-gray-400" />
                {new Date(coupon.endDate).toLocaleDateString('es-AR')} a las 23:59h
              </div>
            }
          />
          <InfoRow
            label="Ciclo de Vida Activo"
            value={
              isExpired ? <span className="text-red-500 font-bold uppercase text-[10px]">❌ Finalizado</span> :
                isNotVibrantYet ? <span className="text-amber-500 font-bold uppercase text-[10px]">⏳ En Espera</span> :
                  <span className="text-green-500 font-bold uppercase text-[10px] animate-pulse">🟢 Vigente Activo</span>
            }
          />
          <InfoRow label="Fecha Alta Técnica" value={new Date(coupon.createdAt).toLocaleDateString('es-AR')} />
        </DetailCard>
      </aside>

      {/* FORMULARIO MODAL */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        couponToEdit={coupon}
        onRefresh={fetchCoupon}
      />
    </AdminDetailLayout>
  );
};

export default AdminDetailCoupons;