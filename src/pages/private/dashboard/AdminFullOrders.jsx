import { Link } from 'react-router';
import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { ClipLoader } from 'react-spinners';

const columns = [
  {
    label: "Orden",
    field: "_id",
    sortable: false,
    render: (val, row) => (
      <Link
        to={`/admin/ordenes/detalle/${val}`}
        className="group flex flex-col items-center gap-1"
      >
        <span className="font-black text-brand-secondary text-[11px] tracking-tighter italic">#{val.slice(-6).toUpperCase()} </span>

        <span className="group-hover:underline rounded-xl px-2 py-0.5 font-bold bg-brand-primary text-brand-surface text-[9px] transition-all">VER DETALLES </span>

        <div className="flex gap-1 mt-0.5">
          <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase ${row.orderType === 'WHOLESALE'
            ? 'bg-purple-100 text-purple-600'
            : 'bg-blue-100 text-blue-600'
            }`}>
            {row.orderType === 'WHOLESALE' ? '💼 Mayorista' : '👤 Minorista'}
          </span>

          {/* Badge de Cupón */}
          {row.hasCoupon && (<span className="bg-green-100 text-green-600 text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase">🎟️ {row.couponCode}</span>)}
        </div>
      </Link>
    )
  },
  {
    label: "Cliente / Items",
    field: "guest",
    render: (_, row) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-800 text-xs italic tracking-tighter uppercase leading-none">
          {row.guest?.firstName} {row.guest?.lastName || row.userId?.lastName}
        </span>
        <span className="text-[9px] text-gray-400 font-medium lowercase mb-1">
          {row.guest?.email || row.userId?.email}
        </span>
        <span className="text-[10px] font-black text-brand-primary/80 italic uppercase tracking-widest">
          📦 {row.itemsCount} {row.itemsCount === 1 ? 'Producto' : 'Productos'}
        </span>
      </div>
    )
  },
  {
    label: "Estado Orden",
    field: "status",
    sortable: false,
    render: (val) => {
      const statusConfig = {
        CREATED: { label: 'Creado', styles: 'text-gray-400 bg-gray-50 border-gray-100' },
        PAID: { label: 'Pagado', styles: 'text-green-600 bg-green-50 border-green-200' },
        SHIPPED: { label: 'Enviado', styles: 'text-blue-600 bg-blue-50 border-blue-200' },
        CANCELLED: { label: 'Cancelado', styles: 'text-red-600 bg-red-50 border-red-200' },
      };

      // Fallback por si llega un estado inesperado
      const config = statusConfig[val] || { label: val, styles: 'bg-gray-100 text-gray-500' };

      return (
        <span className={`
      inline-block whitespace-nowrap
      text-[9px] sm:text-[10px] font-black 
      px-3 py-1 rounded-full border 
      italic uppercase tracking-tighter 
      transition-all duration-200
      ${config.styles}
    `}>
          {config.label}
        </span>
      );
    }
  },
  {
    label: "Pago (MP/Transf)",
    field: "lastPayment",
    sortable: false,
    render: (val) => {
      if (!val) return (
        <div className="flex flex-col opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="text-[8px] font-black uppercase italic whitespace-nowrap">Sin Intentos</span>
          <div className="h-0.5 w-10 bg-gray-300 rounded-full mt-1"></div>
        </div>
      );

      const paymentMapper = {
        CREATED: { label: 'Creado', color: 'text-gray-400' },
        PENDING: { label: 'Pendiente', color: 'text-amber-500' },
        APPROVED: { label: 'Aprobado', color: 'text-green-600' },
        REJECTED: { label: 'Rechazado', color: 'text-red-500' },
        CANCELLED: { label: 'Cancelado', color: 'text-red-700' },
        REFUNDED: { label: 'Reembolso', color: 'text-purple-500' },
      };

      const status = paymentMapper[val.status] || { label: val.status, color: 'text-gray-500' };

      return (
        <div className="flex flex-col leading-tight min-w-[80px]">
          {/* Estado Principal */}
          <span className={`text-[10px] font-black uppercase italic whitespace-nowrap ${status.color}`}>
            {status.label}
          </span>

          {/* Proveedor (MP / Transferencia) */}
          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter truncate max-w-[90px]">
            {val.provider === 'MERCADO_PAGO' ? 'M. Pago' : val.provider.replace('_', ' ')}
          </span>

          {/* ID de Transacción - Más pequeño y sutil */}
          <span className="text-[7px] text-gray-300 font-mono mt-0.5">
            #{val.providerPaymentId?.toString().slice(-8) || 'N/A'}
          </span>
        </div>
      );
    }
  },
  {
    label: "Logística",
    field: "shipping",
    sortable: false,
    render: (val, row) => {
      // Caso 1: Retiro por local (No usa el modelo Shipping completo)
      if (row.deliveryType === 'PICKUP') {
        return (
          <div className="flex flex-col min-w-[90px]">
            <span className="text-gray-400 text-[10px] font-black uppercase italic whitespace-nowrap">
              📍 Retiro Local
            </span>
            <span className="text-[8px] text-gray-300 uppercase font-bold tracking-tighter leading-tight">
              Mostrador Central
            </span>
          </div>
        );
      }

      // Caso 2: Envío a domicilio pero el objeto shipping no existe aún
      if (!val) return (
        <span className="text-[9px] text-gray-300 italic font-medium uppercase tracking-tighter">
          ⏳ No generado
        </span>
      );

      // Mapeo de estados según tu Enum de Mongoose
      const shipStatus = {
        CREATED: { label: 'Creado', color: 'text-gray-400' },
        READY_TO_SHIP: { label: 'Para Despacho', color: 'text-amber-500' },
        SHIPPED: { label: 'Despachado', color: 'text-brand-secondary' },
        IN_TRANSIT: { label: 'En Camino', color: 'text-blue-500' },
        DELIVERED: { label: 'Entregado', color: 'text-green-600' },
        FAILED: { label: 'Fallido', color: 'text-red-500' },
        RETURNED: { label: 'Devuelto', color: 'text-orange-600' },
        CANCELLED: { label: 'Cancelado', color: 'text-red-700' },
      };

      const status = shipStatus[val.status] || { label: val.status, color: 'text-gray-500' };

      return (
        <div className="flex flex-col leading-tight min-w-[100px]">
          {/* Estado del Envío */}
          <span className={`text-[9px] font-black uppercase italic whitespace-nowrap ${status.color}`}>
            🚚 {status.label}
          </span>

          {/* Transportista y Nombre (si existe) */}
          <div className="flex flex-col mt-0.5">
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter truncate max-w-[110px]">
              {val.carrier?.toUpperCase()} {val.carrierName ? `(${val.carrierName.split(' ')[0]})` : ''}
            </span>

            {/* Tracking Number con estilo de código */}
            <span className="text-[8px] text-brand-primary font-mono font-bold tracking-tighter">
              {val.trackingNumber || 'PEND. GUÍA'}
            </span>
          </div>
        </div>
      );
    }
  },
  {
    label: "Total",
    field: "total",
    render: (val) => (
      <div className="flex flex-col items-end bg-gray-50 p-2 rounded-xl border border-gray-100">
        <span className="font-black text-sm text-brand-secondary italic tracking-tighter leading-none">
          ${val?.toLocaleString('es-AR')}
        </span>
        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest mt-1">Final</span>
      </div>
    )
  },
  { label: "Fecha", field: "createdAt", format: "date" }
];

const AdminFullOrders = () => {
  const { data, loading, pagination, handleFilterChange, setFilters, filters } = useFetchTable(
    '/orders/dashboard',
    { order: 'desc', sortBy: 'createdAt', limit: 10 },
    '/admin/ordenes'
  );

  const filterConfig = [
    { name: 'search', label: 'Buscar', type: 'text', placeholder: 'Nombre, Email o ID...' },
    {
      name: 'status',
      label: 'Estado Orden',
      type: 'select',
      options: [
        { label: 'Pendiente Pago', value: 'PENDING_PAYMENT' },
        { label: 'Pagado', value: 'PAID' },
        { label: 'Enviado', value: 'SHIPPED' },
        { label: 'Completado', value: 'COMPLETED' },
      ]
    },
    {
      name: 'deliveryType',
      label: 'Método Entrega',
      type: 'select',
      options: [
        { label: 'Envío', value: 'SHIPPING' },
        { label: 'Retiro', value: 'PICKUP' }
      ]
    }
  ];

  return (
    <>
      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        // 🚩 CORRECCIÓN 1: Pasar los valores actuales de los filtros
        values={filters}
        // 🚩 CORRECCIÓN 2: El onClear debe resetear a los valores iniciales correctos
        onClear={() => handleFilterChange({
          page: 1,
          order: 'desc',
          sortBy: 'createdAt',
          search: '', // Limpiamos explícitamente la búsqueda
          status: '',
          deliveryType: ''
        })}
      />

      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={50} />
          <p className="mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest animate-pulse">
            Obteniendo datos de Patrician Software...
          </p>
        </div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/ordenes"
          pagination={pagination}
          loading={loading}
          handleFilterChange={handleFilterChange}
          filters={filters}
          isEditable={false}
          isDeletable={false}
        />
      )}
    </>
  );
};

export default AdminFullOrders;
