import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [hasOpenedResume, setHasOpenedResume] = useState(false); // prevent resume from reopening on re-renders

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/api/candidates/${id}`);
        setCandidate(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching candidate details:', err);
        setError('Failed to fetch candidate details.');
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  // Automatically open resume when loaded
  useEffect(() => {
    if (candidate?.resume && !hasOpenedResume) {
      window.open(candidate.resume, '_blank');
      setHasOpenedResume(true);
    }
  }, [candidate, hasOpenedResume]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      const newFeedback = {
        id: feedbackList.length + 1,
        comment: feedback,
      };
      setFeedbackList([...feedbackList, newFeedback]);
      setFeedback('');
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
      <button className="back-button" onClick={() => navigate('/')}>
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
                  <p>Resume opened in new tab.</p> // Optional note
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="feedback-card">
            <h2>Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="feedback-form">
              <textarea
                placeholder="Add your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Submit Feedback
              </button>
            </form>

            <div className="divider" />

            <div className="feedback-list">
              {feedbackList.map((item) => (
                <div key={item.id} className="feedback-item">
                  <p className="feedback-comment">{item.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetails;
