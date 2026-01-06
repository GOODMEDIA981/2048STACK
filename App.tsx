
import React, { useState, useCallback, useEffect } from 'react';
import PhysicsGame from './components/PhysicsGame';
import AdInterstitial from './components/AdInterstitial';
import { GameStats } from './types';
import { soundService } from './services/soundService';
import { adService } from './services/adService';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [adType, setAdType] = useState<'continue' | 'periodic' | null>(null);
  
  const [gamesPlayedCount, setGamesPlayedCount] = useState(() => 
    Number(localStorage.getItem('2048_gamesPlayed')) || 0
  );

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: Number(localStorage.getItem('2048_highScore')) || 0,
    merges: 0,
    highestTile: 2,
    isGameOver: false
  });

  const [gameId, setGameId] = useState(0);
  const [continueToken, setContinueToken] = useState(0);

  useEffect(() => {
    if (stats.isGameOver) {
      soundService.playGameOver();
    }
  }, [stats.isGameOver]);

  const updateStats = useCallback((newStats: Partial<GameStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats };
      if (updated.score > updated.highScore) {
        updated.highScore = updated.score;
        localStorage.setItem('2048_highScore', updated.highScore.toString());
      }
      return updated;
    });
  }, []);

  const performReset = useCallback(() => {
    setStats({
      score: 0,
      highScore: Number(localStorage.getItem('2048_highScore')) || 0,
      merges: 0,
      highestTile: 2,
      isGameOver: false
    });
    setGameId(prev => prev + 1);
  }, []);

  const resetGame = async () => {
    soundService.playButton();
    
    // Increment the game play counter
    const newCount = gamesPlayedCount + 1;
    setGamesPlayedCount(newCount);
    localStorage.setItem('2048_gamesPlayed', newCount.toString());

    // Check if we should play a periodic ad (every 4 games)
    if (newCount > 0 && newCount % 4 === 0) {
      setAdType('periodic');
      setIsAdLoading(true);
      await adService.prepareAd();
      setIsAdLoading(false);
      setShowAd(true);
    } else {
      performReset();
    }
  };

  const handleContinueRequest = async () => {
    soundService.playButton();
    setAdType('continue');
    setIsAdLoading(true);
    
    // 1. Simulate AdMob "Loading Ad" phase
    await adService.prepareAd();
    
    setIsAdLoading(false);
    // 2. Show the Interstitial
    setShowAd(true);
  };

  const onAdFinished = () => {
    const currentType = adType;
    setShowAd(false);
    setAdType(null);
    adService.reset();

    if (currentType === 'continue') {
      // Reward the player by continuing the current game
      setStats(prev => ({ ...prev, isGameOver: false }));
      setContinueToken(prev => prev + 1);
    } else if (currentType === 'periodic') {
      // Just a periodic ad between games, now actually reset
      performReset();
    }
  };

  const handleStartGame = () => {
    soundService.playButton();
    setHasStarted(true);
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="mb-12 space-y-4 flex flex-col items-center">
          <h1 
            className="text-7xl md:text-8xl font-black italic tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] select-none animate-bounce px-8 overflow-visible"
            style={{ 
              backgroundImage: 'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animationDuration: '3s'
            }}
          >
            2048STACK
          </h1>
          <p className="text-xl font-medium text-white tracking-wide">
            Stack 'em high, don't cross the line!
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <button 
            onClick={handleStartGame}
            className="relative px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black text-2xl shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-4 border border-white/20"
          >
            <i className="fas fa-play"></i> START GAME
          </button>
        </div>

        <div className="mt-16 flex gap-8">
           <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-white">Best Score</span>
              <span className="text-2xl font-bold text-white">{stats.highScore}</span>
           </div>
           <div className="flex flex-col border-l border-white/10 pl-8">
              <span className="text-[10px] uppercase font-black tracking-widest text-white">Objective</span>
              <span className="text-2xl font-bold text-white">2048</span>
           </div>
        </div>
        
        {/* Game Counter Footer (Optional, useful for debugging/transparency) */}
        <div className="mt-8 text-[10px] text-white opacity-40 uppercase tracking-widest font-black">
          Games Played: {gamesPlayedCount}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center p-4 animate-in zoom-in-95 duration-500">
      {/* Interstitial Ad Layer */}
      {showAd && <AdInterstitial onClose={onAdFinished} />}

      {/* Header UI */}
      <div className="w-full max-w-[450px] mb-4 flex justify-between items-center gap-2">
        <div className="flex-1 min-w-0">
          <h1 
            className="text-4xl font-black bg-clip-text text-transparent italic tracking-tighter pr-6 overflow-visible drop-shadow-xl select-none"
            style={{ 
              backgroundImage: 'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)',
              WebkitBackgroundClip: 'text'
            }}
          >
            2048STACK
          </h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <div className="bg-blue-900/40 backdrop-blur-sm border-2 border-white/80 px-3 py-1 rounded-lg text-center shadow-lg min-w-[75px]">
            <div className="text-[10px] uppercase text-white font-black tracking-widest">Score</div>
            <div className="text-xl font-bold text-white">{stats.score}</div>
          </div>
          <div className="bg-blue-900/40 backdrop-blur-sm border-2 border-white/80 px-3 py-1 rounded-lg text-center shadow-lg min-w-[75px]">
            <div className="text-[10px] uppercase text-white font-black tracking-widest">Best</div>
            <div className="text-xl font-bold text-white">{stats.highScore}</div>
          </div>
        </div>
      </div>

      {/* Game Engine */}
      <div className="relative">
        <PhysicsGame 
          key={gameId}
          onUpdateStats={updateStats} 
          isGameOver={stats.isGameOver}
          onReset={resetGame}
          continueToken={continueToken}
        />

        {/* Game Over Screen */}
        {stats.isGameOver && (
          <div className="absolute inset-0 bg-blue-950/95 backdrop-blur-md flex flex-col items-center justify-center z-50 rounded-xl p-8 text-center animate-in zoom-in duration-300">
            <div className="mb-10 flex flex-col items-center">
              <span className="text-sm font-black tracking-widest uppercase text-white mb-1">Current Score</span>
              <h2 className="text-8xl font-black text-white tracking-tighter mb-4">{stats.score}</h2>
              <div className="flex flex-col items-center bg-white/10 px-6 py-2 rounded-full border border-white/20">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">Best Score</span>
                <span className="text-2xl font-bold text-white">{stats.highScore}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full">
              <button 
                onClick={handleContinueRequest}
                disabled={isAdLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isAdLoading && adType === 'continue' ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-spinner animate-spin"></i> LOADING AD...
                  </span>
                ) : (
                  <>
                    <i className="fas fa-video"></i> CONTINUE (AD)
                  </>
                )}
              </button>
              
              <button 
                onClick={resetGame}
                disabled={isAdLoading && adType === 'periodic'}
                className="w-full bg-white text-blue-950 hover:bg-slate-200 py-5 rounded-2xl font-black text-xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border-4 border-blue-900 disabled:opacity-50"
              >
                {isAdLoading && adType === 'periodic' ? (
                   <span className="flex items-center gap-2">
                    <i className="fas fa-spinner animate-spin"></i> LOADING AD...
                  </span>
                ) : (
                  <>
                    <i className="fas fa-rotate-left"></i> RESTART
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
