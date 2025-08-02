import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CaptureList from './components/CaptureList';
import SummaryModal from './components/SummaryModal';
import Header from './components/Header';

function App() {
  const [captures, setCaptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Fetch captures on component mount
  useEffect(() => {
    fetchCaptures();
  }, []);

  const fetchCaptures = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/captures');
      setCaptures(response.data.captures || []);
    } catch (err) {
      console.error('Error fetching captures:', err);
      setError('Failed to load captures. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (captureId) => {
    try {
      setSummaryLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/summarize/${captureId}`);
      
      if (response.data.success) {
        setSelectedSummary(response.data.data);
        setShowSummaryModal(true);
      } else {
        setError('Failed to generate summary');
      }
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err.response?.data?.message || 'Failed to generate summary. Please check if the Gemini API key is configured.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDeleteCapture = async (captureId) => {
    if (!window.confirm('Are you sure you want to delete this capture?')) {
      return;
    }

    try {
      await axios.delete(`/api/capture/${captureId}`);
      setCaptures(captures.filter(capture => capture.id !== captureId));
    } catch (err) {
      console.error('Error deleting capture:', err);
      setError('Failed to delete capture');
    }
  };

  const closeSummaryModal = () => {
    setShowSummaryModal(false);
    setSelectedSummary(null);
  };

  return (
    <div className="App">
      <Header onRefresh={fetchCaptures} />
      
      <div className="container">
        {error && (
          <div className="error">
            {error}
            <button 
              className="btn btn-secondary" 
              onClick={() => setError(null)}
              style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '12px' }}
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div>Loading captures...</div>
          </div>
        ) : (
          <CaptureList
            captures={captures}
            onSummarize={handleSummarize}
            onDelete={handleDeleteCapture}
            summaryLoading={summaryLoading}
          />
        )}

        {showSummaryModal && selectedSummary && (
          <SummaryModal
            summary={selectedSummary}
            onClose={closeSummaryModal}
          />
        )}
      </div>
    </div>
  );
}

export default App; 