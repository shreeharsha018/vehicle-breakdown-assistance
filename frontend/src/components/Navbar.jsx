import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import './Navbar.css';

export default function Navbar({ user, isAdmin }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
      // Force reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          🚗 Vehicle Breakdown Assistance
        </Link>

        <button className="menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              {isAdmin ? (
                <>
                  <li><Link to="/admin" onClick={closeMobileMenu}>Dashboard</Link></li>
                  <li><Link to="/admin/vehicles" onClick={closeMobileMenu}>Vehicles</Link></li>
                  <li><Link to="/admin/problems" onClick={closeMobileMenu}>Problems & Solutions</Link></li>
                  <li><Link to="/admin/garages" onClick={closeMobileMenu}>Manage Garages</Link></li>
                  <li><Link to="/admin/feedback" onClick={closeMobileMenu}>Feedback</Link></li>
                  <li><Link to="/admin/users" onClick={closeMobileMenu}>Users</Link></li>
                  <li><Link to="/admin/assistance-requests" onClick={closeMobileMenu}>Assistance Requests</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/dashboard" onClick={closeMobileMenu}>Dashboard</Link></li>
                  <li><Link to="/select-vehicle" onClick={closeMobileMenu}>Get Help</Link></li>
                  <li><Link to="/find-garage" onClick={closeMobileMenu}>Find Garage</Link></li>
                </>
              )}
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={closeMobileMenu}>Login</Link></li>
              <li><Link to="/register" onClick={closeMobileMenu}>
                Register
              </Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}