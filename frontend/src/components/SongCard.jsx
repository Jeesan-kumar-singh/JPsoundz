import React from 'react';
import { Play, Pause, Headphones, ShoppingCart } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useCart } from '../context/CartContext';

const SongCard = ({ song, playlistQueue = [] }) => {
  const { currentSong, isPlaying, playSong } = useAudio();
  const { addToCart, removeFromCart, isInCart } = useCart();
  
  const isCurrentSong = currentSong && currentSong._id === song._id;
  const isThisPlaying = isCurrentSong && isPlaying;

  const handlePlayClick = () => {
    playSong(song, playlistQueue);
  };

  return (
    <div 
      className="group relative bg-brand-surfaceCard rounded-xl p-4 border border-brand-border hover:border-brand-green/30 transition-all duration-300 hover:shadow-glow-green hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
      onClick={handlePlayClick}
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4 bg-brand-surface border border-brand-border">
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23181818"/><circle cx="150" cy="150" r="70" fill="%231DB954" opacity="0.15"/><path d="M125 110v80l60-40z" fill="%231DB954"/></svg>';
            }}
          />

          {/* Hover / Active Overlay */}
          <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
            isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            {isThisPlaying ? (
              <div className="flex items-end justify-center space-x-1.5 h-12 w-12 bg-brand-green text-black rounded-full p-3 shadow-glow-green-lg">
                {/* Animated wave */}
                <div className="music-wave-bar h-2"></div>
                <div className="music-wave-bar h-4"></div>
                <div className="music-wave-bar h-3"></div>
                <div className="music-wave-bar h-1"></div>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayClick();
                }}
                className="p-4 bg-brand-green hover:bg-brand-green-light text-black rounded-full shadow-glow-green-lg hover:scale-110 transition-transform duration-200"
              >
                <Play className="w-6 h-6 fill-black text-black ml-0.5" />
              </button>
            )}
          </div>

          {/* Genre Tag */}
          <span className="absolute top-2 right-2 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/70 border border-white/10 text-brand-green backdrop-blur-sm">
            {song.genre}
          </span>
        </div>

        {/* Song Details */}
        <div className="text-left">
          <h3 className="font-semibold text-white truncate text-base hover:text-brand-green transition-colors duration-200">
            {song.title}
          </h3>
          
          <p className="text-xs text-brand-textMuted mt-1 font-medium truncate">
            By @{song.artist?.username || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Play count and Buy/Price Section */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-border text-xs text-brand-textMuted">
        <div className="flex items-center space-x-1">
          <Headphones className="w-3.5 h-3.5 text-brand-green" />
          <span>{song.plays.toLocaleString()} plays</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-brand-green">${song.price ? song.price.toFixed(2) : '9.99'}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isInCart(song._id)) {
                removeFromCart(song._id);
              } else {
                addToCart(song);
              }
            }}
            className={`p-1.5 rounded-lg border transition-all duration-300 ${
              isInCart(song._id)
                ? 'bg-brand-green text-black border-brand-green'
                : 'bg-brand-surfaceHover text-brand-textMuted border-brand-border hover:text-white hover:border-brand-green/40'
            }`}
            title={isInCart(song._id) ? 'Remove from Cart' : 'Licence beat / Buy song'}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
