import math
from typing import List

def mean(values: List[float]) -> float:
    """
    Calculates the arithmetic mean. Returns 0.0 if the list is empty.
    """
    if not values:
        return 0.0
    return sum(values) / len(values)

def median(values: List[float]) -> float:
    """
    Calculates the median value of a numerical series.
    """
    if not values:
        return 0.0
    sorted_vals = sorted(values)
    n = len(sorted_vals)
    mid = n // 2
    if n % 2 == 0:
        return (sorted_vals[mid - 1] + sorted_vals[mid]) / 2.0
    return sorted_vals[mid]

def variance(values: List[float]) -> float:
    """
    Calculates the sample variance. Returns 0.0 if the list size is less than 2.
    """
    if len(values) < 2:
        return 0.0
    mu = mean(values)
    squared_diffs = [(x - mu) ** 2 for x in values]
    return sum(squared_diffs) / (len(values) - 1)

def standard_deviation(values: List[float]) -> float:
    """
    Calculates the standard deviation. Returns 0.0 if the variance is zero.
    """
    var = variance(values)
    return math.sqrt(var) if var > 0 else 0.0

def confidence_score(reliability_variance: float, data_age_days: int) -> float:
    """
    Calculates a deterministic forecast confidence score index from 0.0 to 1.0.
    Score penalizes high historical variance and stale input files.
    """
    # Base confidence
    score = 1.0
    
    # Penalize based on data age (stale data reduces confidence by 2.5% per day)
    age_penalty = max(0.0, data_age_days * 0.025)
    score -= age_penalty
    
    # Penalize based on normalized variance coefficient (coefficient of variation proxy)
    # High variance reduces score
    variance_penalty = min(0.3, reliability_variance * 0.0001)
    score -= variance_penalty
    
    # Clip between 0.05 and 1.0
    return max(0.05, min(1.0, score))
