import { useEffect } from 'react';
import { FiLayers, FiGlobe } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { generateSlug } from '../../../helpers/generateSlug';

const CategoryFormFields = ({ register, watch, setValue, formState: { errors }, isEditMode }) => {
  const watchedName = watch("categoryName");
  const isActive = watch("isActive");

  // Lógica de Auto-slug (solo en creación)
  useEffect(() => {
    if (!isEditMode && watchedName) {
      setValue("categorySlug", generateSlug(watchedName), { shouldValidate: true });
    }
  }, [watchedName, setValue, isEditMode]);

  return (
    <div className="space-y-8">
      {/* NOMBRE */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest ml-1">Nombre de la Categoría</label>
        <div className="relative">
          <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted/50" />
          <input
            {...register("categoryName", { required: "El nombre es obligatorio" })}
            placeholder="Ej: Repuestos de Motor"
            className="w-full pl-11 pr-4 py-4 border-2 border-brand-border rounded-2xl focus:border-brand-primary outline-none transition-all font-bold text-brand-text shadow-sm"
          />
        </div>
        {errors.categoryName && <span className="text-red-500 text-[9px] font-bold uppercase ml-1">{errors.categoryName.message}</span>}
      </div>

      {/* SLUG */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest ml-1">Slug SEO</label>
        <div className="relative">
          <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted/50" />
          <input
            {...register("categorySlug")}
            className="w-full pl-11 pr-4 py-4 border-2 border-brand-border rounded-2xl bg-brand-surface text-brand-secondary font-mono text-xs outline-none shadow-inner"
            readOnly
          />
        </div>
      </div>

      {/* ESTADO */}
      {/* <div className="bg-brand-surface p-6 rounded-[2.5rem] border border-brand-border shadow-inner flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Estado</span>
          <span className="text-[8px] text-brand-text-muted uppercase">Visible en la web</span>
        </div>

        <input type="checkbox" {...register("isActive")} className="hidden" id="cat-active" />

        <label
          htmlFor="cat-active"
          className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${isActive ? 'bg-brand-primary' : 'bg-brand-border'}`}
        >
          <motion.div
            layout
            animate={{ x: isActive ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-4 h-4 bg-brand-surface rounded-full shadow-sm"
          />
        </label>
      </div> */}
    </div>
  );
};

export default CategoryFormFields;