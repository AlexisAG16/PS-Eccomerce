import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { useNavigate } from "react-router";
import logo from "/ps-logo-t.png";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <>
      <footer className="bg-brand-primary text-brand-text px-6 py-14 border-t border-brand-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <div
              className="cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate("/");
              }}
            >
              <img
                src={logo}
                alt="Logo de tienda"
                className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
              />
            </div>

            <p className="text-sm leading-relaxed text-brand-text-muted max-w-xs">
              Plantilla comercial para catalogos online, productos destacados y experiencia de compra adaptable a distintos rubros.
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                className="p-3 bg-brand-surface rounded-xl hover:bg-brand-accent transition text-brand-text border border-brand-border"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="p-3 bg-brand-surface rounded-xl hover:bg-brand-accent transition text-brand-text border border-brand-border"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-brand-text-muted">
            <h3 className="text-brand-text text-xs font-black uppercase tracking-[0.25em]">Navegacion</h3>
            <button className="text-left hover:text-brand-highlight transition cursor-pointer" onClick={() => navigate("/")}>Inicio</button>
            <button className="text-left hover:text-brand-highlight transition cursor-pointer" onClick={() => navigate("/catalogo")}>Catalogo</button>
            <button className="text-left hover:text-brand-highlight transition cursor-pointer" onClick={() => navigate("/login")}>Login</button>
          </div>

          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-highlight mb-3">E-commerce</p>
            <p className="text-sm leading-relaxed text-brand-text-muted">
              Diseno visual pensado para reutilizarse con el nombre, identidad y catalogo de cada cliente.
            </p>
          </div>
        </div>

        <div className="border-t border-brand-border mt-12 pt-6">
          <p className="text-center text-brand-text-muted text-sm">
            © {new Date().getFullYear()} Catalogo e-commerce. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <a
        href="https://wa.me/5491122222266"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-brand-success text-white p-4 rounded-full shadow-2xl transition duration-300 text-2xl flex items-center justify-center z-50 hover:scale-110"
      >
        <FaWhatsapp />
      </a>
    </>
  );
};

export default Footer;
