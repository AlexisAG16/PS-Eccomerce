import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router';

const AVAILABLE_GAMES = ['scratch', 'flappy', 'simon', 'ruleta', 'memory'];

const columns = [
  {
    label: "Juego",
    field: "gameName",
    render: (val) => (
      <span className="font-black text-brand-text uppercase italic tracking-tighter text-lg">
        {val}
      </span>
    )
  },
  {
    label: "Estado",
    field: "isActive",
    render: (val) => (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
        {val ? 'Activo' : 'Inactivo'}
      </span>
    )
  },
  {
    label: "Configuración",
    field: "config",
    sortable: false,
    render: (_, row) => (
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-brand-text-muted font-mono">
          {row.gameName === 'scratch' ? 'Premios: ' + row.config?.prizes?.length : 'Config: Custom'}
        </span>
      </div>
    )
  },
  {
    label: "Última Modificación",
    field: "updatedAt",
    format: "date"
  },
  {
    label: "Acciones",
    field: "_id",
    sortable: false,
    render: (_, row) => (
      <Link
        to={`/admin/minijuegos/detalle/${row.gameName}`}
        className="bg-brand-secondary text-white px-4 py-1.5 rounded-md text-[11px] font-bold uppercase hover:bg-brand-bg transition-colors"
      >
        Configurar Premios
      </Link>
    )
  }
];

const filterConfig = [
  { name: 'search', label: 'Buscar Juego', type: 'text', placeholder: 'Nombre...' },
  {
    name: 'isActive',
    label: 'Estado',
    type: 'select',
    options: [
      { label: 'Todos', value: '' },
      { label: 'Activos', value: 'true' },
      { label: 'Inactivos', value: 'false' }
    ]
  }
];

const AdminMinigameDashboard = () => {
  // Usamos tu hook useFetchTable apuntando a la ruta de games
  const {
    data,
    loading,
    pagination,
    handleFilterChange,
    filters,
    deleteItem
  } = useFetchTable(
    '/games/config', // Tu endpoint de backend
    { order: 'desc', sortBy: 'createdAt', limit: 10 },
    '/admin/minijuegos'
  );

  const filteredData = data?.filter(game => AVAILABLE_GAMES.includes(game.gameName)) || [];

  return (
    <>
      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        onClear={() => handleFilterChange({ order: 'desc', sortBy: 'createdAt', page: 1 })}
        values={filters}
      />

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center">
          <ClipLoader size={100} color="#your-brand-color" />
          <p className='mt-5 font-bold uppercase italic text-brand-text-muted'>Cargando Arena de Juegos...</p>
        </div>
      ) : (
        <GenericTable
          columns={columns}
          data={filteredData}
          route="/admin/minijuegos"
          // La edición la manejamos por el Link del render, no por modal
          onDelete={(id, name, isActive) => deleteItem(id, name, isActive)}
          pagination={pagination}
          loading={loading}
          isDeletable={false}
          isEditable={false}
          onPageChange={(newPage) => handleFilterChange('page', newPage)}
          handleFilterChange={handleFilterChange}
          filters={filters}
        />
      )}
    </>
  );
};

export default AdminMinigameDashboard;