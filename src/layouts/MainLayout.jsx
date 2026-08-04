import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useEffect, useState } from "react"; 
import { AuthContext } from "../contexts/AuthContext";
import { ClipLoader } from 'react-spinners';
import logo from "/ps-icon.png"
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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#4b5563] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#111827]/35 via-transparent to-[#0b1325]/30" />
        <div className="relative pointer-events-none select-none">
          <img
            src={logo}
            alt="Cargando Patrician Software..."
            className="w-[58vw] md:w-[36vw] max-w-xl h-auto animate-pulse drop-shadow-2xl opacity-95"
          />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-black/25 blur-2xl rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col items-center mt-5">
          <ClipLoader size={86} color="#f8fafc" speedMultiplier={0.7} />
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
