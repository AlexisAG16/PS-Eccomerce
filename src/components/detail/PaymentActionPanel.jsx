import {
  FiCornerUpLeft
} from 'react-icons/fi';

// En tu archivo src/components/detail/PaymentActionPanel.jsx
const PaymentActionPanel = ({ payment, onRefund }) => {
  // Aseguramos mayúsculas para comparar bien
  const status = (payment.status || "").toUpperCase();

  // Lógica: Si el pago está aprobado, mostramos "Reembolsar".
  // Si ya es REFUNDED, CANCELLED o REJECTED, no mostramos nada.
  const canRefund = status === 'APPROVED';
  const isFinalized = ['REFUNDED', 'CANCELLED', 'REJECTED'].includes(status);

  if (isFinalized) {
    return (
      <div className="p-4 border border-dashed border-gray-300 rounded-2xl text-center bg-gray-50">
        <p className="text-[10px] font-black uppercase text-gray-400">Transacción Finalizada</p>
        <p className="text-[10px] font-black uppercase text-gray-600 italic">{status}</p>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-red-600 to-red-800 rounded-4xl p-6 text-white shadow-lg">
      <h3 className="font-black uppercase italic text-[9px] mb-2 tracking-widest">Acciones Disponibles</h3>
      {canRefund && (
        <button
          onClick={onRefund}
          className="w-full py-3 bg-white text-red-700 rounded-xl font-black uppercase italic text-[10px] hover:bg-gray-100 transition-all"
        >
          Confirmar Reembolso
        </button>
      )}
    </div>
  );
};

export default PaymentActionPanel;