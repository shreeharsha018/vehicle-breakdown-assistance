import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export default function Feedback() {
  const [formData, setFormData] = useState({
    rating: 0,
    feedback: '',
    problemArea: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (formData.rating === 0) {
        throw new Error('Please select a rating');
      }

      if (!formData.feedback.trim()) {
        throw new Error('Please write your feedback');
      }

      if (!auth.currentUser) {
        throw new Error('You must be logged in to submit feedback');
      }

      await addDoc(collection(db, 'feedback'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userEmail: auth.currentUser.email,
        rating: formData.rating,
        feedback: formData.feedback,
        problemArea: formData.problemArea,
        createdAt: new Date(),
        approved: false
      });

      setMessage('Thank you! Your feedback has been submitted.');
      setTimeout(() => {
        navigate('/all-feedback');
      }, 1500);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-form">
      <h1>Share Your Feedback</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Help us improve our service by sharing your experience
      </p>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>How would you rate our service?</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                className={`rating-option ${formData.rating === rating ? 'selected' : ''}`}
                onClick={() => handleRatingClick(rating)}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="problemArea">Problem Area (Optional)</label>
          <input
            type="text"
            id="problemArea"
            name="problemArea"
            value={formData.problemArea}
            onChange={handleChange}
            placeholder="E.g., Brake issue, Engine problem, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="feedback">Your Feedback</label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            placeholder="Share your experience with us..."
            rows="6"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}