import React, { useEffect, useState } from "react";
import { FaUserAstronaut, FaCrosshairs } from "react-icons/fa";

function PostureScore({ postureData }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!postureData) return;
    let start = 0;
    const end = postureData.score;
    const duration = 1500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [postureData]);

  if (!postureData) return null;

  return (
    <div className="glass-card h-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-sm font-bold text-cyan-200/70 tracking-widest uppercase flex items-center gap-2">
          <FaUserAstronaut className="text-purple-400" />
          POSTURE ANALYSIS
        </h3>
        <FaCrosshairs className="text-white/20 group-hover:text-cyan-400 group-hover:rotate-90 transition-all duration-500" />
      </div>

      <div className="flex items-end gap-3 mb-6 relative z-10">
        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {Math.floor(animatedScore)}
        </span>
        <span className="text-sm text-cyan-500/70 font-mono mb-2 tracking-widest">/ 100 PTS</span>
      </div>

      <div className="w-full bg-black/50 rounded-none h-4 mb-8 relative border border-white/10 overflow-hidden">
        <div className="absolute inset-0 flex justify-between px-1">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-white/10"></div>
          ))}
        </div>
        <div
          className="h-full bg-gradient-to-r from-purple-600 via-cyan-500 to-white relative transition-all duration-1000 ease-out"
          style={{ width: `${animatedScore}%` }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-cyan-500/30 transition-colors">
          <div className="text-[10px] text-cyan-200/50 font-mono mb-1 uppercase tracking-wider">LABEL</div>
          <div className="font-bold text-white tracking-wide">{postureData.label?.toUpperCase()}</div>
        </div>
        <div className="bg-white/5 p-3 rounded border border-white/10 hover:border-cyan-500/30 transition-colors">
          <div className="text-[10px] text-cyan-200/50 font-mono mb-1 uppercase tracking-wider">RATIO</div>
          <div className="font-bold text-white tracking-wide">{(postureData.ratio * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PostureScore);
