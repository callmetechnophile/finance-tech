export const APP_METADATA = {
  name: "FORGE-PATH",
  tagline: "AI Financial Operating System",
  description: "Enterprise Financial Ingestion, Forecasting, and Solvency Workspace.",
  version: "1.0.0",
};

export const WORKSPACE_PRESETS = {
  defaultDensity: "loose" as const,
  defaultcurrency: "INR" as const,
  minBufferLimit: 280000, // ₹2,80,000 minimum cash threshold
};
