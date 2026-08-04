import { useEffect, useState } from 'react';
import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { AdminButtonModal } from '../../../components/ui/Button';
import { ClipLoader } from 'react-spinners';
import api from '../../../api/axiosConfig';
import { BadgeStock } from '../../../components/ui/Badge';
import RewardModal from '../../../components/forms/RewardForm'; // Asegúrate de crear este form

const columns = [
  { label: "ID", field: "_id", sortable: false },
  {
    label: "Título del Premio",
    field: "title",
    render: (val, row) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-800 uppercase italic tracking-tighter leading-none mb-1">{val}</span>
        <span className="text-[9px] text-brand-primary font-black uppercase tracking-widest">
          Tipo: {row.config?.discountType === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}
        </span>
      </div>
    )
  },
  {
    label: "Costo",
    field: "pointsCost",
    render: (val) => (
      <div className="flex items-center gap-1">
        <span className="font-mono font-black text-brand-primary text-lg">{val}</span>
        <span className="text-[8px] font-bold text-gray-400 uppercase">pts</span>
      </div>
    )
  },
  {
    label: "Beneficio",
    field: "config",
    render: (config) => (
      <span className="bg-brand-surface text-brand-text px-3 py-1 rounded-full font-black text-[10px] border border-gray-100">
        {config?.discountType === 'percentage' ? `${config?.value}% OFF` : `$${config?.value?.toLocaleString('es-AR')} OFF`}
      </span>
    )
  },
  {
    label: "Stock",
    field: "stock",
    render: (val) => <BadgeStock stock={val} />
  },
  {
    label: "Restricción",
    field: "config",
    render: (config) => {
      if (!config?.categoryRestriction) return <span className="text-[9px] text-gray-400 italic">Sin restricciones</span>;
      return (
        <span className="text-[9px] font-bold text-gray-500 uppercase italic">
          Solo {config.categoryRestriction?.categoryName || 'Categoría específica'}
        </span>
      );
    }
  },
  {
    label: "Min. Compra",
    field: "config.minOrderAmount",
    render: (_, row) => (
      <span className="text-xs font-mono text-gray-600">
        ${row.config?.minOrderAmount?.toLocaleString('es-AR') || '0'}
      </span>
    )
  },
  {
    label: "Estado",
    field: "isActive",
    render: (val) => (
      <span className={`text-[9px] font-black uppercase tracking-tighter ${val ? 'text-green-500' : 'text-red-500'}`}>
        {val ? '● Activo' : '○ Inactivo'}
      </span>
    )
  }
];

const AdminRewards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  // Usamos el hook reutilizable apuntando a /rewards
  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/rewards',
    { order: 'desc', sortBy: 'pointsCost', limit: 10 },
    '/admin/premios'
  );

  const openCreate = () => { setSelectedReward(null); setIsModalOpen(true); };
  const openEdit = (reward) => { setSelectedReward(reward); setIsModalOpen(true); };

  const filterConfig = [
    { name: 'search', label: 'Buscar', type: 'text', placeholder: 'Nombre del premio...' },
    {
      name: 'isActive',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Todos', value: '' },
        { label: 'Activos', value: 'true' },
        { label: 'Inactivos', value: 'false' }
      ]
    },
    {
      name: 'order',
      label: 'Precio en Puntos',
      type: 'select',
      options: [
        { label: 'Mayor costo', value: 'desc' },
        { label: 'Menor costo', value: 'asc' }
      ]
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">

        <AdminButtonModal
          text='+ Crear Premio'
          style='bg-brand-primary hover:bg-brand-text text-white'
          openCreate={openCreate}
        />
      </div>

      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        onClear={() => handleFilterChange({ order: 'desc', sortBy: 'pointsCost', page: 1 })}
        values={filters}
      />

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center">
          <ClipLoader size={100} color="#1a5276" />
          <p className='mt-5 font-black uppercase italic text-gray-400 tracking-tighter'>Sincronizando Recompensas...</p>
        </div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/premios"
          onEdit={openEdit}
          onDelete={(id, name, isActive) => deleteItem(id, name, isActive)}
          pagination={pagination}
          loading={loading}
          onPageChange={(newPage) => handleFilterChange('page', newPage)}
          handleFilterChange={handleFilterChange}
          filters={filters}
        />
      )}

      {/* Este es el formulario que crearemos a continuación */}
      <RewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rewardToEdit={selectedReward}
        onRefresh={() => setFilters({ ...filters })}
      />
    </>
  );
};

export default AdminRewards;