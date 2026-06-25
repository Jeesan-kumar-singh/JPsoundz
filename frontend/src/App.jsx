import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Context & Styling
import { AudioProvider } from './context/AudioContext';
import './App.css';

// Components
import Navbar from './components/Navbar';
import BottomPlayer from './components/BottomPlayer';

// Pages
import Explore from './pages/Explore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CollabHub from './pages/CollabHub';
import ArtistDashboard from './pages/ArtistDashboard';

// Set up Axios configuration
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = backendUrl;

// Request Interceptor to attach Authorization Header automatically
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  // Sync state across tabs for logout/login
  useEffect(() => {
    const handleStorageChange = () => {
      // Force App re-render or state check if needed
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AudioProvider>
      <Router>
        <div className="min-h-screen bg-brand-black flex flex-col">
          {/* Main Navigation Header */}
          <Navbar />

          {/* Main App Page View Container */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/collabs" element={<CollabHub />} />
              <Route path="/dashboard" element={<ArtistDashboard />} />
            </Routes>
          </main>

          {/* Persistent Bottom Music Player */}
          <BottomPlayer />
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;
