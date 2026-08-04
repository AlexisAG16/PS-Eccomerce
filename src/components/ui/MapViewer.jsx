import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Iconos Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const MapViewer = ({ coords }) => {
  // Coords llega como [lng, lat]
  const position = [coords[1], coords[0]];

  return (
    /* 🎯 Agregamos 'relative z-0' aquí para domar los z-index de Leaflet */
    <div className="h-full w-full rounded-3xl overflow-hidden shadow-inner border-2 border-white relative z-0">
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};

export default MapViewer;