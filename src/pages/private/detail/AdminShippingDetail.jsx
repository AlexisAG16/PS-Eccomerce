import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Componentes de Patrician Software
import AdminDetailLayout from "../../../layouts/AdminDetailLayout";
import MetricItem from "../../../components/detail/MetricItem";
import DetailCard from "../../../components/detail/DetailCard";
import InfoRow from "../../../components/detail/InfoRow";
import { FiTruck, FiMapPin, FiNavigation, FiPackage, FiEdit3 } from "react-icons/fi";

// Fix para los iconos de Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Swal from "sweetalert2";
import { AuthContext } from "../../../contexts/AuthContext";
import ShippingActionPanel from "../../../components/detail/ShippingActionPanel";
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const PS_DEPOT = [-28.475472297213656, -65.77850769413484];

// Componente para ajustar el zoom automáticamente
const RecenterMap = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1 && points[1]) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
};

const AdminShippingDetail = () => {
  const { id } = useParams();
  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState([]);
  const [editData, setEditData] = useState({
    trackingNumber: "",
    carrier: "",
    carrierName: "", // 👈 Nuevo
    notes: ""
  });
  const [carriers, setCarriers] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchRoute = async (endCoords) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${PS_DEPOT[1]},${PS_DEPOT[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.code === "Ok" && data.routes?.[0]) {
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRoute(coords);
      }
    } catch (e) { console.error("Error ruta:", e); }
  };

  // BUSCAR ENVÍO
  useEffect(() => {
    const fetchShipping = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/shippings/${id}`);
        const shipData = response.data.data;

        if (shipData) {
          setShipping(shipData);

          // ACTUALIZACIÓN AQUÍ: Mapear todos los campos del backend al estado
          setEditData({
            trackingNumber: shipData.trackingNumber || "",
            carrier: shipData.carrier || "propio",
            carrierName: shipData.carrierName || "", // 👈 Faltaba esto
            notes: shipData.notes || ""
          });

          if (shipData.shippingAddress?.location?.coordinates?.length === 2) {
            const clientCoords = [
              shipData.shippingAddress.location.coordinates[1],
              shipData.shippingAddress.location.coordinates[0]
            ];
            fetchRoute(clientCoords);
          }
        }
      } catch (error) {
        toast.error("Error al cargar logística");
      } finally {
        setLoading(false);
      }
    };
    fetchShipping();
  }, [id]);

  // BUSCAR CARRIERS
  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        // Ajusta esta URL según tu backend (ej. /users o /users/carriers)
        const response = await api.get("/users/list/carriers");
        // Si tu backend devuelve { success: true, data: [...] }
        const usersData = response.data.data || response.data;
        setCarriers(usersData);
      } catch (error) {
        console.error("Error al cargar carriers:", error);
      }
    };
    fetchCarriers();
  }, []);

  // 1. ACTUALIZAR METADATOS
  const handleUpdate = async () => {
    try {
      Swal.showLoading();
      // 👈 IMPORTANTE: Usamos el endpoint raíz /:id, NO /status
      await api.patch(`/shippings/${id}`, editData);

      // Actualizamos el estado local para que las métricas de arriba cambien
      setShipping(prev => ({ ...prev, ...editData }));

      toast.success("Hoja de ruta sincronizada");
      Swal.close();
    } catch (err) {
      toast.error("Error al guardar cambios administrativos");
    }
  };

  // 2. CAMBIAR ESTADO (Panel de Acciones)
  const handleStatusChange = async (newStatus) => {
    const result = await Swal.fire({
      title: `¿PASAR A ${newStatus}?`,
      text: "Se notificará al sistema y se actualizará el monitor de ruta.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'VOLVER',
      customClass: {
        popup: 'rounded-[3rem] p-10 border-4 border-brand-primary/10',
        confirmButton: 'rounded-2xl font-black uppercase italic text-[10px] tracking-widest px-8 py-4 bg-brand-primary',
      }
    });

    if (result.isConfirmed) {
      try {
        // 👈 Este sí usa el endpoint /status
        await api.patch(`/shippings/${id}/status`, { status: newStatus });

        setShipping(prev => ({ ...prev, status: newStatus }));
        toast.success(`Estado: ${newStatus}`);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error al cambiar estado");
      }
    }
  };

  const openInMaps = () => {
    if (!clientPos) return;

    // URL correcta para Google Maps Directions
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${PS_DEPOT[0]},${PS_DEPOT[1]}&destination=${clientPos[0]},${clientPos[1]}&travelmode=driving`;

    window.open(mapsUrl, '_blank');
  };

  const sendByWhatsApp = () => {
    if (!clientPos) return;

    // Usamos la misma URL correcta
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${PS_DEPOT[0]},${PS_DEPOT[1]}&destination=${clientPos[0]},${clientPos[1]}&travelmode=driving`;

    const message = `Hola, aquí tienes la ruta para tu entrega: ${mapsUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <ClipLoader color="#1a5276" size={50} />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Sincronizando coordenadas GPS...</p>
    </div>
  );

  if (!shipping) return <div className="pt-40 text-center font-black uppercase text-brand-primary">Envío no encontrado</div>;

  const clientPos = shipping.shippingAddress?.location?.coordinates?.length === 2
    ? [shipping.shippingAddress.location.coordinates[1], shipping.shippingAddress.location.coordinates[0]]
    : null;

  return (
    <AdminDetailLayout
      title={`Envío #${shipping.trackingCode || id?.slice(-6).toUpperCase()}`}
      subtitle="Centro de Control de Despacho y Logística"
    >
      {/* MÉTRICAS DE LOGÍSTICA */}
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricItem
          label="Estado de Entrega"
          value={shipping.status || "Pendiente"}
          icon={FiTruck}
          colorClass="text-brand-secondary"
        />
        <MetricItem
          label="Transportista"
          value={editData.carrier}
          icon={FiNavigation}
          colorClass="text-brand-primary"
        />
        <MetricItem
          label="Destino"
          value={shipping.shippingAddress?.city}
          icon={FiMapPin}
          colorClass="text-gray-400"
        />
        <MetricItem
          label="Carga"
          value="Standard"
          icon={FiPackage}
          colorClass="text-gray-400"
        />
      </div>

      {/* COLUMNA IZQUIERDA: GESTIÓN */}
      <aside className="lg:col-span-4 space-y-6">
        <DetailCard title="Punto de Entrega">
          <div className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
            <p className="font-black text-brand-primary uppercase italic text-lg leading-tight">
              {shipping.shippingAddress?.street} {shipping.shippingAddress?.number}
            </p>
            <p className="text-[10px] text-gray-400 font-black uppercase mt-1 tracking-tighter">
              {shipping.shippingAddress?.city}, {shipping.shippingAddress?.province} (CP {shipping.shippingAddress?.postalCode})
            </p>
          </div>
          <div className="mt-4">
            <InfoRow label="Referencia" value={shipping.shippingAddress?.notes || "Sin notas"} />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={openInMaps}
              className="flex-1 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase italic text-[9px] hover:bg-brand-secondary transition-all cursor-pointer"
            >
              Abrir en Maps
            </button>
            <button
              onClick={sendByWhatsApp}
              className="px-4 py-3 bg-[#25D366] text-white rounded-2xl font-black uppercase italic text-[9px] hover:opacity-90 transition-all cursor-pointer"
            >
              Enviar x WhatsApp
            </button>
          </div>
        </DetailCard>

        <ShippingActionPanel
          status={shipping.status}
          onStatusChange={handleStatusChange}
          userRole={user?.role?.name}
        />

        <DetailCard title="Gestión de Guía" dark>
          <div className="space-y-4">
            {/* Empresa de Correo */}
            <div>
              <label className="text-[9px] font-black text-white/40 uppercase ml-2 mb-1 block">Empresa / Método</label>
              <input
                value={editData.carrier}
                onChange={e => setEditData({ ...editData, carrier: e.target.value })}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold uppercase text-white outline-none focus:border-brand-secondary transition-colors"
                placeholder="Ej: Propio, Correo Argentino..."
              />
            </div>

            {/* Nombre del Repartidor (Carrier Name) - Solo si es envío propio */}
            {editData.carrier.toLowerCase() === 'propio' && (
              <div>
                <label className="text-[9px] font-black text-white/40 uppercase ml-2 mb-1 block">
                  Operador / Repartidor
                </label>
                <select
                  value={editData.carrierName}
                  onChange={e => setEditData({ ...editData, carrierName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold uppercase text-white outline-none focus:border-brand-secondary transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-brand-primary">Seleccionar repartidor...</option>
                  {carriers.map((c) => (
                    <option
                      key={c._id}
                      value={`${c.firstName} ${c.lastName}`}
                      className="bg-brand-primary text-white"
                    >
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Número de Tracking */}
            <div>
              <label className="text-[9px] font-black text-white/40 uppercase ml-2 mb-1 block">Número de Tracking</label>
              <input
                value={editData.trackingNumber}
                onChange={e => setEditData({ ...editData, trackingNumber: e.target.value })}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold text-brand-secondary outline-none focus:border-brand-secondary transition-colors uppercase"
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-brand-secondary text-white py-5 rounded-4xl font-black uppercase italic text-[10px] tracking-widest hover:bg-white hover:text-brand-primary transition-all flex items-center justify-center gap-2 mt-4 shadow-xl"
            >
              <FiEdit3 className="text-sm" /> Actualizar Hoja de Ruta
            </button>
          </div>
        </DetailCard>
      </aside>

      {/* COLUMNA DERECHA: MAPA TÁCTICO */}
      <main className="lg:col-span-8">
        <div className="h-[650px] w-full bg-white p-3 rounded-[4rem] border border-gray-100 shadow-2xl relative z-0">
          <div className="absolute top-8 left-8 z-10 bg-brand-primary text-white px-6 py-2 rounded-full text-[9px] font-black uppercase italic tracking-widest shadow-lg">
            Monitor de Ruta en Tiempo Real
          </div>

          <div className="h-full w-full rounded-[3.2rem] overflow-hidden border border-gray-100">
            {clientPos ? (
              <MapContainer center={PS_DEPOT} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                <RecenterMap points={[PS_DEPOT, clientPos]} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Marcador Depósito */}
                <Marker position={PS_DEPOT}>
                  <Popup>
                    <div className="font-black uppercase italic text-[10px] text-brand-primary">Base Patrician Software</div>
                  </Popup>
                </Marker>

                {/* Marcador Cliente */}
                <Marker position={clientPos}>
                  <Popup>
                    <div className="font-black uppercase italic text-[10px] text-brand-secondary">Destino Cliente</div>
                  </Popup>
                </Marker>

                {route.length > 0 && (
                  <Polyline
                    positions={route}
                    color="#f29964"
                    weight={6}
                    opacity={0.8}
                    lineJoin="round"
                    dashArray="10, 10" // Efecto de línea punteada táctica
                  />
                )}
              </MapContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-50 text-[10px] font-black text-gray-300 uppercase italic">
                Coordenadas de destino no disponibles
              </div>
            )}
          </div>
        </div>
      </main>
    </AdminDetailLayout>
  );
};

export default AdminShippingDetail;
