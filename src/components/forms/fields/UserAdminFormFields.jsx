import { FiUser, FiShield, FiMapPin, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import MapField from '../helpers/MapField';

const ROLE_LABELS = {
  user: 'Usuario Final / Cliente',
  affiliate: 'Afiliado',
  operator: 'Operador de Staff',
  carrier: 'Logística y Reparto',
  mayorista: 'Cliente Mayorista',
  admin: 'Administrador',
  super_admin: 'Super Administrador'
};

const UserAdminFormFields = ({ register, watch, control, formState: { errors }, roles, isEditMode }) => {
  const coords = watch("address.location.coordinates");
  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar pb-6">
      {/* --- SECCIÓN 1: IDENTIDAD PERSONAL --- */}
      <fieldset className="space-y-5">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiUser className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-highlight uppercase tracking-[0.2em]">Información Personal</legend>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Nombre</label>
            <input
              {...register("firstName", { required: "Campo obligatorio" })}
              className="border-2 border-brand-border rounded-xl p-3 focus:border-brand-highlight outline-none font-bold text-brand-text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Apellido</label>
            <input
              {...register("lastName", { required: "Campo obligatorio" })}
              className="border-2 border-brand-border rounded-xl p-3 focus:border-brand-highlight outline-none font-bold text-brand-text"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">F. Nacimiento</label>
            <input
              type="date"
              {...register("birthDate", { required: "Obligatorio" })}
              className="border-2 border-brand-border rounded-xl p-3 outline-none font-bold text-brand-text"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Género</label>
            <div className="flex gap-4 p-3 bg-brand-surface rounded-xl border border-brand-border">
              {['MASCULINO', 'FEMENINO', 'OTROS'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" value={g} {...register("gender")} className="text-brand-text w-4 h-4" />
                  <span className="text-[10px] font-bold text-brand-text-muted group-hover:text-brand-text">{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      {/* --- SECCIÓN 2: SEGURIDAD Y ROL --- */}
      <fieldset className="space-y-5 bg-brand-surface/50 p-5 rounded-4xl border border-brand-border">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiShield className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-highlight uppercase tracking-[0.2em]">Credenciales y Acceso</legend>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted/50" />
              <input
                type="email"
                {...register("email", { required: "Email obligatorio" })}
                className="w-full border-2 border-white rounded-xl p-3 pl-10 shadow-sm focus:border-brand-highlight outline-none font-bold"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">
              {isEditMode ? "Cambiar Contraseña (opcional)" : "Contraseña"}
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted/50" />
              <input
                type="password"
                {...register("password", { required: !isEditMode })}
                className="w-full border-2 border-white rounded-xl p-3 pl-10 shadow-sm focus:border-brand-highlight outline-none font-bold"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Rol del Sistema</label>
            <select
              {...register("role", { required: "Asigna un rol" })}
              className="border-2 border-white rounded-xl p-3 shadow-sm bg-brand-surface font-black text-brand-text outline-none appearance-none cursor-pointer"
            >
              <option value="">Seleccionar rol...</option>
              {roles.map(r => (
                <option key={r._id} value={r._id}>
                  {/* Aquí aplicamos la traducción */}
                  {(ROLE_LABELS[r.name.toLowerCase()] || r.name).toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isActive")} className="w-5 h-5 rounded text-brand-text" />
              <span className="text-[10px] font-black text-brand-text-muted uppercase">Activo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isVerified")} className="w-5 h-5 rounded text-green-500" />
              <span className="text-[10px] font-black text-brand-text-muted uppercase">Verificado</span>
            </label>
          </div>
        </div>
      </fieldset>

      {/* --- SECCIÓN 3: DIRECCIÓN Y UBICACIÓN --- */}
      <fieldset className="space-y-5">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiMapPin className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-highlight uppercase tracking-[0.2em]">Ubicación y Contacto</legend>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Calle</label>
            <input {...register("address.street")} className="border-2 border-brand-border rounded-xl p-3 font-bold" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Número</label>
            <input {...register("address.number")} className="border-2 border-brand-border rounded-xl p-3 font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Ciudad</label>
            <input {...register("address.city")} className="border-2 border-brand-border rounded-xl p-3 font-bold bg-brand-surface" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Teléfono</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted/50" />
              <input
                {...register("phone")}
                placeholder="+54 9..."
                className="w-full border-2 border-brand-border rounded-xl p-3 pl-10 focus:border-brand-highlight outline-none font-bold"
              />
            </div>
          </div>
        </div>

        {/* --- EL MAPA DE Patrician Software --- */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <label className="text-[10px] font-black text-brand-highlight uppercase tracking-widest">
              Seleccionar Ubicación en Mapa
            </label>
            {coords && coords[0] !== "" && (
              <span className="text-[8px] font-mono text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded-md">
                GPS: {coords[1].toFixed(4)}, {coords[0].toFixed(4)}
              </span>
            )}
          </div>

          <MapField
            control={control}
            name="address.location.coordinates"
            // Si quieres que el mapa empiece en una posición específica cuando es nuevo:
            center={isEditMode && coords?.[1] ? [coords[1], coords[0]] : [-28.4696, -65.7852]}
          />

          <p className="text-[9px] text-brand-text-muted italic px-1">
            * Haz click en el mapa para marcar la ubicación exacta de entrega o residencia.
          </p>
        </div>
      </fieldset>

    </div>
  );
};

export default UserAdminFormFields;
