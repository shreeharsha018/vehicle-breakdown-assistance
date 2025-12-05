import { useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function MigrateAuthUsers() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);

    const migrateUsers = async () => {
        setLoading(true);
        setMessage('');

        try {
            // Note: This is a workaround since we can't access Firebase Auth users from client
            // You'll need to do this manually in Firebase Console

            setMessage(`
        ⚠️ Manual Migration Required:
        
        Since we can't access Firebase Authentication users from the client side,
        you need to manually create Firestore documents for existing users:
        
        Steps:
        1. Go to Firebase Console → Authentication → Users
        2. For each user, copy their UID
        3. Go to Firestore Database → users collection
        4. Click "Add document"
        5. Use the UID as Document ID
        6. Add these fields:
           - email: (user's email)
           - fullName: (user's name or email)
           - phone: "" (empty for now)
           - isAdmin: false (or true for admin)
           - emailVerified: false
           - createdAt: (server timestamp)
           - latitude: null
           - longitude: null
        7. Save
        
        OR Better Option:
        Ask those users to register again - the new registration will save properly!
      `);

        } catch (error) {
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>🔄 Migrate Auth Users to Firestore</h1>
                <p>Transfer existing authentication users to Firestore database</p>
            </div>

            <div className="card">
                <h3>Migration Tool</h3>
                <p>This will help you migrate users from Firebase Authentication to Firestore.</p>

                <button
                    onClick={migrateUsers}
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                >
                    {loading ? 'Checking...' : 'Show Migration Instructions'}
                </button>

                {message && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: '#fef3c7',
                        borderRadius: '8px',
                        whiteSpace: 'pre-line',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem'
                    }}>
                        {message}
                    </div>
                )}
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>🔧 Quick Fix Option</h3>
                <p>If you just want to create an admin user quickly:</p>

                <ol style={{ marginTop: '1rem', lineHeight: '2' }}>
                    <li>Go to Firebase Console → Firestore Database</li>
                    <li>Click "Start collection" → Collection ID: <code>users</code></li>
                    <li>Document ID: <code>admin-user-001</code> (or any ID)</li>
                    <li>Add fields:
                        <ul>
                            <li><code>email</code>: "admin@test.com"</li>
                            <li><code>fullName</code>: "Admin User"</li>
                            <li><code>phone</code>: "1234567890"</li>
                            <li><code>isAdmin</code>: true (boolean)</li>
                            <li><code>emailVerified</code>: true (boolean)</li>
                            <li><code>createdAt</code>: (timestamp - use server timestamp)</li>
                        </ul>
                    </li>
                    <li>Save</li>
                    <li>Go to Authentication → Add user with same email/password</li>
                    <li>Copy the UID from Authentication</li>
                    <li>Go back to Firestore → Rename document ID to match the UID</li>
                </ol>
            </div>
        </div>
    );
}
