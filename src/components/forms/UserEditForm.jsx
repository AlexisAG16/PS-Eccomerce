import { useEffect, useState } from 'react';
import { AdminModal } from '../ui/Modal';
import BaseForm from './BaseForm';
import { ClipLoader } from 'react-spinners';
import UserFormFields from './UserProfileEditForm';

const UserModal = ({ isOpen, onClose, userToEdit, onRefresh }) => {
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (isOpen && userToEdit) {
      setInitialData({
        ...userToEdit,
        birthDate: userToEdit.birthDate ? new Date(userToEdit.birthDate).toISOString().split('T')[0] : '',
      });
    } else {
      setInitialData(null); // 👈 Limpia la data al cerrar para que el ClipLoader actúe al re-abrir
    }
  }, [isOpen, userToEdit]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil"
      subtitle="Patrician Software Identity System"
      maxWidth="600px"
    >
      {!initialData ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={40} />
        </div>
      ) : (
          // En UserModal.jsx
          <BaseForm
            initialData={initialData}
            endpoint="/users/my-profile"
            useIdInUrl={false} // 👈 Cambiado de 'useId' a 'useIdInUrl'
            onSuccess={() => {
              onRefresh();
              onClose();
            }}
          >
            {(methods) => (
              <UserFormFields
                {...methods}
                isEditMode={true}
              />
            )}
          </BaseForm>
      )}
    </AdminModal>
  );
};

export default UserModal;
