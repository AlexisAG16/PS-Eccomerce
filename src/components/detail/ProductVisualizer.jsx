const ProductVisualizer = ({ product, selectedImage, setSelectedImage }) => {
  return (
    <div className="space-y-6">
      {/* VISOR PRINCIPAL */}
      <div className="aspect-video bg-white rounded-[3rem] border border-gray-100 flex items-center justify-center p-12 relative overflow-hidden group">
        {/* BADGES DE ESTADO */}
        <div className="absolute top-6 left-6 flex gap-2 z-10">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase italic ${product.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
            {product.isActive ? 'En Línea' : 'Fuera de Línea'}
          </span>
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase italic">
            {product.productType}
          </span>
        </div>

        {/* IMAGEN PRINCIPAL */}
        {product.images?.length > 0 ? (
          <img
            src={product.images[selectedImage]?.original}
            className="h-full object-contain group-hover:scale-105 transition-transform duration-700"
            alt={product.name}
          />
        ) : (
          <div className="text-gray-300 font-black italic uppercase text-xs">Sin imágenes</div>
        )}
      </div>

      {/* MINIATURAS (THUMBNAILS) */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {product.images?.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`w-20 h-20 flex-shrink-0 rounded-2xl p-2 bg-white border-2 transition-all duration-300 ${selectedImage === idx ? 'border-brand-secondary shadow-md' : 'border-gray-50'
              }`}
          >
            <img src={img.xs} className="w-full h-full object-contain" alt={`Thumbnail ${idx}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductVisualizer;