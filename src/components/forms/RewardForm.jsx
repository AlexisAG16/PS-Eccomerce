import { useEffect, useState } from 'react';
import { AdminModal } from '../ui/Modal';
import BaseForm from './BaseForm';
import api from '../../api/axiosConfig';
import { ClipLoader } from 'react-spinners';
import RewardFormFields from './fields/RewardFormFields';

const RewardModal = ({ isOpen, onClose, rewardToEdit, onRefresh }) => {
  const isEditMode = !!rewardToEdit;
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
          const data = { ...rewardToEdit };

          // Normalizamos la categoría para el select
          if (data.config?.categoryRestriction) {
            data.config.categoryRestriction = data.config.categoryRestriction._id || data.config.categoryRestriction;
          }

          setInitialData(data);
        } else {
          setInitialData({
            title: '',
            pointsCost: 0,
            stock: -1, // Infinito por defecto
            isActive: true,
            config: {
              discountType: 'percentage',
              value: 0,
              minOrderAmount: 0,
              minItems: 0,
              categoryRestriction: ''
            }
          });
        }
      } catch (err) {
        console.error("Error modal recompensas:", err);
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [isOpen, rewardToEdit, isEditMode]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Editar Premio: ${rewardToEdit?.title}` : 'Nueva Recompensa'}
      subtitle="Tienda de Puntos Patrician Software"
      maxWidth="700px"
    >
      {fetching ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={40} />
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-4">Sincronizando...</p>
        </div>
      ) : (
        <BaseForm
          initialData={initialData}
          endpoint="/rewards"
          // Si tu endpoint de update usa PATCH/PUT con ID, BaseForm suele manejarlo
          onSuccess={() => {
            onRefresh();
            onClose();
          }}
        >
          {(formProps) => <RewardFormFields {...formProps} categories={categories} />}
        </BaseForm>
      )}
    </AdminModal>
  );
};

export default RewardModal;
