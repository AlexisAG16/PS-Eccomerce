// Componente para listas de pesos (Scratch / Probabilidades)
export const WeightListInput = ({ value, onChange }) => {
  const handleUpdate = (idx, field, val) => {
    const newList = [...value];
    newList[idx] = { ...newList[idx], [field]: val };
    onChange(newList);
  };

  return (
    <div className="space-y-4">
      {value?.map((item, idx) => (
        <div key={idx} className="p-4 bg-brand-surface rounded-lg border border-brand-border shadow-sm flex flex-col gap-2">

          {/* Tipo de Recompensa (Oculto o bloqueado si querés, pero útil para que el backend lo lea) */}
          <div className="flex justify-between items-center border-b pb-1">
            <input
              type="text"
              value={item.label}
              onChange={(e) => handleUpdate(idx, 'label', e.target.value)}
              className="font-black text-sm text-zinc-700 bg-transparent outline-none flex-1"
              placeholder="Nombre del premio..."
            />
            <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-brand-bg text-brand-text-muted rounded">
              {item.type || 'Points'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* PUNTOS: Cambiado de item.value a item.points */}
            <div>
              <label className="text-[9px] uppercase font-black text-brand-text-muted">Puntos</label>
              <input
                type="number"
                value={item.points ?? 0}
                onChange={(e) => handleUpdate(idx, 'points', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-brand-border rounded text-sm font-bold text-zinc-800"
              />
            </div>

            {/* PESO/PROBABILIDAD: Cambiado de item.probability a item.weight */}
            <div>
              <label className="text-[9px] uppercase font-black text-brand-text-muted">Peso (Probabilidad)</label>
              <input
                type="number"
                value={item.weight ?? 0}
                onChange={(e) => handleUpdate(idx, 'weight', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-brand-border rounded text-sm font-bold text-zinc-800"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Botón para añadir premios respetando la estructura limpia */}
      <button
        onClick={() => onChange([...value, { type: "0", label: "Nuevo Premio", points: 0, weight: 10 }])} // 👈 Cambiado "Points" por "0"
        className="text-[10px] font-black uppercase text-indigo-500 hover:underline"
      >
        + Añadir Premio
      </button>
    </div>
  );
};

// Componente para las secciones de la Ruleta
export const RouletteSectionInput = ({ value, onChange }) => {
  const types = ["Points", "Discount", "SpinAgain", "NoPrize"];
  return (
    <div className="p-4 bg-brand-surface rounded-xl border border-brand-border grid grid-cols-1 gap-3 mb-4 shadow-sm">
      <div className="flex flex-col">
        <label className="text-[10px] font-black text-indigo-500 uppercase mb-1">Tipo de Premio</label>
        <select
          value={value?.type || "Points"}
          onChange={(e) => onChange({ ...value, type: e.target.value })}
          className="p-2 border rounded-md bg-brand-surface text-sm outline-none focus:border-indigo-400"
        >
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-brand-text-muted uppercase">Puntos</label>
          <input
            type="number"
            value={value?.points || 0}
            onChange={(e) => onChange({ ...value, points: parseInt(e.target.value) || 0 })}
            className="p-1.5 border rounded text-sm focus:ring-1 focus:ring-indigo-400 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-brand-text-muted uppercase">Desc %</label>
          <input
            type="number"
            value={value?.discountPct || 0}
            onChange={(e) => onChange({ ...value, discountPct: parseInt(e.target.value) || 0 })}
            className="p-1.5 border rounded text-sm focus:ring-1 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
