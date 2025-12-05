import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { sendEmailVerification } from 'firebase/auth';

export default function VerifyEmail() {
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResendEmail = async () => {
        setSending(true);
        setMessage('');

        try {
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                setMessage('Verification email sent! Please check your inbox and spam folder.');
            }
        } catch (error) {
            setMessage('Error sending email. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleCheckVerification = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload();

            if (auth.currentUser.emailVerified) {
                navigate('/dashboard');
            } else {
                setMessage('Email not verified yet. Please check your email and click the verification link.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form" style={{ maxWidth: '500px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
                <h1>Verify Your Email</h1>

                <div style={{
                    backgroundColor: '#fff4ed',
                    border: '2px solid #ff6b00',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    textAlign: 'left'
                }}>
                    <p style={{ color: '#1d1d1d', marginBottom: '1rem', fontWeight: '500' }}>
                        <strong>Check your email!</strong>
                    </p>
                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                        We've sent a verification link to your email address. Click the link to verify your account.
                    </p>
                    <div style={{
                        backgroundColor: '#ff6b00',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        marginTop: '1rem'
                    }}>
                        <strong>⚠️ Important:</strong> The email might be in your <strong>spam or junk folder</strong>. Please check there if you don't see it in your inbox!
                    </div>
                </div>

                {message && (
                    <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
                        {message}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={handleCheckVerification}
                        className="btn btn-primary"
                    >
                        I've Verified My Email
                    </button>

                    <button
                        onClick={handleResendEmail}
                        className="btn btn-secondary"
                        disabled={sending}
                    >
                        {sending ? 'Sending...' : 'Resend Verification Email'}
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-secondary"
                        style={{ marginTop: '0.5rem' }}
                    >
                        Back to Login
                    </button>
                </div>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#f0f4ff',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#666'
                }}>
                    <p style={{ margin: 0 }}>
                        💡 <strong>Tip:</strong> Add <code>noreply@vehicle-breakdown-assistance-1.firebaseapp.com</code> to your contacts to avoid future emails going to spam.
                    </p>
                </div>
            </div>
        </div>
    );
}
