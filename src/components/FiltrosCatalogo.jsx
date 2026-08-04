import { useState } from "react";
import { PiSlidersHorizontalBold } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";

const FiltrosCatalogo = ({
  busqueda, setBusqueda,
  precioMin, setPrecioMin,
  precioMax, setPrecioMax,
  limpiarFiltros
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="md:w-72">
      <div className="md:sticky md:top-[130px] space-y-8 bg-brand-surface p-6 rounded-2xl border border-brand-border shadow-xl shadow-black/20">
        <div className="relative">
          <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-2 block ml-1">Buscador</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Que estas buscando?"
              className="w-full p-3 pr-10 rounded-xl border border-brand-border shadow-inner bg-brand-bg focus:ring-2 focus:ring-brand-accent outline-none text-sm text-brand-text placeholder:text-brand-text-muted"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <IoIosSearch className="absolute right-3 top-3.5 text-brand-text-muted w-4 h-4" />
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden w-full items-center justify-between bg-brand-primary text-white p-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          <div className="flex items-center gap-2">
            <PiSlidersHorizontalBold size={14} />
            {isOpen ? "Cerrar Filtros" : "Filtros"}
          </div>
          {isOpen ? <FaChevronDown size={16} /> : <FaChevronUp size={16} />}
        </button>

        <div className={`${isOpen ? 'block' : 'hidden'} md:block space-y-3 pt-4 md:pt-0 border-t md:border-none border-brand-border mt-4 md:mt-0`}>
          <div>
            <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-3 block ml-1">Rango de Precio</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 p-3 rounded-xl bg-brand-bg text-xs shadow-inner outline-none border border-brand-border focus:ring-1 focus:ring-brand-accent text-brand-text placeholder:text-brand-text-muted"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 p-3 rounded-xl bg-brand-bg text-xs shadow-inner outline-none border border-brand-border focus:ring-1 focus:ring-brand-accent text-brand-text placeholder:text-brand-text-muted"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => {
              limpiarFiltros();
              setIsOpen(false);
            }}
            className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-brand-primary text-brand-text hover:bg-brand-accent transition-all shadow-sm border border-brand-border"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FiltrosCatalogo;
