import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ViewUserDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            // Fetch user profile
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                setUser({ id: userId, ...userDoc.data() });
            }

            // Fetch user activities (assistance requests = activity log)
            const activitiesQuery = query(
                collection(db, 'assistanceRequests'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const activitiesSnap = await getDocs(activitiesQuery);
            const activitiesList = activitiesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setActivities(activitiesList);
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateShort = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const openMaps = (lat, lon) => {
        window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
    };

    const getActivityIcon = (type) => {
        if (type === 'emergency-assistance') return '🚨';
        if (type === 'view-solution') return '👁️';
        return '📋';
    };

    const getActivityColor = (type) => {
        if (type === 'emergency-assistance') return '#ff3b30';
        if (type === 'view-solution') return '#2563eb';
        return '#64748b';
    };

    if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

    if (!user) {
        return (
            <div className="dashboard-container">
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>User not found</p>
                    <button onClick={() => navigate('/admin/users')} className="btn btn-primary">
                        ← Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Header with Back Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button onClick={() => navigate('/admin/users')} className="btn btn-secondary">
                    ← Back to Users
                </button>
            </div>

            {/* User Profile Card */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: user.isAdmin ? '#2563eb' : '#10b981',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        fontWeight: 'bold'
                    }}>
                        {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </div>

                    {/* User Info */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{ marginBottom: '0.5rem' }}>{user.fullName || 'Unknown User'}</h1>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                background: user.isAdmin ? '#dbeafe' : '#d1fae5',
                                color: user.isAdmin ? '#1e40af' : '#065f46'
                            }}>
                                {user.isAdmin ? '👨‍💼 Admin' : '👤 User'}
                            </span>

                            {user.emailVerified && (
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: '#d1fae5',
                                    color: '#065f46'
                                }}>
                                    ✓ Email Verified
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            <div>
                                <strong>📧 Email:</strong><br />
                                <a href={`mailto:${user.email}`} style={{ color: '#2563eb' }}>
                                    {user.email}
                                </a>
                            </div>

                            <div>
                                <strong>📱 Phone:</strong><br />
                                {user.phone ? (
                                    <a href={`tel:${user.phone}`} style={{ color: '#2563eb' }}>
                                        {user.phone}
                                    </a>
                                ) : (
                                    <span style={{ color: '#94a3b8' }}>Not provided</span>
                                )}
                            </div>

                            <div>
                                <strong>📅 Registered:</strong><br />
                                {formatDateShort(user.createdAt)}
                            </div>

                            <div>
                                <strong>⏰ Last Active:</strong><br />
                                {user.lastActive ? formatDateShort(user.lastActive) : 'Never'}
                            </div>
                        </div>

                        {/* Current Location */}
                        {user.latitude && user.longitude && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: '#f0fdf4',
                                borderRadius: '8px',
                                border: '1px solid #86efac'
                            }}>
                                <strong>📍 Current Location:</strong><br />
                                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                    {user.latitude.toFixed(6)}, {user.longitude.toFixed(6)}
                                </span>
                                <button
                                    onClick={() => openMaps(user.latitude, user.longitude)}
                                    className="btn btn-primary"
                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', marginLeft: '1rem' }}
                                >
                                    🗺️ View on Map
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Statistics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>📊</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                        {activities.length}
                    </div>
                    <div>Total Activities</div>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>👁️</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                        {activities.filter(a => a.requestType === 'view-solution').length}
                    </div>
                    <div>Solutions Viewed</div>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>🚨</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff3b30' }}>
                        {activities.filter(a => a.requestType === 'emergency-assistance').length}
                    </div>
                    <div>Emergency Requests</div>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>📍</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                        {activities.filter(a => a.location).length}
                    </div>
                    <div>With Location Data</div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="card">
                <h2>📜 Activity Timeline</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                    Complete history of all user actions on the platform
                </p>

                {activities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <p>No activity recorded yet</p>
                    </div>
                ) : (
                    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                        {/* Timeline line */}
                        <div style={{
                            position: 'absolute',
                            left: '0.5rem',
                            top: '1rem',
                            bottom: '1rem',
                            width: '2px',
                            background: '#e2e8f0'
                        }} />

                        {activities.map((activity, index) => (
                            <div
                                key={activity.id}
                                style={{
                                    position: 'relative',
                                    marginBottom: '2rem',
                                    paddingLeft: '1.5rem'
                                }}
                            >
                                {/* Timeline dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-1.25rem',
                                    top: '0.5rem',
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    borderRadius: '50%',
                                    background: getActivityColor(activity.requestType),
                                    border: '3px solid white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem'
                                }}>
                                    {getActivityIcon(activity.requestType)}
                                </div>

                                {/* Activity Card */}
                                <div style={{
                                    padding: '1.5rem',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    borderLeft: `4px solid ${getActivityColor(activity.requestType)}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>
                                                {activity.requestType === 'emergency-assistance' ? '🚨 Emergency Assistance Requested' : '👁️ Viewed Solution'}
                                            </h3>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                {formatDate(activity.createdAt)}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            background: activity.status === 'resolved' ? '#d1fae5' :
                                                activity.status === 'in-progress' ? '#dbeafe' :
                                                    activity.status === 'pending' ? '#fef3c7' : '#f1f5f9',
                                            color: activity.status === 'resolved' ? '#065f46' :
                                                activity.status === 'in-progress' ? '#1e40af' :
                                                    activity.status === 'pending' ? '#854d0e' : '#475569',
                                            height: 'fit-content'
                                        }}>
                                            {activity.status}
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <strong>🚗 Vehicle:</strong> {activity.vehicleType}
                                        </div>
                                        <div>
                                            <strong>⚠️ Problem:</strong> {activity.problemTitle}
                                        </div>
                                    </div>

                                    {activity.location && (
                                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '6px' }}>
                                            <strong>📍 Location:</strong><br />
                                            <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                                {activity.location.latitude.toFixed(6)}, {activity.location.longitude.toFixed(6)}
                                            </span>
                                            <button
                                                onClick={() => openMaps(activity.location.latitude, activity.location.longitude)}
                                                className="btn btn-primary"
                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', marginLeft: '1rem' }}
                                            >
                                                🗺️ View on Map
                                            </button>
                                        </div>
                                    )}

                                    {activity.notes && (
                                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff7ed', borderRadius: '6px' }}>
                                            <strong>📝 Admin Notes:</strong><br />
                                            {activity.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
