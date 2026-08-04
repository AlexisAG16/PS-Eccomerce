import { Link, useNavigate } from 'react-router'
import { FiCheckCircle, FiSlash } from "react-icons/fi";
import { FiEdit3 } from "react-icons/fi";

export const HeaderButtonDesktop = ({ text = "sin titulo", color="bg-black", ruta="/", icon }) => {
  const navigate = useNavigate()

  const onButtonClick = (ruta) => {
    navigate(ruta)
  }

  return (
    <div className='w-full'>
      
      <button
        onClick={() => onButtonClick(ruta)}
        className={`
        flex flex-row justify-end items-center gap-4 w-full cursor-pointer transition-all
        text-white font-bold uppercase tracking-widest
      
        /* Forma: Redondeamos solo la izquierda para que "entre" suave al diseño */
        rounded-l-full
      
        /* Padding dinámico */
        pr-6 md:pr-10
        pl-10           /* Mucho padding a la izquierda para empujar el texto */
      
        /* Tamaños corregidos */
        text-xs lg:text-[0.9rem]
        py-2 lg:py-2 md:py-3
      
        /* Hover y Color */
        hover:brightness-110 hover:pl-12 ${color}
      `}
      >
        <span className="truncate">{text}</span>
        <span className="flex items-center bg-white/20 p-0 rounded-full">
          {icon}
        </span>
      </button>
    </div>
  );
}

export const AdminButton = ({ text = "sin texto", route = "/", style = "bg-black" }) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(route)}
      className={`${style} cursor-pointer transition-all text-white px-4 py-2 rounded-lg font-bold`}
    >
      { text }
    </button>
  )
}

export const AdminButtonModal = ({ text = "sin texto", route = "/", style = "bg-black", openCreate }) => {
  return (
    <button
      onClick={openCreate}
      className={`${style} cursor-pointer transition-all text-brand-text px-4 py-2 rounded-lg font-bold`}
    >
      {text}
    </button>
  )
}

export const EditButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-[10px] font-black uppercase italic rounded-full hover:bg-brand-secondary transition-all duration-300 shadow-lg group"
    >
      <FiEdit3 className="text-sm group-hover:rotate-12 transition-transform" />
      <span>Editar Producto</span>
    </button>
  );
};

export const StatusToggleButton = ({ isActive, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-6 py-2.5 border-2 text-[10px] font-black uppercase italic rounded-full transition-all duration-300 shadow-sm ${isActive
          ? 'border-red-100 text-red-500 hover:bg-red-50'
          : 'border-green-100 text-green-600 hover:bg-green-50'
        }`}
    >
      {isActive ? (
        <>
          <FiSlash className="text-sm" />
          <span>Desactivar</span>
        </>
      ) : (
        <>
          <FiCheckCircle className="text-sm" />
          <span>Activar</span>
        </>
      )}
    </button>
  );
};

export const QuickLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center p-6 bg-white border border-transparent rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-brand-secondary/20 transition-all duration-300 group overflow-hidden relative"
  >
    <div className="text-brand-primary group-hover:text-brand-secondary group-hover:scale-110 transition-all duration-300 mb-3 z-10">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-brand-primary transition-colors z-10">
      {label}
    </span>
  </Link>
);
