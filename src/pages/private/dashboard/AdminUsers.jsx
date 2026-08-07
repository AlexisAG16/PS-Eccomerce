import { ClipLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import GenericFilters from '../../../components/ui/Filters';
import { useFetchTable } from '../../../hooks/useFetchTable';
import UserModal from '../../../components/forms/UserAdminForm';
import { AdminButtonModal } from '../../../components/ui/Button';
import GenericTable from '../../../components/ui/Table';
import api from '../../../api/axiosConfig';

const columns = [
  { label: "ID", field: "_id", sortable: false },
  {
    label: "Usuario",
    field: "firstName",
    render: (val, row) => (
      <div className="flex flex-col min-w-[130px]">
        <span className="font-bold text-brand-text uppercase italic tracking-tighter leading-none mb-1 truncate">
          {val} {row.lastName}
        </span>
        <span className="text-[9px] text-brand-secondary font-mono truncate max-w-[150px]">
          {row.email}
        </span>
      </div>
    )
  },
  {
    label: "Rol",
    field: "role",
    render: (val) => {
      const roleName = typeof val === 'object' ? val.name : val;

      const roleMapper = {
        user: { label: 'Usuario', cls: 'bg-brand-bg text-brand-text-muted border-brand-border' },
        affiliate: { label: 'Afiliado', cls: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
        operator: { label: 'Operador', cls: 'bg-blue-50 text-blue-600 border-blue-100' },
        carrier: { label: 'Logística', cls: 'bg-orange-50 text-orange-600 border-orange-100' },
        mayorista: { label: 'Mayorista', cls: 'bg-purple-50 text-purple-600 border-purple-100' },
        admin: { label: 'Admin', cls: 'bg-red-50 text-red-600 border-red-100' },
        super_admin: { label: 'Super Admin', cls: 'bg-black text-white border-black' }
      };

      const config = roleMapper[roleName?.toLowerCase()] || { label: roleName, cls: 'bg-brand-surface text-brand-text-muted' };

      return (
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase italic whitespace-nowrap ${config.cls}`}>
          {config.label}
        </span>
      );
    }
  },
  {
    label: "Puntos",
    field: "points",
    render: (val) => (
      <div className="flex flex-col items-center">
        <span className="font-mono font-black text-brand-text text-xs">
          {val?.toLocaleString() || 0}
        </span>
        <span className="text-[7px] font-bold text-brand-text-muted/50 uppercase">Patrician Software Pts</span>
      </div>
    )
  },
  {
    label: "Estado",
    field: "isActive",
    render: (val) => (
      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border whitespace-nowrap ${val ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
        <span className="text-[6px]">●</span> {val ? 'Activo' : 'Baneado'}
      </span>
    )
  },
  {
    label: "Registro",
    field: "createdAt",
    format: "date",
    render: (val) => (
      <span className="text-[9px] text-brand-text-muted font-bold italic">
        {new Date(val).toLocaleDateString('es-AR')}
      </span>
    )
  }
];

const AdminUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/roles'); // Asegurate que este endpoint devuelva la lista
        setRoles(res.data.data); // Asumiendo formato { data: [...] }
      } catch (err) {
        console.error("No se pudieron cargar los roles para el filtro");
      }
    };
    fetchRoles();
  }, []);

  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/users', // Ajusta el endpoint de tu API
    { order: 'desc', sortBy: 'createdAt', limit: 10 },
    '/admin/usuarios'
  );

  const openCreate = () => { setSelectedUser(null); setIsModalOpen(true); };
  const openEdit = (user) => { setSelectedUser(user); setIsModalOpen(true); };

  const filterConfig = [
    { name: 'search', label: 'Buscar', type: 'text', placeholder: 'Nombre o Email...' },
    {
      name: 'role',
      label: 'Rol / Permisos',
      type: 'select',
      options: roles.map(r => {
        const labels = {
          user: 'USUARIO FINAL',
          affiliate: 'AFILIADO',
          operator: 'OPERADOR STAFF',
          carrier: 'LOGÍSTICA / REPARTO',
          mayorista: 'CLIENTE MAYORISTA',
          admin: 'ADMINISTRADOR',
          super_admin: 'SUPER USUARIO'
        };
        return {
          label: labels[r.name.toLowerCase()] || r.name.toUpperCase(),
          value: r._id
        };
      })
    },
    {
      name: 'isActive',
      label: 'Estado Cuenta',
      type: 'select',
      options: [
        { label: 'SOLO ACTIVOS', value: 'true' },
        { label: 'SOLO INACTIVOS', value: 'false' }
      ]
    },
    {
      name: 'order',
      label: 'Orden',
      type: 'select',
      options: [
        { label: 'MÁS RECIENTES', value: 'desc' },
        { label: 'MÁS ANTIGUOS', value: 'asc' }
      ]
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <AdminButtonModal
          text='+ Crear Usuario'
          style='bg-brand-secondary hover:bg-brand-bg'
          openCreate={openCreate}
        />
      </div>

      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        onClear={() => setFilters({ order: 'desc', sortBy: 'createdAt', page: 1 })}
        values={filters}
      />

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center"><ClipLoader size={100} /> <p className='mt-5'>Cargando...</p></div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/usuarios"
          onEdit={openEdit}
          onDelete={(id, name, isActive) => deleteItem(id, name, isActive)}
          pagination={pagination}
          loading={loading}
          handleFilterChange={handleFilterChange}
          filters={filters}
        />
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={selectedUser}
        onRefresh={() => setFilters({ ...filters })}
      />
    </>
  );
};

export default AdminUsers;
