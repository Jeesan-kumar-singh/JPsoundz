import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Radio, Music, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('listener'); // listener | artist
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${backendUrl}/auth/signup`, {
        username,
        email,
        password,
        role,
        bio,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Trigger storage event so that navbar can update immediately
        window.dispatchEvent(new Event('storage'));
        
        // Redirect to explore page
        navigate('/');
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Could not register. Check your parameters and verify the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 pb-32">
      <div className="glassmorphic rounded-2xl p-8 border border-brand-border text-center shadow-glow-green/5">
        
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green/10 text-brand-green mb-4">
          <Music className="w-6 h-6 shadow-glow-green" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Join the JPSoundz Community</h2>
        <p className="text-brand-textMuted text-xs mb-8">Create your profile, share tracks, and begin collaborating</p>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3.5 mb-6 flex items-start space-x-2 text-left">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SignUp Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-textMuted" />
              <input
                type="text"
                placeholder="kai_beats"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11"
                required
              />
            </div>
          </div>

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
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11"
                minLength={6}
                required
              />
            </div>
          </div>

          {/* Account Role Selection */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">I want to join as a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('listener')}
                className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all duration-300 ${
                  role === 'listener'
                    ? 'bg-brand-green/10 text-brand-green border-brand-green/45 shadow-glow-green/10'
                    : 'bg-brand-surfaceCard border-brand-border text-brand-textMuted hover:text-white hover:border-brand-border/60'
                }`}
              >
                Listener
              </button>
              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all duration-300 ${
                  role === 'artist'
                    ? 'bg-brand-green/10 text-brand-green border-brand-green/45 shadow-glow-green/10'
                    : 'bg-brand-surfaceCard border-brand-border text-brand-textMuted hover:text-white hover:border-brand-border/60'
                }`}
              >
                Artist / Producer
              </button>
            </div>
          </div>

          {/* Bio input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Short Bio (Optional)</label>
            <textarea
              placeholder="Tell the community about your musical style..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-20 resize-none py-2.5"
            />
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
                <UserPlus className="w-5 h-5 stroke-[2.5]" />
                <span>Create Account</span>
              </>
            )}
          </button>

        </form>

        <p className="mt-6 text-sm text-brand-textMuted">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-green hover:underline font-semibold transition-colors duration-200">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
