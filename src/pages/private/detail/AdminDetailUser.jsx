import { FaUser, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaEnvelope, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import MapViewer from '../../../components/ui/MapViewer';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useParams } from 'react-router';
import api from '../../../api/axiosConfig';

const AdminDetailUser = () => {
  const { id } = useParams(); // Captura el ID de la URL: /admin/users/:id
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/${id}`);
        // Asumiendo que tu API devuelve { data: user } o simplemente el user
        setUser(data.data || data);
      } catch (err) {
        console.error("Error al traer usuario:", err);
        setError("No pudimos cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <ClipLoader color="#1a5276" size={40} />
        <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargando ficha...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-10 font-bold">{error}</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER DE FICHA */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-brand-primary uppercase tracking-tighter">
            {user.firstName} {user.lastName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {user.isActive ? 'Usuario Activo' : 'Cuenta Suspendida'}
            </span>
            <span className="text-[10px] text-gray-400">ID: {user._id}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-gray-400 uppercase">Último Acceso</p>
          <p className="text-xs font-bold text-gray-700">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLUMNA IZQUIERDA: METADATA */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 flex items-center gap-2">
              <FaShieldAlt /> Rol y Estado
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] text-gray-400">Rol del Sistema</label>
                <p className="text-sm font-black text-brand-primary uppercase">{user.role?.name || 'Usuario'}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                {user.isVerified ? <FaCheckCircle className="text-green-500" /> : <FaExclamationTriangle className="text-yellow-500" />}
                {user.isVerified ? 'Email Verificado' : 'Email Pendiente'}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 flex items-center gap-2">
              <FaCalendarAlt /> Fechas Clave
            </h3>
            <div className="space-y-3 text-xs">
              <p className="flex justify-between"><span>Registrado:</span> <b>{new Date(user.createdAt).toLocaleDateString()}</b></p>
              <p className="flex justify-between"><span>Edad:</span> <b>{user.age} años</b></p>
              <p className="flex justify-between"><span>Género:</span> <b>{user.gender}</b></p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: INFO Y UBICACIÓN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-[10px] font-black text-gray-400 uppercase mb-4 flex items-center gap-2">
              <FaUser /> Información de Contacto
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[8px] uppercase text-gray-400 font-bold">Email</label>
                <p className="text-sm font-bold text-gray-700">{user.email}</p>
              </div>
              <div>
                <label className="text-[8px] uppercase text-gray-400 font-bold">Teléfono</label>
                <p className="text-sm font-bold text-gray-700">{user.phone || 'No registrado'}</p>
              </div>
            </div>
          </div>

          {/* DIRECCIÓN CON MAPA */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-[10px] font-black text-gray-400 uppercase mb-4 flex items-center gap-2">
              <FaMapMarkerAlt /> Ubicación (GeoJSON)
            </h2>
            {user.address?.location?.coordinates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-brand-primary uppercase">{user.address.alias}</p>
                  <p className="text-sm font-bold">{user.address.street} {user.address.number}</p>
                  <p className="text-xs text-gray-500">{user.address.city}</p>
                  {user.address.apartment && <p className="text-[10px] text-gray-400 italic">Dpto: {user.address.apartment}</p>}
                </div>
                <div className="h-32 rounded-2xl overflow-hidden border border-gray-200">
                  <MapViewer coords={user.address.location.coordinates} />
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No hay ubicación registrada.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDetailUser;