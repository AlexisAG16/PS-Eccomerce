import { useEffect, useState } from "react";

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const LOGO_SLIDES = [
  {
    src: publicAsset("/logos/cocacola_logo.png"),
    alt: "Coca-Cola",
    title: "Catalogos para marcas de consumo",
    text: "Una estructura visual lista para productos, promociones y compra rapida."
  },
  {
    src: publicAsset("/logos/netflix_logo.png"),
    alt: "Netflix",
    title: "Experiencias digitales",
    text: "Un modelo adaptable para servicios, suscripciones y ofertas online."
  },
  {
    src: publicAsset("/logos/pepsi_logo.png"),
    alt: "Pepsi",
    title: "Tiendas con identidad",
    text: "Colores, logos y productos pueden cambiar sin perder la base del e-commerce."
  },
  {
    src: publicAsset("/logos/electro_logo_hor.png"),
    alt: "Electro Hobby",
    title: "Catalogos tecnicos",
    text: "Ideal para rubros con productos, filtros, stock y detalle comercial."
  },
  {
    src: publicAsset("/logos/grupo_aluminium_logo_hor_white.png"),
    alt: "Grupo Aluminium",
    title: "Presentacion empresarial",
    text: "Una vidriera online para empresas que venden productos o servicios."
  },
  {
    src: publicAsset("/logos/manantial_logo.png"),
    alt: "El Manantial",
    title: "Marcas locales",
    text: "Pensado para negocios que necesitan vender mejor sin perder su identidad."
  },
];

const Flyers = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % LOGO_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? LOGO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % LOGO_SLIDES.length);
  };

  return (
    <section className="w-full bg-transparent pt-0 pb-4 sm:pt-0 sm:pb-10">
      <div className="relative w-full px-0 sm:px-4">
        <div className="w-full sm:max-w-7xl sm:mx-auto">
          <div className="relative w-full h-64 sm:h-72 md:h-96 overflow-hidden sm:rounded-2xl shadow-2xl bg-brand-primary border border-brand-border">
            <div className="absolute inset-0 bg-linear-to-br from-brand-bg via-brand-primary to-brand-primary-light" />

            <div className="absolute top-5 left-5 z-30 hidden sm:flex items-center gap-3">
              <img src={publicAsset("/ps-icon.png")} alt="Patrician Software" className="h-12 w-12 object-contain" />
              <span className="text-[9px] font-black uppercase tracking-[0.24em] text-brand-highlight">
                Modelo visual e-commerce
              </span>
            </div>

            {LOGO_SLIDES.map((item, index) => (
              <div
                key={item.src}
                className={`absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 px-8 md:px-20 pt-8 pb-12 transition-opacity duration-700 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
              >
                <div className="w-full max-w-xs md:max-w-md h-28 md:h-44 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center p-6 shadow-xl">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="max-h-full max-w-full object-contain drop-shadow-xl"
                  />
                </div>

                <div className="text-center md:text-left max-w-lg">
                  <p className="text-brand-highlight text-[10px] font-black uppercase tracking-[0.28em] mb-3">
                    {item.alt}
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-brand-text uppercase tracking-tight">
                    {item.title}
                  </h1>
                  <p className="mt-3 text-sm md:text-base text-brand-text-muted leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full z-30 cursor-pointer"
              aria-label="Anterior"
            >
              {"<"}
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full z-30 cursor-pointer"
              aria-label="Siguiente"
            >
              {">"}
            </button>

            <div className="absolute bottom-4 w-full flex justify-center gap-2 sm:gap-3 z-30">
              {LOGO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Ver slide ${index + 1}`}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${current === index ? "bg-brand-highlight scale-125" : "bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Flyers;
