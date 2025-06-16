import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config';

function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/candidates/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch candidate details');
        }
        const data = await response.json();
        setCandidate(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching candidate details:', err);
        setError('Failed to fetch candidate details.');
        setLoading(false);
      }
    };

    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/feedback/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await response.json();
        setFeedbackList(data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      }
    };

    fetchCandidate();
    fetchFeedback();
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError('');

    if (!feedback.trim()) {
      setFeedbackError('Please enter feedback');
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/api/feedback/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: feedback, rating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to submit feedback');
      }

      const newFeedback = await response.json();
      setFeedbackList([newFeedback, ...feedbackList]);
      setFeedback('');
      setRating(5);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setFeedbackError(err.message || 'Failed to submit feedback');
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const response = await fetch(`${config.API_URL}/api/feedback/${feedbackId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      setFeedbackList(feedbackList.filter(f => f._id !== feedbackId));
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setFeedbackError('Failed to delete feedback');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container alert alert-error">{error}</div>;
  }

  if (!candidate) {
    return <div className="container">Candidate not found.</div>;
  }

  return (
    <div className="details-container">
      <button
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back to List
      </button>

      <div className="row">
        <div className="col-6">
          <div className="details-card">
            <div className="details-header">
              <h1>{candidate.name}</h1>
            </div>

            <div className="details-section">
              <h2>Contact Information</h2>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>Email Address</strong>
                  <p>{candidate.email}</p>
                </div>
                <div className="contact-item">
                  <strong>Phone Number</strong>
                  <p>{candidate.phone}</p>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h2>Resume</h2>
              <div className="resume-section">
                {candidate?.resume && (
                  <button
                    className="btn btn-outline"
                    onClick={() => window.open(`${config.API_URL}/${candidate.resume}`, '_blank')}
                  >
                    View Resume
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="feedback-card">
            <h2>Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="feedback-form">
              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="form-control"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Star' : 'Stars'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="feedback">Comment</label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="form-control"
                  rows="4"
                  placeholder="Enter your feedback..."
                />
              </div>
              {feedbackError && (
                <div className="alert alert-error">{feedbackError}</div>
              )}
              <button type="submit" className="btn btn-primary">
                Submit Feedback
              </button>
            </form>

            <div className="feedback-list">
              <h3>Previous Feedback</h3>
              {feedbackList.length === 0 ? (
                <p>No feedback yet</p>
              ) : (
                feedbackList.map((item) => (
                  <div key={item._id} className="feedback-item">
                    <div className="feedback-header">
                      <div className="rating">
                        {'★'.repeat(item.rating)}
                        {'☆'.repeat(5 - item.rating)}
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteFeedback(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                    <p className="feedback-comment">{item.comment}</p>
                    <small className="feedback-date">
                      {new Date(item.date).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetails; 