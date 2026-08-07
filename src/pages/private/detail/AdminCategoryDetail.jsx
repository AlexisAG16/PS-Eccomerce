import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import CategoryModal from "../../../components/forms/CategoryForm"; // Modal correspondiente
import MetricItem from "../../../components/detail/MetricItem";
import DetailCard from "../../../components/detail/DetailCard";
import { EditButton, StatusToggleButton } from "../../../components/ui/Button";
import InfoRow from "../../../components/detail/InfoRow";
import { FiGrid, FiPackage, FiLayers, FiInfo } from "react-icons/fi";

const AdminCategoryDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([])

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ejecutamos ambas en paralelo y esperamos a las dos
      const [catRes, prodRes] = await Promise.all([
        api.get(`/categories/${id}`),
        api.get(`/products?categoryId=${id}&limit=100&isActive=true`)
      ]);

      setCategory(catRes.data.data);
      setProducts(prodRes.data.data.data || []);
    } catch (error) {
      toast.error("Error sincronizando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const toggleStatus = async () => {
    try {
      const newStatus = !category.isActive;
      // Usamos PATCH para actualizar solo el estado
      await api.patch(`/categories/${id}`, { isActive: newStatus });
      setCategory({ ...category, isActive: newStatus });
      toast.info(`Categoría ${newStatus ? 'Activada' : 'Desactivada'}`);
    } catch (err) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <ClipLoader color="#1a5276" size={50} />
      <p className="mt-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest italic animate-pulse">Sincronizando índice de categorías...</p>
    </div>
  );

  if (!category) return <div className="pt-40 text-center uppercase font-black italic text-brand-text">Categoría no encontrada</div>;

  const headerActions = (
    <div className="flex gap-3">
      <EditButton onClick={() => setIsModalOpen(true)} />
      <StatusToggleButton isActive={category.isActive} onToggle={toggleStatus} />
    </div>
  );

  return (
    <AdminDetailLayout
      title={category.name}
      subtitle="Definición de Rama de Catálogo"
      headerActions={headerActions}
    >
      {/* MÉTRICAS SUPERIORES */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricItem
          label="Total Productos"
          value={loading ? "..." : (products.length || 0)}
          icon={FiPackage}
          colorClass="text-brand-text"
        />
        <MetricItem
          label="Estado Visibilidad"
          value={category.isActive ? "Público" : "Oculto"}
          icon={FiGrid}
          colorClass={category.isActive ? "text-green-500" : "text-red-500"}
        />
        <MetricItem
          label="Jerarquía"
          value="Principal"
          icon={FiLayers}
          colorClass="text-brand-secondary"
        />
        <MetricItem
          label="Identificador"
          value={id.slice(-6).toUpperCase()}
          icon={FiInfo}
          colorClass="text-brand-text-muted"
        />
      </div>

      {/* COLUMNA IZQUIERDA: VISUAL Y DESCRIPCIÓN */}
      <main className="lg:col-span-7">
        <div className="bg-brand-surface rounded-[3.5rem] overflow-hidden border border-brand-border shadow-xl mb-6 relative group">
          {/* Fondo con degradado y patrón sutil */}
          <div className="aspect-21/9 w-full bg-linear-to-br from-brand-surface to-gray-200 flex items-center justify-center relative overflow-hidden">

            {/* Icono gigante de fondo (decorativo) */}
            <FiGrid className="absolute -right-10 -bottom-10 text-[15rem] text-gray-200/50 rotate-12" />

            {/* Contenedor del Título */}
            <div className="relative z-10 text-center">
              <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-brand-secondary mb-2 drop-shadow-sm">
                Rama de Catálogo
              </span>
              <h1 className="text-5xl md:text-6xl font-black italic text-brand-text uppercase tracking-tighter leading-none">
                {category.categoryName}
              </h1>
              <div className="h-1.5 w-24 bg-brand-secondary mx-auto mt-4 rounded-full" />
            </div>
          </div>
        </div>
        {/* <div className="bg-brand-surface rounded-[3.5rem] overflow-hidden border border-brand-border shadow-xl mb-6">
          <div className="aspect-video w-full bg-brand-bg relative group">
            <img
              src={category.image?.url || '/placeholder-category.jpg'}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="bg-brand-secondary text-white text-[10px] font-black uppercase italic px-4 py-1 rounded-full">Imagen de Portada</span>
            </div>
          </div>
        </div> */}

        {/* <DetailCard title="Descripción General">
          <div className="p-8 bg-brand-surface rounded-[2.5rem] border border-brand-border italic text-brand-text-muted leading-relaxed">
            {category.description || "Esta categoría no posee una descripción técnica registrada en el sistema."}
          </div>
        </DetailCard> */}

        {/* Columna Productos Vinculados */}
        <div className="lg:col-span-2">
          <section className="bg-brand-surface rounded-[2.5rem] p-8 md:p-10 border border-brand-border shadow-sm min-h-[400px]">
            <div className="flex justify-between items-center mb-8 border-b border-brand-border pb-6">
              <h2 className="text-xl font-black text-brand-text uppercase italic tracking-tight">
                Productos en esta Categoría
              </h2>
              <span className="bg-brand-primary text-white text-[10px] font-black px-3 py-1 rounded-lg">
                {products.length} Items
              </span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(prod => (
                  <Link
                    key={prod._id}
                    to={`/admin/productos/detalle/${prod._id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-brand-border hover:border-brand-secondary hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-brand-surface rounded-xl overflow-hidden shrink-0 border border-brand-border">
                      <img
                        src={prod.images?.[0]?.xs || "https://via.placeholder.com/100"}
                        alt="p"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-brand-text group-hover:text-brand-text uppercase leading-tight line-clamp-1">
                        {prod.productName}
                      </span>
                      <span className="text-[9px] font-mono text-brand-text-muted">SKU: {prod.sku || 'S/N'}</span>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-[10px] font-black text-brand-secondary italic">
                        ${prod.priceRetail?.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-[10px] font-black text-brand-text-muted/50 uppercase tracking-widest">No hay productos asignados</p>
                <Link to="/admin/productos/crear" className="text-brand-text text-[9px] font-bold uppercase mt-2 hover:underline">
                  + Empezar a cargar
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* COLUMNA DERECHA: LOGÍSTICA DE SISTEMA */}
      <aside className="lg:col-span-5 space-y-6">
        <DetailCard title="Metadatos de Categoría" dark>
          <InfoRow label="Slug en Sistema" value={`/${category.categorySlug || 'n-a'}`} dark />
          <InfoRow label="Última Sincronización" value={new Date(category.updatedAt).toLocaleDateString()} dark />
          <InfoRow label="Fecha de Registro" value={new Date(category.createdAt).toLocaleDateString()} dark />
        </DetailCard>

        <div className="p-8 bg-linear-to-br from-brand-primary to-[#0f3a55] rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <FiPackage className="absolute -right-4 -bottom-4 text-9xl text-white/5 rotate-12" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Acceso Rápido</h4>
          <p className="text-xs font-bold italic uppercase mb-6 leading-tight">
            ¿Deseas gestionar los productos vinculados a esta categoría?
          </p>
          <Link
            to={`/admin/productos?categoryId=${category._id}`}
            className="inline-block bg-brand-secondary text-white font-black uppercase italic text-[10px] px-8 py-3 rounded-full hover:bg-brand-surface hover:text-brand-text transition-all"
          >
            Ver Inventario Relacionado
          </Link>
        </div>
      </aside>

      {/* BANNER INFERIOR DE ACCIÓN PÚBLICA */}
      <div className="lg:col-span-12 mt-6">
        <Link
          to={`/catalogo?category=${category.categorySlug}`}
          target="_blank"
          className="flex flex-row justify-center items-center gap-4 p-8 w-full bg-brand-primary text-white font-black uppercase italic rounded-[3rem] hover:bg-brand-secondary transition-all group shadow-2xl border border-white/10"
        >
          <span className="tracking-[0.4em] text-xs">Abrir terminal de navegación pública</span>
          <span className="text-xl group-hover:translate-x-4 transition-transform duration-500">📂</span>
        </Link>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={category}
        onRefresh={fetchData}
      />
    </AdminDetailLayout>
  );
};

export default AdminCategoryDetail;
