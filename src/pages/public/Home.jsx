import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import imagenAire from '../../assets/imagen de aire.jpeg';
import { useNavigate } from 'react-router';
import CategoryComponent from '../../components/CategoryComponents';
import Logo from "/color dark.svg";
import TextCarousel from '../../components/ui/TextCarousel';
import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

const Home = () => {
  const navigate = useNavigate();
  const [featuredData, setFeaturedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/products/featured-by-category');
        setFeaturedData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="font-sans text-brand-primary bg-brand-bg">
      <section className="relative min-h-screen flex items-center justify-center text-center px-5 overflow-hidden sm:pt-10">
        <div
          className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-position-[center_20%]"
          style={{ backgroundImage: `url(${imagenAire})` }}
        />
        <div className="absolute inset-0 bg-brand-bg/80 z-10" />
        <div className="absolute inset-0 bg-linear-to-b from-brand-bg/20 via-brand-primary/40 to-brand-bg z-20" />

        <div className="relative max-w-3xl z-30 flex flex-col items-center">
          <img src={Logo} className="sm:flex h-50 w-full sm:h-24 lg:h-40 md:h-50 hide-on-landscape drop-shadow-2xl" alt="Logo de tienda" id="logo" />
          <p className="mt-6 text-brand-text-muted text-xs md:text-sm font-bold uppercase tracking-[0.32em]">
            Catalogo online adaptable para tiendas y servicios
          </p>
          <TextCarousel />
          <button
            type="button"
            onClick={() => navigate('/catalogo')}
            className="mt-8 bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.18em] shadow-xl shadow-blue-950/30 transition-all active:scale-95 cursor-pointer"
          >
            Ver catalogo
          </button>
        </div>
      </section>

      {featuredData.map((item) => (
        <CategoryComponent
          key={item.categoria}
          titulo={item.categoria}
          slug={item.slug}
          colorFondo="bg-brand-bg"
          productos={item.productos}
        />
      ))}

      <section className="py-20 px-5 bg-brand-primary border-t border-brand-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div
            id="contacto"
            className="bg-brand-surface p-6 md:p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-auto lg:mx-0 w-full border border-brand-border scroll-mt-40"
          >
            <h2 className="text-lg font-black tracking-[0.2em] text-brand-text mb-1 uppercase">
              Contactanos
            </h2>

            <div className="w-8 h-1 bg-brand-highlight mx-auto mb-6 rounded-full shadow-sm" />

            <form className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="NOMBRE"
                className="w-full bg-brand-primary-soft py-2.5 px-4 rounded-xl text-[15px] font-bold outline-none focus:ring-1 focus:ring-brand-accent placeholder-slate-400 text-brand-primary"
                required
              />

              <input
                type="email"
                placeholder="EMAIL"
                className="w-full bg-brand-primary-soft py-2.5 px-4 rounded-xl text-[15px] font-bold outline-none focus:ring-1 focus:ring-brand-accent placeholder-slate-400 text-brand-primary"
                required
              />

              <textarea
                placeholder="MENSAJE"
                className="w-full bg-brand-primary-soft py-2.5 px-4 rounded-xl text-[15px] font-bold h-20 resize-none outline-none focus:ring-1 focus:ring-brand-accent placeholder-slate-400 text-brand-primary"
                required
              ></textarea>

              <button
                type="submit"
                className="mt-1 w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-black py-3 rounded-xl shadow-lg transition-all active:scale-95 text-[10px] uppercase cursor-pointer"
              >
                Enviar
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-black text-brand-text mb-4 tracking-tight uppercase">
                Canales <span className="text-brand-highlight">comerciales</span>
              </h2>

              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-3.5 bg-brand-surface rounded-xl hover:bg-brand-accent hover:text-white transition-all text-brand-text-muted shadow-sm border border-brand-border"
                >
                  <FaFacebookF size={16} />
                </a>

                <a
                  href="#"
                  className="p-3.5 bg-brand-surface rounded-xl hover:bg-brand-accent hover:text-white transition-all text-brand-text-muted shadow-sm border border-brand-border"
                >
                  <FaInstagram size={16} />
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-border min-h-72 shadow-lg relative bg-brand-surface p-8 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-highlight mb-3">
                Modelo e-commerce
              </p>
              <h3 className="text-3xl font-black text-brand-text leading-tight">
                Catalogo flexible para productos, servicios y ventas online.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-brand-text-muted">
                Una base visual pensada para que cada cliente pueda adaptar nombre, rubro, colores secundarios y contenido comercial sin perder una experiencia clara de compra.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
