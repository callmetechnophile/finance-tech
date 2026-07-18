export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-[#0a0a0a]">
      <div className="max-w-md w-full p-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-center space-y-6">
        <div className="w-12 h-12 rounded-md bg-[#faff69]/10 border border-[#faff69]/20 flex items-center justify-center mx-auto text-[#faff69] font-bold text-xl">
          FP
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">FORGE-PATH</h1>
          <p className="text-xs text-[#cccccc]">
            AI Financial Operating System Workspace Foundation
          </p>
        </div>
        <div className="pt-4 border-t border-[#2a2a2a]">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/25">
            Milestone 1 Ready
          </span>
        </div>
      </div>
    </main>
  );
}
