import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Award, ThumbsUp, AlertTriangle, Zap, Target } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import ReactMarkdown from 'react-markdown';
import './ResultsPage.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ResultsPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const analyzeResume = async () => {
      try {
        const res = await axios.post(`${API_URL}/analysis/analyze/${resumeId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // The AI result comes back as a markdown/string from Gemini
        setResult(res.data.analysis);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error analyzing resume. Please try again.');
        setLoading(false);
      }
    };

    if (resumeId && token) {
      analyzeResume();
    }
  }, [resumeId, token]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="hexagon-loader"></div>
        <h2 className="animate-pulse">Deepmind AI is analyzing your resume...</h2>
        <p className="text-secondary">Please wait, this usually takes 10-15 seconds.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertTriangle size={64} className="text-danger mb-4" />
        <h2>Analysis Failed</h2>
        <p>{error}</p>
        <button className="btn btn-outline mt-4" onClick={() => navigate('/dashboard')}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="results-container animate-slide-up">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        <ChevronLeft size={20} /> Dashboard
      </button>

      <div className="results-header">
        <h1 className="results-title">Analysis <span className="gradient-text">Complete</span></h1>
        <p className="results-subtitle">Review your personalized ATS intelligence report below.</p>
      </div>

      <div className="results-summary-section">
        <GlassCard className="score-card shadow-glow">
          <Award size={40} className="score-icon gradient-text" />
          <div className="score-text-content">
            <h3 className="score-label">Executive Validation</h3>
            <p className="text-muted">The report below provides a comprehensive breakdown of your resume against current industry hiring standards.</p>
          </div>
        </GlassCard>
      </div>

      <div className="results-grid single-column">
        <GlassCard className="analysis-feed">
          <div className="feed-header">
            <Zap className="feed-icon" />
            <h2>Intelligence Report</h2>
          </div>
          <div className="markdown-content">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ResultsPage;
