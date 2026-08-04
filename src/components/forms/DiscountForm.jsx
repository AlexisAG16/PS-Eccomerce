import { useEffect, useState } from 'react';
import { AdminModal } from '../ui/Modal';
import BaseForm from './BaseForm';
import api from '../../api/axiosConfig';
import { ClipLoader } from 'react-spinners';
import DiscountFormFields from './fields/DiscountFormFields';

const DiscountModal = ({ isOpen, onClose, discountToEdit, onRefresh }) => {
  const isEditMode = !!discountToEdit;
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setFetching(true);
      try {
        const catRes = await api.get('/categories?isActive=true&limit=100');
        setCategories(catRes.data.data?.data || catRes.data.data || []);

        if (isEditMode) {
          // Formateamos fechas para el input de HTML date (YYYY-MM-DD)
          const data = {
            ...discountToEdit,
            startDate: discountToEdit.startDate ? new Date(discountToEdit.startDate).toISOString().split('T')[0] : '',
            endDate: discountToEdit.endDate ? new Date(discountToEdit.endDate).toISOString().split('T')[0] : '',
            applicableCategories: discountToEdit.applicableCategories?.map(c => typeof c === 'object' ? c._id : c) || []
          };
          setInitialData(data);
        } else {
          setInitialData({
            name: '',
            description: '',
            discountType: 'percentage',
            value: 0,
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            isActive: true,
            applicableCategories: []
          });
        }
      } catch (err) { console.error(err); }
      finally { setFetching(false); }
    };
    loadData();
  }, [isOpen, discountToEdit, isEditMode]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Editar: ${discountToEdit?.name}` : 'Crear Campaña de Descuento'}
      subtitle="Promociones y Ofertas Patrician Software"
      maxWidth="700px"
    >
      {fetching ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={40} />
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-4">Sincronizando fechas...</p>
        </div>
      ) : (
        <BaseForm
          initialData={initialData}
          endpoint="/discounts"
          onSuccess={() => { onRefresh(); onClose(); }}
        >
          {(formProps) => <DiscountFormFields {...formProps} control={formProps.control} categories={categories} />}
        </BaseForm>
      )}
    </AdminModal>
  );
};

export default DiscountModal;
