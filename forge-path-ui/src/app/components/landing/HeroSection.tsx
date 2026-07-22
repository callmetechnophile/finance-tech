"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 select-none animate-fadeIn">
      {/* Animated Engineering Grid Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Moving Ambient Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full bg-[#faff69]/5 blur-[160px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vh] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none"
      />

      {/* Glowing Moving Light Ray */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[50vh] bg-gradient-to-b from-[#faff69]/0 via-[#faff69]/30 to-[#faff69]/0 blur-[1px] opacity-70 animate-pulse" />

      {/* Hero Content Container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
        {/* LOGO & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center space-y-3"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#faff69] to-[#d4d940] flex items-center justify-center shadow-lg shadow-[#faff69]/10 border border-[#2a2a2a]">
            <Zap className="w-8 h-8 text-[#0a0a0a]" />
          </div>
          <h2 className="text-[#faff69] tracking-[0.25em] text-xs font-bold uppercase mt-2">
            FORGE-PATH
          </h2>
          <p className="text-[#666666] text-xs font-medium uppercase tracking-wider">
            Enterprise Financial Operating System
          </p>
        </motion.div>

        {/* Fading Headlines */}
        <div className="space-y-4 pt-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="text-white text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
          >
            Finance.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#666666]">
              Reimagined.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 1 }}
            className="text-[#888888] text-lg md:text-xl font-medium tracking-wide"
          >
            Built for the AI Era.
          </motion.p>
        </div>
      </div>

      {/* Tiny Ambient Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 1000 - 500,
              y: Math.random() * 800 + 400,
              opacity: 0,
            }}
            animate={{
              y: [-100, 900],
              opacity: [0, 0.4, 0.4, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear",
            }}
            className="absolute w-1 h-1 rounded-full bg-[#faff69]/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0], y: [0, 8, 0] }}
        transition={{ delay: 4, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 cursor-pointer"
      >
        <span className="text-[10px] text-[#666666] tracking-widest font-semibold uppercase">
          Scroll to explore
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#666666] to-transparent" />
      </motion.div>
    </section>
  );
}
