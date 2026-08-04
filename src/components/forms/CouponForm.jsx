import { useEffect, useState } from 'react';
import { AdminModal } from '../ui/Modal';
import BaseForm from './BaseForm';
import api from '../../api/axiosConfig';
import { ClipLoader } from 'react-spinners';
import CouponFormFields from './fields/CouponFormFields';

const CouponModal = ({ isOpen, onClose, couponToEdit, onRefresh }) => {
  const isEditMode = !!couponToEdit;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // Necesitamos productos también
  const [fetching, setFetching] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const loadData = async () => {
      setFetching(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories?isActive=true'),
          api.get('/products?isActive=true')
        ]);
        setCategories(catRes.data.data?.data || []);
        setProducts(prodRes.data.data?.data || []);

        if(isEditMode) {
          setInitialData({
            ...couponToEdit,
            startDate: new Date(couponToEdit.startDate).toISOString().split('T')[0],
            endDate: new Date(couponToEdit.endDate).toISOString().split('T')[0],
            applicableCategories: couponToEdit.applicableCategories?.map(c => c._id || c) || [],
            applicableProducts: couponToEdit.applicableProducts?.map(p => p._id || p) || [],

            // 🔥 NUEVOS CAMPOS EN MODO EDICIÓN
            usagePerUser: couponToEdit.usagePerUser ?? 1,
            minOrderAmount: couponToEdit.minOrderAmount ?? 0,
            minItems: couponToEdit.minItems ?? 0,
            maxDiscountAmount: couponToEdit.maxDiscountAmount ?? '' // Usamos '' para que el input numérico no muestre un 0 molesto si vino null
          });
        } else {
          setInitialData({
            code: '',
            discountType: 'percentage',
            value: 0,
            minOrderAmount: 0,
            usageLimit: '',
            minItems: 0,
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            isActive: true,
            applicableCategories: [],
            applicableProducts: [],

            // 🔥 NUEVOS CAMPOS EN MODO CREACIÓN
            usagePerUser: 1,         // Por defecto restringido a 1 uso por cliente
            maxDiscountAmount: ''    // Vacío por defecto
          });
        }
      } catch (err) { console.error(err); }
      finally { setFetching(false); }
    };
    loadData();
  }, [isOpen, couponToEdit, isEditMode]);

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Cupón" : "Crear Nuevo Cupón"} maxWidth="800px">
      {fetching ? <div className="py-20 flex justify-center"><ClipLoader size={40} /></div> :
        <BaseForm initialData={initialData} endpoint="/coupons" onSuccess={() => { onRefresh(); onClose(); }}>
          {(formProps) => <CouponFormFields {...formProps} categories={categories} products={products} />}
        </BaseForm>
      }
    </AdminModal>
  );
};
export default CouponModal;