export interface Command {
  id: string;
  label: string;
  category: "Navigation" | "Workspace" | "System";
  shortcut?: string;
  path?: string;
  action?: () => void;
}

export const getRegistryCommands = (): Command[] => [
  { id: "open-dashboard", label: "Open Dashboard", category: "Navigation", shortcut: "G D", path: "/dashboard" },
  { id: "open-documents", label: "Open Document Registry", category: "Navigation", shortcut: "G O", path: "/documents" },
  { id: "open-forecast", label: "Open Cash Flow Forecast", category: "Navigation", shortcut: "G F", path: "/forecast" },
  { id: "open-liquidity", label: "Open Liquidity Command", category: "Navigation", shortcut: "G L", path: "/liquidity" },
  { id: "open-collections", label: "Open Collections Workspace", category: "Navigation", shortcut: "G C", path: "/collections" },
  { id: "open-treasury", label: "Open Treasury Workspace", category: "Navigation", shortcut: "G T", path: "/treasury" },
  { id: "open-copilot", label: "Open AI Financial Copilot", category: "Navigation", shortcut: "G P", path: "/copilot" },
  { id: "open-reports", label: "Open Report Center", category: "Navigation", shortcut: "G R", path: "/reports" },
  { id: "open-analytics", label: "Open Business Analytics", category: "Navigation", path: "/analytics" },
  { id: "open-settings", label: "Open Settings", category: "Navigation", path: "/settings" },
  { id: "open-admin", label: "Open Admin Console", category: "Navigation", path: "/admin" },
  
  // Quick Actions Workspace overrides
  { id: "run-forecast", label: "Run Fresh Cash Forecast", category: "Workspace", shortcut: "Alt+F" },
  { id: "run-liquidity", label: "Run Liquidity Stress Test", category: "Workspace", shortcut: "Alt+L" },
  { id: "run-treasury", label: "Run AP Optimization", category: "Workspace", shortcut: "Alt+T" },
  { id: "export-report", label: "Export Monthly Financial Review", category: "Workspace" },
  
  // System overrides
  { id: "toggle-theme", label: "Toggle Dark/Light Theme", category: "System", shortcut: "Ctrl+T" },
  { id: "toggle-density", label: "Toggle Display Density (Compact/Loose)", category: "System", shortcut: "Ctrl+D" },
];
