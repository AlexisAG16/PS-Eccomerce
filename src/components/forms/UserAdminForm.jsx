import { useContext, useEffect, useState } from 'react';
import { AdminModal } from '../ui/Modal';
import BaseForm from './BaseForm';
import api from '../../api/axiosConfig';
import { ClipLoader } from 'react-spinners';
import { AuthContext } from '../../contexts/AuthContext';
import UserAdminFormFields from './fields/UserAdminFormFields';

const UserModal = ({ isOpen, onClose, userToEdit, onRefresh }) => {
  const { user: currentUser } = useContext(AuthContext);
  const isEditMode = !!userToEdit;
  const [roles, setRoles] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const filteredRoles = roles.filter(r => {
    if (!currentUser?.role?.level) return false; // Si no hay nivel, no permitas nada
    return currentUser.role.level > r.level;
  });

  useEffect(() => {
    if (!isOpen) return;

    const loadRoles = async () => {
      setFetching(true);
      try {
        const res = await api.get('/roles'); // Ajusta según tu ruta de roles
        setRoles(res.data.data || res.data || []);

        if (isEditMode) {
          const data = { ...userToEdit };

          // Formatear fecha para el input type="date" (YYYY-MM-DD)
          if (data.birthDate) {
            data.birthDate = new Date(data.birthDate).toISOString().split('T')[0];
          }

          // Asegurar que el rol sea el ID para el select
          if (data.role && typeof data.role === 'object') {
            data.role = data.role._id;
          }

          setInitialData(data);
        } else {
          setInitialData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthDate: '',
            gender: 'MASCULINO',
            phone: '',
            role: '',
            isActive: true,
            isVerified: false,
            address: {
              alias: 'Casa',
              street: '',
              number: '',
              apartment: '',
              city: 'San Fernando del Valle de Catamarca',
              postalCode: '',
              location: {
                type: 'Point',
                coordinates: [-65.785, -28.466] // Coordenadas por defecto
              }
            }
          });
        }
      } catch (err) {
        console.error("Error al cargar roles:", err);
      } finally {
        setFetching(false);
      }
    };

    loadRoles();
  }, [isOpen, userToEdit, isEditMode]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Editar: ${userToEdit?.firstName} ${userToEdit?.lastName}` : 'Registrar Nuevo Usuario'}
      subtitle="Gestión de Personal y Clientes"
      maxWidth="800px"
    >
      {fetching ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={40} />
          <p className="text-[10px] font-black text-gray-400 uppercase mt-4 animate-pulse">Cargando Roles...</p>
        </div>
      ) : (
        <BaseForm
          initialData={initialData}
          endpoint="/users"
          onSuccess={() => {
            onRefresh();
            onClose();
          }}
        >
          {(formProps) => <UserAdminFormFields {...formProps} roles={filteredRoles} isEditMode={isEditMode} />}
        </BaseForm>
      )}
    </AdminModal>
  );
};

export default UserModal;