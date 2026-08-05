import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useEffect, useState } from "react"; 
import { AuthContext } from "../contexts/AuthContext";
import { ClipLoader } from 'react-spinners';
import logo from "/ps-logo-white.svg"
// UI Global
import WhatsappIcon from "../components/WhatsappIcon";
import CartIcon from "../components/CartIcon";
import CarritoCompras from "../pages/public/CarritoCompras";
import api from "../api/axiosConfig";

const MainLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/categories-list');
        setCategories(res.data);
        
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  // PANTALLA DE CARGA GIGANTE
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-brand-bg overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-brand-primary/80 via-brand-bg to-brand-primary-light/70" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_45%)]" />
        <div className="relative pointer-events-none select-none">
          <img
            src={logo}
            alt="Cargando Patrician Software..."
            className="w-[64vw] md:w-[34vw] max-w-lg h-auto animate-pulse drop-shadow-2xl opacity-95"
          />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-10 bg-brand-accent/20 blur-2xl rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col items-center mt-5">
          <ClipLoader size={82} color="#f8fafc" speedMultiplier={0.7} />
          <p className='mt-8 text-sm md:text-xl uppercase tracking-[0.55em] text-white/75 font-light'>
            Configurando entorno
          </p>
        </div>
      </div>
    );
  }

  const staffRoles = ['admin', 'operator', 'super_admin', 'carrier', 'affiliate'];
  const userRole = typeof user?.role === 'string' ? user.role : user?.role?.name;
  const isStaff = user && staffRoles.includes(userRole);

  const currentPath = location.pathname;

  const showWhatsapp = !isStaff && currentPath === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🛠️ Eliminamos la prop categories */}
      <Header
        isStaff={isStaff}
        userRole={userRole}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="grow">
        <Outlet />
      </main>

      {/* 🛠️ Eliminamos la prop categories */}
      <Footer />

      {/* ELEMENTOS FLOTANTES */}
      {showWhatsapp && <WhatsappIcon />}
    </div>
  );
};

export default MainLayout;
