import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import logo from "/ps-icon.png";
import { Turnstile } from "@marsidev/react-turnstile";

const Login = () => {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, loading: authLoading } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const captcha_key = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Por favor, completa la verificacion de seguridad.");
      return;
    }

    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(formData), captchaToken };

    try {
      const response = await api.post("/auth/signin", data);
      const userData = response.data.user || response.data;
      login(userData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Error al conectar con el servidor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center py-12 px-4 overflow-hidden bg-[#4b5563]">
      <div className="absolute inset-0 bg-linear-to-b from-[#111827]/45 via-transparent to-[#0b1325]/40" />

      <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none select-none z-0">
        <img
          src={logo}
          alt="Patrician Software"
          className="w-[62vw] max-w-none opacity-10"
        />
      </div>

      <div className="relative z-10 w-full max-w-md md:max-w-lg min-h-[420px] rounded-[2.5rem] p-6 md:p-10 bg-brand-surface/90 backdrop-blur-xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-6 text-center">
          <img src={logo} alt="Patrician Software" className="h-24 w-auto mx-auto mb-5 object-contain" />
          <h1 className="text-[10px] font-bold text-brand-text tracking-[0.3em] uppercase mt-3">
            Inicia sesion
          </h1>
          <div className="w-10 h-[2px] bg-brand-highlight mx-auto mt-3 rounded-full opacity-80" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-200 py-2 px-3 rounded-xl text-[10px] text-center font-bold uppercase tracking-widest border border-red-500/20">
              {error}
            </div>
          )}

          <div className="relative group">
            <label className="text-[9px] font-black text-brand-text-muted ml-3 uppercase tracking-[0.2em]">
              Email
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                required
                disabled={isSubmitting}
                className="w-full bg-brand-bg border-2 border-brand-border rounded-xl px-5 py-3 focus:border-brand-accent focus:outline-none transition-all text-[13px] font-bold text-brand-text placeholder:text-brand-text-muted"
              />
              <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-accent transition-colors" />
            </div>
          </div>

          <div className="relative group">
            <label className="text-[9px] font-black text-brand-text-muted ml-3 uppercase tracking-[0.2em]">
              Contrasena
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                required
                disabled={isSubmitting}
                className="w-full bg-brand-bg border-2 border-brand-border rounded-xl px-5 py-3 focus:border-brand-accent focus:outline-none transition-all text-[13px] font-bold text-brand-text placeholder:text-brand-text-muted"
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-accent transition-colors p-1"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div className="text-right pr-1">
            <Link
              to="/forgot-password"
              className="text-[9px] font-black text-brand-text-muted uppercase tracking-widest hover:text-brand-highlight transition-colors"
            >
              Olvidaste tu contrasena?
            </Link>
          </div>

          <div className="flex justify-center my-4">
            <Turnstile
              siteKey={captcha_key}
              onSuccess={(token) => setCaptchaToken(token)}
            />
          </div>

          <button
            type="submit"
            disabled={!captchaToken || isSubmitting}
            className="w-full bg-brand-accent text-white hover:bg-brand-accent-hover active:scale-[0.97] transition-all duration-300 py-4 rounded-2xl font-black text-[13px] uppercase tracking-[0.3em] shadow-[0_15px_40px_rgba(59,130,246,0.25)] mt-2 cursor-pointer"
          >
            {isSubmitting ? "CONECTANDO..." : "INGRESAR"}
          </button>

          <div className="pt-5 border-t border-white/10 text-center">
            <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">
              No tienes cuenta?
              <Link
                to="/register"
                className="text-brand-highlight font-black hover:underline ml-1 transition-colors"
              >
                Registrate
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
