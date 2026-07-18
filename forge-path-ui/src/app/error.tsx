"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Uncaught application error boundary exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="max-w-md w-full p-8 rounded-lg bg-[#1a1a1a] border border-[#ef4444]/20 text-center space-y-6">
        <div className="w-12 h-12 rounded-md bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center mx-auto text-[#ef4444] font-bold text-xl">
          !
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">System Exception Detected</h1>
          <p className="text-xs text-[#cccccc] leading-relaxed">
            The workspace encountered an unexpected runtime boundary error. Let's try to restore the session.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full py-2 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-bold rounded-md transition-colors"
        >
          Restore Workspace
        </button>
      </div>
    </div>
  );
}
