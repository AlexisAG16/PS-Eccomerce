import { useEffect, useState } from 'react';
import { AdminModal } from '../ui/Modal';
import BaseForm from './BaseForm';
import api from '../../api/axiosConfig';
import { ClipLoader } from 'react-spinners';
import ProductFormFields from './fields/ProductFormFields'; // Extraemos los campos para limpiar el código

const ProductModal = ({ isOpen, onClose, productToEdit, onRefresh }) => {
  const isEditMode = !!productToEdit;
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setFetching(true);
      try {
        const catRes = await api.get('/categories?isActive=true&limit=100');
        const brRes = await api.get('/brands?isActive=true&limit=100');
        const discRes = await api.get('/discounts?isActive=true');

        // CATEGORÍAS (Suelen venir paginadas: data.data.data)
        const cats = catRes.data.data?.data || catRes.data.data || [];
        setCategories(cats);

        // BRANDS (Según tu JSON: data.data)
        const brs = brRes.data.data || [];
        setBrands(brs);

        setDiscounts(discRes.data.data?.data || discRes.data.data || []);

        if (isEditMode) {
          const data = { ...productToEdit };

          // 1. Manejo de Categorías (Sigue siendo Array)
          if (data.categoriesId && Array.isArray(data.categoriesId)) {
            data.categoriesId = data.categoriesId.map(c => (typeof c === 'object' ? c._id : c));
          }
          if (!data.categoriesId) data.categoriesId = [];

          // 2. Manejo de Marca (DEBE SER STRING)
          if (data.brand && typeof data.brand === 'object') {
            data.brandId = data.brand._id;
          } else if (data.brandId && typeof data.brandId === 'object') {
            data.brandId = data.brandId._id;
          } else {
            data.brandId = data.brandId || "";
          }

          data.discountRef = data.discountRef?._id || data.discountRef || "";

          // 🎯 NUEVO: Aseguramos que cargue los puntos guardados o 0 por defecto
          data.points = data.points || 0;

          setInitialData(data);
        } else {
          setInitialData({
            // IDENTIDAD
            productName: '',
            productSlug: '',
            productType: 'PHYSICAL',
            sku: '',
            description: '',
            metaDescription: '',

            // COMERCIAL
            priceRetail: 0,
            priceWholesale: 0,
            costPrice: 0,
            discountRef: '',
            showPrice: true,
            minPurchaseQty: 1,
            maxPurchaseQty: null,
            points: 0, // 🎯 NUEVO: Inicializado en 0 para nuevos productos

            // LOGÍSTICA
            dimensions: {
              width: 0,
              height: 0,
              length: 0
            },
            weight: 0,
            brandId: '',

            // CLASIFICACIÓN
            categoriesId: [],

            // STOCK
            stock: 0,
            lowStockThreshold: 10,
            trackStock: true,
            stockMode: 'SIMPLE',

            // ESTADO Y MULTIMEDIA
            isActive: true,
            images: []
          });
        }
      } catch (err) {
        console.error("Error modal productos:", err);
      } finally {
        setFetching(false);
        console.log(brands);
      }
    };
    loadData();
  }, [isOpen, productToEdit, isEditMode]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Editar: ${productToEdit?.productName}` : 'Nuevo Producto'}
      subtitle="Gestión de Inventario Patrician Software"
      maxWidth="900px" // Los productos necesitan más espacio
    >
      {fetching ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <ClipLoader color="#1a5276" size={40} />
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-4 animate-pulse">Sincronizando...</p>
        </div>
      ) : (
        <BaseForm
          initialData={initialData}
          endpoint="/products"
          isMultipart={true}
          onSuccess={() => {
            onRefresh();
            onClose();
          }}
        >
          {(formProps) => <ProductFormFields {...formProps} categories={categories} brands={brands} discounts={discounts} isEditMode={isEditMode} initialData={initialData} />}
        </BaseForm>
      )}
    </AdminModal>
  );
};

export default ProductModal;
