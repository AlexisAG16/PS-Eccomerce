import { useEffect, useState } from 'react';
import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { AdminButtonModal } from '../../../components/ui/Button';
import { ClipLoader } from 'react-spinners';
import api from '../../../api/axiosConfig';
import DiscountModal from '../../../components/forms/DiscountForm';

const columns = [
  { label: "ID", field: "_id", sortable: false },
  {
    label: "Evento / Nombre",
    field: "name",
    render: (val, row) => (
      <div className="flex flex-col">
        <span className="font-bold text-brand-text uppercase tracking-tighter">{val}</span>
        <span className="text-[10px] text-brand-text-muted italic">{row.description || 'Sin descripción'}</span>
      </div>
    )
  },
  {
    label: "Valor",
    field: "value",
    render: (val, row) => (
      <span className="font-mono font-black text-brand-text bg-brand-bg px-2 py-1 rounded-lg">
        {row.discountType === 'percentage' ? `${val}%` : `$${val.toLocaleString('es-AR')}`}
      </span>
    )
  },
  { label: "Inicio", field: "startDate", format: "date" },
  { label: "Fin", field: "endDate", format: "date" },
  {
    label: "Estado",
    field: "isActive",
    render: (val) => (
      <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${val ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {val ? 'Activo' : 'Pausado'}
      </span>
    )
  }
];

const AdminDiscounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/discounts', // Asegúrate de que esta sea tu ruta en el backend
    { order: 'desc', sortBy: 'createdAt', limit: 10 },
    '/admin/descuentos'
  );

  const openCreate = () => { setSelectedDiscount(null); setIsModalOpen(true); };
  const openEdit = (discount) => { setSelectedDiscount(discount); setIsModalOpen(true); };

  const filterConfig = [
    { name: 'search', label: 'Buscar', type: 'text', placeholder: 'Nombre del evento...' },
    {
      name: 'discountType',
      label: 'Tipo',
      type: 'select',
      options: [
        { label: 'Porcentual', value: 'percentage' },
        { label: 'Monto Fijo', value: 'fixed' }
      ]
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <AdminButtonModal text='+ Crear Descuento' style='bg-brand-secondary' openCreate={openCreate} />
      </div>

      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        onClear={() => setFilters({ order: 'desc', sortBy: 'createdAt', page: 1 })}
        values={filters}
      />

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center"><ClipLoader color="#1a5276" size={80} /> <p className='mt-5 text-[10px] font-black uppercase text-brand-text-muted tracking-widest'>Cargando promociones...</p></div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/descuentos"
          onEdit={openEdit}
          onDelete={(id, name, isActive) => deleteItem(id, name, isActive)}
          pagination={pagination}
          loading={loading}
          handleFilterChange={handleFilterChange}
          filters={filters}
        />
      )}

      <DiscountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        discountToEdit={selectedDiscount}
        onRefresh={() => setFilters({ ...filters })}
      />
    </>
  );
};

export default AdminDiscounts;