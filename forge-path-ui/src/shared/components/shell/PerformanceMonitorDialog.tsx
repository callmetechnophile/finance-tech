"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { usePathname } from "next/navigation";
import { useStatusStore } from "@/shared/stores/status.store";
import {
  X,
  Maximize2,
  Minimize2,
  LayoutDashboard,
  Cpu,
  MemoryStick,
  Wifi,
  Database,
  Layers,
  Bot,
  HardDrive,
  ScrollText,
  HeartPulse,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tick {
  t: number; // index
  cpu: number;
  ram: number;
  net: number;
  db: number;
  fps: number;
}

interface Telemetry {
  cpu: number;
  cpuCores: number;
  cpuThreads: number;
  cpuFreqBase: string;
  cpuFreqCur: string;
  processes: number;
  workerQueue: number;

  ramUsedMB: number;
  ramTotalMB: number;
  ramPct: number;
  heapMB: number;
  cacheMB: number;

  uploadKbps: number;
  downloadKbps: number;
  apiRps: number;
  activeSockets: number;
  netLatency: number;

  dbStatus: "Connected" | "Degraded" | "Offline";
  dbConns: number;
  dbQueryLatency: number;
  dbTx: number;

  ocrQueue: number;
  aiQueue: number;
  bgJobs: number;
  failedJobs: number;

  gemmaStatus: string;
  nimStatus: string;
  embeddingStatus: string;
  aiLatency: number;

  storageTotalGB: number;
  storageUsedGB: number;
  storageOps: number;

  fps: number;
  renderMs: number;
  componentCount: number;
  memLeaks: number;
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function loadColor(v: number, invert = false): string {
  const pct = invert ? 100 - v : v;
  if (pct >= 85) return "#ef4444";
  if (pct >= 60) return "#faff69";
  return "#22c55e";
}

function StatusDot({ value, invert = false }: { value: number; invert?: boolean }) {
  const c = loadColor(value, invert);
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
      style={{ backgroundColor: c }}
    />
  );
}

// ─── Tooltip style ────────────────────────────────────────────────────────────

const chartTooltipStyle = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: 6,
  fontSize: 10,
  color: "#ffffff",
};

// ─── Metric card ─────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  accent,
  children,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#888888] uppercase tracking-widest">
          {label}
        </span>
        {sub && <span className="text-[9px] text-[#555555]">{sub}</span>}
      </div>
      <span
        className="text-xl font-bold font-mono leading-none"
        style={{ color: accent ?? "#ffffff" }}
      >
        {value}
      </span>
      {children}
    </div>
  );
}

// ─── Row stat ─────────────────────────────────────────────────────────────────

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between text-[11px] py-1 border-b border-[#1e1e1e] last:border-0">
      <span className="text-[#666666]">{label}</span>
      <span className="font-mono font-semibold" style={{ color: accent ?? "#cccccc" }}>
        {value}
      </span>
    </div>
  );
}

// ─── Section title ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#faff69] mb-3">
      {children}
    </h3>
  );
}

// ─── Circular progress ────────────────────────────────────────────────────────

