import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import garageService from '../../services/garageService';
import { getCurrentLocation } from '../../utils/locationUtils';

export default function FindGarage() {
    const [userLocation, setUserLocation] = useState(null);
    const [garages, setGarages] = useState([]);
    const [filteredGarages, setFilteredGarages] = useState([]);
    const [selectedVehicleType, setSelectedVehicleType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGarage, setSelectedGarage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        initializeMap();
    }, []);

    useEffect(() => {
        filterGarages();
    }, [selectedVehicleType, garages]);

    const initializeMap = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get user location
            const location = await getCurrentLocation();
            setUserLocation([location.latitude, location.longitude]);

            // Fetch nearby garages
            const nearbyGarages = await garageService.getNearbyGarages(
                location.latitude,
                location.longitude,
                null,
                20 // 20km radius
            );

            // If no garages found in Firestore, load sample garages
            if (nearbyGarages.length === 0) {
                console.log('No garages in Firestore, loading sample data');
                const sampleGarages = garageService.getSampleGarages().map((garage, index) => ({
                    ...garage,
                    id: `sample-${index}`,
                    isActive: true,
                    distance: garageService.calculateDistance(
                        location.latitude,
                        location.longitude,
                        garage.location.lat,
                        garage.location.lng
                    ),
                }));
                setGarages(sampleGarages);
                setFilteredGarages(sampleGarages);
            } else {
                setGarages(nearbyGarages);
                setFilteredGarages(nearbyGarages);
            }
        } catch (err) {
            console.error('Error initializing map:', err);
            setError(err.message || 'Failed to load garages. Please enable location access.');

            // Use default location (Bangalore) if location fails
            const defaultLocation = [12.9716, 77.5946];
            setUserLocation(defaultLocation);

            // Load sample garages
            const sampleGarages = garageService.getSampleGarages().map((garage, index) => ({
                ...garage,
                id: `sample-${index}`,
                isActive: true,
                distance: garageService.calculateDistance(
                    defaultLocation[0],
                    defaultLocation[1],
                    garage.location.lat,
                    garage.location.lng
                ),
            }));

            setGarages(sampleGarages);
            setFilteredGarages(sampleGarages);
        } finally {
            setLoading(false);
        }
    };

    const filterGarages = () => {
        if (selectedVehicleType === 'all') {
            setFilteredGarages(garages);
        } else {
            const filtered = garages.filter((garage) =>
                garage.vehicleTypes.includes(selectedVehicleType)
            );
            setFilteredGarages(filtered);
        }
    };

    const handleVehicleTypeChange = (type) => {
        setSelectedVehicleType(type);
        setSelectedGarage(null);
    };

    const openDirections = (garage) => {
        if (userLocation) {
            const url = garageService.getDirectionsUrl(
                userLocation[0],
                userLocation[1],
                garage.location.lat,
                garage.location.lng
            );
            window.open(url, '_blank');
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Loading nearby garages...</h2>
                <p>Please wait while we find garages near you.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>🔧 Find Nearby Garage</h1>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                    Find repair shops near you based on your vehicle type
                </p>

                {error && (
                    <div style={{
                        background: '#fff3cd',
                        border: '1px solid #ffc107',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Vehicle Type Filter */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {[
                        { value: 'all', label: 'All Types', icon: '🚗' },
                        { value: '2-wheeler', label: '2-Wheeler', icon: '🏍️' },
                        { value: '3-wheeler', label: '3-Wheeler', icon: '🛺' },
                        { value: '4-wheeler', label: '4-Wheeler', icon: '🚙' },
                    ].map((type) => (
                        <button
                            key={type.value}
                            onClick={() => handleVehicleTypeChange(type.value)}
                            style={{
                                padding: '0.75rem 1.25rem',
                                border: selectedVehicleType === type.value ? '2px solid #ff6b00' : '2px solid #ddd',
                                background: selectedVehicleType === type.value ? '#fff5f0' : 'white',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: selectedVehicleType === type.value ? '600' : '400',
                                transition: 'all 0.2s',
                            }}
                        >
                            {type.icon} {type.label}
                            <span style={{
                                marginLeft: '8px',
                                background: selectedVehicleType === type.value ? '#ff6b00' : '#ddd',
                                color: selectedVehicleType === type.value ? 'white' : '#666',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                            }}>
                                {type.value === 'all'
                                    ? garages.length
                                    : garages.filter((g) => g.vehicleTypes.includes(type.value)).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Garage List - No Map, Just Results */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                {filteredGarages.length === 0 ? (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        background: '#f9f9f9',
                        borderRadius: '12px',
                    }}>
                        <h3>No garages found</h3>
                        <p style={{ color: '#666', fontSize: '14px' }}>
                            Try selecting a different vehicle type or check back later.
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {filteredGarages.map((garage) => (
                            <div
                                key={garage.id}
                                id={`garage-${garage.id}`}
                                onClick={() => setSelectedGarage(garage)}
                                style={{
                                    padding: '1.25rem',
                                    border: selectedGarage?.id === garage.id ? '2px solid #ff6b00' : '1px solid #e0e0e0',
                                    borderRadius: '12px',
                                    background: selectedGarage?.id === garage.id ? '#fff5f0' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: selectedGarage?.id === garage.id ? '0 4px 12px rgba(255,107,0,0.1)' : 'none',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '18px' }}>{garage.name}</h3>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '13px', color: '#666' }}>
                                            <span>⭐ {garage.rating}</span>
                                            <span>•</span>
                                            <span>📍 {garage.distance} km</span>
                                        </div>
                                    </div>
                                </div>

                                <p style={{ margin: '0.5rem 0', fontSize: '14px', color: '#666' }}>
                                    📍 {garage.address}
                                </p>

                                <p style={{ margin: '0.5rem 0', fontSize: '14px', color: '#666' }}>
                                    📞 {garage.phone}
                                </p>

                                <p style={{ margin: '0.5rem 0', fontSize: '14px', color: '#666' }}>
                                    🕒 {garage.workingHours}
                                </p>

                                <div style={{ margin: '0.75rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {garage.vehicleTypes.map((type) => (
                                        <span
                                            key={type}
                                            style={{
                                                background: '#f0f0f0',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                color: '#333',
                                            }}
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </div>

                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDirections(garage);
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            background: '#ff6b00',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                        }}
                                    >
                                        🧭 Get Directions
                                    </button>
                                    <a
                                        href={`tel:${garage.phone}`}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            background: 'white',
                                            color: '#ff6b00',
                                            border: '2px solid #ff6b00',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            textAlign: 'center',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                        }}
                                    >
                                        📞 Call Now
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'white',
                        color: '#ff6b00',
                        border: '2px solid #ff6b00',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                    }}
                >
                    ← Back
                </button>
            </div>
        </div>
    );
}
