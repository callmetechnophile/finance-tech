from typing import List

def moving_average(series: List[float], window: int) -> List[float]:
    """
    Computes a simple moving average timeline series.
    If the series is smaller than the window, calculates using available preceding items.
    """
    if not series:
        return []
    
    result = []
    for i in range(len(series)):
        start_idx = max(0, i - window + 1)
        sub_series = series[start_idx : i + 1]
        result.append(sum(sub_series) / len(sub_series))
    return result

def rolling_average(series: List[float], window: int) -> float:
    """
    Calculates the average of the last 'window' days in the series.
    Returns 0.0 if the series is empty.
    """
    if not series:
        return 0.0
    sub_series = series[-window:] if len(series) >= window else series
    return sum(sub_series) / len(sub_series)

def project_cash_balance(yesterday_balance: float, expected_inflow: float, expected_outflow: float) -> float:
    """
    Applies the cash flow balance iteration formula:
    Projected Balance = Yesterday Balance + Inflow - Outflow
    """
    return yesterday_balance + expected_inflow - expected_outflow

def calculate_cash_buffer(projected_balances: List[float]) -> float:
    """
    Calculates the safety cash buffer, representing the minimum balance observed in the projected timeline.
    Returns 0.0 if empty.
    """
    if not projected_balances:
        return 0.0
    return min(projected_balances)

def calculate_daily_inflow(fixed_inflow: float, variable_inflow: float) -> float:
    """
    Aggregates fixed (contracted) and variable historical daily inflow items.
    """
    return fixed_inflow + variable_inflow

def calculate_daily_outflow(fixed_outflow: float, variable_outflow: float) -> float:
    """
    Aggregates fixed (payroll/commitments) and variable historical daily outflow items.
    """
    return fixed_outflow + variable_outflow
