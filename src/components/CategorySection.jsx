import { useNavigate } from "react-router"; // 👈 Importado para la navegación autónoma
import { useCategories } from "../hooks/useCategories";

const CategorySection = ({ isMobile, onNavigate }) => {
  // 🛠️ Volamos 'categories' de las props y las consumimos de React Query
  const { data: categories, isLoading, isError } = useCategories();
  const navigate = useNavigate();

  // 1. Validación global: Si está cargando, da error o está vacío, no se muestra nada
  if (isLoading || isError || !categories || categories.length === 0) {
    return null;
  }

  // ⚡ Manejador de navegación híbrido (Evita que rompa en Desktop al no tener onNavigate)
  const handleCategoryClick = (cat) => {
    const targetUrl = `/catalogo?category=${cat.categorySlug}`;
    if (onNavigate) {
      onNavigate(targetUrl); // Ejecuta la función móvil (cierra el menú y navega)
    } else {
      navigate(targetUrl); // Navegación directa en Escritorio
    }
  };

  // 2. Render para Escritorio (Horizontal)
  if (!isMobile) {
    return null;
  }

  // 3. Render para Mobile (Apilada)
  return (
    <div className="mt-4 space-y-4">
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">
        Categorías
      </p>
      <ul className="space-y-3 font-bold text-gray-600 uppercase text-xs tracking-widest">
        {categories.map((cat) => (
          <li
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className="hover:text-[#6c6bc8] cursor-pointer"
          >
            {cat.categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySection;
