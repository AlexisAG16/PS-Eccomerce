import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { IoMdMenu } from "react-icons/io";
import { VscChromeClose } from "react-icons/vsc";
import { FiLogIn, FiUser } from "react-icons/fi";
import { AiFillAppstore } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import CarritoCompras from "../pages/public/CarritoCompras";
import CategorySection from "./CategorySection";
import api from "../api/axiosConfig";
import CartIcon from "./CartIcon";
import logo from "/ps-logo-white.svg";

const Header = ({ isStaff, userRole }) => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const searchRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/products?limit=7&search=${query}`);
        setResults(res.data?.data?.data || []);
        setShowResults(true);
      } catch (error) {
        console.error("Error busqueda:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current?.contains(e.target)) return;
      setShowResults(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getManagementPath = () => {
    switch (userRole) {
      case "admin":
      case "operator":
      case "super_admin":
        return "/admin/dashboard";
      case "affiliate":
        return "/admin/afiliados";
      case "carrier":
        return "/admin/envios";
      default:
        return "/mi-perfil";
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <div className="relative shadow-2xl group">
          <div className="absolute inset-0 bg-linear-to-r from-brand-bg via-brand-primary to-brand-primary-light" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-brand-accent/60 to-transparent" />

          <div className="max-w-7xl mx-auto flex items-center px-4 py-3 md:py-3 relative z-30">
            <div
              className="relative cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95"
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                alt="Logo de tienda"
                className="h-12 md:h-16 w-auto object-contain drop-shadow-lg"
              />
            </div>

            <div ref={searchRef} className="hidden md:block flex-1 mx-8 relative z-50">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Busca productos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  className="w-full px-4 py-2.5 rounded-full bg-white/95 outline-none text-brand-primary placeholder:text-slate-400 focus:ring-2 focus:ring-brand-accent/50"
                />

                {showResults && query && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-xl mt-2 max-h-80 overflow-y-auto z-100 border border-gray-100">
                    {loading && <p className="p-4 text-sm text-gray-500">Buscando...</p>}
                    {!loading && results.length === 0 && <p className="p-4 text-sm text-gray-500">Sin resultados</p>}
                    {!loading && results.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => {
                          setShowResults(false);
                          setQuery("");
                          navigate(`/productos/${p.productSlug}`);
                        }}
                        className="p-3 hover:bg-gray-100 flex gap-3 items-center cursor-pointer"
                      >
                        <img
                          src={p.images?.[0]?.xs || "/no-image.png"}
                          alt={p.productName}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{p.productName}</p>
                          {p.showPrice && <p className="text-xs text-gray-500 font-medium">${p.priceRetail.toLocaleString()}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 pointer-events-none transition-colors" />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10 backdrop-blur-sm">
                {!user ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 cursor-pointer text-white px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover rounded-full transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-950/20"
                  >
                    <FiLogIn size={18} />
                    Login
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    {isStaff && (
                      <button
                        onClick={() => navigate(getManagementPath())}
                        className="cursor-pointer text-white p-2.5 hover:bg-white/20 rounded-full transition-all"
                        title="Panel de Gestion"
                      >
                        <AiFillAppstore size={20} />
                      </button>
                    )}

                    <button
                      onClick={() => navigate("/mi-perfil")}
                      className="flex items-center gap-2 cursor-pointer text-white p-2.5 hover:bg-white/20 rounded-full transition-all group"
                      title="Mi Perfil"
                    >
                      <FiUser size={20} />
                      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[10px] uppercase font-black tracking-tighter">
                        {user.firstName}
                      </span>
                    </button>

                    <div className="w-px h-4 bg-white/20 mx-1" />

                    <button
                      onClick={logout}
                      className="cursor-pointer text-white p-2.5 hover:bg-red-500/30 rounded-full transition-all"
                      title="Cerrar Sesion"
                    >
                      <CiLogout size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="ml-2">
                <CartIcon onOpen={() => setOpenCart(true)} />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto md:hidden">
              <button
                onClick={() => navigate(user ? "/mi-perfil" : "/login")}
                className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-full text-white text-xl active:scale-90 transition-transform"
              >
                {user ? <FiUser /> : <FiLogIn />}
              </button>

              <CartIcon onOpen={() => setOpenCart(true)} />

              <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 flex items-center justify-center bg-white/20 border border-white/30 rounded-full text-white text-2xl"
              >
                {open ? <VscChromeClose /> : <IoMdMenu />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-brand-highlight border-y border-brand-primary/10">
          <div className="max-w-7xl mx-auto px-2 md:px-4">
            <CategorySection />
          </div>
        </div>

        <div className="relative md:hidden">
          <div
            className={`absolute top-0 left-0 w-full bg-brand-primary shadow-lg rounded-b-2xl px-6 z-40 transition-all duration-300 ${open ? "opacity-100 visible py-6" : "opacity-0 invisible pointer-events-none py-0"}`}
          >
            <input
              type="text"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              className="w-full px-4 py-2 rounded-full bg-white text-brand-primary"
            />

            {showResults && query && (
              <div className="absolute top-full left-0 w-full bg-white shadow rounded-xl mt-2 max-h-80 overflow-y-auto">
                {loading && <p className="p-3 text-sm">Buscando...</p>}
                {!loading && results.map((p) => (
                  <Link
                    onClick={(e) => e.stopPropagation()}
                    key={p._id}
                    to={`/productos/${p.productSlug}`}
                    className="p-3 flex gap-2 cursor-pointer hover:bg-gray-100"
                  >
                    <img src={p.images?.[0]?.xs || "/no-image.png"} className="w-8 h-8 rounded" alt={p.productName} />
                    <p className="text-sm text-brand-primary">{p.productName}</p>
                  </Link>
                ))}
              </div>
            )}

            <div className="flex flex-col">
              <CategorySection isMobile={true} onNavigate={handleNavigation} />

              <p className="text-[10px] text-brand-text-muted font-black uppercase tracking-[0.3em] mt-6 mb-4">Navegacion</p>
              <ul className="space-y-4 font-bold text-brand-text uppercase text-xs tracking-widest">
                <li onClick={() => handleNavigation(user ? "/mis-ordenes" : "/login")}>Mis ordenes</li>

                {isStaff && (
                  <li onClick={() => handleNavigation(getManagementPath())} className="text-brand-accent">
                    Panel de {userRole === "carrier" ? "Envios" : userRole === "affiliate" ? "Afiliados" : "Administracion"}
                  </li>
                )}

                {user ? (
                  <li onClick={logout} className="text-red-400">Cerrar Sesion</li>
                ) : (
                  <li onClick={() => handleNavigation("/login")}>Login</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </header>

      <CarritoCompras isOpen={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
};

export default Header;
