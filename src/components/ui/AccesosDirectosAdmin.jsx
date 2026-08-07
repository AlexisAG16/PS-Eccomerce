import {
  FiShoppingCart,
  FiPackage,
  FiTruck,
  FiLayers,
  FiPercent,
  FiCreditCard,
  FiUsers,
  FiTag,
} from 'react-icons/fi';
import { AiFillAppstore } from "react-icons/ai";
import { TbAffiliate, TbBrandApple } from "react-icons/tb";
import { IoGameControllerOutline, IoSettingsOutline } from "react-icons/io5";
import { PiNotebook } from "react-icons/pi";
import { FaShop } from "react-icons/fa6";
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { QuickLink } from './Button';

const ACCESOS = [
  { to: "/admin/dashboard", icon: <AiFillAppstore size={22} className="text-white" />, label: "Dashboard", p: "read:orders" },
  { to: "/admin/ordenes", icon: <FiShoppingCart size={22} className="text-green-500" />, label: "Ordenes", p: "read:orders" },
  { to: "/admin/pagos", icon: <FiCreditCard size={22} className="text-emerald-400" />, label: "Pagos", p: "read:payments" },
  { to: "/admin/productos", icon: <FiPackage size={22} className="text-brand-highlight" />, label: "Productos", p: "read:products" },
  { to: "/admin/envios", icon: <FiTruck size={22} className="text-sky-400" />, label: "Envios", p: "read:shippings" },
  { to: "/admin/categorias", icon: <FiLayers size={22} className="text-indigo-400" />, label: "Categorias", p: "read:categories" },
  { to: "/admin/usuarios", icon: <FiUsers size={22} className="text-violet-400" />, label: "Usuarios", p: "read:users" },
  { to: "/admin/marcas", icon: <TbBrandApple size={22} className="text-rose-400" />, label: "Marcas", p: "read:brands", disabled: true },
  { to: "/admin/descuentos", icon: <FiPercent size={22} className="text-amber-400" />, label: "Descuentos", p: "read:discounts", disabled: true },
  { to: "/admin/cupones", icon: <FiTag size={22} className="text-orange-400" />, label: "Cupones", p: "read:discounts", disabled: true },
  { to: "/admin/afiliados", icon: <TbAffiliate size={22} className="text-yellow-500" />, label: "Afiliados", p: "read:users", disabled: true },
  { to: "/admin/premios", icon: <FaShop size={22} className="text-fuchsia-400" />, label: "Premios", p: "read:rewards", disabled: true },
  { to: "/admin/minijuegos", icon: <IoGameControllerOutline size={22} className="text-fuchsia-400" />, label: "Juegos", p: "read:games", disabled: true },
  { to: "/admin/auditoria", icon: <PiNotebook size={22} className="text-slate-300" />, label: "Auditoria", p: "read:users", disabled: true },
  { to: "/admin/config", icon: <IoSettingsOutline size={22} className="text-slate-300" />, label: "Configuracion", p: "read:users", disabled: true }
];

const AccesosDirectosAdmin = () => {
  const { can, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce" />
      <p className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Verificando credenciales...</p>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {ACCESOS.map((link) => (
        can(link.p) && (
          <div key={link.to} className="w-[100px] md:w-[120px] text-center">
            <QuickLink to={link.to} icon={link.icon} label={link.label} disabled={link.disabled} />
          </div>
        )
      ))}
    </div>
  );
};

export default AccesosDirectosAdmin;
