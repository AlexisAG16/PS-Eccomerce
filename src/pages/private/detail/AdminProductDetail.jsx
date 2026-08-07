import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import ProductModal from "../../../components/forms/ProductForm";
import MetricItem from "../../../components/detail/MetricItem";
import ProductVisualizer from "../../../components/detail/ProductVisualizer";
import DetailCard from "../../../components/detail/DetailCard";
import { EditButton, StatusToggleButton } from "../../../components/ui/Button";
import InfoRow from "../../../components/detail/InfoRow";
import { FiBox, FiTrendingUp, FiDollarSign, FiBarChart2, FiAlertCircle, FiSettings } from "react-icons/fi";
import DiscountStatusCard from "../../../components/detail/DiscountStatusCard";

const AdminProductDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // En admin solemos buscar por ID directo
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      toast.error("Error al obtener datos del producto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const toggleStatus = async () => {
    try {
      const newStatus = !product.isActive;
      const response = await api.delete(`/products/${id}`);
      setProduct(response.data.data);
      toast.info(`Producto ${newStatus ? 'Activado' : 'Desactivado'}`);
    } catch (err) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <ClipLoader color="#1a5276" size={50} />
      <p className="mt-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest italic animate-pulse">Abriendo expediente técnico...</p>
    </div>
  );

  if (!product) return <div className="pt-40 text-center uppercase font-black italic text-brand-text">Producto no encontrado</div>;

  {/* Lógica para determinar si hay una rebaja real */ }
  const hasActiveDiscount = product.finalPrice < product.priceRetail
  const isLowStock = product.trackStock && product.stock <= product.lowStockThreshold;
  const hasMaxLimit = product.maxPurchaseQty && product.maxPurchaseQty > 0;;
  const savings = product.priceRetail - product.finalPrice;

  const typeColors = {
    PHYSICAL: 'bg-blue-100 text-blue-700',
    SERVICE: 'bg-purple-100 text-purple-700',
    QUOTE: 'bg-amber-100 text-amber-700'
  };

  const headerActions = (
    <div className="flex gap-3">
      <EditButton onClick={() => setIsModalOpen(true)} />

      <StatusToggleButton
        isActive={product.isActive}
        onToggle={toggleStatus}
      />
    </div>
  );

  // Cálculo de margen rápido para el admin
  const margin = product.costPrice ? (((product.priceRetail - product.costPrice) / product.priceRetail) * 100).toFixed(1) : 0;

  return (
    <AdminDetailLayout
      title={product.productName}
      subtitle="Expediente Técnico de Producto"
      headerActions={headerActions}
    >
      {/* COLUMNA IZQUIERDA: VISUALES */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <MetricItem label="Stock Actual" value={product.stock} icon={FiBox} colorClass={isLowStock ? 'text-red-500 font-black animate-pulse' : 'text-green-500'} />
        <MetricItem label="Umbral Alerta" value={product.lowStockThreshold} icon={FiAlertCircle} colorClass="text-orange-400" />
        <MetricItem label="Margen Est." value={`${margin}%`} icon={FiTrendingUp} colorClass="text-brand-secondary" />
        {/* <MetricItem label="Costo Base" value={`$${product.costPrice?.toLocaleString() || '0'}`} icon={FiDollarSign} colorClass="text-brand-text" /> */}
        <MetricItem label="Tipo Producto" value={product.productType} icon={FiSettings} colorClass="text-brand-text-muted" />
      </div>

      <main className="lg:col-span-7">
        <ProductVisualizer
          product={product}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        {/* SECCIÓN DESCRIPCIÓN ESTILIZADA */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 px-6">
            <div className="h-[2px] w-8 bg-brand-primary" />
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-text">
              Descripción Detallada
            </h3>
          </div>

          <div className="relative overflow-hidden bg-linear-to-br from-white to-gray-50 rounded-[3rem] border border-brand-border shadow-sm group">
            <div className="relative p-10 md:p-14">
              {/* Agregamos whitespace-pre-line */}
              <p className="text-brand-text-muted leading-relaxed text-md font-light whitespace-pre-line">
                {product.description || "No hay descripción disponible para este producto."}
              </p>
            </div>
          </div>

          <DetailCard title="SEO & Indexación">
            <InfoRow label="Slug URL" value={`/${product.productSlug}`} />
            <div className="mt-2">
              <label className="text-[10px] font-bold text-brand-text-muted uppercase">Meta Description</label>
              <p className="text-xs text-brand-text-muted italic mt-1">
                {product.metaDescription || "⚠️ Falta descripción para Google"}
              </p>
            </div>
          </DetailCard>
        </div>
      </main>

      {/* DERECHA: CONFIGURACIÓN Y PRECIOS */}
      <aside className="lg:col-span-5 space-y-6">
        <DetailCard title="Estructura de Precios">
          <InfoRow
            label="Precio de Venta (Retail)"
            value={
              hasActiveDiscount ? (
                <div className="flex flex-col items-end">
                  {/* Precio original tachado, pequeño y gris */}
                  <span className="text-sm text-brand-text-muted line-through decoration-red-400/50 italic font-medium">
                    ${product.priceRetail?.toLocaleString('es-AR')}
                  </span>
                  {/* Precio final (con descuento) grande y naranja */}
                  <span className="text-2xl text-brand-text font-black italic">
                    ${product.finalPrice?.toLocaleString('es-AR')}
                  </span>
                </div>
              ) : (
                `$${product.priceRetail?.toLocaleString('es-AR')}`
              )
            }
            highlight={hasActiveDiscount} // Resaltamos si hay oferta
          />
          <InfoRow
            label="Dimensiones (An x Al x La)"
            value={`${product.dimensions?.width || 0} x ${product.dimensions?.height || 0} x ${product.dimensions?.length || 0} cm`}
          />
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Precio Mayorista" value={`$${product.priceWholesale?.toLocaleString() || 'N/A'}`} />
            <InfoRow
              label="Estado de Oferta"
              value={
                hasActiveDiscount ? (
                  <div className="flex flex-col items-end">
                    <span className="text-green-600 font-black animate-pulse">
                      🏷️ {product.discountRef?.name || 'DESCUENTO ACTIVO'}
                    </span>
                    <span className="text-[10px] text-brand-text-muted">
                      Ahorrás: ${savings.toLocaleString('es-AR')}
                    </span>
                  </div>
                ) : (
                  <span className="text-brand-text-muted">Precio Regular</span>
                )
              }
            />
          </div>
          <div className="space-y-3">
            {/* Título de sección más profesional */}
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-brand-border" />
              <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">
                Clasificación / Categorías
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.categoriesId?.map((cat, index) => (
                <Link
                  to={`/admin/categorias/detalle/${cat._id || cat}`}
                  key={cat._id || cat}
                  className="group"
                >
                  <span className={`
          inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase italic tracking-wider transition-all
          ${index === 0
                      ? 'bg-brand-secondary text-white shadow-md' // Categoría Principal
                      : 'bg-brand-bg text-brand-text-muted hover:bg-brand-border'} // Categorías Secundarias
          group-hover:scale-105 active:scale-95
        `}>

                    {cat.categoryName || "Cargando..."}
                  </span>
                </Link>
              ))}

              {(!product.categoriesId || product.categoriesId.length === 0) && (
                <span className="text-[10px] text-brand-text-muted italic">Sin categorías asignadas</span>
              )}
            </div>
          </div>

          {/* Bloque campaña */}
          <DiscountStatusCard discount={product.discountRef?.name} />
        </DetailCard>

        <DetailCard title="Logística e Inventario" dark>
          <InfoRow label="SKU / ID Técnico" value={product.sku || "PENDIENTE"} dark />
          <InfoRow
            label="Dimensiones (LxAnxAl)"
            value={`${product.dimensions?.length || 0}x${product.dimensions?.width || 0}x${product.dimensions?.height || 0} cm`}
            dark
          />
          <InfoRow label="Peso Operativo" value={`${product.weight || 0} KG`} dark />
          <InfoRow
            label="Gestión de Stock"
            value={product.trackStock ? `Activado (${product.stockMode})` : "Manual / Infinito"}
            dark
          />
          <InfoRow label="Marca / Proveedor" value={product.brand?.name || "Patrician Software Genuine"} dark />
          <InfoRow label="Fecha Alta" value={new Date(product.createdAt).toLocaleDateString()} dark />
        </DetailCard>
        <DetailCard title="Reglas de Venta y Disponibilidad">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <InfoRow
              label="Compra Mínima (Retail)"
              value={`${product.minPurchaseQty} unidades`}
              highlight={product.minPurchaseQty > 1}
            />
            <InfoRow
              label="Límite Máximo por Pedido"
              value={hasMaxLimit ? `${product.maxPurchaseQty} unidades` : "Sin restricciones"}
            />
            <InfoRow
              label="Venta Mayorista (Min)"
              value={`${product.wholesaleMinQty} unidades`}
            />
            <InfoRow
              label="Visibilidad Catálogo"
              value={product.showPrice ? "🟢 Precio Visible" : "🔴 Consultar Precio"}
            />
            <InfoRow
              label="Puntos Recompensa"
              value={
                product.points > 0 ? (
                  <span className="text-amber-600 font-black italic">
                    ⭐ +{product.points} Puntos por Unidad
                  </span>
                ) : (
                  <span className="text-brand-text-muted italic">No otorga puntos</span>
                )
              }
              highlight={product.points > 0}
            />
          </div>
          {isLowStock && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
              <FiAlertCircle className="text-red-500 text-xl shrink-0" />
              <p className="text-[10px] text-red-700 font-bold uppercase leading-tight">
                Atención: El stock está por debajo del umbral de seguridad ({product.lowStockThreshold} un).
              </p>
            </div>
          )}
        </DetailCard>
      </aside>

      {/* BOTÓN DE VISTA PÚBLICA - Ahora ocupa todo el ancho del grid */}
      <div className="lg:col-span-12 mt-6">
        <Link
          to={`/productos/${product.productSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row justify-center items-center gap-4 p-8 w-full bg-brand-primary text-white font-black uppercase italic rounded-[3rem] hover:bg-brand-secondary transition-all group shadow-2xl border border-white/10"
        >
          <span className="tracking-[0.3em] text-xs">Acceder a la terminal de vista pública</span>
        </Link>
      </div>

      {/* MODAL NO OLVIDAR */}
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} productToEdit={product} onRefresh={fetchProduct} />
    </AdminDetailLayout >
  );
}

export default AdminProductDetail;
