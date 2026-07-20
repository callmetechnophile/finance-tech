"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global App Error Boundary Caught Exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="p-8 rounded-2xl bg-[#111] border border-red-500/30 max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">System Exception Intercepted</h2>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            {error.message || "An unhandled client error occurred while rendering the workspace."}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full py-2.5 bg-[#faff69] hover:bg-[#e6eb52] text-xs font-bold text-black rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <RefreshCw className="w-4 h-4 fill-black" />
          Reset Workspace State
        </button>
      </div>
    </div>
  );
}
