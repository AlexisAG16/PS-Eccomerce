import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { AdminButtonModal } from '../../../components/ui/Button';
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import AffiliateModal from '../../../components/forms/AffiliateForm'; // Ajusta la ruta a tu modal de afiliado

const columns = [
  { label: "ID", field: "_id" },
  {
    label: "Afiliado",
    field: "user",
    render: (val) => (
      <div className="flex flex-col">
        <span className="font-bold text-brand-text uppercase italic tracking-tighter leading-none mb-1">
          {val ? `${val.firstName} ${val.lastName}` : "Usuario eliminado"}
        </span>
        <span className="text-[9px] text-brand-secondary font-mono">{val?.email}</span>
      </div>
    )
  },
  {
    label: "Código",
    field: "affiliateCode",
    render: (val) => (
      <span className="font-black text-brand-text bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest text-[11px]">
        {val}
      </span>
    )
  },
  {
    label: "Comisión",
    field: "defaultCommission",
    render: (val) => <span className="font-mono font-bold text-brand-text">{val}%</span>
  },
  {
    label: "Ganancias",
    field: "totalEarnings",
    render: (val) => <span className="font-mono font-bold text-green-600">${val?.toLocaleString('es-AR')}</span>
  },
  {
    label: "Estado",
    field: "isActive",
    render: (val) => (
      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {val ? 'Activo' : 'Inactivo'}
      </span>
    )
  },
  { label: "Creado", field: "createdAt", format: "date" }
];

const AdminAffiliates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);

  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/affiliates', // Ajusta el endpoint de tu API
    { order: 'desc', sortBy: 'createdAt', limit: 10 },
    '/admin/afiliados'
  );

  const openCreate = () => { setSelectedAffiliate(null); setIsModalOpen(true); };
  const openEdit = (affiliate) => { setSelectedAffiliate(affiliate); setIsModalOpen(true); };

  const filterConfig = [
    { name: 'search', label: 'Buscar código o email', type: 'text', placeholder: 'Ej: pewdiepie...' },
    {
      name: 'isActive',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Activos', value: 'true' },
        { label: 'Inactivos', value: 'false' }
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
      <div className="flex justify-between items-center mb-8">
        <AdminButtonModal
          text='+ Crear Afiliado'
          style='bg-air-azul hover:bg-air-gris'
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
          route="/admin/afiliados"
          onEdit={openEdit}
          onDelete={(id) => deleteItem(id, "este afiliado")}
          pagination={pagination}
          loading={loading}
          handleFilterChange={handleFilterChange}
          filters={filters}
        />
      )}

      <AffiliateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        affiliateToEdit={selectedAffiliate}
        onRefresh={() => setFilters({ ...filters })}
      />
    </>
  );
};

export default AdminAffiliates;