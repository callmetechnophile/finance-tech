import api from "@/lib/api-client";

export interface DashboardMetrics {
  cash_balance: string;
  receivables: string;
  payables: string;
  working_capital: string;
  liquidity_score: number;
  cash_runway_days: number;
  revenue_mtd: string;
  expenses_mtd: string;
}

export interface DashboardCharts {
  cash_flow_trend: Array<{ day: string; inflow: number; outflow: number; net: number }>;
  rev_exp_data: Array<{ day: string; revenue: number; expense: number }>;
  forecast_data: Array<{ day: string; actual: number | null; projected: number | null }>;
}

export interface CollectionsSummary {
  total_outstanding: string;
  pie_data: Array<{ name: string; value: number; color: string }>;
}

export interface TreasurySummary {
  total_payments_week: string;
  pending_approvals: number;
  scheduled_payments: number;
  wire_transfers: number;
}

export interface TopCustomerItem {
  name: string;
  amount: string;
  pct: string;
}

export interface RecentDocumentItem {
  doc: string;
  type: string;
  source: string;
  time: string;
  status: string;
  success: boolean;
}

export interface UpcomingPaymentItem {
  id?: string;
  vendor: string;
  type: string;
  amount: string;
  date: string;
}

export interface ExecutiveSummaryResponse {
  success: boolean;
  metrics: DashboardMetrics;
  charts: DashboardCharts;
  collections_summary: CollectionsSummary;
  treasury_summary: TreasurySummary;
  top_customers: TopCustomerItem[];
  recent_documents: RecentDocumentItem[];
  upcoming_payments: UpcomingPaymentItem[];
  ai_executive_brief: string;
  ai_insight: string;
}

export const dashboardService = {
  async getExecutiveSummary(): Promise<ExecutiveSummaryResponse> {
    try {
      const { data } = await api.get<ExecutiveSummaryResponse>("/api/v1/dashboard/summary");
      return data;
    } catch (err) {
      console.warn("Backend API call failed, returning clean empty state:", err);
      return {
        success: false,
        metrics: {
          cash_balance: "---",
          receivables: "---",
          payables: "---",
          working_capital: "---",
          liquidity_score: 0,
          cash_runway_days: 0,
          revenue_mtd: "---",
          expenses_mtd: "---",
        },
        charts: {
          cash_flow_trend: [],
          rev_exp_data: [],
          forecast_data: [],
        },
        collections_summary: {
          total_outstanding: "---",
          pie_data: [],
        },
        treasury_summary: {
          total_payments_week: "---",
          pending_approvals: 0,
          scheduled_payments: 0,
          wire_transfers: 0,
        },
        top_customers: [],
        recent_documents: [],
        upcoming_payments: [],
        ai_executive_brief: "No financial documents have been processed yet.",
        ai_insight: "No context available.",
      };
    }
  },
};
