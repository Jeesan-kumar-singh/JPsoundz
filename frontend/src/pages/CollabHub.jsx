import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, PlusCircle, Search, User, Briefcase, Calendar, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

const CollabHub = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering and searching
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRoleNeeded, setNewRoleNeeded] = useState('Producer');
  const [newDescription, setNewDescription] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Read auth details
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const loggedInUser = userString ? JSON.parse(userString) : null;
  const isLoggedIn = !!token && !!loggedInUser;

  const roleCategories = ['All', 'Producer', 'Singer', 'Vocalist', 'Songwriter', 'Rapper', 'Guitarist', 'Other'];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${backendUrl}/collabs`);
      
      if (res.data.success) {
        setPosts(res.data.posts);
      } else {
        setError('Failed to fetch collaboration listings');
      }
    } catch (err) {
      console.error('Error fetching collabs:', err);
      setError('Could not connect to JPSoundz servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle || !newRoleNeeded || !newDescription) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      setFormError('');
      setFormLoading(true);
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(
        `${backendUrl}/collabs`,
        { title: newTitle, roleNeeded: newRoleNeeded, description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Prepend new post
        setPosts([res.data.post, ...posts]);
        
        // Reset and close modal
        setNewTitle('');
        setNewDescription('');
        setNewRoleNeeded('Producer');
        setShowModal(false);
      } else {
        setFormError(res.data.message || 'Failed to submit collab post');
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Error sending post to server.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (postId) => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.put(
        `${backendUrl}/collabs/${postId}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Update the status of the item in place
        setPosts(posts.map((p) => (p._id === postId ? res.data.post : p)));
      }
    } catch (err) {
      console.error('Failed to change post status:', err);
    }
  };

  // Filter posts list
  const filteredPosts = posts.filter((post) => {
    const matchesRole = selectedRole === 'All' || post.roleNeeded.toLowerCase() === selectedRole.toLowerCase();
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      
      {/* Header section with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-brand-border pb-6 mb-8 gap-4">
        <div className="text-left">
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green border border-brand-green/20 mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Co-Creation Lab</span>
          </span>
          <h1 className="text-3xl font-extrabold text-white">Collaboration Hub</h1>
          <p className="text-brand-textMuted text-sm mt-1">Connect with other independent artists, vocalists, and producers.</p>
        </div>

        {isLoggedIn ? (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-full bg-brand-green hover:bg-brand-green-light text-black font-semibold shadow-glow-green hover:scale-105 transition-all duration-300 self-start sm:self-center"
          >
            <Plus className="w-5 h-5 text-black stroke-[2.5]" />
            <span>Post a Gig / Need</span>
          </button>
        ) : (
          <div className="text-xs text-brand-textMuted border border-brand-border bg-brand-surfaceCard p-3 rounded-lg max-w-xs self-start">
            <p>
              Want to post a collab?{' '}
              <a href="/login" className="text-brand-green font-semibold hover:underline">Log in</a> first.
            </p>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        {/* Role filters */}
        <div className="flex flex-wrap gap-2">
          {roleCategories.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
                selectedRole === role
                  ? 'bg-brand-green/10 text-brand-green border-brand-green/45 shadow-glow-green/10'
                  : 'bg-brand-surfaceCard border-brand-border text-brand-textMuted hover:text-white hover:border-brand-border/60'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-brand-textMuted" />
          <input
            type="text"
            placeholder="Search posts or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      {/* Main Content Listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-brand-border border-t-brand-green animate-spin mb-4" />
          <p className="text-brand-textMuted font-medium">Loading collaboration listings...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center text-red-400 max-w-md mx-auto">
          <p className="font-semibold">{error}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-brand-surfaceCard rounded-2xl border border-brand-border p-8 max-w-xl mx-auto">
          <Users className="w-12 h-12 text-brand-green/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No listings found</h3>
          <p className="text-brand-textMuted text-sm">
            We couldn't find any listings matching "{selectedRole}" and search term "{searchQuery}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => {
            const isAuthor = isLoggedIn && post.author?._id === loggedInUser._id;
            return (
              <div 
                key={post._id} 
                className={`bg-brand-surfaceCard border rounded-2xl p-6 text-left flex flex-col justify-between hover:border-brand-border/60 transition-all duration-300 ${
                  post.status === 'closed' ? 'opacity-60 border-brand-border/20' : 'border-brand-border'
                }`}
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green border border-brand-green/20 uppercase tracking-wide">
                      <Briefcase className="w-3 h-3" />
                      <span>{post.roleNeeded}</span>
                    </span>

                    <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded ${
                      post.status === 'open' ? 'text-brand-green bg-brand-green/5' : 'text-red-400 bg-red-400/5'
                    }`}>
                      {post.status === 'open' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-brand-green mr-0.5" />
                          <span>Open</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-red-400 mr-0.5" />
                          <span>Closed</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-white mb-2 hover:text-brand-green transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-brand-textMuted text-sm leading-relaxed mb-6 whitespace-pre-line">
                    {post.description}
                  </p>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-auto">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={post.author?.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'}
                      alt={post.author?.username}
                      className="w-9 h-9 rounded-full border border-brand-border"
                    />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">@{post.author?.username || 'Unknown'}</div>
                      <div className="text-[10px] text-brand-textMuted uppercase font-medium">{post.author?.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-brand-textMuted">
                    <Calendar className="w-3.5 h-3.5 text-brand-green" />
                    <span>{new Date(post.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                  </div>
                </div>

                {/* Toggle status control (Author only) */}
                {isAuthor && (
                  <button
                    onClick={() => handleToggleStatus(post._id)}
                    className="w-full mt-4 py-2 border border-brand-green/30 hover:bg-brand-green/10 text-brand-green text-xs font-semibold rounded-lg transition-all duration-300"
                  >
                    Change Status to {post.status === 'open' ? 'Closed' : 'Open'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE POST MODAL DIALOG */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop blur layer */}
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowModal(false)}
          />

          {/* Modal box */}
          <div className="relative bg-brand-surfaceCard border border-brand-border w-full max-w-lg rounded-2xl p-6 md:p-8 text-left shadow-glow-green/10">
            <h2 className="text-xl font-bold text-white mb-2">Create Collaboration Listing</h2>
            <p className="text-brand-textMuted text-xs mb-6">Describe what kind of artist or expertise you're looking for.</p>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Listing Title</label>
                <input
                  type="text"
                  placeholder="Need a Singer for my upcoming Lofi track"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Role Needed</label>
                <select
                  value={newRoleNeeded}
                  onChange={(e) => setNewRoleNeeded(e.target.value)}
                  className="bg-brand-surfaceCard border border-brand-border text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-green"
                >
                  <option value="Producer">Producer</option>
                  <option value="Singer">Singer</option>
                  <option value="Vocalist">Vocalist</option>
                  <option value="Songwriter">Songwriter</option>
                  <option value="Rapper">Rapper</option>
                  <option value="Guitarist">Guitarist</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Details & Requirements</label>
                <textarea
                  placeholder="Include details about the tempo, style, and what specific vocal ranges/skills you need. Be specific!"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full h-32 resize-none py-2.5"
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-brand-surfaceHover text-brand-textMuted hover:text-white border border-brand-border rounded-lg text-sm font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-brand-green hover:bg-brand-green-light text-black font-semibold rounded-lg text-sm shadow-glow-green disabled:opacity-50 transition-all duration-300"
                >
                  {formLoading ? 'Submitting...' : 'Post Listing'}
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

    </div>
  );
};

export default CollabHub;
