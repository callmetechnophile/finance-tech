"use client";

import { useEffect, useRef } from "react";

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Verify file presence
    fetch("/intro.mp4", { method: "HEAD" })
      .then((res) => {
        if (!res.ok) {
          console.warn(`GET /intro.mp4 returned status ${res.status}. Video file might be missing or inaccessible.`);
        }
      })
      .catch((err) => {
        console.warn("Failed to verify /intro.mp4 presence:", err);
      });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((err) => {
            // Muted autoplay block might fail or resolve depending on browser policies
            console.log("Autoplay preview paused or restricted by browser:", err);
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the video is visible
    );

    observer.observe(video);
    return () => {
      observer.unobserve(video);
    };
  }, []);

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
        <div className="max-w-6xl mx-auto rounded-3xl bg-[#181A20] border border-[#2b3139] overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center group">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-3xl"
            controls
            preload="auto"
            poster="/demo-poster.jpg"
            autoPlay
            muted
            playsInline
          >
            <source src="/intro.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </div>

      </div>
    </section>
  );
}
