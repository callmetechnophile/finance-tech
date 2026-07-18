import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, format: "short" | "long" | "relative" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (format === "short") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  if (format === "long") {
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

export function getRiskColor(risk: string): string {
  const map: Record<string, string> = {
    Critical: "#EF4444",
    High: "#F59E0B",
    Medium: "#2563EB",
    Low: "#10B981",
  };
  return map[risk] ?? "#9CA3AF";
}

export function getPriorityClass(priority: string): string {
  const map: Record<string, string> = {
    Critical: "badge-critical",
    High: "badge-high",
    Medium: "badge-medium",
    Low: "badge-low",
  };
  return map[priority] ?? "badge-low";
}

export function getDaysOverdueLabel(days: number): string {
  if (days <= 0) return "Not due";
  if (days <= 7) return `${days}d overdue`;
  if (days <= 30) return `${days}d overdue`;
  return `${days}d overdue`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
