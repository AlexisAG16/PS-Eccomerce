import { useEffect, useState } from 'react';
import { generateSlug } from '../../../helpers/generateSlug';
import { FiPackage, FiTruck, FiDollarSign, FiLayers, FiImage, FiSettings } from 'react-icons/fi';

const ProductFormFields = ({ register, watch, setValue, formState: { errors }, categories, brands, discounts, isEditMode, initialData }) => {
  const watchedName = watch("productName");

  // 1. OBSERVAMOS EL INPUT DE IMÁGENES
  const watchedImages = watch("images");
  const [newImagesPreview, setNewImagesPreview] = useState([]);

  useEffect(() => {
    if (watchedImages && watchedImages instanceof FileList && watchedImages.length > 0) {
      const filesArray = Array.from(watchedImages);
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setNewImagesPreview(previews);

      // Limpieza de memoria al desmontar
      return () => previews.forEach(url => URL.revokeObjectURL(url));
    } else {
      setNewImagesPreview([]);
    }
  }, [watchedImages]);

  useEffect(() => {
    if (!isEditMode && watchedName) {
      setValue("productSlug", generateSlug(watchedName), { shouldValidate: true });
    }
  }, [watchedName, setValue, isEditMode]);

  return (
    <div className="space-y-10 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar pb-6">

      {/* --- SECCIÓN 1: IDENTIDAD --- */}
      <fieldset className="space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <FiPackage className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Identidad del Producto</legend>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
            <input
              {...register("productName", { required: "Obligatorio" })}
              placeholder="Ej: Filtro de Aire Industrial 200XP"
              className="border-2 border-gray-100 rounded-2xl p-4 focus:border-brand-primary outline-none font-bold text-gray-700 shadow-sm placeholder:text-gray-400 placeholder:font-normal"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Producto</label>
            <select
              {...register("productType", { required: true })}
              className="border-2 border-gray-100 rounded-2xl p-4 focus:border-brand-primary outline-none font-bold text-gray-700 shadow-sm bg-white"
            >
              <option value="" disabled>Selecciona el tipo...</option>
              <option value="PHYSICAL">Producto Físico</option>
              <option value="SERVICE">Servicio</option>
              <option value="QUOTE">Presupuesto</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Slug SEO</label>
            <input
              {...register("productSlug")}
              placeholder="generado-automaticamente"
              className="border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 text-brand-secondary font-mono text-xs outline-none placeholder:text-brand-secondary/80"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
            <textarea
              {...register("description")}
              rows="2"
              placeholder="Describe las especificaciones técnicas y compatibilidad del producto..."
              className="border-2 border-gray-100 rounded-2xl p-4 focus:border-brand-primary outline-none font-medium text-gray-600 resize-none placeholder:text-gray-400 placeholder:font-normal"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Descripción (SEO)</label>
            <textarea
              {...register("metaDescription")}
              rows="2"
              placeholder="Resumen para Google (160 caracteres)..."
              className="border-2 border-gray-100 rounded-2xl p-4 focus:border-brand-primary outline-none text-xs"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SKU / Referencia</label>
            <input
              {...register("sku")}
              placeholder="Ej: AT-99234"
              className="border-2 border-gray-100 rounded-2xl p-4 font-mono text-xs focus:border-brand-primary outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </fieldset>

      {/* --- SECCIÓN 2: PRECIOS Y AFILIADOS --- */}
      <fieldset className="space-y-6 bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <FiDollarSign className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Estructura Comercial</legend>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Precio Retail ($)</label>
            <input type="number" step="0.01" {...register("priceRetail", { required: true })} className="border-2 border-white rounded-xl p-3 font-black text-brand-primary shadow-sm outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Precio Mayorista ($)</label>
            <input type="number" step="0.01" {...register("priceWholesale")} className="border-2 border-white rounded-xl p-3 font-bold shadow-sm outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Costo ($)</label>
            <input type="number" step="0.01" {...register("costPrice")} className="border-2 border-white rounded-xl p-3 font-bold shadow-sm outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Compra Mínima</label>
            <input type="number" {...register("minPurchaseQty")} className="border-2 border-white rounded-xl p-3" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Compra Máxima</label>
            <input type="number" {...register("maxPurchaseQty")} className="border-2 border-white rounded-xl p-3" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Puntos al Comprar</label>
            <input type="number" {...register("points")} className="border-2 border-white rounded-xl p-3" />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1">
            Descuento Aplicado (Individual)
          </label>
          <select
            {...register("discountRef")}
            className="border-2 border-gray-50 rounded-xl p-3 outline-none focus:border-brand-secondary font-bold text-gray-600 bg-gray-50/50 text-xs"
          >
            <option value="">Sin descuento específico</option>
            {discounts?.map(d => (
              <option key={d._id} value={d._id}>
                {d.name} — ({d.discountType === 'percentage' ? `${d.value}% OFF` : `$${d.value.toLocaleString()} OFF`})
              </option>
            ))}
          </select>
          <p className="text-[8px] text-gray-400 italic px-1">
            * Si seleccionas un descuento aquí, tendrá prioridad sobre los descuentos por categoría.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("showPrice")} className="w-5 h-5 rounded border-gray-300 text-brand-primary" />
            <span className="text-[10px] font-black text-gray-500 uppercase">Mostrar Precio</span>
          </label>
        </div>
      </fieldset>

      {/* --- SECCIÓN 3: LOGÍSTICA --- */}
      <fieldset className="space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <FiTruck className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Logística y Envío</legend>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Peso (kg)</label>
            <input type="number" step="0.01" {...register("weight")} className="border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Ancho (cm)</label>
            <input type="number" {...register("dimensions.width")} className="border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Alto (cm)</label>
            <input type="number" {...register("dimensions.height")} className="border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Largo (cm)</label>
            <input type="number" {...register("dimensions.length")} className="border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-brand-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Talle / Size</label>
            <input
              type="text"
              {...register("dimensions.size")}
              placeholder="Ej: XL, 42, Único"
              className="border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-brand-primary font-bold text-gray-700"
            />
          </div>
        </div>
      </fieldset>

      {/* --- SECCIÓN 4: STOCK Y CATEGORÍAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Categorías */}
        <fieldset className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <FiLayers className="text-brand-secondary" />
            <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Clasificación</legend>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-3xl border border-gray-100 max-h-40 overflow-y-auto custom-scrollbar">
            {categories.map(cat => (
              <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  value={cat._id}
                  // Importante: No pongas el required en el loop, solo una vez o manejalo por fuera
                  {...register("categoriesId")}
                  className="w-4 h-4 rounded text-brand-primary"
                />
                <span className="text-[9px] font-black text-gray-500 uppercase group-hover:text-brand-primary">
                  {cat.categoryName}
                </span>
              </label>
            ))}
          </div>
          {errors.categoriesId && <p className="text-[8px] text-red-500 font-bold uppercase">{errors.categoriesId.message}</p>}
        </fieldset>
        {/* Marca */}
        <fieldset className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <FiLayers className="text-brand-secondary" />
            <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Marca</legend>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-3xl border border-gray-100 max-h-48 overflow-y-auto custom-scrollbar">

            {/* 🎯 Opción para deseleccionar (Sin Marca) */}
            <label
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer group
      ${!watch("brandId")
                  ? "border-brand-primary bg-white shadow-sm"
                  : "border-transparent bg-white/50 hover:bg-white hover:border-gray-200"
                }`}
            >
              <input
                type="radio"
                value=""
                {...register("brandId")}
                className="absolute opacity-0"
              />

              {/* Círculo indicador vacío */}
              <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center border-2 transition-all
      ${!watch("brandId") ? "border-brand-primary/20 bg-gray-50" : "border-gray-100 bg-gray-50/50"}`}
              >
                <span className="text-[10px] font-black text-gray-400 uppercase">X</span>
              </div>

              <span className={`text-[9px] font-black uppercase tracking-tighter text-center
      ${!watch("brandId") ? "text-brand-primary" : "text-gray-400 group-hover:text-gray-600"}`}>
                Sin Marca
              </span>

              {/* Indicador de seleccionado (Checkmark sutil) */}
              {!watch("brandId") && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-brand-secondary rounded-full animate-pulse" />
              )}
            </label>

            {/* 🏷️ Listado de marcas existentes */}
            {brands.length > 0 ? (
              brands.map((b) => (
                <label
                  key={b._id}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer group
          ${watch("brandId") === b._id
                      ? "border-brand-primary bg-white shadow-sm"
                      : "border-transparent bg-white/50 hover:bg-white hover:border-gray-200"
                    }`}
                >
                  {/* Input de Radio sin la propiedad "required" */}
                  <input
                    type="radio"
                    value={b._id}
                    {...register("brandId")}
                    className="absolute opacity-0"
                  />

                  {/* Logo o Inicial */}
                  <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center overflow-hidden border-2 
          ${watch("brandId") === b._id ? "border-brand-primary/20" : "border-gray-100"}`}
                  >
                    {b.logo ? (
                      <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-black text-gray-300 uppercase">
                        {b.name?.substring(0, 2)}
                      </span>
                    )}
                  </div>

                  <span className={`text-[9px] font-black uppercase tracking-tighter text-center
          ${watch("brandId") === b._id ? "text-brand-primary" : "text-gray-400 group-hover:text-gray-600"}`}>
                    {b.name}
                  </span>

                  {/* Indicador de seleccionado (Checkmark sutil) */}
                  {watch("brandId") === b._id && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-brand-secondary rounded-full animate-pulse" />
                  )}
                </label>
              ))
            ) : (
              <div className="col-span-2 py-4 text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase italic">No hay marcas activas disponibles</p>
              </div>
            )}
          </div>
          {errors.brandId && (
            <p className="text-[8px] text-red-500 font-bold uppercase ml-2">
              {errors.brandId.message}
            </p>
          )}
        </fieldset>

        {/* Stock Control */}
        <fieldset className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <FiSettings className="text-brand-secondary" />
            <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Control de Stock</legend>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-400 uppercase">Stock Actual</label>
              <input type="number" {...register("stock")} className="border-2 border-gray-100 rounded-xl p-3 font-bold" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-400 uppercase">Alerta Stock Bajo</label>
              <input type="number" {...register("lowStockThreshold")} className="border-2 border-gray-100 rounded-xl p-3" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input type="checkbox" {...register("trackStock")} defaultChecked={true} className="w-4 h-4 rounded text-brand-primary" />
              <span className="text-[10px] font-black text-gray-500 uppercase">Controlar Inventario</span>
            </label>
          </div>
        </fieldset>
      </div>

      {/* --- SECCIÓN 5: MULTIMEDIA --- */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <FiImage className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Galería Patrician Software</legend>
        </div>

        <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-4xl border border-gray-100 min-h-[100px] items-center justify-center">

          {/* Muestra imágenes YA EXISTENTES (Edición) */}
          {isEditMode && initialData?.images?.map((img, idx) => (
            <div key={`old-${idx}`} className="relative group">
              <img src={img.xs} className="w-16 h-16 object-cover rounded-2xl border-2 border-white shadow-sm opacity-60" alt="old" />
              <span className="absolute -top-1 -right-1 bg-brand-primary text-[7px] text-white px-1.5 rounded-full font-black uppercase">En DB</span>
            </div>
          ))}

          {/* Muestra PREVIEW DE ARCHIVOS NUEVOS (Lo que se va a subir) */}
          {newImagesPreview.map((url, idx) => (
            <div key={`new-${idx}`} className="relative animate-bounce-subtle">
              <img src={url} className="w-20 h-20 object-cover rounded-2xl border-2 border-brand-secondary shadow-md" alt="new" />
              <span className="absolute -top-1 -right-1 bg-brand-secondary text-[7px] text-white px-1.5 rounded-full font-black uppercase shadow-sm">Nuevo</span>
            </div>
          ))}

          {/* Si no hay nada seleccionado ni existente */}
          {!isEditMode && newImagesPreview.length === 0 && (
            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Sin archivos seleccionados</p>
          )}
        </div>

        <div className="relative group">
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("images", {
              required: !isEditMode ? "El producto debe tener al menos una imagen" : false
            })}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {errors.images && (
            <span className="text-[10px] text-red-500 font-black uppercase mt-2 animate-pulse">
              {errors.images.message}
            </span>
          )}
          <div className="border-2 border-dashed border-gray-200 rounded-4xl p-8 flex flex-col items-center justify-center bg-white group-hover:border-brand-primary group-hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FiImage className="text-brand-primary" />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">
              {isEditMode ? "Reemplazar o añadir fotos" : "Click para subir fotos del producto"}
            </p>
          </div>
        </div>
      </fieldset>

    </div>
  );
};

export default ProductFormFields;
