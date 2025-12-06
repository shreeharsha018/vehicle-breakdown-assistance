import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config/firebase';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

// User Pages
import Dashboard from './pages/user/Dashboard';
import SelectVehicle from './pages/user/SelectVehicle';
import ViewProblems from './pages/user/ViewProblems';
import ViewSolution from './pages/user/ViewSolution';
import Feedback from './pages/user/Feedback';
import ViewAllFeedback from './pages/user/ViewAllFeedback';
import FindGarage from './pages/user/FindGarage';
import RegisterGarage from './pages/RegisterGarage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageVehicles from './pages/admin/ManageVehicles';
import ManageProblemsAndSolutions from './pages/admin/ManageProblemsAndSolutions';
import ViewFeedback from './pages/admin/ViewFeedback';
import ViewAssistanceRequests from './pages/admin/ViewAssistanceRequests';
import ViewUsers from './pages/admin/ViewUsers';
import ViewUserDetails from './pages/admin/ViewUserDetails';
import ImportFallbackData from './pages/admin/ImportFallbackData';
import ManageGarages from './pages/admin/ManageGarages';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if user is admin
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          setIsAdmin(userDoc.data()?.isAdmin || false);
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Track user activity for session management
  useEffect(() => {
    if (!user) return;

    const updateActivity = async () => {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastActive: new Date()
        });
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    };

    // Update activity every 5 minutes
    const activityInterval = setInterval(updateActivity, 5 * 60 * 1000);

    // Update on user interaction
    const handleActivity = () => {
      updateActivity();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      clearInterval(activityInterval);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router basename="/vehicle-breakdown-assistance">
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} isAdmin={isAdmin} />

        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/all-feedback" element={<ViewAllFeedback />} />
            <Route path="/find-garage" element={<FindGarage />} />
            <Route path="/register-garage" element={<RegisterGarage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin />} />
            <Route
              path="/admin"
              element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login"><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/vehicles"
              element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login"><ManageVehicles /></ProtectedRoute>}
            />
            <Route
              path="/admin/problems"
              element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login"><ManageProblemsAndSolutions /></ProtectedRoute>}
            />
            <Route
              path="/admin/garages"
              element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login"><ManageGarages /></ProtectedRoute>}
            />
            <Route
              path="/admin/feedback"
              element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login"><ViewFeedback /></ProtectedRoute>}
            />
            <Route
              path="/admin/assistance-requests"
              element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login"><ViewAssistanceRequests /></ProtectedRoute>}
            />
            <Route
              path="/admin/users"
              element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login"><ViewUsers /></ProtectedRoute>}
            />
            <Route
              path="/admin/users/:userId"
              element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login"><ViewUserDetails /></ProtectedRoute>}
            />
            <Route
              path="/admin/import-data"
              element={<ProtectedRoute isAllowed={isAdmin} redirectPath="/admin/login"><ImportFallbackData /></ProtectedRoute>}
            />

            {/* User Routes - Dashboard requires login */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute isAllowed={!!user && !isAdmin}><Dashboard /></ProtectedRoute>}
            />

            {/* Help Routes - Public access for emergency help */}
            <Route path="/select-vehicle" element={<SelectVehicle />} />
            <Route path="/problems/:vehicleType" element={<ViewProblems />} />
            <Route path="/solution/:problemId" element={<ViewSolution />} />

            {/* Feedback Routes - Require login to submit/view feedback */}
            <Route
              path="/feedback"
              element={<ProtectedRoute isAllowed={!!user && !isAdmin}><Feedback /></ProtectedRoute>}
            />
            <Route
              path="/all-feedback"
              element={<ProtectedRoute isAllowed={!!user && !isAdmin}><ViewAllFeedback /></ProtectedRoute>}
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}