import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null; // Esperamos a que el AuthContext valide la sesión

  // 1. Si no hay usuario, mandamos al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Si hay roles permitidos definidos, verificamos el rol del usuario
  // Comparamos contra user.role.name (que es lo que viene de tu DB poblada)
  if (allowedRoles && !allowedRoles.includes(user.role?.name)) {
    return <Navigate to="/forbidden" replace />;
  }

  // 3. Si todo está ok, renderizamos la ruta hija
  return <Outlet />;
};

export default ProtectedRoute;