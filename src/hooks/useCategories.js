import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosConfig';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories/categories-list'); // 👈 Tu endpoint real
      return res.data;
    },
    staleTime: 1000 * 60 * 10, // ⏳ 10 minutos en caché
  });
};