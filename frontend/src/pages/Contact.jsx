import { useState } from 'react';
import './pages.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you'd send this to a backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="page-container">
            <section className="hero-small">
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>We're here to help 24/7</p>
                </div>
            </section>

            <div className="container">
                <div className="content-section">
                    <div className="contact-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        {/* Contact Info */}
                        <div>
                            <h2>Get In Touch</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Have questions? Need support? We're available 24/7 to assist you.
                            </p>

                            <div className="contact-info">
                                <div className="contact-item" style={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '1rem',
                                    marginBottom: '1.5rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--bg-light)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ fontSize: '1.5rem' }}>📧</div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>Email</h4>
                                        <a href="mailto:shreeharshag027@gmail.com" style={{ color: 'var(--primary)' }}>
                                            shreeharshag027@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-item" style={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '1rem',
                                    marginBottom: '1.5rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--bg-light)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ fontSize: '1.5rem' }}>📱</div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>Phone</h4>
                                        <a href="tel:7019669276" style={{ color: 'var(--primary)' }}>
                                            7019669276
                                        </a>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: 0 }}>
                                            Available 24/7
                                        </p>
                                    </div>
                                </div>

                                <div className="contact-item" style={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '1rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--bg-light)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ fontSize: '1.5rem' }}>⏰</div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>Hours</h4>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                                            24 hours a day, 7 days a week
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="emergency-notice" style={{
                                background: 'linear-gradient(135deg, #ff3b30 0%, #dc2626 100%)',
                                color: 'white',
                                padding: '1.5rem',
                                borderRadius: '10px',
                                marginTop: '2rem'
                            }}>
                                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>🚨 Emergency?</h3>
                                <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                    Don't wait for a response - get instant help now!
                                </p>
                                <a
                                    href="/select-vehicle"
                                    className="btn btn-secondary"
                                    style={{
                                        backgroundColor: 'white',
                                        color: '#ff3b30',
                                        width: '100%',
                                        textAlign: 'center'
                                    }}
                                >
                                    Get Help Immediately
                                </a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <div className="card">
                                <h3>Send Us a Message</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                    For non-emergency inquiries, feedback, or suggestions
                                </p>

                                {submitted && (
                                    <div className="alert alert-success">
                                        Thank you! We'll get back to you soon.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Your phone number"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Subject *</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="What is your message about?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Message *</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            placeholder="Tell us more..."
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
