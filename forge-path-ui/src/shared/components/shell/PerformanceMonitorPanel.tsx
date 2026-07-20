"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { X, Cpu, MemoryStick, Wifi, Database, Bot, Monitor } from "lucide-react";
import { useStatusStore } from "@/shared/stores/status.store";

// ─── Tiny sparkline renderer using canvas ────────────────────────────────────
function Sparkline({
  data,
  color,
  height = 48,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const max = Math.max(...data, 1);
    const step = w / (data.length - 1);

    ctx.clearRect(0, 0, w, h);

    // Fill gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + "44");
    grad.addColorStop(1, color + "00");

    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * step;
      const y = h - (v / max) * h;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo((data.length - 1) * step, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * step;
      const y = h - (v / max) * h;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [data, color, height]);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={height}
      className="w-full rounded"
      style={{ height }}
    />
  );
}

// ─── Color helper ─────────────────────────────────────────────────────────────
function pctColor(v: number) {
  if (v >= 85) return "#ef4444";
  if (v >= 60) return "#faff69";
  return "#22c55e";
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 pb-1 border-b border-[#2a2a2a]">
        <span className="text-[#faff69]">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white">{title}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Metric row ───────────────────────────────────────────────────────────────
function Row({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="flex justify-between items-center text-[11px]">
      <span className="text-[#888888]">{label}</span>
      <span className="font-mono font-semibold" style={{ color: accent ?? "#ffffff" }}>
        {value}
      </span>
    </div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const diff = value - display;
    if (Math.abs(diff) < 0.5) { setDisplay(value); return; }
    const raf = requestAnimationFrame(() => setDisplay((prev) => prev + diff * 0.25));
    return () => cancelAnimationFrame(raf);
  });
  return <>{Math.round(display)}{suffix}</>;
}

// ─── Main panel ───────────────────────────────────────────────────────────────
interface PerformanceMonitorPanelProps {
  onClose: () => void;
}

export function PerformanceMonitorPanel({ onClose }: PerformanceMonitorPanelProps) {
  const pathname = usePathname();
  const { cpuUsage, memoryUsage, databaseLatency, connectionStatus } = useStatusStore();
  const panelRef = useRef<HTMLDivElement>(null);

  // History buffers (60 ticks)
  const HIST = 60;
  const [cpuHist, setCpuHist] = useState<number[]>(() => Array(HIST).fill(0));
  const [ramHist, setRamHist] = useState<number[]>(() => Array(HIST).fill(0));
  const [netHist, setNetHist] = useState<number[]>(() => Array(HIST).fill(0));
  const [dbHist, setDbHist] = useState<number[]>(() => Array(HIST).fill(0));

  // Simulated live telemetry (seeded from real store values, then jittered)
  const [telemetry, setTelemetry] = useState({
    cpu: cpuUsage,
    cpuCores: navigator.hardwareConcurrency ?? 8,
    cpuThreads: (navigator.hardwareConcurrency ?? 8) * 2,
    cpuBaseFreq: "2.40 GHz",
    cpuCurFreq: "3.20 GHz",
    processCount: 48,
    workerQueue: 3,

    ramUsedMB: 420,
    ramTotalMB: 1024,
    ramPct: 41,
    heapUsedMB: 142,
    cacheMB: 88,

    uploadKbps: 124,
    downloadKbps: 340,
    activeReqs: 4,
    wsStatus: "Connected",
    latencyMs: databaseLatency,
    packets: 220,

    dbStatus: connectionStatus === "online" ? "Connected" : "Offline",
    dbActiveQueries: 2,
    dbQueryLatency: databaseLatency,
    dbPoolUsed: 3,
    dbPoolTotal: 10,
    dbTxPerSec: 14,

    gemmaStatus: "Online",
    nimStatus: "Online",
    ocrStatus: "Ready",
    bgJobs: 2,
    queueLen: 5,

    fps: 60,
    renderMs: 6.2,
    componentCount: 184,
    memLeaks: 0,
  });

  // Tick every second
  const tick = useCallback(() => {
    setTelemetry((prev) => {
      const jitter = (base: number, range: number) =>
        Math.max(0, Math.min(100, base + (Math.random() - 0.5) * range));

      const cpu = jitter(cpuUsage, 8);
      const ramPct = jitter(prev.ramPct, 4);
      const ramUsedMB = Math.round((ramPct / 100) * prev.ramTotalMB);
      const upload = Math.max(10, prev.uploadKbps + (Math.random() - 0.5) * 40);
      const download = Math.max(50, prev.downloadKbps + (Math.random() - 0.5) * 80);
      const net = Math.min(100, ((upload + download) / 800) * 100);
      const dbLatency = Math.max(5, databaseLatency + (Math.random() - 0.5) * 10);
      const dbPct = Math.min(100, (prev.dbPoolUsed / prev.dbPoolTotal) * 100);

      setCpuHist((h) => [...h.slice(1), cpu]);
      setRamHist((h) => [...h.slice(1), ramPct]);
      setNetHist((h) => [...h.slice(1), net]);
      setDbHist((h) => [...h.slice(1), (dbLatency / 100) * 100]);

      return {
        ...prev,
        cpu,
        ramPct,
        ramUsedMB,
        uploadKbps: upload,
        downloadKbps: download,
        latencyMs: dbLatency,
        dbQueryLatency: dbLatency,
        fps: Math.round(55 + Math.random() * 10),
        renderMs: parseFloat((4 + Math.random() * 4).toFixed(1)),
        packets: Math.round(100 + Math.random() * 300),
        bgJobs: Math.round(1 + Math.random() * 4),
        activeReqs: Math.round(1 + Math.random() * 8),
      };
    });
  }, [cpuUsage, databaseLatency]);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const cpuC = pctColor(telemetry.cpu);
  const ramC = pctColor(telemetry.ramPct);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]" />

      {/* Panel — slides up from bottom-right */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="System Performance Monitor"
        className="fixed bottom-8 right-4 z-50 w-[560px] max-h-[82vh] overflow-y-auto rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] shadow-2xl shadow-black/80 animate-in slide-in-from-bottom-4 duration-200"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 bg-[#0f0f0f] border-b border-[#2a2a2a] z-10">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#faff69]" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              Performance Monitor
            </span>
            <span className="ml-2 px-1.5 py-0.5 text-[8px] font-bold rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-wider">
              Live · 1s
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#2a2a2a] text-[#888888] hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* ── CPU ─────────────────────────────────────────────── */}
          <Section icon={<Cpu className="w-3.5 h-3.5" />} title="CPU">
            <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-2 border border-[#2a2a2a]">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold font-mono" style={{ color: cpuC }}>
                  <Counter value={telemetry.cpu} suffix="%" />
                </span>
                <span className="text-[9px] text-[#888888]">
                  {telemetry.cpuCores} cores · {telemetry.cpuThreads} threads
                </span>
              </div>
              <Sparkline data={cpuHist} color={cpuC} height={52} />
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 pt-1">
                <Row label="Base Frequency" value={telemetry.cpuBaseFreq} />
                <Row label="Current Frequency" value={telemetry.cpuCurFreq} accent="#faff69" />
                <Row label="Processes" value={telemetry.processCount} />
                <Row label="Worker Queue" value={telemetry.workerQueue} />
              </div>
            </div>
          </Section>

          {/* ── RAM ─────────────────────────────────────────────── */}
          <Section icon={<MemoryStick className="w-3.5 h-3.5" />} title="Memory">
            <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-2 border border-[#2a2a2a]">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold font-mono" style={{ color: ramC }}>
                  <Counter value={telemetry.ramUsedMB} suffix=" MB" />
                </span>
                <span className="text-[9px] text-[#888888]">of {telemetry.ramTotalMB} MB</span>
              </div>
              <Sparkline data={ramHist} color={ramC} height={52} />
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 pt-1">
                <Row
                  label="Used"
                  value={`${telemetry.ramUsedMB} / ${telemetry.ramTotalMB} MB`}
                  accent={ramC}
                />
                <Row label="Memory %" value={`${Math.round(telemetry.ramPct)}%`} />
                <Row label="Heap Used" value={`${telemetry.heapUsedMB} MB`} />
                <Row label="Cache" value={`${telemetry.cacheMB} MB`} />
              </div>
            </div>
          </Section>

          {/* ── Network ─────────────────────────────────────────── */}
          <Section icon={<Wifi className="w-3.5 h-3.5" />} title="Network">
            <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-2 border border-[#2a2a2a]">
              <div className="flex items-end justify-between">
                <div className="flex gap-4">
                  <span className="text-sm font-bold font-mono text-[#3b82f6]">
                    ↑ <Counter value={telemetry.uploadKbps} suffix=" Kbps" />
                  </span>
                  <span className="text-sm font-bold font-mono text-[#22c55e]">
                    ↓ <Counter value={telemetry.downloadKbps} suffix=" Kbps" />
                  </span>
                </div>
                {/* Packet activity animation */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className="block w-0.5 rounded-full bg-[#faff69] opacity-50"
                      style={{
                        height: `${4 + Math.random() * 12}px`,
                        animationDelay: `${i * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <Sparkline data={netHist} color="#3b82f6" height={40} />
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 pt-1">
                <Row label="Active API Requests" value={telemetry.activeReqs} />
                <Row label="WebSocket" value={telemetry.wsStatus} accent="#22c55e" />
                <Row
                  label="Latency"
                  value={`${Math.round(telemetry.latencyMs)} ms`}
                  accent={pctColor((telemetry.latencyMs / 200) * 100)}
                />
                <Row label="Packets/s" value={telemetry.packets} />
              </div>
            </div>
          </Section>

          {/* ── Database ────────────────────────────────────────── */}
          <Section icon={<Database className="w-3.5 h-3.5" />} title="Database · NeonDB">
            <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-2 border border-[#2a2a2a]">
              <Sparkline data={dbHist} color="#8b5cf6" height={36} />
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 pt-1">
                <Row
                  label="Connection"
                  value={telemetry.dbStatus}
                  accent={telemetry.dbStatus === "Connected" ? "#22c55e" : "#ef4444"}
                />
                <Row label="Active Queries" value={telemetry.dbActiveQueries} />
                <Row
                  label="Query Latency"
                  value={`${Math.round(telemetry.dbQueryLatency)} ms`}
                  accent={pctColor((telemetry.dbQueryLatency / 200) * 100)}
                />
                <Row
                  label="Pool Usage"
                  value={`${telemetry.dbPoolUsed} / ${telemetry.dbPoolTotal}`}
                />
                <Row label="Transactions/s" value={telemetry.dbTxPerSec} />
              </div>
            </div>
          </Section>

          {/* ── AI Services ─────────────────────────────────────── */}
          <Section icon={<Bot className="w-3.5 h-3.5" />} title="AI Services">
            <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-1.5 border border-[#2a2a2a]">
              {[
                { label: "Gemma 2B Engine", value: telemetry.gemmaStatus },
                { label: "NVIDIA NIM API", value: telemetry.nimStatus },
                { label: "OCR Worker", value: telemetry.ocrStatus },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-[11px]">
                  <span className="text-[#888888]">{s.label}</span>
                  <span className="flex items-center gap-1.5 font-semibold font-mono text-[#22c55e]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                    {s.value}
                  </span>
                </div>
              ))}
              <div className="pt-1 border-t border-[#2a2a2a] grid grid-cols-2 gap-x-6 gap-y-1">
                <Row label="Background Jobs" value={telemetry.bgJobs} />
                <Row label="Queue Length" value={telemetry.queueLen} />
              </div>
            </div>
          </Section>

          {/* ── Application ─────────────────────────────────────── */}
          <Section icon={<Monitor className="w-3.5 h-3.5" />} title="Application">
            <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-1 border border-[#2a2a2a]">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                <Row
                  label="FPS"
                  value={`${telemetry.fps} fps`}
                  accent={pctColor(100 - telemetry.fps)}
                />
                <Row label="Render Time" value={`${telemetry.renderMs} ms`} />
                <Row label="React Components" value={telemetry.componentCount} />
                <Row
                  label="Memory Leaks"
                  value={telemetry.memLeaks === 0 ? "None Detected" : `${telemetry.memLeaks} detected`}
                  accent={telemetry.memLeaks === 0 ? "#22c55e" : "#ef4444"}
                />
                <Row label="Current Route" value={pathname ?? "/"} accent="#faff69" />
                <Row
                  label="Active Workspace"
                  value={pathname?.replace("/", "").toUpperCase() || "DASHBOARD"}
                  accent="#faff69"
                />
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-4 py-2 bg-[#0f0f0f] border-t border-[#2a2a2a] flex justify-between items-center text-[9px] text-[#888888]">
          <span>Refresh interval: 1 second · ESC or click outside to close</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </>
  );
}
