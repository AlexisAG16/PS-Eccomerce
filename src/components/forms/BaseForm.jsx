// components/forms/BaseForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import api from '../../api/axiosConfig';

const BaseForm = ({ initialData, endpoint, successRedirect, children, isMultipart = false, onSuccess, useIdInUrl = true }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData?._id;

  const methods = useForm({ values: initialData });
  const { setError, handleSubmit } = methods;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let payload;

      if (isMultipart) {
        payload = new FormData();
        Object.keys(data).forEach(key => {
          const value = data[key];

          // 1. Imágenes
          if (key === 'images') {
            if (value && value instanceof FileList) {
              Array.from(value).forEach(file => payload.append('images', file));
            } else if (isEditMode && Array.isArray(value)) {
              value.forEach(img => payload.append('images', JSON.stringify(img)));
            }
          }
          // 2. Arrays
          else if (Array.isArray(value)) {
            value.forEach(item => payload.append(key, item));
          }
          // 3. Objetos y Coordenadas (MEJORA DE Patrician Software)
          else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
            // Caso especial de coordenadas del Mapa
            if (key === 'address' && value.location?.coordinates) {
              payload.append('address[location][type]', 'Point');
              payload.append('address[location][coordinates][]', value.location.coordinates[0]);
              payload.append('address[location][coordinates][]', value.location.coordinates[1]);
            } else {
              Object.keys(value).forEach(subKey => {
                if (value[subKey] !== undefined) payload.append(`${key}.${subKey}`, value[subKey]);
              });
            }
          }
          // 4. Primitivos
          else if (value !== undefined && value !== null && value !== '') {
            payload.append(key, value);
          }
        });
      } else {
        payload = data;
      }

      // Lógica de URL (Mezcla de ambos)
      const url = (isEditMode && useIdInUrl) ? `${endpoint}/${initialData._id}` : endpoint;
      const method = isEditMode ? 'patch' : 'post';

      await api[method](url, payload);
      toast.success(isEditMode ? 'Actualizado correctamente' : 'Creado con éxito');

      if (onSuccess) onSuccess();
      else if (successRedirect) navigate(successRedirect);

    } catch (error) {
      console.error("Fallo en BaseForm:", error);
      const responseData = error.response?.data;

      if (responseData?.errors && Array.isArray(responseData.errors)) {
        responseData.errors.forEach((err) => {
          toast.error(`${err.field}: ${err.message}`);
          setError(err.field, { type: 'manual', message: err.message });
        });
      } else {
        const errorMsg = responseData?.error || responseData?.message || "Error en el servidor";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, (err) => console.log("Errores RHF:", err))}>
      {/* Pasamos 'loading' para que los fields puedan deshabilitarse */}
      {children({ ...methods, loading })}

      <div className="flex items-center justify-center gap-4 mt-10 pb-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 max-w-[200px] py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center"
        >
          {loading ? <ClipLoader size={18} color="#fff" /> : (isEditMode ? 'Actualizar Registro' : 'Confirmar Guardado')}
        </button>

        <button
          type="button"
          onClick={onSuccess || (() => navigate(-1))}
          className="flex-1 max-w-[150px] py-4 bg-gray-100 hover:bg-gray-200 text-gray-400 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default BaseForm;
