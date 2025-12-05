import { Link } from 'react-router-dom';
import './pages.css';

export default function Services() {
    return (
        <div className="page-container">
            <section className="hero-small">
                <div className="container">
                    <h1>Our Services</h1>
                    <p>Comprehensive breakdown assistance for all vehicle types</p>
                </div>
            </section>

            <div className="container">
                <div className="content-section">
                    <h2>What We Offer</h2>
                    <p>
                        Our platform provides instant access to expert vehicle breakdown solutions, covering
                        the most common problems across all vehicle categories.
                    </p>

                    <div className="services-grid" style={{ marginTop: '3rem' }}>
                        {/* 2-Wheeler Services */}
                        <div className="service-category">
                            <div className="category-header" style={{
                                background: 'linear-gradient(135deg, #ff6b00 0%, #e05a00 100%)',
                                color: 'white',
                                padding: '1.5rem',
                                borderRadius: '10px 10px 0 0'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏍️</div>
                                <h3>2-Wheeler Services</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', margin: 0 }}>
                                    Motorcycles, Scooters & Bikes
                                </p>
                            </div>
                            <div className="card" style={{ borderRadius: '0 0 10px 10px', marginTop: 0 }}>
                                <ul style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                                    <li>Engine starting problems</li>
                                    <li>Flat tire repairs</li>
                                    <li>Battery issues</li>
                                    <li>Brake problems</li>
                                    <li>Chain maintenance</li>
                                    <li>Fuel system issues</li>
                                </ul>
                                <Link
                                    to="/problems/2-wheeler"
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem', width: '100%', textDecoration: 'none' }}
                                >
                                    Get 2W Help
                                </Link>
                            </div>
                        </div>

                        {/* 3-Wheeler Services */}
                        <div className="service-category">
                            <div className="category-header" style={{
                                background: 'linear-gradient(135deg, #ff9500 0%, #ff6b00 100%)',
                                color: 'white',
                                padding: '1.5rem',
                                borderRadius: '10px 10px 0 0'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛺</div>
                                <h3>3-Wheeler Services</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', margin: 0 }}>
                                    Auto-rickshaws & Three-wheelers
                                </p>
                            </div>
                            <div className="card" style={{ borderRadius: '0 0 10px 10px', marginTop: 0 }}>
                                <ul style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                                    <li>Starting difficulties</li>
                                    <li>Battery replacement</li>
                                    <li>Electrical issues</li>
                                    <li>Suspension problems</li>
                                    <li>Clutch issues</li>
                                    <li>Engine maintenance</li>
                                </ul>
                                <Link
                                    to="/problems/3-wheeler"
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem', width: '100%', textDecoration: 'none' }}
                                >
                                    Get 3W Help
                                </Link>
                            </div>
                        </div>

                        {/* 4-Wheeler Services */}
                        <div className="service-category">
                            <div className="category-header" style={{
                                background: 'linear-gradient(135deg, #ff3b30 0%, #dc2626 100%)',
                                color: 'white',
                                padding: '1.5rem',
                                borderRadius: '10px 10px 0 0'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚗</div>
                                <h3>4-Wheeler Services</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', margin: 0 }}>
                                    Cars, SUVs & Vans
                                </p>
                            </div>
                            <div className="card" style={{ borderRadius: '0 0 10px 10px', marginTop: 0 }}>
                                <ul style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                                    <li>Engine overheating</li>
                                    <li>Flat tire assistance</li>
                                    <li>Battery jump-start</li>
                                    <li>Brake failures</li>
                                    <li>AC problems</li>
                                    <li>Transmission issues</li>
                                </ul>
                                <Link
                                    to="/problems/4-wheeler"
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem', width: '100%', textDecoration: 'none' }}
                                >
                                    Get 4W Help
                                </Link>
                            </div>
                        </div>
                    </div>

                    <h2 style={{ marginTop: '4rem' }}>How It Works</h2>
                    <div className="steps" style={{ marginTop: '2rem' }}>
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Select Vehicle</h3>
                            <p>Choose your vehicle type</p>
                        </div>
                        <div className="step-arrow">→</div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Find Problem</h3>
                            <p>Browse common issues</p>
                        </div>
                        <div className="step-arrow">→</div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Watch Solution</h3>
                            <p>Follow video tutorial</p>
                        </div>
                        <div className="step-arrow">→</div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <h3>Get Back On Road</h3>
                            <p>Problem solved!</p>
                        </div>
                    </div>

                    <div className="features-grid" style={{ marginTop: '4rem' }}>
                        <div className="feature-card">
                            <div className="feature-icon">🎥</div>
                            <h3>Expert Video Guides</h3>
                            <p>Professional mechanics show you step-by-step solutions</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📍</div>
                            <h3>GPS Location Sharing</h3>
                            <p>Share your location for accurate assistance</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⭐</div>
                            <h3>Community Verified</h3>
                            <p>Solutions tested and approved by real users</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
