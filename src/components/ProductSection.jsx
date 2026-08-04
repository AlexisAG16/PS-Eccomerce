import api from "../api/axiosConfig";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import VerMasButton from "./BotonDeVerMas"; // Importamos para consistencia

export default function ProductSection({ title, bgColor, endpoint = "/products?limit=4", slug = "" }) {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoint);

        // 1. Extracción segura (Soporta data.data.data o data.data)
        const items = response.data?.data?.data || response.data?.data || response.data || [];

        // 2. Limpieza de datos: Solo productos con nombre y precio válido
        const sanitizedItems = Array.isArray(items)
          ? items.filter(p => p.productName && (p.priceRetail || p.finalPrice))
          : [];

        setProductsData(sanitizedItems.slice(0, 4));
      } catch (error) {
        console.error(`Error en sección ${title}:`, error);
        setProductsData([]); // Evita que quede undefined
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [endpoint]);

  // Skeleton o Loading con el mismo estilo de fondo
  if (loading) return (
    <div className={`py-16 text-center ${bgColor} animate-pulse`}>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Cargando {title}...</p>
    </div>
  );

  return (
    <section className={`${bgColor} py-10 px-0 md:px-4 transition-all duration-500 border-t border-brand-border`}>
      <div className="max-w-7xl mx-auto">

        {/* Header con botón "Ver Más" como en CategoryComponent */}
        <div className="flex justify-between items-end border-b border-white/10 pb-3 mb-8">
          <h2 className="text-brand-text px-2 font-black uppercase text-sm tracking-widest">
            {title}
          </h2>
          {slug && <VerMasButton to={`/catalogo?category=${slug}`} />}
        </div>

        {/* 3. Renderizado Condicional (Empty State) */}
        {productsData.length > 0 ? (
          <div className="
    /* Móvil: Scroll horizontal */
    flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 
    /* Escritorio: Volvemos a la grilla */
    md:grid md:grid-cols-4 md:gap-6 md:pb-0 md:overflow-visible
  ">
            {productsData.map((product) => (
              <div
                key={product._id}
                className="
          /* Definimos un ancho fijo en móvil para que 'sobrepase' la pantalla */
          min-w-[80%] sm:min-w-[40%] md:min-w-full 
          snap-start
        "
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          /* Fallback */
          <div className="py-20 text-center rounded-3xl border-2 border-dashed border-black/5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Próximamente novedades en {title}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
