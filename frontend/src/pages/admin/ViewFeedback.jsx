import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ViewFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]); // Store all feedback for counts
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFeedback();
  }, [filter]);

  const fetchFeedback = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'feedback'));
      let feedbackList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Store all feedback for accurate counts
      setAllFeedback(feedbackList);

      // Filter based on selection
      let filteredList = [...feedbackList];
      if (filter === 'approved') {
        filteredList = filteredList.filter(f => f.approved);
      } else if (filter === 'pending') {
        filteredList = filteredList.filter(f => !f.approved);
      }

      filteredList.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
      setFeedback(filteredList);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, currentApprovalStatus) => {
    try {
      await updateDoc(doc(db, 'feedback', id), {
        approved: !currentApprovalStatus
      });
      fetchFeedback();
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await deleteDoc(doc(db, 'feedback', id));
        fetchFeedback();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Feedback</h1>
        <p>Review and approve user feedback</p>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All ({allFeedback.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Pending ({allFeedback.filter(f => !f.approved).length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Approved ({allFeedback.filter(f => f.approved).length})
        </button>
      </div>

      {/* Feedback List */}
      {feedback.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No feedback to display</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {feedback.map(item => (
            <div key={item.id} className="card" style={{ borderLeft: `4px solid ${item.approved ? '#10b981' : '#f59e0b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{item.userName || 'Anonymous'}</h3>
                  <p style={{ color: '#999', fontSize: '0.85rem' }}>
                    {item.userEmail}
                  </p>
                  <p style={{ color: '#999', fontSize: '0.85rem' }}>
                    {item.createdAt?.toDate?.()?.toLocaleString() || 'Recently'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {renderStars(item.rating)}
                  </div>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    backgroundColor: item.approved ? '#d1fae5' : '#fef3c7',
                    color: item.approved ? '#065f46' : '#92400e'
                  }}>
                    {item.approved ? '✓ Approved' : '⏳ Pending'}
                  </span>
                </div>
              </div>

              {item.problemArea && (
                <p style={{ color: '#2563eb', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Problem: {item.problemArea}
                </p>
              )}

              <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {item.feedback}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleApprove(item.id, item.approved)}
                  className={`btn ${item.approved ? 'btn-secondary' : 'btn-success'}`}
                >
                  {item.approved ? '✓ Approved' : 'Approve'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}