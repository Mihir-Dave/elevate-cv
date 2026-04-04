import React, { useState, useEffect } from "react";
import axios from "axios";
import GlassCard from "../components/ui/GlassCard";
import "./HistoryPage.css";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/analysis/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data.history || []);
      } catch (err) {
        setError("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="history-loading">Loading History...</div>;
  if (error) return <div className="history-error">{error}</div>;

  const scores = history.map((h) => h.score);
  const firstScore = scores[0] || 0;
  const latestScore = scores[scores.length - 1] || 0;
  const improvement = latestScore - firstScore;
  const bestScore = Math.max(...scores, 0);
  const worstScore = scores.length > 0 ? Math.min(...scores) : 0;
  const trend = improvement >= 0 ? "📈" : "📉";

  return (
    <div className="history-container">
      <header className="history-header">
        <h1>Resume Progress & History</h1>
        <p>Track your improvement over time as you refine your resume.</p>
      </header>

      <div className="stats-grid">
        <GlassCard className="stat-card">
          <h3>Overall Improvement</h3>
          <div className={`stat-value ${improvement >= 0 ? "positive" : "negative"}`}>
            {improvement > 0 ? `+${improvement}` : improvement} {trend}
          </div>
        </GlassCard>
        <GlassCard className="stat-card">
          <h3>Highest Score</h3>
          <div className="stat-value gold">{bestScore}</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <h3>Lowest Score</h3>
          <div className="stat-value">{worstScore}</div>
        </GlassCard>
      </div>

      <div className="timeline-section">
        <h2>Analysis Timeline</h2>
        {history.length === 0 ? (
          <div className="empty-state">
            <p>No analysis history found. Upload your resume to get started!</p>
          </div>
        ) : (
          <div className="timeline">
            {history.map((item, index) => (
              <div key={item._id} className="timeline-item">
                <div className="version-tag">v{item.version}</div>
                <GlassCard className="timeline-content">
                  <div className="timeline-header">
                    <span className="date">{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span className="score-badge">Score: {item.score}</span>
                  </div>
                  <p className="feedback-preview">{item.feedback}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
