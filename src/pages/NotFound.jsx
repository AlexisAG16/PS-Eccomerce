import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center 
                        bg-gradient-to-br from-[#f4f3ff] via-[#e9e7ff] to-[#dcd9ff]">
      
      {/* 404 */}
      <h1 className="text-[90px] md:text-[120px] font-black leading-none text-black/80">
        404
      </h1>

      {/* Mensaje */}
      <p className="text-lg md:text-xl font-semibold mt-4 tracking-wide text-black/70">
        Página no encontrada
      </p>

      {/* Línea decorativa */}
      <div className="w-16 h-[2px] bg-black/20 mt-4 rounded-full"></div>

    </section>
  );
};

export default NotFound;