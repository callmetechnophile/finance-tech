"use client";

export default function Technology() {
  const techStack = [
    { name: "Next.js", desc: "Core Web App Framework" },
    { name: "FastAPI", desc: "Backend API Core" },
    { name: "Google AI", desc: "Studio Orchestration" },
    { name: "Gemma 4", desc: "Cognitive Engine" },
    { name: "Supabase", desc: "Document Buckets" },
    { name: "Neon DB", desc: "Serverless Postgres" },
    { name: "AuraDB", desc: "Graph Database" },
    { name: "Clerk Auth", desc: "Identity Gateway" },
    { name: "Docker", desc: "Containerized Nodes" },
    { name: "Vercel", desc: "Edge Deployment" },
    { name: "ClickHouse", desc: "Analytics (Future)" },
    { name: "Redis", desc: "Cache & Queue (Future)" },
  ];

  return (
    <section className="py-20 border-b border-[#2b3139] bg-[#0b0e11]">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold text-[#707a8a] uppercase tracking-[0.2em]">Technology Stack</span>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Built with the Best</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {techStack.map((tech, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#1e2329]/60 border border-[#2b3139] text-center space-y-1.5">
              <span className="text-xs font-extrabold text-white block">{tech.name}</span>
              <span className="text-[9px] text-[#707a8a] block font-mono">{tech.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
