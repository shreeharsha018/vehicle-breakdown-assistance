import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

class GarageService {
    constructor() {
        this.collectionName = 'garages';
    }

    // Calculate distance between two coordinates using Haversine formula
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance * 10) / 10; // Round to 1 decimal
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Get nearby garages filtered by vehicle type
    async getNearbyGarages(userLat, userLng, vehicleType, radiusKm = 10) {
        try {
            const garagesRef = collection(db, this.collectionName);
            let garagesQuery;

            if (vehicleType && vehicleType !== 'all') {
                garagesQuery = query(
                    garagesRef,
                    where('vehicleTypes', 'array-contains', vehicleType),
                    where('status', '==', 'approved'), // Only show approved garages
                    where('isActive', '==', true)
                );
            } else {
                garagesQuery = query(
                    garagesRef,
                    where('status', '==', 'approved'), // Only show approved garages
                    where('isActive', '==', true)
                );
            }

            const snapshot = await getDocs(garagesQuery);
            const garages = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                const distance = this.calculateDistance(
                    userLat,
                    userLng,
                    data.location.lat,
                    data.location.lng
                );

                // Filter by radius
                if (distance <= radiusKm) {
                    garages.push({
                        id: doc.id,
                        ...data,
                        distance,
                    });
                }
            });

            // Sort by distance
            garages.sort((a, b) => a.distance - b.distance);

            return garages;
        } catch (error) {
            console.error('Error fetching garages:', error);
            throw error;
        }
    }

    // Get all garages (admin)
    async getAllGarages() {
        try {
            const garagesRef = collection(db, this.collectionName);
            const snapshot = await getDocs(garagesRef);
            const garages = [];

            snapshot.forEach((doc) => {
                garages.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            return garages;
        } catch (error) {
            console.error('Error fetching all garages:', error);
            throw error;
        }
    }

    // Add new garage
    async addGarage(garageData) {
        try {
            const garagesRef = collection(db, this.collectionName);
            const docRef = await addDoc(garagesRef, {
                ...garageData,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding garage:', error);
            throw error;
        }
    }

    // Update garage
    async updateGarage(garageId, garageData) {
        try {
            const garageRef = doc(db, this.collectionName, garageId);
            await updateDoc(garageRef, {
                ...garageData,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error updating garage:', error);
            throw error;
        }
    }

    // Delete garage
    async deleteGarage(garageId) {
        try {
            const garageRef = doc(db, this.collectionName, garageId);
            await deleteDoc(garageRef);
        } catch (error) {
            console.error('Error deleting garage:', error);
            throw error;
        }
    }

    // Get Google Maps directions URL
    getDirectionsUrl(userLat, userLng, garageLat, garageLng) {
        return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${garageLat},${garageLng}`;
    }

    // Get sample garages (for initial seed)
    getSampleGarages() {
        return [
            {
                name: 'Quick Fix Motors',
                vehicleTypes: ['2-wheeler'],
                location: { lat: 12.9716, lng: 77.5946 },
                address: 'MG Road, Bangalore',
                phone: '+91 9876543210',
                rating: 4.5,
                services: ['Repair', 'Maintenance', 'Parts'],
                workingHours: '9 AM - 7 PM',
            },
            {
                name: 'Auto Care Center',
                vehicleTypes: ['2-wheeler', '3-wheeler'],
                location: { lat: 12.9352, lng: 77.6245 },
                address: 'Indiranagar, Bangalore',
                phone: '+91 9876543211',
                rating: 4.2,
                services: ['Repair', 'Service', 'Spare Parts'],
                workingHours: '8 AM - 8 PM',
            },
            {
                name: 'City Service Station',
                vehicleTypes: ['3-wheeler', '4-wheeler'],
                location: { lat: 12.9698, lng: 77.7500 },
                address: 'Whitefield, Bangalore',
                phone: '+91 9876543212',
                rating: 4.7,
                services: ['Full Service', 'Body Work', 'Painting'],
                workingHours: '9 AM - 6 PM',
            },
            {
                name: 'Express Auto Repair',
                vehicleTypes: ['2-wheeler', '3-wheeler', '4-wheeler'],
                location: { lat: 12.9141, lng: 77.6411 },
                address: 'Koramangala, Bangalore',
                phone: '+91 9876543213',
                rating: 4.6,
                services: ['Emergency Repair', '24/7 Service', 'Towing'],
                workingHours: '24 Hours',
            },
            {
                name: 'Bike World',
                vehicleTypes: ['2-wheeler'],
                location: { lat: 13.0358, lng: 77.5970 },
                address: 'Malleshwaram, Bangalore',
                phone: '+91 9876543214',
                rating: 4.3,
                services: ['Bike Repair', 'Accessories', 'Customization'],
                workingHours: '10 AM - 8 PM',
            },
        ];
    }
}

export default new GarageService();
