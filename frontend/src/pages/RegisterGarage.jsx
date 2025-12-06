import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import garageService from '../services/garageService';
import { getCurrentLocation } from '../utils/locationUtils';

export default function RegisterGarage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        vehicleTypes: [],
        address: '',
        phone: '',
        services: [],
        workingHours: '',
        ownerEmail: '',
    });
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const vehicleTypeOptions = ['2-wheeler', '3-wheeler', '4-wheeler'];
    const serviceOptions = ['Repair', 'Maintenance', 'Parts', 'Towing', 'Body Work', 'Painting', '24/7 Service'];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (field, value) => {
        const current = formData[field];
        if (current.includes(value)) {
            setFormData({ ...formData, [field]: current.filter(v => v !== value) });
        } else {
            setFormData({ ...formData, [field]: [...current, value] });
        }
    };

    const detectLocation = async () => {
        try {
            setLoading(true);
            const loc = await getCurrentLocation();
            setLocation({ lat: loc.latitude, lng: loc.longitude });
            setError(null);
        } catch (err) {
            setError('Failed to detect location. Please enter manually.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (!formData.name || !formData.address || !formData.phone) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (formData.vehicleTypes.length === 0) {
            setError('Please select at least one vehicle type');
            setLoading(false);
            return;
        }

        if (!location) {
            setError('Please detect your location or enter it manually');
            setLoading(false);
            return;
        }

        try {
            await garageService.addGarage({
                ...formData,
                location,
                status: 'pending',
                submittedAt: new Date(),
                submittedBy: formData.ownerEmail || 'anonymous',
                rating: 0, // Default rating
            });

            setSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setError(err.message || 'Failed to submit registration');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h2>Registration Submitted!</h2>
                <p style={{ color: '#666', marginTop: '1rem' }}>
                    Thank you for registering your garage. Our team will review your submission and notify you once approved.
                </p>
                <p style={{ color: '#666', fontSize: '14px', marginTop: '1rem' }}>
                    Redirecting to home page...
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>🔧 Register Your Garage</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Join our network of verified garages and help vehicle owners find your services
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

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                {/* Garage Name */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Garage Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="ABC Motors"
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px',
                        }}
                    />
                </div>

                {/* Vehicle Types */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Vehicle Types Serviced <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {vehicleTypeOptions.map((type) => (
                            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.vehicleTypes.includes(type)}
                                    onChange={() => handleCheckboxChange('vehicleTypes', type)}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Address */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Address <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street, City, State, PIN"
                        required
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                        }}
                    />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Phone Number <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px',
                        }}
                    />
                </div>

                {/* Services */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Services Offered
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                        {serviceOptions.map((service) => (
                            <label key={service} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.services.includes(service)}
                                    onChange={() => handleCheckboxChange('services', service)}
                                />
                                {service}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Working Hours */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Working Hours
                    </label>
                    <input
                        type="text"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleInputChange}
                        placeholder="9 AM - 6 PM"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px',
                        }}
                    />
                </div>

                {/* Location */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Location <span style={{ color: 'red' }}>*</span>
                    </label>
                    <button
                        type="button"
                        onClick={detectLocation}
                        disabled={loading}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: location ? '#34c759' : '#ff6b00',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                        }}
                    >
                        {location ? '✓ Location Detected' : '📍 Detect My Location'}
                    </button>
                    {location && (
                        <p style={{ marginTop: '0.5rem', fontSize: '13px', color: '#666' }}>
                            Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                        </p>
                    )}
                </div>

                {/* Owner Email (Optional) */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Your Email (for updates)
                    </label>
                    <input
                        type="email"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleInputChange}
                        placeholder="owner@example.com"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px',
                        }}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: loading ? '#ccc' : '#ff6b00',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                    }}
                >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                </button>

                <p style={{ marginTop: '1rem', fontSize: '13px', color: '#666', textAlign: 'center' }}>
                    Your registration will be reviewed by our team before going live
                </p>
            </form>
        </div>
    );
}
