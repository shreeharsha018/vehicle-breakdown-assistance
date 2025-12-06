// Location utility functions

/**
 * Request and get user's current location with high accuracy GPS
 * @returns Promise<{latitude: number, longitude: number, accuracy: number}> or throws error
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        console.log('🔍 Requesting high-accuracy GPS location...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const accuracy = position.coords.accuracy;
                console.log(`✅ Location obtained with ${Math.round(accuracy)}m accuracy`);

                // Warn if accuracy is poor (likely IP-based location)
                if (accuracy > 5000) {
                    console.warn('⚠️ Location accuracy is very poor (>5km). This might be IP-based location, not GPS.');
                    console.warn('💡 Please allow location permission for accurate GPS positioning.');
                }

                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: accuracy
                });
            },
            (error) => {
                let errorMessage = 'Failed to get location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please allow location access for accurate GPS positioning.';
                        console.error('❌ GPS permission denied');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable. Please check your device GPS settings.';
                        console.error('❌ GPS unavailable');
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'GPS request timed out. Please try again or check your device settings.';
                        console.error('❌ GPS timeout');
                        break;
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,  // Force GPS usage
                timeout: 30000,             // Wait up to 30 seconds for GPS
                maximumAge: 0               // Always get fresh location, no cache
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
