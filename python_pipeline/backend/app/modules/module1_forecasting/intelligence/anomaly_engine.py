from typing import List, Dict, Tuple
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.anomaly_schema import FinancialAnomaly
from app.modules.module1_forecasting.utils.statistics import mean, standard_deviation

class AnomalyEngine:
    """
    Detects abnormal financial operations (duplicate bills, expense spikes) using statistical thresholds.
    """

    def detect_anomalies(self, features: ForecastFeatures) -> List[FinancialAnomaly]:
        anomalies: List[FinancialAnomaly] = []

        # 1. Detect duplicate vendor bills (same vendor + same amount in active payables)
        seen_payables: Dict[Tuple[str, float], List[str]] = {}
        for p in features.payables:
            key = (p.get("partner_id", "Unknown"), p["total_amount"])
            seen_payables.setdefault(key, []).append(p["invoice_number"])
            
        for key, inv_list in seen_payables.items():
            if len(inv_list) > 1:
                vendor, amount = key
                anomalies.append(FinancialAnomaly(
                    reason="Potential Duplicate Payment obligation detected",
                    severity="Warning",
                    impact=amount,
                    affected_transaction=", ".join(inv_list)
                ))

        # 2. Detect outlying invoice values (3x larger than average)
        rec_amounts = [r["total_amount"] for r in features.receivables]
        if len(rec_amounts) >= 3:
            avg_rec = mean(rec_amounts)
            for r in features.receivables:
                amount = r["total_amount"]
                if amount > 3.0 * avg_rec:
                    anomalies.append(FinancialAnomaly(
                        reason="Outlying Customer Invoice (exceeds 3x average)",
                        severity="Info",
                        impact=amount,
                        affected_transaction=r["invoice_number"]
                    ))

        pay_amounts = [p["total_amount"] for p in features.payables]
        if len(pay_amounts) >= 3:
            avg_pay = mean(pay_amounts)
            for p in features.payables:
                amount = p["total_amount"]
                if amount > 3.0 * avg_pay:
                    anomalies.append(FinancialAnomaly(
                        reason="Outlying Vendor Bill (exceeds 3x average)",
                        severity="Info",
                        impact=amount,
                        affected_transaction=p["invoice_number"]
                    ))

        # 3. Detect sudden historical daily expense spikes (outflow > mean + 2*stddev)
        outflow_vals = list(features.daily_cash_outflow.values())
        if len(outflow_vals) >= 5:
            avg_outflow = mean(outflow_vals)
            std_outflow = standard_deviation(outflow_vals)
            
            # Threshold: mean + 1.5 * std_dev to avoid masking in small samples
            threshold = avg_outflow + (1.5 * std_outflow)
            
            for date_str, val in features.daily_cash_outflow.items():
                if val > threshold and val > 5000.0:
                    anomalies.append(FinancialAnomaly(
                        reason="Abnormal daily expense spike observed in history",
                        severity="Warning",
                        impact=val,
                        affected_transaction=f"Outflow on {date_str}"
                    ))
                    
        return anomalies
