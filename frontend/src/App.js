import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CandidateList from './components/CandidateList';
import CandidateForm from './components/CandidateForm';
import CandidateDetails from './components/CandidateDetails';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<CandidateList />} />
          <Route path="/add-candidate" element={<CandidateForm />} />
          <Route path="/candidate/:id" element={<CandidateDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 