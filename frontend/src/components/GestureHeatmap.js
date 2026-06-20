import React from "react";
import { FaHandPaper, FaFire, FaMicrochip } from "react-icons/fa";

function GestureHeatmap({ gestureData }) {
  if (!gestureData || !gestureData.heatmap) return null;

  const maxValue = Math.max(...gestureData.heatmap.flat());

  const getHeatColor = (value) => {
    if (maxValue === 0) return "bg-white/5";
    const intensity = value / maxValue;
    if (intensity > 0.75) return "bg-rose-500 shadow-[0_0_15px_#f43f5e]";
    if (intensity > 0.5) return "bg-amber-500 shadow-[0_0_15px_#f59e0b]";
    if (intensity > 0.25) return "bg-cyan-500 shadow-[0_0_15px_#06b6d4]";
    if (intensity > 0) return "bg-purple-500 shadow-[0_0_15px_#8b5cf6]";
    return "bg-white/5";
  };

  const getIntensityLabel = (level) => {
    if (level === "excessive") return { text: "OVERLOAD", color: "text-rose-400", icon: <FaFire className="text-rose-500 animate-pulse" /> };
    if (level === "balanced") return { text: "OPTIMAL", color: "text-emerald-400", icon: <FaMicrochip className="text-emerald-500" /> };
    return { text: "MINIMAL", color: "text-cyan-400", icon: <FaHandPaper className="text-cyan-500" /> };
  };

  const levelInfo = getIntensityLabel(gestureData.level);

  return (
    <div className="glass-card h-full tilt-on-hover group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-cyan-200/70 tracking-widest uppercase flex items-center gap-2">
          {levelInfo.icon}
          GESTURE HEATMAP
        </h3>
        <div className={`px-2 py-1 rounded border border-white/10 bg-black/50 text-[10px] font-mono ${levelInfo.color}`}>
          STATUS: {levelInfo.text}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative bg-black/40 rounded-xl p-4 mb-6 border border-white/10 shadow-inner overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-20"></div>
        <div className="grid grid-cols-10 gap-1 relative z-0">
          {gestureData.heatmap.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square rounded-sm ${getHeatColor(value)} transition-all duration-300 hover:scale-150 hover:z-20 cursor-crosshair`}
                style={{ opacity: value > 0 ? 0.8 + (value / maxValue) * 0.2 : 0.2 }}
                title={`INTENSITY: ${value}`}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] font-mono text-cyan-200/50 mb-4 uppercase tracking-wider">
        <span>IDLE</span>
        <div className="flex-1 mx-3 h-1 rounded-full bg-gradient-to-r from-purple-900 via-cyan-500 to-rose-500"></div>
        <span>MAX</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-white/5 p-2 rounded border border-white/10 text-center">
          <div className="text-white/30 mb-1">MOVEMENTS</div>
          <div className="text-white font-bold">{gestureData.total_movements}</div>
        </div>
        <div className="bg-white/5 p-2 rounded border border-white/10 text-center">
          <div className="text-white/30 mb-1">AVG INTENSITY</div>
          <div className="text-white font-bold">{gestureData.avg_intensity?.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(GestureHeatmap);
