import { useNavigate } from "react-router";
import { useCategories } from "../hooks/useCategories";

const FALLBACK_CATEGORIES = [
  { _id: "fallback-servicios", categoryName: "Servicios", categorySlug: "servicios" },
  { _id: "fallback-catalogos", categoryName: "Catalogos", categorySlug: "catalogos" },
  { _id: "fallback-tiendas", categoryName: "Tiendas online", categorySlug: "tiendas-online" },
  { _id: "fallback-diseno", categoryName: "Diseno web", categorySlug: "diseno-web" },
];

const CategorySection = ({ isMobile, onNavigate }) => {
  const { data: categories, isLoading, isError } = useCategories();
  const navigate = useNavigate();

  const visibleCategories = (!isLoading && !isError && categories?.length > 0)
    ? categories
    : FALLBACK_CATEGORIES;

  const handleCategoryClick = (cat) => {
    const targetUrl = `/catalogo?category=${cat.categorySlug}`;
    if (onNavigate) {
      onNavigate(targetUrl);
    } else {
      navigate(targetUrl);
    }
  };

  if (!isMobile) {
    return (
      <nav className="hidden md:flex items-center justify-center gap-2 py-2">
        {visibleCategories.slice(0, 6).map((cat) => (
          <button
            type="button"
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.16em] text-brand-primary hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
          >
            {cat.categoryName}
          </button>
        ))}
        <button
          type="button"
          onClick={() => navigate("/catalogo")}
          className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.16em] bg-brand-primary text-white hover:bg-brand-primary-light transition-all cursor-pointer"
        >
          Ver catalogo completo
        </button>
      </nav>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <p className="text-[10px] text-brand-text-muted font-black uppercase tracking-[0.3em] mb-2">
        Categorias
      </p>
      <ul className="space-y-3 font-bold text-brand-text uppercase text-xs tracking-widest">
        {visibleCategories.map((cat) => (
          <li
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className="hover:text-brand-highlight cursor-pointer"
          >
            {cat.categoryName}
          </li>
        ))}
        <li
          onClick={() => onNavigate ? onNavigate("/catalogo") : navigate("/catalogo")}
          className="text-brand-highlight cursor-pointer"
        >
          Ver catalogo completo
        </li>
      </ul>
    </div>
  );
};

export default CategorySection;
