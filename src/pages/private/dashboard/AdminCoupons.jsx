import { useEffect, useState } from 'react';
import GenericFilters from '../../../components/ui/Filters';
import GenericTable from '../../../components/ui/Table';
import { useFetchTable } from '../../../hooks/useFetchTable';
import { AdminButtonModal } from '../../../components/ui/Button';
import { ClipLoader } from 'react-spinners';
import CouponModal from '../../../components/forms/CouponForm';

const columns = [
  { label: "ID", field: "_id", sortable: false },
  {
    label: "Código / Origen",
    field: "code",
    render: (val, row) => (
      <div className="flex flex-col">
        <span className="font-mono font-black text-brand-text text-sm uppercase tracking-wider">{val}</span>
        <span className="text-[10px] text-brand-text-muted italic">Origen: {row.origin || 'MARKETING_CAMPAIGN'}</span>
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
  {
    label: "Usos (Cant.)",
    field: "usedCount",
    render: (val, row) => (
      <span className="text-xs font-medium text-brand-text-muted">
        {val} / {row.usageLimit ?? '∞'}
      </span>
    )
  },
  { label: "Vigencia Inicio", field: "startDate", format: "date" },
  { label: "Vigencia Fin", field: "endDate", format: "date" },
  {
    label: "Estado",
    field: "isActive",
    render: (val, row) => {
      // Un cupón está inactivo si lo pausaron o si ya se usó en caso de ser exclusivo
      const isReallyActive = val && !row.isUsed;
      return (
        <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${isReallyActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isReallyActive ? 'Activo' : row.isUsed ? 'Canjeado' : 'Pausado'}
        </span>
      );
    }
  }
];

const AdminCoupons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Hook configurado para pegarle a /coupons en el back y /admin/cupones en el cliente
  const { data, loading, pagination, handleFilterChange, setFilters, filters, deleteItem } = useFetchTable(
    '/coupons',
    { order: 'desc', sortBy: 'createdAt', limit: 10 },
    '/admin/cupones'
  );

  const openCreate = () => { setSelectedCoupon(null); setIsModalOpen(true); };
  const openEdit = (coupon) => { setSelectedCoupon(coupon); setIsModalOpen(true); };

  const filterConfig = [
    { name: 'search', label: 'Buscar', type: 'text', placeholder: 'Código del cupón...' },
    {
      name: 'discountType',
      label: 'Tipo',
      type: 'select',
      options: [
        { label: 'Porcentual', value: 'percentage' },
        { label: 'Monto Fijo', value: 'fixed' }
      ]
    },
    {
      name: 'origin',
      label: 'Origen',
      type: 'select',
      options: [
        { label: 'Campaña Marketing', value: 'MARKETING_CAMPAIGN' },
        { label: 'Tienda de Puntos', value: 'STORE_REWARD' },
        { label: 'Manual', value: 'MANUAL' }
      ]
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <AdminButtonModal text='+ Crear Cupón' style='bg-brand-secondary' openCreate={openCreate} />
      </div>

      <GenericFilters
        config={filterConfig}
        onFilterChange={handleFilterChange}
        onClear={() => setFilters({ order: 'desc', sortBy: 'createdAt', page: 1 })}
        values={filters}
      />

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center">
          <ClipLoader color="#1a5276" size={80} />
          <p className='mt-5 text-[10px] font-black uppercase text-brand-text-muted tracking-widest'>Cargando cupones...</p>
        </div>
      ) : (
        <GenericTable
          columns={columns}
          data={data}
          route="/admin/cupones"
          onEdit={openEdit}
          onDelete={(id, name, isActive) => deleteItem(id, name, isActive)}
          pagination={pagination}
          loading={loading}
          handleFilterChange={handleFilterChange}
          filters={filters}
        />
      )}

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        couponToEdit={selectedCoupon}
        onRefresh={() => setFilters({ ...filters })}
      />
    </>
  );
};

export default AdminCoupons;