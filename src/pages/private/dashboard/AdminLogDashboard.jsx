import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { ClipLoader } from 'react-spinners';

// Definición de columnas basada estrictamente en tu modelo adminLog
const columns = [
  { label: "ID", field: "_id" },
  {
    label: "Administrador",
    field: "adminId",
    render: (admin) => (
      <div className="flex flex-col">
        <span className="font-bold text-brand-text">{admin?.firstName} {admin?.lastName}</span>
        <span className="text-[10px] text-brand-text italic">{admin?.email || 'Sistema/Auto'}</span>
      </div>
    )
  },
  { label: "Acción", field: "action" },
  { label: "Entidad", field: "entity" },
  { label: "Entity ID", field: "entityId" },
  {
    label: "Detalles",
    field: "details",
    render: (val) => (
      <pre className="text-[9px] bg-brand-bg p-1 rounded overflow-x-auto max-w-[200px]">
        {JSON.stringify(val, null, 2)}
      </pre>
    )
  },
  { label: "IP", field: "ip" },
  { label: "Creado", field: "createdAt", format: "date" }
];

const AdminLogDashboard = () => {
  // Ajustamos el fetch al endpoint de logs
  const { data, loading, pagination, handleFilterChange, setFilters, filters } = useFetchTable(
    '/logs', // Ajusta según tu ruta de backend
    { order: 'desc', sortBy: 'createdAt', limit: 20 },
    '/admin/auditoria'
  );

  const filterConfig = [
    {
      name: 'search',
      label: 'Buscar',
      type: 'text',
      placeholder: 'ID de entidad o detalle...'
    },
    {
      name: 'entity',
      label: 'Entidad',
      type: 'select',
      options: [
        { label: 'Producto', value: 'product' },
        { label: 'Orden', value: 'order' },
        { label: 'Usuario', value: 'user' },
        { label: 'Cupón', value: 'coupon' },
        { label: 'Categoría', value: 'category' },
        { label: 'Shipping', value: 'shipping' },
        { label: 'Pago', value: 'payment' },
        { label: 'Rol', value: 'role' },
        { label: 'Afiliado', value: 'affiliate' },
        { label: 'Permiso', value: 'permission' },
        { label: 'Descuento', value: 'discount' }
      ]
    },
    {
      name: 'action',
      label: 'Acción',
      type: 'select',
      options: [
        { label: 'Crear', value: 'CREATE' },
        { label: 'Actualizar', value: 'UPDATE' },
        { label: 'Eliminar', value: 'DELETE' },
        { label: 'Login', value: 'LOGIN' },
        { label: 'Registro', value: 'USER_REGISTER' },
        { label: 'Reset Password', value: 'PASSWORD_RESET_COMPLETED' },
        { label: 'Activar/Desactivar', value: 'ACTIVATE' },
        { label: 'Pago Creado', value: 'PAYMENT_SESSION_CREATED' }
      ]
    },
    {
      name: 'order',
      label: 'Orden',
      type: 'select',
      options: [
        { label: 'Más recientes', value: 'desc' },
        { label: 'Más antiguos', value: 'asc' }
      ]
    }
  ];

  return (
    <>
      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        onClear={() => setFilters({ order: 'desc', sortBy: 'createdAt', page: 1 })}
        values={filters}
      />

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center">
          <ClipLoader size={100} />
          <p className='mt-5'>Cargando auditoría...</p>
        </div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/auditoria"
          pagination={pagination}
          loading={loading}
          handleFilterChange={handleFilterChange}
          filters={filters}
          // --- BLOQUEO DE EDICIÓN Y ELIMINACIÓN ---
          isEditable={false}
          isDeletable={false}
        />
      )}
    </>
  );
};

export default AdminLogDashboard;