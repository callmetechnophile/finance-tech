"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Play, Check, ArrowRight } from "lucide-react";

export default function Demo() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoComplete, setDemoComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayDemo = () => {
    setIsPlayingDemo(true);
    setDemoComplete(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnded = () => {
    setDemoComplete(true);
    setIsPlayingDemo(false);
  };

  return (
    <section id="interactive-demo" className="py-24 border-b border-[#2b3139] bg-[#0b0e11] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fcd535]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 text-center space-y-12 relative z-10">
        
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em]">Cinematic Tour</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Watch FORGE-PATH In Action
          </h2>
          <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
            Experience the complete visual walkthrough of document processing pipelines and AI-driven executive simulations.
          </p>
        </div>

        {/* Cinematic Video Player Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#1e2329] border border-[#2b3139] overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center group">
          
          <video
            ref={videoRef}
            src="/intro.mp4"
            className="w-full h-full object-cover"
            controls={isPlayingDemo}
            onEnded={handleVideoEnded}
          />

          {/* Custom Overlay Play Button */}
          {!isPlayingDemo && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4 z-10 transition-all">
              <button
                onClick={handlePlayDemo}
                className="w-16 h-16 rounded-full bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#eaecef]">
                {demoComplete ? "Replay Video Demo" : "Play Interactive Overview (2 min)"}
              </span>
            </div>
          )}

          {/* Demo complete overlay */}
          {demoComplete && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-[4px] flex flex-col items-center justify-center space-y-6 z-20 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#0ecb81]/15 border border-[#0ecb81]/30 text-[#0ecb81] flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Journey Complete</h3>
                <p className="text-xs text-[#707a8a] max-w-sm mx-auto">
                  You've seen how FORGE-PATH processes cash data. Now try launching your own active workspace.
                </p>
              </div>
              <Link
                href="/login"
                className="h-11 px-6 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] font-extrabold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 transition-colors"
              >
                Launch Workspace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
