"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error Boundary Exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 my-6 rounded-2xl bg-[#111] border border-red-500/30 flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Application Runtime Exception</h3>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">
              {this.state.error?.message || "An unexpected error occurred in this workspace component."}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-xs font-bold text-black rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 fill-black" />
            Reload Workspace
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
