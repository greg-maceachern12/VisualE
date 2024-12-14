import React from 'react';

const Loading = ({ isLoading, loadingInfo }) => {
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Sleek loader animation */}
      <div className="relative w-12 h-12">
        {/* Orbital rings */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-500/30 animate-spin" 
             style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0.5 rounded-full border-t-2 border-l-2 border-blue-500/30 animate-spin" 
             style={{ animationDuration: '3s' }} />
        
        {/* Center dot with glow */}
        <div className="absolute inset-[35%] rounded-full bg-cyan-500 animate-pulse shadow-lg shadow-cyan-500/50" />
      </div>

      {/* Loading text with subtle animation */}
      <div className="relative">
        <p className="text-slate-300 text-sm font-medium">
          {loadingInfo || 'Loading...'}
        </p>
        <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default Loading;