"use client";

import React, { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import PhoneSignUp from "@/components/auth/PhoneSignUp";
import { Mail, Phone } from "lucide-react";

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");

  useEffect(() => {
    let containerEl: HTMLElement | null = null;
    let svgEl: SVGElement | null = null;
    let inputEl: HTMLInputElement | null = null;

    const handleFocus = () => {
      if (containerEl) {
        containerEl.style.setProperty("border-color", "#fcd535", "important");
        containerEl.style.setProperty("box-shadow", "0 0 24px rgba(252,213,53,.35)", "important");
      }
    };

    const handleBlur = () => {
      if (containerEl) {
        containerEl.style.setProperty("border-color", "rgba(255,255,255,0.9)", "important");
        containerEl.style.setProperty("box-shadow", "none", "important");
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (svgEl && containerEl) {
        const rect = containerEl.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        svgEl.style.transform = `translate(${x * 8}px, ${y * 4}px)`;
      }
    };

    const handleMouseLeave = () => {
      if (svgEl) {
        svgEl.style.transform = "translate(0px, 0px)";
      }
    };

    const enhance = () => {
      const emailInput = document.querySelector('input[name="identifier"]') as HTMLInputElement;
      if (!emailInput) return false;

      const container = emailInput.closest(".cl-formFieldInputGroup") as HTMLElement;
      if (!container) return false;

      // Avoid double enhancement
      if (container.getAttribute("data-enhanced") === "true") return true;
      container.setAttribute("data-enhanced", "true");

      containerEl = container;
      inputEl = emailInput;

      // Apply styles to the container
      container.style.setProperty("background-color", "rgba(18,20,24,0.85)", "important");
      container.style.setProperty("backdrop-filter", "blur(10px)", "important");
      container.style.setProperty("border", "1.5px solid rgba(255,255,255,0.9)", "important");
      container.style.setProperty("border-radius", "16px", "important");
      container.style.setProperty("overflow", "hidden", "important");
      container.style.setProperty("position", "relative", "important");
      container.style.setProperty("transition", "border-color 250ms ease, box-shadow 250ms ease", "important");

      // Apply styles to the input
      emailInput.style.setProperty("background", "transparent", "important");
      emailInput.style.setProperty("border", "none", "important");
      emailInput.style.setProperty("outline", "none", "important");
      emailInput.style.setProperty("box-shadow", "none", "important");
      emailInput.style.setProperty("position", "relative", "important");
      emailInput.style.setProperty("z-index", "10", "important");

      // Create animated SVG background
      const svgString = `
        <svg viewBox="0 0 400 60" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; user-select: none; z-index: 0; opacity: 0.12; transition: transform 300ms ease-out;" id="ai-factory-svg">
          <!-- Grid -->
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2b3139" stroke-width="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <!-- Conveyor Belt -->
          <line x1="10" y1="45" x2="390" y2="45" stroke="#3a3a3a" stroke-width="2" stroke-dasharray="4,4" class="conveyor-belt" />

          <!-- Robotic Arm 1 (Left) -->
          <g class="robotic-arm-1" transform="translate(40, 15)">
            <rect x="-6" y="-3" width="12" height="6" fill="#555" rx="2" />
            <line x1="0" y1="0" x2="15" y2="15" stroke="#fcd535" stroke-width="3" />
            <circle cx="15" cy="15" r="3" fill="#888" />
            <line x1="15" y1="15" x2="30" y2="10" stroke="#fcd535" stroke-width="2" />
            <path d="M 30 7 L 34 10 L 30 13" stroke="#eaecef" stroke-width="1.5" fill="none" />
          </g>

          <!-- Robotic Arm 2 (Right) -->
          <g class="robotic-arm-2" transform="translate(320, 10)">
            <rect x="-6" y="-3" width="12" height="6" fill="#555" rx="2" />
            <line x1="0" y1="0" x2="-20" y2="15" stroke="#fcd535" stroke-width="3" />
            <circle cx="-20" cy="15" r="3" fill="#888" />
            <line x1="-20" y1="15" x2="-35" y2="25" stroke="#fcd535" stroke-width="2" />
            <circle cx="-35" cy="25" r="2" fill="#0ecb81" />
            <line x1="-35" y1="25" x2="-35" y2="45" stroke="#0ecb81" stroke-width="1.5" opacity="0.8" />
          </g>

          <!-- Laser Scanner -->
          <line x1="10" y1="0" x2="10" y2="60" stroke="#fcd535" stroke-width="1.5" opacity="0.6" class="laser-scanner" />

          <!-- LEDs -->
          <circle cx="100" cy="10" r="1.5" fill="#fcd535" class="status-led-1" />
          <circle cx="200" cy="15" r="1.5" fill="#fcd535" class="status-led-2" />
          <circle cx="280" cy="8" r="1.5" fill="#fcd535" class="status-led-3" />

          <!-- Particles -->
          <circle cx="80" cy="30" r="1" fill="#fff" opacity="0.3" class="particle-1" />
          <circle cx="160" cy="20" r="1" fill="#fcd535" opacity="0.4" class="particle-2" />
          <circle cx="240" cy="35" r="1.5" fill="#fff" opacity="0.2" class="particle-3" />
          <circle cx="350" cy="25" r="1" fill="#fcd535" opacity="0.3" class="particle-4" />
        </svg>
      `;

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, "image/svg+xml");
      const svg = doc.querySelector("svg") as unknown as SVGElement;
      container.insertBefore(svg, container.firstChild);
      svgEl = svg;

      // Event listeners
      emailInput.addEventListener("focus", handleFocus);
      emailInput.addEventListener("blur", handleBlur);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return true;
    };

    // Watch for mount
    const observer = new MutationObserver(() => {
      if (enhance()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial run
    enhance();

    return () => {
      observer.disconnect();
      if (inputEl) {
        inputEl.removeEventListener("focus", handleFocus);
        inputEl.removeEventListener("blur", handleBlur);
      }
      if (containerEl) {
        containerEl.removeEventListener("mousemove", handleMouseMove);
        containerEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-[#0b0e11] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background styling elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[150px]" />

      <style>{`
        @keyframes conveyor {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -20; }
        }
        @keyframes arm1 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes arm2 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-10deg); }
        }
        @keyframes laser-sweep {
          0% { transform: translateX(0px); }
          50% { transform: translateX(380px); }
          100% { transform: translateX(0px); }
        }
        @keyframes led-blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes particle-drift {
          0% { transform: translate(0, 0); opacity: 0.1; }
          50% { transform: translate(8px, -5px); opacity: 0.5; }
          100% { transform: translate(15px, -12px); opacity: 0; }
        }

        .conveyor-belt {
          animation: conveyor 2s linear infinite;
        }
        .robotic-arm-1 {
          transform-origin: 40px 15px;
          animation: arm1 5s ease-in-out infinite;
        }
        .robotic-arm-2 {
          transform-origin: 320px 10px;
          animation: arm2 6s ease-in-out infinite;
        }
        .laser-scanner {
          animation: laser-sweep 8s ease-in-out infinite;
        }
        .status-led-1 {
          animation: led-blink 1s infinite;
        }
        .status-led-2 {
          animation: led-blink 1.5s infinite;
        }
        .status-led-3 {
          animation: led-blink 1.2s infinite;
        }
        .particle-1 {
          animation: particle-drift 4s linear infinite;
        }
        .particle-2 {
          animation: particle-drift 5s linear infinite 1s;
        }
        .particle-3 {
          animation: particle-drift 6s linear infinite 2s;
        }
        .particle-4 {
          animation: particle-drift 4.5s linear infinite 0.5s;
        }
      `}</style>

      <div className="relative z-10 w-full max-w-[450px]">
        <div className="p-6 rounded-2xl bg-[#0e1218]/90 border border-[#2b3139] shadow-2xl backdrop-blur-md">
          {/* Tab Selector */}
          <div className="flex bg-[#0b0e11] p-1 rounded-xl border border-[#1f2d44] mb-6">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "email"
                  ? "bg-[#1e2329] text-white shadow-sm border border-[#2b3139]"
                  : "text-[#848e9c] hover:text-white bg-transparent border border-transparent"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Corporate Email
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "phone"
                  ? "bg-[#fcd535] text-black shadow-sm"
                  : "text-[#848e9c] hover:text-white bg-transparent border border-transparent"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Phone SMS OTP
            </button>
          </div>

          {/* Render Active Tab */}
          <div className="transition-all duration-300">
            {activeTab === "email" ? (
              <div className="flex justify-center cl-override-wrapper">
                <SignIn path="/login" />
              </div>
            ) : (
              <PhoneSignUp />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
