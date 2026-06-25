import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Music, Users, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Read auth info from localStorage
  const userString = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = userString ? JSON.parse(userString) : null;
  const isLoggedIn = !!token && !!user;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Trigger storage event for any other components listening
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glassmorphic-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-lg bg-brand-green flex items-center justify-center shadow-glow-green group-hover:scale-105 transition-transform duration-300">
              <Music className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-brand-green bg-clip-text text-transparent">
              JPSoundz
            </span>
            <span className="text-[10px] bg-brand-green/10 text-brand-green border border-brand-green/20 px-1.5 py-0.5 rounded font-medium hidden sm:inline-block">
              MVP
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'text-brand-green bg-brand-green/10' 
                  : 'text-brand-textMuted hover:text-white hover:bg-brand-surfaceHover'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            <Link
              to="/collabs"
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/collabs') 
                  ? 'text-brand-green bg-brand-green/10' 
                  : 'text-brand-textMuted hover:text-white hover:bg-brand-surfaceHover'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Collab Hub</span>
            </Link>

            {isLoggedIn && user.role === 'artist' && (
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive('/dashboard') 
                    ? 'text-brand-green bg-brand-green/10' 
                    : 'text-brand-textMuted hover:text-white hover:bg-brand-surfaceHover'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Auth Controls */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'}
                    alt={user.username}
                    className="w-8 h-8 rounded-full border border-brand-green/30"
                  />
                  <div className="hidden lg:block text-left">
                    <div className="text-xs text-brand-green font-semibold capitalize tracking-wide">{user.role}</div>
                    <div className="text-sm font-medium text-white truncate max-w-[120px]">{user.username}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-brand-surfaceHover hover:bg-red-500/10 text-brand-textMuted hover:text-red-400 border border-brand-border hover:border-red-500/20 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 hover:text-white text-brand-textMuted px-4 py-2 text-sm font-medium transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-1 bg-brand-green hover:bg-brand-green-light text-black px-4 py-2 rounded-full text-sm font-semibold shadow-glow-green hover:scale-105 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation (Shown below on mobile screens) */}
        <div className="flex md:hidden border-t border-brand-border py-2 justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center space-y-0.5 text-xs font-medium transition-all duration-300 ${
              isActive('/') ? 'text-brand-green' : 'text-brand-textMuted hover:text-white'
            }`}
          >
            <Music className="w-5 h-5" />
            <span>Explore</span>
          </Link>

          <Link
            to="/collabs"
            className={`flex flex-col items-center space-y-0.5 text-xs font-medium transition-all duration-300 ${
              isActive('/collabs') ? 'text-brand-green' : 'text-brand-textMuted hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Collab Hub</span>
          </Link>

          {isLoggedIn && user.role === 'artist' && (
            <Link
              to="/dashboard"
              className={`flex flex-col items-center space-y-0.5 text-xs font-medium transition-all duration-300 ${
                isActive('/dashboard') ? 'text-brand-green' : 'text-brand-textMuted hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
