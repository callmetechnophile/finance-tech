"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export default function Developers() {
  const developers = [
    {
      name: "Ayushman Patro",
      role: "Founder • AI & Full Stack Engineer",
      description: "Building enterprise AI systems, financial intelligence platforms, multi-agent architectures, cloud-native applications, and semiconductor research.",
      avatar: "/avatar_ayushman.jpg",
      linkedin: "https://www.linkedin.com/in/callmetechnophile/",
    },
    {
      name: "Shriram Upadhya",
      role: "Backend & Systems Engineer",
      description: "Focused on backend engineering, scalable architectures, distributed systems, cloud infrastructure, and enterprise software development.",
      avatar: "/avatar_shriram.jpg",
      linkedin: "https://www.linkedin.com/in/shriram-upadhya-93b78a357/",
    },
  ];

  return (
    <section className="py-24 border-b border-[#2b3139] bg-[#0b0e11] relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fcd535]/2 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2329] border border-[#2b3139]">
            <span className="text-[9px] font-extrabold text-[#fcd535] uppercase tracking-widest">
              ⭐ RATE THE DEVELOPERS
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Meet the Developers Behind FORGE-PATH
          </h2>
          <p className="text-xs md:text-sm text-[#848e9c] leading-relaxed">
            FORGE-PATH was designed and engineered by two passionate developers focused on building next-generation AI-powered financial operating systems.
          </p>
        </div>

        {/* Developers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
          {developers.map((dev) => (
            <div
              key={dev.name}
              className="group bg-[#181a20]/60 backdrop-blur-md border border-[#2b3139] p-8 rounded-[24px] md:rounded-[32px] flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#fcd535] hover:shadow-xl hover:shadow-[#fcd535]/5 relative overflow-hidden"
            >
              {/* Profile Image (Flat Vector Doodle Avatar) */}
              <div className="w-24 h-24 rounded-full border border-[#2b3139] group-hover:border-[#fcd535] overflow-hidden mb-5 transition-colors duration-300 relative flex items-center justify-center bg-[#1e2329]">
                <Image
                  src={dev.avatar}
                  alt={dev.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Developer Metadata */}
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#fcd535] transition-colors">
                {dev.name}
              </h3>
              <span className="text-[10px] text-[#fcd535] font-semibold uppercase tracking-wider mb-4">
                {dev.role}
              </span>

              {/* Static 5-Star Rating */}
              <div className="flex flex-col items-center gap-0.5 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#fcd535] text-[#fcd535]"
                    />
                  ))}
                </div>
                <span className="text-[9px] text-[#848e9c] font-bold uppercase tracking-widest mt-1">
                  Community Rated
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#848e9c] leading-relaxed mb-6 max-w-xs flex-grow">
                {dev.description}
              </p>

              {/* CTA Link Button */}
              <a
                href={dev.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 h-9 px-5 rounded-md border border-[#2b3139] hover:border-[#fcd535] group-hover:bg-[#fcd535] group-hover:text-[#181a20] text-white text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 shadow-sm shadow-black/30 group-hover:shadow-md group-hover:shadow-[#fcd535]/10 cursor-pointer"
              >
                View LinkedIn →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
