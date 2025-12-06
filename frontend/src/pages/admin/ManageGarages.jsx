import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ManageGarages() {
    const [garages, setGarages] = useState([]);
    const [filter, setFilter] = useState('pending'); // pending | approved | rejected
    const [loading, setLoading] = useState(true);
    const [selectedGarage, setSelectedGarage] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        loadGarages();
    }, [filter]);

    const loadGarages = async () => {
        try {
            setLoading(true);
            const garagesRef = collection(db, 'garages');
            const q = query(
                garagesRef,
                where('status', '==', filter),
                orderBy('submittedAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const garageData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGarages(garageData);
        } catch (error) {
            console.error('Error loading garages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (garageId) => {
        try {
            const garageRef = doc(db, 'garages', garageId);
            await updateDoc(garageRef, {
                status: 'approved',
                reviewedAt: new Date(),
                updatedAt: new Date(),
            });
            loadGarages();
            alert('Garage approved!');
        } catch (error) {
            console.error('Error approving garage:', error);
            alert('Failed to approve garage');
        }
    };

    const handleReject = async (garageId) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            const garageRef = doc(db, 'garages', garageId);
            await updateDoc(garageRef, {
                status: 'rejected',
                rejectionReason,
                reviewedAt: new Date(),
                updatedAt: new Date(),
            });
            setSelectedGarage(null);
            setRejectionReason('');
            loadGarages();
            alert('Garage rejected');
        } catch (error) {
            console.error('Error rejecting garage:', error);
            alert('Failed to reject garage');
        }
    };

    const handleDelete = async (garageId) => {
        if (!confirm('Are you sure you want to delete this garage permanently?')) return;

        try {
            await deleteDoc(doc(db, 'garages', garageId));
            loadGarages();
            alert('Garage deleted');
        } catch (error) {
            console.error('Error deleting garage:', error);
            alert('Failed to delete garage');
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Loading garages...</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1rem' }}>🔧 Manage Garages</h1>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e0e0e0' }}>
                {[
                    { value: 'pending', label: 'Pending', icon: '⏳' },
                    { value: 'approved', label: 'Approved', icon: '✅' },
                    { value: 'rejected', label: 'Rejected', icon: '❌' },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: filter === tab.value ? '3px solid #ff6b00' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: filter === tab.value ? '600' : '400',
                            color: filter === tab.value ? '#ff6b00' : '#666',
                        }}
                    >
                        {tab.icon} {tab.label} ({garages.length})
                    </button>
                ))}
            </div>

            {/* Garage List */}
            {garages.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '12px' }}>
                    <h3>No {filter} garages</h3>
                    <p style={{ color: '#666' }}>There are currently no garages with status "{filter}"</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {garages.map((garage) => (
                        <div
                            key={garage.id}
                            style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{garage.name}</h3>
                                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                                        Submitted: {garage.submittedAt?.toDate?.().toLocaleDateString() || 'Unknown'}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    background: filter === 'pending' ? '#fff3cd' : filter === 'approved' ? '#d4edda' : '#f8d7da',
                                    color: filter === 'pending' ? '#856404' : filter === 'approved' ? '#155724' : '#721c24',
                                }}>
                                    {filter}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <strong>Address:</strong>
                                    <p style={{ margin: '0.25rem 0', fontSize: '14px', color: '#666' }}>{garage.address}</p>
                                </div>
                                <div>
                                    <strong>Phone:</strong>
                                    <p style={{ margin: '0.25rem 0', fontSize: '14px', color: '#666' }}>{garage.phone}</p>
                                </div>
                                <div>
                                    <strong>Vehicle Types:</strong>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                        {garage.vehicleTypes?.map((type) => (
                                            <span key={type} style={{
                                                background: '#f0f0f0',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                            }}>
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <strong>Services:</strong>
                                    <p style={{ margin: '0.25rem 0', fontSize: '14px', color: '#666' }}>
                                        {garage.services?.join(', ') || 'None specified'}
                                    </p>
                                </div>
                                {garage.workingHours && (
                                    <div>
                                        <strong>Working Hours:</strong>
                                        <p style={{ margin: '0.25rem 0', fontSize: '14px', color: '#666' }}>{garage.workingHours}</p>
                                    </div>
                                )}
                                {garage.submittedBy && (
                                    <div>
                                        <strong>Submitted By:</strong>
                                        <p style={{ margin: '0.25rem 0', fontSize: '14px', color: '#666' }}>{garage.submittedBy}</p>
                                    </div>
                                )}
                            </div>

                            {garage.rejectionReason && (
                                <div style={{ padding: '0.75rem', background: '#f8d7da', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <strong style={{ color: '#721c24' }}>Rejection Reason:</strong>
                                    <p style={{ margin: '0.25rem 0', color: '#721c24', fontSize: '14px' }}>{garage.rejectionReason}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {filter === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(garage.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#34c759',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            ✅ Approve
                                        </button>
                                        <button
                                            onClick={() => setSelectedGarage(garage.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ff3b30',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            ❌ Reject
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => handleDelete(garage.id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'white',
                                        color: '#ff3b30',
                                        border: '2px solid #ff3b30',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                    }}
                                >
                                    🗑️ Delete
                                </button>
                                <a
                                    href={`https://www.google.com/maps?q=${garage.location?.lat},${garage.location?.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'white',
                                        color: '#ff6b00',
                                        border: '2px solid #ff6b00',
                                        borderRadius: '6px',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                    }}
                                >
                                    📍 View on Map
                                </a>
                            </div>

                            {/* Rejection Modal */}
                            {selectedGarage === garage.id && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    background: '#fff3cd',
                                    borderRadius: '8px',
                                    border: '1px solid #ffc107',
                                }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        Rejection Reason:
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Please explain why this garage is being rejected..."
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontFamily: 'inherit',
                                            marginBottom: '0.75rem',
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button
                                            onClick={() => handleReject(garage.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ff3b30',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            Confirm Rejection
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedGarage(null);
                                                setRejectionReason('');
                                            }}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'white',
                                                color: '#666',
                                                border: '1px solid #ddd',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
