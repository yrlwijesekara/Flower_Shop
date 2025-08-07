import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapComponent = () => {
  // Coordinates for Colombo 07, Sri Lanka (approximate location for Flower Garden Road)
  const position = [6.9271, 79.8612]; // Latitude, Longitude for Colombo 07

  return (
    <div className="map-container">
      <MapContainer 
        center={position} 
        zoom={15} 
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div>
              <strong>Adora Flower Shop</strong><br />
              No. 45, Flower Garden Road<br />
              Colombo 07, Sri Lanka<br />
              <br />
              📧 adoraflower@gmail.com<br />
              📞 +94 761 234 567
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
