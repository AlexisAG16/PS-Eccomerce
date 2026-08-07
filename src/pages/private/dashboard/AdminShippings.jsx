import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { ClipLoader } from 'react-spinners';

const columns = [
  { label: "ID", field: "_id", sortable: false },
  {
    label: "Envío / Tracking",
    field: "trackingNumber",
    sortable: false,
    render: (val, row) => (
      <div className="flex flex-col min-w-[95px]">
        <span className="font-black text-brand-text font-mono text-[10px] whitespace-nowrap">
          {val || 'PEND. GUÍA'}
        </span>
        <span className="text-[8px] text-brand-secondary font-bold uppercase tracking-tighter">
          Ord: #{row.orderId?._id?.slice(-6).toUpperCase() || row.orderId?.slice(-6).toUpperCase()}
        </span>
      </div>
    )
  },
  {
    label: "Transporte",
    field: "carrier",
    sortable: true,
    render: (val, row) => (
      <div className="flex flex-col">
        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-brand-bg text-brand-text-muted border border-brand-border uppercase italic w-fit">
          {val || 'Propio'}
        </span>
        {row.carrierName && (
          <span className="text-[7px] text-brand-text-muted font-bold uppercase mt-0.5 truncate max-w-[70px]">
            {row.carrierName.split(' ')[0]}
          </span>
        )}
      </div>
    )
  },
  {
    label: "Destino",
    field: "shippingAddress",
    sortable: false,
    render: (val) => (
      <div className="flex flex-col max-w-[140px]">
        <span className="text-[10px] font-bold text-brand-text truncate leading-tight">
          {val?.street} {val?.number}
        </span>
        <span className="text-[8px] text-brand-text-muted uppercase font-black tracking-tighter">
          {val?.city} ({val?.postalCode})
        </span>
      </div>
    )
  },
  {
    label: "Estado",
    field: "status",
    sortable: true,
    render: (val) => {
      const shipMapper = {
        CREATED: { label: 'Creado', cls: 'bg-brand-bg text-brand-text-muted border-brand-border' },
        READY_TO_SHIP: { label: 'A Despachar', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
        SHIPPED: { label: 'Despachado', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
        IN_TRANSIT: { label: 'En Camino', cls: 'bg-purple-50 text-purple-600 border-purple-200' },
        DELIVERED: { label: 'Entregado', cls: 'bg-green-50 text-green-600 border-green-200' },
        FAILED: { label: 'Fallido', cls: 'bg-red-50 text-red-500 border-red-100' },
        RETURNED: { label: 'Devuelto', cls: 'bg-orange-50 text-orange-600 border-orange-100' },
        CANCELLED: { label: 'Cancelado', cls: 'bg-red-100 text-red-800 border-red-200' }
      };

      const config = shipMapper[val] || shipMapper.CREATED;

      return (
        <span className={`
          inline-flex items-center gap-1
          text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-lg border 
          uppercase tracking-tighter whitespace-nowrap ${config.cls}
        `}>
          {config.label}
        </span>
      );
    }
  },
  {
    label: "Costo",
    field: "carrierCost", // 👈 Cambiado a carrierCost según tu modelo
    sortable: true,
    render: (val) => (
      <div className="flex flex-col items-end">
        <span className="font-mono font-bold text-[11px] text-brand-text tracking-tighter">
          ${val?.toLocaleString('es-AR') || '0'}
        </span>
        <span className="text-[7px] text-brand-text-muted/50 font-black">NETO</span>
      </div>
    )
  },
  {
    label: "Est. Entrega",
    field: "estimatedDeliveryDate",
    sortable: true,
    render: (val) => (
      <span className="text-[9px] text-brand-text-muted font-bold italic">
        {val ? new Date(val).toLocaleDateString('es-AR') : 'S/D'}
      </span>
    )
  },
  { label: "Creado", field: "createdAt", format: "date" }
];

const AdminShippings = () => {
  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/shippings',
    { order: 'desc', sortBy: 'createdAt', limit: 10 },
    '/admin/envios'
  );

  const filterConfig = [
    { name: 'search', label: 'Tracking / ID', type: 'text', placeholder: 'Buscar...' },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Listo para enviar', value: 'READY_TO_SHIP' },
        { label: 'Enviado', value: 'SHIPPED' },
        { label: 'En tránsito', value: 'IN_TRANSIT' },
        { label: 'Entregado', value: 'DELIVERED' },
        { label: 'Fallido/Devuelto', value: 'FAILED' }
      ]
    },
    {
      name: 'carrier',
      label: 'Transportista',
      type: 'select',
      options: [
        { label: 'Propio', value: 'propio' },
        { label: 'Andreani', value: 'andreani' },
        { label: 'OCA', value: 'oca' },
        { label: 'Correo Argentino', value: 'correo_argentino' }
      ]
    }
  ];

  return (
    <>
      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        // 🚩 CORRECCIÓN: Pasar values y usar el objeto de reset en onClear
        values={filters}
        onClear={() => handleFilterChange({
          page: 1,
          order: 'desc',
          sortBy: 'createdAt'
        })}
      />

      {loading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={60} />
          <p className="mt-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest animate-pulse">
            Rastreando paquetes...
          </p>
        </div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/envios"
          // 🚩 CORRECCIÓN: Usar el deleteItem del hook (más limpio y con SweetAlert corporativo)
          onDelete={(id, name) => deleteItem(id, `Envío ${name || ''}`)}
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

export default AdminShippings;