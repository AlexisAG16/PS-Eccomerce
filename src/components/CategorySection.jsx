import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axiosConfig";

const DISPLAY_CATEGORIES = [
  { _id: "fallback-servicios", categoryName: "Servicios", categorySlug: "servicios" },
  { _id: "fallback-catalogos", categoryName: "Catalogos", categorySlug: "catalogos" },
  { _id: "fallback-tiendas", categoryName: "Tiendas online", categorySlug: "tiendas-online" },
  { _id: "fallback-diseno", categoryName: "Diseno web", categorySlug: "diseno-web" },
];

const CategorySection = ({ isMobile, onNavigate }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(DISPLAY_CATEGORIES);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/categories-list");
        const payload = Array.isArray(res.data) ? res.data : res.data?.data;
        if (Array.isArray(payload) && payload.length > 0) {
          setCategories(payload);
        }
      } catch (error) {
        setCategories(DISPLAY_CATEGORIES);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (cat) => {
    const categorySlug = cat.categorySlug || cat.slug || cat._id || cat.id;
    const targetUrl = categorySlug ? `/categoria/${categorySlug}` : "/catalogo";
    if (onNavigate) {
      onNavigate(targetUrl);
    } else {
      navigate(targetUrl);
    }
  };

  if (!isMobile) {
    return (
      <nav className="hidden md:flex items-center justify-center gap-2 py-2">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.16em] text-brand-primary hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
          >
            {cat.categoryName || cat.name || cat.title}
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
        {categories.map((cat) => (
          <li
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className="hover:text-brand-highlight cursor-pointer"
          >
            {cat.categoryName || cat.name || cat.title}
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
