import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import config from '../config';

function CandidateList() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/candidates`);
        if (!response.ok) {
          throw new Error('Failed to fetch candidates');
        }
        const data = await response.json();
        console.log('Fetched candidates:', data);
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h1>Candidates</h1>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/add-candidate')}
              >
                Add New Candidate
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate._id}>
                      <td>{candidate.name}</td>
                      <td>{candidate.email}</td>
                      <td>
                        <button
                          className="btn btn-outline"
                          onClick={() => navigate(`/candidate/${candidate._id}`)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateList; 