import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, LogOut, User, LayoutDashboard, History } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <Target size={24} className="text-blue-500" />
            </div>
            <span className="font-outfit font-bold text-xl tracking-tight text-white">
              Elevate<span className="text-blue-500">CV</span>
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-6 mr-4">
                  <Link to="/dashboard" className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    <LayoutDashboard size={16} />
                    <span>Scan</span>
                  </Link>
                  <Link to="/history" className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    <History size={16} />
                    <span>History</span>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-300">
                    <div className="bg-slate-800 p-1.5 rounded-full border border-slate-700">
                      <User size={14} className="text-slate-400" />
                    </div>
                    <span>{user.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="!px-3 !py-1.5">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Log In
                </Link>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
