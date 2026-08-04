import { useState } from "react";
import {
  FaUser, FaLock, FaEnvelope, FaCalendarAlt, FaVenusMars,
  FaHome, FaHashtag, FaCity, FaMapMarkerAlt, FaPhone
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import MapField from "./forms/fields/MapField";
import PhoneField from "./forms/fields/PhoneField";
import Swal from "sweetalert2";
import api from "../api/axiosConfig";
import { Turnstile } from "@marsidev/react-turnstile";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captcha_key = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      gender: "MASCULINO",
      address: {
        alias: "Casa",
        city: "San Fernando del Valle de Catamarca",
        location: {
          // Inicializamos con las coordenadas por defecto de Catamarca
          coordinates: [-65.7852, -28.4696]
        }
      }
    }
  });

  // 🛰️ Escuchamos las coordenadas en tiempo real para mostrarlas en el badge
  const coords = watch("address.location.coordinates");

  const onSubmit = async (data) => {
    if (!captchaToken) {
      setError("Por favor, completa la verificación de seguridad.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const payload = {
        ...data,
        captchaToken,
        address: {
          ...data.address,
          location: {
            type: "Point",
            coordinates: data.address.location.coordinates.map(Number),
          },
        },
      };

      await api.post("/auth/signup", payload);

      await Swal.fire({
        icon: 'success',
        title: '<span style="font-family: sans-serif; font-weight: 900; font-style: italic; text-transform: uppercase;">REGISTRO EXITOSO</span>',
        text: 'Tu cuenta ha sido creada. Revisa tu email para confirmar tu cuenta.',
        confirmButtonColor: '#6c6bc8',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'font-black uppercase italic tracking-widest text-[10px] py-3 px-6 rounded-full'
        }
      });

      navigate("/");
    } catch (err) {
      console.error("Error al registrar:", err);
      setError(err.response?.data?.message || "Ocurrió un error al registrar el usuario");
      setCaptchaToken(null);

      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: err.response?.data?.message || 'No pudimos registrarte. Intenta nuevamente.',
        confirmButtonColor: '#d33',
        customClass: { popup: 'rounded-[2rem]' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen pt-28 flex items-start md:items-center justify-center bg-gray-300 px-4 py-8">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <h2 className="text-gray-400 text-xs font-black uppercase tracking-widest">¡Únete a Patrician Software!</h2>
            <h1 className="text-3xl font-bold text-[#6c6bc8]">Registro de Usuario</h1>
          </div>

          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* --- SECCIÓN 1: INFORMACIÓN PERSONAL --- */}
            <fieldset className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <FaUser className="text-[#6c6bc8]" />
                <legend className="text-[11px] font-black text-[#6c6bc8] uppercase tracking-[0.2em]">Información Personal</legend>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input {...register("firstName", { required: true })} placeholder="Nombre..." className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold text-gray-700" />
                  <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="relative">
                  <input {...register("lastName", { required: true })} placeholder="Apellido..." className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold text-gray-700" />
                  <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input type="date" {...register("birthDate", { required: true })} className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold text-gray-700" />
                  <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                <div className="relative">
                  <select {...register("gender", { required: true })} className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold text-gray-700 appearance-none cursor-pointer">
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTROS">Otros</option>
                  </select>
                  <FaVenusMars className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </fieldset>

            {/* --- SECCIÓN 2: CUENTA Y CONTACTO --- */}
            <fieldset className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <FaLock className="text-[#6c6bc8]" />
                <legend className="text-[11px] font-black text-[#6c6bc8] uppercase tracking-[0.2em]">Credenciales de Acceso</legend>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input type="email" {...register("email", { required: true })} placeholder="Email..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold" />
                  <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="relative">
                  <input type="password" {...register("password", { required: true })} placeholder="Contraseña..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold" />
                  <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="w-full bg-white rounded-xl border border-gray-200 p-1">
                <PhoneField control={control} name="phone" label="Teléfono de Contacto" />
              </div>
            </fieldset>

            {/* --- SECCIÓN 3: DIRECCIÓN DE ENTREGA Y MAPA --- */}
            <fieldset className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <FaMapMarkerAlt className="text-[#6c6bc8]" />
                <legend className="text-[11px] font-black text-[#6c6bc8] uppercase tracking-[0.2em]">Dirección de Envío</legend>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <input {...register("address.street", { required: true })} placeholder="Calle..." className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold" />
                  <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="relative">
                  <input {...register("address.number", { required: true })} placeholder="Número..." className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold" />
                  <FaHashtag className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <input {...register("address.apartment")} placeholder="Depto / Piso (Opcional)..." className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold" />
                  <FaHome className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="relative">
                  <input {...register("address.city", { required: true })} placeholder="Ciudad..." className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold" />
                  <FaCity className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="relative">
                  <input {...register("address.postalCode", { required: true })} placeholder="Cód. Postal..." className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6c6bc8] font-bold" />
                  <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* --- MAPFIELD INTEGRADO CON EL BADGE GPS --- */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-[#6c6bc8] uppercase tracking-widest">
                    Ubicación exacta en el mapa
                  </label>
                  {coords && coords[0] !== "" && (
                    <span className="text-[9px] font-mono font-bold text-[#6c6bc8] bg-[#6c6bc8]/10 px-2.5 py-1 rounded-md">
                      GPS: {Number(coords[1]).toFixed(5)}, {Number(coords[0]).toFixed(5)}
                    </span>
                  )}
                </div>

                <MapField
                  control={control}
                  name="address.location.coordinates"
                  center={[-28.4696, -65.7852]} // Por defecto arranca en San Fernando del Valle de Catamarca
                />

                <p className="text-[10px] text-gray-400 italic px-1">
                  * Haz clic en el mapa para marcar el punto exacto donde nuestro repartidor debe dejar tu pedido.
                </p>
              </div>
            </fieldset>

            {/* --- SECCIÓN 4: SEGURIDAD Y ENVÍO --- */}
            <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-100">
              <Turnstile
                siteKey={captcha_key}
                onSuccess={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
              />

              <button
                disabled={loading || !captchaToken}
                className={`w-full bg-[#6c6bc8] hover:bg-[#5a59b8] transition duration-300 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-xs shadow-md ${(!captchaToken || loading) && "opacity-50 cursor-not-allowed"
                  }`}
              >
                {loading ? "Procesando Registro..." : "Crear Mi Cuenta"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
