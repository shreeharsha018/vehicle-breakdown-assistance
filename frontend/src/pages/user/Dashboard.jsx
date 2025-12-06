import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';
import ChatWidget from '../../components/AIChat/ChatWidget';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          setUser(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.fullName}!</h1>
        <p>What would you like to do today?</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/select-vehicle" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚗</div>
            <h3>Get Help</h3>
            <p>Select your vehicle type and find solutions for your problems.</p>
          </div>
        </Link>

        <Link to="/feedback" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h3>Give Feedback</h3>
            <p>Share your experience and help other users.</p>
          </div>
        </Link>

        <Link to="/all-feedback" style={{ textDecoration: 'none' }}>
          <div className="dashboard-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⭐</div>
            <h3>View Feedback</h3>
            <p>Read feedback from other users in the community.</p>
          </div>
        </Link>

        <div
          className="dashboard-card emergency-card"
          style={{
            background: 'linear-gradient(135deg, #ff3b30 0%, #dc2626 100%)',
            color: 'white',
            cursor: 'default',
            border: 'none'
          }}
        >
          <div style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            background: 'transparent'
          }}>🚨</div>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Emergency Contacts</h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.95rem'
          }}>
            <a
              href="tel:100"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🚓 Police: 100
            </a>
            <a
              href="tel:108"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🚑 Ambulance: 108
            </a>
            <a
              href="tel:1073"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🚗 Road Helpline: 1073
            </a>
          </div>
        </div>

        <div className="dashboard-card ai-card" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          gridColumn: 'span 2',
          cursor: 'default',
          border: 'none'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>AI Diagnostic Assistant</h3>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem' }}>
            Not sure what's wrong? Describe your problem naturally and let AI help diagnose the issue!
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            fontSize: '0.9rem'
          }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: '12px' }}>
              💬 Natural language understanding
            </span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: '12px' }}>
              🎯 Accurate  diagnostics
            </span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: '12px' }}>
              🔧 Step-by-step guidance
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', marginTop: '1rem', opacity: 0.8 }}>
            Click the chat button below to start 👇
          </p>
        </div>
      </div>

      <ChatWidget mode="diagnostic" />
    </div>
  );
}