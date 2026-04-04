import React, { useEffect, useState, useContext, useRef } from 'react';
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
  const hasFetched = useRef(false);

  useEffect(() => {
    const analyzeResume = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      
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
          <div className="score-display">
            <div 
              className="score-circle" 
              style={{ '--score-percent': `${result.score || 0}%` }}
            >
              <div className="score-value-container">
                <span className="score-value">{result.score || 0}</span>
                <span className="score-label">ATS Rank</span>
              </div>
            </div>
            <div className="score-info">
              <Award size={32} className="text-primary mb-2" />
              <h3>Intelligence Analysis</h3>
              <p>{result.feedbackSummary}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="results-grid">
        <div className="results-column">
          <GlassCard className="analysis-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <ThumbsUp size={22} className="text-success" />
              <h2>Strategic Strengths</h2>
            </div>
            <ul className="analysis-list">
              {result.strengths?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="analysis-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-header">
              <AlertTriangle size={22} className="text-warning" />
              <h2>Gap Analysis</h2>
            </div>
            <ul className="analysis-list">
              {result.weaknesses?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </GlassCard>
        </div>

        <div className="results-column">
          <GlassCard className="analysis-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="card-header">
              <Zap size={22} className="text-primary" />
              <h2>Critical Roadmap</h2>
            </div>
            <ul className="analysis-list">
              {result.improvements?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="analysis-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="card-header">
              <Target size={22} className="text-info" />
              <h2>Validated Skills</h2>
            </div>
            <div className="skills-tags">
              {result.skills?.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};



export default ResultsPage;
