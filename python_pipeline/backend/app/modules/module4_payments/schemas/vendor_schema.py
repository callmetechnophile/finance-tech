from dataclasses import dataclass, field
from typing import Optional, List

@dataclass
class VendorAnalytics:
    vendor_id: str
    vendor_name: str
    outstanding_payables: float
    average_spend: float
    vendor_dependency: float
    reliability_rate: float
    payment_delay_days: float
    is_critical: bool
    risk_level: str
    priority_level: str

    def model_dump(self):
        return self.__dict__

@dataclass
class VendorSummary:
    vendor_id: str
    vendor_name: str
    tax_id: Optional[str] = None
    address: Optional[str] = None
    analytics: Optional[VendorAnalytics] = None

    def model_dump(self):
        res = self.__dict__.copy()
        if self.analytics:
            res["analytics"] = self.analytics.model_dump()
        return res
