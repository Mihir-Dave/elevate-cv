import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, BrainCircuit } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Hero Section */}
        <div className="hidden md:flex flex-col space-y-6 animate-slide-up">
          <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 w-fit">
            <BrainCircuit size={48} className="text-blue-500" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-outfit font-bold tracking-tight text-white leading-tight">
            Unlock the power of <br/>
            <span className="text-gradient">AI Resume Analysis</span>
          </h1>
          <p className="text-lg text-slate-400">
            Get instant ATS scoring, discover your true strengths, and let our Deepmind AI perfect your career profile.
          </p>
        </div>

        {/* Right Auth Card Section */}
        <Card className="w-full max-w-md mx-auto !p-8 animate-slide-up bg-slate-800/80">
          <div className="flex flex-col space-y-2 mb-8">
            <h2 className="text-2xl font-outfit font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Login to continue to your dashboard.' : 'Sign up to start analyzing your resumes.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2 group" size="lg" isLoading={loading}>
              {isLogin ? 'Sign In' : 'Sign Up'}
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400 border-t border-slate-700/50 pt-6">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors" onClick={toggleAuthMode}>
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default AuthPage;
