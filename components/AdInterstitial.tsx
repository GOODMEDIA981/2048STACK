
import React, { useState, useEffect } from 'react';

interface AdInterstitialProps {
  onClose: () => void;
}

const AdInterstitial: React.FC<AdInterstitialProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanClose(true);
    }
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Ad Attribution */}
      <div className="absolute top-4 left-4 bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
        Ad
      </div>

      {/* Close Button */}
      <button 
        onClick={() => canClose && onClose()}
        disabled={!canClose}
        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          canClose ? 'bg-white text-black scale-100' : 'bg-white/40 text-white scale-90'
        }`}
      >
        {canClose ? <i className="fas fa-xmark text-xl"></i> : <span className="text-white font-bold">{timeLeft}</span>}
      </button>

      {/* Ad Content Simulation */}
      <div className="w-full max-w-sm aspect-[9/16] bg-gradient-to-br from-indigo-900 via-blue-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-pulse">
          <i className="fas fa-rocket text-4xl text-white"></i>
        </div>
        <h3 className="text-2xl font-black mb-2 italic text-white">SUPER STACKER PRO</h3>
        <p className="text-white text-sm mb-8">Level up your stacking skills with the pro version!</p>
        
        <div className="w-full bg-blue-600 py-4 rounded-xl font-black text-lg text-white shadow-xl mb-4">
          INSTALL NOW
        </div>
        
        <div className="flex gap-1 text-yellow-400 text-xs">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
        </div>
      </div>

      <p className="mt-8 text-white text-xs uppercase tracking-[0.2em]">
        {canClose ? 'You can now close the ad' : `Reward in ${timeLeft} seconds`}
      </p>
    </div>
  );
};

export default AdInterstitial;
