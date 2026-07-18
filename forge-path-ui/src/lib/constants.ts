export const FORGE_PATH = {
  name: "FORGE-PATH",
  tagline: "AI Financial Copilot for Manufacturing SMEs",
  version: "1.0.0",
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
    timeout: 30000,
  },
} as const;

export const NAV_ITEMS = [
  {
    group: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/documents", label: "Documents", icon: "FileText" },
    ],
  },
  {
    group: "Modules",
    items: [
      { href: "/cashflow", label: "Cash Flow", icon: "TrendingUp" },
      { href: "/liquidity", label: "Liquidity", icon: "Droplets" },
      { href: "/collections", label: "Collections", icon: "CreditCard" },
      { href: "/payments", label: "Payments", icon: "Banknote" },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { href: "/copilot", label: "Financial Copilot", icon: "Bot" },
      { href: "/analytics", label: "Analytics", icon: "BarChart3" },
      { href: "/settings", label: "Settings", icon: "Settings" },
    ],
  },
] as const;

export const RISK_LEVELS = {
  Critical: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", class: "badge-critical" },
  High: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", class: "badge-high" },
  Medium: { color: "#2563EB", bg: "rgba(37,99,235,0.12)", class: "badge-medium" },
  Low: { color: "#10B981", bg: "rgba(16,185,129,0.12)", class: "badge-low" },
} as const;

export const CHART_COLORS = {
  primary: "#2563EB",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
  grid: "#1f2d44",
  text: "#6B7280",
} as const;

export const COPILOT_SUGGESTIONS = [
  "Can I buy another CNC Machine?",
  "Why is my liquidity dropping?",
  "Which customer impacts cash flow the most?",
  "Optimize this month's payments.",
  "Can I survive another 60 days?",
  "Which invoices should I prioritize?",
  "What is my current burn rate?",
  "Show me overdue invoices at risk.",
] as const;
