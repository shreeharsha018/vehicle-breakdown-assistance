import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ManageSolutions() {
  const [solutions, setSolutions] = useState([]);
  const [problems, setProblems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoLink: '',
    steps: '',
    tools: '',
    precautions: '',
    problemId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSolutions();
    fetchProblems();
  }, []);

  const fetchSolutions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'solutions'));
      const solutionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSolutions(solutionsList);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'problems'));
      const problemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title
      }));
      setProblems(problemsList);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!formData.title || !formData.description) {
        throw new Error('Title and description are required');
      }

      const solutionData = {
        title: formData.title,
        description: formData.description,
        videoLink: formData.videoLink,
        steps: formData.steps.split('\n').filter(s => s.trim()),
        tools: formData.tools.split('\n').filter(s => s.trim()),
        precautions: formData.precautions,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'solutions'), solutionData);

      // Update problem with solution ID if problemId is provided
      if (formData.problemId) {
        await getDocs(collection(db, 'problems'));
      }

      setMessage('Solution added successfully!');
      setFormData({
        title: '',
        description: '',
        videoLink: '',
        steps: '',
        tools: '',
        precautions: '',
        problemId: ''
      });
      fetchSolutions();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      try {
        await deleteDoc(doc(db, 'solutions', id));
        setMessage('Solution deleted successfully!');
        fetchSolutions();
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Manage Solutions</h1>
        <p>Add solutions with video links and step-by-step guides</p>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {/* Add Solution Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Add New Solution</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label htmlFor="title">Solution Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., How to start the engine"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Solution Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed explanation of the solution..."
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="videoLink">YouTube Video Link</label>
            <input
              type="url"
              id="videoLink"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              placeholder="E.g., https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="steps">Steps (One per line)</label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              placeholder="Step 1&#10;Step 2&#10;Step 3"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="tools">Tools Required (One per line)</label>
            <textarea
              id="tools"
              name="tools"
              value={formData.tools}
              onChange={handleChange}
              placeholder="Tool 1&#10;Tool 2&#10;Tool 3"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="precautions">Important Precautions</label>
            <textarea
              id="precautions"
              name="precautions"
              value={formData.precautions}
              onChange={handleChange}
              placeholder="Safety precautions..."
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : '+ Add Solution'}
          </button>
        </form>
      </div>

      {/* Solutions List */}
      <div className="card">
        <h2>All Solutions</h2>
        {solutions.length === 0 ? (
          <p style={{ marginTop: '1rem', color: '#64748b' }}>No solutions added yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Video</th>
                  <th>Steps</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {solutions.map(solution => (
                  <tr key={solution.id}>
                    <td><strong>{solution.title}</strong></td>
                    <td>
                      {solution.videoLink ? (
                        <a href={solution.videoLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                          🎥 Watch
                        </a>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </td>
                    <td>{solution.steps?.length || 0} steps</td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleDelete(solution.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}