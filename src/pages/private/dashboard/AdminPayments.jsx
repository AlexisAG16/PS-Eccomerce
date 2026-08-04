import { Link } from 'react-router';
import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { ClipLoader } from 'react-spinners';

const columns = [
  // {
  //   label: "ID Pago",
  //   field: "providerPaymentId",
  //   sortable: false,
  //   render: (val) => (
  //     <div className="flex flex-col min-w-[80px]">
  //       <span className="font-mono text-[10px] font-bold text-gray-500 tracking-tighter">
  //         #{val?.toString().slice(-10) || 'N/A'}
  //       </span>
  //       <span className="text-[7px] text-gray-300 uppercase font-black italic">Comprobante</span>
  //     </div>
  //   )
  // },
  {
    label: "Acciones",
    field: "_id",
    render: (value, row) => {
      // Determinamos la base de la URL según el tipo de pago
      const detailRoute = row.provider === 'echeck'
        ? `/admin/echeq/detalle/${value}`
        : `/admin/pagos/detalle/${value}`;

      return (
        <Link
          to={detailRoute}
          className="inline-flex items-center justify-center bg-brand-primary text-white hover:bg-brand-secondary px-4 py-2 rounded-xl font-black text-[9px] uppercase italic tracking-widest transition-all shadow-md active:scale-95"
        >
          Ver Detalles
        </Link>
      );
    }
  },
  {
    label: "Proveedor",
    field: "provider",
    render: (val) => {
      const providers = {
        mercado_pago: { label: 'M. Pago', color: 'bg-blue-500' },
        transferencia: { label: 'Transf.', color: 'bg-green-500' },
        echeck: { label: 'eCheck', color: 'bg-purple-500' }
      };
      const config = providers[val] || { label: val?.replace('_', ' '), color: 'bg-gray-400' };

      return (
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${config.color} animate-pulse`} />
          <span className="text-[9px] font-black uppercase italic text-brand-primary tracking-tighter whitespace-nowrap">
            {config.label}
          </span>
        </div>
      );
    }
  },
  {
    label: "Orden",
    field: "orderId",
    sortable: false,
    render: (val) => (
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
          #{val?._id?.slice(-6).toUpperCase() || val?.slice(-6).toUpperCase()}
        </span>
      </div>
    )
  },
  {
    label: "Estado",
    field: "status",
    render: (val) => {
      const statusMapper = {
        CREATED: { label: 'Creado', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
        PENDING: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
        APPROVED: { label: 'Aprobado', cls: 'bg-green-50 text-green-600 border-green-200' },
        REJECTED: { label: 'Rechazado', cls: 'bg-red-50 text-red-600 border-red-200' },
        CANCELLED: { label: 'Cancelado', cls: 'bg-gray-200 text-gray-600 border-gray-300' },
        REFUNDED: { label: 'Reembolso', cls: 'bg-purple-50 text-purple-600 border-purple-200' }
      };

      const config = statusMapper[val] || statusMapper.CREATED;

      return (
        <span className={`
          inline-flex items-center gap-1
          text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-lg border 
          uppercase tracking-tighter whitespace-nowrap ${config.cls}
        `}>
          <span className="text-[6px]">●</span> {config.label}
        </span>
      );
    }
  },
  {
    label: "Monto",
    field: "amount",
    render: (val) => (
      <div className="flex flex-col items-end">
        <span className="font-black text-sm text-brand-primary italic tracking-tighter">
          ${val?.toLocaleString('es-AR')}
        </span>
        <span className="text-[7px] text-gray-400 font-bold uppercase">ARS</span>
      </div>
    )
  },
  {
    label: "Fecha",
    field: "createdAt",
    format: "date",
    render: (val) => (
      <span className="text-[9px] text-gray-400 font-bold tabular-nums">
        {new Date(val).toLocaleDateString('es-AR')}
      </span>
    )
  }
];

const AdminPayments = () => {
  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/payments',
    { order: 'desc', sortBy: 'createdAt', limit: 10 },
    '/admin/pagos'
  );

  const filterConfig = [
    { name: 'search', label: 'ID Transacción', type: 'text', placeholder: 'ID de proveedor...' },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Aprobados', value: 'APPROVED' },
        { label: 'Pendientes', value: 'PENDING' },
        { label: 'Rechazados', value: 'REJECTED' },
        { label: 'Reembolsados', value: 'REFUNDED' },
        { label: 'Cancelados', value: 'CANCELLED' }
      ]
    },
    {
      name: 'provider',
      label: 'Plataforma',
      type: 'select',
      options: [
        { label: 'Mercado Pago', value: 'mercado_pago' },
        { label: 'E-Check', value: 'echeck' },         // 👈 Opción limpia para cheques
        { label: 'Transferencia', value: 'transferencia' } // 👈 Opción limpia para transferencias
      ]
    }
  ];

  return (
    <>
      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        // 🚩 CORRECCIÓN: Pasar values para que los inputs no queden "sucios"
        values={filters}
        // 🚩 CORRECCIÓN: Resetear enviando el objeto base al hook
        onClear={() => handleFilterChange({
          page: 1,
          order: 'desc',
          sortBy: 'createdAt'
        })}
      />

      {loading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={60} />
          <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">
            Sincronizando Transacciones...
          </p>
        </div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/pagos"
          pagination={pagination}
          loading={loading}
          handleFilterChange={handleFilterChange}
          filters={filters}
          isEditable={false} // Solo lectura usualmente para pagos
          isDeletable={false}
        />
      )}
    </>
  );
};

export default AdminPayments;