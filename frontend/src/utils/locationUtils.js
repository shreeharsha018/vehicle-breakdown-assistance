// Location utility functions

/**
 * Get high-accuracy GPS location
 * Uses getCurrentPosition with optimal settings (proven in geotag-webcam project)
 * @returns Promise<{latitude: number, longitude: number, accuracy: number}>
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        console.log('🔍 Requesting high-accuracy location...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                console.log(`✅ Location acquired: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`);

                resolve({
                    latitude,
                    longitude,
                    accuracy
                });
            },
            (error) => {
                console.error('❌ Location error:', error);

                let errorMessage = 'Failed to get location: ' + error.message;

                if (error.code === 1) {
                    errorMessage = '🔴 Location permission denied. Please enable location services and reload.';
                } else if (error.code === 2) {
                    errorMessage = '🔴 Location unavailable. Please check your connection.';
                } else if (error.code === 3) {
                    errorMessage = '🔴 GPS timeout. Please try again.';
                }

                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,  // Force GPS usage (not WiFi/network)
                timeout: 20000,            // 20 seconds - same as geotag-webcam
                maximumAge: 0              // Don't use cached location - always fresh
            }
        );
    });
};

/**
 * Create assistance request in Firestore
 * @param {Object} requestData - Request data
 * @returns Promise<string> - Request ID
 */
export const createAssistanceRequest = async (db, requestData) => {
    const { addDoc, collection } = await import('firebase/firestore');

    const docRef = await addDoc(collection(db, 'assistanceRequests'), {
        ...requestData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending'
    });

    return docRef.id;
};

/**
 * Get Google Maps URL for coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} - Google Maps URL
 */
export const getGoogleMapsUrl = (lat, lon) => {
    return `https://www.google.com/maps?q=${lat},${lon}`;
};
