import { useEffect, useState } from 'react';
import { FiUser, FiCode, FiDollarSign, FiCreditCard, FiSearch } from 'react-icons/fi';
import api from '../../../api/axiosConfig';

const AffiliateFormFields = ({ register, watch, setValue, formState: { errors }, isEditMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usersFound, setUsersFound] = useState([]);
  const [searching, setSearching] = useState(false);

  // Observamos el usuario seleccionado y el método de pago
  const selectedUser = watch("user");
  const paymentType = watch("paymentMethod.type");

  const searchUsers = async () => {
    if (searchTerm.length < 3) return;
    setSearching(true);
    try {
      const res = await api.get(`/users?search=${searchTerm}`);

      // CAMBIO AQUÍ: Accedemos a res.data.data.data para llegar al array
      // Agregamos comprobaciones de seguridad para no romper el código
      const usersArray = res.data?.data?.data || res.data?.data || res.data || [];

      setUsersFound(usersArray);
    } catch (err) {
      console.error("Error buscando usuarios", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar pb-6">

      {/* --- SECCIÓN 1: VÍNCULO CON USUARIO --- */}
      <fieldset className="space-y-5">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiUser className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Usuario Vinculado</legend>
        </div>

        {!isEditMode && !selectedUser ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted/50" />
              <input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-brand-border rounded-xl p-3 pl-10 outline-none focus:border-brand-primary font-bold"
              />
            </div>
            <button
              type="button"
              onClick={searchUsers}
              className="bg-brand-primary text-white px-6 rounded-xl font-black text-[10px] uppercase hover:bg-brand-secondary transition-colors"
            >
              {searching ? '...' : 'Buscar'}
            </button>
          </div>
        ) : null}

        {/* Lista de resultados / Usuario seleccionado */}
        <div className="space-y-2">
          {usersFound.length > 0 && !selectedUser && (
            <div className="bg-brand-surface p-2 rounded-xl border border-brand-border max-h-40 overflow-y-auto">
              {usersFound.map(u => (
                <div
                  key={u._id}
                  onClick={() => setValue("user", u._id)}
                  className="p-2 hover:bg-brand-surface hover:shadow-sm rounded-lg cursor-pointer flex justify-between items-center group transition-all"
                >
                  <span className="text-[11px] font-bold text-brand-text-muted uppercase">{u.firstName} {u.lastName}</span>
                  <span className="text-[9px] font-black text-brand-primary opacity-0 group-hover:opacity-100 italic tracking-tighter">Seleccionar +</span>
                </div>
              ))}
            </div>
          )}

          {(selectedUser || isEditMode) && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">ID Usuario Seleccionado</p>
                <p className="font-mono text-xs font-bold text-emerald-700">{typeof selectedUser === 'object' ? selectedUser._id : selectedUser}</p>
              </div>
              {!isEditMode && (
                <button
                  onClick={() => { setValue("user", null); setUsersFound([]); }}
                  className="text-[9px] font-black text-red-400 uppercase underline"
                >Cambiar</button>
              )}
            </div>
          )}
          <input type="hidden" {...register("user", { required: "Debes vincular un usuario" })} />
        </div>
      </fieldset>

      {/* --- SECCIÓN 2: CONFIGURACIÓN AFILIADO --- */}
      <fieldset className="space-y-5 bg-brand-surface/50 p-5 rounded-4xl border border-brand-border">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiCode className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Configuración de Cuenta</legend>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Código de Afiliado</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted/50 font-bold text-xs">@</span>
              <input
                {...register("affiliateCode", { required: "Campo obligatorio" })}
                placeholder="ej: ofertas2026"
                className="w-full border-2 border-white rounded-xl p-3 pl-8 shadow-sm focus:border-brand-primary outline-none font-bold lowercase"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Comisión Base (%)</label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted/50" />
              <input
                type="number"
                {...register("defaultCommission", { required: "Campo obligatorio" })}
                className="w-full border-2 border-white rounded-xl p-3 pl-10 shadow-sm focus:border-brand-primary outline-none font-bold"
              />
            </div>
          </div>
        </div>
      </fieldset>

      {/* --- SECCIÓN 3: MÉTODO DE PAGO --- */}
      <fieldset className="space-y-5">
        <div className="flex items-center gap-2 border-b border-brand-border pb-2">
          <FiCreditCard className="text-brand-secondary" />
          <legend className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Información de Cobro</legend>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Vía de Pago</label>
            <select
              {...register("paymentMethod.type")}
              className="border-2 border-brand-border rounded-xl p-3 font-bold text-brand-primary outline-none"
            >
              <option value="ALIAS">ALIAS</option>
              <option value="CBU">CBU / CVU</option>
              <option value="MERCADOPAGO">MERCADO PAGO</option>
              <option value="EFECTIVO">EFECTIVO</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Identificador (CBU/Alias/Email)</label>
            <input
              {...register("paymentMethod.identifier", { required: "Dato necesario para pagar" })}
              className="border-2 border-brand-border rounded-xl p-3 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">Titular de Cuenta</label>
            <input {...register("paymentMethod.holderName")} className="border-2 border-brand-border rounded-xl p-3 font-bold" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-brand-text-muted uppercase ml-1">DNI / CUIT Titular</label>
            <input {...register("paymentMethod.holderDocument")} className="border-2 border-brand-border rounded-xl p-3 font-bold" />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default AffiliateFormFields;