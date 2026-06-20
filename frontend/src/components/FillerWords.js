import React, { useEffect, useState } from "react";
import { FaMicrophoneSlash, FaExclamationTriangle } from "react-icons/fa";

function FillerWords({ fillerWordsData }) {
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    if (!fillerWordsData) return;
    let start = 0;
    const end = fillerWordsData.total_count;
    const duration = 1500;
    const increment = Math.max(1, end / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedCount(end);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [fillerWordsData]);

  if (!fillerWordsData) return null;

  return (
    <div className="glass-card h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-sm font-bold text-cyan-200/70 tracking-widest uppercase flex items-center gap-2">
          <FaMicrophoneSlash className="text-rose-400" />
          FILLER DETECTION
        </h3>
        {fillerWordsData.total_count > 5 && (
          <FaExclamationTriangle className="text-rose-500 animate-pulse" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-rose-500/30 transition-colors group">
          <div className="text-[10px] text-rose-200/50 font-mono mb-1 uppercase tracking-wider">TOTAL COUNT</div>
          <div className="text-4xl font-black text-white group-hover:text-rose-400 transition-colors">
            {animatedCount}
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-rose-500/30 transition-colors group">
          <div className="text-[10px] text-rose-200/50 font-mono mb-1 uppercase tracking-wider">FREQUENCY</div>
          <div className="text-4xl font-black text-white group-hover:text-rose-400 transition-colors">
            {fillerWordsData.percentage ? fillerWordsData.percentage.toFixed(1) : 0}%
          </div>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="text-[10px] text-white/30 font-mono tracking-widest mb-2">TOP DETECTED WORDS</div>
        {Object.entries(fillerWordsData.top_filler_words || {}).map(([word, count], index) => (
          <div key={index} className="group">
            <div className="flex justify-between text-xs font-mono text-cyan-200/70 mb-1">
              <span className="uppercase">"{word}"</span>
              <span>{count}</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-purple-500 group-hover:shadow-[0_0_10px_#f43f5e] transition-all duration-300"
                style={{ width: `${Math.min((count / fillerWordsData.total_count) * 100 * 2, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(FillerWords);
