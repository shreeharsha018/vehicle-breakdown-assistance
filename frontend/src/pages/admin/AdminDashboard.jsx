import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import CarIcon from '../../components/CarIcon';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalProblems: 0,
    totalSolutions: 0,
    totalFeedback: 0,
    totalAssistanceRequests: 0,
    pendingAssistanceRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const vehiclesSnap = await getDocs(collection(db, 'vehicles'));
        const problemsSnap = await getDocs(collection(db, 'problems'));
        const solutionsSnap = await getDocs(collection(db, 'solutions'));
        const feedbackSnap = await getDocs(collection(db, 'feedback'));
        const assistanceSnap = await getDocs(collection(db, 'assistanceRequests'));

        const pendingCount = assistanceSnap.docs.filter(doc => doc.data().status === 'pending').length;

        setStats({
          totalVehicles: vehiclesSnap.size,
          totalProblems: problemsSnap.size,
          totalSolutions: solutionsSnap.size,
          totalFeedback: feedbackSnap.size,
          totalAssistanceRequests: assistanceSnap.size,
          pendingAssistanceRequests: pendingCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage vehicles, problems, solutions, and feedback</p>
      </div>

      <div className="dashboard-grid">
        {/* Emergency Assistance Requests - PRIORITY */}
        <Link to="/admin/assistance-requests" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card" style={{
            borderLeft: '4px solid #ff3b30',
            background: stats.pendingAssistanceRequests > 0 ? '#fff5f5' : undefined
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚨</div>
            <h3>Assistance Requests</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff3b30' }}>
              {stats.pendingAssistanceRequests}
            </p>
            <p style={{ color: '#ff3b30', fontWeight: '600' }}>Pending Requests</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
              {stats.totalAssistanceRequests} total
            </p>
          </div>
        </Link>

        <Link to="/admin/vehicles" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ marginBottom: '1rem' }}><CarIcon size={40} color="#ff6b00" /></div>
            <h3>Vehicle Types</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {stats.totalVehicles}
            </p>
            <p>Manage vehicle categories</p>
          </div>
        </Link>

        <Link to="/admin/problems" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
            <h3>Problems & Solutions</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {stats.totalProblems}
            </p>
            <p>Manage breakdown problems and solutions</p>
          </div>
        </Link>

        <Link to="/admin/feedback" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h3>Feedback</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {stats.totalFeedback}
            </p>
            <p>Review user feedback</p>
          </div>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '3rem', padding: '2rem' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/admin/import-data" className="btn" style={{ background: '#f59e0b', color: 'white' }}>
            📦 Import Existing Data
          </Link>
          <Link to="/admin/users" className="btn btn-primary">
            👥 View All Users
          </Link>
          <Link to="/admin/assistance-requests" className="btn" style={{ background: '#ff3b30', color: 'white' }}>
            🚨 View Requests
          </Link>
          <Link to="/admin/vehicles" className="btn btn-primary">
            + Add Vehicle
          </Link>
          <Link to="/admin/problems" className="btn btn-primary">
            ⚙️ Manage Problems & Solutions
          </Link>
          <Link to="/admin/feedback" className="btn btn-primary">
            View Feedback
          </Link>
        </div>
      </div>
    </div>
  );
}