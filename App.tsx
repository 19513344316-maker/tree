
import React, { useState, useEffect } from 'react';
import ChristmasTree from './components/ChristmasTree';

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0c0211]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#0c0211] to-black opacity-60 pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl aspect-[4/5] md:aspect-[16/9] flex flex-col items-center">
        
        {/* Title Message */}
        <h1 className="text-pink-100 text-4xl md:text-6xl font-script mt-8 mb-4 drop-shadow-[0_0_15px_rgba(255,20,147,0.8)] animate-pulse">
          Merry Christmas To Li Mengna
        </h1>

        {/* Tree Component */}
        <div className="flex-1 w-full relative">
          <ChristmasTree />
        </div>

        {/* Footer info/controls if needed */}
        <div className="mt-4 mb-8 text-pink-300/40 text-sm font-sans tracking-widest uppercase">
          Happy Holidays &bull; 2024
        </div>
      </div>

      {/* Particle Overlay (Fixed) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes snow {
          to {
            transform: translateY(120vh) translateX(${Math.random() * 100 - 50}px);
          }
        }
        .animate-snow {
          animation: snow linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
