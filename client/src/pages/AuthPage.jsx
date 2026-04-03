import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, BrainCircuit } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, register, loading, error, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      await register(formData.name, formData.email, formData.password);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-hero animate-slide-up">
          <div className="logo-container">
            <BrainCircuit size={48} className="logo-icon" />
          </div>
          <h1 className="auth-title">
            Unlock the power of <br/>
            <span className="gradient-text">AI Resume Analysis</span>
          </h1>
          <p className="auth-subtitle">
            Get instant ATS scoring, discover your true strengths, and let our Deepmind AI perfect your career profile.
          </p>
        </div>

        <GlassCard className="auth-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="card-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="card-subtitle">
            {isLogin ? 'Login to continue to your dashboard.' : 'Sign up to start analyzing your resumes.'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <Input
                name="name"
                type="text"
                placeholder="Full Name"
                icon={User}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            )}
            
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              icon={Mail}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <Input
              name="password"
              type="password"
              placeholder="Password"
              icon={Lock}
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            {error && <div className="form-error">{error}</div>}

            <Button type="submit" className="auth-submit-btn" isLoading={loading}>
              {isLogin ? 'Sign In' : 'Sign Up'}
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" className="toggle-btn gradient-text" onClick={toggleAuthMode}>
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AuthPage;
