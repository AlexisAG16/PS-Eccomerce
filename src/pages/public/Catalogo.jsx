import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../api/axiosConfig";
import ProductCard from "../../components/ProductCard";
import FiltrosCatalogo from "../../components/FiltrosCatalogo";
import PaginacionCatalogo from "../../components/ui/PaginacionCatalogo";

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState(searchParams.get("search") || "");
  const [precioMin, setPrecioMin] = useState(searchParams.get("minPrice") || "");
  const [precioMax, setPrecioMax] = useState(searchParams.get("maxPrice") || "");
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState(
    searchParams.get("brands") ? searchParams.get("brands").split(",") : []
  );
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    searchParams.get("category") || ""
  );
  const currentPage = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get(`/categories/categories-list`),
          api.get(`/brands/brands-list`)
        ]);

        setCategories(catRes.data || []);
        const brandsData = brandRes.data.data || brandRes.data || [];
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      } catch (error) {
        console.error("Error cargando filtros:", error);
      } finally {
        // Sin cambios visuales pendientes para este estado.
      }
    };
    fetchMasterData();
  }, []);

  const fetchProductos = async (params) => {
    setLoading(true);
    try {
      const response = await api.get(`/products?limit=15&${params.toString()}`);
      const result = response.data?.data || {};

      setProductos(result.data || []);
      setPagination(result.pagination || { total: 0 });
    } catch (error) {
      console.error("Error cargando catalogo", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (busqueda) params.set("search", busqueda);
    if (precioMin) params.set("minPrice", precioMin);
    if (precioMax) params.set("maxPrice", precioMax);
    if (marcasSeleccionadas.length > 0) params.set("brands", marcasSeleccionadas.join(","));
    if (categoriaSeleccionada) params.set("category", categoriaSeleccionada);

    params.set("page", currentPage);

    setSearchParams(params, { replace: true });

    const delayDebounceFn = setTimeout(() => {
      fetchProductos(params);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda, precioMin, precioMax, marcasSeleccionadas, categoriaSeleccionada, currentPage, setSearchParams]);

  const handlePageChange = (newPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", newPage);
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMarca = (brand) => {
    const brandSlug = brand.slug;

    setMarcasSeleccionadas(prev => {
      return prev.includes(brandSlug) ? [] : [brandSlug];
    });

    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", "1");
    setSearchParams(currentParams);
  };

  const toggleCategoria = (c) => {
    const valor = c.categorySlug || c._id;
    setCategoriaSeleccionada(prev => (prev === valor ? "" : valor));
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", "1");
    setSearchParams(currentParams);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setMarcasSeleccionadas([]);
    setCategoriaSeleccionada("");
    setPrecioMin("");
    setPrecioMax("");
    setSearchParams({ page: "1" });
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32">
      <div className="max-w-[1440px] mx-auto px-2 md:px-6 md:pt-10 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-brand-border pb-6">
          <div>
            <nav className="text-[12px] text-brand-text-muted uppercase tracking-[0.2em] mb-2">Inicio / Catalogo</nav>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-brand-text uppercase tracking-tighter">Explorar</h1>
              <button onClick={limpiarFiltros} className="bg-brand-accent text-white px-4 py-1 rounded-full text-base font-bold uppercase shadow-md hover:bg-brand-accent-hover hover:scale-105 transition-all">
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <FiltrosCatalogo
            busqueda={busqueda} setBusqueda={setBusqueda}
            precioMin={precioMin} setPrecioMin={setPrecioMin}
            precioMax={precioMax} setPrecioMax={setPrecioMax}
            categories={categories}
            categoriaSeleccionada={categoriaSeleccionada} toggleCategoria={toggleCategoria}
            marcasList={brands}
            marcasSeleccionadas={marcasSeleccionadas}
            toggleMarca={toggleMarca}
            limpiarFiltros={limpiarFiltros}
          />

          <main className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 opacity-80">
                <ClipLoader color="#3b82f6" size={40} />
                <p className="mt-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Sincronizando catalogo...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {productos.length > 0 ? (
                    productos.map((p) => <ProductCard key={p._id} product={p} />)
                  ) : (
                    <p className="col-span-full text-center py-10 text-brand-text-muted uppercase text-xs font-bold tracking-widest">No se encontraron productos</p>
                  )}
                </div>

                <PaginacionCatalogo
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
