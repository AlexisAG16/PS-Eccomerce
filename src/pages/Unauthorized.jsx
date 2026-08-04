import React from 'react';
import { useNavigate } from "react-router";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col justify-center items-center h-screen w-full bg-gray-50 px-4">
      {/* Icono de candado */}
      <div className="text-6xl mb-6">🔒</div>
      
      <h1 className="text-air-azul text-3xl font-bold text-center">
        Acceso no autorizado
      </h1>
      
      <p className="text-gray-600 mt-4 text-center max-w-md">
        Para ver este contenido, primero debes iniciar sesión en tu cuenta.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button 
          onClick={() => navigate("/login")}
          className="bg-air-naranja text-white px-8 py-3 rounded-2xl hover:bg-opacity-90 transition-all font-bold shadow-md cursor-pointer"
        >
          Ir al Login
        </button>
        
        <button 
          onClick={() => navigate("/")}
          className="border border-air-azul text-air-azul px-8 py-3 rounded-2xl hover:bg-blue-50 transition-all font-bold cursor-pointer"
        >
          Regresar al inicio
        </button>
      </div>
    </section>
  );
};

export default Unauthorized;
