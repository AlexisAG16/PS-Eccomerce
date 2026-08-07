import { FiTag, FiCalendar, FiPercent, FiLayers, FiBox, FiTrendingUp, FiShield } from 'react-icons/fi';

const CouponFormFields = ({ register, watch, categories, products }) => {
  const watchedType = watch("discountType");

  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar pb-4">
      {/* IDENTIDAD */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiTag className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-highlight uppercase tracking-[0.2em]">Datos del Cupón</legend>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Código (Ej: VERANO20)</label>
            <input {...register("code", { required: true })} className="border-2 border-brand-border rounded-xl p-3 uppercase font-black" placeholder="CÓDIGO" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Límite de usos (total)</label>
            <input type="number" {...register("usageLimit")} className="border-2 border-brand-border rounded-xl p-3" placeholder="Sin límite" />
          </div>
        </div>
      </fieldset>
      
      {/* VIGENCIA */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiCalendar className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-highlight uppercase tracking-[0.2em]">Vigencia del Cupón</legend>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Fecha Inicio</label>
            <input
              type="date"
              {...register("startDate", { required: "Campo requerido" })}
              className="border-2 border-brand-border rounded-xl p-3 outline-none focus:border-brand-highlight"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Fecha Fin</label>
            <input
              type="date"
              {...register("endDate", { required: "Campo requerido" })}
              className="border-2 border-brand-border rounded-xl p-3 outline-none focus:border-brand-highlight"
            />
          </div>
        </div>
      </fieldset>

      {/* CONFIGURACIÓN */}
      <fieldset className="bg-brand-surface p-6 rounded-4xl border border-brand-border space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiPercent className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-highlight uppercase tracking-[0.2em]">Configuración</legend>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Tipo</label>
            <select {...register("discountType")} className="border-2 border-white rounded-xl p-3 bg-brand-surface font-bold text-brand-text outline-none">
              <option value="percentage">Porcentual (%)</option>
              <option value="fixed">Monto Fijo ($)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Valor</label>
            <input type="number" {...register("value", { required: true })} className="border-2 border-white rounded-xl p-3 bg-brand-surface font-black text-brand-text outline-none" />
          </div>
        </div>
      </fieldset>

      {/* 🔥 NUEVA SECCIÓN: REGLAS Y SEGURIDAD DINERARIA */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiShield className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-highlight uppercase tracking-[0.2em]">Condiciones y Límites</legend>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Usos permitidos por cliente</label>
            <input type="number" defaultValue={1} {...register("usagePerUser")} className="border-2 border-brand-border rounded-xl p-3" placeholder="Ej: 1" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Monto de compra mínima ($)</label>
            <input type="number" {...register("minOrderAmount")} className="border-2 border-brand-border rounded-xl p-3" placeholder="Ej: 5000" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Mínimo de ítems en carrito</label>
            <input type="number" {...register("minItems")} className="border-2 border-brand-border rounded-xl p-3" placeholder="Ej: 2" />
          </div>
          {/* Condicional: Solo mostrar tope de descuento si el tipo es porcentual */}
          {watchedType === "percentage" && (
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-red-400 uppercase ml-1">Tope máximo de descuento ($)</label>
              <input type="number" {...register("maxDiscountAmount")} className="border-2 border-red-100 focus:border-red-300 rounded-xl p-3 bg-red-50/30" placeholder="Ej: 3000" />
            </div>
          )}
        </div>
      </fieldset>

      {/* RESTRICCIONES */}
      <fieldset className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-border pb-2">
            <FiLayers className="text-brand-secondary" />
            <legend className="text-[11px] font-black text-brand-highlight uppercase tracking-[0.2em]">Categorías</legend>
          </div>
          <div className="h-32 overflow-y-auto bg-brand-surface p-2 rounded-xl text-[10px]">
            {categories.map(c => <label key={c._id} className="flex gap-2 p-1"><input type="checkbox" value={c._id} {...register("applicableCategories")} /> {c.categoryName}</label>)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-border pb-2">
            <FiBox className="text-brand-secondary" />
            <legend className="text-[11px] font-black text-brand-highlight uppercase tracking-[0.2em]">Productos</legend>
          </div>
          <div className="h-32 overflow-y-auto bg-brand-surface p-2 rounded-xl text-[10px]">
            {products.map(p => <label key={p._id} className="flex gap-2 p-1"><input type="checkbox" value={p._id} {...register("applicableProducts")} /> {p.productName}</label>)}
          </div>
        </div>
      </fieldset>
    </div>
  );
};
export default CouponFormFields;
