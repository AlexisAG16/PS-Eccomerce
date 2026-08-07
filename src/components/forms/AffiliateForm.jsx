import { useEffect, useState } from 'react';
import { AdminModal } from '../ui/Modal';
import BaseForm from './BaseForm';
import { ClipLoader } from 'react-spinners';
import AffiliateFormFields from './fields/AffiliateFormFields';

const AffiliateModal = ({ isOpen, onClose, affiliateToEdit, onRefresh }) => {
  const isEditMode = !!affiliateToEdit;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode) {
      setInitialData({
        ...affiliateToEdit,
        user: affiliateToEdit.user?._id || affiliateToEdit.user // Manejar población del objeto user
      });
    } else {
      setInitialData({
        user: null,
        affiliateCode: '',
        defaultCommission: 10,
        paymentMethod: {
          type: 'ALIAS',
          identifier: '',
          holderName: '',
          holderDocument: ''
        },
        isActive: true
      });
    }
  }, [isOpen, affiliateToEdit, isEditMode]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Configurar Afiliado: ${affiliateToEdit?.affiliateCode}` : 'Nuevo Afiliado'}
      subtitle="Socios Estratégicos y Comisiones"
      maxWidth="800px"
    >
      <BaseForm
        initialData={initialData}
        endpoint="/affiliates"
        method={isEditMode ? "PATCH" : "POST"} // Importante para tu router
        onSuccess={() => {
          onRefresh();
          onClose();
        }}
      >
        {(formProps) => <AffiliateFormFields {...formProps} isEditMode={isEditMode} />}
      </BaseForm>
    </AdminModal>
  );
};

export default AffiliateModal;
