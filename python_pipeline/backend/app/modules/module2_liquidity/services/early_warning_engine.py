import datetime
from typing import List
from app.modules.module2_liquidity.schemas.warning_schema import EarlyWarning

class EarlyWarningEngine:
    """
    Scans liquidity parameters to flag immediate risk alerts and recommended deadlines.
    """

    def generate_warnings(
        self,
        current_cash: float,
        buffer_days: float,
        wc_ratio: float,
        receivable_delay_ratio: float,
        payable_ratio: float,
        safety_buffer: float,
        has_concentration_risk: bool = False,
        gst_risk_present: bool = False
    ) -> List[EarlyWarning]:
        
        warnings: List[EarlyWarning] = []
        today = datetime.date.today()

        # 1. Runway Warning
        if buffer_days < 30.0:
            warnings.append(EarlyWarning(
                warning_id="WARN-RUNWAY-CRITICAL",
                severity="Critical",
                category="Runway",
                trigger_reason=f"Operating runway is only {buffer_days:.1f} days, below 30 days safety target.",
                recommended_deadline=(today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
                affected_metric="buffer_days",
                status="Active"
            ))
        elif buffer_days < 60.0:
            warnings.append(EarlyWarning(
                warning_id="WARN-RUNWAY-MONITOR",
                severity="Warning",
                category="Runway",
                trigger_reason=f"Operating runway is moderately low at {buffer_days:.1f} days.",
                recommended_deadline=(today + datetime.timedelta(days=10)).strftime("%Y-%m-%d"),
                affected_metric="buffer_days",
                status="Active"
            ))

        # 2. Safety Buffer alert
        if current_cash < safety_buffer:
            warnings.append(EarlyWarning(
                warning_id="WARN-BUFFER-BELOW-THRESHOLD",
                severity="Warning",
                category="Balance",
                trigger_reason=f"Current liquid cash is below the calculated safety reserve threshold of ${safety_buffer:,.2f}.",
                recommended_deadline=(today + datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
                affected_metric="current_cash",
                status="Active"
            ))

        # 3. Working Capital Warning
        if wc_ratio < 1.0:
            warnings.append(EarlyWarning(
                warning_id="WARN-WC-DEFICIT",
                severity="Critical",
                category="Working Capital",
                trigger_reason="Current liabilities exceed current assets (negative net working capital).",
                recommended_deadline=(today + datetime.timedelta(days=5)).strftime("%Y-%m-%d"),
                affected_metric="working_capital_ratio",
                status="Active"
            ))
        elif wc_ratio < 1.2:
            warnings.append(EarlyWarning(
                warning_id="WARN-WC-WEAK",
                severity="Warning",
                category="Working Capital",
                trigger_reason=f"Working capital ratio of {wc_ratio} is below the 1.2 safety limit.",
                recommended_deadline=(today + datetime.timedelta(days=14)).strftime("%Y-%m-%d"),
                affected_metric="working_capital_ratio",
                status="Active"
            ))

        # 4. Receivables Concentration Warning
        if has_concentration_risk:
            warnings.append(EarlyWarning(
                warning_id="WARN-CUST-CONCENTRATION",
                severity="Warning",
                category="Concentration",
                trigger_reason="High customer concentration risk detected; a single buyer holds >40% of outstanding balance.",
                recommended_deadline=(today + datetime.timedelta(days=30)).strftime("%Y-%m-%d"),
                affected_metric="receivables_concentration",
                status="Active"
            ))

        # 5. Accounts Payable Settlement clusters
        if payable_ratio > 0.80:
            warnings.append(EarlyWarning(
                warning_id="WARN-PAYABLES-CLUSTER",
                severity="Warning",
                category="AP Cluster",
                trigger_reason=f"Accounts payable obligations represent {payable_ratio:.1%} of liquid cash.",
                recommended_deadline=(today + datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
                affected_metric="payable_ratio",
                status="Active"
            ))

        # 6. GST Settlement Outflow Threat
        if gst_risk_present:
            warnings.append(EarlyWarning(
                warning_id="WARN-GST-THREAT",
                severity="Warning",
                category="GST",
                trigger_reason="GST payment simulation shows potential overdraft risk on settlement day.",
                recommended_deadline=(today + datetime.timedelta(days=15)).strftime("%Y-%m-%d"),
                affected_metric="projected_balance",
                status="Active"
            ))

        return warnings
