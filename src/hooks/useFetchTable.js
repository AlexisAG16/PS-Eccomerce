import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import api from '../api/axiosConfig';
import Swal from 'sweetalert2'

// 1. Agregamos 'baseRoute' como parámetro (ej: '/admin/ordenes')
export const useFetchTable = (url, initialFilters = {}, baseRoute = null) => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(() => {
    const paramsFromUrl = Object.fromEntries([...searchParams]);
    return {
      ...initialFilters,
      ...paramsFromUrl, // Esto lee los filtros de la URL al cargar
      page: parseInt(pageNumber) || 1
    };
  });

  useEffect(() => {
    const urlPage = parseInt(pageNumber) || 1;
    if (filters.page !== urlPage) {
      setFilters(prev => ({ ...prev, page: urlPage }));
    }
  }, [pageNumber]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
        );
        const query = new URLSearchParams(cleanFilters).toString();
        const response = await api.get(`${url}?${query}`);
        const apiResponse = response.data; // El objeto { success, data, pagination }

        // 1. Buscamos el array de datos (data.data o data.data.data)
        // Si apiResponse.data es un Array, lo usamos. Si es un objeto con .data, entramos un nivel más.
        const rows = Array.isArray(apiResponse.data)
          ? apiResponse.data
          : (apiResponse.data?.data || []);

        setData(rows);

        // 2. Buscamos la paginación (data.pagination o data.data.pagination)
        const paginationInfo = apiResponse.pagination
          ? apiResponse.pagination
          : (apiResponse.data?.pagination || {});

        setPagination({
          ...paginationInfo,
          totalPages: paginationInfo.totalPages || paginationInfo.pages || 1
        });
      } catch (err) {
        console.error("Error en fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleFilterChange = (keyOrObject, value) => {
    let newFilters;

    if (typeof keyOrObject === 'object') {
      // 🚩 REEMPLAZO TOTAL: Ideal para "Limpiar Filtros" o cambios masivos
      newFilters = { ...keyOrObject };
    } else {
      // 🚩 ACTUALIZACIÓN PARCIAL: Ideal para inputs de texto o selects individuales
      const newPage = keyOrObject === 'page' ? value : 1;
      newFilters = { ...filters, [keyOrObject]: value, page: newPage };
    }

    // 1. Limpiar valores vacíos o nulos para que no ensucien la URL
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k] === "" || newFilters[k] === null || newFilters[k] === undefined) {
        delete newFilters[k];
      }
    });

    // 2. Actualizar estado local
    setFilters(newFilters);

    // 3. Sincronizar con la URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (k !== 'page') params.append(k, v);
    });

    const newPage = newFilters.page || 1;
    const queryString = params.toString();

    navigate(`${baseRoute}/${newPage}${queryString ? `?${queryString}` : ''}`);
  };

  const deleteItem = async (id, itemName = "este registro", isActive = true) => {
    const isRestoring = !isActive;
    const action = isRestoring ? "RESTAURAR" : "ELIMINAR";
    const pastAction = isRestoring ? "RESTAURADO" : "ELIMINADO";

    const result = await Swal.fire({
      title: `¿${action} ${itemName.toUpperCase()}?`,
      text: isRestoring
        ? "Esta acción volverá a activar el recurso en el sistema." // 👈 Corregido
        : "Esta acción desactivará el recurso, pero podrás restaurarlo después.", // 👈 Corregido
      icon: isRestoring ? 'info' : 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a5276',
      cancelButtonColor: '#f29964',
      confirmButtonText: `SÍ, ${action}`,
      cancelButtonText: 'CANCELAR',
      customClass: {
        popup: 'rounded-[2rem] border-none shadow-2xl',
        title: 'font-black italic tracking-tighter text-brand-primary',
        confirmButton: 'rounded-xl font-black px-6 py-3 uppercase tracking-widest text-[10px]',
        cancelButton: 'rounded-xl font-black px-6 py-3 uppercase tracking-widest text-[10px]'
      }
    });

    if (result.isConfirmed) {
      try {
        // Mantenemos api.delete porque tu backend sigue escuchando esa ruta aunque haga un toggle
        await api.delete(`${url}/${id}`);

        // Forzamos el refresco de los datos
        setFilters(prev => ({ ...prev }));

        Swal.fire({
          title: pastAction,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-[2rem]',
            title: 'font-black italic tracking-tighter text-brand-primary'
          }
        });
        return { success: true };
      } catch (error) {
        Swal.fire({
          title: 'ERROR',
          text: `No se pudo ${action.toLowerCase()} el recurso.`,
          icon: 'error',
          confirmButtonColor: '#1a5276',
          customClass: { popup: 'rounded-[2rem]' }
        });
        return { success: false };
      }
    }
  };

  return {
    data, loading, pagination, filters,
    handleFilterChange, setFilters,
    deleteItem // 👈 Exportamos la función
  };
};