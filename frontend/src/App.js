import React, { useState, useRef, lazy, Suspense, useCallback } from 'react';
import { FaMicrophone, FaDownload, FaAtom, FaDna, FaGlobeAmericas } from 'react-icons/fa';
import UploadSection from './components/UploadSection';
import ConfidenceIndex from './components/ConfidenceIndex';
import FillerWords from './components/FillerWords';
import PostureScore from './components/PostureScore';
import EyeContact from './components/EyeContact';
import ProfessionalFeedback from './components/ProfessionalFeedback';
import ResultCard from './components/ResultCard';

// Lazy load heavy components for better initial load performance
const ChartSpeakingSpeed = lazy(() => import('./components/ChartSpeakingSpeed'));
const GestureHeatmap = lazy(() => import('./components/GestureHeatmap'));

const ComponentLoader = () => (
  <div className="glass-card p-8 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="text-white/60 text-sm font-mono">Loading component...</p>
    </div>
  </div>
);

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);

  const handleResultsReceived = useCallback((data) => {
    setResults(data);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const exportResults = useCallback(() => {
    if (!results) return;
    const reportData = {
      timestamp: new Date().toISOString(),
      confidenceIndex: results.confidence_index,
      speakingSpeed: results.speaking_speed,
      fillerWords: results.filler_words,
      posture: results.posture,
      gestures: results.gestures,
      eyeContact: results.eye_contact,
      feedback: results.professional_feedback
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PUBLIC-SPEAKING-ANALYSIS-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  return (
    <div className="min-h-screen text-white selection:bg-cyan-500 selection:text-black">
      {/* Floating Holographic Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-glow"></div>
              <div className="relative bg-black p-2.5 rounded-lg border border-white/10">
                <FaAtom className="text-cyan-400 text-xl animate-spin-slow" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-200 group-hover:text-neon transition-all duration-300">
              Feedback Mechanism for <span className="text-cyan-400">Public Speaking</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {results && (
              <button
                onClick={exportResults}
                className="btn-neon-secondary flex items-center space-x-2 text-sm group"
              >
                <FaDownload className="text-cyan-400 group-hover:animate-bounce" />
                <span className="hidden sm:inline tracking-wider">DOWNLOAD DATA</span>
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <FaGlobeAmericas className="text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20 relative animate-float">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
          <h1 className="relative text-6xl md:text-7xl font-black mb-6 tracking-tighter">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              UNLEASH YOUR
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-neon animate-pulse-glow">
              FULL POTENTIAL
            </span>
          </h1>
          <p className="relative text-xl text-cyan-100/70 mb-10 max-w-2xl mx-auto font-light tracking-wide">
            AI-Driven Multimodal Public Speaking Feedback — Speech · Gesture · Eye Contact
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-white/30 tracking-widest">
            <span className="flex items-center gap-1"><FaMicrophone className="text-cyan-500" /> WHISPER ASR</span>
            <span>·</span>
            <span>MEDIAPIPE VISION</span>
            <span>·</span>
            <span>LIBROSA AUDIO</span>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-24 relative z-10">
          <UploadSection setResults={handleResultsReceived} loading={loading} setLoading={setLoading} />
        </div>

        {/* Results Dashboard */}
        {results && (
          <div ref={resultsRef} className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-10">
              <h2 className="text-3xl font-bold text-white tracking-widest flex items-center gap-3">
                <FaDna className="text-cyan-400" />
                Analysis Results
              </h2>
              <span className="px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono tracking-widest animate-pulse">
                Active
              </span>
            </div>

            {/* Top Row: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ConfidenceIndex score={results.confidence_index} />
              <PostureScore postureData={results.posture} />
              <EyeContact eyeContactData={results.eye_contact} />
              <FillerWords fillerWordsData={results.filler_words} />
            </div>

            {/* Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Suspense fallback={<ComponentLoader />}>
                <ChartSpeakingSpeed speedData={results.speaking_speed} />
              </Suspense>
              <Suspense fallback={<ComponentLoader />}>
                <GestureHeatmap gestureData={results.gestures} />
              </Suspense>
            </div>

            {/* Bottom Row: Qualitative Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProfessionalFeedback feedback={results.professional_feedback} />
              </div>
              <div className="lg:col-span-1">
                <ResultCard results={results} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-lg mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/40 font-mono text-sm tracking-widest">
            AI-Driven Multimodal Public Speaking Feedback System v2.1 · RNSIT CSE(DS)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
