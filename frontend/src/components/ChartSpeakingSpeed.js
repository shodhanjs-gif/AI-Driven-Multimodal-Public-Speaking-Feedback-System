import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import { FaClock, FaBolt } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

function ChartSpeakingSpeed({ speedData }) {
  if (!speedData) return null;

  const chartData = {
    labels: speedData.timestamps,
    datasets: [
      {
        label: "SPEED_WPM",
        data: speedData.values,
        borderColor: "#8b5cf6",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(139, 92, 246, 0.5)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointBackgroundColor: "#000",
        pointBorderColor: "#22d3ee",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#22d3ee",
        pointHoverBorderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 12,
        titleColor: "#22d3ee",
        bodyColor: "#fff",
        borderColor: "rgba(139, 92, 246, 0.5)",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => `SPEED: ${context.parsed.y.toFixed(0)} WPM`,
        },
      },
    },
    scales: {
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "rgba(255, 255, 255, 0.5)" },
      },
      x: {
        grid: { display: false },
        ticks: { display: false },
      },
    },
    animation: { duration: 2000, easing: "easeInOutQuart" },
  };

  return (
    <div className="glass-card h-full tilt-on-hover group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-cyan-200/70 tracking-widest uppercase flex items-center gap-2">
          <FaClock className="text-purple-400" />
          SPEAKING VELOCITY
        </h3>
        <div className="text-right">
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {speedData.average}
          </div>
          <div className="text-[10px] text-white/40 font-mono tracking-widest">WPM AVG</div>
        </div>
      </div>

      <div className="h-64 relative">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex-1 bg-white/5 rounded p-2 border border-white/10 text-center">
          <div className="text-[10px] text-cyan-200/50 font-mono mb-1">PACE</div>
          <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
            <FaBolt className="text-yellow-400" />
            {speedData.level?.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChartSpeakingSpeed);
