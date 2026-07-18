from dataclasses import dataclass, field
from typing import List

@dataclass
class ValidationReport:
    """
    Schema representing the consistency verification check outputs.
    """
    status: str  # PASS, WARNING, FAIL
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
