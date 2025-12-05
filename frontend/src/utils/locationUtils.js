// Location utility functions

/**
 * Request and get user's current location
 * @returns Promise<{latitude: number, longitude: number}> or throws error
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                let errorMessage = 'Failed to get location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable. Please check your device settings.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again.';
                        break;
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
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
