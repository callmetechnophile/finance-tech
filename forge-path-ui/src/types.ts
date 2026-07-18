export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company_id: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  currency: string;
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

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
