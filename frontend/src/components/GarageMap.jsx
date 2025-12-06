import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

// Fix for default marker icons in React-Leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom markers
const userIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#4285F4" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const garageIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#EA4335"/>
      <circle cx="12.5" cy="12.5" r="7" fill="white"/>
    </svg>
  `),
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
});

export default function GarageMap({ userLocation, garages, onGarageClick }) {
    // Ensure we always have a valid center
    const center = (userLocation && userLocation.length === 2)
        ? userLocation
        : [12.9716, 77.5946]; // Bangalore default
    const zoom = 13;

    return (
        <div style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User location marker */}
                {userLocation && (
                    <Marker position={userLocation} icon={userIcon}>
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <strong>📍 You are here</strong>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Garage markers */}
                {garages.map((garage) => (
                    <Marker
                        key={garage.id}
                        position={[garage.location.lat, garage.location.lng]}
                        icon={garageIcon}
                        eventHandlers={{
                            click: () => onGarageClick && onGarageClick(garage),
                        }}
                    >
                        <Popup>
                            <div style={{ minWidth: '200px' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{garage.name}</h3>
                                <p style={{ margin: '4px 0', fontSize: '13px' }}>
                                    ⭐ {garage.rating} | 📍 {garage.distance} km away
                                </p>
                                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                                    {garage.address}
                                </p>
                                <div style={{ marginTop: '8px' }}>
                                    {garage.vehicleTypes.map((type) => (
                                        <span
                                            key={type}
                                            style={{
                                                background: '#f0f0f0',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                marginRight: '4px',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

GarageMap.propTypes = {
    userLocation: PropTypes.arrayOf(PropTypes.number),
    garages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            location: PropTypes.shape({
                lat: PropTypes.number.isRequired,
                lng: PropTypes.number.isRequired,
            }).isRequired,
            distance: PropTypes.number,
            rating: PropTypes.number,
            address: PropTypes.string,
            vehicleTypes: PropTypes.arrayOf(PropTypes.string),
        })
    ).isRequired,
    onGarageClick: PropTypes.func,
};
