import ProductSection from "../../components/ProductSection";
import Flyer from "../../components/Flyer";
import Aviso from "../../components/Aviso";
import ContactForm from "../../components/forms/ContactForm";

const Home = () => {
  return (
    <>
      <Aviso />
      <div className="min-h-screen flex flex-col font-sans bg-brand-bg">
        <div className="w-full px-4 md:px-8">
          <Flyer />
        </div>

        <ProductSection
          title="Novedades de la semana"
          endpoint="/products?limit=4&sort=-createdAt"
          bgColor="bg-brand-bg"
        />

        <ProductSection
          title="Visto recientemente"
          endpoint="/products?limit=4"
          bgColor="bg-brand-primary"
        />

        <ProductSection
          title="Seleccion comercial"
          endpoint="/products?limit=4"
          bgColor="bg-brand-bg"
        />

        <ProductSection
          title="Catalogo destacado"
          endpoint="/products?limit=4"
          bgColor="bg-brand-primary"
        />

        <section className="bg-brand-bg border-t border-brand-border py-16 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              <p className="text-brand-highlight text-[10px] font-black uppercase tracking-[0.28em] mb-3">
                Servicio comercial
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-brand-text uppercase tracking-tight">
                Tu tienda, tu marca, nuestro modelo.
              </h2>
              <p className="mt-4 text-sm md:text-base text-brand-text-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
                Esta seccion queda lista para que cada cliente consulte por catalogos, productos, integraciones o redisenos de e-commerce.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
