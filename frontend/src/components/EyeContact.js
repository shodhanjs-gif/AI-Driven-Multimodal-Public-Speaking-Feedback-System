import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

function EyeContact({ eyeContactData }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!eyeContactData) return;
    let start = 0;
    const end = eyeContactData.percentage;
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
  }, [eyeContactData]);

  if (!eyeContactData) return null;

  const getColor = (score) => {
    if (score >= 70) return "text-emerald-400 stroke-emerald-500";
    if (score >= 40) return "text-cyan-400 stroke-cyan-500";
    return "text-rose-400 stroke-rose-500";
  };

  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (animatedScore / 100) * strokeDasharray;
  const colorClass = getColor(eyeContactData.percentage);

  return (
    <div className="glass-card h-full flex flex-col items-center justify-center relative group overflow-hidden">
      <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-100 transition-opacity duration-500 animate-pulse">
        <FaEye className="text-cyan-400 text-2xl" />
      </div>
      <h3 className="text-sm font-bold text-cyan-200/70 mb-6 tracking-widest uppercase flex items-center gap-2">
        <FaEye className="text-cyan-400" />
        VISUAL CONTACT
      </h3>

      <div className="relative w-40 h-40 mb-6 group-hover:scale-105 transition-transform duration-500">
        <svg className="w-full h-full transform -rotate-90 relative z-10">
          <circle cx="80" cy="80" r="45" className="stroke-white/10" strokeWidth="4" fill="none" />
          <circle
            cx="80" cy="80" r="45"
            className={`transition-all duration-1000 ease-out ${colorClass.split(" ")[1]}`}
            strokeWidth="4" fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className={`text-4xl font-black tracking-tighter ${colorClass.split(" ")[0]}`}>
            {Math.floor(animatedScore)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full mt-4">
        <div className="bg-white/5 p-2 rounded text-center border border-white/10">
          <div className="text-[10px] text-white/30 font-mono uppercase">FOCUSED</div>
          <div className="text-emerald-400 font-bold">{eyeContactData.percentage}%</div>
        </div>
        <div className="bg-white/5 p-2 rounded text-center border border-white/10">
          <div className="text-[10px] text-white/30 font-mono uppercase">AVERTED</div>
          <div className="text-rose-400 font-bold">{(100 - eyeContactData.percentage).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(EyeContact);
