import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, admin, regular

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort by creation date (newest first)
            usersList.sort((a, b) => {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA;
            });

            setUsers(usersList);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };

    const openMaps = (lat, lon) => {
        if (lat && lon) {
            window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'admin') return user.isAdmin === true;
        if (filter === 'regular') return !user.isAdmin;
        return true;
    });

    if (loading) return <div className="dashboard-container"><p>Loading users...</p></div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>👥 Registered Users</h1>
                <p>View all users registered on the platform</p>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('all')}
                >
                    All Users ({users.length})
                </button>
                <button
                    className={`btn ${filter === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('admin')}
                >
                    Admins ({users.filter(u => u.isAdmin).length})
                </button>
                <button
                    className={`btn ${filter === 'regular' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('regular')}
                >
                    Regular Users ({users.filter(u => !u.isAdmin).length})
                </button>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</p>
                    <p style={{ color: '#64748b' }}>No users found.</p>
                </div>
            ) : (
                <div className="card">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Location</th>
                                    <th>Registered</th>
                                    <th>Last Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        {/* User Name */}
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: user.isAdmin ? '#2563eb' : '#10b981',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <Link
                                                        to={`/admin/users/${user.id}`}
                                                        style={{
                                                            color: '#2563eb',
                                                            fontWeight: 'bold',
                                                            textDecoration: 'none'
                                                        }}
                                                    >
                                                        {user.fullName || 'Unknown'}
                                                    </Link>
                                                    {user.emailVerified && (
                                                        <span style={{
                                                            marginLeft: '0.5rem',
                                                            fontSize: '0.75rem',
                                                            background: '#10b981',
                                                            color: 'white',
                                                            padding: '0.125rem 0.5rem',
                                                            borderRadius: '12px'
                                                        }}>
                                                            ✓ Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td>
                                            <a href={`mailto:${user.email}`} style={{ color: '#2563eb' }}>
                                                {user.email}
                                            </a>
                                        </td>

                                        {/* Phone */}
                                        <td>
                                            {user.phone ? (
                                                <a href={`tel:${user.phone}`} style={{ color: '#2563eb' }}>
                                                    {user.phone}
                                                </a>
                                            ) : (
                                                <span style={{ color: '#94a3b8' }}>-</span>
                                            )}
                                        </td>

                                        {/* Role */}
                                        <td>
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
                                        </td>

                                        {/* Location */}
                                        <td>
                                            {user.latitude && user.longitude ? (
                                                <div>
                                                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                                        📍 {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
                                                    </div>
                                                    <button
                                                        onClick={() => openMaps(user.latitude, user.longitude)}
                                                        className="btn btn-primary"
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                                                    >
                                                        🗺️ View Map
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#94a3b8' }}>No location</span>
                                            )}
                                        </td>

                                        {/* Registered */}
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {formatDate(user.createdAt)}
                                        </td>

                                        {/* Last Active */}
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {user.lastActive ? formatDate(user.lastActive) :
                                                user.lastLogin ? formatDate(user.lastLogin) :
                                                    '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Stats */}
                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                Total Users
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                                {users.length}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                With Location Data
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                                {users.filter(u => u.latitude && u.longitude).length}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                Verified Emails
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                                {users.filter(u => u.emailVerified).length}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                Admins
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                                {users.filter(u => u.isAdmin).length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
