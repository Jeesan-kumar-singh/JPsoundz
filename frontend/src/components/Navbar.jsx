import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Music, Users, LayoutDashboard, LogOut, LogIn, UserPlus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, removeFromCart, cartTotal, checkout, checkoutLoading } = useCart();
  
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

          {/* Auth Controls & Cart */}
          <div className="flex items-center space-x-4">
            {/* Cart Toggle Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-brand-surfaceHover hover:bg-brand-surfaceCard hover:border-brand-green/30 text-white rounded-full border border-brand-border transition-all duration-300"
              title="Open Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-green text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-glow-green">
                  {cart.length}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'}
                    alt={user.username}
                    className="w-8 h-8 rounded-full border border-brand-green/30 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="%23181818"/><circle cx="75" cy="55" r="25" fill="%23b3b3b3"/><path d="M25 120c0-25 20-40 50-40s50 15 50 40z" fill="%23b3b3b3"/></svg>';
                    }}
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

      {/* Slide-over Cart Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-brand-surfaceCard border-l border-brand-border flex flex-col shadow-2xl relative">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-brand-green" />
                  <h2 className="text-lg font-bold text-white">Your Cart</h2>
                  <span className="bg-brand-green/20 text-brand-green text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="text-brand-textMuted hover:text-white p-1 rounded-lg hover:bg-brand-surfaceHover transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart List */}
              <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 text-brand-textMuted">
                    <ShoppingCart className="w-12 h-12 stroke-[1.2] mb-4 text-brand-green/20" />
                    <p className="text-sm font-semibold text-white">Your cart is empty</p>
                    <p className="text-xs mt-1 max-w-[240px]">Add songs and beats from the explore dashboard to purchase licenses.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-brand-surface rounded-xl border border-brand-border hover:border-brand-border/60 transition-colors">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-brand-border"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23181818"/><circle cx="150" cy="150" r="70" fill="%231DB954" opacity="0.15"/><path d="M125 110v80l60-40z" fill="%231DB954"/></svg>';
                          }}
                        />
                        <div className="truncate text-left">
                          <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                          <p className="text-xs text-brand-textMuted truncate">@{item.artist?.username || 'Artist'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="text-sm font-bold text-brand-green">${item.price ? item.price.toFixed(2) : '9.99'}</span>
                        <button 
                          onClick={() => removeFromCart(item._id)} 
                          className="text-brand-textMuted hover:text-red-400 p-1.5 rounded-lg hover:bg-brand-surfaceHover transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Footer */}
              {cart.length > 0 && (
                <div className="px-6 py-6 border-t border-brand-border bg-brand-surface space-y-4">
                  <div className="flex justify-between text-base font-bold text-white">
                    <span>Total (USD)</span>
                    <span className="text-brand-green">${cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-brand-textMuted text-left">
                    Payments are running in Stripe Test Mode. Redirects to a secure Stripe Checkout portal.
                  </p>
                  <button
                    onClick={checkout}
                    disabled={checkoutLoading}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-brand-green hover:bg-brand-green-light text-black font-bold shadow-glow-green hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 transition-all duration-300"
                  >
                    {checkoutLoading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    ) : (
                      <span>Proceed to Checkout</span>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
