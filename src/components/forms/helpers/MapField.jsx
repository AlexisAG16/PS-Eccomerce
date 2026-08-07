import { Controller } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Iconos Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

const MapField = ({ control, name, center = [-28.4696, -65.7852] }) => {

  const MapClickHandler = ({ onChange, value }) => {
    useMapEvents({
      click(e) { onChange([e.latlng.lng, e.latlng.lat]); },
    });
    return value ? <Marker position={[value[1], value[0]]} /> : null;
  };

  return (
    <div className="h-64 rounded-3xl overflow-hidden border-2 border-white shadow-inner">
      <MapContainer center={center} zoom={13} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <MapClickHandler onChange={onChange} value={value} />
          )}
        />
      </MapContainer>
    </div>
  );
};

export default MapField;
