export const APP_METADATA = {
  name: "FORGE-PATH",
  tagline: "AI Financial Operating System",
  description: "Enterprise Financial Ingestion, Forecasting, and Solvency Workspace.",
  version: "1.0.0",
};

export const WORKSPACE_PRESETS = {
  defaultDensity: "loose" as const,
  defaultCurrency: "USD" as const,
  minBufferLimit: 280000, // $280k minimum cash threshold
};
