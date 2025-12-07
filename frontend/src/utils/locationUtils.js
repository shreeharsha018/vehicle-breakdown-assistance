// Location utility functions

/**
 * Get high-accuracy GPS location aggressively
 * Uses watchPosition to continuously monitor until we get accurate coordinates
 * @returns Promise<{latitude: number, longitude: number, accuracy: number}>
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        console.log('🔍 Starting GPS acquisition...');

        let watchId = null;
        let bestAccuracy = Infinity;
        let bestPosition = null;
        let attempts = 0;
        const MAX_WAIT_TIME = 10000; // 10 seconds max wait
        const ACCEPTABLE_ACCURACY = 100; // Accept if accuracy < 100 meters

        const timer = setTimeout(() => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }

            if (bestPosition) {
                console.log(`⏰ Time limit reached. Using best position with ${Math.round(bestAccuracy)}m accuracy`);
                resolve(bestPosition);
            } else {
                reject(new Error('GPS timeout. Please ensure location services are enabled and you have granted permission.'));
            }
        }, MAX_WAIT_TIME);

        // Use watchPosition for continuous updates until we get good accuracy
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                attempts++;
                const accuracy = position.coords.accuracy;

                console.log(`📍 GPS update #${attempts}: ${Math.round(accuracy)}m accuracy`);

                // Keep the best (most accurate) position
                if (accuracy < bestAccuracy) {
                    bestAccuracy = accuracy;
                    bestPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: accuracy
                    };
                }

                // If we got acceptable accuracy, resolve immediately
                if (accuracy <= ACCEPTABLE_ACCURACY) {
                    clearTimeout(timer);
                    navigator.geolocation.clearWatch(watchId);
                    console.log(`✅ High-accuracy GPS acquired: ${Math.round(accuracy)}m`);
                    resolve(bestPosition);
                }
            },
            (error) => {
                clearTimeout(timer);
                if (watchId !== null) {
                    navigator.geolocation.clearWatch(watchId);
                }

                let errorMessage = 'Failed to get GPS location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '🔴 Location permission DENIED. Click the 🔒 icon in address bar and allow location access.';
                        console.error('❌ User denied GPS permission');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = '🔴 GPS unavailable. Make sure location services are enabled on your device.';
                        console.error('❌ GPS unavailable');
                        break;
                    case error.TIMEOUT:
                        errorMessage = '🔴 GPS timeout. Please try again.';
                        console.error('❌ GPS timeout');
                        break;
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,  // FORCE GPS usage
                maximumAge: 0,              // No cached positions
                timeout: 8000               // Timeout per attempt
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
