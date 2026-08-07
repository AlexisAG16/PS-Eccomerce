const DiscountStatusCard = ({ discount }) => (
  <div className="bg-brand-bg p-6 rounded-4xl border border-brand-border mt-4">
    <p className="text-[11px] font-black text-brand-highlight uppercase mb-2">
      {discount ? '🏷️ Campaña Vigente' : 'Campaña'}
    </p>
    <p className="text-xs font-bold text-brand-text-muted uppercase italic">
      {discount?.name || 'No hay campañas vinculadas.'}
    </p>
  </div>
);

export default DiscountStatusCard;
