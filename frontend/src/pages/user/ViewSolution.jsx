import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, doc, addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { fallbackProblemIndex } from "./ViewProblems";
import { getCurrentLocation } from "../../utils/locationUtils";
import ChatWidget from "../../components/AIChat/ChatWidget";

export default function ViewSolution() {
  const { problemId } = useParams();
  const [solution, setSolution] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [requestingAssistance, setRequestingAssistance] = useState(false);
  const [assistanceRequested, setAssistanceRequested] = useState(false);
  const [locationError, setLocationError] = useState('');
  const navigate = useNavigate();
  const fallbackProblem = fallbackProblemIndex[problemId];

  // Use ref to prevent duplicate tracking in development mode
  const hasTrackedView = useRef(false);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const problemDoc = await getDoc(doc(db, "problems", problemId));
        if (problemDoc.exists()) {
          const problemData = { id: problemId, ...problemDoc.data() };
          setProblem(problemData);

          if (problemData.solutionId) {
            const solutionDoc = await getDoc(doc(db, "solutions", problemData.solutionId));
            if (solutionDoc.exists()) {
              setSolution(solutionDoc.data());
            } else if (fallbackProblem) {
              setSolution(fallbackProblem.solution);
            }
          } else if (fallbackProblem) {
            setSolution(fallbackProblem.solution);
          }

          return;
        }

        if (fallbackProblem) {
          setProblem(fallbackProblem);
          setSolution(fallbackProblem.solution);
          return;
        }

        setProblem(null);
        setSolution(null);
      } catch (error) {
        console.error("Error fetching solution:", error);
        if (fallbackProblem) {
          setProblem(fallbackProblem);
          setSolution(fallbackProblem.solution);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();

    // Only track view once per mount
    if (!hasTrackedView.current) {
      captureViewLocation();
      hasTrackedView.current = true;
    }
  }, [problemId]); // Only depend on problemId, not fallbackProblem

  const captureViewLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      // Save view-solution request to track user activity
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();

        await addDoc(collection(db, 'assistanceRequests'), {
          userId: auth.currentUser.uid,
          userName: userData?.fullName || 'Unknown',
          userEmail: userData?.email || auth.currentUser.email,
          userPhone: userData?.phone || 'Not provided',
          problemId: problemId,
          problemTitle: problem?.title || fallbackProblem?.title || 'Unknown Problem',
          vehicleType: problem?.vehicleType || fallbackProblem?.vehicleType || 'Unknown',
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy
          },
          requestType: 'view-solution',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: ''
        });
      }
    } catch (error) {
      console.log("Location capture error:", error.message);
      setLocationError(error.message);
    }
  };

  const requestEmergencyAssistance = async () => {
    if (!auth.currentUser) {
      alert('Please login to request assistance');
      navigate('/login');
      return;
    }

    setRequestingAssistance(true);

    try {
      let location = userLocation;

      // If location not captured yet, try again
      if (!location) {
        location = await getCurrentLocation();
        setUserLocation(location);
      }

      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userData = userDoc.data();

      await addDoc(collection(db, 'assistanceRequests'), {
        userId: auth.currentUser.uid,
        userName: userData?.fullName || 'Unknown',
        userEmail: userData?.email || auth.currentUser.email,
        userPhone: userData?.phone || 'Not provided',
        problemId: problemId,
        problemTitle: problem?.title || 'Unknown Problem',
        vehicleType: problem?.vehicleType || 'Unknown',
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        requestType: 'emergency-assistance',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: ''
      });

      setAssistanceRequested(true);
      alert('🚨 Emergency assistance requested! Our team will contact you shortly at ' + (userData?.phone || 'your registered number'));
    } catch (error) {
      console.error('Error requesting assistance:', error);
      alert('Failed to request assistance: ' + error.message);
    } finally {
      setRequestingAssistance(false);
    }
  };

  if (loading) return <div className="solution-container"><p>Loading...</p></div>;

  if (!problem || !solution) {
    return (
      <div className="solution-container">
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p>Solution not found</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary mt-2">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const extractYoutubeId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="solution-container">
      <div className="solution-header">
        <h1>{problem.title}</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>{problem.description}</p>

        {/* Emergency Assistance Banner */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #ff3b30 0%, #ff6b00 100%)',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚨</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>Need Immediate Help?</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', opacity: 0.95 }}>
            Can't fix it yourself? Our team can dispatch emergency assistance to your location.
          </p>
          {assistanceRequested ? (
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '1rem',
              borderRadius: '8px',
              border: '2px solid rgba(255,255,255,0.5)'
            }}>
              <strong>✅ Assistance Requested!</strong>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                Our team will contact you shortly. Keep your phone nearby.
              </p>
            </div>
          ) : (
            <button
              onClick={requestEmergencyAssistance}
              disabled={requestingAssistance}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'white',
                color: '#ff3b30',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: requestingAssistance ? 'not-allowed' : 'pointer',
                opacity: requestingAssistance ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => !requestingAssistance && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              {requestingAssistance ? '📡 Requesting...' : '🆘 Request Emergency Assistance'}
            </button>
          )}
        </div>

        {userLocation && (
          <p style={{ fontSize: "0.85rem", color: "#10b981", marginTop: "1rem", background: '#f0fdf4', padding: '0.75rem', borderRadius: '8px', border: '1px solid #86efac' }}>
            ✅ Location captured: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </p>
        )}

        {locationError && (
          <p style={{ fontSize: "0.85rem", color: "#ef4444", marginTop: "1rem", background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fca5a5' }}>
            ⚠️ {locationError}
          </p>
        )}
      </div>

      {solution.videoLink && (
        <div className="video-container">
          <div style={{ color: "white", marginBottom: "1rem", fontWeight: 600 }}>Watch Video Tutorial:</div>
          <iframe
            src={`https://www.youtube.com/embed/${extractYoutubeId(solution.videoLink)}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <a
              className="btn btn-secondary"
              href={solution.videoLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on YouTube
            </a>
          </div>
        </div>
      )}

      <div className="solution-content">
        <h2>Solution</h2>
        <p>{solution.description}</p>

        {solution.steps && solution.steps.length > 0 && (
          <>
            <h2>Step-by-Step Guide</h2>
            <ol>
              {solution.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </>
        )}

        {solution.tools && solution.tools.length > 0 && (
          <>
            <h2>Tools Required</h2>
            <ul>
              {solution.tools.map((tool, index) => (
                <li key={index}>{tool}</li>
              ))}
            </ul>
          </>
        )}

        {solution.precautions && (
          <>
            <h2>Important Precautions</h2>
            <p>{solution.precautions}</p>
          </>
        )}

        <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#f0f9ff", borderLeft: "4px solid #2563eb", borderRadius: "0.5rem" }}>
          <strong>💡 Tip:</strong> If this solution doesn't resolve your issue, please give us feedback so we can help better next time.
        </div>
      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: 'wrap' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Back
        </button>
        <button onClick={() => navigate("/feedback")} className="btn btn-primary">
          Give Feedback →
        </button>
      </div>

      <ChatWidget
        mode="solution"
        problemData={{
          vehicleType: problem?.vehicleType || fallbackProblem?.vehicleType,
          title: problem?.title || fallbackProblem?.title,
          description: problem?.description || fallbackProblem?.description
        }}
      />
    </div>
  );
}
