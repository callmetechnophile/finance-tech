// ─── Auth ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "viewer";
  company_id: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  currency: string;
}

export interface AuthState {
  user: User | null;
  company: Company | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardKPIs {
  current_cash: number;
  liquidity_score: number;
  cash_runway_days: number;
  outstanding_receivables: number;
  outstanding_payables: number;
  collection_rate: number;
  forecast_accuracy: number;
  monthly_revenue: number;
  monthly_expenses: number;
  cash_change_pct: number;
  liquidity_change_pct: number;
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  module?: string;
  action_label?: string;
  action_href?: string;
}

export interface ActivityItem {
  id: string;
  type: "payment" | "invoice" | "document" | "alert" | "collection" | "forecast";
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  status?: string;
}

// ─── Documents ───────────────────────────────────────────────────────────────
export type DocumentType = "csv" | "excel" | "pdf" | "image" | "ledger";
export type DocumentStatus = "uploaded" | "processing" | "validated" | "failed" | "extracted";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  status: DocumentStatus;
  uploaded_at: string;
  processed_at?: string;
  pages?: number;
  records_extracted?: number;
  validation_errors?: string[];
  preview_url?: string;
}

// ─── Cash Flow ───────────────────────────────────────────────────────────────
export type ForecastPeriod = "7d" | "30d" | "90d";

export interface ForecastData {
  period: ForecastPeriod;
  projected_inflow: number;
  projected_outflow: number;
  net_cash_flow: number;
  opening_balance: number;
  closing_balance: number;
  confidence: number;
  change_pct: number;
}

export interface ForecastPoint {
  date: string;
  revenue: number;
  expenses: number;
  balance: number;
  projection?: number;
}

export interface Anomaly {
  id: string;
  type: "spike" | "drop" | "unusual";
  description: string;
  impact: number;
  date: string;
  severity: "low" | "medium" | "high";
}

// ─── Liquidity ────────────────────────────────────────────────────────────────
export interface LiquidityMetrics {
  liquidity_score: number;
  working_capital: number;
  cash_buffer: number;
  burn_rate: number;
  runway_days: number;
  risk_level: "Low" | "Medium" | "High" | "Critical";
  current_ratio: number;
  quick_ratio: number;
}

export interface StressScenario {
  id: string;
  name: string;
  description: string;
  impact_amount: number;
  impact_pct: number;
  new_runway_days: number;
  severity: "low" | "medium" | "high" | "critical";
}

// ─── Collections ─────────────────────────────────────────────────────────────
export type InvoicePriority = "Critical" | "High" | "Medium" | "Low";
export type InvoiceStatus = "UNPAID" | "PARTIALLY_PAID" | "OVERDUE" | "DISPUTED" | "PAID";
export type RiskLevel = "Critical" | "High" | "Medium" | "Low";

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  outstanding_balance: number;
  due_date: string;
  issue_date: string;
  days_overdue: number;
  priority: InvoicePriority;
  priority_score: number;
  risk_level: RiskLevel;
  collection_probability: number;
  status: InvoiceStatus;
  reminder_count: number;
  last_reminder_date?: string;
  workflow_status: string;
  next_action: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avg_payment_delay: number;
  late_payment_percentage: number;
  reliability_score: number;
  total_outstanding: number;
  payment_history: PaymentHistoryItem[];
}

export interface PaymentHistoryItem {
  date: string;
  amount: number;
  days_late: number;
  status: string;
}

export interface CommunicationMessage {
  type: "email" | "sms" | "whatsapp";
  subject?: string;
  body: string;
  sent_at?: string;
  status: "generated" | "sent" | "delivered" | "failed";
}

export interface InvoiceDetail extends Invoice {
  customer_profile: CustomerProfile;
  gemma_explanation: string;
  communications: CommunicationMessage[];
  workflow_timeline: WorkflowEvent[];
  escalation_history: EscalationEvent[];
}

export interface WorkflowEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  note?: string;
}

export interface EscalationEvent {
  id: string;
  timestamp: string;
  level: number;
  description: string;
  escalated_to: string;
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export type PaymentAction = "PAY_NOW" | "DELAY" | "APPROVE" | "AUTO_PAY";

export interface Payment {
  id: string;
  vendor: string;
  amount: number;
  due_date: string;
  days_until_due: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  discount_available: number;
  discount_deadline?: string;
  penalty_risk: number;
  category: string;
  recommended_action: PaymentAction;
  status: "pending" | "approved" | "paid" | "delayed";
  cash_impact: number;
}

// ─── Copilot ──────────────────────────────────────────────────────────────────
export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  charts?: ChartData[];
  cards?: FinancialCard[];
}

export interface ChartData {
  type: "line" | "bar" | "area" | "pie";
  title: string;
  data: Record<string, number | string>[];
  keys: string[];
}

export interface FinancialCard {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "stable";
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface AnalyticsMetric {
  period: string;
  revenue: number;
  expenses: number;
  net_profit: number;
  collection_rate: number;
  payment_performance: number;
  liquidity_score: number;
  forecast_accuracy: number;
}
