const DetailCard = ({ title, children, className = "", dark = false }) => (
  <div className={`rounded-[3.5rem] p-10 border border-gray-100 shadow-2xl transition-all duration-500 ${dark ? 'bg-brand-primary text-white' : 'bg-white text-gray-800'
    } ${className}`}>
    {title && (
      <div className="mb-8 flex items-center gap-4">
        <h3 className={`${dark ? 'text-white/40!' : 'text-gray-400!'} font-black uppercase italic text-[12px] tracking-[0.2em]`}>
          {title}
        </h3>
        <div className={`h-px grow ${dark ? 'bg-white/10' : 'bg-air-gris/40'}`} />
      </div>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default DetailCard;