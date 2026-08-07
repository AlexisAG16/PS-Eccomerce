const PaymentActionPanel = ({ payment, onRefund }) => {
  const status = (payment.status || "").toUpperCase();
  const canRefund = status === 'APPROVED';
  const isFinalized = ['REFUNDED', 'CANCELLED', 'REJECTED'].includes(status);

  if (isFinalized) {
    return (
      <div className="p-4 border border-dashed border-brand-border rounded-2xl text-center bg-brand-bg">
        <p className="text-[10px] font-black uppercase text-brand-text-muted">Transaccion Finalizada</p>
        <p className="text-[10px] font-black uppercase text-brand-text italic">{status}</p>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-red-600 to-red-800 rounded-4xl p-6 text-white shadow-lg">
      <h3 className="font-black uppercase italic text-[9px] mb-2 tracking-widest">Acciones Disponibles</h3>
      {canRefund && (
        <button
          onClick={onRefund}
          className="w-full py-3 bg-brand-text text-red-700 rounded-xl font-black uppercase italic text-[10px] hover:bg-brand-text/90 transition-all"
        >
          Confirmar Reembolso
        </button>
      )}
    </div>
  );
};

export default PaymentActionPanel;
