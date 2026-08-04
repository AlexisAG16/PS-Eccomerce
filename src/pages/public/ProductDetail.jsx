import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../api/axiosConfig";
import useCart from "../../hooks/useCart";
import { toast } from "react-toastify";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cantidad] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/search/${slug}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error al obtener el producto", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAction = (isBuyNow = false) => {
    if (!product || product.stock === 0) return;

    try {
      for (let i = 0; i < cantidad; i++) {
        addItem(product);
      }

      if (isBuyNow) {
        navigate("/checkout");
      } else {
        toast.success(`${product.productName} al carrito`, {
          style: {
            borderRadius: "1rem",
            background: "#111b2f",
            color: "#fff",
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "uppercase",
          },
        });
      }
    } catch (err) {
      toast.error("No se pudo agregar el producto");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-brand-bg">
        <ClipLoader color="#3b82f6" size={50} />
        <p className="mt-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest italic animate-pulse">
          Sincronizando producto...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-bg pt-40 text-center uppercase font-black italic text-brand-text">
        Producto no encontrado
      </div>
    );
  }

  const images = product.images || [];
  const heroImage = images?.[selectedImage]?.original || images?.[selectedImage]?.md || "https://via.placeholder.com/800";
  const categories = product.categoriesId || product.categoriesData || [];
  const price = product.finalPrice || product.priceRetail;
  const hasDiscount = product.finalPrice && product.finalPrice < product.priceRetail;

  return (
    <div className="min-h-screen bg-brand-bg px-4 md:px-8 pt-24 md:pt-[180px] pb-20">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="lg:w-6/12 w-full space-y-4">
            <div className="aspect-square bg-brand-surface rounded-2xl overflow-hidden border border-brand-border flex items-center justify-center p-8 md:p-14 relative shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-brand-accent/10 pointer-events-none" />
              <img
                src={heroImage}
                alt={product.productName}
                className="relative z-10 w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            {images.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 md:w-28 md:h-28 rounded-xl border-2 transition-all p-3 shrink-0 bg-brand-surface cursor-pointer ${
                      selectedImage === idx
                        ? "border-brand-highlight shadow-lg scale-95"
                        : "border-brand-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img.xs || img.md || img.original} alt="preview" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:w-5/12 w-full sticky top-40">
            <div className="bg-brand-surface rounded-2xl p-8 md:p-12 border border-brand-border shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
              {product.brand?.logo ? (
                <img src={product.brand.logo} alt={product.brand.name} className="h-4 object-contain mb-4 grayscale opacity-70 invert" />
              ) : (
                <p className="text-brand-highlight text-[10px] font-black uppercase tracking-[0.24em] mb-3">
                  {product.brand?.name || "Patrician Software"}
                </p>
              )}

              <h1 className="text-4xl md:text-5xl font-black text-brand-text uppercase italic tracking-tighter leading-[0.9] mb-8">
                {product.productName}
              </h1>

              <div className="space-y-8">
                <div className="space-y-2">
                  {hasDiscount ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-brand-text-muted line-through decoration-brand-highlight/50 italic">
                        ${product.priceRetail?.toLocaleString("es-AR")}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-brand-highlight italic tracking-tighter">
                          ${product.finalPrice?.toLocaleString("es-AR")}
                        </span>
                        <span className="bg-brand-highlight text-brand-primary text-[10px] px-2 py-0.5 rounded-md font-black animate-bounce">
                          OFERTA
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-5xl font-black text-brand-text italic tracking-tighter">
                      ${price?.toLocaleString("es-AR")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 p-4 bg-brand-bg rounded-xl border border-brand-border">
                  <div className="text-2xl">!</div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-brand-text-muted leading-none">Despacho</p>
                    <p className="text-xs font-bold text-brand-text">
                      {product.stock > 0 ? "Envio gratis si tu compra supera los $5.000" : "Consultar tiempo de reposicion"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-8 border-y border-brand-border">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-text-muted mb-1">Estado de stock</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                      <p className={`text-xs font-black italic uppercase ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                        {product.stock > 0 ? `${product.stock} unidades listas` : "Sin stock disponible"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <button
                    type="button"
                    onClick={() => handleAction(true)}
                    disabled={!product.isActive || product.stock === 0}
                    className="w-full bg-brand-accent text-white py-5 rounded-xl font-black uppercase italic tracking-[0.15em] shadow-[0_15px_30px_rgba(59,130,246,0.2)] hover:bg-brand-accent-hover transition-all transform active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:grayscale text-sm"
                  >
                    Comprar ahora
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction(false)}
                    disabled={product.stock === 0}
                    className="w-full bg-transparent text-brand-text border-2 border-brand-border py-5 rounded-xl font-black uppercase italic tracking-[0.15em] hover:border-brand-highlight hover:text-brand-highlight transition-all flex items-center justify-center gap-4 active:scale-[0.97] cursor-pointer disabled:opacity-30 text-sm"
                  >
                    <span className="text-xl">+</span> Agregar al carrito
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const url = window.location.href;
                      if (navigator.share) {
                        navigator.share({
                          title: product.productName,
                          text: `Mira este producto en Patrician Software: ${product.productName}`,
                          url,
                        }).catch(() => toast.error("Error al compartir"));
                      } else {
                        navigator.clipboard.writeText(url);
                        toast.info("Enlace copiado al portapapeles");
                      }
                    }}
                    className="w-full bg-brand-bg text-brand-text-muted py-4 rounded-xl font-black uppercase italic tracking-[0.15em] hover:text-brand-highlight transition-all flex items-center justify-center gap-3 active:scale-[0.97] cursor-pointer text-[10px] border border-brand-border"
                  >
                    Compartir producto
                  </button>

                  <div className="flex gap-2 pt-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Mira este producto de Patrician Software: ${product.productName} - ${window.location.href}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366]/10 text-[#25D366] py-4 rounded-xl font-black uppercase italic text-[9px] tracking-widest hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center gap-2 border border-[#25D366]/20"
                    >
                      <FaWhatsapp size={20} />
                    </a>

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#1877F2]/10 text-[#1877F2] py-4 rounded-xl font-black uppercase italic text-[9px] tracking-widest hover:bg-[#1877F2] hover:text-white transition-all flex items-center justify-center gap-2 border border-[#1877F2]/20"
                    >
                      <FaFacebook size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-20">
          <h2 className="text-3xl font-black text-brand-text uppercase italic tracking-tighter mb-10 relative">
            Ficha tecnica
            <span className="absolute -bottom-2 left-0 w-20 h-1.5 bg-brand-highlight rounded-full" />
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 bg-brand-surface rounded-2xl p-8 md:p-12 border border-brand-border shadow-sm">
              <h3 className="font-black text-brand-text uppercase italic text-sm tracking-widest mb-8 border-b border-brand-border pb-4">
                Descripcion del producto
              </h3>
              <p className="text-brand-text-muted leading-relaxed whitespace-pre-line text-sm font-medium">
                {product.description || "Este producto no cuenta con descripcion detallada actualmente."}
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-brand-surface rounded-2xl p-8 md:p-12 text-brand-text shadow-xl shadow-brand-primary/20 border border-brand-border">
                <h3 className="font-black uppercase italic text-xs tracking-[0.2em] mb-10 text-brand-text-muted">
                  Especificaciones clave
                </h3>

                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[10px] font-black uppercase text-brand-text-muted">Modelo / SKU</span>
                    <span className="font-black italic text-sm uppercase">{product.sku || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[10px] font-black uppercase text-brand-text-muted">Peso operativo</span>
                    <span className="font-black italic text-sm uppercase">{product.weight ? `${product.weight} kg` : "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-brand-text-muted block mb-4">Categorias relacionadas</span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Link to={`/catalogo?category=${cat.categorySlug}`} key={cat._id}>
                          <span className="text-[9px] bg-brand-bg text-brand-text px-3 py-1.5 rounded-full font-black uppercase italic backdrop-blur-md border border-brand-border">
                            {cat.categoryName || "Producto"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[10px] font-black uppercase text-brand-text-muted">Dimensiones</span>
                    <span className="font-black italic text-sm uppercase">
                      {product.dimensions?.width || "-"}x{product.dimensions?.height || "-"}x{product.dimensions?.length || "-"} cm
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[8px] bg-brand-bg text-brand-text px-2 py-1 rounded-sm font-bold tracking-widest uppercase border border-brand-border">
                      {product.productType === "PHYSICAL" ? "Producto fisico" : "Servicio digital"}
                    </span>
                  </div>
                  {product.priceWholesale && (
                    <div className="mt-4 p-6 border-2 border-dashed border-white/20 rounded-xl bg-brand-bg">
                      <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-tighter">
                        Precio gremio / mayorista
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-2xl font-black text-brand-highlight italic">
                          ${product.priceWholesale?.toLocaleString("es-AR")}
                        </span>
                        <span className="text-[9px] font-bold bg-brand-highlight text-brand-primary px-3 py-1 rounded-full uppercase">
                          Min. {product.wholesaleMinQty} un.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
