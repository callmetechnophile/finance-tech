export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border-2 border-[#faff69]/20 border-t-[#faff69] rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#cccccc] font-medium tracking-wide">
          Loading Financial Workspace...
        </p>
      </div>
    </div>
  );
}
