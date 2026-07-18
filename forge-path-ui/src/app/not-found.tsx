import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="max-w-md w-full p-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-center space-y-6">
        <div className="w-12 h-12 rounded-md bg-[#faff69]/10 border border-[#faff69]/20 flex items-center justify-center mx-auto text-[#faff69] font-bold text-xl">
          ?
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Workspace Not Found</h1>
          <p className="text-xs text-[#cccccc]">
            The requested module route does not exist or has been archived.
          </p>
        </div>
        <Link
          href="/"
          className="block w-full py-2 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-bold rounded-md transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
