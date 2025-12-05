import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ViewAssistanceRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, in-progress, resolved
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        try {
            let q = collection(db, 'assistanceRequests');

            if (filter !== 'all') {
                q = query(
                    collection(db, 'assistanceRequests'),
                    where('status', '==', filter),
                    orderBy('createdAt', 'desc')
                );
            } else {
                q = query(collection(db, 'assistanceRequests'), orderBy('createdAt', 'desc'));
            }

            const querySnapshot = await getDocs(q);
            const requestsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(requestsList);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (requestId, newStatus) => {
        try {
            await updateDoc(doc(db, 'assistanceRequests', requestId), {
                status: newStatus,
                updatedAt: new Date()
            });
            fetchRequests();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const updateNotes = async (requestId) => {
        try {
            await updateDoc(doc(db, 'assistanceRequests', requestId), {
                notes: notes,
                updatedAt: new Date()
            });
            setSelectedRequest(null);
            setNotes('');
            fetchRequests();
        } catch (error) {
            console.error('Error updating notes:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ff9500';
            case 'in-progress': return '#2563eb';
            case 'resolved': return '#10b981';
            case 'cancelled': return '#64748b';
            default: return '#64748b';
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };

    const openMaps = (lat, lon) => {
        window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
    };

    if (loading) return <div className="dashboard-container"><p>Loading requests...</p></div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>🚨 Emergency Assistance Requests</h1>
                <p>View and manage user assistance requests</p>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('all')}
                >
                    All ({requests.length})
                </button>
                <button
                    className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('pending')}
                    style={{ background: filter === 'pending' ? '#ff9500' : undefined }}
                >
                    Pending
                </button>
                <button
                    className={`btn ${filter === 'in-progress' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('in-progress')}
                >
                    In Progress
                </button>
                <button
                    className={`btn ${filter === 'resolved' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('resolved')}
                    style={{ background: filter === 'resolved' ? '#10b981' : undefined }}
                >
                    Resolved
                </button>
            </div>

            {requests.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
                    <p style={{ color: '#64748b' }}>No assistance requests found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {requests.map(request => (
                        <div
                            key={request.id}
                            className="card"
                            style={{
                                borderLeft: `4px solid ${getStatusColor(request.status)}`,
                                padding: '1.5rem'
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem' }}>{request.userName}</h3>
                                    <span
                                        style={{
                                            background: getStatusColor(request.status),
                                            color: 'white',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {request.status}
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b' }}>
                                    <div>{formatDate(request.createdAt)}</div>
                                </div>
                            </div>

                            {/* User Details */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <strong>📧 Email:</strong>
                                    <br />
                                    <a href={`mailto:${request.userEmail}`} style={{ color: '#2563eb' }}>
                                        {request.userEmail}
                                    </a>
                                </div>
                                <div>
                                    <strong>📱 Phone:</strong>
                                    <br />
                                    <a href={`tel:${request.userPhone}`} style={{ color: '#2563eb' }}>
                                        {request.userPhone}
                                    </a>
                                </div>
                            </div>

                            {/* Problem Details */}
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                <div><strong>🚗 Vehicle:</strong> {request.vehicleType}</div>
                                <div style={{ marginTop: '0.5rem' }}><strong>⚠️ Problem:</strong> {request.problemTitle}</div>
                                {request.requestType && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <strong>Type:</strong> {request.requestType === 'emergency-assistance' ? '🚨 Emergency' : '👁️ View Solution'}
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            {request.location && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <strong>📍 Location:</strong>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '0.5rem', borderRadius: '4px' }}>
                                            {request.location.latitude}, {request.location.longitude}
                                        </span>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => openMaps(request.location.latitude, request.location.longitude)}
                                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                        >
                                            🗺️ Open in Google Maps
                                        </button>
                                    </div>
                                    {request.locationAddress && (
                                        <div style={{ marginTop: '0.5rem', color: '#64748b' }}>
                                            {request.locationAddress}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Admin Notes */}
                            {request.notes && (
                                <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <strong>📝 Admin Notes:</strong>
                                    <div style={{ marginTop: '0.5rem' }}>{request.notes}</div>
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                                {request.status === 'pending' && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => updateStatus(request.id, 'in-progress')}
                                    >
                                        ▶️ Mark In Progress
                                    </button>
                                )}
                                {request.status === 'in-progress' && (
                                    <button
                                        className="btn"
                                        onClick={() => updateStatus(request.id, 'resolved')}
                                        style={{ background: '#10b981', color: 'white' }}
                                    >
                                        ✅ Mark Resolved
                                    </button>
                                )}
                                {request.status !== 'cancelled' && request.status !== 'resolved' && (
                                    <button
                                        className="btn"
                                        onClick={() => updateStatus(request.id, 'cancelled')}
                                        style={{ background: '#64748b', color: 'white' }}
                                    >
                                        ❌ Cancel Request
                                    </button>
                                )}
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setSelectedRequest(request.id);
                                        setNotes(request.notes || '');
                                    }}
                                >
                                    📝 {request.notes ? 'Edit' : 'Add'} Notes
                                </button>
                            </div>

                            {/* Notes Editor */}
                            {selectedRequest === request.id && (
                                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                        Admin Notes:
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add notes about this request..."
                                        rows="3"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => updateNotes(request.id)}
                                        >
                                            Save Notes
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setSelectedRequest(null);
                                                setNotes('');
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
