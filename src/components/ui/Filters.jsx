import { useState } from 'react';

const GenericFilters = ({ config, onFilterChange, onClear }) => {
  const [localFilters, setLocalFilters] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
    onFilterChange(name, value);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
  };

  return (
    <div className="flex flex-wrap gap-4 bg-brand-surface p-6 rounded-2xl mb-8 items-end shadow-xl border border-brand-border">
      {config.map((field, index) => (
        <div key={index} className="flex flex-col gap-1.5 min-w-[150px]">
          <label className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">
            {field.label}
          </label>

          {field.type === 'select' ? (
            <select
              name={field.name}
              value={localFilters[field.name] || ''}
              onChange={handleChange}
              className="border border-brand-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-secondary/40 outline-none bg-brand-bg text-brand-text transition"
            >
              <option value="">Todos</option>
              {field.options.map((opt, i) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              type={field.type || 'text'}
              value={localFilters[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="border border-brand-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-secondary/40 outline-none bg-brand-bg text-brand-text placeholder:text-brand-text-muted/60 transition"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleClear}
        className="text-xs font-bold text-brand-text-muted hover:text-brand-highlight transition px-2 py-3"
      >
        Limpiar filtros
      </button>
    </div>
  );
};

export default GenericFilters;
