import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Award, ThumbsUp, AlertTriangle, Zap, Target } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import Badge from '../components/ui/Badge';
import ScoreHighlight from '../components/ui/ScoreHighlight';
import Button from '../components/ui/Button';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ResultsPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!resumeId || !token) return;

    const analyzeResume = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/analysis/analyze/${resumeId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResult(res.data.analysis);
      } catch (err) {
        setError(err.response?.data?.message || 'Error analyzing resume. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    analyzeResume();
  }, [resumeId, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 space-y-6">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-outfit font-bold text-white animate-pulse">AI is analyzing your resume...</h2>
          <p className="text-slate-400 text-lg">Please wait, this securely reviews your layout and impact.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 space-y-6">
        <div className="bg-red-500/10 p-6 rounded-full border border-red-500/20">
          <AlertTriangle size={64} className="text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-outfit font-bold text-white">Analysis Failed</h2>
          <p className="text-slate-400 text-lg max-w-md">{error}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Navigation & Header */}
      <div className="space-y-6">
        <button 
          className="group flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full border border-white/5"
          onClick={() => navigate('/dashboard')}
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight text-white">
            Analysis <span className="text-gradient">Complete</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Review your personalized ATS intelligence report. We've highlighted areas of high impact and opportunities for growth.
          </p>
        </div>
      </div>

      {/* Top Section: Score & Summary */}
      <Section>
        <Card className="!p-8 md:!p-12 relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-shrink-0">
              <ScoreHighlight score={result.score || 0} />
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Award size={24} className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-outfit font-bold text-white">Intelligence Analysis</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">
                {result.feedbackSummary}
              </p>
            </div>
          </div>
        </Card>
      </Section>

      {/* Grid Sections: Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section title="Strategic Strengths" className="h-full">
          <Card hover className="h-full border-t-4 border-t-emerald-500/50 flex flex-col pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-500/10 p-2 rounded-lg">
                <ThumbsUp size={20} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">What You Did Well</h3>
            </div>
            <ul className="space-y-4 flex-1">
              {result.strengths?.map((item, i) => (
                <li key={i} className="flex items-start space-x-3 text-slate-300">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Section>

        <Section title="Gap Analysis" className="h-full">
          <Card hover className="h-full border-t-4 border-t-amber-500/50 flex flex-col pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <AlertTriangle size={20} className="text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Areas for Improvement</h3>
            </div>
            <ul className="space-y-4 flex-1">
              {result.weaknesses?.map((item, i) => (
                <li key={i} className="flex items-start space-x-3 text-slate-300">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Section>
      </div>

      {/* Grid Sections: Roadmap & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section title="Critical Roadmap" className="h-full">
          <Card hover className="h-full border-t-4 border-t-blue-500/50 flex flex-col pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Zap size={20} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Actionable Steps</h3>
            </div>
            <ul className="space-y-4 flex-1">
              {result.improvements?.map((item, i) => (
                <li key={i} className="flex items-start space-x-3 text-slate-300">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Section>

        <Section title="Validated Skills" className="h-full">
          <Card hover className="h-full border-t-4 border-t-purple-500/50 flex flex-col pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Target size={20} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Core Competencies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.skills?.map((skill, i) => (
                <Badge key={i} variant="default" className="text-sm px-4 py-1.5 hover:bg-slate-700 hover:border-slate-500 transition-colors cursor-default">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </Section>
      </div>
    </div>
  );
};

export default ResultsPage;