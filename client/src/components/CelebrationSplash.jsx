import React, { useEffect, useState } from 'react';

const emojis = ['🎉', '🚀', '⭐', '🏆', '🙌', '🔥', '👏', '🥳', '✨', '🎊'];

const CelebrationSplash = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 150 random particles
    const newParticles = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      animationDuration: 2 + Math.random() * 3,
      animationDelay: Math.random() * 2,
      fontSize: 20 + Math.random() * 30,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-[100000] pointer-events-none overflow-hidden flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500">
        <div className="absolute inset-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute top-[-10%] animate-fall"
              style={{
                left: `${p.left}%`,
                fontSize: `${p.fontSize}px`,
                animationDuration: `${p.animationDuration}s`,
                animationDelay: `${p.animationDelay}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
        <div className="bg-[#16162A] border-2 border-emerald-500/50 p-8 rounded-2xl shadow-[0_0_80px_rgba(16,185,129,0.3)] transform scale-100 animate-bounce-in text-center z-10 font-sans">
          <h2 className="text-4xl font-extrabold text-white mb-2">🎉 Masterpiece! 🎉</h2>
          <p className="text-emerald-400 text-lg font-medium">All test cases passed successfully.</p>
          <p className="text-neutral-400 text-sm mt-4 animate-pulse">Automatically exiting in a few seconds...</p>
        </div>
        <style>{`
          @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
          }
          .animate-fall {
            animation-name: fall;
          }
          @keyframes bounce-in {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-bounce-in {
            animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}</style>
    </div>
  );
};

export default CelebrationSplash;
