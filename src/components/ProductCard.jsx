import { Link } from 'react-router';
import useCart from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  if (!product) return null;

  const { productName, priceRetail, finalPrice, productSlug, isActive, stock, images } = product;
  const mainImage = images?.[0]?.md || "https://via.placeholder.com/300x300?text=Producto";
  const visiblePrice = finalPrice || priceRetail;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 flex flex-col h-full group">
      <Link to={`/productos/${productSlug}`} className="block relative h-56 bg-brand-primary-soft overflow-hidden">
        <figure className="w-full h-full p-8 flex items-center justify-center">
          <img
            src={mainImage}
            alt={`Producto ${productName}`}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </figure>

        {(!isActive || stock <= 0) && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-brand-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Sin Stock
            </span>
          </div>
        )}
      </Link>

      <div className="bg-brand-primary p-6 mt-auto flex flex-col grow">
        <header>
          <Link to={`/productos/${productSlug}`}>
            <h3 className="text-white font-semibold text-sm mb-4 leading-tight h-10 group-hover:text-brand-accent transition-colors uppercase line-clamp-2">
              {productName}
            </h3>
          </Link>
        </header>

        <footer className="flex justify-between items-end mt-auto">
          <div className="flex flex-col">
            <span className="text-brand-text-muted text-[9px] uppercase font-bold tracking-tighter">Precio</span>
            <span className="text-white text-2xl font-black tracking-tighter leading-none">
              ${visiblePrice?.toLocaleString('es-AR')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isActive || stock <= 0}
            aria-label={`Anadir ${productName} al carrito`}
            className="cursor-pointer bg-brand-accent text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-brand-accent-hover transition-all shadow-lg active:scale-95 group/btn disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="text-2xl font-light group-hover/btn:rotate-90 transition-transform">+</span>
          </button>
        </footer>
      </div>
    </article>
  );
};

export default ProductCard;
