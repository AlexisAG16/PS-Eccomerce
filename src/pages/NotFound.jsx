import { useNavigate } from "react-router";
import logo from "/ps-logo-tr.svg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-brand-bg">
      <img src={logo} alt="Patrician Software" className="h-20 w-auto object-contain mb-8 opacity-90" />

      <h1 className="text-[90px] md:text-[120px] font-black leading-none text-brand-text">
        404
      </h1>

      <p className="text-lg md:text-xl font-semibold mt-4 tracking-wide text-brand-text-muted">
        Pagina no encontrada
      </p>

      <div className="w-16 h-[2px] bg-brand-highlight mt-4 rounded-full" />

      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-8 bg-brand-highlight text-brand-primary px-6 py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition cursor-pointer"
      >
        Volver al inicio
      </button>
    </section>
  );
};

export default NotFound;
