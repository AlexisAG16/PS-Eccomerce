import { useEffect } from 'react';
import { FiTag, FiGlobe, FiImage } from 'react-icons/fi';
import { generateSlug } from '../../../helpers/generateSlug';

const BrandFormFields = ({ register, watch, setValue, formState: { errors }, isEditMode }) => {
  const watchedName = watch("name");

  // Auto-slug solo en creación
  useEffect(() => {
    if (!isEditMode && watchedName) {
      setValue("slug", generateSlug(watchedName), { shouldValidate: true });
    }
  }, [watchedName, setValue, isEditMode]);

  return (
    <div className="space-y-8">
      {/* NOMBRE */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre de Marca</label>
        <div className="relative">
          <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            {...register("name", { required: "El nombre es obligatorio" })}
            placeholder="Ej: Samsung"
            className="w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-brand-primary outline-none transition-all font-bold text-gray-700 shadow-sm"
          />
        </div>
        {errors.name && <span className="text-red-500 text-[9px] font-bold uppercase ml-1">{errors.name.message}</span>}
      </div>

      {/* SLUG */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Slug SEO (URL)</label>
        <div className="relative">
          <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            {...register("slug")}
            className="w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 text-brand-secondary font-mono text-xs outline-none shadow-inner"
            readOnly
          />
        </div>
      </div>

      {/* LOGO URL */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL del Logo</label>
        <div className="relative">
          <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            {...register("logo", {
              pattern: {
                value: /^https?:\/\/.+/,
                message: "Debe ser una URL válida (http/https)"
              }
            })}
            placeholder="https://ejemplo.com/logo.png"
            className="w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-brand-primary outline-none transition-all font-bold text-gray-700 text-sm shadow-sm"
          />
        </div>
        {errors.logo && <span className="text-red-500 text-[9px] font-bold uppercase ml-1">{errors.logo.message}</span>}
        <p className="text-[8px] text-gray-400 uppercase italic ml-1">
          Pegue el link del ícono (Wikipedia, oficial, etc.)
        </p>
      </div>
    </div>
  );
};

export default BrandFormFields;