import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import api from "../../api/axiosConfig";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Las contraseñas no coinciden");
    if (password.length < 6) return toast.error("Mínimo 6 caracteres");

    setLoading(true);
    try {
      // Llamada al endpoint que ya tenés (ajustado a JSON)
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success("¡Contraseña actualizada con éxito!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "El enlace expiró o es inválido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-air-crema flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-4xl shadow-2xl p-10 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Patrician Software" className="w-32 mb-6" />
          <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Nueva Contraseña</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2 text-center">Ingresa tu nueva clave de acceso para Patrician Software</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-4 mb-2 block">Nueva Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-air-azul transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-4 mb-2 block">Confirmar Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-air-azul transition-all"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-air-azul text-white py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? <ClipLoader size={18} color="#fff" /> : "Actualizar Contraseña"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-[10px] font-black text-gray-400 uppercase hover:text-air-azul transition-colors">
            Volver al Inicio de Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
