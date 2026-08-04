import { FiGift, FiSettings, FiTarget, FiAlertCircle } from 'react-icons/fi';

const RewardFormFields = ({ register, watch, formState: { errors }, categories }) => {
  const discountType = watch("config.discountType");

  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar pb-6">

      {/* SECCIÓN 1: IDENTIDAD Y COSTO */}
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 flex items-center gap-2 border-b border-gray-100 pb-2">
          <FiGift className="text-brand-primary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Configuración del Premio</legend>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título Público</label>
          <input
            {...register("title", { required: "El título es obligatorio" })}
            placeholder="Ej: 20% OFF en toda la tienda"
            className="border-2 border-gray-100 rounded-2xl p-4 focus:border-brand-primary outline-none font-bold text-gray-700 shadow-sm"
          />
          {errors.title && <span className="text-[9px] text-red-500 font-bold ml-2">{errors.title.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Costo (Puntos)</label>
          <input
            type="number"
            {...register("pointsCost", { required: true, min: 0 })}
            className="border-2 border-gray-100 rounded-2xl p-4 font-black text-brand-primary text-xl outline-none focus:border-brand-primary shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Disponible</label>
          <input
            type="number"
            {...register("stock", { required: true })}
            placeholder="-1 para infinito"
            className="border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-600 outline-none focus:border-brand-primary shadow-sm"
          />
          <p className="text-[8px] text-gray-400 italic ml-1">Usa -1 para stock ilimitado.</p>
        </div>
      </fieldset>

      {/* SECCIÓN 2: EL "ADN" DEL CUPÓN (CONFIG) */}
      <fieldset className="space-y-6 bg-brand-surface p-6 rounded-[2.5rem] border border-gray-100">
        <div className="flex items-center gap-2 border-b border-gray-200/50 pb-2">
          <FiSettings className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.2em]">ADN del Cupón Generado</legend>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Tipo de Beneficio</label>
            <select
              {...register("config.discountType")}
              className="border-2 border-white rounded-xl p-3 font-bold text-gray-700 shadow-sm outline-none focus:border-brand-secondary bg-white"
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto Fijo ($)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">
              Valor del {discountType === 'percentage' ? 'Descuento (%)' : 'Monto ($)'}
            </label>
            <input
              type="number"
              step="0.01"
              {...register("config.value", { required: true, min: 1 })}
              className="border-2 border-white rounded-xl p-3 font-black text-brand-secondary shadow-sm outline-none focus:border-brand-secondary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Compra Mínima Requerida ($)</label>
            <input
              type="number"
              {...register("config.minOrderAmount")}
              className="border-2 border-white rounded-xl p-3 font-medium outline-none focus:border-brand-secondary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-400 uppercase">Mínimo de Ítems</label>
            <input
              type="number"
              {...register("config.minItems")}
              className="border-2 border-white rounded-xl p-3 font-medium outline-none focus:border-brand-secondary"
            />
          </div>
        </div>
      </fieldset>

      {/* SECCIÓN 3: RESTRICCIONES */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <FiTarget className="text-brand-primary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Restricciones de Uso</legend>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Limitar a Categoría</label>
          <select
            {...register("config.categoryRestriction")}
            className="border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-600 outline-none focus:border-brand-primary bg-white shadow-sm"
          >
            <option value="">Aplica a toda la tienda</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start">
          <FiAlertCircle className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-[9px] text-blue-700 font-medium leading-relaxed">
            <span className="font-black uppercase">Nota Técnica:</span> Al canjear este premio, el sistema creará automáticamente un cupón con validez de 30 días, exclusivo para el usuario que realizó el canje y con un único uso permitido.
          </p>
        </div>
      </fieldset>

      {/* Toggle de Activo */}
      <div className="pt-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input type="checkbox" {...register("isActive")} className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
          </div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Premio Visible en la tienda</span>
        </label>
      </div>
    </div>
  );
};

export default RewardFormFields;