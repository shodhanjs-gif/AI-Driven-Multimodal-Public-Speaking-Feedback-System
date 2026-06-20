import React, { useState } from "react";
import { FaCloudUploadAlt, FaVideo, FaFileVideo, FaRadiation } from "react-icons/fa";
import axios from "axios";

function UploadSection({ setResults, loading, setLoading }) {
  const [videoFile, setVideoFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      setVideoFile(files[0]);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setVideoFile(file);
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) { clearInterval(progressInterval); return 90; }
          return prev + 5;
        });
      }, 200);

      const response = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setResults(response.data);
        setLoading(false);
        setUploadProgress(0);
      }, 800);
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.error || "SYSTEM ERROR: UPLOAD FAILED";
      alert(`⚠️ ${errorMessage}`);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="glass-card max-w-3xl mx-auto relative group">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_20px_#22d3ee] z-20 animate-pulse"></div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragging ? "border-cyan-400 bg-cyan-500/10 shadow-[inset_0_0_50px_rgba(34,211,238,0.2)]" : "border-white/20 hover:border-cyan-400/50 hover:bg-white/5"}
          ${videoFile ? "border-purple-500/50 bg-purple-500/5" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <input type="file" id="fileInput" className="hidden" accept="video/*" onChange={handleFileChange} />

        {videoFile ? (
          <div className="py-6 relative z-10">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-black border border-purple-500 rounded-full w-full h-full flex items-center justify-center">
                <FaFileVideo className="text-purple-400 text-4xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{videoFile.name}</h3>
            <p className="text-purple-300 font-mono mb-8">
              {(videoFile.size / (1024 * 1024)).toFixed(2)} MB // Ready to Analyze
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}
              className="px-4 py-2 bg-rose-500/20 border border-rose-500/50 rounded text-rose-400 hover:bg-rose-500/30 hover:text-white transition-all duration-300 font-bold tracking-wider uppercase text-xs"
            >
              Reupload
            </button>
          </div>
        ) : (
          <div className="py-6 relative z-10">
            <div className="w-24 h-24 mx-auto mb-6 relative group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative bg-black/50 border border-cyan-500/30 rounded-full w-full h-full flex items-center justify-center group-hover:border-cyan-400">
                <FaCloudUploadAlt className="text-cyan-400 text-5xl group-hover:animate-pulse" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Upload Video</h3>
            <p className="text-cyan-200/60 mb-8 font-light">Drag & Drop video file or click to browse system</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="mt-8 relative">
          <div className="flex justify-between text-xs font-mono text-cyan-400 mb-2 tracking-widest">
            <span className="animate-pulse">Processing Video...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-full relative transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleUpload}
          disabled={!videoFile || loading}
          className={`btn-neon-primary w-full sm:w-auto min-w-[250px] flex items-center justify-center gap-3
            ${(!videoFile || loading) ? "opacity-50 cursor-not-allowed grayscale" : ""}
          `}
        >
          {loading ? (
            <>
              <FaRadiation className="animate-spin" />
              <span>ANALYZING...</span>
            </>
          ) : (
            <>
              <FaVideo />
              <span>Start Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default React.memo(UploadSection);
