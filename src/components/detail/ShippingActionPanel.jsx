import DetailCard from "./DetailCard";

const ShippingActionPanel = ({ status, onStatusChange, userRole }) => {
  // Definimos qué roles pueden ejecutar qué acciones
  const ACTION_MAP = {
    "CREATED": {
      admin: [{ label: "Preparar Envío", next: "READY_TO_SHIP", color: "bg-blue-600" }]
    },
    "READY_TO_SHIP": {
      admin: [{ label: "Marcar como Listo", next: "READY_TO_SHIP", color: "bg-blue-600" }],
      carrier: [{ label: "Iniciar Viaje (Salida)", next: "SHIPPED", color: "bg-brand-primary" }]
    },
    "SHIPPED": {
      carrier: [
        { label: "✓ Confirmar Entrega", next: "DELIVERED", color: "bg-green-600" },
        { label: "⚠ Fallo en Entrega", next: "FAILED", color: "bg-red-500" }
      ]
    },
    "IN_TRANSIT": {
      carrier: [
        { label: "✓ Confirmar Entrega", next: "DELIVERED", color: "bg-green-600" },
        { label: "⚠ Fallo en Entrega", next: "FAILED", color: "bg-red-500" }
      ]
    },
    "FAILED": {
      carrier: [{ label: "Reintentar Envío", next: "SHIPPED", color: "bg-brand-secondary" }]
    }
  };

  const getActions = () => {
    const statusActions = ACTION_MAP[status];
    if (!statusActions) return [];

    // Si es admin o super_admin, permitimos todas las acciones definidas para ese estado
    // Si no, filtramos por el rol específico del usuario
    const isPrivileged = ['admin', 'super_admin'].includes(userRole);

    if (isPrivileged) {
      // Retornamos todas las acciones posibles para este estado
      return Object.values(statusActions).flat();
    }

    return statusActions[userRole] || [];
  };

  const actions = getActions();

  if (actions.length === 0) return null;

  return (
    <DetailCard title="Acciones Logísticas">
      <div className="space-y-3">
        {actions.map((act) => (
          <button
            key={act.next}
            onClick={() => onStatusChange(act.next)}
            className={`${act.color} w-full text-white py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-lg cursor-pointer`}
          >
            {act.label}
          </button>
        ))}
      </div>
    </DetailCard>
  );
};

export default ShippingActionPanel;
