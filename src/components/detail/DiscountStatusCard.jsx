const DiscountStatusCard = ({ discount }) => (
  <div className="bg-gray-50 p-6 rounded-4xl border border-gray-100 mt-4">
    <p className="text-[11px] font-black text-blue-500 uppercase mb-2">
      {discount ? '🏷️ Campaña Vigente' : 'Campaña'}
    </p>
    <p className="text-xs font-bold text-gray-500 uppercase italic">
      {discount?.name || 'No hay campañas vinculadas.'}
    </p>
  </div>
);

export default DiscountStatusCard;