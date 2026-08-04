import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../api/axiosConfig';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user); // Si hay token, cargamos user
        console.log(res.data.user);
        
      } catch (error) {
        // Si falla (401), simplemente es un invitado.
        // Seteamos user en null y NO tiramos error.
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    // Asegúrate de que userData incluya la estructura correcta del rol
    setUser(userData);
  };

  const logout = async () => {
    try {
      // ✅ Axios debe tener { withCredentials: true } globalmente o aquí
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Error al cerrar sesión en server", err);
    } finally {
      // Si la cookie es HttpOnly, esto de abajo solo sirve si NO es HttpOnly.
      // Pero no hace daño dejarlo.
      Cookies.remove('token');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const can = (permission) => {
    if (!user || !user.role) return false;

    // 1. Si es super_admin, pase libre total
    // Ojo: checkeamos si role es string o objeto
    const roleName = typeof user.role === 'object' ? user.role.name : user.role;
    if (roleName === 'super_admin') return true;

    // 2. Extraemos los permisos manejando ambos casos
    let userPermissions = [];

    // CASO A: Vienen del JWT o Login (Array de Strings: ["read:orders"])
    if (user.permissions && Array.isArray(user.permissions)) {
      userPermissions = user.permissions;
    }
    // CASO B: Vienen de /auth/me (Array de Objetos: [{name: "read:orders"}])
    else if (user.role?.permissions && Array.isArray(user.role.permissions)) {
      userPermissions = user.role.permissions.map(p =>
        typeof p === 'string' ? p : p.name
      );
    }

    return userPermissions.includes(permission);
  };

  const hasAccessLevel = (minLevel) => {
    if (!user || !user.role || typeof user.role !== 'object') return false;
    return user.role.level >= minLevel;
  };

  const updatePoints = (newPoints) => {
    setUser(prevUser => ({
      ...prevUser,
      points: newPoints
    }));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updatePoints, login, logout, can, loading, hasAccessLevel }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
