import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      // Set session persistence based on "Remember Me"
      const persistence = formData.rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);

      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // Check email verification
      if (!userCredential.user.emailVerified) {
        setError('Please verify your email before logging in. Check your inbox and spam folder.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      // Update last login time in Firestore
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: new Date(),
        lastActive: new Date()
      });

      navigate('/dashboard');
    } catch (err) {
      // User-friendly error messages
      let friendlyError = 'An error occurred. Please try again.';

      if (err.code === 'auth/user-not-found') {
        friendlyError = 'No account found with this email. Please register first.';
      } else if (err.code === 'auth/wrong-password') {
        friendlyError = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Invalid email address format.';
      } else if (err.code === 'auth/user-disabled') {
        friendlyError = 'This account has been disabled. Contact support.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyError = 'Too many failed attempts. Please try again later.';
      } else if (err.message) {
        friendlyError = err.message;
      }

      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="form-group" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            style={{ width: 'auto', margin: 0 }}
          />
          <label htmlFor="rememberMe" style={{ margin: 0, fontWeight: 'normal', cursor: 'pointer' }}>
            Keep me logged in (Remember Me)
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>

        <div className="auth-link" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          <Link to="/verify-email" style={{ color: '#ff6b00' }}>Resend verification email</Link>
        </div>
      </form>
    </div>
  );
}