import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'react-phone-number-input/style.css';
import 'leaflet/dist/leaflet.css';
import useCart from '../../hooks/useCart';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

// --- CONFIGURACIÓN DE LÍMITES (Igual que tu MapPicker) ---
const CATAMARCA_BOUNDS = [
  [-28.6, -65.9], // Suroeste
  [-28.3, -65.6]  // Noreste
];
const DEFAULT_CENTER = [-28.4696, -65.7852];

// Fix Iconos Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const OrderPage = () => {
  const { user } = useContext(AuthContext);
  const { cart, total, getOrderItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    deliveryType: 'PICKUP',
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    city: user?.address?.city || 'San Fernando del Valle de Catamarca',
    apartment: user?.address?.apartment || '',
    postalCode: user?.address?.postalCode || '4700',
    reference: '',
    lat: user?.address?.location?.coordinates?.[1] || null,
    lng: user?.address?.location?.coordinates?.[0] || null
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        number: user.address?.number || '',
        apartment: user.address?.apartment || '',
        reference: user.address?.reference || '',
        // Extraemos correctamente las coordenadas del GeoJSON [longitud, latitud]
        lat: user.address?.location?.coordinates?.[1] || null,
        lng: user.address?.location?.coordinates?.[0] || null
      }));
    }
  }, [user]); // Se ejecuta una sola vez cuando el 'user' está disponible


  // --- LÓGICA DEL MAPA (Port de MapPicker.js) ---
  function MapEventsHandler() {
    const map = useMap();

    // 1. Geolocalización al montar (como tu navigator.geolocation)
    useEffect(() => {
      if (formData.deliveryType === 'SHIPPING' && !formData.lat) {
        map.locate().on("locationfound", (e) => {
          const { lat, lng } = e.latlng;
          // Validar si la posición detectada está en Catamarca
          if (lat >= CATAMARCA_BOUNDS[0][0] && lat <= CATAMARCA_BOUNDS[1][0] &&
            lng >= CATAMARCA_BOUNDS[0][1] && lng <= CATAMARCA_BOUNDS[1][1]) {
            setFormData(prev => ({ ...prev, lat, lng }));
            map.flyTo(e.latlng, 16);
          }
        });
      }
    }, [map]);

    // 2. Click Manual con Validación de Bounds
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (lat < CATAMARCA_BOUNDS[0][0] || lat > CATAMARCA_BOUNDS[1][0] ||
          lng < CATAMARCA_BOUNDS[0][1] || lng > CATAMARCA_BOUNDS[1][1]) {
          toast.error("Ubicación fuera de la zona permitida (Catamarca)");
          return;
        }
        setFormData(prev => ({ ...prev, lat, lng }));
      },
    });

    return formData.lat ? <Marker position={[formData.lat, formData.lng]} /> : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validaciones previas
    if (!isValidPhoneNumber(formData.phone)) {
      return toast.error("Teléfono inválido");
    }

    if (formData.deliveryType === 'SHIPPING' && (!formData.lat || !formData.lng)) {
      return toast.error("Por favor, selecciona tu ubicación exacta en el mapa");
    }

    const affiliateRef = localStorage.getItem('PS_affiliate_ref');

    // 2. Construcción limpia del objeto
    const orderPayload = {
      // SOLO mandamos guest si NO hay usuario logueado
      ...(!user && {
        guest: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        }
      }),
      orderType: 'RETAIL',
      deliveryType: formData.deliveryType,
      items: getOrderItems(),
      total,
      subtotal: total,
      affiliateCode: affiliateRef || null
    };

    // 3. SOLO agregamos shippingAddress si es SHIPPING
    if (formData.deliveryType === 'SHIPPING') {
      orderPayload.shippingAddress = {
        street: formData.street,
        number: formData.number,
        city: formData.city || "San Fernando del Valle de Catamarca",
        postalCode: formData.postalCode || "4700",
        apartment: formData.apartment || "",
        reference: formData.reference || "",
        location: {
          type: 'Point',
          coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)]
        }
      };
    }
    
    try {
      console.log(orderPayload);
      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        localStorage.setItem('guestOrderId', res.data.order._id); // <--- ESTO es lo que lee el CheckoutPage
      }
      
      const orderId = res.data.order?._id;
      
      if (orderId) {
        localStorage.removeItem('PS_affiliate_ref');
        localStorage.setItem('guestOrderId', orderId);
        clearCart();
        navigate(`/orden/recibo/${orderId}`);
      } else {
        // Por si las dudas el backend cambia la estructura
        console.error("No se encontró el ID de la orden en:", res.data);
        toast.error("Orden creada pero error al redirigir");
      }

    } catch (err) {
      console.error(err);
      console.error(err.response?.data?.error);
      toast.error(err.response?.data?.error || "Error al procesar orden");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-25 px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-brand-primary italic uppercase mb-6">Datos de Entrega</h2>

            <form id="orderForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  className={`input-airtotal ${user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.firstName}
                  readOnly={!!user} // Si hay user, no lo puede editar aquí
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  required
                  className={`input-airtotal ${user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.lastName}
                  readOnly={!!user}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>

              <input
                type="email"
                placeholder="Correo Electrónico"
                required
                className={`input-airtotal ${user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                value={formData.email}
                readOnly={!!user}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />

              <div className="phone-container">
                <PhoneInput
                  international
                  defaultCountry="AR"
                  value={formData.phone}
                  onChange={val => setFormData({ ...formData, phone: val })}
                  className="input-airtotal-phone"
                  disabled={!!user} // 👈 Esto lo bloquea si el usuario está logueado
                />
              </div>

              {/* TOGGLE DELIVERY (Port de toggleAddress) */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                <button type="button" onClick={() => setFormData({ ...formData, deliveryType: 'PICKUP' })}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${formData.deliveryType === 'PICKUP' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'}`}>
                  Retiro en Local
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, deliveryType: 'SHIPPING' })}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${formData.deliveryType === 'SHIPPING' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'}`}>
                  Envío a domicilio
                </button>
              </div>

              {/* SECCIÓN DE RETIRO (PICKUP) */}
              <AnimatePresence>
                {formData.deliveryType === 'PICKUP' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-4xl space-y-3"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-brand-primary p-3 rounded-2xl text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-black text-brand-primary uppercase italic text-sm tracking-tighter">Punto de Retiro Patrician Software</h4>
                        <p className="text-gray-600 text-xs font-bold mt-1 uppercase tracking-widest">
                          Av. Principal 1234, Catamarca Capital
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">Horarios: Lunes a Viernes de 09:00 a 18:00 hs</p>
                      </div>
                    </div>

                    <a
                      href="https://www.google.com/maps/search/?api=1&query=-28.4696,-65.7852"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" className="h-4" alt="Maps" />
                      Ver ubicación en Google Maps
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {formData.deliveryType === 'SHIPPING' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Fila Principal: Calle y Altura */}
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Calle"
                          className="input-airtotal bg-white border border-gray-100"
                          required
                          value={formData.street} // 👈 Valor precargado
                          onChange={e => setFormData({ ...formData, street: e.target.value })}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="N°"
                        className="input-airtotal bg-white border border-gray-100"
                        required
                        value={formData.number} // 👈 Valor precargado
                        onChange={e => setFormData({ ...formData, number: e.target.value })}
                      />

                      {/* Fila Secundaria: Depto */}
                      <input
                        type="text"
                        placeholder="N° Departamento / Piso"
                        className="input-airtotal bg-white border border-gray-100"
                        value={formData.apartment} // 👈 Valor precargado
                        onChange={e => setFormData({ ...formData, apartment: e.target.value })}
                      />

                      {/* Ciudad Lockeada (Ya la tenías, se mantiene igual) */}
                      <div className="relative">
                        <input
                          type="text"
                          value="S.F.V. de Catamarca"
                          readOnly
                          className="input-airtotal bg-gray-100 text-gray-400 cursor-not-allowed border-none font-bold uppercase text-[10px]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-brand-primary/30 uppercase">Ciudad</span>
                      </div>

                      {/* CP Lockeado (Ya la tenías, se mantiene igual) */}
                      <div className="relative">
                        <input
                          type="text"
                          value="4700"
                          readOnly
                          className="input-airtotal bg-gray-100 text-gray-400 cursor-not-allowed border-none font-bold text-[10px]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-brand-primary/30 uppercase">CP</span>
                      </div>
                    </div>

                    {/* Referencia opcional */}
                    <input
                      type="text"
                      placeholder="Referencia (ej: Portón negro, frente a la plaza...)"
                      className="input-airtotal bg-white border border-gray-100"
                      value={formData.reference} // 👈 Valor precargado
                      onChange={e => setFormData({ ...formData, reference: e.target.value })}
                    />

                    {/* Mapa de Leaflet */}
                    <div className="h-72 rounded-4xl overflow-hidden border-2 border-white shadow-inner relative z-0">
                      <MapContainer
                        // Usamos las coordenadas del usuario si existen, sino el centro por defecto
                        center={formData.lat && formData.lng ? [formData.lat, formData.lng] : DEFAULT_CENTER}
                        zoom={13}
                        maxBounds={CATAMARCA_BOUNDS}
                        style={{ height: '100%' }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Si el usuario tiene coordenadas, las mostramos */}
                        {formData.lat && formData.lng && (
                          <Marker position={[formData.lat, formData.lng]} />
                        )}

                        <MapEventsHandler />
                      </MapContainer>

                      <div className="absolute top-4 left-4 z-1000 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                        <p className="text-[9px] font-black text-brand-primary uppercase italic tracking-widest">
                          {formData.lat ? "✅ Dirección configurada" : "📍 Toca el mapa para fijar tu casa"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-brand-secondary transition-all shadow-lg cursor-pointer">
                Procesar Orden
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-10">
            <h3 className="font-black text-brand-primary italic uppercase mb-4 tracking-tighter">Tu Carrito</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-xs border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-bold">{item.quantity}x {item.productName}</span>
                  <span className="font-black text-brand-primary">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-gray-400">Total</span>
              <span className="text-2xl font-black text-brand-secondary italic">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderPage;
