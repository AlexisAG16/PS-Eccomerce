import {
  FiShoppingCart,
  FiPackage,
  FiTruck,
  FiLayers,
  FiPercent,
  FiCreditCard,
  FiUsers,
  FiTag,
  FiActivity,
  FiShield // Para Auditoría
} from 'react-icons/fi';
import { AiFillAppstore } from "react-icons/ai";
import { TbAffiliate, TbBrandApple } from "react-icons/tb";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiNotebook } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";

import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import { QuickLink } from './Button';
import { FaShop } from "react-icons/fa6";

const ACCESOS = [
  // Dashboard principal
  { to: "/admin/dashboard", icon: <AiFillAppstore size={22} className="text-brand-primary" />, label: "Dashboard", p: "read:orders" },

  // Finanzas y Ventas (Verdes/Esmeralda)
  { to: "/admin/ordenes", icon: <FiShoppingCart size={22} className="text-green-600" />, label: "Órdenes", p: "read:orders" },
  { to: "/admin/pagos", icon: <FiCreditCard size={22} className="text-emerald-500" />, label: "Pagos", p: "read:payments" },

  // Logística y Stock (Azules/Celestes)
  { to: "/admin/productos", icon: <FiPackage size={22} className="text-brand-primary" />, label: "Productos", p: "read:products" },
  { to: "/admin/envios", icon: <FiTruck size={22} className="text-sky-500" />, label: "Envíos", p: "read:shippings" },

  // Estructura (Indigo/Rose)
  { to: "/admin/categorias", icon: <FiLayers size={22} className="text-indigo-500" />, label: "Categorías", p: "read:categories" },
  { to: "/admin/marcas", icon: <TbBrandApple size={22} className="text-rose-500" />, label: "Marcas", p: "read:brands" },

  // Marketing (Naranjas/Amarillos)
  { to: "/admin/descuentos", icon: <FiPercent size={22} className="text-amber-500" />, label: "Descuentos", p: "read:discounts" },
  { to: "/admin/cupones", icon: <FiTag size={22} className="text-orange-400" />, label: "Cupones", p: "read:discounts" },
  { to: "/admin/afiliados", icon: <TbAffiliate size={22} className="text-yellow-600" />, label: "Afiliados", p: "read:users" },

  // Usuarios y Gamificación (Violetas)
  { to: "/admin/usuarios", icon: <FiUsers size={22} className="text-violet-500" />, label: "Usuarios", p: "read:users" },
  { to: "/admin/premios", icon: <FaShop size={22} className="text-fuchsia-500" />, label: "Premios", p: "read:rewards" },
  { to: "/admin/minijuegos", icon: <IoGameControllerOutline size={22} className="text-fuchsia-500" />, label: "Juegos", p: "read:games" },

  // Sistema (Grises/Oscuros)
  { to: "/admin/auditoria", icon: <PiNotebook size={22} className="text-slate-500" />, label: "Auditoría", p: "read:users" },

  // Configuración General
  { to: "/admin/config", icon: <IoSettingsOutline size={22} className="text-slate-500" />, label: "Configuración", p: "read:users" }
];

const AccesosDirectosAdmin = () => {
  const { can, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce" />
      <p className="text-[10px] font-black uppercase tracking-widest text-brand-bg">Verificando credenciales...</p>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {ACCESOS.map((link) => (
        can(link.p) && (
          <div key={link.to} className="w-[100px] md:w-[120px] text-center"> {/* Ancho fijo para que sean simétricos */}
            <QuickLink to={link.to} icon={link.icon} label={link.label} />
          </div>
        )
      ))}
    </div>
  );
};

export default AccesosDirectosAdmin;