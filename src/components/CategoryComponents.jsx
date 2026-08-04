import { Link } from "react-router";
import VerMasButton from "./BotonDeVerMas";

const CategoryComponent = ({ titulo, slug, colorFondo = "bg-brand-primary", productos = [] }) => {
  return (
    <section className={`py-8 px-3 sm:px-4 md:px-6 ${colorFondo} transition-colors duration-500 border-t border-brand-border`}>
      <div className="max-w-[1050px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight uppercase">
            {titulo}
          </h2>
          {/* Ajustamos el link para que vaya a la categoría específica si querés */}
          <VerMasButton to={`/catalogo?category=${slug}`} />
        </div>

        {/* Grilla de Productos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {productos.length > 0 ? (
            productos.map((prod) => (
              <Link
                key={prod._id}
                // Cambiamos a la ruta dinámica usando el slug
                to={`/productos/${prod.productSlug}`}
                className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer no-underline border border-slate-200"
              // El no-underline es para evitar que el navegador le ponga azul al texto por ser un link
              >
                {/* Contenedor Imagen */}
                <div className="aspect-square bg-brand-primary-soft flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={prod.images?.[0]?.md || "/placeholder-product.png"}
                    alt={prod.productName}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Info Box (Footer oscuro) */}
                <div className="bg-brand-primary p-3 flex flex-col justify-between grow">
                  <h3 className="text-white text-center text-[10px] sm:text-[11px] md:text-xs leading-tight font-medium line-clamp-2 h-8">
                    {prod.productName}
                  </h3>

                  <div className="mt-3">
                    <p className="text-brand-highlight text-center text-base sm:text-lg md:text-xl font-extrabold tracking-tighter">
                      ${Number(prod.finalPrice || prod.priceRetail).toLocaleString("es-AR")}
                    </p>
                    <span className="block text-[8px] text-gray-400 text-center uppercase tracking-widest mt-1">
                      IVA Incluido
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Skeleton o Empty state simple
            <div className="col-span-full py-10 text-center text-white/50 italic text-sm">
              Cargando productos de {titulo}...
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryComponent;
