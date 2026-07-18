import re
from typing import List

class QueryRouter:
    """
    Classifies user queries into relevant modules (forecast, liquidity, collections, payments).
    Supports multi-module routing.
    """

    def route_query(self, query: str) -> List[str]:
        query_lower = query.lower()
        
        # Check broad multi-module questions first
        if any(w in query_lower for w in ["buy", "purchase", "afford", "financial health", "status"]):
            return ["FORECAST", "LIQUIDITY", "PAYMENTS", "COLLECTIONS"]

        modules = []

        # 1. Cash Flow / Forecast keywords
        if any(w in query_lower for w in ["forecast", "projection", "inflow", "outflow", "cash flow", "scenario"]):
            modules.append("FORECAST")

        # 2. Liquidity / Runway keywords
        if any(w in query_lower for w in ["liquidity", "runway", "survive", "burn rate", "cash buffer", "working capital", "cnc"]):
            modules.append("LIQUIDITY")

        # 3. Collection / Receivables keywords
        if any(w in query_lower for w in ["collection", "receivable", "customer", "invoice", "overdue", "remind", "follow-up"]):
            modules.append("COLLECTIONS")

        # 4. Treasury / Payments keywords
        if any(w in query_lower for w in ["pay", "payment", "vendor", "bill", "discount", "penalty", "disburse"]):
            modules.append("PAYMENTS")

        # Default to general if none match
        if not modules:
            return ["LIQUIDITY"]  # fallback default context

        return list(set(modules))
