import React, { useEffect, useState } from "react";
import { FaTrophy, FaChartLine } from "react-icons/fa";

function ConfidenceIndex({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (score === undefined || score === null) return;
    let start = 0;
    const end = score;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start) + (Math.random() > 0.5 ? 1 : -1));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const getColor = (value) => {
    if (value >= 80) return "text-emerald-400 stroke-emerald-500 shadow-emerald-500";
    if (value >= 60) return "text-cyan-400 stroke-cyan-500 shadow-cyan-500";
    if (value >= 40) return "text-amber-400 stroke-amber-500 shadow-amber-500";
    return "text-rose-500 stroke-rose-600 shadow-rose-600";
  };

  const getLabel = (value) => {
    if (value >= 80) return "EXCELLENT";
    if (value >= 60) return "GOOD";
    if (value >= 40) return "AVERAGE";
    return "CRITICAL";
  };

  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;
  const colorClass = getColor(score);

  if (score === undefined || score === null) return null;

  return (
    <div className="glass-card h-full flex flex-col items-center justify-center text-center group">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
        <FaChartLine className="text-white text-2xl" />
      </div>

      <h3 className="text-sm font-bold text-cyan-200/70 mb-6 tracking-widest uppercase flex items-center gap-2">
        <FaTrophy className="text-yellow-400" />
        CONFIDENCE INDEX
      </h3>

      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full transform -rotate-90 relative z-10">
          <circle cx="96" cy="96" r="45" className="stroke-white/10" strokeWidth="6" fill="none" />
          <circle
            cx="96" cy="96" r="45"
            className={`transition-all duration-1000 ease-out ${colorClass.split(" ")[1]}`}
            strokeWidth="6" fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <span className={`text-5xl font-black tracking-tighter ${colorClass.split(" ")[0]}`}>
            {Math.floor(animatedScore)}
          </span>
          <span className="text-xs text-white/40 font-mono mt-1">SCORE</span>
        </div>
      </div>

      <div className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest border backdrop-blur-md
        ${score >= 80 ? "badge-neon-success" : score >= 60 ? "badge-neon-neutral" : score >= 40 ? "badge-neon-warning" : "badge-neon-danger"}`}>
        {getLabel(score)}
      </div>

      <div className="w-full space-y-3 text-left mt-8 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-200/50">POSTURE STABILITY</span>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 w-[85%] shadow-[0_0_10px_#22d3ee]"></div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-200/50">VOCAL CLARITY</span>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[92%] shadow-[0_0_10px_#a855f7]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ConfidenceIndex);
