import { Link } from 'react-router-dom';
import './pages.css';

export default function About() {
    return (
        <div className="page-container">
            <section className="hero-small">
                <div className="container">
                    <h1>About Us</h1>
                    <p>Your trusted partner for 24/7 vehicle breakdown assistance</p>
                </div>
            </section>

            <div className="container">
                <div className="content-section">
                    <h2>Who We Are</h2>
                    <p>
                        Vehicle Breakdown Assistance (VBA) is your reliable companion on the road. We provide
                        instant help for all types of vehicle emergencies, from 2-wheelers to 4-wheelers.
                    </p>
                    <p>
                        Founded with the mission to ensure no driver is ever stranded, we combine expert knowledge
                        with modern technology to deliver quick, effective solutions when you need them most.
                    </p>

                    <h2>Our Mission</h2>
                    <p>
                        To provide immediate, accessible, and reliable vehicle breakdown solutions to everyone,
                        anytime, anywhere. We believe that help should be just a click away, with no barriers
                        between you and the solution you need.
                    </p>

                    <h2>Why Choose Us?</h2>
                    <div className="features-grid" style={{ marginTop: '2rem' }}>
                        <div className="feature-card">
                            <div className="feature-icon">🚗</div>
                            <h3>All Vehicle Types</h3>
                            <p>Support for 2-wheelers, 3-wheelers, and 4-wheelers</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎥</div>
                            <h3>Video Tutorials</h3>
                            <p>Step-by-step visual guides from experts</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⏰</div>
                            <h3>24/7 Available</h3>
                            <p>Help available round the clock, every day</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📍</div>
                            <h3>GPS Enabled</h3>
                            <p>Location-based assistance for faster help</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">✅</div>
                            <h3>Verified Solutions</h3>
                            <p>Community-tested and approved fixes</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🆓</div>
                            <h3>Free Access</h3>
                            <p>No registration required for emergency help</p>
                        </div>
                    </div>

                    <h2>Our Approach</h2>
                    <p>
                        We understand that vehicle breakdowns are stressful and often happen at the worst times.
                        That's why we've made our platform accessible to everyone - even without registration.
                        When you're in trouble, getting help should be immediate, not delayed by sign-up forms.
                    </p>
                    <p>
                        Our expert-curated solutions are designed to be easy to follow, with clear video demonstrations
                        that show you exactly what to do. We cover common problems and their fixes, helping you get
                        back on the road quickly and safely.
                    </p>

                    <div className="cta-box" style={{
                        background: 'linear-gradient(135deg, #ff6b00 0%, #ff3b30 100%)',
                        color: 'white',
                        padding: '2rem',
                        borderRadius: '10px',
                        textAlign: 'center',
                        marginTop: '3rem'
                    }}>
                        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Need Help Right Now?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem' }}>
                            Don't wait - get instant access to vehicle breakdown solutions
                        </p>
                        <Link to="/select-vehicle" className="btn btn-secondary btn-lg" style={{
                            backgroundColor: 'white',
                            color: '#ff3b30'
                        }}>
                            Get Help Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
