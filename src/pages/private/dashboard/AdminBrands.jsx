import { useState } from 'react';
import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { ClipLoader } from 'react-spinners';
import BrandModal from '../../../components/forms/BrandForm';
import { AdminButtonModal } from '../../../components/ui/Button';

const columns = [
  { label: "ID", field: "_id", sortable: false },
  {
    label: "Marca",
    field: "name",
    render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-gray-100 overflow-hidden bg-white shadow-sm shrink-0">
          <img
            src={row.logo || "https://via.placeholder.com/50"}
            className="w-full h-full object-contain"
            alt={val}
          />
        </div>
        <span className="font-black text-brand-primary uppercase italic tracking-tighter">
          {val}
        </span>
      </div>
    )
  },
  { label: "Slug", field: "slug", render: (val) => <code className="text-[10px] text-brand-secondary font-mono">/{val}</code> },
  { label: "Creado", field: "createdAt", format: "date" }
];

const filterConfig = [
  { name: 'search', label: 'Buscar', type: 'text', placeholder: 'Nombre o slug...' },
  {
    name: 'isActive',
    label: 'Estado',
    type: 'select',
    options: [
      { label: 'Activas', value: 'true' },
      { label: 'Inactivas', value: 'false' }
    ]
  },
  {
    name: 'order',
    label: 'Orden',
    type: 'select',
    options: [
      { label: 'A-Z', value: 'asc' },
      { label: 'Z-A', value: 'desc' }
    ]
  }
];

const AdminBrands = () => {
  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/brands',
    // 🚩 Cambiamos el valor inicial para que coincida con el select de "Orden" (que por defecto es name)
    { order: 'asc', sortBy: 'name', limit: 10 },
    '/admin/marcas'
  );

  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const openCreate = () => { setSelectedBrand(null); setIsModalOpen(true); };
  const openEdit = (brand) => { setSelectedBrand(brand); setIsModalOpen(true); };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <AdminButtonModal
          text='+ Crear Nuevo'
          style='bg-brand-secondary hover:bg-brand-bg'
          openCreate={openCreate} // 👈 CAMBIA 'route' POR ESTO
        />
      </div>

      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        onEdit={openEdit}
        onClear={() => handleFilterChange({
          order: 'desc',
          sortBy: 'createdAt',
          page: 1
        })}
        values={filters}
      />

      {loading ? (
        <div className="py-20 flex flex-col items-center"><ClipLoader size={60} color="#1a5276" /></div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/marcas"
          onEdit={openEdit}
          // Pasamos los datos exactos para el SweetAlert
          onDelete={(id, name, isActive) => deleteItem(id, name, isActive)}
          pagination={pagination}
          loading={loading}
          // Usamos el handleFilterChange que actualiza URL y Estado
          handleFilterChange={handleFilterChange}
          filters={filters}
        />
      )}

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brandToEdit={selectedBrand}
        onRefresh={() => setFilters({ ...filters })}
      />
    </>
  );
};

export default AdminBrands;