import React, { useState } from "react";
import { FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaRobot } from "react-icons/fa";

function ProfessionalFeedback({ feedback }) {
  const [expandedItems, setExpandedItems] = useState([]);

  if (!feedback) return null;

  const feedbackItems = feedback.split("\n\n").filter((item) => item.trim());

  const getFeedbackStyle = (text) => {
    if (text.includes("✅") || text.includes("Excellent") || text.includes("Great")) {
      return {
        icon: <FaCheckCircle className="text-emerald-400 text-xl" />,
        border: "border-emerald-500/30", bg: "bg-emerald-500/5",
        glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-400",
        text: "text-emerald-100",
      };
    }
    if (text.includes("⚠️") || text.includes("Moderate") || text.includes("Work")) {
      return {
        icon: <FaExclamationTriangle className="text-amber-400 text-xl" />,
        border: "border-amber-500/30", bg: "bg-amber-500/5",
        glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-400",
        text: "text-amber-100",
      };
    }
    if (text.includes("🎯")) {
      return {
        icon: <FaLightbulb className="text-cyan-400 text-xl" />,
        border: "border-cyan-500/30", bg: "bg-cyan-500/5",
        glow: "hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:border-cyan-400",
        text: "text-cyan-100",
      };
    }
    return {
      icon: <FaTimesCircle className="text-slate-400 text-xl" />,
      border: "border-slate-500/30", bg: "bg-slate-500/5",
      glow: "hover:shadow-[0_0_20px_rgba(148,163,184,0.2)] hover:border-slate-400",
      text: "text-slate-200",
    };
  };

  const toggleExpand = (index) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="glass-card h-full">
      <div className="flex items-center space-x-3 mb-8 border-b border-white/10 pb-4">
        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/30 animate-pulse">
          <FaRobot className="text-cyan-400 text-xl" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">AI_ANALYSIS_REPORT</h2>
      </div>

      <div className="space-y-4">
        {feedbackItems.map((item, index) => {
          const style = getFeedbackStyle(item);
          return (
            <div
              key={index}
              className={`${style.bg} rounded-xl p-4 border ${style.border} transition-all duration-300 ${style.glow} cursor-pointer group relative overflow-hidden`}
              onClick={() => toggleExpand(index)}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start space-x-4 relative z-10">
                <div className="p-2 rounded-lg bg-black/40 border border-white/10 shadow-inner">
                  {style.icon}
                </div>
                <div className="flex-1">
                  <p className={`${style.text} font-medium leading-relaxed whitespace-pre-line tracking-wide`}>
                    {item.replace(/[✅⚠️🎯💪👍🌟]/g, "").trim()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(ProfessionalFeedback);
