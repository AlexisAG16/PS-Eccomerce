import { useState } from "react";
import { Link } from "react-router";
import api from "../../api/axiosConfig";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Instrucciones enviadas a tu correo");
    } catch (err) {
      toast.error("Hubo un problema. Intenta más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-brand-surface px-4 overflow-hidden">
      
      {/* MARCA DE AGUA */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none select-none">
        <h1 className="text-brand-text/5 text-[35vw] md:text-[25vw] font-black italic tracking-tighter leading-none uppercase">
          Patrician Software
        </h1>
      </div>

      {/* CONTENEDOR */}
      <div className="relative z-10 bg-brand-surface w-full max-w-md rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.25)] p-10 md:p-14 border border-brand-border">
        
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black text-brand-text italic tracking-tighter uppercase leading-none">
            Patrician Software
          </h1>
          <p className="text-[10px] font-bold text-brand-text-muted tracking-[0.4em] uppercase mt-4">
            Recuperar acceso
          </p>
          <div className="w-12 h-[3px] bg-brand-highlight mx-auto mt-4 rounded-full"></div>
        </div>

        {!sent ? (
          <>
            <p className="text-brand-text-muted text-center mb-8 text-[11px] font-bold leading-relaxed uppercase tracking-widest px-4">
              Ingresa tu correo y te enviaremos el enlace de restauración.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <label className="text-[9px] font-black text-brand-highlight ml-4 uppercase tracking-[0.2em]">
                  Email de contacto
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border-2 border-brand-border rounded-2xl px-6 py-4 focus:border-brand-highlight focus:outline-none transition-all text-[13px] font-bold text-brand-text placeholder:text-brand-text-muted shadow-sm"
                  />
                  <FaEnvelope className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-highlight transition-colors" />
                </div>
              </div>

              {/* BOTÓN */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full bg-brand-primary text-brand-text hover:bg-brand-accent active:scale-[0.96] transition-all duration-300 py-6 rounded-3xl font-black text-[13px] uppercase tracking-[0.5em] shadow-[0_20px_50px_rgba(0,0,0,0.25)] mt-4 flex justify-center items-center cursor-pointer overflow-hidden border border-brand-border"
              >
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                
                {isSubmitting ? (
                  <ClipLoader size={18} color="#fff" />
                ) : (
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                    Enviar Enlace
                  </span>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="bg-green-500/15 p-8 rounded-3xl border border-green-400 shadow-inner">
              <p className="text-[13px] font-black text-green-300 uppercase tracking-widest">
                ¡Enviado!
              </p>
            </div>
            <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.2em] leading-relaxed">
              Revisa tu correo para completar el proceso.
            </p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-brand-border text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.3em] hover:text-brand-highlight transition-all italic"
          >
            <FaArrowLeft size={10} /> Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
