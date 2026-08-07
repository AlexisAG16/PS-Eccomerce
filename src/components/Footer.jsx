import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import logo from "/ps-logo-white.svg";

const Footer = () => {
  return (
    <>
      <footer className="bg-brand-primary text-brand-text px-6 py-12 border-t border-brand-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-highlight mb-3">
              E-commerce
            </p>
            <p className="text-sm leading-relaxed text-brand-text-muted max-w-md">
              Diseno visual pensado para reutilizarse con el nombre, identidad y catalogo de cada cliente.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-highlight mb-4">
              Redes
            </p>
            <div className="flex md:justify-end gap-5 text-2xl">
              <a href="#" className="text-brand-text hover:text-brand-highlight transition" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="text-brand-text hover:text-brand-highlight transition" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a
                href="https://wa.me/5491122222266"
                target="_blank"
                rel="noreferrer"
                className="text-brand-text hover:text-brand-highlight transition"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-center gap-3">
          <img src={logo} alt="Patrician Software" className="h-8 w-auto object-contain drop-shadow-lg" />
          <p className="text-center text-brand-text-muted text-sm">
            2026 Patrician Software. Todos los derechos reservados.
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
