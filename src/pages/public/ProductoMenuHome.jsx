import ProductSection from "../../components/ProductSection";
import Aviso from "../../components/Aviso";
import ContactForm from "../../components/forms/ContactForm";

const Home = () => {
  return (
    <>
      <Aviso />
      <div className="min-h-screen flex flex-col font-sans bg-brand-bg">
        <section className="bg-brand-bg border-b border-brand-border px-4 md:px-8 pt-8 pb-14">
          <div className="max-w-6xl mx-auto">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-brand-text uppercase tracking-tight leading-none">
                Tu tienda, tu marca, nuestro modelo.
              </h1>
              <p className="mt-5 text-sm md:text-base text-brand-text-muted leading-relaxed max-w-2xl">
                Esta plantilla queda lista para que cada cliente consulte por catalogos, productos,
                integraciones o redisenos de e-commerce con identidad propia.
              </p>
            </div>

          </div>
        </section>

        <ProductSection title="Novedades de la semana" endpoint="/products?limit=4&sort=-createdAt" bgColor="bg-brand-bg" />
        <ProductSection title="Visto recientemente" endpoint="/products?limit=4" bgColor="bg-brand-primary" />
        <ProductSection title="Seleccion comercial" endpoint="/products?limit=4" bgColor="bg-brand-bg" />
        <ProductSection title="Catalogo destacado" endpoint="/products?limit=4" bgColor="bg-brand-primary" />

        <section className="bg-brand-bg border-t border-brand-border px-4 md:px-8 py-14">
          <div className="max-w-6xl mx-auto rounded-xl border border-brand-border bg-brand-surface p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-brand-highlight text-[10px] font-black uppercase tracking-[0.28em] mb-2">
                Explorar tienda
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-brand-text uppercase tracking-tight">
                Recorre todos los productos disponibles.
              </h2>
            </div>
            <a
              href="/catalogo"
              className="inline-flex items-center justify-center bg-brand-highlight text-brand-primary font-black uppercase text-xs tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-white transition"
            >
              Ver catalogo completo
            </a>
          </div>
        </section>

        <section className="bg-brand-primary border-t border-brand-border py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
