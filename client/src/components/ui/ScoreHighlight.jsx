import React from 'react';

const ScoreHighlight = ({ score, label = "ATS Rank" }) => {
  // Determine gradient based on score
  let gradientClass = "from-red-500 to-orange-500"; // below 50
  if (score >= 80) gradientClass = "from-emerald-400 to-teal-500"; // high score
  else if (score >= 50) gradientClass = "from-amber-400 to-orange-500"; // moderate score

  return (
    <div className="relative inline-flex items-center justify-center p-8">
      {/* Outer Glow */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${gradientClass} rounded-full blur-3xl opacity-20 animate-pulse`}></div>
      
      {/* Circle Container */}
      <div className="relative z-10 w-48 h-48 rounded-full bg-slate-900 border border-white/10 flex flex-col items-center justify-center shadow-2xl">
        {/* Conic Ring - we simulate it with a clipped background or just a simple colored border for now */}
        <div className={`absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-tr ${gradientClass} opacity-50`} style={{ WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", padding: "4px" }}></div>
        
        <span className={`text-6xl font-outfit font-bold bg-clip-text text-transparent bg-gradient-to-tr ${gradientClass}`}>
          {score}
        </span>
        <span className="mt-2 text-xs font-semibold tracking-widest text-slate-400 uppercase">
          {label}
        </span>
      </div>
    </div>
  );
};

export default ScoreHighlight;
