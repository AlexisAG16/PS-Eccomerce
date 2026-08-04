import { useEffect, useState } from 'react';
import { AdminModal } from '../ui/Modal';
import BaseForm from './BaseForm';
import { ClipLoader } from 'react-spinners';
import BrandFormFields from './fields/BrandFormFields';

const BrandModal = ({ isOpen, onClose, brandToEdit, onRefresh }) => {
  const isEditMode = !!brandToEdit;
  const [fetching, setFetching] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = () => {
      setFetching(true);
      if (isEditMode) {
        setInitialData({
          ...brandToEdit,
          name: brandToEdit.name || '',
          slug: brandToEdit.slug || '',
          logo: brandToEdit.logo || '',
          isActive: brandToEdit.isActive ?? true
        });
      } else {
        setInitialData({
          name: '',
          slug: '',
          logo: '',
          isActive: true
        });
      }
      // Simulamos el fetching para coherencia visual
      setTimeout(() => setFetching(false), 300);
    };

    loadData();
  }, [isOpen, brandToEdit, isEditMode]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Editar: ${brandToEdit?.name}` : 'Nueva Marca'}
      subtitle="Identidad de Marca Patrician Software"
    >
      {fetching ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={40} />
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-4 animate-pulse">Sincronizando...</p>
        </div>
      ) : (
        <BaseForm
          initialData={initialData}
          endpoint="/brands"
          onSuccess={() => {
            onRefresh();
            onClose();
          }}
        >
          {(formProps) => (
            <BrandFormFields
              {...formProps}
              isEditMode={isEditMode}
            />
          )}
        </BaseForm>
      )}
    </AdminModal>
  );
};

export default BrandModal;
