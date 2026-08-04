import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../api/axiosConfig";
import useCart from "../../hooks/useCart"; // 👈 Usamos tu hook
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import AdminTitle from "../../components/ui/AdminTitle";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, cart } = useCart(); // 👈 Extraemos addItem y el estado del cart

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cantidad, setCantidad] = useState(1);

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

  // --- MANEJADORES DE ACCIÓN ---

  const handleAction = (isBuyNow = false) => {
    if (!product || product.stock === 0) return;

    try {
      // 1. Agregamos al carrito usando tu lógica existente
      // NOTA: Como tu addItem actual suma de a 1, vamos a ejecutarlo N veces 
      // o podrías considerar refactorizar addItem para aceptar cantidad.
      // Por ahora, para no romper tu hook, lo hacemos así:
      for (let i = 0; i < cantidad; i++) {
        addItem(product);
      }

      if (isBuyNow) {
        // 2. Si es "Comprar Ahora", vamos directo al checkout
        navigate("/checkout");
      } else {
        // 3. Si es solo agregar, feedback visual "Patrician Software Style"
        toast.success(`¡${product.productName} al carrito!`, {
          icon: "🛒",
          style: {
            borderRadius: '1.5rem',
            background: '#1a5276',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }
        });
      }
    } catch (err) {
      toast.error("No se pudo agregar el producto");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <ClipLoader color="#1a5276" size={50} />
        <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic animate-pulse">
          Sincronizando equipo...
        </p>
      </div>
    );
  }

  if (!product) return <div className="pt-40 text-center uppercase font-black italic text-brand-primary">Producto no encontrado</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-6 pt-24 md:pt-[180px] pb-20">
      <div className="flex flex-col lg:flex-row gap-12 items-start">

        {/* COLUMNA IZQUIERDA: GALERÍA */}
        <div className="lg:w-6/12 w-full space-y-4">
          <div className="aspect-square bg-white rounded-[4rem] overflow-hidden border border-gray-100 flex items-center justify-center p-8 md:p-16 relative shadow-inner">
            <img
              src={product.images?.[selectedImage]?.original || "https://via.placeholder.com/800"}
              alt={product.productName}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 md:w-28 md:h-28 rounded-3xl border-2 transition-all p-3 shrink-0 bg-white ${selectedImage === idx
                  ? 'border-brand-secondary shadow-lg scale-95'
                  : 'border-gray-50 opacity-50 hover:opacity-100'
                  }`}
              >
                <img src={img.xs} alt="preview" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: COMPRA */}
        <aside className="lg:w-5/12 w-full sticky top-40">
          <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-gray-50 shadow-[0_20px_50px_rgba(26,82,118,0.08)]">
            {product.brand?.logo ? (
              <img src={product.brand.logo} alt={product.brand.name} className="h-4 object-contain mb-3 grayscale opacity-70" />
            ) : (
              <p className="text-brand-secondary ...">{product.brand?.name || 'Patrician Software'}</p>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-brand-primary uppercase italic tracking-tighter leading-[0.85] mb-8">
              {product.productName}
            </h1>

            <div className="space-y-8">
              <div className="space-y-2">
                {product.finalPrice < product.priceRetail ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 line-through decoration-brand-secondary/50 italic">
                      ${product.priceRetail?.toLocaleString('es-AR')}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-air-naranja italic tracking-tighter">
                        ${product.finalPrice?.toLocaleString('es-AR')}
                      </span>
                      <span className="bg-air-naranja text-white text-[10px] px-2 py-0.5 rounded-md font-black animate-bounce">
                        OFERTA
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-gray-800 italic tracking-tighter">
                      ${product.priceRetail?.toLocaleString('es-AR')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-6 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="text-2xl">⚡</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 leading-none">Despacho</p>
                  <p className="text-xs font-bold text-brand-primary">
                    {product.stock > 0 ? "Envío gratis si tu compra supera los $5.000" : "Consultar tiempo de reposición"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-8 border-y border-gray-100">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Estado de Stock</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <p className={`text-xs font-black italic uppercase ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} Unidades listas` : 'Sin stock disponible'}
                    </p>
                  </div>
                </div>

                {/* <div className="flex flex-col items-end">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-right">Cantidad</label>
                  <select
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value))}
                    className="bg-gray-50 px-6 py-3 rounded-2xl font-black text-brand-primary outline-none border border-gray-100 focus:border-brand-secondary transition-colors cursor-pointer"
                  >
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div> */}
              </div>

              {/* Botones de Acción */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={() => handleAction(true)}
                  disabled={!product.isActive || product.stock === 0}
                  className="w-full bg-brand-primary text-white py-6 rounded-4xl font-black uppercase italic tracking-[0.15em] shadow-[0_15px_30px_rgba(26,82,118,0.2)] hover:bg-[#154360] transition-all transform active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:grayscale text-sm"
                >
                  Comprar Ahora
                </button>

                <button
                  onClick={() => handleAction(false)}
                  disabled={product.stock === 0}
                  className="w-full bg-white text-brand-primary border-2 border-brand-primary py-6 rounded-4xl font-black uppercase italic tracking-[0.15em] hover:bg-gray-50 transition-all flex items-center justify-center gap-4 active:scale-[0.97] cursor-pointer disabled:opacity-30 text-sm"
                >
                  <span className="text-xl">🛒</span> Agregar al Carrito
                </button>

                <button
                  onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator.share({
                        title: product.productName,
                        text: `Mirá este equipo en Patrician Software: ${product.productName}`,
                        url: url,
                      }).catch(() => toast.error("Error al compartir"));
                    } else {
                      navigator.clipboard.writeText(url);
                      toast.info("Enlace copiado al portapapeles 📋", {
                        style: { borderRadius: '1.5rem', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }
                      });
                    }
                  }}
                  className="w-full bg-gray-50 text-gray-400 py-4 rounded-4xl font-black uppercase italic tracking-[0.15em] hover:bg-gray-100 hover:text-brand-primary transition-all flex items-center justify-center gap-3 active:scale-[0.97] cursor-pointer text-[10px]"
                >
                  <span className="text-lg">🔗</span> Compartir Producto
                </button>
                <div className="flex gap-2 pt-2">
                  {/* WhatsApp Directo */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Mirá este equipo de Patrician Software: ${product.productName} - ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366]/10 text-[#25D366] py-4 rounded-3xl font-black uppercase italic text-[9px] tracking-widest hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center gap-2 border border-[#25D366]/20"
                  >
                    {/* 🎯 Ajustamos el tamaño del icono con size={20} */}
                    <FaWhatsapp size={20} />
                  </a>

                  {/* Facebook / Messenger */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#1877F2]/10 text-[#1877F2] py-4 rounded-3xl font-black uppercase italic text-[9px] tracking-widest hover:bg-[#1877F2] hover:text-white transition-all flex items-center justify-center gap-2 border border-[#1877F2]/20"
                  >
                    {/* 🎯 Ajustamos el tamaño del icono con size={20} */}
                    <FaFacebook size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* SECCIÓN DETALLES TÉCNICOS (Ficha Técnica) */}
      <section className="mt-24">
        <h2 className="text-3xl font-black text-brand-primary uppercase italic tracking-tighter mb-10 relative">
          Ficha Técnica
          <span className="absolute -bottom-2 left-0 w-20 h-1.5 bg-brand-secondary rounded-full" />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-sm">
            <h3 className="font-black text-brand-primary uppercase italic text-sm tracking-widest mb-8 border-b border-gray-100 pb-4">
              Descripción del Producto
            </h3>
            <p className="text-gray-500 leading-relaxed whitespace-pre-line text-sm font-medium">
              {product.description || "Este equipo Patrician Software no cuenta con descripción detallada actualmente."}
            </p>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-brand-primary rounded-[3rem] p-10 md:p-12 text-white shadow-xl shadow-brand-primary/20">
              <h3 className="font-black uppercase italic text-xs tracking-[0.2em] mb-10 opacity-60">Especificaciones Clave</h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase opacity-50">Modelo / SKU</span>
                  <span className="font-black italic text-sm uppercase">{product.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase opacity-50">Peso Operativo</span>
                  <span className="font-black italic text-sm uppercase">{product.weight ? `${product.weight} kg` : 'N/A'}</span>
                </div>
                <div className="pt-0">
                  <span className="text-[10px] font-black uppercase opacity-50 block mb-4">Categorías Relacionadas</span>
                  <div className="flex flex-wrap gap-2">
                    {(product.categoriesId || product.categoriesData)?.map(cat => (
                      <Link to={`/catalogo?category=${cat.categorySlug}`} key={cat._id}>
                        <span className="text-[9px] bg-white/10 text-white px-3 py-1.5 rounded-full font-black uppercase italic backdrop-blur-md">
                          {cat.categoryName || "Equipo Patrician Software"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase opacity-50">Dimensiones</span>
                  <span className="font-black italic text-sm uppercase">
                    {product.dimensions?.width}x{product.dimensions?.height}x{product.dimensions?.length} cm
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[8px] bg-brand-primary text-white px-2 py-1 rounded-sm font-bold tracking-widest uppercase">
                    {product.productType === 'PHYSICAL' ? '📦 Equipo Físico' : '🛠️ Servicio Técnico'}
                  </span>
                </div>
                {product.priceWholesale && (
                  <div className="mt-4 p-6 border-2 border-dashed border-white/20 rounded-4xl bg-white/5">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-tighter">
                      Precio Gremio / Mayorista
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-2xl font-black text-brand-secondary italic">
                        ${product.priceWholesale?.toLocaleString('es-AR')}
                      </span>
                      <span className="text-[9px] font-bold bg-white text-brand-primary px-3 py-1 rounded-full uppercase">
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
  );
}
