 const ProductDetail = ({ name, price, image }) => {
    return (
      <div className="bg-brand-surface rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center w-full border border-brand-border">
        {/* Título pequeño en gris */}
        <h3 className="text-brand-text-muted text-[10px] md:text-xs text-center h-10 mb-2 overflow-hidden line-clamp-2">
          {name}
        </h3>
        
        {/* Contenedor de Imagen */}
        <div className="w-full aspect-square flex items-center justify-center mb-3">
          <img 
            src={image} 
            alt={name} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
  
        {/* Precio en violeta Patrician Software */}
        <p className="text-brand-highlight font-bold text-lg md:text-xl self-start">
          $ {price.toLocaleString('es-AR')}
        </p>
      </div>
    );
  };

  export default ProductDetail;
