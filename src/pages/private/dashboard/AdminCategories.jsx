import { useState } from 'react';
import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { AdminButtonModal } from '../../../components/ui/Button';
import { ClipLoader } from 'react-spinners';
import CategoryModal from '../../../components/forms/CategoryForm';

const columns = [
  { label: "ID", field: "_id", sortable: false },
  {
    label: "Categoría",
    field: "categoryName",
    render: (val, row) => (
      <div className="flex items-center gap-3">
        <span className={`font-black uppercase italic tracking-tighter text-base ${row.isActive ? 'text-brand-text' : 'text-brand-text-muted'}`}>
          {val} {!row.isActive && "(INACTIVO)"}
        </span>
      </div>
    )
  },
  {
    label: "Ruta SEO",
    field: "categorySlug",
    render: (val) => <code className="text-[10px] text-brand-text-muted bg-brand-surface px-2 py-1 rounded">/catalogo/{val}</code>
  },
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

const AdminCategories = () => {
  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/categories',
    { order: 'asc', sortBy: 'categoryName', limit: 10 },
    '/admin/categorias'
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openCreate = () => { setSelectedCategory(null); setIsModalOpen(true); };
  const openEdit = (category) => { setSelectedCategory(category); setIsModalOpen(true); };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <AdminButtonModal
          text='+ Crear Nuevo'
          style='bg-brand-secondary hover:bg-brand-bg'
          openCreate={openCreate}
        />
      </div>

      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        // 🚩 CORRECCIÓN 1: Pasar los valores actuales de los filtros
        values={filters}
        // 🚩 CORRECCIÓN 2: Usar handleFilterChange con el objeto base para limpiar
        onClear={() => handleFilterChange({
          page: 1,
          order: 'asc',
          sortBy: 'categoryName'
        })}
      />

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center">
          <ClipLoader size={80} color="#1a5276" />
          <p className="mt-4 text-[10px] font-black text-brand-text-muted uppercase tracking-[0.3em] animate-pulse">
            Cargando Estructura...
          </p>
        </div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/categorias"
          onEdit={openEdit}
          // 🚩 RECOMENDACIÓN: Pasar los argumentos para que el modal de borrado sea descriptivo
          onDelete={(id, name, isActive) => deleteItem(id, name, isActive)}
          pagination={pagination}
          loading={loading}
          handleFilterChange={handleFilterChange}
          filters={filters}
        />
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={selectedCategory}
        onRefresh={() => setFilters({ ...filters })}
      />
    </>
  );
};

export default AdminCategories;