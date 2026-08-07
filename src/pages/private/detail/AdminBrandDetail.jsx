import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import MetricItem from "../../../components/detail/MetricItem";
import DetailCard from "../../../components/detail/DetailCard";
import InfoRow from "../../../components/detail/InfoRow";
import { EditButton, StatusToggleButton } from "../../../components/ui/Button";
import { FiAward, FiPackage, FiLink, FiHash, FiExternalLink } from "react-icons/fi";
import BrandModal from "../../../components/forms/BrandForm";

const AdminBrandDetail = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Si tienes modal de edición

  const fetchBrandData = async () => {
    setLoading(true);
    try {
      const brandRes = await api.get(`/brands/${id}`);
      setBrand(brandRes.data.data);

      const prodRes = await api.get(`/products?brandId=${id}&limit=100`);
      setProducts(prodRes.data.data.data || []);
    } catch (error) {
      toast.error("Error al obtener datos de la marca");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandData();
  }, [id]);

  const toggleStatus = async () => {
    try {
      const newStatus = !brand.isActive;
      await api.patch(`/brands/${id}`, { isActive: newStatus });
      setBrand({ ...brand, isActive: newStatus });
      toast.info(`Marca ${newStatus ? 'Activada' : 'Desactivada'}`);
    } catch (err) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <ClipLoader color="#1a5276" size={50} />
      <p className="mt-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest italic animate-pulse">Sincronizando Identidad de Marca...</p>
    </div>
  );

  if (!brand) return <div className="pt-40 text-center uppercase font-black italic text-brand-text">Marca no encontrada</div>;

  const headerActions = (
    <div className="flex gap-3">
      <EditButton onClick={() => setIsModalOpen(true)} />
      <StatusToggleButton isActive={brand.isActive} onToggle={toggleStatus} />
    </div>
  );

  return (
    <>
      <AdminDetailLayout
        title={brand.name}
        subtitle="Expediente de Identidad Corporativa"
        headerActions={headerActions}
      >
        {/* MÉTRICAS DE MARCA */}
        <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <MetricItem
            label="Productos Vinculados"
            value={products.length}
            icon={FiPackage}
            colorClass="text-brand-text"
          />
          <MetricItem
            label="Estado de Marca"
            value={brand.isActive ? "Activa" : "Inactiva"}
            icon={FiAward}
            colorClass={brand.isActive ? "text-green-500" : "text-red-500"}
          />
          <MetricItem
            label="Slug de Sistema"
            value={brand.slug}
            icon={FiLink}
            colorClass="text-brand-secondary"
          />
          <MetricItem
            label="ID Corto"
            value={id.slice(-6).toUpperCase()}
            icon={FiHash}
            colorClass="text-brand-text-muted"
          />
        </div>

        {/* COLUMNA IZQUIERDA: LOGO Y INFO */}
        <main className="lg:col-span-4 space-y-6">
          <div className="bg-brand-surface rounded-[3.5rem] p-12 border border-brand-border shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-brand-primary to-brand-secondary" />
            <div className="w-48 h-48 bg-brand-surface rounded-[2.5rem] border border-brand-border flex items-center justify-center overflow-hidden p-6 transition-transform duration-500 group-hover:scale-105">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-6xl font-black text-gray-200">{brand.name.charAt(0)}</span>
              )}
            </div>
            <p className="mt-8 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.3em]">Logo Oficial</p>
          </div>

          <DetailCard title="Parámetros de Identidad" dark>
            <InfoRow label="Ruta de Recurso" value={brand.logo ? "Asignada" : "Pendiente"} dark />
            <InfoRow label="Fecha de Registro" value={new Date(brand.createdAt).toLocaleDateString()} dark />
            <div className="mt-6">
              <a
                href={brand.logo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-4 bg-brand-surface/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase italic hover:bg-brand-surface/10 transition-all"
              >
                <FiExternalLink /> Abrir CDN del Logo
              </a>
            </div>
          </DetailCard>
        </main>

        {/* COLUMNA DERECHA: CATÁLOGO RELACIONADO */}
        <aside className="lg:col-span-8">
          <DetailCard title={`Catálogo Vinculado: ${brand.name}`}>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map(prod => {
                  console.log("Estructura de imagen:", prod.images);
                  return (
                    <Link
                      key={prod._id}
                      to={`/admin/productos/detalle/${prod._id}`}
                      className="flex items-center gap-4 p-4 rounded-4xl border border-brand-border hover:border-brand-secondary hover:shadow-lg transition-all group bg-brand-surface"
                    >
                      <div className="w-16 h-16 bg-brand-surface rounded-2xl overflow-hidden shrink-0 border border-brand-border p-2">
                        <img
                          // Usamos 'md' para que la página cargue rápido, o 'original' si querés máxima calidad
                          src={prod.images?.[0]?.md || prod.images?.[0]?.original || "https://via.placeholder.com/100"}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-brand-text uppercase leading-tight line-clamp-1">
                          {prod.name}
                        </span>
                        <span className="text-[9px] font-bold text-brand-text-muted uppercase tracking-tighter">SKU: {prod.sku || 'N/A'}</span>
                        <span className="text-sm font-black text-brand-secondary italic mt-1">
                          ${prod.priceRetail?.toLocaleString()}
                        </span>
                      </div>
                      <div className="ml-auto p-2 bg-brand-surface rounded-full group-hover:bg-brand-secondary/10 transition-colors">
                        <FiExternalLink className="text-brand-text-muted/50 group-hover:text-brand-secondary" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-brand-surface rounded-[2.5rem] border border-dashed border-brand-border">
                <FiPackage className="text-5xl text-gray-200 mb-4" />
                <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Sin productos asociados</p>
              </div>
            )}
          </DetailCard>
        </aside>
      </AdminDetailLayout>
      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brandToEdit={brand} // Pasamos el objeto brand actual
        onRefresh={fetchBrandData} // Volvemos a pedir los datos a la API al guardar
      />
    </>
  );
};

export default AdminBrandDetail;
