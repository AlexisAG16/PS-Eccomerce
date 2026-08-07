const InfoRow = ({ label, value, dark = false, highlight = false }) => (
  <div className="group transition-all">
    <p className={`text-[11px] font-black uppercase mb-1 tracking-tighter ${dark ? 'text-brand-text-muted!' : 'text-brand-text-muted!'}`}>
      {label}
    </p>

    <div className="flex justify-between items-end">
      <p className={`font-black italic uppercase tracking-tighter ${highlight
          ? 'text-2xl text-brand-highlight'
          : dark
            ? 'text-lg text-brand-text!'
            : 'text-lg text-brand-text'
        }`}>
        {value}
      </p>
    </div>

    <div className="h-px w-full mt-4 bg-brand-border" />
  </div>
);

export default InfoRow;
