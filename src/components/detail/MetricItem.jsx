const MetricItem = ({ label, value, sub, colorClass = "text-gray-400", icon: Icon }) => (
  // 🎯 CAMBIO 1: p-4 en mobile y p-6 en desktop. gap-2 en mobile para que no empuje tanto el ícono.
  <div className="bg-white p-4 md:p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex items-center gap-2 md:gap-4 min-w-0">

    {/* Contenedor del Ícono */}
    {Icon && (
      // 🎯 CAMBIO 2: p-3 en mobile para que el círculo no coma tanto espacio horizontal
      <div className={`p-3 md:p-4 rounded-3xl bg-gray-50 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
        <Icon className={`text-lg md:text-xl ${colorClass}`} />
      </div>
    )}

    {/* 🎯 CAMBIO 3: min-w-0 obligatorio en el padre para que el truncate de los hijos funcione dentro de un Flexbox */}
    <div className="flex-1 min-w-0">
      {/* 🎯 CAMBIO 4: truncate para el label */}
      <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-widest leading-none truncate">
        {label}
      </p>

      {/* 🎯 CAMBIO 5: text-xl en mobile para que no rompa, text-2xl en desktop, y truncate por si el valor es muy largo */}
      <p className={`text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none truncate ${colorClass}`}>
        {value}
      </p>

      {/* 🎯 CAMBIO 6: truncate para el subtexto */}
      {sub && (
        <p className="text-[9px] font-bold text-gray-400 uppercase opacity-60 mt-1 truncate">
          {sub}
        </p>
      )}
    </div>
  </div>
);

export default MetricItem;