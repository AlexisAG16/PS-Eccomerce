import { Controller } from 'react-hook-form';
import { FiTag, FiCalendar, FiPercent, FiLayers } from 'react-icons/fi';
import { DatePickerField } from '../helpers/DatePickerField';

const DiscountFormFields = ({ register, watch, formState: { errors }, control, categories }) => {
  const watchedType = watch("discountType");

  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar pb-4">

      {/* IDENTIDAD */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <FiTag className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Campaña</legend>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Nombre del Evento</label>
            <input
              {...register("name", { required: "El nombre es obligatorio" })}
              className="border-2 border-gray-100 rounded-xl p-3 focus:border-brand-primary outline-none font-bold"
              placeholder="Ej: HOT SALE"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Descripción corta</label>
            <input
              {...register("description")}
              className="border-2 border-gray-100 rounded-xl p-3 outline-none"
              placeholder="Ej: Válido para toda la web"
            />
          </div>
        </div>
      </fieldset>

      {/* LÓGICA DE DESCUENTO */}
      <fieldset className="bg-gray-50 p-6 rounded-4xl border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <FiPercent className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Configuración</legend>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Tipo de Descuento</label>
            <select
              {...register("discountType")}
              className="border-2 border-white rounded-xl p-3 bg-white font-bold text-gray-700 outline-none"
            >
              <option value="percentage">Porcentual (%)</option>
              <option value="fixed">Monto Fijo ($)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-gray-400 uppercase ml-1">
              Valor {watchedType === 'percentage' ? '(%)' : '($)'}
            </label>
            <input
              type="number"
              {...register("value", { required: true, min: 1 })}
              className="border-2 border-white rounded-xl p-3 bg-white font-black text-brand-primary outline-none"
            />
          </div>
        </div>
      </fieldset>

      {/* VIGENCIA */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <FiCalendar className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Vigencia</legend>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            {/* <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Fecha Inicio</label> */}
            {/* <input type="date" {...register("startDate", { required: true })} className="border-2 border-gray-100 rounded-xl p-3 outline-none" /> */}
            <Controller
              name="startDate"
              control={control} // Necesitas pasar 'control' a DiscountFormFields
              render={({ field: { onChange, value } }) => (
                <DatePickerField label="Fecha Inicio" value={value} onChange={onChange} />
              )}
            />
          </div>
          <div className="flex flex-col gap-1">
            {/* <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Fecha Fin</label> */}
            {/* <input type="date" {...register("endDate", { required: true })} className="border-2 border-gray-100 rounded-xl p-3 outline-none" /> */}
            <Controller
              name="endDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePickerField label="Fecha Fin" value={value} onChange={onChange} />
              )}
            />
          </div>
        </div>
      </fieldset>

      {/* CATEGORÍAS APLICABLES */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <FiLayers className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Aplicar a Categorías</legend>
        </div>
        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-2xl max-h-32 overflow-y-auto custom-scrollbar">
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" value={cat._id} {...register("applicableCategories")} className="w-4 h-4 rounded text-brand-primary" />
              <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-brand-primary">{cat.categoryName}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* <label className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-2xl cursor-pointer">
        <input type="checkbox" {...register("isActive")} className="w-5 h-5 rounded text-brand-primary" />
        <span className="text-[10px] font-black text-brand-primary uppercase">Campaña Activa inmediatamente</span>
      </label> */}

    </div>
  );
};

export default DiscountFormFields;