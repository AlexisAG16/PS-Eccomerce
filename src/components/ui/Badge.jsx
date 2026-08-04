export const BadgeStock = ({ stock }) => {
  // Definimos estilos basados en la cantidad
  let bgColor = "bg-green-100 text-green-700 border-green-200";
  let label = "En Stock";

  if (stock === 0) {
    bgColor = "bg-red-100 text-red-700 border-red-200";
    label = "Sin Stock";
  } else if (stock <= 5) {
    bgColor = "bg-amber-100 text-amber-700 border-amber-200";
    label = "Stock Bajo";
  }

  return (
    <div className={`inline-flex flex-col items-center px-3 py-1 rounded-xl border font-black uppercase text-[9px] tracking-tighter ${bgColor}`}>
      <span>{stock} UNIDADES</span>
      <span className="opacity-70 text-[7px] leading-none">{label}</span>
    </div>
  );
};