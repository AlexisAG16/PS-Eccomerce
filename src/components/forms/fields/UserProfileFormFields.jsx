import { FiUser, FiMapPin, FiMail, FiPhone, FiCalendar, FiCompass } from 'react-icons/fi';
import PhoneController from '../helpers/PhoneController';
import PhoneField from './PhoneField';
import MapField from './MapField';

// Recibe todo el objeto de react-hook-form
const UserFormFields = ({ register, control, formState: { errors }, isEditMode }) => {
  return (
    <div className="space-y-10 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar pb-6">

      {/* SECCIÓN IDENTIDAD */}
      <fieldset className="space-y-6">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiUser className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Identidad</legend>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre"
            name="firstName"
            register={register}
            required="Obligatorio"
            errors={errors}
          />
          <Input
            label="Apellido"
            name="lastName"
            register={register}
            required="Obligatorio"
            errors={errors}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest ml-1">Email</label>
            <input
              {...register("email")}
              className="border-2 border-brand-border rounded-2xl p-4 bg-brand-bg text-brand-text-muted font-bold outline-none shadow-sm cursor-not-allowed"
              readOnly
            />
          </div>
          <PhoneField
            control={control}
            name="phone"
            label="Teléfono"
          />
        </div>
      </fieldset>

      {/* SECCIÓN DIRECCIÓN */}
      <fieldset className="space-y-6 bg-brand-surface/50 p-6 rounded-[2.5rem] border border-brand-border">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiMapPin className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Dirección</legend>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input label="Calle" name="address.street" register={register} errors={errors} />
          </div>
          <Input label="Número" name="address.number" register={register} errors={errors} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input label="Ciudad" name="address.city" register={register} errors={errors} />
          <Input label="CP" name="address.postalCode" register={register} errors={errors} />
          <Input label="Alias" name="address.alias" register={register} errors={errors} />
        </div>
      </fieldset>

      {/* SECCIÓN COORDENADAS */}
      <fieldset className="space-y-6">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiCompass className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Ubicación</legend>
        </div>
        <MapField
          control={control}
          name="address.location.coordinates"
        />
      </fieldset>
    </div>
  );
};

// Input Helper para manejar errores visualmente
const Input = ({ label, name, register, required, errors, icon, valueAsNumber, ...props }) => {
  // Función para obtener el error incluso en nombres anidados como "address.street"
  const getError = (name, errors) => {
    return name.split('.').reduce((obj, key) => obj?.[key], errors);
  };

  const error = getError(name, errors);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        {...register(name, { required, valueAsNumber })}
        {...props}
        className={`border-2 rounded-2xl p-4 bg-brand-bg focus:border-brand-secondary outline-none font-bold text-brand-text shadow-sm transition-all ${error ? "border-red-400 shadow-red-500/20" : "border-brand-border"
          }`}
      />
      {error && <span className="text-[8px] text-red-500 font-black uppercase ml-2">{error.message || "Requerido"}</span>}
    </div>
  );
};

export default UserFormFields;