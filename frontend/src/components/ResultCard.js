import React, { useState } from "react";
import { FaTerminal, FaCopy, FaCheck, FaCode } from "react-icons/fa";

function ResultCard({ results }) {
  const [copied, setCopied] = useState(false);

  if (!results || !results.transcript) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(results.transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = results.transcript.split(/\s+/).length;

  return (
    <div className="glass-card h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
          </div>
          <h3 className="text-sm font-mono text-cyan-200/70 tracking-widest ml-2 flex items-center gap-2">
            <FaTerminal />
            Transcript
          </h3>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono transition-all duration-200 border
            ${copied
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
              : "bg-white/5 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400"
            }`}
        >
          {copied ? <><FaCheck size={10} /><span>COPIED</span></> : <><FaCopy size={10} /><span>COPY DATA</span></>}
        </button>
      </div>

      <div className="flex-1 bg-black/60 rounded-lg p-4 border border-white/5 overflow-y-auto max-h-[400px] font-mono text-sm relative group">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <FaCode className="text-white/10 text-4xl" />
        </div>
        <p className="text-cyan-100/80 leading-relaxed whitespace-pre-wrap">
          <span className="text-purple-400 mr-2">$</span>
          {results.transcript}
          <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle"></span>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-mono text-white/30 px-1 uppercase tracking-wider">
        <span>Audio Source</span>
        <span className="text-cyan-400">WORDS: {wordCount}</span>
      </div>
    </div>
  );
}

export default React.memo(ResultCard);
