import { useEffect, useState } from 'react';
import { AdminModal } from '../ui/Modal';
import BaseForm from './BaseForm';
import { ClipLoader } from 'react-spinners';
import CategoryFormFields from './fields/CategoryFormFields';

const CategoryModal = ({ isOpen, onClose, categoryToEdit, onRefresh }) => {
  const isEditMode = !!categoryToEdit;
  const [fetching, setFetching] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = () => {
      setFetching(true);
      try {
        if (isEditMode) {
          // Normalizamos por si vienen campos extra o nulos
          setInitialData({
            ...categoryToEdit,
            categoryName: categoryToEdit.categoryName || '',
            categorySlug: categoryToEdit.categorySlug || '',
            isActive: categoryToEdit.isActive ?? true
          });
        } else {
          setInitialData({
            categoryName: '',
            categorySlug: '',
            isActive: true
          });
        }
      } catch (err) {
        console.error("Error al cargar categoría:", err);
      } finally {
        // Un pequeño delay para que el usuario sienta la "sincronización" (opcional)
        setTimeout(() => setFetching(false), 300);
      }
    };

    loadData();
  }, [isOpen, categoryToEdit, isEditMode]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Editar: ${categoryToEdit?.categoryName}` : 'Nueva Categoría'}
      subtitle="Clasificación de Inventario Patrician Software"
    >
      {fetching ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={40} />
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-4 animate-pulse">Sincronizando...</p>
        </div>
      ) : (
        <BaseForm
          initialData={initialData}
          endpoint="/categories"
          onSuccess={() => {
            onRefresh();
            onClose();
          }}
        >
          {(formProps) => (
            <CategoryFormFields
              {...formProps}
              isEditMode={isEditMode}
            />
          )}
        </BaseForm>
      )}
    </AdminModal>
  );
};

export default CategoryModal;
