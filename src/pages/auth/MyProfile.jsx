import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';
import { FaUser, FaMapMarkerAlt, FaLock, FaCheckCircle, FaExclamationTriangle, FaTicketAlt, FaCopy, FaShoppingBag } from 'react-icons/fa'; // 👈 Agregué FaShoppingBag
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import UserModal from '../../components/forms/UserEditForm';
import MapViewer from '../../components/ui/MapViewer';
import OrdersMyModal from './OrdersMyModal';

const MyProfile = () => {
  const { user, loading } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false); // 👈 2. Estado para el modal de órdenes
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  useEffect(() => {
    const fetchMyCoupons = async () => {
      try {
        const response = await api.get('/coupons/my-coupons');
        if (response.data.success) {
          setCoupons(response.data.data);
        }
      } catch (error) {
        console.error("Error cargando cupones:", error);
      } finally {
        setLoadingCoupons(false);
      }
    };

    if (user) fetchMyCoupons();
  }, [user]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`¡Código ${code} copiado!`);
  };

  const handlePasswordReset = async () => {
    setIsSendingReset(true);
    try {
      await api.post('/auth/forgot-password', { email: user.email });
      toast.success("Enviamos un enlace a tu email para cambiar la contraseña");
    } catch (error) {
      toast.error("No se pudo enviar el correo de recuperación");
    } finally {
      setIsSendingReset(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <ClipLoader color="#1a5276" size={50} />
        <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Cargando identidad...</p>
      </div>
    );
  }

  if (!user) return <p className="text-center mt-10 font-bold uppercase text-gray-400">Sesión no encontrada.</p>;

  return (
    <div className="max-w-5xl mx-auto min-h-screen p-4 md:p-10">

      {/* HEADER DE PERFIL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-100 pb-8">
        <div>
          <nav className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2">Mi Cuenta / Perfil</nav>
          <h1 className="text-4xl font-black text-brand-text uppercase italic tracking-tighter flex items-center gap-3">
            {user.firstName} <span className="text-brand-primary">{user.lastName}</span>
          </h1>
        </div>

        <div className="flex gap-3 mt-6 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer bg-brand-surface text-brand-text px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md active:scale-95"
          >
            Editar Datos
          </button>

          <button
            onClick={handlePasswordReset}
            disabled={isSendingReset}
            className="cursor-pointer bg-brand-secondary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {isSendingReset ? <ClipLoader size={12} color="#fff" /> : <FaLock />}
            Cambiar Contraseña
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA: RESUMEN RÁPIDO */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-primary p-8 rounded-4xl text-white shadow-xl relative overflow-hidden group">
            <FaUser className="absolute -right-4 -bottom-4 text-white/10 text-9xl group-hover:scale-110 transition-transform" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">Puntos Acumulados</p>
            <h2 className="text-5xl font-black italic tracking-tighter">{user.points || 0}</h2>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase">
              {user.isVerified ? <FaCheckCircle className="text-green-400" /> : <FaExclamationTriangle className="text-yellow-400" />}
              {user.isVerified ? 'Cuenta Verificada' : 'Pendiente Verificación'}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-4xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Detalles de cuenta</h3>
            <div className="space-y-3">
              <p className="text-xs text-gray-600 flex justify-between"><span>Registrado:</span> <span className="font-bold">{new Date(user.createdAt).toLocaleDateString()}</span></p>
              {/* <p className="text-xs text-gray-600 flex justify-between"><span>Edad:</span> <span className="font-bold">{user.age || 'N/A'} años</span></p> */}
              <p className="text-xs text-gray-600 flex justify-between"><span>Género:</span> <span className="font-bold text-brand-secondary uppercase">{user.gender || 'N/A'}</span></p>
              <p className="text-xs text-gray-600 flex justify-between"><span>Rango:</span> <span className="font-bold">{user.role?.name || 'Usuario'}</span></p>
            </div>
          </div>

          {/* 🎯 BOTÓN "VER MIS ÓRDENES" (Nuevo bloque en la columna izquierda) */}
          <button
            onClick={() => setIsOrdersOpen(true)}
            className="w-full cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white p-5 rounded-4xl flex items-center justify-between group transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                <FaShoppingBag className="text-white text-xs" />
              </span>
              <div className="text-left">
                <p className="text-[11px] font-black uppercase tracking-widest text-white">Ver Mis Órdenes</p>
                <p className="text-[9px] text-zinc-400 font-medium">Historial completo de compras</p>
              </div>
            </div>
            <span className="text-zinc-500 group-hover:translate-x-1 transition-transform text-xs font-bold">→</span>
          </button>
        </div>

        {/* COLUMNA DERECHA: DATOS Y DIRECCIÓN */}
        <div className="lg:col-span-2 space-y-8">
          {/* SECCIÓN DE MIS CUPONES */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 relative">
            <h2 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <FaTicketAlt className="text-brand-primary text-xs" />
              </span>
              Mis Cupones Canjeados
            </h2>

            {loadingCoupons ? (
              <div className="py-4 flex justify-center"><ClipLoader size={20} color="#1a5276" /></div>
            ) : coupons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="relative group bg-brand-surface border border-gray-100 p-5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white rounded-full -translate-y-1/2 shadow-inner"></div>
                    <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white rounded-full -translate-y-1/2 shadow-inner"></div>

                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-secondary">
                        {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                      </p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter italic">
                        Exp: {new Date(coupon.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-2 mt-2">
                      <code className="text-sm font-black text-brand-text tracking-wider">{coupon.code}</code>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-brand-primary active:scale-90"
                        title="Copiar Código"
                      >
                        <FaCopy size={12} />
                      </button>
                    </div>

                    <p className="text-[8px] text-gray-400 mt-3 font-medium uppercase tracking-widest">
                      * Min. compra: ${coupon.minOrderAmount}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 italic text-sm">Aún no tienes cupones activos.</p>
                <p className="text-[9px] uppercase font-black text-brand-primary mt-2">¡Canjea tus puntos por premios!</p>
              </div>
            )}
          </div>

          {/* INFO PERSONAL */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 relative">
            <h2 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                <FaUser className="text-brand-secondary text-xs" />
              </span>
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Email de contacto</label>
                <p className="text-gray-700 font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Teléfono</label>
                <p className="text-gray-700 font-medium">{user.phone || 'No registrado'}</p>
              </div>
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 relative">
            <h2 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="text-green-600 text-xs" />
              </span>
              Dirección Principal
            </h2>
            {user.address?.street ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div className="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase text-brand-secondary mb-2 tracking-widest">
                    {user.address.alias || 'Mi Hogar'}
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {user.address.street} {user.address.number}
                  </p>
                  <p className="text-sm text-gray-500 uppercase">
                    {user.address.city}, CP {user.address.postalCode}
                  </p>
                  {user.address.apartment && (
                    <p className="text-xs text-gray-400 mt-1 italic">Dpto: {user.address.apartment}</p>
                  )}
                </div>

                <div className="h-48 md:h-full min-h-[180px] relative z-0">
                  {user.address.location?.coordinates ? (
                    <MapViewer coords={user.address.location.coordinates} />
                  ) : (
                    <div className="h-full w-full bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-white shadow-inner">
                      <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Mapa no disponible</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 italic text-sm mb-4">No has registrado una dirección de envío aún.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-[10px] font-black uppercase text-brand-secondary hover:underline"
                >
                  + Agregar dirección ahora
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN DE USUARIO */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={user}
        onRefresh={() => {
          window.location.reload();
        }}
      />

      {/* 🎯 MODAL DE ÓRDENES (Inyectado al final) */}
      <OrdersMyModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </div>
  );
};

export default MyProfile;