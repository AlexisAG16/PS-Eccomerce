import { useNavigate } from "react-router";
import logo from "/ps-logo-white.svg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-brand-bg text-brand-text relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-brand-primary/50 via-brand-bg to-brand-primary-light/40" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_45%)]" />

      <div className="relative z-10 flex flex-col items-center">
        <img src={logo} alt="Patrician Software" className="h-28 w-auto object-contain mb-8 opacity-100 drop-shadow-2xl" />

        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-brand-highlight mb-4">
          Patrician Software
        </p>

        <h1 className="text-[100px] md:text-[140px] font-black leading-none text-brand-text italic tracking-tighter">
          404
        </h1>

        <p className="text-lg md:text-xl font-bold mt-4 tracking-wide text-brand-text">
          Página no encontrada
        </p>

        <p className="max-w-md text-xs md:text-sm text-brand-text-muted font-bold uppercase tracking-widest leading-relaxed mt-3">
          El enlace no existe o fue movido dentro del catálogo.
        </p>

        <div className="w-16 h-[3px] bg-brand-highlight mt-6 rounded-full" />

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 bg-brand-highlight text-brand-primary px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-brand-text transition cursor-pointer shadow-xl shadow-brand-highlight/20"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  );
};

export default NotFound;