function CircularGauge({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const data = [
    { name: label, value, fill: color },
    { name: "rest", value: 100 - value, fill: "#1e1e1e" },
  ];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <RadialBarChart
          width={64}
          height={64}
          cx={32}
          cy={32}
          innerRadius={22}
          outerRadius={30}
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={8}
        >
          <RadialBar dataKey="value" isAnimationActive={false} />
        </RadialBarChart>
        <span
          className="absolute inset-0 flex items-center justify-center text-[11px] font-bold font-mono"
          style={{ color }}
        >
          {Math.round(value)}%
        </span>
      </div>
      <span className="text-[9px] text-[#888888]">{label}</span>
    </div>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { id: "cpu", label: "CPU", icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: "memory", label: "Memory", icon: <MemoryStick className="w-3.5 h-3.5" /> },
  { id: "network", label: "Network", icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: "database", label: "Database", icon: <Database className="w-3.5 h-3.5" /> },
  { id: "workers", label: "Workers", icon: <Layers className="w-3.5 h-3.5" /> },
  { id: "ai", label: "AI Services", icon: <Bot className="w-3.5 h-3.5" /> },
  { id: "storage", label: "Storage", icon: <HardDrive className="w-3.5 h-3.5" /> },
  { id: "logs", label: "Logs", icon: <ScrollText className="w-3.5 h-3.5" /> },
  { id: "health", label: "System Health", icon: <HeartPulse className="w-3.5 h-3.5" /> },
];

// ─── Fake log lines ────────────────────────────────────────────────────────────

const LOG_POOL = [
  "[INFO]  neondb: query executed in 18ms",
  "[INFO]  ocr-worker: document processed",
  "[INFO]  gemma: inference completed 220ms",
  "[DEBUG] scheduler: tick 1s fired",
  "[INFO]  auth: token refreshed",
  "[INFO]  api: GET /v1/dashboard 200 22ms",
  "[WARN]  memory: heap approaching 80%",
  "[INFO]  nim: embedding generated",
  "[DEBUG] zustand: store hydrated",
  "[INFO]  forecast: model updated",
  "[INFO]  api: POST /v1/documents 201 44ms",
  "[INFO]  collections: sync complete",
];

// ─── Main dialog ──────────────────────────────────────────────────────────────

interface PerformanceMonitorDialogProps {
  onClose: () => void;
}

export function PerformanceMonitorDialog({ onClose }: PerformanceMonitorDialogProps) {
  const pathname = usePathname();
  const { cpuUsage, memoryUsage, databaseLatency, connectionStatus } = useStatusStore();

  const [activeSection, setActiveSection] = useState("overview");
  const [maximized, setMaximized] = useState(false);
  const [tick, setTick] = useState(0);
  const [history, setHistory] = useState<Tick[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      t: i,
      cpu: 5 + Math.random() * 15,
      ram: 35 + Math.random() * 10,
      net: Math.random() * 20,
      db: Math.random() * 30,
      fps: 55 + Math.random() * 10,
    }))
  );
  const [logs, setLogs] = useState<string[]>(() =>
    Array.from({ length: 12 }, () => LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)])
  );
  const [tel, setTel] = useState<Telemetry>({
    cpu: cpuUsage,
    cpuCores: typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? 8 : 8,
    cpuThreads: typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 8) * 2 : 16,
    cpuFreqBase: "2.40 GHz",
    cpuFreqCur: "3.20 GHz",
    processes: 52,
    workerQueue: 3,
    ramUsedMB: 420,
    ramTotalMB: 1024,
    ramPct: 41,
    heapMB: 142,
    cacheMB: 88,
    uploadKbps: 124,
    downloadKbps: 340,
    apiRps: 8,
    activeSockets: 2,
    netLatency: databaseLatency,
    dbStatus: connectionStatus === "online" ? "Connected" : "Offline",
    dbConns: 4,
    dbQueryLatency: databaseLatency,
    dbTx: 14,
    ocrQueue: 2,
    aiQueue: 1,
    bgJobs: 3,
    failedJobs: 0,
    gemmaStatus: "Online",
    nimStatus: "Online",
    embeddingStatus: "Ready",
    aiLatency: 220,
    storageTotalGB: 10,
    storageUsedGB: 1.2,
    storageOps: 44,
    fps: 60,
    renderMs: 5.8,
    componentCount: 184,
    memLeaks: 0,
  });

  const dialogRef = useRef<HTMLDivElement>(null);

  // Tick every 1 second
  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setTel((prev) => {
        const jit = (base: number, range: number, lo = 0, hi = 100) =>
          Math.max(lo, Math.min(hi, base + (Math.random() - 0.5) * range));

        const cpu = jit(cpuUsage, 10);
        const ramPct = jit(prev.ramPct, 5);
        const upload = jit(prev.uploadKbps, 60, 20, 1000);
        const download = jit(prev.downloadKbps, 100, 50, 2000);
        const net = Math.min(100, ((upload + download) / 3000) * 100);
        const dbLat = jit(databaseLatency, 12, 5, 300);

        setHistory((h) => {
          const next = [...h.slice(1), {
            t: h[h.length - 1].t + 1,
            cpu,
            ram: ramPct,
            net,
            db: Math.min(100, (dbLat / 200) * 100),
            fps: jit(prev.fps, 5, 30, 60),
          }];
          return next;
        });

        // Occasionally append a log line
        if (Math.random() < 0.6) {
          const line = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
          const ts = new Date().toLocaleTimeString();
          setLogs((l) => [`${ts} ${line}`, ...l.slice(0, 49)]);
        }

        return {
          ...prev,
          cpu,
          ramPct,
          ramUsedMB: Math.round((ramPct / 100) * prev.ramTotalMB),
          uploadKbps: upload,
          downloadKbps: download,
          netLatency: dbLat,
          dbQueryLatency: dbLat,
          dbStatus: connectionStatus === "online" ? "Connected" : "Offline",
          fps: jit(prev.fps, 5, 30, 60),
          renderMs: parseFloat(jit(prev.renderMs, 2, 2, 20).toFixed(1)),
          apiRps: Math.round(jit(prev.apiRps, 4, 1, 50)),
          bgJobs: Math.round(jit(prev.bgJobs, 2, 0, 10)),
          aiLatency: Math.round(jit(prev.aiLatency, 40, 80, 600)),
          storageOps: Math.round(jit(prev.storageOps, 20, 5, 200)),
        };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [cpuUsage, databaseLatency, connectionStatus]);

  // ESC close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Outside click close
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", h), 80);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); };
  }, [onClose]);

  const serverTime = useMemo(() => new Date().toUTCString(), [tick]); // eslint-disable-line

  // Chart common props
  const areaProps = {
    isAnimationActive: false as const,
    dot: false as const,
    strokeWidth: 1.5,
  };

  // ── Section renderers ──────────────────────────────────────────────────────

  const renderOverview = () => (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 content-start">
      {/* CPU gauge + mini chart */}
      <MetricCard
        label="CPU Usage"
        value={`${Math.round(tel.cpu)}%`}
        accent={loadColor(tel.cpu)}
      >
        <ResponsiveContainer width="100%" height={48}>
          <AreaChart data={history.slice(-30)}>
            <defs>
              <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={loadColor(tel.cpu)} stopOpacity={0.3} />
                <stop offset="100%" stopColor={loadColor(tel.cpu)} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area dataKey="cpu" stroke={loadColor(tel.cpu)} fill="url(#cpuGrad)" {...areaProps} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="text-[9px] text-[#666666] space-y-0.5">
          <div className="flex justify-between"><span>Cores</span><span className="text-white">{tel.cpuCores}</span></div>
          <div className="flex justify-between"><span>Threads</span><span className="text-white">{tel.cpuThreads}</span></div>
        </div>
      </MetricCard>

      {/* RAM */}
      <MetricCard
        label="Memory"
        value={`${tel.ramUsedMB} MB`}
        sub={`of ${tel.ramTotalMB} MB`}
        accent={loadColor(tel.ramPct)}
      >
        <ResponsiveContainer width="100%" height={48}>
          <AreaChart data={history.slice(-30)}>
            <defs>
              <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={loadColor(tel.ramPct)} stopOpacity={0.3} />
                <stop offset="100%" stopColor={loadColor(tel.ramPct)} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area dataKey="ram" stroke={loadColor(tel.ramPct)} fill="url(#ramGrad)" {...areaProps} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="text-[9px] text-[#666666] space-y-0.5">
          <div className="flex justify-between"><span>Heap</span><span className="text-white">{tel.heapMB} MB</span></div>
          <div className="flex justify-between"><span>Cache</span><span className="text-white">{tel.cacheMB} MB</span></div>
        </div>
      </MetricCard>

      {/* Network */}
      <MetricCard
        label="Network"
        value={`${Math.round(tel.downloadKbps)} Kbps`}
        accent="#3b82f6"
      >
        <ResponsiveContainer width="100%" height={48}>
          <AreaChart data={history.slice(-30)}>
            <defs>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area dataKey="net" stroke="#3b82f6" fill="url(#netGrad)" {...areaProps} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="text-[9px] text-[#666666] space-y-0.5">
          <div className="flex justify-between"><span>↑ Upload</span><span className="text-[#3b82f6]">{Math.round(tel.uploadKbps)} Kbps</span></div>
          <div className="flex justify-between"><span>API req/s</span><span className="text-white">{tel.apiRps}</span></div>
        </div>
      </MetricCard>

      {/* Database */}
      <MetricCard
        label="Database"
        value={tel.dbStatus}
        accent={tel.dbStatus === "Connected" ? "#22c55e" : "#ef4444"}
      >
        <ResponsiveContainer width="100%" height={48}>
          <AreaChart data={history.slice(-30)}>
            <defs>
              <linearGradient id="dbGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area dataKey="db" stroke="#8b5cf6" fill="url(#dbGrad)" {...areaProps} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="text-[9px] text-[#666666] space-y-0.5">
          <div className="flex justify-between"><span>Latency</span><span className="text-white">{Math.round(tel.dbQueryLatency)}ms</span></div>
          <div className="flex justify-between"><span>Conns</span><span className="text-white">{tel.dbConns}</span></div>
        </div>
      </MetricCard>

      {/* Workers */}
      <MetricCard label="Workers" value={`${tel.bgJobs} jobs`} accent="#faff69">
        <div className="text-[9px] text-[#666666] space-y-0.5">
          <div className="flex justify-between"><span>OCR Queue</span><span className="text-white">{tel.ocrQueue}</span></div>
          <div className="flex justify-between"><span>AI Queue</span><span className="text-white">{tel.aiQueue}</span></div>
          <div className="flex justify-between"><span>Failed</span><span className={tel.failedJobs > 0 ? "text-[#ef4444]" : "text-[#22c55e]"}>{tel.failedJobs}</span></div>
        </div>
      </MetricCard>

      {/* AI Services */}
      <MetricCard label="AI Services" value={`${tel.aiLatency}ms`} sub="avg latency" accent="#a78bfa">
        <div className="text-[9px] text-[#666666] space-y-0.5">
          {[
            { name: "Gemma 2B", val: tel.gemmaStatus },
            { name: "NVIDIA NIM", val: tel.nimStatus },
            { name: "Embeddings", val: tel.embeddingStatus },
          ].map((s) => (
            <div key={s.name} className="flex justify-between">
              <span>{s.name}</span>
              <span className="flex items-center gap-1 text-[#22c55e]">
                <StatusDot value={0} />
                {s.val}
              </span>
            </div>
          ))}
        </div>
      </MetricCard>

      {/* Storage */}
      <MetricCard
        label="Storage"
        value={`${tel.storageUsedGB} / ${tel.storageTotalGB} GB`}
        accent={loadColor((tel.storageUsedGB / tel.storageTotalGB) * 100)}
      >
        <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(tel.storageUsedGB / tel.storageTotalGB) * 100}%`,
              backgroundColor: loadColor((tel.storageUsedGB / tel.storageTotalGB) * 100),
            }}
          />
        </div>
        <div className="text-[9px] text-[#666666] mt-1">
          <div className="flex justify-between"><span>I/O Ops/s</span><span className="text-white">{tel.storageOps}</span></div>
        </div>
      </MetricCard>

      {/* Application */}
      <MetricCard label="Application" value={`${Math.round(tel.fps)} FPS`} accent={loadColor(100 - tel.fps, true)}>
        <div className="text-[9px] text-[#666666] space-y-0.5">
          <div className="flex justify-between"><span>Render</span><span className="text-white">{tel.renderMs}ms</span></div>
          <div className="flex justify-between"><span>Components</span><span className="text-white">{tel.componentCount}</span></div>
          <div className="flex justify-between"><span>Leaks</span><span className={tel.memLeaks > 0 ? "text-[#ef4444]" : "text-[#22c55e]"}>{tel.memLeaks === 0 ? "None" : tel.memLeaks}</span></div>
        </div>
      </MetricCard>
    </div>
  );

  const renderCpu = () => (
    <div className="space-y-4">
      <SectionTitle>CPU Utilization</SectionTitle>
      <div className="flex gap-4 items-start flex-wrap">
        <div className="flex gap-4">
          <CircularGauge value={tel.cpu} label="Load" color={loadColor(tel.cpu)} />
          <CircularGauge value={(tel.cpu / tel.cpuCores) * 100 / 2} label="Core Avg" color="#3b82f6" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="cpuFullGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={loadColor(tel.cpu)} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={loadColor(tel.cpu)} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${Math.round((v as number) ?? 0)}%`, "CPU"]} />
              <Area dataKey="cpu" stroke={loadColor(tel.cpu)} fill="url(#cpuFullGrad)" {...areaProps} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3 space-y-1">
          <Stat label="Base Frequency" value={tel.cpuFreqBase} />
          <Stat label="Current Frequency" value={tel.cpuFreqCur} accent="#faff69" />
          <Stat label="Physical Cores" value={tel.cpuCores} />
          <Stat label="Logical Threads" value={tel.cpuThreads} />
          <Stat label="Processes" value={tel.processes} />
          <Stat label="Worker Queue" value={tel.workerQueue} />
        </div>
        <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3">
          <SectionTitle>60s History</SectionTitle>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={history}>
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${Math.round((v as number) ?? 0)}%`]} />
              <Line dataKey="cpu" stroke={loadColor(tel.cpu)} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMemory = () => (
    <div className="space-y-4">
      <SectionTitle>Memory & Heap</SectionTitle>
      <div className="flex gap-4 items-start flex-wrap">
        <CircularGauge value={tel.ramPct} label="Used" color={loadColor(tel.ramPct)} />
        <div className="flex-1 min-w-[200px]">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="ramFullGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={loadColor(tel.ramPct)} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={loadColor(tel.ramPct)} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`${Math.round((v as number) ?? 0)}%`, "RAM"]} />
              <Area dataKey="ram" stroke={loadColor(tel.ramPct)} fill="url(#ramFullGrad)" {...areaProps} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3 space-y-1">
        <Stat label="Used" value={`${tel.ramUsedMB} MB`} accent={loadColor(tel.ramPct)} />
        <Stat label="Total" value={`${tel.ramTotalMB} MB`} />
        <Stat label="Usage %" value={`${Math.round(tel.ramPct)}%`} />
        <Stat label="Heap Used" value={`${tel.heapMB} MB`} />
        <Stat label="Cache" value={`${tel.cacheMB} MB`} />
        <Stat label="Leaks Detected" value={tel.memLeaks === 0 ? "None" : `${tel.memLeaks}`} accent={tel.memLeaks > 0 ? "#ef4444" : "#22c55e"} />
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-4">
      <SectionTitle>Network I/O</SectionTitle>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={history}>
          <defs>
            <linearGradient id="netGradFull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Area dataKey="net" stroke="#3b82f6" fill="url(#netGradFull)" {...areaProps} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3 space-y-1">
          <Stat label="↑ Upload" value={`${Math.round(tel.uploadKbps)} Kbps`} accent="#3b82f6" />
          <Stat label="↓ Download" value={`${Math.round(tel.downloadKbps)} Kbps`} accent="#22c55e" />
          <Stat label="API Requests/s" value={tel.apiRps} />
          <Stat label="Active WebSockets" value={tel.activeSockets} />
          <Stat label="Network Latency" value={`${Math.round(tel.netLatency)}ms`} accent={loadColor(tel.netLatency / 2)} />
        </div>
        <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3">
          <SectionTitle>Throughput</SectionTitle>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={history}>
              <XAxis dataKey="t" hide />
              <YAxis hide />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line dataKey="net" stroke="#3b82f6" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderDatabase = () => (
    <div className="space-y-4">
      <SectionTitle>NeonDB · Postgres</SectionTitle>
      <div className="flex gap-4 flex-wrap">
        <CircularGauge value={Math.min(100, (tel.dbQueryLatency / 200) * 100)} label="Latency" color="#8b5cf6" />
        <div className="flex-1 min-w-[200px]">
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="dbGradFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area dataKey="db" stroke="#8b5cf6" fill="url(#dbGradFull)" {...areaProps} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3 space-y-1">
        <Stat label="Status" value={tel.dbStatus} accent={tel.dbStatus === "Connected" ? "#22c55e" : "#ef4444"} />
        <Stat label="Active Connections" value={tel.dbConns} />
        <Stat label="Query Latency" value={`${Math.round(tel.dbQueryLatency)}ms`} accent={loadColor(tel.dbQueryLatency / 2)} />
        <Stat label="Running Transactions" value={tel.dbTx} />
      </div>
    </div>
  );

  const renderWorkers = () => (
    <div className="space-y-4">
      <SectionTitle>Worker Queues</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "OCR Queue", value: tel.ocrQueue, color: "#faff69" },
          { label: "AI Queue", value: tel.aiQueue, color: "#a78bfa" },
          { label: "Background Jobs", value: tel.bgJobs, color: "#3b82f6" },
          { label: "Failed Jobs", value: tel.failedJobs, color: tel.failedJobs > 0 ? "#ef4444" : "#22c55e" },
        ].map((w) => (
          <div key={w.label} className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-4 flex flex-col gap-2">
            <span className="text-[10px] text-[#888888] uppercase tracking-widest">{w.label}</span>
            <span className="text-3xl font-bold font-mono" style={{ color: w.color }}>
              {w.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-4">
      <SectionTitle>AI Infrastructure</SectionTitle>
      <div className="space-y-2">
        {[
          { name: "Gemma 2B Engine", status: tel.gemmaStatus, color: "#22c55e" },
          { name: "NVIDIA NIM API", status: tel.nimStatus, color: "#22c55e" },
          { name: "Embedding Service", status: tel.embeddingStatus, color: "#22c55e" },
        ].map((s) => (
          <div key={s.name} className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white">{s.name}</span>
            <span className="flex items-center gap-2 text-[11px] font-mono font-bold" style={{ color: s.color }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: s.color }} />
              {s.status}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3 space-y-1">
        <Stat label="Avg Response Latency" value={`${tel.aiLatency}ms`} accent={loadColor(tel.aiLatency / 6)} />
        <Stat label="AI Queue Depth" value={tel.aiQueue} />
        <Stat label="Background Jobs" value={tel.bgJobs} />
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="space-y-4">
      <SectionTitle>Storage</SectionTitle>
      <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-4 space-y-3">
        <div className="flex justify-between text-sm font-mono">
          <span className="text-[#888888]">Used</span>
          <span className="font-bold" style={{ color: loadColor((tel.storageUsedGB / tel.storageTotalGB) * 100) }}>
            {tel.storageUsedGB} / {tel.storageTotalGB} GB
          </span>
        </div>
        <div className="w-full h-3 bg-[#222] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(tel.storageUsedGB / tel.storageTotalGB) * 100}%`,
              background: `linear-gradient(90deg, ${loadColor((tel.storageUsedGB / tel.storageTotalGB) * 100)}, #faff69)`,
            }}
          />
        </div>
        <Stat label="I/O Operations/s" value={tel.storageOps} />
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-3">
      <SectionTitle>Application Logs · Live Tail</SectionTitle>
      <div className="bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] p-3 font-mono text-[10px] text-[#888888] h-72 overflow-y-auto space-y-0.5">
        {logs.map((line, i) => (
          <div
            key={i}
            className={`${
              line.includes("[WARN]")
                ? "text-[#faff69]"
                : line.includes("[ERROR]")
                ? "text-[#ef4444]"
                : "text-[#888888]"
            } hover:text-white transition-colors`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-4">
      <SectionTitle>System Health · All Services</SectionTitle>
      <div className="space-y-2">
        {[
          { name: "NeonDB", status: tel.dbStatus === "Connected", label: tel.dbStatus },
          { name: "Gemma AI Engine", status: true, label: "Healthy" },
          { name: "NVIDIA NIM", status: true, label: "Healthy" },
          { name: "OCR Pipeline", status: true, label: "Ready" },
          { name: "Job Scheduler", status: tel.failedJobs === 0, label: tel.failedJobs === 0 ? "Healthy" : `${tel.failedJobs} failures` },
          { name: "API Gateway", status: true, label: "Online" },
          { name: "Auth Service", status: true, label: "Online" },
          { name: "WebSocket Server", status: true, label: `${tel.activeSockets} active` },
        ].map((s) => (
          <div key={s.name} className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white">{s.name}</span>
            <span
              className="flex items-center gap-1.5 text-[11px] font-mono font-semibold"
              style={{ color: s.status ? "#22c55e" : "#ef4444" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: s.status ? "#22c55e" : "#ef4444" }} />
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const SECTION_RENDERERS: Record<string, () => React.ReactNode> = {
    overview: renderOverview,
    cpu: renderCpu,
    memory: renderMemory,
    network: renderNetwork,
    database: renderDatabase,
    workers: renderWorkers,
    ai: renderAI,
    storage: renderStorage,
    logs: renderLogs,
    health: renderHealth,
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="perf-backdrop"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Dialog */}
      <motion.div
        key="perf-dialog"
        ref={dialogRef}
        role="dialog"
        aria-label="Enterprise Performance Monitor"
        className={`fixed z-50 bg-[#0f0f0f]/95 border border-[#2a2a2a] shadow-2xl shadow-black/80 flex flex-col overflow-hidden transition-all duration-300 ${
          maximized
            ? "inset-2 rounded-2xl"
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl"
        }`}
        style={maximized ? {} : { width: "min(1100px, 90vw)", height: "min(700px, 90vh)" }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {/* ── Header bar ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2a2a2a] shrink-0 bg-[#0a0a0a]">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Enterprise Performance Monitor
            </h2>
            <p className="text-[10px] text-[#666666] mt-0.5">
              Real-time infrastructure telemetry and application diagnostics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#22c55e]/10 border border-[#22c55e]/20 text-[9px] font-bold text-[#22c55e] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              Live · 1s
            </span>
            <button
              onClick={() => setMaximized((p) => !p)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#2a2a2a] text-[#888888] hover:text-white transition-colors"
              title={maximized ? "Restore" : "Maximize"}
            >
              {maximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#2a2a2a] text-[#888888] hover:text-white transition-colors"
              title="Close (ESC)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Body: nav + content ─────────────────────────────── */}
        <div className="flex flex-1 min-h-0">
          {/* Left nav */}
          <nav className="w-44 shrink-0 border-r border-[#1e1e1e] bg-[#0a0a0a] py-3 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-[11px] font-medium transition-all text-left ${
                    active
                      ? "text-white bg-[#1a1a1a] border-r-2 border-[#faff69]"
                      : "text-[#666666] hover:text-white hover:bg-[#141414]"
                  }`}
                >
                  <span className={active ? "text-[#faff69]" : ""}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Content panel */}
          <div className="flex-1 overflow-y-auto p-5 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
              >
                {(SECTION_RENDERERS[activeSection] ?? renderOverview)()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-[#1e1e1e] bg-[#0a0a0a] px-5 py-2 flex items-center justify-between text-[9px] text-[#555555]">
          <div className="flex items-center gap-4">
            <span>Last Refresh: {new Date().toLocaleTimeString()}</span>
            <span>·</span>
            <span>Server Time: {new Date().toUTCString().slice(17, 25)} UTC</span>
            <span>·</span>
            <span>Build: v1.0.0</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-1.5 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold">PROD</span>
            <span>·</span>
            <span>DB Latency: {Math.round(tel.dbQueryLatency)}ms</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#22c55e] animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
