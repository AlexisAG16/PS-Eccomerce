import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { AdminButtonModal } from '../../../components/ui/Button';
import { ClipLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import { BadgeStock } from '../../../components/ui/Badge';
import { Link } from 'react-router';
import ProductModal from '../../../components/forms/ProductForm';

const columns = [
  { label: "ID", field: "_id", sortable: false },
  {
    label: "Producto",
    field: "productName",
    render: (val, row) => (
      <div className="flex flex-col">
        <span className="font-bold text-brand-text uppercase italic tracking-tighter leading-none mb-1">{val}</span>
        <span className="text-[9px] text-brand-secondary font-mono">SKU: {row.sku}</span>
      </div>
    )
  },
  {
    label: "Categorías",
    field: "categories", sortable: false, // Cambia 'categoriesData' por el nombre real de tu modelo
    render: (value) => (
      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
        {value?.map((cat, index) => (
          <Link
            key={cat._id}
            to={`/admin/categorias/${cat._id}`}
            onClick={(e) => e.stopPropagation()}
            className="..."
          >
            {cat.categoryName}
          </Link>
        ))}
      </div>
    )
  },
  {
    label: "Marca",
    field: "brand",
    sortable: false,
    render: (brand) => {
      if (!brand) return <span className="text-brand-text-muted italic text-[10px]">-</span>;

      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-brand-border overflow-hidden bg-brand-surface shadow-sm shrink-0">
            <img
              src={brand.logo || "https://via.placeholder.com/50"}
              className="w-full h-full object-contain"
              alt={brand.name}
            />
          </div>
          <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-tighter">
            {brand.name}
          </span>
        </div>
      );
    }
  },
  { label: "Imagen", field: "images", format: "image", sortable: false },
  {
    label: "Precio",
    field: "priceRetail",
    render: (val) => <span className="font-mono font-bold text-brand-text">${val?.toLocaleString('es-AR')}</span>
  },
  { label: "Stock", field: "stock", render: (val) => <BadgeStock stock={val} /> },
  { label: "Creado", field: "createdAt", format: "date" }
];

const AdminProducts = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/products',
    { order: 'desc', sortBy: 'createdAt', limit: 10 },
    '/admin/productos'
  );

  // 2. Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories?isActive=true&limit=100');

        setCategories(res.data.data.data || []);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  const openCreate = () => { setSelectedProduct(null); setIsModalOpen(true); };
  const openEdit = (product) => { setSelectedProduct(product); setIsModalOpen(true); };

  // 3. Definimos filterConfig AQUÍ ADENTRO para que tenga acceso a 'categories'
  const filterConfig = [
    { name: 'search', label: 'Buscar', type: 'text', placeholder: 'Nombre o SKU...' },
    {
      name: 'categoryId',
      label: 'Categoría',
      type: 'select',
      options: categories.map(cat => ({ label: cat.categoryName, value: cat._id }))
    },
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
      name: 'stockStatus',
      label: 'Stock',
      type: 'select',
      options: [
        { label: 'Bajo stock', value: 'low' },
        { label: 'Sin stock', value: 'out' }
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
          text='+ Crear Nuevo'
          style='bg-brand-secondary hover:bg-brand-bg'
          openCreate={openCreate} // 👈 CAMBIA 'route' POR ESTO
        />
      </div>

      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        onClear={() => handleFilterChange({ order: 'desc', sortBy: 'createdAt', page: 1 })}
        values={filters}
      />

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center"><ClipLoader size={100} /> <p className='mt-5'>Cargando...</p></div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/productos"
          onEdit={openEdit}
          onDelete={(id, name, isActive) => deleteItem(id, name, isActive)}
          pagination={pagination}
          loading={loading}
          onPageChange={(newPage) => handleFilterChange('page', newPage)}
          handleFilterChange={handleFilterChange}
          filters={filters}
        />

      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={selectedProduct}
        onRefresh={() => setFilters({ ...filters })}
      />
    </>
  );
};

export default AdminProducts;