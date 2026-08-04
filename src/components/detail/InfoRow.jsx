const InfoRow = ({ label, value, dark = false, highlight = false }) => (
  <div className="group transition-all">
    {/* Label con color condicional */}
    <p className={`text-[11px] font-blacsk uppercase mb-1 tracking-tighter ${dark ? 'text-air-gris!' : 'text-gray-700!'
      }`}>
      {label}
    </p>

    <div className="flex justify-between items-end">
      {/* Valor con color condicional y manejo de highlight */}
      <p className={`font-black italic uppercase tracking-tighter ${highlight
          ? 'text-2xl text-air-naranja'
          : dark
            ? 'text-lg text-air-blanco!' // Si es dark y no es highlight, blanco sí o sí
            : 'text-lg text-air-negro'
        }`}>
        {value}
      </p>
    </div>

    {/* Separador sutil */}
    <div className={`h-px w-full mt-4 ${dark ? 'bg-air-gris/40!' : 'bg-air-gris/40!'
      }`} />
  </div>
);

export default InfoRow;