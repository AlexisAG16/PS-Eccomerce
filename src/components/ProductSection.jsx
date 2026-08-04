import api from "../api/axiosConfig";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import VerMasButton from "./BotonDeVerMas";

export default function ProductSection({ title, bgColor, endpoint = "/products?limit=4", slug = "" }) {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoint);
        const items = response.data?.data?.data || response.data?.data || response.data || [];
        const sanitizedItems = Array.isArray(items)
          ? items.filter((p) => p.productName && (p.priceRetail || p.finalPrice))
          : [];

        setProductsData(sanitizedItems.slice(0, 4));
      } catch (error) {
        console.error(`Error en seccion ${title}:`, error);
        setProductsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [endpoint, title]);

  if (loading) return (
    <div className={`py-16 text-center ${bgColor} animate-pulse`}>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-text-muted">
        Cargando {title}...
      </p>
    </div>
  );

  return (
    <section className={`${bgColor} py-10 px-4 md:px-8 transition-all duration-500 border-t border-brand-border`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end border-b border-white/10 pb-3 mb-8">
          <h2 className="text-brand-text font-black uppercase text-sm tracking-widest">
            {title}
          </h2>
          <VerMasButton to={slug ? `/catalogo?category=${slug}` : "/catalogo"} />
        </div>

        {productsData.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 md:grid md:grid-cols-4 md:gap-5 md:pb-0 md:overflow-visible">
            {productsData.map((product) => (
              <div key={product._id} className="min-w-[76%] sm:min-w-[38%] md:min-w-full snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-xl border border-dashed border-brand-border bg-brand-surface/40">
            <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">
              Proximamente novedades en {title}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
