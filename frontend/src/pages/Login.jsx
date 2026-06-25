import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, Music, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${backendUrl}/auth/login`, { email, password });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Trigger storage event so that navbar can update immediately
        window.dispatchEvent(new Event('storage'));
        
        // Redirect to explore page
        navigate('/');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Could not log in. Check your credentials and verify the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 pb-32">
      <div className="glassmorphic rounded-2xl p-8 border border-brand-border text-center shadow-glow-green/5">
        
        {/* Branding header */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green/10 text-brand-green mb-4">
          <Music className="w-6 h-6 shadow-glow-green" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back to JPSoundz</h2>
        <p className="text-brand-textMuted text-xs mb-8">Access your artist dashboard and join the jam</p>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3.5 mb-6 flex items-start space-x-2 text-left">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* LoginForm */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-textMuted" />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11"
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-textMuted" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-brand-green hover:bg-brand-green-light text-black font-semibold shadow-glow-green hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all duration-300"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 stroke-[2.5]" />
                <span>Log In</span>
              </>
            )}
          </button>

        </form>

        <p className="mt-8 text-sm text-brand-textMuted">
          New to JPSoundz?{' '}
          <Link to="/signup" className="text-brand-green hover:underline font-semibold transition-colors duration-200">
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
