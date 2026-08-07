const DetailCard = ({ title, children, className = "", dark = false }) => (
  <div className={`rounded-[3.5rem] p-10 border border-brand-border shadow-2xl transition-all duration-500 ${dark ? 'bg-brand-primary text-white' : 'bg-brand-surface text-brand-text'
    } ${className}`}>
    {title && (
      <div className="mb-8 flex items-center gap-4">
        <h3 className={`${dark ? 'text-white/40!' : 'text-brand-text-muted!'} font-black uppercase italic text-[12px] tracking-[0.2em]`}>
          {title}
        </h3>
        <div className={`h-px grow ${dark ? 'bg-brand-surface/10' : 'bg-brand-border'}`} />
      </div>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default DetailCard;
