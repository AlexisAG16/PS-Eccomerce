import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../api/axiosConfig";
import ProductCard from "../../components/ProductCard";

const normalizeProductsPayload = (payload) => {
  if (Array.isArray(payload)) return { products: payload, pagination: { total: payload.length } };

  const data = payload?.data;
  if (Array.isArray(data?.data)) return { products: data.data, pagination: data.pagination || { total: data.data.length } };
  if (Array.isArray(data?.products)) return { products: data.products, pagination: { total: data.total || data.products.length } };
  if (Array.isArray(payload?.products)) return { products: payload.products, pagination: { total: payload.total || payload.products.length } };

  return { products: [], pagination: { total: 0 } };
};

const CategoryDetail = () => {
  const { id: categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const categoryTitle = useMemo(() => {
    if (category?.categoryName) return category.categoryName;
    return categorySlug
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "Categoria";
  }, [category, categorySlug]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          api.get("/categories/categories-list"),
          api.get(`/products?category=${encodeURIComponent(categorySlug)}&limit=24&onlyAvailable=true`)
        ]);

        const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.data || [];
        const currentCategory = categories.find((cat) =>
          cat.categorySlug === categorySlug || cat.slug === categorySlug || cat._id === categorySlug
        );
        setCategory(currentCategory || null);

        const { products: fetchedProducts } = normalizeProductsPayload(productsRes.data);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error cargando categoria", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) fetchCategoryProducts();
  }, [categorySlug]);

  return (
    <div className="min-h-screen bg-brand-bg pt-32 md:pt-44 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 border-b border-brand-border pb-8">
          <nav className="text-[11px] text-brand-text-muted uppercase tracking-[0.22em] mb-3">
            Inicio / Categorias / <span className="text-brand-highlight">{categoryTitle}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black text-brand-text uppercase italic tracking-tight">
            Productos de {categoryTitle}
          </h1>
        </header>

        {loading ? (
          <div className="h-72 flex flex-col items-center justify-center">
            <ClipLoader color="#3b82f6" size={46} />
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-brand-text-muted">
              Buscando productos
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {products.map((product) => (
              <ProductCard key={product._id || product.productSlug} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-10 text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-text-muted">
              No se encontraron productos en esta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
