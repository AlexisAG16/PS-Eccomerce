import React from 'react';
import { useNavigate } from "react-router";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col justify-center items-center h-screen w-full bg-brand-bg px-4 text-brand-text">
      {/* Icono de candado */}
      <div className="text-6xl mb-6">🔒</div>
      
      <h1 className="text-brand-text text-3xl font-bold text-center">
        Acceso no autorizado
      </h1>
      
      <p className="text-brand-text-muted mt-4 text-center max-w-md">
        Para ver este contenido, primero debes iniciar sesión en tu cuenta.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button 
          onClick={() => navigate("/login")}
          className="bg-brand-highlight text-brand-primary px-8 py-3 rounded-2xl hover:bg-brand-text transition-all font-bold shadow-md cursor-pointer"
        >
          Ir al Login
        </button>
        
        <button 
          onClick={() => navigate("/")}
          className="border border-brand-border text-brand-text px-8 py-3 rounded-2xl hover:border-brand-highlight transition-all font-bold cursor-pointer"
        >
          Regresar al inicio
        </button>
      </div>
    </section>
  );
};

export default Unauthorized;
