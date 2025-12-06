import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Vehicle Breakdown Assistance</h3>
            <p>Your trusted 24/7 vehicle breakdown service for quick solutions.</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/register-garage">Register Your Garage</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>
              Email: <a href="mailto:shreeharshag027@gmail.com" style={{ color: '#cbd5e1', textDecoration: 'underline' }}>shreeharshag027@gmail.com</a>
            </p>
            <p>
              Phone: <a href="tel:7019669276" style={{ color: '#cbd5e1', textDecoration: 'underline' }}>7019669276</a>
            </p>
            <p>Available 24/7</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Vehicle Breakdown Assistance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}