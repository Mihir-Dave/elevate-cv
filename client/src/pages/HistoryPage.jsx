import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Section from "../components/ui/Section";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { TrendingUp, TrendingDown, Target, Activity, Clock } from "lucide-react";

const HistoryPage = () => {
  const { token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setError("Please login to view your history");
        setLoading(false);
        return;
      }

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
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-xl font-outfit text-slate-300">Loading History...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  const scores = history.map((h) => h.score);
  const firstScore = scores[0] || 0;
  const latestScore = scores[scores.length - 1] || 0;
  const improvement = latestScore - firstScore;
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const worstScore = scores.length > 0 ? Math.min(...scores) : 0;
  const isPositive = improvement >= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <Section className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-white mb-4">
          Resume <span className="text-gradient">History</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Track your improvement over time as you iteratively refine and optimize your career profile.
        </p>
      </Section>

      {history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col space-y-2">
            <div className="flex items-center text-slate-400 uppercase tracking-widest text-xs font-semibold mb-2">
              <Activity size={16} className="mr-2" />
              Overall Improvement
            </div>
            <div className={`text-4xl font-bold font-outfit flex items-center ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {improvement > 0 ? `+${improvement}` : improvement}
              {isPositive ? <TrendingUp className="ml-3" size={32} /> : <TrendingDown className="ml-3" size={32} />}
            </div>
          </Card>

          <Card className="flex flex-col space-y-2">
            <div className="flex items-center text-slate-400 uppercase tracking-widest text-xs font-semibold mb-2">
              <Target size={16} className="mr-2" />
              Peak Score
            </div>
            <div className="text-4xl font-bold font-outfit text-amber-400 flex items-center">
              {bestScore}
            </div>
          </Card>

          <Card className="flex flex-col space-y-2">
            <div className="flex items-center text-slate-400 uppercase tracking-widest text-xs font-semibold mb-2">
              <Activity size={16} className="mr-2" />
              Lowest Score
            </div>
            <div className="text-4xl font-bold font-outfit text-white">
              {worstScore}
            </div>
          </Card>
        </div>
      )}

      <Section title="Analysis Timeline" className="pt-8">
        {history.length === 0 ? (
          <Card className="text-center py-16 bg-slate-800/30">
            <Clock size={48} className="mx-auto text-slate-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No history recorded yet</h3>
            <p className="text-slate-400">Upload your first resume on the dashboard to get started.</p>
          </Card>
        ) : (
          <div className="relative border-l-2 border-slate-700/50 ml-4 md:ml-6 space-y-8 pl-8 md:pl-10">
            {history.map((item, index) => (
              <div key={item._id} className="relative group">
                <div className="absolute -left-[45px] md:-left-[53px] top-1 w-10 h-10 rounded-full bg-slate-900 border-2 border-blue-500 shadow-glow flex items-center justify-center font-bold text-xs text-blue-400 z-10 transition-transform group-hover:scale-110">
                  v{item.version}
                </div>
                
                <Card hover className="bg-slate-800/40">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                    <span className="text-slate-400 text-sm font-medium flex items-center">
                      <Clock size={14} className="mr-2" />
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                    <Badge variant={item.score >= 80 ? 'success' : item.score >= 50 ? 'warning' : 'danger'}>
                      Score: {item.score}
                    </Badge>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                    {item.feedback}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default HistoryPage;
