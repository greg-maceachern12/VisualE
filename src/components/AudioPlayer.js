import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

const AudioPlayer = ({ audioURL }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleProgressClick = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Instead of checking for both isLoading and audioURL,
  // we simply show a placeholder while audioURL is not available.
  if (!audioURL) {
    return (
      <div className="w-full max-w-md mx-auto mt-4 pb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded-full w-8" />
            <div className="h-1 bg-gray-100 rounded-full" />
          </div>
          <p className="text-center text-gray-500 mt-2">Audio is generating...</p>
        </div>
      </div>
    );
  }

  const progress = (currentTime / duration) * 100 || 0;

  return (
    <div className="w-full max-w-md mx-auto mt-4 pb-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-black/5">
        <div className="space-y-4">
          {/* Custom Audio Controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={togglePlay}
              className="w-8 h-8 flex items-center justify-center bg-black rounded-full text-white hover:bg-gray-800 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
            
            <div 
              className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-black rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Time indicators */}
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Hidden native audio element for functionality */}
          <audio
            ref={audioRef}
            src={audioURL}
            className="hidden"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
