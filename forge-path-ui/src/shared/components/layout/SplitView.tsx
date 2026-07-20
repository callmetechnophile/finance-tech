"use client";
import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/shared/utils/cn";

interface SplitViewProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minLeft?: number;
  maxLeft?: number;
  direction?: "horizontal" | "vertical";
  className?: string;
  resizable?: boolean;
}

export function SplitView({
  left,
  right,
  defaultLeftWidth = 50,
  minLeft = 20,
  maxLeft = 80,
  direction = "horizontal",
  className,
  resizable = true,
}: SplitViewProps) {
  const [leftSize, setLeftSize] = useState(defaultLeftWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct =
        direction === "horizontal"
          ? ((e.clientX - rect.left) / rect.width) * 100
          : ((e.clientY - rect.top) / rect.height) * 100;
      setLeftSize(Math.min(maxLeft, Math.max(minLeft, pct)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [direction, minLeft, maxLeft]);

  const isHorizontal = direction === "horizontal";

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex w-full h-full min-h-0 overflow-hidden",
        isHorizontal ? "flex-row" : "flex-col",
        className
      )}
    >
      <div
        style={{ [isHorizontal ? "width" : "height"]: `${leftSize}%` }}
        className="h-full flex flex-col min-h-0 overflow-hidden shrink-0"
      >
        {left}
      </div>

      {resizable && (
        <div
          role="separator"
          aria-orientation={isHorizontal ? "vertical" : "horizontal"}
          aria-label="Resize panel"
          tabIndex={0}
          onMouseDown={handleMouseDown}
          className={cn(
            "flex-shrink-0 bg-[#2a2a2a] transition-colors hover:bg-[#faff69]/40 active:bg-[#faff69]/60",
            isHorizontal ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize"
          )}
        />
      )}

      <div className="flex-1 h-full flex flex-col min-h-0 overflow-hidden">{right}</div>
    </div>
  );
}
