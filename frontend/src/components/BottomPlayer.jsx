import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart, Maximize2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const BottomPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    changeVolume,
    toggleMute,
  } = useAudio();

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-brand-black/90 border-t border-brand-border backdrop-blur-xl flex items-center justify-center text-brand-textMuted text-sm font-medium z-40">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span>Select a track from the Explore page to start playing.</span>
        </div>
      </div>
    );
  }

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e) => {
    seek(parseFloat(e.target.value));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-brand-surface/90 border-t border-brand-border backdrop-blur-xl flex flex-col justify-center px-4 md:px-8 z-40 transition-all duration-300">
      
      {/* Top micro progress track for quick visual */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-surfaceHover overflow-hidden">
        <div 
          className="h-full bg-brand-green transition-all duration-100" 
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        
        {/* Left Side: Track Details */}
        <div className="flex items-center space-x-3 w-1/4 min-w-[180px]">
          <img
            src={currentSong.coverImage}
            alt={currentSong.title}
            className="w-12 h-12 rounded-lg object-cover border border-brand-border shadow-glow-green/10 flex-shrink-0"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23181818"/><circle cx="150" cy="150" r="70" fill="%231DB954" opacity="0.15"/><path d="M125 110v80l60-40z" fill="%231DB954"/></svg>';
            }}
          />
          <div className="text-left truncate">
            <h4 className="text-sm font-semibold text-white truncate hover:text-brand-green cursor-pointer">
              {currentSong.title}
            </h4>
            <p className="text-xs text-brand-textMuted truncate">
              @{currentSong.artist?.username || 'Artist'}
            </p>
          </div>
        </div>

        {/* Center Side: Playback Controls & Main Seek Bar */}
        <div className="flex flex-col items-center w-2/4 px-4">
          
          {/* Action buttons */}
          <div className="flex items-center space-x-5 mb-2.5">
            <button 
              onClick={prevSong} 
              className="text-brand-textMuted hover:text-white hover:scale-105 transition-all duration-200"
              title="Previous Song"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 bg-white text-black hover:bg-brand-green hover:scale-105 rounded-full transition-all duration-200 shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black text-black" />
              ) : (
                <Play className="w-5 h-5 fill-black text-black ml-0.5" />
              )}
            </button>

            <button 
              onClick={nextSong} 
              className="text-brand-textMuted hover:text-white hover:scale-105 transition-all duration-200"
              title="Next Song"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Full progress bar */}
          <div className="flex items-center space-x-3 w-full max-w-xl">
            <span className="text-[10px] font-mono text-brand-textMuted w-8 text-right select-none">
              {formatTime(currentTime)}
            </span>
            
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="flex-grow h-1.5 rounded-lg bg-brand-surfaceHover accent-brand-green hover:accent-brand-green-light cursor-pointer transition-all duration-300"
            />
            
            <span className="text-[10px] font-mono text-brand-textMuted w-8 text-left select-none">
              {formatTime(duration)}
            </span>
          </div>

        </div>

        {/* Right Side: Volume Controls */}
        <div className="flex items-center justify-end space-x-3 w-1/4">
          <button 
            onClick={toggleMute} 
            className="text-brand-textMuted hover:text-brand-green transition-colors duration-200"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(e.target.value)}
            className="w-20 md:w-28 h-1 rounded-lg bg-brand-surfaceHover accent-brand-green cursor-pointer"
            title="Volume"
          />
        </div>

      </div>
    </div>
  );
};

export default BottomPlayer;
