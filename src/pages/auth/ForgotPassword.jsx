import React, { useState } from 'react';
import { Link } from 'react-router';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando enlace a:', email);
  };

  return (
    /* FONDO MORADO PASTEL QUE OCUPA TODO */
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#F3EEFF] px-4 overflow-hidden">
      
      {/* --- MARCA DE AGUA "Patrician Software" --- */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none select-none">
        <h1 className="text-air-azul/[0.04] text-[35vw] md:text-[25vw] font-black italic tracking-tighter leading-none uppercase">
          Patrician Software
        </h1>
      </div>

      {/* --- CONTENEDOR SÓLIDO --- */}
      <div className="relative z-10 bg-brand-surface w-full max-w-md rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] p-10 md:p-14 border border-white">
        
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black text-air-azul italic tracking-tighter uppercase leading-none">
            Patrician Software
          </h1>
          <p className="text-[10px] font-bold text-air-azul/40 tracking-[0.4em] uppercase mt-4">
            Recuperar acceso
          </p>
          <div className="w-12 h-[3px] bg-air-azul mx-auto mt-4 rounded-full opacity-20"></div>
        </div>
        
        <p className="text-air-azul/40 text-center mb-8 text-[11px] font-bold leading-relaxed uppercase tracking-widest px-2">
          Introduce tu correo y te enviaremos un enlace para restaurar tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <label className="text-[9px] font-black text-air-azul/30 ml-4 uppercase tracking-[0.2em]">Email de recuperación</label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                className="w-full bg-[#F9F8FF] border border-transparent rounded-2xl px-6 py-4 focus:bg-brand-surface focus:border-air-azul/10 focus:outline-none transition-all text-[13px] font-bold text-air-azul"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-air-azul text-white hover:brightness-110 active:scale-[0.98] transition-all duration-300 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-xl shadow-air-azul/10 mt-2"
          >
            Enviar Enlace
          </button>

          <div className="pt-6 border-t border-brand-border text-center">
            <Link 
              to="/login" 
              className="text-[10px] font-black text-air-azul/40 uppercase tracking-[0.3em] hover:text-air-azul transition-colors italic"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

